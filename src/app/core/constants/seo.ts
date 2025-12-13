import { SeoMeta } from '../models/seo_meta';

export const SEO_DEFAULTS: SeoMeta = {
  title: 'BDTUSDT — Buy & Sell USDT in Bangladesh | Secure P2P Exchange',
  description:
    'BDTUSDT.com is Bangladesh’s most trusted USDT P2P exchange. Buy & sell USDT instantly with the best BDT to USDT rate.',
  keywords: 'bdtusdt, buy usdt bangladesh, sell usdt bangladesh, usdt to bdt, usdt exchange bd',
  og: {
    title: 'BDTUSDT — Buy & Sell USDT in Bangladesh',
    description: 'Secure P2P platform to exchange USDT with the best rates.',
  },
};

export const SEO_PAGES: Record<string, SeoMeta> = {
  landing: {
    title: 'BDTUSDT – Buy & Sell USDT Instantly in Bangladesh | Best USDT Rate',
    description: 'Buy and sell USDT instantly at the best USDT to BDT rates in Bangladesh. Fast, secure P2P USDT exchange with 24/7 support at BDTUSDT.',
    keywords: 'buy usdt bangladesh, sell usdt bangladesh, usdt to bdt rate, usdt exchange bd, bdtusdt',
  },

  'my-profile': {
    title: 'My Profile | Manage Your BDTUSDT Account',
    description: 'Manage your personal account information, security settings, and verification details on BDTUSDT.',
    keywords: 'bdtusdt profile, crypto profile bangladesh, usdt account settings',
  },

  'my-order': {
    title: 'My Orders | USDT Buy/Sell History | BDTUSDT',
    description: 'View and manage your USDT order history, buy/sell transactions, and trade statuses on BDTUSDT.',
    keywords: 'bdtusdt orders, usdt order history, crypto transaction history bangladesh',
  },

  settings: {
    title: 'Settings | Account Preferences | BDTUSDT',
    description: 'Update your preferences, security settings, notification options, and app configurations on BDTUSDT.',
    keywords: 'bdtusdt settings, crypto settings, security settings',
  },

  exchange: {
    title: 'Buy & Sell USDT in Bangladesh | Exchange USDT Instantly | BDTUSDT',
    description:
      'Fast and secure USDT exchange in Bangladesh. Buy and sell USDT instantly with the best USDT to BDT rates on BDTUSDT.',
    keywords: 'buy usdt bd, sell usdt bd, usdt to bdt rate, exchange usdt bangladesh, bdtusdt',
  },

  rates: {
    title: 'USDT to BDT Rate Today | Live Conversion | BDTUSDT',
    description:
      'Check live USDT to BDT and BDT to USDT rates updated in real-time. Get the best exchange price at BDTUSDT.',
    keywords: 'usdt rate bd, usdt to bdt, live usdt rate bangladesh, bdtusdt rate',
  },

  affiliates: {
    title: 'BDTUSDT Affiliate Program | Earn by Referring Users',
    description:
      'Earn commissions by inviting users to buy and sell USDT on BDTUSDT. Join the affiliate program and start earning now.',
    keywords: 'usdt affiliate program, crypto affiliate bangladesh, bdtusdt affiliate',
  },

  reviews: {
    title: 'BDTUSDT Reviews | Trusted USDT Exchange in Bangladesh',
    description: 'See real customer reviews and ratings for buying and selling USDT at BDTUSDT.',
    keywords: 'bdtusdt reviews, usdt exchange review',
  },

  news: {
    title: 'Crypto News & USDT Updates in Bangladesh | BDTUSDT',
    description: 'Latest USDT rate changes, crypto market updates, and Bangladesh-focused digital currency news.',
    keywords: 'crypto news bd, usdt news bangladesh, crypto market bangladesh',
  },

  contact: {
    title: 'Contact BDTUSDT | Get Support for USDT Buy/Sell',
    description: 'Need help buying or selling USDT? Contact BDTUSDT support team for fast assistance.',
    keywords: 'contact bdtusdt, usdt support, crypto help bangladesh',
  },
};
