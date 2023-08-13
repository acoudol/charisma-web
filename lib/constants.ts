/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const SITE_URL = 'https://charisma.rocks';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'CharismaBTC';
export const BRAND_NAME = 'Charisma';
export const SITE_NAME_MULTILINE = ['Charisma'];
export const SITE_NAME = 'Charisma';
export const META_DESCRIPTION =
  'Charisma is a decentralized Quest-to-Earn platform that rewards users for completing small tasks in the bitcoin ecosystem';
export const SITE_DESCRIPTION =
  'Quest-to-Earn for Bitcoin, Ordinals, and Stacks';
export const DATE = '31 October 2023';
export const SHORT_DATE = 'Jan 1 - 9:00am PST';
export const FULL_DATE = 'Jan 1st 9am Pacific Time (GMT-7)';
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

export const BITCOIN_LEARN_MORE_URL = 'https://bitcoin.org/en/';
export const STACKS_LEARN_MORE_URL = 'https://stacks.org/';
export const NAVIGATION = [
  {
    name: 'Quests',
    route: '/quests'
  },
  {
    name: 'Faucet',
    route: '/faucet'
  },
  {
    name: 'Tokenomics',
    route: '/tokenomics'
  },
  {
    name: 'Governance',
    route: '/governance'
  },
];

export type TicketGenerationState = 'default' | 'loading';
