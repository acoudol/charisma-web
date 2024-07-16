
import { SkipNavContent } from '@reach/skip-nav';

import Page from '@components/page';
import { META_DESCRIPTION } from '@lib/constants';
import Layout from '@components/layout';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { getCraftingRewards, getWooBalance, getWooTotalSupply } from '@lib/stacks-api';
import { GetStaticProps } from 'next';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@lib/utils';
import charismaToken from '@public/charisma.png'
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { motion } from "framer-motion"
import liquidStakedWelsh from '@public/liquid-staked-welshcorgicoin.png'
import liquidStakedRoo from '@public/liquid-staked-roo.png'
import wooIcon from '@public/woo-icon.png'
import woo from '@public/woo-1.png'
import CraftWoo from '@components/craft/woo';
import SalvageWoo from '@components/salvage/woo';
import millify from 'millify';
import useWallet from '@lib/hooks/use-wallet-balances';
import velarApi from '@lib/velar-api';

export default function Woo({ data }: Props) {
  const meta = {
    title: `Charisma | Roo Flair's Bizarre Adventure`,
    description: META_DESCRIPTION,
    image: '/woo-21.png'
  };

  const [objectivesVisible, setObjectivesVisible] = useState(true)
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [stakedWelshPrice, setStakedWelshPrice] = useState(0)
  const [stakedRooPrice, setStakedRooPrice] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null as any);

  const handleDescriptionClick = () => {
    setSkipAnimation(true);
    setObjectivesVisible(true)
  };

  useLayoutEffect(() => {
    try {
      // videoRef.current.muted = false
      setDescriptionVisible(true)
      velarApi.tickers().then((prices) => {
        const stxPrice = prices.find((ticker: any) => ticker.ticker_id === 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx_SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc').last_price
        const sWelshPrice = stxPrice / prices.find((ticker: any) => ticker.ticker_id === 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx_SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh-v2').last_price
        const rooPrice = stxPrice / prices.find((ticker: any) => ticker.ticker_id === 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx_SP2C1WREHGM75C7TGFAEJPFKTFTEGZKF6DFT6E2GE.kangaroo').last_price
        setStakedWelshPrice(sWelshPrice)
        setStakedRooPrice(rooPrice)
      })
    } catch (error) {
      console.error(error)
    }

  }, [])

  const description = [
    `Once a beacon of innovation, now clouded by the shadow of the notorious 'Influencers' and their band of miscreants, the "Spirit of Bitcoin" has fallen victim to a malevolent scheme. No longer a symbol of freedom, it's become the centerpiece of a twisted crypto casino, where integrity is scarce.`,
    ` Roo Flair, empowered by his Stand, "Nakamoto" and accompanied by his faithful corgi companion, venture into this degenerate world. Their acute senses pierce through the veil of deception spun by the larpers, revealing their hollow intentions. These are not revolutionaries but grifters, driven entirely by personal monitary gains.`,
    ` In the final conflict, fueled by the power of autism, Roo and his corgi companion hold their ground for months on end against the Influencers and their minions, dispite soul-crushing delays of his Stand's powers. Will they reclaim the stolen Spirit of Bitcoin, restoring balance to the land and safeguarding its future from ruin?`,
  ]

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const { balances } = useWallet()
  const wooBalance = (balances?.fungible_tokens?.['SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.woo-meme-world-champion::woo'] as any)?.balance

  const craftAmount = wooBalance
  const salvageAmount = wooBalance
  const welshCost = Math.floor(craftAmount * data.welshStaked / data.totalWooSupply)
  const rooCost = Math.floor(craftAmount * data.rooStaked / data.totalWooSupply)
  const craftingRewards = (craftAmount / 1000000) * data.craftingRewardFactor

  const tvl = ((data.welshStaked / 1000000) * stakedWelshPrice) + ((data.rooStaked / 1000000) * stakedRooPrice)


  console.log(wooBalance)
  return (
    <Page meta={meta} fullViewport>

      <video autoPlay loop muted id='video' onClick={(e: any) => { e.target.muted = !e.target.muted }} ref={videoRef}
        className='absolute inset-0 w-full h-full opacity-30'>
        <source src={'/roundabout.mp4'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <motion.div transition={{ delay: 7.5 }} initial="visible" animate="hidden" variants={fadeIn} className='absolute w-full text-sm text-center bottom-4 text-secondary'> ← Click anywhere to unmute audio → </motion.div>
      <SkipNavContent />
      <Layout>
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="m-2 sm:container sm:mx-auto sm:py-10 md:max-w-2xl">

          <Card className='text-primary-foreground border-accent-foreground p-0 relative overflow-hidden rounded-md group/card w-full max-w-2xl opacity-[0.995] shadow-black shadow-2xl'>
            <CardHeader className='z-20 p-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='z-30 text-xl font-semibold'>Index: WOO</CardTitle>
                <div className='flex space-x-4'>
                  <div className='text-lg'>
                    ${millify(tvl)} TVL
                  </div>
                  <ActiveRecipeIndicator active={false} />
                </div>
              </div>
              <CardDescription className='z-30 text-md font-fine text-foreground'>sWELSH and sROO at a fixed 25:1 ratio</CardDescription>

              {/* <div className='-ml-0.5 text-sm mt-0 flex flex-wrap pb-6'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><div className='bg-primary rounded-full w-fit leading-tight px-1 pb-0.5 text-center m-1 pointer-events-auto'>Deflationary</div></TooltipTrigger>
                    <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                      <strong>Deflationary:</strong> This token automatically burns a small percentage of each transaction, channeling these funds directly into its own rebasing pool. <br /><br />
                      This mechanism continuously reduces the total supply relative to it's base token, increasing the token's value over time. <br /><br />
                      The self-burning feature, coupled with the rebase pool, ensures a dynamic adjustment of the token's supply in response to transactional activity, promoting stability and encouraging long-term holding. <br /><br />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><div className='bg-primary rounded-full w-fit leading-tight px-1 pb-0.5 text-center m-1 pointer-events-auto'>Compound Rebase</div></TooltipTrigger>
                    <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                      <strong>Compound Rebase:</strong> This token type leverages the rebase mechanisms of multiple underlying tokens. <br /><br />
                      This advanced structure allows for synchronized adjustments in value, closely tracking the collective performance of diverse assets. <br /><br />
                      It's supported by a robust ecosystem of apps and protocols, each contributing to the vitality and growth of multiple rebasing pools. <br /><br />
                      This interconnected framework not only enhances potential returns but also fosters a dynamic environment for investment and financial strategy. <br /><br />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><div className='bg-primary rounded-full w-fit leading-tight px-1 pb-0.5 text-center m-1 pointer-events-auto'>Craftable</div></TooltipTrigger>
                    <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                      <strong>Craftable Token:</strong> A craftable token is a type of compound token that requires one or more base tokens to create. <br /><br />
                      It is crafted through a rebasing process that aligns its value with both coins simultaneously, offering holders a representative share in each of the coin's pools at a fixed weight. <br /><br />
                      This mechanism ensures that the craftable token maintains a balanced exposure to both assets, providing a unique investment opportunity that diversifies risk and potential rewards. <br /><br />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div> */}

              <div className='z-20'>
                <CardTitle className='z-30 mt-2 text-xl font-semibold'>Mintable Token</CardTitle>
                <CardDescription className='z-30 mb-4 text-sm font-fine text-foreground'>Roo Flair's Bizarre Adventure</CardDescription>
                <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <motion.div initial="hidden" animate="visible" variants={fadeIn} className='relative'>
                          <Image alt='Woo' src={wooIcon} quality={10} className='z-30 w-full border border-white rounded-full' />
                          <div className='absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground'>{millify(craftAmount)}</div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                        {millify(craftAmount)} WOO tokens
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{
                        <motion.div initial="hidden" animate="visible" variants={fadeIn} className='relative'>
                          <Image src={charismaToken} alt='charisma-token' className='z-30 w-full border border-white rounded-full' />
                          <div className='absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground min-w-[24px]'>{millify(craftingRewards)}</div>
                        </motion.div>
                      }</TooltipTrigger>
                      <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                        Charisma tokens can be used to propose and vote on changes to the fees and rewards of WOO
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}

                </div>
              </div>
            </CardHeader>
            <CardContent className='z-20 p-0'>
              <div className='z-30 p-4'>
                {/* <CardTitle className='z-30 text-xl font-semibold'>Description</CardTitle> */}
                {/* <p className='z-30 text-base min-h-[360px]' onClick={handleDescriptionClick}>
                  {!skipAnimation && descriptionVisible && (
                    <Typewriter
                      options={{
                        delay: 10,
                      }}
                      onInit={(typewriter) => {
                        typewriter.pauseFor(1500);
                        description?.forEach((s: string) => typewriter.typeString(s).pauseFor(1000));

                        typewriter.start().callFunction(() => setObjectivesVisible(true));
                      }}
                    />
                  )}
                  {skipAnimation && descriptionVisible && description?.map((s: string, index: number) => <p key={index}>{s}</p>)}
                </p> */}
                <div className='z-20 min-h-[136px]'>
                  {objectivesVisible && <div className='z-30 text-xl font-semibold'>Staked Base Tokens</div>}
                  {objectivesVisible && <CardDescription className='z-30 mb-4 text-sm font-fine text-foreground'>These tokens will be staked to mint WOO Index tokens:</CardDescription>}
                  {objectivesVisible &&
                    <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className='relative'>
                              <Image alt='Liquid Staked Welshcorgicoin' src={liquidStakedWelsh} className='z-30 w-full border border-white rounded-full' />
                              <div className='absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground min-w-[24px]'>{millify(welshCost / 1000000)}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                            {welshCost / 1000000} sWELSH
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className='relative'>
                              <Image alt='Liquid Staked Roo' src={liquidStakedRoo} className='z-30 w-full border border-white rounded-full' />
                              <div className='absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground min-w-[24px]'>{millify(rooCost / 1000000)}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side='bottom' className={`text-md max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
                            {rooCost / 1000000} sROO
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>}
                </div>
              </div>
            </CardContent>

            <CardFooter className="z-20 flex justify-between p-4">
              <Link href='/crafting'><Button variant="ghost" className='z-30'>Back</Button></Link>

              {descriptionVisible && <div className='flex items-center space-x-1'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><CraftWoo amount={craftAmount} welshCost={welshCost} rooCost={rooCost} /></TooltipTrigger>
                    <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                      Minting WOO requires {millify(welshCost / 1000000)} sWELSH and {millify(rooCost / 1000000)} sROO.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><SalvageWoo amount={salvageAmount} /></TooltipTrigger>
                    <TooltipContent className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}>
                      Burning WOO returns {millify(welshCost / 1000000)} sWELSH and {millify(rooCost / 1000000)} sROO back to you.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>}


            </CardFooter>
            <Image
              src={woo}
              width={800}
              height={1600}
              alt={'quest-background-image'}
              className={cn("object-cover", "sm:aspect-[1/2]", 'aspect-[1/3]', 'opacity-10', 'flex', 'z-10', 'absolute', 'inset-0', 'pointer-events-none', 'w-full')}
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

export const getStaticProps: GetStaticProps<Props> = async () => {

  try {

    const woo = await getWooTotalSupply()
    const welsh = await getWooBalance('liquid-staked-welsh-v2')
    const roo = await getWooBalance('liquid-staked-roo-v2')
    const craftingRewardFactor = await getCraftingRewards('woo-meme-world-champion')

    return {
      props: {
        data: {
          totalWooSupply: Number(woo.value.value),
          welshStaked: Number(welsh.value.value),
          rooStaked: Number(roo.value.value),
          craftingRewardFactor: Number(craftingRewardFactor.value.value)
        }
      },
      revalidate: 600
    };

  } catch (error) {
    return {
      props: {
        data: {}
      },
    }
  }
};

const ActiveRecipeIndicator = ({ active }: { active: boolean }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className='relative w-4 h-4'>
            <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${active ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
            <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent className={`overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl max-w-prose`}>
          {active ? 'Crafting is live' : 'Crafting is disabled. Non-standard SIP10 tokens have proven difficult to list on DEXs, so the plan is to simplify the tokenomics and relaunch with a new token. Fees have all been disabled so you can withdraw your deposit at no cost.'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
