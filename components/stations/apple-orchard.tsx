import { SkipNavContent } from '@reach/skip-nav';
import Page from '@components/page';
import { META_DESCRIPTION } from '@lib/constants';
import Layout from '@components/layout';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import {
    blocksApi,
    getBlockCounter,
    getBlocksUntilUnlocked,
    getDecimals,
    getIsUnlocked,
    getSymbol,
    getTokenURI,
    getTotalSupply
} from '@lib/stacks-api';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import millify from 'millify';
import { Link1Icon } from '@radix-ui/react-icons';
import useWallet from '@lib/hooks/use-wallet-balances';
import LiquidityControls from '@components/liquidity/controls';
import velarApi from '@lib/velar-api';
import { uniqBy } from 'lodash';
import { useConnect } from '@stacks/connect-react';
import { AnchorMode, callReadOnlyFunction, cvToJSON, Pc, PostConditionMode, principalCV, uintCV } from '@stacks/transactions';
import { StacksMainnet } from "@stacks/network";
import { userSession } from '@components/stacks-session/connect';
import numeral from 'numeral';
import farmersImg from '@public/creatures/img/farmers.png'
import tranquilOrchard from '@public/stations/apple-orchard.png'
import { getGlobalState } from '@lib/db-providers/kv';
import { getCreatureData } from '@lib/user-api';

export default function AppleOrchardCard({ data }: any) {

    const [descriptionVisible, setDescriptionVisible] = useState(false);

    useEffect(() => {
        setDescriptionVisible(true);
    }, []);

    const { doContractCall } = useConnect();
    const [farmers, setFarmers] = useState(0)
    const [power, setPower] = useState(0)

    const [claimableAmount, setClaimableAmount] = useState(0)

    const sender = userSession.isUserSignedIn() && userSession.loadUserData().profile.stxAddress.mainnet

    useEffect(() => {
        callReadOnlyFunction({
            network: new StacksMainnet(),
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: 'creatures',
            functionName: "get-claimable-amount",
            functionArgs: [uintCV(1)],
            senderAddress: sender
        }).then(response => setClaimableAmount(Number(cvToJSON(response).value.value) / Math.pow(10, data.decimals)))

    }, [])

    useEffect(() => {
        getCreatureData(1).then(response => setPower(response.power))
    }, [])

    useEffect(() => {
        sender && callReadOnlyFunction({
            network: new StacksMainnet(),
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: 'creatures',
            functionName: "get-balance",
            functionArgs: [uintCV(1), principalCV(sender)],
            senderAddress: sender
        }).then(response => setFarmers(Number(cvToJSON(response).value.value)))

    }, [sender])


    function harvest() {
        doContractCall({
            network: new StacksMainnet(),
            anchorMode: AnchorMode.Any,
            contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
            contractName: 'apple-orchard',
            functionName: "harvest",
            functionArgs: [uintCV(1)],
            postConditionMode: PostConditionMode.Deny,
            postConditions: [Pc.principal('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.apple-orchard').willSendGte(1).ft("SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.fuji-apples", "index-token")],
            onFinish: (data) => {
                console.log("onFinish:", data);
            },
            onCancel: () => {
                console.log("onCancel:", "Transaction was canceled");
            },
        });
    }
    return (
        <Card className="h-80 flex flex-col bg-black text-primary-foreground border-accent-foreground p-0 relative overflow-hidden rounded-md group/card w-full max-w-2xl opacity-[0.99] shadow-black shadow-2xl">
            <CardHeader className="z-20 p-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="z-30 text-sm font-semibold">
                        Apple Orchard
                    </CardTitle>
                    <div className="flex space-x-3 items-center">
                        <div className="z-30 bg-background border border-primary/40 rounded-full px-2">
                            $ ??? / day
                        </div>
                        <div className="text-lg">{numeral(farmers).format('(0a)')}</div>
                        <ActiveFarmIndicator
                            active={true}
                            blocksUntilUnlock={0}
                        />
                    </div>
                </div>
                <CardDescription className="z-30 text-xs sm:text-sm font-fine text-secondary/40">
                    This is a bonus farm from the orginal farming algorithm.
                    Rewards are innconsistant so just claim what you can, there are no guarantees on the amount that will be available.
                    After the rewards are depleted, this farm will be removed.
                </CardDescription>
                <div className="z-20">
                    {/* <CardTitle className="z-30 mt-2 text-xl font-semibold">Yield Farming</CardTitle> */}
                    {descriptionVisible && (
                        <Link href={`https://explorer.hiro.so/txid/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.apple-orchard?chain=mainnet`} target='_blank'>
                            <CardDescription className="z-30 mb-4 text-sm font-fine text-foreground flex items-end space-x-1">
                                <div>Apple Orchard</div> <Link1Icon className="mb-0.5" />
                            </CardDescription>
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardFooter className="z-20 flex justify-between pb-4 px-4 items-end mt-auto flex-1">
                {farmers > 0 &&
                    <Button disabled={claimableAmount === 0} size={'sm'} className={`z-30 w-full ${claimableAmount === 0 && "animate-pulse"}`} onClick={harvest}>
                        {claimableAmount === 0 ? `No Fuji Apples to harvest` : `Harvest ${numeral(claimableAmount * farmers * 2).format('(0a)')} Fuji Apples`}
                    </Button>
                }
            </CardFooter>
            <Image
                src={farmersImg}
                width={800}
                height={1600}
                alt={'quest-background-image'}
                className={cn(
                    'object-cover',
                    'lg:aspect-square',
                    'sm:aspect-[2/3]',
                    'aspect-[1/2]',
                    'opacity-10',
                    'flex',
                    'z-10',
                    'absolute',
                    'inset-0',
                    'pointer-events-none'
                )}
            />
        </Card>
    );
}

const ActiveFarmIndicator = ({
    active,
    blocksUntilUnlock
}: {
    active: boolean;
    blocksUntilUnlock: number;
}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className={`pb-1 rounded-full ${active ? 'animate-pulse' : 'bg-yellow-500'}`}>🧑‍🌾</div>
                </TooltipTrigger>
                <TooltipContent
                    className={`overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}
                >
                    {active
                        ? 'Creatures are working the farm'
                        : `No creatures availabe to work the farm.`
                    }
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

