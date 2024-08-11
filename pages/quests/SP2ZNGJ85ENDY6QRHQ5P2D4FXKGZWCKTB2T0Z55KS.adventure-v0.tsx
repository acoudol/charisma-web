import { SkipNavContent } from '@reach/skip-nav';
import Page from '@components/page';
import { META_DESCRIPTION } from '@lib/constants';
import Layout from '@components/layout';
import Image from 'next/image';
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
} from '@lib/stacks-api';
import { GetStaticProps } from 'next';
import { useEffect, useLayoutEffect, useState } from 'react';
import { cn } from '@lib/utils';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import odinsRaven from '@public/odins-raven/img/4.gif';
import fenrirIcon from '@public/fenrir-icon-2.png';
import goldEmbers from '@public/quests/gold-embers.gif'
import journeyOfDiscovery from '@public/quests/journey-of-discovery.png'
import experience from '@public/experience.png'
import { userSession } from '@components/stacks-session/connect';
import { useConnect } from '@stacks/connect-react';
import { AnchorMode, callReadOnlyFunction, cvToJSON, Pc, PostConditionMode, principalCV, uintCV } from '@stacks/transactions';
import { StacksMainnet } from "@stacks/network";
import numeral from 'numeral';
import schaImg from '@public/liquid-staked-charisma.png'
import welshImg from '@public/welsh-logo.png'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { AlertDialogHeader } from '@components/ui/alert-dialog';
import experienceIcon from '@public/experience.png'

export default function JourneyOfDiscovery() {
  const meta = {
    title: "Charisma | Journey of Discovery",
    description: META_DESCRIPTION,
    image: '/journey-of-discovery.png'
  };

  const title = "Journey of Discovery";
  const subtitle = 'Spend your energy to gain experience.';


  const [descriptionVisible, setDescriptionVisible] = useState(false);

  useEffect(() => {
    try {
      setDescriptionVisible(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Page meta={meta} fullViewport>
      {/* <Image src={goldEmbers} alt="bolt-background-image" layout="fill" objectFit="cover" priority /> */}
      <SkipNavContent />
      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="m-2 sm:container sm:mx-auto sm:py-10 md:max-w-2xl"
        >
          <Card className="min-h-[600px] flex flex-col bg-black text-primary-foreground border-accent-foreground p-0 relative overflow-hidden rounded-md group/card w-full max-w-2xl opacity-[0.99] shadow-black shadow-2xl">
            <CardHeader className="z-20 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="z-30 text-xl font-semibold">{title}</CardTitle>
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
                      alt="Experience"
                      src={experience}
                      quality={10}
                      className="z-30 w-full rounded-full"
                    />
                    <div className="absolute px-1 font-bold rounded-full -top-1 -right-3 text-md md:text-base lg:text-xs bg-accent text-accent-foreground">
                      EXP
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>



            <CardContent className="z-20 flex-grow p-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className='max-w-64'>
                  {descriptionVisible && <Typewriter
                    options={{ autoStart: true }}
                    onInit={typewriter => {
                      typewriter.pauseFor(2700).start().typeString('We shall not cease from exploration, and the end of all our exploring will be to arrive where we started and know the place for the first time.')
                    }}
                  />}
                </p>
              </div>
            </CardContent>

            <CardFooter className="z-20 flex justify-between p-4 items-end">

              <Link href="/crafting">
                <Button variant="ghost" className="z-30">
                  Back
                </Button>
              </Link>

              <SelectCreatureDialog />
            </CardFooter>
            <Image
              src={journeyOfDiscovery}
              width={800}
              height={1600}
              alt={'quest-background-image'}
              className={cn(
                'object-cover',
                'opacity-10',
                'aspect-[2/3]',
                'sm:aspect-square',
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

export function SelectCreatureDialog({ data }: any) {

  const { doContractCall } = useConnect();

  const sender = userSession.isUserSignedIn() && userSession.loadUserData().profile.stxAddress.mainnet

  function journey(creatureId: number) {
    // const response = await callReadOnlyFunction({
    //   network: new StacksMainnet(),
    //   contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    //   contractName: 'journey-of-discovery-v2',
    //   functionName: "get-claimable-amount",
    //   functionArgs: [uintCV(creatureId)],
    //   senderAddress: sender
    // })
    // const claimableTokens = Number(cvToJSON(response).value)
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'adventure-v0',
      functionName: "tap",
      functionArgs: [uintCV(creatureId), principalCV('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.land-helper-v0')],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={`z-30`}>Gain Experience</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <DialogTitle>Which staked token should you use?</DialogTitle>
        </AlertDialogHeader>

        <DialogDescription className='grid gap-2 grid-cols-2 sm:grid-cols-4 space-x-4 py-4'>
          <div className='flex flex-col items-center space-y-2'>
            <Image
              alt={'asd'}
              src={schaImg}
              width={100}
              height={100}
              onClick={() => journey(3)}
              className="z-30 border rounded-full h-32 w-32 hover:scale-110 transition-all cursor-pointer"
            />
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <Image
              alt={'asd'}
              src={welshImg}
              width={100}
              height={100}
              onClick={() => journey(4)}
              className="z-30 border rounded-full h-32 w-32 hover:scale-110 transition-all cursor-pointer"
            />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog >
  )
}