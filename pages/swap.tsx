import { SkipNavContent } from '@reach/skip-nav';
import Page from '@components/page';
import Layout from '@components/layout/layout';
import { GetStaticProps } from 'next';
import { SwapInterface } from '@components/swap/swap-interface';
import PricesService from '@lib/server/prices/prices-service';
import { DexClient } from '@lib/server/pools/pools.client';
import TokenRegistryClient from '@lib/server/registry/registry.client';

// Initialize client
const dexClient = new DexClient();
const registryClient = new TokenRegistryClient();

export const getStaticProps: GetStaticProps<any> = async () => {
  // Get enhanced token info and prices in parallel
  const [tokenInfo, prices] = await Promise.all([
    registryClient.listAll(),
    PricesService.getAllTokenPrices()
  ]);

  const charismaNames = ['Charisma DEX', 'Charisma', 'charisma'];

  // build pools data
  const tokenList = tokenInfo.tokens;
  const lpTokens = tokenList.filter((t: any) => charismaNames.includes(t.lpInfo?.dex));
  const pools = [];
  for (const lpToken of lpTokens) {
    let poolData = null;
    try {
      poolData = await dexClient.getPool(lpToken.lpInfo.token0, lpToken.lpInfo.token1);
    } catch (error) {
      console.warn('Error fetching pool data:', error);
    }
    const token0 = tokenList.find((t: any) => t.contractId === lpToken.lpInfo.token0) || {};
    const token1 = tokenList.find((t: any) => t.contractId === lpToken.lpInfo.token1) || {};
    pools.push({ ...lpToken, token0: token0, token1: token1, poolData });
  }

  // filter out specific tokens
  const allowedTokens = tokenList
    .filter((t: any) => t.metadata.symbol !== 'EXP')
    .filter((t: any) => t.metadata.symbol);

  return {
    props: {
      data: {
        prices,
        tokens: allowedTokens,
        pools
      }
    },
    revalidate: 60
  };
};

export default function SwapPage({ data }: any) {
  const meta = {
    title: 'Charisma | Swap',
    description: 'Swap tokens on the Charisma DEX',
    image: 'https://charisma.rocks/swap-screenshot.png'
  };

  return (
    <Page meta={meta} fullViewport>
      <SkipNavContent />
      <Layout>
        <div className="sm:container sm:mx-auto sm:pb-10 md:max-w-5xl">
          <div className="my-2 font-light text-center text-muted-foreground/90">
            All trading fees go to WELSH & ROO token redemptions
          </div>
          <SwapInterface data={data} />
        </div>
      </Layout>
    </Page>
  );
}
