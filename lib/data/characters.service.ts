import { kv } from '@vercel/kv';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  contractPrincipalCV,
  stringAsciiCV
} from '@stacks/transactions';
import { generateWallet } from '@stacks/wallet-sdk';
import { decryptMnemonic, encryptMnemonic } from '@stacks/encryption';
import { network } from '@components/stacks-session/connect';

const OWNER_WALLET_PREFIX = 'owner-wallet:';

type Wallet = {
  ownerAddress: string;
  encryptedSeed: string;
  accountIndex: number;
  created: number;
};

export type CharacterTransaction = {
  ownerAddress: string;
  interaction: string;
  action: string;
  rulebook: string; // Contract principal for the rulebook
  metadata?: Record<string, any>;
};

export const decryptSeedPhrase = (encryptedSeedB64: string) => {
  return decryptMnemonic(
    new Uint8Array(Buffer.from(encryptedSeedB64, 'base64')),
    String(process.env.ENCRYPTION_KEY)
  );
};

export const encryptSeedPhrase = async (seedPhrase: string) => {
  return Buffer.from(
    await encryptMnemonic(seedPhrase, String(process.env.ENCRYPTION_KEY))
  ).toString('base64');
};

export class CharacterTransactionService {
  async executeTransaction(tx: CharacterTransaction) {
    const teamKey = `${OWNER_WALLET_PREFIX}${tx.ownerAddress}`;
    const team = (await kv.hgetall(teamKey)) as any;

    if (!team) {
      throw new Error('Character not found');
    }

    // Get wallet info
    const walletKey = `${OWNER_WALLET_PREFIX}${team.ownerAddress}`;
    const walletData = (await kv.hgetall(walletKey)) as Wallet;

    if (!walletData) {
      throw new Error('Wallet not found');
    }

    const secretKey = await decryptSeedPhrase(walletData.encryptedSeed);
    const wallet = await generateWallet({
      secretKey: secretKey,
      password: String(process.env.ENCRYPTION_KEY)
    });
    const account = wallet.accounts[0];
    const [rulebookAddress, rulebookName] = tx.rulebook.split('.');

    const txOptions = {
      contractAddress: tx.interaction.split('.')[0],
      contractName: tx.interaction.split('.')[1],
      functionName: 'execute',
      functionArgs: [contractPrincipalCV(rulebookAddress, rulebookName), stringAsciiCV(tx.action)],
      senderKey: account.stxPrivateKey,
      network: network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction({ transaction, network });

    // Update last run timestamp
    await kv.hset(teamKey, {
      lastRun: Date.now(),
      lastTx: {
        txid: broadcastResponse.txid,
        timestamp: Date.now()
      },
      lastResponse: JSON.stringify(broadcastResponse)
    });
    return broadcastResponse;
  }
  async getStxPrivateKey(ownerAddress: string): Promise<string> {
    const walletKey = `${OWNER_WALLET_PREFIX}${ownerAddress}`;
    const walletData = (await kv.hgetall(walletKey)) as Wallet;

    if (!walletData) {
      throw new Error('Wallet not found');
    }

    const secretKey = await decryptSeedPhrase(walletData.encryptedSeed);
    const wallet = await generateWallet({
      secretKey: secretKey,
      password: String(process.env.ENCRYPTION_KEY)
    });

    return wallet.accounts[0].stxPrivateKey;
  }
}
