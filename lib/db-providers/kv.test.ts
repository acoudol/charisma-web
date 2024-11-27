import {
  addIndexContract,
  clearLeaderboard,
  clearRewardsLeaderboard,
  clearSwapData,
  getContractMetadata,
  getExperienceLeaderboard,
  getGlobalState,
  getIndexContracts,
  getNftCollectionMetadata,
  getNftCollections,
  getNftMetadata,
  getPoolData,
  getTapData,
  removeIndexContract,
  removeNftCollection,
  saveSwapEvent,
  setContractMetadata,
  setNftCollectionMetadata,
  setNftMetadata
} from './kv';

describe('tokens api', () => {
  it('should set charisma contract metadata by id', async () => {
    const ca = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charisma-token';
    const metadata = {
      name: 'Charisma',
      description: 'The primary token of the Charisma ecosystem.',
      image: 'https://charisma.rocks/charisma-logo-square.png'
    };
    const response = await setContractMetadata(ca, metadata);
    console.log(response);
  });

  it('should set welsh contract metadata by id', async () => {
    const ca = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.synthetic-welsh';
    const metadata = {
      name: 'Synthetic Welsh',
      description: 'A synthetic asset redeemable 1:1 for Welshcorgicoin.',
      image: 'https://charisma.rocks/welsh-logo.png'
    };
    const response = await setContractMetadata(ca, metadata);
    console.log(response);
  });

  it('should set roo contract metadata by id', async () => {
    const ca = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.synthetic-roo';
    const metadata = {
      name: 'Synthetic Roo',
      description: 'A synthetic asset redeemable 1:1 for Roo.',
      image: 'https://charisma.rocks/roo-logo.png'
    };
    const response = await setContractMetadata(ca, metadata);
    console.log(response);
  });
});

describe('indexes', () => {
  it('should get all index token contracts', async () => {
    const response = await getIndexContracts();
    console.log(response);
  });

  it('should add index contract', async () => {
    const response = await addIndexContract('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.hoot-dex');
    console.log(response);
  });

  it('should set hoot-dex contract metadata by id', async () => {
    const ca = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.hoot-dex';
    const metadata = {
      name: 'Night Owl',
      description: 'The first Dexterity index token.',
      image: 'https://charisma.rocks/sip10/hooter/body.png',
      symbol: 'HDX',
      tokenA: 'SP2D5BGGJ956A635JG7CJQ59FTRFRB0893514EZPJ.dme000-governance-token',
      tokenB: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.hooter-the-owl',
      decimals: 6
    };
    const response = await setContractMetadata(ca, metadata);
    console.log(response);
  });

  it('should remove index contract', async () => {
    const response = await removeIndexContract(
      'SP1NP36KD0PWVPZP56XB8ECB6M6ZEF21731SA0SXR.welshstackuni-dexterity'
    );
    console.log(response);
  });

  it('should get index token contract metadata', async () => {
    const response = await getContractMetadata(
      'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.hoot-dex'
    );
    console.log(response);
  });

  it('should get all index token metadata', async () => {
    const contracts = await getIndexContracts();
    for (const contract of contracts) {
      try {
        const metadata = await getContractMetadata(contract);
        console.log(contract);
        console.log(metadata);
      } catch (error) {
        console.error(error);
      }
    }
  });

  it('should update all index token metadata', async () => {
    const contracts = await getIndexContracts();
    for (const contract of contracts) {
      try {
        const metadata = await getContractMetadata(contract);
        console.log(metadata);

        // await setContractMetadata(contract, {
        //   ...metadata,
        //   decimals: 6
        // });
      } catch (error) {
        console.error(error);
      }
    }
  });
});

describe('metadata api', () => {
  it('should get contract metadata by id', async () => {
    const ca = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.test-index';
    const response = await getContractMetadata(ca);
    console.log(response);
    expect(response).toBeDefined();
  });

  it('should set contract metadata by id', async () => {
    const ca = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charismatic-corgi';
    const metadata = {
      name: 'Charismatic Corgi',
      description: 'An index fund composed of sWELSH and sCHA at a fixed 100:1 ratio.',
      image: 'https://charisma.rocks/indexes/charismatic-corgi-logo.png',
      background: 'https://charisma.rocks/indexes/charismatic-corgi-bg.png',
      symbol: 'iCC',
      ft: 'index-token',
      contains: [
        {
          address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh-v2',
          symbol: 'sWELSH',
          ft: 'liquid-staked-token',
          weight: 100
        },
        {
          address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-charisma',
          symbol: 'sCHA',
          ft: 'liquid-staked-token',
          weight: 1
        }
      ]
    };
    const response = await setContractMetadata(ca, metadata);
    console.log(response);
  });

  // delete experience leaderboard
  it('should delete experience lb', async () => {
    const response = await clearLeaderboard();
    console.log(response);
  });

  // delete rewards leaderboard
  it('should delete cha rewards lb', async () => {
    const response = await clearRewardsLeaderboard(
      'SP2D5BGGJ956A635JG7CJQ59FTRFRB0893514EZPJ.dme000-governance-token::charisma'
    );
    console.log(response);
  });

  // get experience holders
  it('should get experience holders', async () => {
    const response = await getExperienceLeaderboard(0, -1);
    console.log(response);
  });
});

describe('nfts api', () => {
  it('should get nft collections', async () => {
    const response = await getNftCollections();
    console.log(JSON.stringify(response, null, 2));
  });

  it('should remove nft collections', async () => {
    const response = await removeNftCollection(
      'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.memobots-guardians-of-the-gigaverse'
    );
    console.log(JSON.stringify(response, null, 2));
  });

  // should get nft collection metadata
  it('should get nft collection metadata', async () => {
    const response = await getNftCollectionMetadata(
      'SP3T1M18J3VX038KSYPP5G450WVWWG9F9G6GAZA4Q.jumping-pupperz'
    );
    console.log(JSON.stringify(response, null, 2));
  });

  it('should update nft collection metadata (jumping pupperz)', async () => {
    const data = await getNftCollectionMetadata(
      'SP3T1M18J3VX038KSYPP5G450WVWWG9F9G6GAZA4Q.jumping-pupperz'
    );
    delete data.whitelisted;
    data.properties.whitelisted = true;
    await setNftCollectionMetadata(
      'SP3T1M18J3VX038KSYPP5G450WVWWG9F9G6GAZA4Q.jumping-pupperz',
      data
    );
    console.log(JSON.stringify(data, null, 2));
  });

  it('should update nft collection metadata (the-red-pill)', async () => {
    const contractAddress = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.red-pill-nft';
    const data = {
      sip: 16,
      name: 'Charisma Red Pill NFT',
      description: {
        type: 'string',
        description:
          'This is your last chance. After this, there is no turning back. You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland and I show you how deep the rabbit hole goes.'
      },
      attributes: [
        {
          trait_type: 'color',
          value: 'Red'
        }
      ],
      properties: {
        collection: 'Charisma Red Pill NFT',
        collection_image: 'https://charisma.rocks/sip9/pills/red-pill.gif',
        category: 'image'
      }
    };
    const metadata = await setNftCollectionMetadata(contractAddress, data);
    console.log(JSON.stringify(metadata, null, 2));
  });

  it('should set nft item metadata (the-red-pill)', async () => {
    for (let id = 1; id <= 500; id++) {
      const response = await setNftMetadata(
        'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.red-pill-nft',
        `${id}`,
        {
          name: `Red Pill #${id}`,
          image: 'https://charisma.rocks/sip9/pills/red-pill-nft.gif'
        }
      );
      console.log(JSON.stringify(response, null, 2));
    }
  }, 400000);

  it('should set nft item metadata (ssfb)', async () => {
    for (let id = 1; id <= 1000; id++) {
      const response = await setNftMetadata(
        'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.spell-scrolls',
        `${id}`,
        {
          name: `Fire Bolt #${id}`,
          image: 'https://charisma.rocks/quests/spell-scroll/fire-bolt-icon.png'
        }
      );
      console.log(JSON.stringify(response, null, 2));
    }
  }, 400000);

  it('should set nft item metadata (ms)', async () => {
    for (let id = 1; id <= 20; id++) {
      const response = await setNftMetadata(
        'SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS.mooning-sharks',
        `${id}`,
        {
          name: `Mooning Shark #${id}`,
          image: 'https://charisma.rocks/quests/mooning-shark/mooningshark-icon.jpeg'
        }
      );
      console.log(JSON.stringify(response, null, 2));
    }
  }, 400000);

  // should get nft item
  it('should get nft item metadata (the-red-pill)', async () => {
    const response = await getNftMetadata(
      'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.the-red-pill',
      '469'
    );
    console.log(JSON.stringify(response, null, 2));
  });

  // should get nft item
  it('should get nft item metadata (ssfb)', async () => {
    const response = await getNftMetadata(
      'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.spell-scrolls',
      '1'
    );
    console.log(JSON.stringify(response, null, 2));
  });

  it('should get nft item metadata (ms)', async () => {
    const response = await getNftMetadata(
      'SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS.mooning-sharks',
      '1'
    );
    console.log(JSON.stringify(response, null, 2));
  });

  it('should update nft collection metadata (mooning-sharks)', async () => {
    const data = await getNftCollectionMetadata(
      'SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS.mooning-sharks'
    );
    data.properties.minted = 20;
    // await setNftCollectionMetadata('SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS.mooning-sharks', data)
    console.log(JSON.stringify(data, null, 2));
  });

  it('should update nft collection metadata (ms)', async () => {
    const data = await getNftCollectionMetadata(
      'SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS.mooning-sharks'
    );
    data.properties.minted = 20;
    data.properties.collection_image =
      'https://charisma.rocks/quests/mooning-shark/mooningshark-icon.jpeg';
    data.properties.items[0].image_url =
      'https://charisma.rocks/quests/mooning-shark/mooningshark-icon.jpeg';
    await setNftCollectionMetadata(
      'SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS.mooning-sharks',
      data
    );
    console.log(JSON.stringify(data, null, 2));
  });

  it('should update nft collection metadata (spell-scrolls)', async () => {
    const data = await getNftCollectionMetadata(
      'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.spell-scrolls'
    );
    data.properties.minted = 32;
    // data.properties.items[0].image_url = 'https://charisma.rocks/quests/spell-scroll/fire-bolt-icon.png'
    // await setNftCollectionMetadata('SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.spell-scrolls', data)
    console.log(JSON.stringify(data, null, 2));
  });

  it('should update nft collection metadata (kraqen-lotto)', async () => {
    const data = await getNftCollectionMetadata(
      'SPGYCP878RYFVT03ZT8TWGPKNYTSQB1578VVXHGE.kraqen-lotto'
    );
    data.properties.minted = 30;
    // data.properties.items[0].image_url = 'https://charisma.rocks/quests/spell-scroll/fire-bolt-icon.png'
    await setNftCollectionMetadata('SPGYCP878RYFVT03ZT8TWGPKNYTSQB1578VVXHGE.kraqen-lotto', data);
    console.log(JSON.stringify(data, null, 2));
  });

  it('should update nft collection metadata (bitcoin-pepe)', async () => {
    const contractId = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.bitcoin-pepe-whitelist-ticket';
    const data = await getNftCollectionMetadata(contractId);
    data.properties.whitelisted = true;
    await setNftCollectionMetadata(contractId, data);
    console.log(JSON.stringify(data, null, 2));
  });
});

// swap data storage

describe('swap data storage', () => {
  it('should save swap data', async () => {
    const event = {
      a: 155448396503,
      'amt-fee-lps': 8275000,
      'amt-fee-protocol': 8275000,
      'amt-fee-rest': 8275000,
      'amt-fee-share': 0,
      'amt-in': 3310000000,
      'amt-in-adjusted': 3293450000,
      'amt-out': 3207140160,
      b: 162925239045,
      b0: 155448396503,
      b1: 162933514045,
      id: 2,
      k: 2.532646715940928e22,
      op: 'swap',
      pool: {
        'block-height': 168656,
        'burn-block-height': 864362,
        'lp-token': 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.roo-iouroo',
        'protocol-fee': { den: 1000, num: 500 },
        reserve0: 158655536663,
        reserve1: 159631789045,
        'share-fee': { den: 1000, num: 0 },
        'swap-fee': { den: 1000, num: 995 },
        symbol: '$ROO-iouROO',
        token0: 'SP2C1WREHGM75C7TGFAEJPFKTFTEGZKF6DFT6E2GE.kangaroo',
        token1: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.synthetic-roo'
      },
      'token-in': 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.synthetic-roo',
      'token-out': 'SP2C1WREHGM75C7TGFAEJPFKTFTEGZKF6DFT6E2GE.kangaroo',
      user: 'SP308TTPX0XTY1TQ7DPDD45DEHRNDPG1DCJHJ6RR8'
    };
    const response = await saveSwapEvent(event);
    console.log(response);
  });

  it('should get pool data', async () => {
    const response = await getPoolData('2');
    console.log(response);
  });

  it('should clear swap data', async () => {
    await clearSwapData('1');
    await clearSwapData('2');
    await clearSwapData('3');
    await clearSwapData('4');
    await clearSwapData('5');
    await clearSwapData('6');
    await clearSwapData('7');
  });
});

// tap data storage

describe('tap data storage', () => {
  it('should get tap data', async () => {
    const response = await getTapData();
    console.log(JSON.stringify(response, null, 2));
  });
});
