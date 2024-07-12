
import { SkipNavContent } from '@reach/skip-nav';

import Page from '@components/page';
import { META_DESCRIPTION } from '@lib/constants';
import Layout from '@components/layout';
import { Card } from '@components/ui/card';

import React, { useEffect, useState } from "react"
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet } from "@stacks/network";
import {
    AnchorMode,
    Pc,
    PostConditionMode,
    boolCV,
    noneCV,
    principalCV,
    uintCV,
} from "@stacks/transactions";
import ConnectWallet, { userSession } from "@components/stacks-session/connect";
import { Button } from "@components/ui/button";

export default function App() {
    const meta = {
        title: 'Charisma | SFT Test',
        description: META_DESCRIPTION,
    };

    return (
        <Page meta={meta} fullViewport>
            <SkipNavContent />
            <Layout>
                <div className="m-2 sm:container sm:mx-auto sm:py-10 md:max-w-2xl">

                    <Card className='p-0 overflow-hidden bg-black text-primary-foreground border-accent-foreground rounded-xl'>
                        <div className='m-2'>
                            <div className='space-y-1'>
                                <SftTest />
                            </div>
                        </div>
                    </Card>
                </div>
            </Layout>
        </Page>
    );
}

const SftTest = () => {
    const { doContractCall } = useConnect();

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true) }, []);

    const sender = userSession.isUserSignedIn() && userSession.loadUserData().profile.stxAddress.mainnet

    function unwrap() {
        doContractCall({
            network: new StacksMainnet(),
            anchorMode: AnchorMode.Any,
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: 'sft-test-3',
            functionName: "unwrap",
            functionArgs: [uintCV(1), principalCV(sender), principalCV('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-icc')],
            postConditionMode: PostConditionMode.Allow,
            postConditions: [],
            onFinish: (data) => {
                console.log("onFinish:", data);
            },
            onCancel: () => {
                console.log("onCancel:", "Transaction was canceled");
            },
        });
    }

    function wrap() {
        doContractCall({
            network: new StacksMainnet(),
            anchorMode: AnchorMode.Any,
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: 'sft-test-3',
            functionName: "wrap",
            functionArgs: [uintCV(1), principalCV('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-icc')],
            postConditionMode: PostConditionMode.Allow,
            postConditions: [],
            onFinish: (data) => {
                console.log("onFinish:", data);
            },
            onCancel: () => {
                console.log("onCancel:", "Transaction was canceled");
            },
        });
    }

    function add() {
        doContractCall({
            network: new StacksMainnet(),
            anchorMode: AnchorMode.Any,
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: 'sft-test-3',
            functionName: "set-whitelisted",
            functionArgs: [principalCV('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-icc'), boolCV(true)],
            postConditionMode: PostConditionMode.Allow,
            postConditions: [],
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
        <>
            <Button className='text-md w-full hover:bg-[#ffffffee] hover:text-primary' onClick={add}>Add</Button>
            <Button className='text-md w-full hover:bg-[#ffffffee] hover:text-primary' onClick={wrap}>Wrap</Button>
            <Button className='text-md w-full hover:bg-[#ffffffee] hover:text-primary' onClick={unwrap}>Unwrap</Button>
        </>
    );
};