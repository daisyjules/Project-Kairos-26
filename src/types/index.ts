export interface AllocationBreakdown {
  startingCapital: number;
  utt: number;
  klinFitz: number;
  zanzibarAirbnb: number;
  momsPoultry: number;
  car: number;
  laptop: number;
  cashReserve: number; // remaining or manual override
  customAllocations?: { id: string; name: string; amount: number; isProductive: boolean }[];
}

export type ScenarioType = 'conservative' | 'base' | 'optimistic';

export interface KlinFitzModel {
  initialCapital: number;
  equipmentCost: number;
  rentDeposit: number;
  waterPlumbing: number;
  detergentsInitial: number;
  packagingInitial: number;
  brandingSignage: number;
  workingCapital: number;
  
  // Operational inputs
  ordersPerDay: number;
  avgRevenuePerOrder: number;
  operatingDaysPerMonth: number;
  variableCostPerOrder: number;
  
  // Fixed monthly costs
  staffCost: number;
  utilitiesCost: number;
  transportPickupCost: number;
  otherFixedCosts: number;

  // Hospitality / Linen Contracts
  enableHospitalityContracts: boolean;
  hospitalityContractRevenue: number;
  hospitalityContractVariableCost: number;

  // Active scenario preset
  activeScenario: ScenarioType;
}

export interface ZanzibarAirbnbModel {
  totalStartupCost: number;
  userContribution: number;
  aliceContribution: number;
  otherPartnerContribution: number;
  userOwnershipPct: number; // e.g. 50%
  
  nightlyPrice: number;
  bookedNightsPerMonth: number;
  availableNightsPerMonth: number;
  occupancyPct: number; // 0 to 100
  cleaningFeePerStay: number;
  avgStaysPerMonth: number;
  platformFeePct: number; // e.g. 15%
  
  // Monthly fixed/operating expenses
  monthlyRent: number;
  monthlyUtilities: number;
  monthlyInternet: number;
  monthlyCleaning: number;
  monthlyMaintenance: number;
  monthlySupplies: number;
  otherMonthlyCosts: number;

  notes: string;
}

export interface PoultryCycle {
  cycleNumber: number;
  flockSize: number;
  costPerChick: number;
  feedCost: number;
  medsCost: number;
  mortalityRatePct: number;
  sellingPricePerBird: number;
  reinvestProfitPct: number;
}

export interface PoultryModel {
  initialCapital: number;
  numChicks: number;
  costPerChick: number;
  feedCost: number;
  vaccinationMedicine: number;
  housingCoop: number;
  feedersDrinkers: number;
  beddingCost: number;
  transportCost: number;
  otherCosts: number;
  mortalityRatePct: number;
  expectedSellingAgeWeeks: number;
  expectedSellingPrice: number;
  cyclesPerYear: number;
  
  // Cycle modeling
  cycles: PoultryCycle[];
}

export interface UTTModel {
  investmentAmount: number;
  expectedAnnualReturnPct: number;
  investmentPeriodYears: number;
  monthlyContribution: number;
  reinvestReturns: boolean;
  fundName: string;
  fundType?: 'liquid' | 'umoja' | 'wekeza' | 'jikimu' | 'watoto';
  isLiquid?: boolean;
  liquidityTurnaroundDays?: number;
}

export interface CarModel {
  purchasePrice: number;
  insurance: number;
  registration: number;
  initialRepairs: number;
  initialServicing: number;
  tyres: number;
  otherInitialCosts: number;
  monthlyFuel: number;
  monthlyMaintenance: number;
  
  // Utility checklist
  useForKlinFitz: boolean;
  useForSuppliers: boolean;
  useForAirbnb: boolean;
  useForPoultry: boolean;
  useForPersonal: boolean;
}

export interface LaptopModel {
  purchasePrice: number;
  budgetCap: number; // 1,000,000
  brandModel: string;
  primaryUse: string;
}

export interface LoanModel {
  principal: number;
  actualNetCashReceived: number;
  monthlyRepayment: number;
  tenureMonths: number;
  interestRateAnnualPct: number;
  originationFees: number;
  insuranceCost: number;
  startDate: string;
}

export interface SteazyFutureProduct {
  id: string;
  name: string; // 'Totes' | 'Caps' | 'Sneakers' | 'Hoodies'
  targetLaunchQuarter: string;
  targetSellingPrice: number;
  targetUnitCost: number;
  status: 'Idea' | 'Prototyping' | 'Sampling' | 'Ready';
  notes: string;
}

export interface SteazyModel {
  initialCapital: number;
  monthlyOperatingExpenses: number;
  tshirtsProducedPerMonth: number;
  blankCostPerUnit: number;
  printingCostPerUnit: number;
  tagPackagingCostPerUnit: number;
  retailSellingPrice: number;
  wholesaleSellingPrice: number;
  retailSalesPct: number; // e.g. 80 means 80% retail, 20% wholesale
  futureProducts: SteazyFutureProduct[];
}

export interface DSEStockHolding {
  id: string;
  ticker: string; // e.g. 'CRDB', 'NMB', 'TBL', 'TPCC', 'VODA', 'DSE'
  companyName: string;
  sharesHeld: number;
  buyPrice: number; // TZS
  currentPrice: number; // TZS
  dividendYieldPct: number; // e.g. 8.5%
  dayChangePct: number; // e.g. +1.8%
  sector: 'Banking' | 'Manufacturing' | 'Telecom' | 'Financial Services' | 'Energy' | 'Consumer Goods';
  officialDSEPrice?: number;
}

export interface DSEPortfolioModel {
  holdings: DSEStockHolding[];
  cashBalance: number; // Uninvested cash in trading account
  lastUpdated: string;
  milestonesReached: number[]; // e.g. [5000000, 6000000, 10000000]
  userMilestoneDecision?: {
    milestone: number;
    decision: 'withdraw' | 'reinvest_utt' | 'hold_compound';
    timestamp: string;
  };
  reflectLiveDSEPricing?: boolean;
  targetTotalValuation?: number;
  lastNotifiedMilestone?: number;
}

export interface AppNotification {
  id: string;
  type: 'milestone' | 'dividend' | 'savings' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    milestoneAmount?: number;
    portfolioValue?: number;
    actionTab?: string;
  };
}

export interface NotificationSettings {
  enableSound: boolean;
  enableBrowserPush: boolean;
  enableCelebrationModal: boolean;
  customMilestoneThresholds: number[];
}

export interface SalarySavingsModel {
  monthlyNetSalary: number;
  monthlyLivingExpenses: number;
  loanRepaymentDeduction: number;
  monthlyAllocatedToDSE: number;
  monthlyAllocatedToUTT: number;
  monthlyAllocatedToEmergency: number;
  savingsGoalMonths: number;
  historicalSavingsTotal: number;
}

export interface RetroAtelierModel {
  isIncludedInAllocation: boolean;
  status: 'Planning' | 'Building' | 'Operating';
  startupCost: number;
  furniture: number;
  turntableAudio: number;
  decorAesthetics: number;
  rentDeposit: number;
  monthlyRent: number;
  monthlyUtilities: number;
  nightlyRate: number;
  occupancyPct: number;
  monthlyOperatingExpenses: number;
  notes: string;
}

export interface MonthlyRecord {
  monthIndex: number; // 0 = Jan, 11 = Dec
  monthName: string;
  revenue: number;
  expenses: number;
  profit: number;
  loanPayment: number;
  personalContribution: number;
  businessReinvestment: number;
  investmentContribution: number;
  cashReserve: number;
  assetsPurchased: string;
  isActual: boolean; // true = logged actuals, false = projection
}

export interface RoadmapItem {
  id: string;
  period: string;
  title: string;
  milestones: { id: string; text: string; completed: boolean }[];
  focus: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface CommentItem {
  id: string;
  targetId: string; // e.g. entry id or venture id
  author: string;
  content: string;
  createdAt: string;
  pinColor?: 'gold' | 'emerald' | 'coral' | 'indigo';
}

export interface PinnedNote {
  id: string;
  target: 'overview' | 'klinfitz' | 'zanzibar' | 'poultry' | 'utt' | 'loan' | 'diary';
  title: string;
  content: string;
  pinColor: 'gold' | 'emerald' | 'coral' | 'indigo';
  createdAt: string;
  author: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  category: 'Reflection' | 'Klin Fitz' | 'Zanzibar' | 'Poultry' | 'Wealth' | 'Personal';
  content: string;
  mood?: '🌱 Calm' | '✨ Inspired' | '🔥 Focused' | '🛡️ Cautious' | '🎉 Celebratory';
  isPinned?: boolean;
  comments?: CommentItem[];
}

export type TabKey =
  | 'dashboard'
  | 'diary'
  | 'klinfitz'
  | 'steazy'
  | 'zanzibar'
  | 'poultry'
  | 'mama_kubwa'
  | 'dse'
  | 'salary_savings'
  | 'utt'
  | 'loan'
  | 'allocation'
  | 'car_laptop'
  | 'retro_atelier'
  | 'apex_ecosystem'
  | 'roadmap'
  | 'monthly_tracker';

export interface KairosState {
  theme?: 'light';
  activeTab: TabKey;
  heroQuote: {
    text: string;
    author: string;
  };
  allocations: AllocationBreakdown;
  klinFitz: KlinFitzModel;
  steazy: SteazyModel;
  zanzibarAirbnb: ZanzibarAirbnbModel;
  poultry: PoultryModel;
  dsePortfolio: DSEPortfolioModel;
  salarySavings: SalarySavingsModel;
  utt: UTTModel;
  car: CarModel;
  laptop: LaptopModel;
  loan: LoanModel;
  retroAtelier: RetroAtelierModel;
  monthlyRecords: MonthlyRecord[];
  roadmap: RoadmapItem[];
  diaryEntries: DiaryEntry[];
  pinnedNotes: PinnedNote[];
  comments: CommentItem[];
  currency: string;
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
}
