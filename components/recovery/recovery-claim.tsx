import React, { useState } from 'react';
import { useGlobalState } from '@lib/hooks/global-state-context';
import useWallet from '@lib/hooks/wallet-balance-provider';
import { Pc, PostConditionMode } from "@stacks/transactions";
import Image from 'next/image';
import redPill from '@public/sip9/pills/red-pill.gif';
import bluePill from '@public/sip9/pills/blue-pill.gif';
import redPillFloating from '@public/sip9/pills/red-pill-floating.gif';
import bluePillFloating from '@public/sip9/pills/blue-pill-floating.gif';
import { useConnect } from '@stacks/connect-react';
import { network } from '@components/stacks-session/connect';

const RecoveryClaim = () => {
    const { charismaClaims } = useGlobalState();
    const { wallet } = useWallet();
    const { stxAddress } = useGlobalState();
    const { doContractCall } = useConnect();

    function makeChoice(choice: boolean) {
        if (stxAddress) {
            const postConditions = [] as any[]
            if (!charismaClaims.hasFreeClaim && !charismaClaims.hasClaimed) {
                postConditions.push(Pc.principal(stxAddress).willSendEq(100000000).ustx())
            }
            doContractCall({
                network: network,
                contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
                contractName: choice ? 'red-pill-nft' : 'blue-pill-nft',
                functionName: "claim",
                functionArgs: [],
                postConditionMode: PostConditionMode.Deny,
                postConditions,
            });
        }
    }

    const renderClaimStatus = () => {
        if (charismaClaims.hasClaimed) {
            return (
                <div className='text-center'>
                    <div className='text-xl text-yellow-100'>
                        You have already made a claim. Your choice is final.
                    </div>
                    <div className='mt-2 text-sm text-gray-400'>
                        This Charisma NFT is Soulbound and cannot be traded.
                    </div>
                </div>
            );
        } else if (charismaClaims.hasFreeClaim) {
            return (
                <div className='text-center'>
                    <div className='text-xl text-green-100'>
                        You have a free claim available. Choose wisely...
                    </div>
                    <div className='mt-2 text-sm text-gray-400'>
                        Select a Charisma NFT. You can only claim one, and your choice is permanent.
                    </div>
                </div>
            );
        } else {
            return (
                <div className='text-center'>
                    <div className='text-xl'>
                        Select a Charisma NFT...
                    </div>
                    <div className='mt-2 text-sm leading-3 text-gray-400'>
                        This Charisma NFT is Soulbound (cannot be traded). You can only claim one NFT per address.
                    </div>
                    <div className='text-sm text-gray-400'>
                        We didn't find this wallet address on the mintpass– but you can still claim one for 100 STX.
                    </div>
                </div>
            );
        }
    };

    const renderPills = () => {
        if (charismaClaims.hasClaimed) {
            // Show only the claimed pill
            const claimedPill = wallet.redPilled ? redPillFloating : bluePillFloating;
            const altText = wallet.redPilled ? 'Red Pill' : 'Blue Pill';
            return (
                <div className='flex justify-center w-full'>
                    <Image src={claimedPill} alt={altText} width={250} height={250} className='transition-all -translate-y-12 cursor-help' title={wallet.redPilled ? 'The Red Pill NFT enables you to wrap your earned rewards into Charisma tokens.' : 'The Blue Pill NFT offers your early access to Charisma Recovery token redemptions.'} />
                </div>
            );
        } else {
            // Show both pills if not claimed
            return (
                <>
                    <div className='flex flex-col items-center w-full space-y-4'>
                        <Image
                            onClick={() => !charismaClaims.hasClaimed && makeChoice(true)}
                            src={redPillFloating}
                            alt='Red Pill'
                            width={250}
                            height={250}
                            className={`transition-all ${!charismaClaims.hasClaimed ? 'cursor-pointer hover:scale-125 hover:-translate-y-4' : ''}`}
                            title={'The Red Pill NFT enables you to wrap your earned rewards into Charisma tokens.'}
                        />
                    </div>
                    <div className='flex flex-col items-center w-full space-y-4'>
                        <Image
                            onClick={() => !charismaClaims.hasClaimed && makeChoice(false)}
                            src={bluePillFloating}
                            alt='Blue Pill'
                            width={250}
                            height={250}
                            className={`transition-all ${!charismaClaims.hasClaimed ? 'cursor-pointer hover:scale-125 hover:-translate-y-4' : ''}`}
                            title={'The Blue Pill NFT offers your early access to Charisma Recovery token redemptions.'}
                        />
                    </div>
                </>
            );
        }
    };

    return (
        <div className='space-y-8'>
            {renderClaimStatus()}
            <div className='flex w-full p-24 rounded-full bg-[var(--sidebar)] border-[var(--accents-7)] border-b-8'>
                {renderPills()}
            </div>
        </div>
    );
};

export default RecoveryClaim;