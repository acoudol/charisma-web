import { SkipNavContent } from '@reach/skip-nav';
import Page from '@components/page';
import { META_DESCRIPTION } from '@lib/constants';
import Layout from '@components/layout';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { blocksApi, getBlockCounter, getDecimals, getDeployedIndexes, getIsUnlocked, getSymbol, getTokenPrices, getTokenURI, getTotalSupply } from '@lib/stacks-api';
import { GetServerSideProps, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';
import Link from 'next/link';
import { motion } from "framer-motion"
import millify from 'millify';
import { Slider } from '@components/ui/slider';
import AddLiquidityToIndex from '@components/craft/add-liquidity';
import RemoveLiquidityFromIndex from '@components/salvage/remove-liquidity';
import { Link1Icon } from '@radix-ui/react-icons';
import { TimerOffIcon } from 'lucide-react';

export default function IndexDetailPage({ data }: Props) {
    const meta = {
        title: `Charisma | ${data.metadata.name}`,
        description: META_DESCRIPTION,
        image: data.metadata.background
    };

    const [descriptionVisible, setDescriptionVisible] = useState(false)
    const [tvl, setTVL] = useState(0)

    const [factor, setFactor] = useState(2)


    const tokenAddressList = data.metadata.contains.map((token: any) => token.address)

    const totalSupply = data.totalSupply / Math.pow(10, data.decimals)

    useEffect(() => {
        try {
            setDescriptionVisible(true)
            getTokenPrices().then((response: any) => {
                const baseTokensPriceData = response.message.filter((token: any) => tokenAddressList.includes(token.contractAddress))
                // loop for each matching token
                const tokenTVL = baseTokensPriceData.map((baseToken: any) => {
                    const tokenIndex = tokenAddressList.indexOf(baseToken.contractAddress)
                    const tokenWeight = data.metadata.contains[tokenIndex].weight
                    const tokenPrice = baseToken.price
                    return totalSupply * tokenWeight * tokenPrice
                })
                setTVL(tokenTVL.reduce((a: number, b: number) => a + b, 0))
            })

        } catch (error) {
            console.error(error)
        }
    }, [])

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const tokensRequested = Math.pow(10, factor)
    const tokensRequired = data.metadata.contains.map((token: any) => tokensRequested * token.weight);
    console.log(data.blocksUntilUnlock)

    return (
        <Page meta={meta} fullViewport>
            <SkipNavContent />
            <Layout>
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="m-2 sm:container sm:mx-auto sm:py-10 md:max-w-2xl lg:max-w-3xl">

                    <Card className='bg-black text-primary-foreground border-accent-foreground p-0 relative overflow-hidden rounded-md group/card w-full max-w-2xl opacity-[0.99] shadow-black shadow-2xl'>
                        <CardHeader className='z-20 p-4'>
                            <div className='flex items-center justify-between'>
                                <CardTitle className='z-30 text-lg sm:text-xl font-semibold'>Index: {data.symbol}</CardTitle>
                                <div className='flex space-x-4'>
                                    <div className='text-lg'>
                                        ${millify(tvl)} TVL
                                    </div>
                                    <ActiveRecipeIndicator active={data.isRemoveLiquidityUnlocked} blocksUntilUnlock={data.blocksUntilUnlock} />
                                </div>
                            </div>
                            <CardDescription className='z-30 text-sm sm:text-md font-fine text-foreground'>{data.metadata.description}</CardDescription>
                            <div className='z-20'>
                                <CardTitle className='z-30 mt-2 text-xl font-semibold'>Mintable Token</CardTitle>
                                {descriptionVisible && <Link href={`https://stxscan.co/accounts/${data.address}`}><CardDescription className='z-30 mb-4 text-sm font-fine text-foreground flex items-end space-x-1'><div>{data.metadata.name}</div> <Link1Icon className='mb-0.5' /></CardDescription></Link>}
                                <div className='grid grid-cols-4 gap-4 lg:grid-cols-6'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className='relative'>
                                                    <Image alt={data.metadata.name} src={data.metadata.image} width={100} height={100} className='z-30 w-full border rounded-full' />
                                                    <div className='absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-sm bg-accent text-accent-foreground'>{millify(tokensRequested)}</div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                                                {Math.floor(tokensRequested)} {data.metadata.symbol}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='z-20 p-0'>
                            <div className='z-30 p-4'>
                                <div className='z-20 min-h-[136px]'>
                                    <div className='z-30 text-xl font-semibold'>Base Tokens</div>
                                    <CardDescription className='z-30 mb-4 text-sm font-fine text-foreground'>These tokens will be staked to mint {data.symbol} index tokens</CardDescription>
                                    <div className='z-20 grid grid-cols-4 gap-4 lg:grid-cols-6'>
                                        {data.baseTokens.map((token: any, k: any) => (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <div className='z-20 relative'>
                                                            <Image alt={token.name} src={token.image} width={100} height={100} className='z-30 w-full border rounded-full' />
                                                            <div className='absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-sm bg-accent text-accent-foreground'>{millify(tokensRequired[k])}</div>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                                                        {Math.floor(tokensRequired[k])} {data.metadata.contains[k].symbol}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="z-20 flex justify-between p-4 items-end">
                            <Link href='/crafting'><Button variant="ghost" className='z-30'>Back</Button></Link>
                            {descriptionVisible && <div className='flex flex-col'>
                                <Slider defaultValue={[factor]} min={1} max={5} step={0.1} className='w-full p-4' onValueChange={(v: any) => setFactor(v[0])} />
                                <div className='z-20 flex items-center space-x-1'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><AddLiquidityToIndex amount={tokensRequested} address={data.address} metadata={data.metadata} /></TooltipTrigger>
                                            <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                                                Minting {millify(tokensRequested)} {data.symbol} requires {millify(tokensRequired[0])} {data.metadata.contains[0].symbol} and {millify(tokensRequired[1])} sCHA.
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {data.isRemoveLiquidityUnlocked ?
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger><RemoveLiquidityFromIndex amount={tokensRequested} address={data.address} metadata={data.metadata} /></TooltipTrigger>
                                                <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                                                    Burning {millify(tokensRequested)} {data.symbol} returns {millify(tokensRequired[0])} {data.metadata.contains[0].symbol} and {millify(tokensRequired[1])} sCHA back to you.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider> :
                                        <div className='text-secondary/50 text-sm flex items-center space-x-2'><div>Locked ({data.blocksUntilUnlock} blocks)</div> <TimerOffIcon size={14} className='mt-0.5' /> </div>
                                    }
                                </div></div>}

                        </CardFooter>
                        <Image
                            src={data.metadata.background}
                            width={800}
                            height={1600}
                            alt={'quest-background-image'}
                            className={cn("object-cover", "lg:aspect-square", "sm:aspect-[2/3]", 'aspect-[1/2]', 'opacity-10', 'flex', 'z-10', 'absolute', 'inset-0', 'pointer-events-none')}
                        />
                        <div className='absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white to-black opacity-10' />
                    </Card>

                </motion.div>
            </Layout>
        </Page>
    );
}

type Props = {
    data: any;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }: any) => {

    try {
        const contractName = params?.id.split('.')[1]

        const metadata = await getTokenURI(params?.id as string)
        const supply = await getTotalSupply(contractName)
        const symbol = await getSymbol(params?.id as string)
        const decimals = await getDecimals(params?.id as string)

        const isRemoveLiquidityUnlocked = await getIsUnlocked(params?.id as string)
        const blockCounter = await getBlockCounter(params?.id as string)
        const { results } = await blocksApi.getBlockList({ limit: 1 })

        const blocksUntilUnlock = 155550 + blockCounter - results[0].height

        const baseTokens = await Promise.all(metadata.contains.map(async (token: any) => {
            const tokenMetadata = await getTokenURI(token.address)
            return tokenMetadata;
        }));

        return {
            props: {
                data: {
                    address: params?.id,
                    metadata: metadata,
                    totalSupply: Number(supply.value.value),
                    symbol: symbol,
                    baseTokens: baseTokens,
                    decimals: decimals,
                    isRemoveLiquidityUnlocked,
                    blocksUntilUnlock
                }
            },
        };

    } catch (error) {
        console.log(error)
        return {
            props: {
                data: {}
            },
        }
    }
};

const ActiveRecipeIndicator = ({ active, blocksUntilUnlock }: { active: boolean, blocksUntilUnlock: number }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className='relative w-4 h-4'>
                        <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${active ? 'bg-green-500 animate-ping' : 'bg-yellow-500'}`} />
                        <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-yellow-500 animate-ping'}`} />
                    </div>
                </TooltipTrigger>
                <TooltipContent className={`overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                    {active ? 'Index fund is live' : `Base token asset withdraws are locked for ${blocksUntilUnlock} more blocks`}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
