import { GetServerSideProps, GetStaticProps } from 'next';
import { SkipNavContent } from '@reach/skip-nav';
import Page from '@components/page';
import { META_DESCRIPTION } from '@lib/constants';
import Layout from '@components/layout';
import { cn } from '@lib/utils';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@components/ui/button';
import { useConnect } from '@stacks/connect-react';
import { AnchorMode, callReadOnlyFunction, cvToJSON, Pc, PostConditionMode, principalCV, uintCV } from '@stacks/transactions';
import { StacksMainnet } from "@stacks/network";
import useWallet from '@lib/hooks/use-wallet-balances';
import tokenfaucet1 from '@public/token-faucet.png'
import liquidStakedWelsh from '@public/liquid-staked-welshcorgicoin.png'
import liquidStakedRoo from '@public/liquid-staked-roo.png'
import liquidStakedOdin from '@public/liquid-staked-odin.png'
import charisma from '@public/charisma.png'
import raven from '@public/raven-of-odin.png'
import odinsRaven from '@public/odins-raven/img/4.gif'
import creatureIcon from '@public/creatures/img/creatures.jpg'
import energyIcon from '@public/creatures/img/energy.png'
import numeral from 'numeral';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { AlertDialogHeader } from '@components/ui/alert-dialog';
import journeyOfDiscovery from '@public/quests/journey-of-discovery.png'
import battleRoyale from '@public/stations/battle-royale.png'
import prizeFight from '@public/stations/prize-fight.png'
import { Checkbox } from '@components/ui/checkbox';
import { getGlobalState } from '@lib/db-providers/kv';
import { useGlobalState } from '@lib/hooks/global-state-context';


export const getServerSideProps: GetServerSideProps<Props> = async () => {

  const quests = [
    {
      title: "Prize Fight",
      subtitle: "Bid your energy for a shot at glory.",
      // ticker: "FUJI",
      slug: "/apps/prize-fight",
      guild: {
        logo: {
          url: "/indexes/charismatic-corgi-logo.png"
        }
      },
      cardImage: {
        url: prizeFight
      },
      legacy: true
    },
    {
      title: "Battle Royale",
      subtitle: "Bid your energy for a shot at glory.",
      // ticker: "FUJI",
      slug: "/apps/battle-royale",
      guild: {
        logo: {
          url: "/indexes/charismatic-corgi-logo.png"
        }
      },
      cardImage: {
        url: battleRoyale
      },
      legacy: true
    },
    {
      title: "Journey of Discovery",
      subtitle: "Spend your energy to gain experience.",
      ticker: "EXP",
      slug: "/apps/journey-of-discovery",
      guild: {
        logo: {
          url: "/experience.png"
        }
      },
      cardImage: {
        url: journeyOfDiscovery
      },
    },
    {
      title: 'Iron Forging',
      subtitle: 'Put your blacksmiths to work forging ingots.',
      ticker: 'IRON',
      slug: '/crafting/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.iron-ingots',
      guild: {
        logo: {
          url: '/indexes/iron-ingots-logo.png'
        }
      },
      cardImage: {
        url: '/indexes/iron-ingots-bg.png'
      },
    },
    {
      title: 'Apple Farming',
      subtitle: 'Put your farmers to work harvesting apples.',
      ticker: 'FUJI',
      slug: '/crafting/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.fuji-apples',
      guild: {
        logo: {
          url: '/stations/fuji-apples.png'
        }
      },
      cardImage: {
        url: '/stations/apple-orchard.png'
      },
    },
    {
      title: "Charisma Faucet",
      subtitle: "Get free Charisma tokens.",
      ticker: "CHA",
      slug: "/faucet",
      guild: {
        logo: {
          url: "/charisma.png"
        }
      },
      apps: [
        {
          slug: "/faucet",
          img: "/charisma.png"
        }
      ],
      cardImage: {
        url: tokenfaucet1
      },
      legacy: true
    },
    {
      guild: {
        logo: {
          url: '/wishing-well-1.png'
        }
      },
      title: 'Wishing Well',
      subtitle: 'Donate to the Corgi Wishing Well',
      cardImage: {
        url: '/wishing-well.png'
      },
      slug: 'wishing-well',
      wip: false,
      apps: [
        { slug: '/stake/welsh', img: liquidStakedWelsh },
      ],
      legacy: true
    },
    {
      guild: {
        logo: {
          url: '/kangaroo-borrow-1.png'
        }
      },
      title: 'Kangaroo Burrow',
      subtitle: 'Donate to the Kangaroo Burrow',
      cardImage: {
        url: '/kangaroo-burrow.png'
      },
      slug: 'kangaroo-burrow',
      wip: false,
      apps: [
        { slug: '/stake/roo', img: liquidStakedRoo },
      ],
      legacy: true
    },
    {
      guild: {
        logo: {
          url: '/uppsala-21.png'
        }
      },
      title: 'The Temple at Uppsala',
      subtitle: 'Donate to the Temple at Uppsala',
      cardImage: {
        url: '/uppsala-21.png'
      },
      slug: 'apps/uppsala',
      wip: false,
      apps: [
        { slug: '/stake/odin', img: liquidStakedOdin },
      ],
      legacy: true
    },
    {
      guild: {
        logo: {
          url: odinsRaven
        }
      },
      title: "Odin's Raven",
      subtitle: 'The Eyes and ears of the Allfather',
      cardImage: {
        url: raven
      },
      slug: 'apps/odins-raven',
      wip: false,
      apps: [
        { slug: '/stake/welsh', img: liquidStakedWelsh },
        { slug: '/stake/odin', img: liquidStakedOdin },
      ],
      legacy: true
    },
    {
      guild: {
        logo: {
          url: '/green-room-icon.png'
        }
      },
      title: 'The Green Room',
      subtitle: 'Private faucet for AWC & VIPs',
      cardImage: {
        url: '/green-room-card.png'
      },
      slug: 'apps/the-green-room',
      wip: false,
      apps: [
        { slug: '/faucet', img: charisma },
      ],
      legacy: true
    },

  ]

  const creatures = [
    {
      title: 'Farmers',
      subtitle: 'Honest and humble farmers.',
      slug: '/creatures/1',
      cardImage: { url: '/creatures/img/farmers.png' },
      requiredToken: 'STX-wCHA LP',
      energy: 0,
      amount: 0,
      tokenContract: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-wcha',
      creaturesRecruitable: 0,
      ...(await getGlobalState(`creatures:1`))
    },
    {
      title: 'Blacksmiths',
      subtitle: 'Forger of weapons and armor.',
      slug: '/creatures/2',
      cardImage: { url: '/creatures/img/blacksmiths.png' },
      requiredToken: 'STX-sCHA LP',
      amount: 0,
      tokenContract: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-scha',
      creaturesRecruitable: 0,
      ...(await getGlobalState(`creatures:2`))
    },
    {
      title: 'Corgi Soldiers',
      subtitle: 'Loyal and fierce warriors.',
      slug: '/creatures/3',
      cardImage: { url: '/creatures/img/corgi-soldiers.png' },
      requiredToken: 'STX-iCC LP',
      amount: 0,
      tokenContract: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-icc',
      creaturesRecruitable: 0,
      ...(await getGlobalState(`creatures:3`))
    },
    {
      title: 'Alchemists',
      subtitle: 'Masters of potions and elixirs.',
      slug: '/creatures/4',
      cardImage: { url: '/creatures/img/alchemists.png' },
      requiredToken: 'STX-iMM LP',
      amount: 0,
      tokenContract: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-imm',
      creaturesRecruitable: 0,
      ...(await getGlobalState(`creatures:4`))
    },
  ]

  return {
    props: {
      creatures,
      quests
    }
  };
};

type Props = {
  creatures: any[];
  quests: any[];
};


export default function Creatures({ creatures, quests }: Props) {
  const meta = {
    title: 'Charisma | Creatures',
    description: META_DESCRIPTION,
    image: '/creatures/img/farmers.png'
  };

  const { doContractCall } = useConnect();
  const { getBalanceByKey } = useWallet();
  const { creatures: creatureState } = useGlobalState()

  const [amountWChaLP, setAmountWChaLP] = useState(0)
  const [amountSChaLP, setAmountSChaLP] = useState(0)
  const [amountiCCLP, setAmountiCCLP] = useState(0)
  const [amountiMMLP, setAmountiMMLP] = useState(0)

  const farmersToRecruit = Math.floor(amountWChaLP / creatures[0].cost)
  const blacksmithsToRecruit = Math.floor(amountSChaLP / creatures[1].cost)
  const corgiSoldiersToRecruit = Math.floor(amountiCCLP / creatures[2].cost)
  const alchemistsToRecruit = Math.floor(amountiMMLP / creatures[3].cost)

  creatures[0].creaturesRecruitable = farmersToRecruit
  creatures[1].creaturesRecruitable = blacksmithsToRecruit
  creatures[2].creaturesRecruitable = corgiSoldiersToRecruit
  creatures[3].creaturesRecruitable = alchemistsToRecruit

  creatures[0].amount = creatureState?.['farmers']?.amount
  creatures[1].amount = creatureState?.['blacksmiths']?.amount
  creatures[2].amount = creatureState?.['corgiSoldiers']?.amount
  creatures[3].amount = creatureState?.['alchemists']?.amount

  creatures[0].energy = creatureState?.['farmers']?.energy
  creatures[1].energy = creatureState?.['blacksmiths']?.energy
  creatures[2].energy = creatureState?.['corgiSoldiers']?.energy
  creatures[3].energy = creatureState?.['alchemists']?.energy

  function recruit(tokenContract: string, amount: number) {
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'creatures-kit',
      functionName: "recruit",
      functionArgs: [uintCV(amount), principalCV(tokenContract)],
      postConditionMode: PostConditionMode.Allow,
      // postConditions: [Pc.principal(sender).willSendEq(1000000).ft("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-wcha", "lp-token")],
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  function dismiss(tokenContract: string, amount: number) {
    doContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
      contractName: 'creatures-kit',
      functionName: "dismiss",
      functionArgs: [uintCV(amount), principalCV(tokenContract)],
      postConditionMode: PostConditionMode.Allow,
      // postConditions: [Pc.principal('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.creatures').willSendEq(1000000).ft("SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-wcha", "lp-token")],
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  useEffect(() => {
    setAmountWChaLP(getBalanceByKey('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-wcha::lp-token').balance)
    setAmountSChaLP(getBalanceByKey('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-scha::lp-token').balance)
    setAmountiCCLP(getBalanceByKey('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-icc::lp-token').balance)
    setAmountiMMLP(getBalanceByKey('SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-imm::lp-token').balance)
  }, [getBalanceByKey])


  const [showLegacyApps, setShowLegacyApps] = useState(false);

  quests = showLegacyApps ? quests : quests.filter((quest: any) => !quest.legacy)

  return (
    <Page meta={meta} fullViewport>
      <SkipNavContent />
      <Layout>
        <div className="sm:container sm:mx-auto sm:py-10 space-y-6 m-2">
          <div className="space-y-1">
            <h2 className="text-4xl font-semibold tracking-tight text-secondary">Creatures</h2>
            <p className="text-muted-foreground text-base">
              Creatures are SIP13 tokens that represent workers in the Charisma ecosystem. They can be used to perform tasks and earn rewards.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card
              className={cn(
                'bg-black text-primary-foreground border-accent-foreground p-0 flex relative overflow-hidden rounded-md group/card'
              )}
            >
              <div className="relative flex flex-col items-start text-md p-4 space-y-4 rounded-lg justify-between">
                <div className="space-y-4 text-sm">
                  <h3 className="font-bold text-lg">Creatures</h3>
                  <p>
                    To recruit a creature, you'll need to deposit LP tokens into the system.
                  </p>
                  <p>
                    Once you have deposited the LP tokens, you'll recieve creatures tokens. Your creatures will then automatically start generating "energy".
                  </p>
                  <p>
                    There are lots to spend your creatures energy in the Charisma ecosystem, many of which yield valuable token rewards.
                  </p>
                </div>
              </div>
            </Card>
            {creatures.map((creature, i) => {
              return (
                <Card
                  key={i}
                  className={cn(
                    'bg-black text-primary-foreground border-accent-foreground p-0 flex relative overflow-hidden rounded-md group/card')}
                >
                  <CardContent className="z-20 w-full p-0">
                    <CardHeader className="absolute inset-0 z-20 p-2 h-min backdrop-blur-sm group-hover/card:backdrop-blur-3xl">
                      <div className="flex justify-between align-top">
                        <div className="flex gap-2">
                          <div className="">
                            <div className="text-sm font-semibold leading-none text-secondary">
                              {creature.title}
                            </div>
                            <div className="mt-1 text-xs leading-tight font-fine text-secondary">
                              {creature.subtitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end space-x-3 mr-1">
                          <EnergyInfoDialog creature={creature} />
                        </div>
                      </div>
                    </CardHeader>

                    <Link href={`${creature.slug}`} className='w-full'>
                      <Image
                        src={creature.cardImage.url}
                        height={1200}
                        width={1200}
                        alt="creature-featured-image"
                        className={cn(
                          'w-full object-cover transition-all', // group-hover/card:scale-105',
                          'aspect-[1]',
                          'opacity-80',
                          'group-hover/card:opacity-100',
                          'group-hover/card:scale-105',
                          'flex',
                          'z-10',
                          'relative',
                        )}
                      />
                    </Link>
                    {!(creature.creaturesRecruitable >= 1) ? <div className='z-40 absolute inset-0 top-36 text-lg font-semibold opacity-80 group-hover/card:opacity-0 transition-all text-center leading-tight pointer-events-none'>You need more {creature.requiredToken} tokens to create {creature.title}</div> : <div></div>}

                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/50 to-transparent opacity-30 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-0% to-black/50 to-69% opacity-90 z-20 pointer-events-none" />
                  </CardContent>
                  <CardFooter
                    className={cn('z-20 absolute inset-0 top-auto flex p-0 mb-1 opacity-100 transition-all justify-between')}
                  >
                    <div className="z-20 p-2 flex w-full justify-between place-items-end space-x-2">

                      <div className='min-w-[2.8rem]'>
                        {creature.amount > 0 && <CreatureInfoDialog creature={creature} />}
                      </div>
                      <div className='flex flex-col justify-center space-y-2'>
                        <div className='flex space-x-2 justify-end'>
                          <Button disabled={creature.amount === 0} className="z-30" variant={'ghost'} onClick={() => dismiss(creature.tokenContract, creature.amount)}>Dismiss</Button>
                          <Button disabled={!(creature.creaturesRecruitable >= 1) || creature.cost === 0} className="z-30" onClick={() => recruit(creature.tokenContract, creature.creaturesRecruitable)}>Recruit</Button>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className='flex justify-between'>
            <div className="space-y-1">
              <h2 className="text-4xl font-semibold tracking-tight text-secondary">Quests</h2>
              <p className="text-muted-foreground text-base">
                Here are some activities you can do in the Charisma ecosystem to earn tokens.
              </p>
              <label className="flex items-center gap-2">
                <span>Show Legacy Apps</span>
                <Checkbox
                  className="mt-0.5"
                  checked={showLegacyApps}
                  onCheckedChange={() => setShowLegacyApps(!showLegacyApps)}
                />
              </label>
            </div>
            <Link passHref href={'/quest-launchpad'}>
              <Button className='h-full bg-primary-foreground/5'>Are you a web3 project founder?</Button>
            </Link>
          </div>

          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card
              className={cn(
                'bg-black text-primary-foreground border-accent-foreground p-0 flex relative overflow-hidden rounded-md group/card'
              )}
            >
              <div className="relative flex flex-col items-start text-md p-4 space-y-4 rounded-lg justify-between">
                <div className="space-y-4 text-sm">
                  <h3 className="font-bold text-lg">Quests</h3>
                  <p>
                    These are activities you can do in the Charisma ecosystem to earn tokens, experience, or other perks.
                  </p>
                  <p>
                    To start a quest, click on the card to view more information about it's requirements and rewards.
                  </p>
                  <p>
                    Some quests require spending energy generated by creatures to complete.
                  </p>
                </div>
              </div>
            </Card>
            {quests.map((activity: any, i: number) => {
              return (
                <Card
                  key={i}
                  className={cn(
                    'bg-black text-primary-foreground border-accent-foreground p-0 flex relative overflow-hidden rounded-md group/card',
                    activity.inactive && 'opacity-25 hover:opacity-60'
                  )}
                >
                  <Link href={`${activity.slug}`} className="w-full">
                    <CardContent className="w-full p-0">
                      <CardHeader className="absolute inset-0 z-20 p-2 h-min backdrop-blur-sm group-hover/card:backdrop-blur-3xl">
                        <div className="flex justify-between align-top">
                          <div className="flex gap-2">
                            <div className="min-w-max">
                              {activity.guild.logo.url ? (
                                <Image
                                  src={activity.guild.logo.url}
                                  width={40}
                                  height={40}
                                  alt="guild-logo"
                                  className="w-10 h-10 rounded-full grow"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-white border rounded-full" />
                              )}
                            </div>
                            <div className="">
                              <div className="text-sm font-semibold leading-none text-secondary">
                                {activity.title}
                              </div>
                              <div className="mt-1 text-xs leading-tight font-fine text-secondary">
                                {activity.subtitle}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end leading-[1.1]">
                            <div className="text-white text-sm font-semibold">{activity.ticker}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <Image
                        src={activity.cardImage.url}
                        height={1200}
                        width={1200}
                        alt="activity-featured-image"
                        className={cn(
                          'w-full object-cover transition-all group-hover/card:scale-105',
                          'aspect-[1]',
                          'opacity-80',
                          'group-hover/card:opacity-100',
                          'flex',
                          'z-10',
                          'relative'
                        )}
                      />
                      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/50 to-transparent opacity-30" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-0% to-black/50 to-69% opacity-90 z-20" />
                    </CardContent>
                  </Link>

                </Card>
              );
            })}

          </div>
        </div>
      </Layout>
    </Page>
  );
}

export function CreatureInfoDialog({ creature }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="z-20 relative cursor-pointer">
          <Image
            alt={creature.title}
            src={creatureIcon}
            width={100}
            height={100}
            className="z-30 border rounded-full h-10 w-10 hover:scale-110 transition-all"
          />
          <div className="absolute px-1 font-bold rounded-full -top-1 -right-2 text-xs bg-background text-accent min-w-5 text-center">
            {numeral(creature.amount).format('(0a)')}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <DialogTitle>Creatures</DialogTitle>
          <div className='flex items-center space-x-4'>

            <Image
              alt={creature.title}
              src={creatureIcon}
              width={100}
              height={100}
              className="z-30 border rounded-full h-16 w-16 hover:scale-110 transition-all"
            />
            <DialogDescription className='text-sm py-4 space-y-2'>
              <p>Creatures are SIP13 tokens that tokenize yield farming in the Charisma ecosystem.</p>
              <p>They can be used to perform tasks and earn rewards.</p>
            </DialogDescription>
          </div>
        </AlertDialogHeader>

        <DialogFooter>
          You have {numeral(creature.amount).format('0a')} {creature.title} working for you.
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export function EnergyInfoDialog({ creature }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="z-20 relative cursor-pointer">
          <Image
            alt={creature.title}
            src={energyIcon}
            width={100}
            height={100}
            className={`z-30 border rounded-full h-10 w-10 hover:scale-110 transition-all ${creature.amount > 0 && `animate-pulse`}`}
          />
          <div className="absolute px-1 font-bold rounded-full -top-1 -right-2 text-xs bg-background text-accent min-w-5 text-center">
            {numeral(creature.energy).format('(0a)')}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <DialogTitle>Creature Energy</DialogTitle>
          <div className='flex items-center space-x-4'>

            <Image
              alt={creature.title}
              src={energyIcon}
              width={100}
              height={100}
              className="z-30 border rounded-full h-16 w-16 hover:scale-110 transition-all"
            />
            <DialogDescription className='text-sm py-4 space-y-2'>
              <p>Creatures generate what's called "energy" every block based on their power.</p>
              <p>You can spend this energy to claim token rewards.</p>
              <p>Whenever you use creatures to claim rewards, their energy is reset to zero.</p>
            </DialogDescription>
          </div>
        </AlertDialogHeader>

        <DialogFooter>
          Your {creature.title} have produced {numeral(creature.energy).format('0a')} energy to spend on token rewards.
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
