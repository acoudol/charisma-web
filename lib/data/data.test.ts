import { contracts } from "../clarigen/types";
import { getLand, getLands, setLand } from "../db-providers/kv";
import { Land } from '../db-providers/kv.types';
import { contractFactory } from '@clarigen/core';
import { clarigen } from "../clarigen/client";
import { assert } from "console";

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
    const contractId = 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx-edlc'
    const land = await getLand(contractId)
    land.name = 'STX-EDLC - Velar LP'
    land.image = 'https://charisma.rocks/lands/img/stx-edlc-lp-icon.png'
    land.description.description = 'EDLC Velar liquidity pool token'
    land.wraps.decimals = 0
    land.wraps.image = 'https://charisma.rocks/lands/img/stx-edlc-lp-icon.png'
    land.cardImage = 'https://charisma.rocks/lands/img/card/stx-edlc-lp.png'
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
})