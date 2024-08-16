import crypto from 'crypto';
import { API_URL } from './constants';

const HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://beta.charisma.rocks';

export async function register(email: string, token?: string) {
  return await fetch(`${HOST}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, token })
  });
}

export async function linkWallet({ wallet, user }: { wallet: any; user: any }) {
  return await fetch(`${HOST}/api/link-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      wallet,
      user
    })
  });
}

export async function newWallet({ wallet }: { wallet: any }) {
  return await fetch(`${HOST}/api/new-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      wallet
    })
  });
}

export function emailToId(email: string) {
  if (process.env.EMAIL_TO_ID_SECRET) {
    const hmac = crypto.createHmac('sha1', process.env.EMAIL_TO_ID_SECRET);
    hmac.update(email);
    const result = hmac.digest('hex');
    return result;
  } else {
    throw new Error('EMAIL_TO_ID_SECRET is missing');
  }
}

export async function createQuestDraft(args: any) {
  return await fetch(`${HOST}/api/create-quest-draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
}

export async function updateQuest(args: any) {
  return await fetch(`${HOST}/api/update-quest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
}

export async function createQuestSession(args: any) {
  return await fetch(`${HOST}/api/create-quest-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
}

export async function getQuestById(args: any) {
  return await fetch(`${HOST}/api/get-quest-by-id/${args.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function getQuestsByOwner(address: string) {
  return await fetch(`${HOST}/api/get-quests-by-owner/${address}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function getContractMetadata(ca: string) {
  return await fetch(`${HOST}/api/metadata/${ca}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function setContractMetadata(ca: string, metadata: any) {
  return await fetch(`${HOST}/api/metadata/${ca}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
}

export async function setLandMetadata(ca: string, metadata: any) {
  return await fetch(`${HOST}/api/v0/lands/${ca}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
}

export async function getCreatureData(id: string | number) {
  const response = await fetch(`${HOST}/api/v0/creatures/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export async function getLatestBlock() {
  const response = await fetch(`${HOST}/api/v0/blocks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export async function setLatestBlock(metadata: any) {
  const response = await fetch(`${HOST}/api/v0/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
  return response.json();
}

export async function getExperienceHolders() {
  const response = await fetch(`${HOST}/api/v0/experience`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export const saveSession = async (dehydratedState: string) => {
  await fetch(API_URL + '/api/v0/session/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dehydratedState }),
  });
};

export const destroySession = async () => {
  try {
    await fetch(API_URL + '/api/v0/session/destroy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: null,
    });
  } catch (e) {
    console.log(e);
  }
};