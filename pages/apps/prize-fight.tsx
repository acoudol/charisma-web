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
import { Button } from '@components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@lib/utils';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { userSession } from '@components/stacks-session/connect';
import { useConnect } from '@stacks/connect-react';
import { AnchorMode, callReadOnlyFunction, cvToJSON, Pc, PostConditionMode, principalCV, uintCV } from '@stacks/transactions';
import { StacksMainnet } from "@stacks/network";
import numeral from 'numeral';
import farmersImg from '@public/creatures/img/farmers.png'
import blacksmithsImg from '@public/creatures/img/blacksmiths.png'
import corgiSoldiersImg from '@public/creatures/img/corgi-soldiers.png'
import alchemistsImg from '@public/creatures/img/alchemists.png'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { AlertDialogHeader } from '@components/ui/alert-dialog';
import energyIcon from '@public/creatures/img/energy.png'
import fujiApples from '@public/stations/fuji-apples.png'
import { Progress } from "@components/ui/progress"
import { getNftURI, getTokenURI } from '@lib/stacks-api';
import treasureChest from '@public/governance/treasure-chest.png'
import prizeFight from '@public/stations/prize-fight.png'

export default function PrizeFight() {
  const meta = {
    title: "Charisma | Prize Fight",
    description: META_DESCRIPTION,
    image: '/stations/battle-royale.png'
  };

  const title = "Prize Fight";
  const subtitle = 'Bid your energy for a shot at glory and a NFT prize.';

  const sender = userSession.isUserSignedIn() && userSession.loadUserData().profile.stxAddress.mainnet

  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [currentEpochPrize, setCurrentEpochPrize] = useState({} as any)
  const [currentEpochPrizeImg, setCurrentEpochPrizeImg] = useState('' as any)
  const [epochProgress, setEpochProgress] = useState(0)
  const [highestBid, setHighestBid] = useState(0)
  const [highestBidder, setHighestBidder] = useState('')


  useEffect(() => {
    try {
      setDescriptionVisible(true);
    } catch (error) {
      console.error(error);
    }
  }, []);



  useEffect(() => {
    sender && callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'prize-fight',
      functionName: "get-current-epoch",
      functionArgs: [],
      senderAddress: sender
    }).then(response => setCurrentEpoch(Number(cvToJSON(response).value)))
  }, [sender])

  useEffect(() => {
    sender && callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'prize-fight',
      functionName: "get-current-epoch-nft-data",
      functionArgs: [],
      senderAddress: sender
    }).then(async response => {
      try {
        const data = cvToJSON(response).value.value
        setCurrentEpochPrize(data)
        const ca = data['nft-contract']?.value
        const id = data['nft-id']?.value
        let image = ''
        if (ca === 'SP2D5BGGJ956A635JG7CJQ59FTRFRB0893514EZPJ.bitgear-genesis') {
          const metadata = await (await fetch(`https://cdn.bitgear.world/ipfs/QmPJFhVb2hPb5U3d8ZiR6h8ZQ4zLMV2kQWBGUmkr6xBYUS/${id}.json`)).json()
          image = metadata.image10x
        } else {
          const metadata = await getNftURI(ca, id)
          image = metadata.image
        }
        setCurrentEpochPrizeImg(image)
      } catch (error) {
        console.log(error)
        setCurrentEpochPrizeImg(treasureChest)
      }
    })
  }, [sender])

  useEffect(() => {
    sender && callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'prize-fight',
      functionName: "get-epoch-progress",
      functionArgs: [],
      senderAddress: sender
    }).then(response => setEpochProgress(Number(cvToJSON(response).value)))
  }, [sender])

  useEffect(() => {
    sender && callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'prize-fight',
      functionName: "get-highest-bid",
      functionArgs: [uintCV(currentEpoch)],
      senderAddress: sender
    }).then(response => setHighestBid(Number(cvToJSON(response).value?.value || 0)))
  }, [sender, currentEpoch])

  useEffect(() => {
    sender && callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'prize-fight',
      functionName: "get-highest-bidder",
      functionArgs: [uintCV(currentEpoch)],
      senderAddress: sender
    }).then(response => setHighestBidder(cvToJSON(response).value?.value))
  }, [sender, currentEpoch])

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const ca = currentEpochPrize['nft-contract']?.value
  const id = currentEpochPrize['nft-id']?.value

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
              <div className='grid grid-cols-2'>

                <div className="z-20">
                  <CardTitle className="z-30 mt-2 text-xl font-semibold">Reward</CardTitle>
                  <CardDescription className="z-30 mb-4 text-sm font-fine text-foreground">
                    The top bidder will recieve:
                  </CardDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <Image
                        alt="NFT Prize"
                        src={currentEpochPrizeImg}
                        className="z-30 w-full"
                        width={85}
                        height={85}
                      />
                      <div className='text-center'>
                        <p className='text-sm whitespace-nowrap'>{ca?.split('.')[1]}</p>
                        <p className='text-md whitespace-nowrap font-bold'>#{id}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <CardTitle className="z-30 my-2 text-xl font-semibold">Epoch #{currentEpoch}</CardTitle>

                  <CardDescription className="z-30 mb-4 text-sm font-fine text-foreground space-y-2">
                    <Progress value={epochProgress} />
                    <p>Highest Bid: {highestBidder ? `${highestBidder.slice(0, 4)}...${highestBidder.slice(-4)} at ${numeral(highestBid).format('0a')}` : 'None'}</p>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>



            <CardContent className="z-20 flex-grow p-4">
              <div className="flex flex-col items-center justify-center space-y-4">

                <p className='max-w-60'>
                  {descriptionVisible && <Typewriter
                    options={{ autoStart: true }}
                    onInit={typewriter => {
                      typewriter.pauseFor(2700).start().typeString('Brothers, what we do in life... echoes in eternity.')
                    }}
                  />}
                </p>
              </div>
            </CardContent>

            <CardFooter className="z-20 flex justify-between p-4 items-end">

              <Link href="/creatures">
                <Button variant="ghost" className="z-30">
                  Back
                </Button>
              </Link>

              <SelectCreatureDialog data={currentEpochPrize} />
            </CardFooter>
            <Image
              src={prizeFight}
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
  const ca = data['nft-contract']?.value

  const { doContractCall } = useConnect();

  const sender = userSession.isUserSignedIn() && userSession.loadUserData().profile.stxAddress.mainnet

  const [farmerClaimableAmount, setFarmerClaimableAmount] = useState(0)
  const [blacksmithClaimableAmount, setBlacksmithClaimableAmount] = useState(0)
  const [corgiSoldierClaimableAmount, setCorgiSoldierClaimableAmount] = useState(0)
  const [alchemistClaimableAmount, setAlchemistClaimableAmount] = useState(0)

  useEffect(() => {

    callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'creatures-kit',
      functionName: "get-untapped-amount",
      functionArgs: [uintCV(1), principalCV(sender)],
      senderAddress: sender
    }).then(response => setFarmerClaimableAmount(Number(cvToJSON(response).value)))

    callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'creatures-kit',
      functionName: "get-untapped-amount",
      functionArgs: [uintCV(2), principalCV(sender)],
      senderAddress: sender
    }).then(response => setBlacksmithClaimableAmount(Number(cvToJSON(response).value)))

    callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'creatures-kit',
      functionName: "get-untapped-amount",
      functionArgs: [uintCV(3), principalCV(sender)],
      senderAddress: sender
    }).then(response => setCorgiSoldierClaimableAmount(Number(cvToJSON(response).value)))

    callReadOnlyFunction({
      network: new StacksMainnet(),
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'creatures-kit',
      functionName: "get-untapped-amount",
      functionArgs: [uintCV(4), principalCV(sender)],
      senderAddress: sender
    }).then(response => setAlchemistClaimableAmount(Number(cvToJSON(response).value)))

  }, [sender])

  function tap(creatureId: number) {
    // const response = await callReadOnlyFunction({
    //   network: new StacksMainnet(),
    //   contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    //   contractName: 'prize-fight',
    //   functionName: "get-claimable-amount",
    //   functionArgs: [uintCV(creatureId)],
    //   senderAddress: sender
    // })
    // const claimableTokens = Number(cvToJSON(response).value)
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'prize-fight',
      functionName: "tap-creatures",
      functionArgs: [uintCV(creatureId), principalCV(ca), principalCV('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.creatures-kit')],
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


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={`z-30`}>Bid for the NFT Prize</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <DialogTitle>Which creatures should you use?</DialogTitle>
        </AlertDialogHeader>

        <DialogDescription className='grid gap-2 grid-cols-2 sm:grid-cols-4 space-x-4 py-4'>
          <div className='flex flex-col items-center space-y-2'>
            <Image
              alt={'asd'}
              src={farmersImg}
              width={100}
              height={100}
              onClick={() => tap(1)}
              className="z-30 border rounded-lg h-32 w-32 hover:scale-110 transition-all cursor-pointer"
            />
            <h2 className='text-base text-primary-foreground'>Farmers</h2>
            <div className='flex items-center gap-2 text-lg text-muted/80 font-semibold mr-4'>
              <Image
                alt={'Experience Icon'}
                src={energyIcon}
                width={100}
                height={100}
                className={`z-30 border rounded-full h-6 w-6`}
              />
              <div>{numeral(farmerClaimableAmount).format('0a')}</div>
            </div>
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <Image
              alt={'asd'}
              src={blacksmithsImg}
              width={100}
              height={100}
              onClick={() => tap(2)}
              className="z-30 border rounded-lg h-32 w-32 hover:scale-110 transition-all cursor-pointer"
            />
            <h2 className='text-base text-primary-foreground'>Blacksmiths</h2>
            <div className='flex items-center gap-2 text-lg text-muted/80 font-semibold mr-4'>
              <Image
                alt={'Experience Icon'}
                src={energyIcon}
                width={100}
                height={100}
                className={`z-30 border rounded-full h-6 w-6`}
              />
              <div>{numeral(blacksmithClaimableAmount).format('0a')}</div>
            </div>
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <Image
              alt={'asd'}
              src={corgiSoldiersImg}
              width={100}
              height={100}
              onClick={() => tap(3)}
              className="z-30 border rounded-lg h-32 w-32 hover:scale-110 transition-all cursor-pointer"
            />
            <h2 className='text-base text-primary-foreground'>Corgi Soldiers</h2>
            <div className='flex items-center gap-2 text-lg text-muted/80 font-semibold mr-4'>
              <Image
                alt={'Experience Icon'}
                src={energyIcon}
                width={100}
                height={100}
                className={`z-30 border rounded-full h-6 w-6`}
              />
              <div>{numeral(corgiSoldierClaimableAmount).format('0a')}</div>
            </div>
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <Image
              alt={'asd'}
              src={alchemistsImg}
              width={100}
              height={100}
              onClick={() => tap(4)}
              className="z-30 border rounded-lg h-32 w-32 hover:scale-110 transition-all cursor-pointer"
            />
            <h2 className='text-base text-primary-foreground'>Alchemists</h2>
            <div className='flex items-center gap-2 text-lg text-muted/80 font-semibold mr-4'>
              <Image
                alt={'Experience Icon'}
                src={energyIcon}
                width={100}
                height={100}
                className={`z-30 border rounded-full h-6 w-6`}
              />
              <div>{numeral(alchemistClaimableAmount).format('0a')}</div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog >
  )
}