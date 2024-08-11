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
import MintRaven from '@components/mint/raven';
import { Button } from '@components/ui/button';
import {
  blocksApi,
  getNameFromAddress,
  getTitleBeltHoldeBalance,
  getTitleBeltHolder
} from '@lib/stacks-api';
import { GetStaticProps } from 'next';
import { useEffect, useLayoutEffect, useState } from 'react';
import { cn } from '@lib/utils';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import liquidStakedWelsh from '@public/liquid-staked-welshcorgicoin.png';
import liquidStakedOdin from '@public/liquid-staked-odin.png';
import odinsRaven from '@public/odins-raven/img/4.gif';
import SalvageFenrir from '@components/salvage/salvage-fenrir';
import fenrirIcon from '@public/fenrir-icon-2.png';
import bolt from '@public/bolt.gif';
import raven from '@public/raven-of-odin.png';
import { callReadOnlyFunction } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { clamp } from 'lodash';
import ClaimFaucetButton from '@components/faucet/raven-claim';
import charismaToken from '@public/charisma.png';
import { getGlobalState } from '@lib/db-providers/kv';

export default function OdinsRaven() {
  const meta = {
    title: "Charisma | Odin's Raven",
    description: META_DESCRIPTION,
    image: '/raven-of-odin.png'
  };

  const title = "Odin's Raven";
  const subtitle = 'The eyes and ears of the Allfather.';

  const [objectivesVisible, setObjectivesVisible] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const handleDescriptionClick = () => {
    setSkipAnimation(true);
    setObjectivesVisible(true);
  };

  useEffect(() => {
    try {
      setDescriptionVisible(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const description = [
    `Odin's raven, often depicted as a pair named Huginn and Muninn, which translate to "thought" and "memory" respectively, are more than mere birds in Norse mythology. These ravens are extensions of Odin himself, serving as his eyes and ears across the Nine Worlds.`,
    ` Each morning, they are dispatched from Odin's shoulders to fly throughout the realms, gathering news and secrets from the earth below. By evening, they return to whisper all they have seen and heard directly into Odin's ear.`,
    ` These creatures are not only symbols of the god's intellectual and psychic powers but also embody the deep connection Odin maintains with his realm and its inhabitants. They are portrayed as sleek and black, mirroring the enigmatic and wise nature of their master.`,
    ` The ravens' daily flights underscore their crucial role in keeping Odin well-informed and several steps ahead of his adversaries, reinforcing his stature as the god of wisdom and knowledge.`
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // faucet logic
  // const blockHeight = data.latestBlock
  // const lastClaimBlockHeight = data.lastClaim
  // const unclaimedBlocks = clamp(0, 999, blockHeight - lastClaimBlockHeight)
  // const dripAmount = data.dripAmount || 0

  return (
    <Page meta={meta} fullViewport>
      <Image src={bolt} alt="bolt-background-image" layout="fill" objectFit="cover" priority />
      <SkipNavContent />
      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="m-2 sm:container sm:mx-auto sm:py-10 md:max-w-2xl"
        >
          <Card className="bg-black text-primary-foreground border-accent-foreground p-0 relative overflow-hidden rounded-md group/card w-full max-w-2xl opacity-[0.99] shadow-black shadow-2xl">
            <CardHeader className="z-20 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="z-30 text-xl font-semibold">{title}</CardTitle>
                <ActiveRecipeIndicator active={true} />
              </div>
              <CardDescription className="z-30 pb-6 text-md font-fine text-foreground">
                {subtitle}
              </CardDescription>
              <div className="z-20">
                <CardTitle className="z-30 mt-2 text-xl font-semibold">Rewards</CardTitle>
                <CardDescription className="z-30 mb-4 text-sm font-fine text-foreground">
                  You will recieve:
                </CardDescription>
                <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                  <div className="relative">
                    <Image
                      alt="Raven"
                      src={odinsRaven}
                      quality={10}
                      className="z-30 w-full border border-white rounded-full"
                    />
                    <div className="absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground">
                      NFT
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="z-20 p-0">
              <div className="z-30 p-4">
                <CardTitle className="z-30 text-xl font-semibold">Description</CardTitle>
                <div className="text-base z-30 min-h-[330px]" onClick={handleDescriptionClick}>
                  {!skipAnimation && descriptionVisible && (
                    <Typewriter
                      options={{
                        delay: 25
                      }}
                      onInit={typewriter => {
                        typewriter.pauseFor(1500);
                        description?.forEach((s: string) =>
                          typewriter.typeString(s).pauseFor(1000)
                        );

                        typewriter.start().callFunction(() => setObjectivesVisible(true));
                      }}
                    />
                  )}
                  {skipAnimation &&
                    descriptionVisible &&
                    description?.map((s: string, index: number) => <p key={index}>{s}</p>)}
                </div>
                <div className="z-20 min-h-[220px]">
                  {objectivesVisible && (
                    <div className="z-30 text-xl font-semibold">Requirements</div>
                  )}
                  {objectivesVisible && (
                    <CardDescription className="z-30 mb-6 text-sm font-fine text-foreground">
                      <p className="leading-normal">
                        To mint a Raven, you need to hold at least{' '}
                        <span className="font-bold">10 billion</span> Fenrir tokens multiplied by
                        its mint ID. For instance, having{' '}
                        <span className="font-bold">10 billion</span> Fenrir allows you to mint the
                        first Raven with ID #<span className="font-bold">1</span>. For the 10th
                        Raven with ID #<span className="font-bold">10</span>, you'll need{' '}
                        <span className="font-bold">100 billion</span> Fenrir. The final Raven, #
                        <span className="font-bold">100</span>, requires{' '}
                        <span className="font-bold">1 trillion</span> Fenrir tokens. These tokens
                        aren't spent during minting; they're simply a requirement.
                      </p>
                    </CardDescription>
                  )}
                  {objectivesVisible && (
                    <div className="grid items-center grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                      <div className="relative">
                        <Image
                          alt="Fenrir, Corgi of Ragnarok"
                          src={fenrirIcon}
                          className="z-30 w-full border border-white rounded-full"
                        />
                        <div className="absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground">
                          10B
                        </div>
                      </div>
                      <div className="ml-1 text-5xl text-center">✕</div>
                      <div className="relative">
                        <Image
                          alt="Fenrir"
                          src={odinsRaven}
                          className="z-30 w-full border border-white rounded-full"
                        />
                        <div className="absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground">
                          ID#
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="z-20 flex justify-between p-4">
              <Link href="/crafting">
                <Button variant="ghost" className="z-30">
                  Back
                </Button>
              </Link>

              {descriptionVisible && (
                <div className="flex items-center space-x-1">
                  <MintRaven />
                </div>
              )}
            </CardFooter>
            <Image
              src={raven}
              width={800}
              height={1600}
              alt={'quest-background-image'}
              className={cn(
                'object-cover',
                'sm:aspect-[1/2]',
                'aspect-[1/3]',
                'opacity-10',
                'flex',
                'z-10',
                'absolute',
                'inset-0',
                'pointer-events-none'
              )}
            />
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white to-black opacity-10" />
          </Card>
        </motion.div>
      </Layout>
    </Page>
  );
}

const ActiveRecipeIndicator = ({ active }: { active: boolean }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative w-4 h-4">
            <div
              className={`absolute top-0 left-0 w-4 h-4 rounded-full ${active ? 'bg-red-500 animate-ping' : 'bg-yellow-500'
                }`}
            />
            <div
              className={`absolute top-0 left-0 w-4 h-4 rounded-full ${active ? 'bg-red-500' : 'bg-yellow-500 animate-ping'
                }`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          className={`max-w-[99vw] max-h-[80vh] overflow-scroll bg-black text-white border-primary leading-tight shadow-2xl`}
        >
          {active ? 'Collection is minted out' : 'Minting goes live on May 8th'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
