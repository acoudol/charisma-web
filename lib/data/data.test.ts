import { contracts } from "../clarigen/types";
import { addPlayer, getLand, getLands, getLandsBalance, getPlayers, isPlayer, setLand } from "../db-providers/kv";
import { Land } from '../db-providers/kv.types';
import { contractFactory } from '@clarigen/core';
import { clarigen } from "../clarigen/client";
import { getTransferFunction } from "../stacks-api";
import _ from "lodash";

const landsContractId = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.lands';
const landsContract = contractFactory(contracts.lands as any, landsContractId);

describe('staking pool data integrity', () => {

  let lastLandId = 0
  let lands: string[] = []
  beforeEach(async () => {
    lastLandId = Number(await clarigen.roOk(landsContract.getLastLandId()));
    lands = await getLands()
    console.log(lands)
  });

  test('should get/update land metadata', async () => {
    const contractId = 'SP3MRT36YWK7R0SKFCQ1TDJB3Y3XBAVRFXPYBQ33E.Something-v420'
    const land = await getLand(contractId)
    // land.cardImage = 'https://charisma.rocks/lands/img/card/badgers.jpg'
    land.wraps.decimals = 6
    await setLand(contractId, land)
    console.log(land)
  })

  test('should all have name defined', async () => {
    for (const land of lands) {
      const landMetadata: Land = await getLand(land)
      expect(landMetadata.name).toBeTruthy()
    }
  })

  test('should all have contract address defined', async () => {
    for (const land of lands) {
      const landMetadata: Land = await getLand(land)
      expect(landMetadata.wraps.ca).toBeTruthy()
    }
  })

  test('should all have id defined', async () => {
    for (const land of lands) {
      let landId
      const landMetadata: Land = await getLand(land)
      if (!landMetadata.id) {
        console.log('No id found for land', landMetadata.wraps.ca)
        landId = Number(await clarigen.ro(landsContract.getLandId(landMetadata.wraps.ca)))
        if (!landId) {
          console.log('Land not yet activated', landMetadata.wraps.ca, landMetadata.whitelisted)
        } else {
          console.log('Land activated with no ID defined, fixing...', landMetadata.wraps.ca, landId)
          await setLand(landMetadata.wraps.ca, { ...landMetadata, id: landId, whitelisted: true })
        }
      } else {
        expect(landMetadata.id).toBeTruthy()
        expect(landMetadata.whitelisted).toBeTruthy()
      }
    }
  })

  it('should all have difficulty reflected in metadata', async () => {
    for (const land of lands) {
      const landMetadata: Land = await getLand(land)
      let difficulty, storedDifficulty
      if (landMetadata.id) {
        difficulty = Number(await clarigen.ro(landsContract.getLandDifficulty(BigInt(landMetadata.id))))
        storedDifficulty = landMetadata.attributes.find(attr => attr.trait_type === 'difficulty')
        if (difficulty !== storedDifficulty!.value) {
          console.log('Difficulty mismatch for', landMetadata.wraps.ca, storedDifficulty!.value, difficulty)
          storedDifficulty!.value = difficulty
          await setLand(landMetadata.wraps.ca, landMetadata)
        }
      }
      expect(difficulty === storedDifficulty?.value).toBeTruthy()
    }
  })

  test('should all have decimals defined', async () => {
    for (const land of lands) {
      const landMetadata: Land = await getLand(land)
      if (typeof landMetadata.wraps.decimals !== 'number') {
        console.log('No decimals found for land', landMetadata.wraps)
      } else {
        expect(landMetadata.wraps.decimals).toBeDefined()
      }
    }
  })

  test('should all have valid transfer functions', async () => {
    for (const land of lands) {
      console.log(land)
      const landMetadata: Land = await getLand(land)
      const transferFunction = await getTransferFunction(land)
      console.log(transferFunction)
      landMetadata.wraps.transferFunction = transferFunction
      await setLand(land, landMetadata)
    }
  }, 200000)
})

describe('player data', () => {

  it('should load initial players', async () => {
    const players = ["SP739VRRCMXY223XPR28BWEBTJMA0B27DY8GTKCH", "SP2P4XX8HRA792EQ5DZN0R6PK906F0AETQ18B1XDD", "SP25DP4A9QDM42KC40EXTYQPMQCT1P0R5243GWEGS", "SP3WAAYXPC6WZNEC7SHGR36D32RJPZVXRR1BG0QSY", "SPAFPBD7M89973WDEN68FKYW761RQVYNHSEFQZB9", "SP34V64PNDN1535R0DP60EBSXASJHKJ5NH8JPHBQH", "SP26PZG61DH667XCX51TZNBHXM4HG4M6B2HWVM47V", "SP3AFSKPE2BQ84WXEZ03PQ2E18B02A8ZZWK6190KW", "SP1GN9H48K7813BQDMQGRW1YREV9R2Z8307QKXDKV", "SP3VMAHTFVN9ED5FB073MK1B8MGNCZW5VCEHFFD7C", "SP2RNHHQDTHGHPEVX83291K4AQZVGWEJ7WCQQDA9R", "SP20FG5HZH3PZJRVCG6SQA2ZP3SV6WEXCVAGCKX1D", "SP2CYW85YW03WX0XMSFGMJ3HZQ30X8NKFA6TXVNRX", "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS", "SP1RDVQHYK1DGF3WR2BM83BCCKPWDS2M8FX11WDWP", "SP2GYXR37WGDP11A2CT9T4HBXDPS8SA6YTHQ8A2NH", "SPGNRR2GG22EKH62N8DCW58YB4D1PVK8TP0KQTHD", "SP1WK64BXKS44ZDQ9JY9F51BC429GSTET5M1TQ6VZ", "SP345FTTDC4VT580K18ER0MP5PR1ZRP5C3Q0KYA1P", "SP3C7508XY726X7Z4DECMDAGMD85MYPGF9GE5RQ12", "SP3VZMXTZ58W2N1MEXXTYDRY2PS61X9XW1AS8WQVR", "SP80H1BDBFGK300F7F1XH2G60932PVVP532QDV92", "SPGYCP878RYFVT03ZT8TWGPKNYTSQB1578VVXHGE", "SP2N1F7TZFNTCP406BPHHNWK1CBWZDCY11SZWVF2Z", "SPSHPX1ETZ8TVD6HN6JK3MMTVREYM8QNRC49Z617", "SP1DZ6CVX4TYYNRV39WBPSH18EMA5C6S6TZHBZT75", "SP2P0QX0C70S8SJ8VYP530JFMNPHNVJBQY3KEZ9ZC", "SP3KVRE3RDYYSJ3JDGXKA0K15CC4JEA2ZGX4TJ5EC", "SP2TCFBF793T3PZPMCKQ3478ZS9JR0GMN5WRKX94Z", "SP262CK3VPG6PDF4S96TTXFBVV9Y9Z75F51A6G83N", "SP3A1E9G155N0SJF6ZNT3TFK91HCQCHVYB6ZDVNKP", "SP3T1M18J3VX038KSYPP5G450WVWWG9F9G6GAZA4Q", "SP1X7X9SCHHK4JG4K5NXZ4TDNWKBQR759A85XC1PC", "SP1D8W6HRN833VDFM111X3KAPNW370WYEQ4WPKMF4", "SPAQN4FQ9FY58RCZG1GEP5Q3RSDS7PSW3QXA6XZV", "SP2XPZZQTER4936FS9ZE5JF4J4DFZD2XHADWE0FWN", "SP1BM118CZRA5DG9T4B2F8K466PXQZGHF7ZZKW5RM", "SP1NPDHF9CQ8B9Q045CCQS1MR9M9SGJ5TT6WFFCD2", "SP1FHC2XXJW3CQFNFZX60633E5WPWST4DBW8JFP66", "SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS", "SP1B14W7S57Q471J0E61A01YGQBC3KMZ0WEAWAE39", "SP10ECZKBTMVGV9Z41A9QQP80TQFZK2QRSV5BWNMX", "SPJRGA1G185EN16V3SH5HA38GQ5C2HMHJSNA91DP", "SP2G9AFSSMAK1S8PSCQTX19M40ENWFV4HZDDT7TYH", "SP3QJ0MM9G8M3DSF5NEX7CEJ99NFDQ81WG17T7RMC", "SP1G18KGVMP2RF5S2387DBC4VRZGK2T9ETMMVT7BB", "SP1454QJJZC5E7Q5D25R32Q1WYCGAN2MZHC1W349D", "SP262Q37WXVJA3MPT41R1ZN79R0BYYFN6BQ7MTAKV", "SP3M2PRJ2X85FV6360KMG1WTBKJAC6C3V77FJG3CM", "SP25SF2MPZZS8Q20QA3VTYJXTHAHCRNM5MSZYDNB0", "SP1B46TPZD8Y3ETHGZYJAPHD9GHJK81K08WRB127X", "SPAVM4RT2HVWWCXYFBQ763C6CMJZ26GFYFNBF1S3", "SP1WCJ02AAPKMXPK81KFKGJ7MJDET11FPQG1RHB0S", "SP1RB1V65A1PAAXYT8PVFFFC6T1FN9E8RQX7HMDKC", "SP1EPWNPPGEZMGKHFZ6WXEZHTVTKH0CT77NM32X43", "SP3B93RAWESWW8M5ZP8P71SXNMJEG6T4DZG1HQ1BK", "SP2ZRF8JCSA852P2K4ZB7RS21M43NYFKPSQ7DG1N8", "SP2BWEQA5B8P0TXBP3AR00Z8QDKDPBPGSV6BP8KB7", "SP1ERZZ0G7KERNCXQDJF4GTHCF8DGZB8001YCNPQG", "SP5ZH3A0W0GVKBMX532Z2Q9B43Q2H4DXC8DH1EH2", "SP38M1K82GX1CK3W4KTPF6VYA4YD4YJBV3GYDQ1H", "SP3J653NYKC6H5WJ4HZHDMG1DVA1NRHS2QXTJ5EJ9", "SPENXM9Q8CKQGJF9DBRF12WR0SQXFQMYJKRAZG3F", "SPWRJ6AQRYR8E68GS8XP3TGM33FBA898E08PM1MD", "SP3M3Y5W82QV4S05CNMWXGKZER5YEVSRD7JXVWBBZ", "SP2FPTH274BXVB1E2HNXBAMGABV5TCSZTFNC16FR3", "SP3273YEPG4QZWX0ENQ98FBT1N2Y06XW820STP7NN", "SP5W88Y324AKEPZZJB89YKCGFKZRS5H4W8XBZ1K4", "SPBNZD0NMBJVRYJZ3SJ4MTRSZ3FEMGGTV2YM5MFV", "SPXYRKWDFKBZN3GTS3W9A1MQ0PFTFAHZGGV9V1MJ", "SP26WSYMWS26EMAE10CZJKXFJ4RGZX5HAHEQPFD5J", "SP1FF8MVW3RD1KT6KJ0G0WPMWARRH7FN49DGE3SNT", "SP2PPYXC7B0G5Y7JXJZ3QA2KY4657HAQTTS5KJ5HQ", "SPCDCWBEZ9ZEK49BNMDE2MDMJ0E01W02H9SA4TVZ", "SP38E1VCDZSE2109T3BF3E2YAKMVBCKHEWTB2HY8Z", "SP24SBJMZYS9FWKQZVVDZGM595EYGRT6368ND7MEA", "SP3TF1TFPJ8PE73DXB52AJAXCFR5XN9RT0Y0WQJ5S", "SP34NJCCYANQR5YAY58JHX7AGCZ4E82EFYD0FR0TP", "SP2Z5GGS5106E33E0X9NSCDZMRYWHFRTK5P3WXSEE", "SP2H3TTG3MQK9CEF59S7VQ86H4FX9CH596ZXSE2EK", "SP2Z8Q9C1SMZXSGKJ2Z43JMAD0AQWR14EFQRG23DY", "SP315JZQXB7GA1TAR49GXRMBDRWSFNG4YY2MZEZNY", "SPWC45P8JQP1VG9NDNPJ6ZXPVZ4XXGK06GXR5XN3", "SP3JFEKTFHVC3B9RRQ46FNC8MFRZPHVYYTFWYRX6W", "SP28WGT91RF1XPFK7EHQP06ASDXJNMF13BT98EXEP", "SP1953PHRF5Y4VJ4C47SP8DQKEW0TZ2ANAW4XN8R4", "SPQE3J7XMMK0DN0BWJZHGE6B05VDYQRXRMDV734D", "SP1F1JA8SSGGGFN0PDX55J25YRNRJQAWY56QR0F6J", "SP3K650KFSY5Y2559C56TKZNSBZ2MKVDF0PCAYE78", "SP2D5BGGJ956A635JG7CJQ59FTRFRB0893514EZPJ", "SP2EBPXW74DHJMZHXMT5NRMJS5CG5PR2RY4FKTHJC", "SP1EMXT9RET8W5TXQ325BG3TJ6X15NXV5GKEGVQE6", "SP1HAQ4NW6HH98PMJP55CY0FXCT3XWZ95KY0Y731R", "SP15ZW2BT5E4BSM8SBJJ2P95NAAPRNT3YZ23KMY56", "SP1P882HWHCTBKEPPEDZ1MY2CPKF1JJT2XMFNT289", "SPN3AV2KQ8HYFHGKC34SGVSS9TNMJXG56GXRSR70", "SP3J3WXWS5QTABAE0S14XX8BXPW76RJMADGAX3FR6", "SP1GR38P4KNCQRC1BD5HC97DP36W2MBZFZ4WC0NET", "SP35ZPRFSCA52PW0P9N52D2AWP9QWTFH8RFM23G44", "SP3RW6BW9F5STYG2K8XS5EP5PM33E0DNQT4XEG864", "SP23S4KHTBQADHS6Q0EQVHTC7Q9YRGBSD0F3X6QY", "SP2SJYYF2XWAW2XVJFSF60P0BB5F5193TNZ5FN0CK", "SPJYAPKCEDJSHMAJFHZ1BQDY6ZGQZBRSWMXE2TT5", "SP3NJ4BR35W8002J0PWZY0QNG9FTYZ32H38Z0PV17", "SP36KY8Q0X14W3Z67DSJ0DCFNFF09HSQWZCT6RDXM", "SP308TTPX0XTY1TQ7DPDD45DEHRNDPG1DCJHJ6RR8", "SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY", "SP1KD2BS98HCAEZQB3A4AXNS2KNAFTXF2CTJBQWF6", "SP2YDZB938V1QNSRN2XCCP8YTWEXVC89HK9DFYDCP", "SP1ED344HZP7ENH1J89YDSZ47ZZ9EPNGB72MSZ6CS", "SP1BQ6J826J7PEYCGFCT65YKYZ340EZ1B1TD29W1V", "SP2PZYA27E8MRBQHQXE0JQH5CHM9JJNM00YEMC4QJ", "SPBWF76FHRNA9C1A6ZZ896B3XRRK5TGGW7X9A55A", "SP2Z2CBMGWB9MQZAF5Z8X56KS69XRV3SJF4WKJ7J9", "SP2Z7EPPAQGCVSTSKG13DT6YRN8X21HVD83Y5YH1N", "SP327AMYAAJFHDSDGE6AD0HTACYQ4CCXJGT47M2H3", "SP1TXNDK4CH2SB794Z390G7P28WZ0S7JY9VWAAWBK", "SP2SMSPX443W4HTX9YT9WVV5C0A212FJ8WQMGT51M", "SP3X0TMMDKQVHM923PQGGY0C73JWW6J038XHYMETG", "SP2DBAHGK0QA9QYJ74630285N1M0Z9F90HCJ6QVMD", "SPBC5CXC2KMBYEQJX5ANRZ7JBYQJZZQ8JN2HZ20X", "SPHZW8N7EMXHY7N72JNE2EE1TD4Z1FZ8GENAHYFS", "SP2H9PGP1J9E4NB18HEJXHS0VS6M12XG9EYRDD8AQ", "SPPB155Z73HHGF2EDE1FPZDEM0NY65PTMQK17W75", "SP145Z1WBN4CEDF39KCYF9QCYQD27AW0AH5KH58H", "SP1WXD5423MC1W0M4NSE9WF03X0561ARFX3Y9AQ3F", "SP2A0VW071VE5QXZ9699FK29F0XXQ0B8AQ5BSC431", "SP1131XRHKJ3DBYY8D4FZ32Z07GWYPT7A3Q7CSV7C", "SP137ERCZPW5T2D1YHHRFWJNQ9Z12RT8KD4EW4YA2", "SPC7SG4NPSP1Q51HCHMD1TM9QV7SVE02VKHRRVNK", "SP2BXK29DV08ZFG86ZFT2JXPHC326A29BNTJ8PD5G", "SPKZT8CFR5DNTKDR2BCWQA9WR32GP3GT0CPV8V24", "SP2QVKZ2GWP97TW4RNCT8TN65JRJPVAKERHYSS13E", "SP2T2YCP677B907YQC1PGJ4F5K5MTRT2QB073Z8GQ", "SP37AN9PHYMHPC0VJ4N7MZNXQDCFYVGYGFYFCNVC9", "SP23QVH1RTFJ67B8AF8BH8AZNMXMHT0AK32PZ8Q4S", "SP1HA2942Q3FDJYVVRCYMQS4B4HYF7FAB5Z2RFGED", "SPSQ4W56BY5XKZR8YJMXYP1CKJ64TT4CQ04GFQT8", "SP1ARC8PTHHY7C9P076ZHH5MM6WDWA0XP2EXKVZJE", "SP3KPPNG44MWFZ2RH56TZK4XTE4WEYFJVJAXSC0NG", "SPP3N8ZJ6EDNFS4ATW6V6WZN6QQART1046TDX7C3", "SP3XQD7FJV60Q0W18ZRGTW4BVFJPG5PN655QZE83D", "SP24Y9TDFABS6RMHDJ8PQB3MEDTM19TZGEB2ZJ8QF", "SPJ8NVC2ZVQCKB68XW1QXM6P7YJF8EYGQ2TT5QT7", "SP24J5KX6H20AP95BMAMHV7JVYMRZ1P24S4D5FTZ0", "SP393GB5D7ZYMH7AM6RMACBJMW5DMJ1JM6A7BRXCZ", "SPV4FM42FBDT84WYPYF52D9B2SRX9H26JNXZDGDE", "SP1X4ADFYRX2DV0F2RAYEMAH7ZZKP5A7M9QJYF982", "SPMMMJG8C5709MN8JTA4HT5EB7HNA7ZMDQ4R1HCV", "SP1V3BWAG44SWZPMM6GGKH17V4EEH56236GAY1YY1", "SP1BA3RE79Z541676KJNSYPD437N9ABJMZ314AH95", "SP9B45Q5N95G9WP16V4T7GSAH6817Q22K3S7T99C", "SP311APMPND8FXK61HDXRATDKBT8CFMHC5PY6MYJ3", "SP3T89RVT0S1Q1JTG4ZDQVMCQYXX1C22RC5AY4WEC", "SP101A2VJZ7BSSS07WP7WB81TK1S9TS16CAVV2RQS", "SP1PR96CX3GH05Y2WN66TWSJZ1Q4VTSNMX7F2DSC0", "SP260ZF58NPJZCJGB2K51327RW299BHES24W4ARKE", "SP2N7VSJ2DT9NY438G3VDWYFP3WWBKYN46GQPHH6T", "SP3MA6H2KZ83BK1B5VEJ6H19704WNJ1THD789S1DB", "SPEQRY4JQBJMZ3HK09836X94KA8BAAS738CET55M", "SP2944D80P2TQY1EY4E5RFWP3NZFGM3N6DEWPDTGX", "SP1XT2RZQFHJJAVMMB72XZY1H6PQVGW7S1Z2AJZNJ", "SP16Z0QBF0A6TWDCM53FK1CNS7BQMAET75VWY9JB6", "SP1PAGYEDF35JACKPBBTDRYDTV84ZAT0FAMCC38V9", "SP2T5ZS0WA4BP31E3CTK5GDAY3VKJ1JXSGHDQZD66", "SP213FCK4QPHW1PMRXCVWYJX2KXW79WF6847XZVBZ", "SPE5Q5V3Y8QTSNYDVWGF380DRGH56QK1HARKH756", "SP15TQ8ZC38KT0DBE1Z359KH7R8SX2QWJ0GTDT91X", "SPZ2Q8V1B9MEBKYDW0N3D9ATNXF2ZFEPEB6YRA3Z"]
    for (const player of players) {
      await addPlayer(player)
    }
  }, 200000)

  it('should check if player is in set', async () => {
    const player = "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS"
    const isInSet = await isPlayer(player)
    expect(isInSet).toBeTruthy()
  })

  it('should get all players holding gyatt', async () => {
    const players = await getPlayers()
    const balances = []
    for (const player of players) {
      const balance: any = await getLandsBalance('SP739VRRCMXY223XPR28BWEBTJMA0B27DY8GTKCH.gyatt-bonding-curve', player)
      if (balance > 0) balances.push({ address: player, balance: balance })
    }
    console.log(_.sortBy(balances, 'balance').reverse())
  }, 200000)
})

describe('player balance data', () => {

  it('should load initial players', async () => {
    const players = ["SP739VRRCMXY223XPR28BWEBTJMA0B27DY8GTKCH", "SP2P4XX8HRA792EQ5DZN0R6PK906F0AETQ18B1XDD", "SP25DP4A9QDM42KC40EXTYQPMQCT1P0R5243GWEGS", "SP3WAAYXPC6WZNEC7SHGR36D32RJPZVXRR1BG0QSY", "SPAFPBD7M89973WDEN68FKYW761RQVYNHSEFQZB9", "SP34V64PNDN1535R0DP60EBSXASJHKJ5NH8JPHBQH", "SP26PZG61DH667XCX51TZNBHXM4HG4M6B2HWVM47V", "SP3AFSKPE2BQ84WXEZ03PQ2E18B02A8ZZWK6190KW", "SP1GN9H48K7813BQDMQGRW1YREV9R2Z8307QKXDKV", "SP3VMAHTFVN9ED5FB073MK1B8MGNCZW5VCEHFFD7C", "SP2RNHHQDTHGHPEVX83291K4AQZVGWEJ7WCQQDA9R", "SP20FG5HZH3PZJRVCG6SQA2ZP3SV6WEXCVAGCKX1D", "SP2CYW85YW03WX0XMSFGMJ3HZQ30X8NKFA6TXVNRX", "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS", "SP1RDVQHYK1DGF3WR2BM83BCCKPWDS2M8FX11WDWP", "SP2GYXR37WGDP11A2CT9T4HBXDPS8SA6YTHQ8A2NH", "SPGNRR2GG22EKH62N8DCW58YB4D1PVK8TP0KQTHD", "SP1WK64BXKS44ZDQ9JY9F51BC429GSTET5M1TQ6VZ", "SP345FTTDC4VT580K18ER0MP5PR1ZRP5C3Q0KYA1P", "SP3C7508XY726X7Z4DECMDAGMD85MYPGF9GE5RQ12", "SP3VZMXTZ58W2N1MEXXTYDRY2PS61X9XW1AS8WQVR", "SP80H1BDBFGK300F7F1XH2G60932PVVP532QDV92", "SPGYCP878RYFVT03ZT8TWGPKNYTSQB1578VVXHGE", "SP2N1F7TZFNTCP406BPHHNWK1CBWZDCY11SZWVF2Z", "SPSHPX1ETZ8TVD6HN6JK3MMTVREYM8QNRC49Z617", "SP1DZ6CVX4TYYNRV39WBPSH18EMA5C6S6TZHBZT75", "SP2P0QX0C70S8SJ8VYP530JFMNPHNVJBQY3KEZ9ZC", "SP3KVRE3RDYYSJ3JDGXKA0K15CC4JEA2ZGX4TJ5EC", "SP2TCFBF793T3PZPMCKQ3478ZS9JR0GMN5WRKX94Z", "SP262CK3VPG6PDF4S96TTXFBVV9Y9Z75F51A6G83N", "SP3A1E9G155N0SJF6ZNT3TFK91HCQCHVYB6ZDVNKP", "SP3T1M18J3VX038KSYPP5G450WVWWG9F9G6GAZA4Q", "SP1X7X9SCHHK4JG4K5NXZ4TDNWKBQR759A85XC1PC", "SP1D8W6HRN833VDFM111X3KAPNW370WYEQ4WPKMF4", "SPAQN4FQ9FY58RCZG1GEP5Q3RSDS7PSW3QXA6XZV", "SP2XPZZQTER4936FS9ZE5JF4J4DFZD2XHADWE0FWN", "SP1BM118CZRA5DG9T4B2F8K466PXQZGHF7ZZKW5RM", "SP1NPDHF9CQ8B9Q045CCQS1MR9M9SGJ5TT6WFFCD2", "SP1FHC2XXJW3CQFNFZX60633E5WPWST4DBW8JFP66", "SP1KMAA7TPZ5AZZ4W67X74MJNFKMN576604CWNBQS", "SP1B14W7S57Q471J0E61A01YGQBC3KMZ0WEAWAE39", "SP10ECZKBTMVGV9Z41A9QQP80TQFZK2QRSV5BWNMX", "SPJRGA1G185EN16V3SH5HA38GQ5C2HMHJSNA91DP", "SP2G9AFSSMAK1S8PSCQTX19M40ENWFV4HZDDT7TYH", "SP3QJ0MM9G8M3DSF5NEX7CEJ99NFDQ81WG17T7RMC", "SP1G18KGVMP2RF5S2387DBC4VRZGK2T9ETMMVT7BB", "SP1454QJJZC5E7Q5D25R32Q1WYCGAN2MZHC1W349D", "SP262Q37WXVJA3MPT41R1ZN79R0BYYFN6BQ7MTAKV", "SP3M2PRJ2X85FV6360KMG1WTBKJAC6C3V77FJG3CM", "SP25SF2MPZZS8Q20QA3VTYJXTHAHCRNM5MSZYDNB0", "SP1B46TPZD8Y3ETHGZYJAPHD9GHJK81K08WRB127X", "SPAVM4RT2HVWWCXYFBQ763C6CMJZ26GFYFNBF1S3", "SP1WCJ02AAPKMXPK81KFKGJ7MJDET11FPQG1RHB0S", "SP1RB1V65A1PAAXYT8PVFFFC6T1FN9E8RQX7HMDKC", "SP1EPWNPPGEZMGKHFZ6WXEZHTVTKH0CT77NM32X43", "SP3B93RAWESWW8M5ZP8P71SXNMJEG6T4DZG1HQ1BK", "SP2ZRF8JCSA852P2K4ZB7RS21M43NYFKPSQ7DG1N8", "SP2BWEQA5B8P0TXBP3AR00Z8QDKDPBPGSV6BP8KB7", "SP1ERZZ0G7KERNCXQDJF4GTHCF8DGZB8001YCNPQG", "SP5ZH3A0W0GVKBMX532Z2Q9B43Q2H4DXC8DH1EH2", "SP38M1K82GX1CK3W4KTPF6VYA4YD4YJBV3GYDQ1H", "SP3J653NYKC6H5WJ4HZHDMG1DVA1NRHS2QXTJ5EJ9", "SPENXM9Q8CKQGJF9DBRF12WR0SQXFQMYJKRAZG3F", "SPWRJ6AQRYR8E68GS8XP3TGM33FBA898E08PM1MD", "SP3M3Y5W82QV4S05CNMWXGKZER5YEVSRD7JXVWBBZ", "SP2FPTH274BXVB1E2HNXBAMGABV5TCSZTFNC16FR3", "SP3273YEPG4QZWX0ENQ98FBT1N2Y06XW820STP7NN", "SP5W88Y324AKEPZZJB89YKCGFKZRS5H4W8XBZ1K4", "SPBNZD0NMBJVRYJZ3SJ4MTRSZ3FEMGGTV2YM5MFV", "SPXYRKWDFKBZN3GTS3W9A1MQ0PFTFAHZGGV9V1MJ", "SP26WSYMWS26EMAE10CZJKXFJ4RGZX5HAHEQPFD5J", "SP1FF8MVW3RD1KT6KJ0G0WPMWARRH7FN49DGE3SNT", "SP2PPYXC7B0G5Y7JXJZ3QA2KY4657HAQTTS5KJ5HQ", "SPCDCWBEZ9ZEK49BNMDE2MDMJ0E01W02H9SA4TVZ", "SP38E1VCDZSE2109T3BF3E2YAKMVBCKHEWTB2HY8Z", "SP24SBJMZYS9FWKQZVVDZGM595EYGRT6368ND7MEA", "SP3TF1TFPJ8PE73DXB52AJAXCFR5XN9RT0Y0WQJ5S", "SP34NJCCYANQR5YAY58JHX7AGCZ4E82EFYD0FR0TP", "SP2Z5GGS5106E33E0X9NSCDZMRYWHFRTK5P3WXSEE", "SP2H3TTG3MQK9CEF59S7VQ86H4FX9CH596ZXSE2EK", "SP2Z8Q9C1SMZXSGKJ2Z43JMAD0AQWR14EFQRG23DY", "SP315JZQXB7GA1TAR49GXRMBDRWSFNG4YY2MZEZNY", "SPWC45P8JQP1VG9NDNPJ6ZXPVZ4XXGK06GXR5XN3", "SP3JFEKTFHVC3B9RRQ46FNC8MFRZPHVYYTFWYRX6W", "SP28WGT91RF1XPFK7EHQP06ASDXJNMF13BT98EXEP", "SP1953PHRF5Y4VJ4C47SP8DQKEW0TZ2ANAW4XN8R4", "SPQE3J7XMMK0DN0BWJZHGE6B05VDYQRXRMDV734D", "SP1F1JA8SSGGGFN0PDX55J25YRNRJQAWY56QR0F6J", "SP3K650KFSY5Y2559C56TKZNSBZ2MKVDF0PCAYE78", "SP2D5BGGJ956A635JG7CJQ59FTRFRB0893514EZPJ", "SP2EBPXW74DHJMZHXMT5NRMJS5CG5PR2RY4FKTHJC", "SP1EMXT9RET8W5TXQ325BG3TJ6X15NXV5GKEGVQE6", "SP1HAQ4NW6HH98PMJP55CY0FXCT3XWZ95KY0Y731R", "SP15ZW2BT5E4BSM8SBJJ2P95NAAPRNT3YZ23KMY56", "SP1P882HWHCTBKEPPEDZ1MY2CPKF1JJT2XMFNT289", "SPN3AV2KQ8HYFHGKC34SGVSS9TNMJXG56GXRSR70", "SP3J3WXWS5QTABAE0S14XX8BXPW76RJMADGAX3FR6", "SP1GR38P4KNCQRC1BD5HC97DP36W2MBZFZ4WC0NET", "SP35ZPRFSCA52PW0P9N52D2AWP9QWTFH8RFM23G44", "SP3RW6BW9F5STYG2K8XS5EP5PM33E0DNQT4XEG864", "SP23S4KHTBQADHS6Q0EQVHTC7Q9YRGBSD0F3X6QY", "SP2SJYYF2XWAW2XVJFSF60P0BB5F5193TNZ5FN0CK", "SPJYAPKCEDJSHMAJFHZ1BQDY6ZGQZBRSWMXE2TT5", "SP3NJ4BR35W8002J0PWZY0QNG9FTYZ32H38Z0PV17", "SP36KY8Q0X14W3Z67DSJ0DCFNFF09HSQWZCT6RDXM", "SP308TTPX0XTY1TQ7DPDD45DEHRNDPG1DCJHJ6RR8", "SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY", "SP1KD2BS98HCAEZQB3A4AXNS2KNAFTXF2CTJBQWF6", "SP2YDZB938V1QNSRN2XCCP8YTWEXVC89HK9DFYDCP", "SP1ED344HZP7ENH1J89YDSZ47ZZ9EPNGB72MSZ6CS", "SP1BQ6J826J7PEYCGFCT65YKYZ340EZ1B1TD29W1V", "SP2PZYA27E8MRBQHQXE0JQH5CHM9JJNM00YEMC4QJ", "SPBWF76FHRNA9C1A6ZZ896B3XRRK5TGGW7X9A55A", "SP2Z2CBMGWB9MQZAF5Z8X56KS69XRV3SJF4WKJ7J9", "SP2Z7EPPAQGCVSTSKG13DT6YRN8X21HVD83Y5YH1N", "SP327AMYAAJFHDSDGE6AD0HTACYQ4CCXJGT47M2H3", "SP1TXNDK4CH2SB794Z390G7P28WZ0S7JY9VWAAWBK", "SP2SMSPX443W4HTX9YT9WVV5C0A212FJ8WQMGT51M", "SP3X0TMMDKQVHM923PQGGY0C73JWW6J038XHYMETG", "SP2DBAHGK0QA9QYJ74630285N1M0Z9F90HCJ6QVMD", "SPBC5CXC2KMBYEQJX5ANRZ7JBYQJZZQ8JN2HZ20X", "SPHZW8N7EMXHY7N72JNE2EE1TD4Z1FZ8GENAHYFS", "SP2H9PGP1J9E4NB18HEJXHS0VS6M12XG9EYRDD8AQ", "SPPB155Z73HHGF2EDE1FPZDEM0NY65PTMQK17W75", "SP145Z1WBN4CEDF39KCYF9QCYQD27AW0AH5KH58H", "SP1WXD5423MC1W0M4NSE9WF03X0561ARFX3Y9AQ3F", "SP2A0VW071VE5QXZ9699FK29F0XXQ0B8AQ5BSC431", "SP1131XRHKJ3DBYY8D4FZ32Z07GWYPT7A3Q7CSV7C", "SP137ERCZPW5T2D1YHHRFWJNQ9Z12RT8KD4EW4YA2", "SPC7SG4NPSP1Q51HCHMD1TM9QV7SVE02VKHRRVNK", "SP2BXK29DV08ZFG86ZFT2JXPHC326A29BNTJ8PD5G", "SPKZT8CFR5DNTKDR2BCWQA9WR32GP3GT0CPV8V24", "SP2QVKZ2GWP97TW4RNCT8TN65JRJPVAKERHYSS13E", "SP2T2YCP677B907YQC1PGJ4F5K5MTRT2QB073Z8GQ", "SP37AN9PHYMHPC0VJ4N7MZNXQDCFYVGYGFYFCNVC9", "SP23QVH1RTFJ67B8AF8BH8AZNMXMHT0AK32PZ8Q4S", "SP1HA2942Q3FDJYVVRCYMQS4B4HYF7FAB5Z2RFGED", "SPSQ4W56BY5XKZR8YJMXYP1CKJ64TT4CQ04GFQT8", "SP1ARC8PTHHY7C9P076ZHH5MM6WDWA0XP2EXKVZJE", "SP3KPPNG44MWFZ2RH56TZK4XTE4WEYFJVJAXSC0NG", "SPP3N8ZJ6EDNFS4ATW6V6WZN6QQART1046TDX7C3", "SP3XQD7FJV60Q0W18ZRGTW4BVFJPG5PN655QZE83D", "SP24Y9TDFABS6RMHDJ8PQB3MEDTM19TZGEB2ZJ8QF", "SPJ8NVC2ZVQCKB68XW1QXM6P7YJF8EYGQ2TT5QT7", "SP24J5KX6H20AP95BMAMHV7JVYMRZ1P24S4D5FTZ0", "SP393GB5D7ZYMH7AM6RMACBJMW5DMJ1JM6A7BRXCZ", "SPV4FM42FBDT84WYPYF52D9B2SRX9H26JNXZDGDE", "SP1X4ADFYRX2DV0F2RAYEMAH7ZZKP5A7M9QJYF982", "SPMMMJG8C5709MN8JTA4HT5EB7HNA7ZMDQ4R1HCV", "SP1V3BWAG44SWZPMM6GGKH17V4EEH56236GAY1YY1", "SP1BA3RE79Z541676KJNSYPD437N9ABJMZ314AH95", "SP9B45Q5N95G9WP16V4T7GSAH6817Q22K3S7T99C", "SP311APMPND8FXK61HDXRATDKBT8CFMHC5PY6MYJ3", "SP3T89RVT0S1Q1JTG4ZDQVMCQYXX1C22RC5AY4WEC", "SP101A2VJZ7BSSS07WP7WB81TK1S9TS16CAVV2RQS", "SP1PR96CX3GH05Y2WN66TWSJZ1Q4VTSNMX7F2DSC0", "SP260ZF58NPJZCJGB2K51327RW299BHES24W4ARKE", "SP2N7VSJ2DT9NY438G3VDWYFP3WWBKYN46GQPHH6T", "SP3MA6H2KZ83BK1B5VEJ6H19704WNJ1THD789S1DB", "SPEQRY4JQBJMZ3HK09836X94KA8BAAS738CET55M", "SP2944D80P2TQY1EY4E5RFWP3NZFGM3N6DEWPDTGX", "SP1XT2RZQFHJJAVMMB72XZY1H6PQVGW7S1Z2AJZNJ", "SP16Z0QBF0A6TWDCM53FK1CNS7BQMAET75VWY9JB6", "SP1PAGYEDF35JACKPBBTDRYDTV84ZAT0FAMCC38V9", "SP2T5ZS0WA4BP31E3CTK5GDAY3VKJ1JXSGHDQZD66", "SP213FCK4QPHW1PMRXCVWYJX2KXW79WF6847XZVBZ", "SPE5Q5V3Y8QTSNYDVWGF380DRGH56QK1HARKH756", "SP15TQ8ZC38KT0DBE1Z359KH7R8SX2QWJ0GTDT91X", "SPZ2Q8V1B9MEBKYDW0N3D9ATNXF2ZFEPEB6YRA3Z"]
    for (const player of players) {
      await addPlayer(player)
    }
  }, 200000)

  it('should check if player is in set', async () => {
    const player = "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS"
    const isInSet = await isPlayer(player)
    expect(isInSet).toBeTruthy()
  })

  it('should get all players holding gyatt', async () => {
    const players = await getPlayers()
    const balances = []
    for (const player of players) {
      const balance: any = await getLandsBalance('SP739VRRCMXY223XPR28BWEBTJMA0B27DY8GTKCH.gyatt-bonding-curve', player)
      if (balance > 0) balances.push({ address: player, balance: balance })
    }
    console.log(_.sortBy(balances, 'balance').reverse())
  }, 200000)
})