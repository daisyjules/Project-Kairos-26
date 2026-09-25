export interface DSEMarketQuote {
  ticker: string;
  companyName: string;
  currentPrice: number; // Official current DSE price in TZS
  sector: 'Banking' | 'Manufacturing' | 'Telecom' | 'Financial Services' | 'Energy' | 'Consumer Goods';
  dividendYieldPct: number;
  dayChangePct: number;
  marketCapBlnTZS?: number;
  peRatio?: number;
  description: string;
  isCrossListed?: boolean;
}

export const OFFICIAL_DSE_QUOTES: Record<string, DSEMarketQuote> = {
  CRDB: {
    ticker: 'CRDB',
    companyName: 'CRDB Bank Plc',
    currentPrice: 620,
    sector: 'Banking',
    dividendYieldPct: 8.2,
    dayChangePct: 1.64,
    marketCapBlnTZS: 1619.8,
    peRatio: 4.8,
    description: 'Leading retail and commercial bank with strong cross-border presence in Burundi and DRC.',
  },
  NMB: {
    ticker: 'NMB',
    companyName: 'NMB Bank Plc',
    currentPrice: 5400,
    sector: 'Banking',
    dividendYieldPct: 7.1,
    dayChangePct: 0.93,
    marketCapBlnTZS: 2700.0,
    peRatio: 5.2,
    description: 'Top profitable Tanzanian commercial bank with massive nationwide branch and agency network.',
  },
  TPCC: {
    ticker: 'TPCC',
    companyName: 'Tanzania Portland Cement (Twiga)',
    currentPrice: 4350,
    sector: 'Manufacturing',
    dividendYieldPct: 9.0,
    dayChangePct: -0.45,
    marketCapBlnTZS: 782.9,
    peRatio: 8.1,
    description: 'Largest cement producer in Tanzania under Heidelberg Materials group; premier dividend payer.',
  },
  TBL: {
    ticker: 'TBL',
    companyName: 'Tanzania Breweries Ltd',
    currentPrice: 10900,
    sector: 'Manufacturing',
    dividendYieldPct: 6.4,
    dayChangePct: 0.0,
    marketCapBlnTZS: 3215.5,
    peRatio: 12.3,
    description: 'Premier brewing entity in Tanzania (AB InBev subsidiary) dominating beer and malt markets.',
  },
  VODA: {
    ticker: 'VODA',
    companyName: 'Vodacom Tanzania Plc',
    currentPrice: 770,
    sector: 'Telecom',
    dividendYieldPct: 5.8,
    dayChangePct: 0.0,
    marketCapBlnTZS: 1724.8,
    peRatio: 14.5,
    description: 'Largest telecom and mobile money (M-Pesa) operator in Tanzania.',
  },
  DSE: {
    ticker: 'DSE',
    companyName: 'Dar es Salaam Stock Exchange PLC',
    currentPrice: 2400,
    sector: 'Financial Services',
    dividendYieldPct: 10.4,
    dayChangePct: 2.13,
    marketCapBlnTZS: 57.6,
    peRatio: 6.8,
    description: 'Self-listed stock exchange operator; benefits directly from increasing trading volume and bond listings.',
  },
  SWIS: {
    ticker: 'SWIS',
    companyName: 'Swissport Tanzania Plc',
    currentPrice: 1800,
    sector: 'Financial Services',
    dividendYieldPct: 7.5,
    dayChangePct: -1.1,
    marketCapBlnTZS: 64.8,
    peRatio: 9.2,
    description: 'Aviation ground handling and air cargo operator at JNIA (Dar) and KIA (Kilimanjaro).',
  },
  TCCL: {
    ticker: 'TCCL',
    companyName: 'Tanga Cement PLC (Simba Cement)',
    currentPrice: 2200,
    sector: 'Manufacturing',
    dividendYieldPct: 4.5,
    dayChangePct: 0.5,
    marketCapBlnTZS: 140.0,
    peRatio: 11.0,
    description: 'Producer of Simba Cement, strategically located in Tanga with extensive domestic rail distribution.',
  },
  NICO: {
    ticker: 'NICO',
    companyName: 'National Investments Company (NICOL)',
    currentPrice: 880,
    sector: 'Financial Services',
    dividendYieldPct: 7.8,
    dayChangePct: 1.15,
    marketCapBlnTZS: 58.2,
    peRatio: 4.1,
    description: 'Investment holding vehicle with significant equity stakes in NMB Bank, Twiga Cement, and money markets.',
  },
  TOL: {
    ticker: 'TOL',
    companyName: 'TOL Gases Limited',
    currentPrice: 740,
    sector: 'Energy',
    dividendYieldPct: 6.5,
    dayChangePct: 0.0,
    marketCapBlnTZS: 42.5,
    peRatio: 7.4,
    description: 'Pioneer manufacturer and distributor of industrial and medical gases in Tanzania and SADC.',
  },
  DCB: {
    ticker: 'DCB',
    companyName: 'DCB Commercial Bank Plc',
    currentPrice: 155,
    sector: 'Banking',
    dividendYieldPct: 4.0,
    dayChangePct: 0.0,
    marketCapBlnTZS: 14.8,
    peRatio: 8.5,
    description: 'Community-rooted commercial bank focused on SME microfinance and municipal payroll services.',
  },
  TCC: {
    ticker: 'TCC',
    companyName: 'Tanzania Cigarette Company',
    currentPrice: 17000,
    sector: 'Manufacturing',
    dividendYieldPct: 8.0,
    dayChangePct: 0.0,
    marketCapBlnTZS: 1700.0,
    peRatio: 10.2,
    description: 'High cash-generative tobacco manufacturing leader under Japan Tobacco International.',
  },
  MBP: {
    ticker: 'MBP',
    companyName: 'Mwalimu Commercial Bank Plc',
    currentPrice: 310,
    sector: 'Banking',
    dividendYieldPct: 3.5,
    dayChangePct: 0.0,
    marketCapBlnTZS: 15.5,
    peRatio: 12.0,
    description: 'Commercial bank initially established by the Tanzania Teachers Union.',
  },
  PAL: {
    ticker: 'PAL',
    companyName: 'Precision Air Services Plc',
    currentPrice: 400,
    sector: 'Financial Services',
    dividendYieldPct: 0.0,
    dayChangePct: 0.0,
    marketCapBlnTZS: 64.0,
    peRatio: 0,
    description: 'Domestic airline operator connecting Dar es Salaam, Zanzibar, Arusha, and Mwanza.',
  },
  EABL: {
    ticker: 'EABL',
    companyName: 'East African Breweries Limited',
    currentPrice: 2900,
    sector: 'Manufacturing',
    dividendYieldPct: 5.5,
    dayChangePct: 0.8,
    marketCapBlnTZS: 2200.0,
    peRatio: 13.0,
    isCrossListed: true,
    description: 'Cross-listed regional beverage conglomerate (Serengeti Breweries parent).',
  },
  KCB: {
    ticker: 'KCB',
    companyName: 'KCB Group Plc',
    currentPrice: 480,
    sector: 'Banking',
    dividendYieldPct: 6.8,
    dayChangePct: -0.5,
    marketCapBlnTZS: 1500.0,
    peRatio: 4.5,
    isCrossListed: true,
    description: 'Cross-listed East African financial services holding group.',
  },
  JHL: {
    ticker: 'JHL',
    companyName: 'Jubilee Holdings Limited',
    currentPrice: 3600,
    sector: 'Financial Services',
    dividendYieldPct: 6.0,
    dayChangePct: 0.0,
    marketCapBlnTZS: 260.0,
    peRatio: 5.9,
    isCrossListed: true,
    description: 'Premier composite insurance and asset management company across East Africa.',
  },
};

export const ALL_DSE_STOCKS: DSEMarketQuote[] = Object.values(OFFICIAL_DSE_QUOTES);

export function getOfficialDSEQuote(ticker: string): DSEMarketQuote | undefined {
  const norm = ticker.trim().toUpperCase();
  return OFFICIAL_DSE_QUOTES[norm];
}

export function getOfficialDSEPrice(ticker: string): number | undefined {
  const quote = getOfficialDSEQuote(ticker);
  return quote?.currentPrice;
}
