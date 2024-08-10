
export const SITE_URL = 'https://charisma.rocks';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'CharismaBTC';
export const BRAND_NAME = 'Charisma';
export const SITE_NAME_MULTILINE = ['Charisma'];
export const SITE_NAME = 'Charisma';
export const META_DESCRIPTION =
  'The creator economy toolkit for memecoins';
export const SITE_DESCRIPTION =
  'The creator economy toolkit for memecoins';
export const DATE = '31 October 2023';
export const SHORT_DATE = 'Jan 1 - 9:00am PST';
export const FULL_DATE = 'Jan 1st 9am Pacific Time (GMT-7)';
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

export const BITCOIN_LEARN_MORE_URL = 'https://bitcoin.org/en/';
export const STACKS_LEARN_MORE_URL = 'https://stacks.org/';

export const NAVIGATION = [
  {
    name: 'Staking',
    route: '/staking'
  },
  {
    name: 'Rewards',
    route: '/rewards'
  },
  {
    name: 'Portfolio',
    route: '/portfolio'
  },
];

export type TicketGenerationState = 'default' | 'loading';
