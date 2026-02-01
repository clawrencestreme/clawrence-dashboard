import { type AccountAssociation } from '@farcaster/miniapp-core/src/manifest';

// --- App Configuration ---
export const APP_URL: string = process.env.NEXT_PUBLIC_URL!;

export const APP_NAME: string = 'Clawrence Dashboard';

export const APP_DESCRIPTION: string = 'Live stats, staking leaderboard, and contest info for $CLAWRENCE';

export const APP_PRIMARY_CATEGORY: string = 'finance';

export const APP_TAGS: string[] = ['clawrence', 'streme', 'supertoken', 'staking', 'defi'];

// --- Asset URLs ---
export const APP_ICON_URL: string = `${APP_URL}/icon.png`;
export const APP_OG_IMAGE_URL: string = `${APP_URL}/api/opengraph-image`;
export const APP_SPLASH_URL: string = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR: string = '#1a1a2e';

export const APP_ACCOUNT_ASSOCIATION: AccountAssociation | undefined = {
  header: "eyJmaWQiOjQ0NjY5NywidHlwZSI6ImF1dGgiLCJrZXkiOiIweDkwMTI1RjllNTE1NWY0OTY1QTI0MjlEOWE0YjQwMjgzMzQxRDVCYTIifQ",
  payload: "eyJkb21haW4iOiJjbGF3cmVuY2UtZGFzaGJvYXJkLnZlcmNlbC5hcHAifQ",
  signature: "dfE+clvg0gSEpGKI70MQPR0fK2mpmrJ6OBUJTwgCjDU5T+tmDOBtBBTuc8LZPjyOuG/yujICiG1asNnFndvgSBw="
};

// --- UI Configuration ---
export const APP_BUTTON_TEXT: string = 'View Dashboard';

// --- Integration Configuration ---
export const APP_WEBHOOK_URL: string =
  process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID
    ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
    : `${APP_URL}/api/webhook`;

export const USE_WALLET: boolean = true;
export const ANALYTICS_ENABLED: boolean = true;

// Base mainnet
export const APP_REQUIRED_CHAINS: string[] = ['eip155:8453'];

export const RETURN_URL: string | undefined = undefined;

// --- $CLAWRENCE Token Config ---
export const CLAWRENCE_TOKEN = '0x416232a73a7A9Ef779D8B6eb4aF6B552C8E8feEd';
export const CLAWRENCE_STAKING_POOL = '0xe4f912e61176fbc91b4e9aeb00bdada4fcdeba3e';
export const CLAWRENCE_STAKING_TOKEN = '0x4976078a7487910725c66d33c5fdca4cf848bdbf';
export const STREME_API = 'https://api.streme.fun/api/tokens';

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: 'Farcaster SignedKeyRequestValidator',
  version: '1',
  chainId: 10,
  verifyingContract:
    '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`,
};

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_TYPE = [
  { name: 'requestFid', type: 'uint256' },
  { name: 'key', type: 'bytes' },
  { name: 'deadline', type: 'uint256' },
];
