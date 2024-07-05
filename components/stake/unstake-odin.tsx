import React, { useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import {
  AnchorMode,
  Pc,
  PostConditionMode,
  uintCV,
} from "@stacks/transactions";
import ConnectWallet, { userSession } from "../stacks-session/connect";
import { Button } from "@components/ui/button";
import { toInteger } from "lodash";
import millify from "millify";
import { getStakedTokenExchangeRate } from "@lib/stacks-api";

interface UnstakeOdinButtonProps {
  tokens: string;
}

const UnstakeOdinButton: React.FC<UnstakeOdinButtonProps> = ({ tokens }) => {
  const { doContractCall } = useConnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  const tokens6Dec = Number(tokens) * 1000000

  async function unstake() {
    const sender = userSession.loadUserData().profile.stxAddress.mainnet;
    const value = await getStakedTokenExchangeRate('liquid-staked-odin')
    const tokensOutMin = tokens6Dec * value / 1000000
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: "liquid-staked-odin",
      functionName: "unstake",
      functionArgs: [uintCV(tokens6Dec)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        Pc.principal(sender).willSendEq(tokens6Dec).ft("SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-odin", "liquid-staked-odin"),
        Pc.principal('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-odin').willSendGte(tokensOutMin).ft("SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn", 'odin'),
      ],
      onFinish: (data) => {
        console.log("onFinish:", data);
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  if (!mounted || !userSession.isUserSignedIn()) {
    return <ConnectWallet />;
  }

  return (
    <Button
      variant={'ghost'}
      className='text-md w-full hover:bg-[#ffffffee] hover:text-primary'
      onClick={unstake}
      disabled={tokens6Dec <= 0}>
      Unstake {tokens && tokens6Dec > 0 ? millify(Number(tokens)) : 0} sODIN
    </Button>
  );
};

export default UnstakeOdinButton;
