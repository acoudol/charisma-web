import Link from 'next/link';
import { cn } from '@lib/utils';
import { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';
import { NAVIGATION } from '@lib/constants';
import styles from './layout.module.css';
import styleUtils from '../utils.module.css';
import MobileMenu from '../mobile-menu';
import Footer from './footer';
import React, { useEffect } from 'react';
import Image from 'next/image';
import energyIcon from '@public/creatures/img/energy.png';
import experienceIcon from '@public/experience.png';
import numeral from 'numeral';
import { useGlobalState } from '@lib/hooks/global-state-context';
import { forEach } from 'lodash';
import ConnectWallet from '../stacks-session/connect';
import useWallet from '@lib/hooks/wallet-balance-provider';
import charismaLogo from '@public/charisma.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
};

export default function Layout({ children, className, hideNav, layoutStyles }: Props) {
  const router = useRouter();
  const activeRoute = router.asPath;

  const { wallet } = useWallet();
  const [energy, setEnergy] = React.useState<number>(0);
  const { lands, block, token, setToken } = useGlobalState()

  useEffect(() => {
    let totalEnergy = 0
    forEach(lands, (land: any) => {
      totalEnergy += Number(land.energy)
      setEnergy(totalEnergy)
    })
  }, [lands, block.height])

  return (
    <>
      <div className={styles.background}>
        {!hideNav && (
          <header className={cn(styles.header)}>
            <div className={styles['header-logos']}>
              <MobileMenu key={router.asPath} />
              <div className={cn(styleUtils['hide-on-mobile'])}>
                <Link href="/" className={cn(styles.logo)}>
                  <Image src={charismaLogo} alt="Logo" width="64" height="64" />
                </Link>
              </div>
            </div>
            <div className={styles.tabs}>
              {NAVIGATION.map(({ name, route }, i) => (
                <Link
                  key={i}
                  href={route}
                  className={cn(styles.tab, {
                    [styles['tab-active']]: activeRoute.endsWith(route)
                  })}
                >
                  <div className="relative flex flex-col items-center justify-center">
                    <div>{name}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div
              className={cn(
                styles['header-right'],
                'items-center',
                'gap-4',
                'pr-4',
                ' whitespace-nowrap',
                'sm:relative'
              )}
            >
              <div className="flex items-center gap-2 text-md text-muted font-medium pl-2 sm:absolute sm:right-44">
                <Image
                  alt={'Experience Icon'}
                  src={experienceIcon}
                  width={100}
                  height={100}
                  className={`z-30 border rounded-full h-5 w-5`}
                />
                <div>{numeral(wallet.experience.balance).format('0a')}</div>
              </div>
              <ConnectWallet />
            </div>
          </header>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="z-30 sm:sticky fixed bottom-0 sm:top-10 self-end m-4 mt-10 h-16 w-16 focus-visible:invisible">
            <div>
              <Image
                alt={'Energy Icon'}
                src={token?.metadata?.image || energyIcon}
                width={100}
                height={100}
                className={`border rounded-full hover:scale-105 transition-all cursor-pointer`}
              />
              <div className='absolute -top-[30px] -right-0.5 border bg-opacity-90 bg-black rounded-3xl px-2 text-sm flex space-x-1 items-center'>
                <div>{numeral(token?.energy || energy).format('0.0a')}</div>
                <Image
                  alt={'Token Icon'}
                  src={energyIcon}
                  width={100}
                  height={100}
                  className={`z-30 rounded-full h-4 w-4`}
                />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mx-2 mt-0.5'>
            <DropdownMenuLabel>Select a token</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(lands).map((land: any) => <DropdownMenuItem onClick={() => setToken(land)} className='cursor-pointer flex space-x-2' key={land.metadata.id}>
              <Image
                alt={'Token Icon'}
                src={land.metadata.image}
                width={100}
                height={100}
                className={`z-30 rounded-full h-5 w-5`}
              />
              <div>{land.metadata.name}</div>
            </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className={cn(styles.page, 'sm:-mt-24')}>
          <main className={styles.main} style={layoutStyles}>
            <SkipNavContent />
            <div className={cn(styles.full, className)}>{children}</div>
          </main>
          <Footer />
        </div>
      </div >
    </>
  );
}
