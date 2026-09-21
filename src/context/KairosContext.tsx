import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  KairosState,
  AllocationBreakdown,
  KlinFitzModel,
  ZanzibarAirbnbModel,
  PoultryModel,
  UTTModel,
  CarModel,
  LaptopModel,
  LoanModel,
  RetroAtelierModel,
  MonthlyRecord,
  RoadmapItem,
  DiaryEntry,
  CommentItem,
  PinnedNote,
  ScenarioType,
  TabKey,
} from '../types';
import {
  calculateKlinFitz,
  calculateZanzibarAirbnb,
  calculatePoultry,
  calculateUTT,
  calculateCar,
  calculateLoan,
  calculateMasterDashboard,
  KlinFitzCalculations,
  ZanzibarCalculations,
  PoultryCalculations,
  UTTCalculations,
  CarCalculations,
  LoanCalculations,
  MasterCalculations,
} from '../utils/calculations';

const STORAGE_KEY = 'project_kairos_26_state_v1';

export const INITIAL_STATE: KairosState = {
  theme: 'light',
  activeTab: 'dashboard',
  currency: 'TZS',
  heroQuote: {
    text: '“Pole pole ndio mwendo — slow and steady is the way. Move deliberately. Let the monthly surplus protect our peace.”',
    author: 'Mom’s advice & Kairos Principle',
  },
  allocations: {
    startingCapital: 30_000_000,
    utt: 10_000_000,
    klinFitz: 5_000_000,
    zanzibarAirbnb: 3_000_000,
    momsPoultry: 1_500_000,
    car: 8_500_000,
    laptop: 950_000,
    cashReserve: 1_050_000,
    customAllocations: [],
  },
  klinFitz: {
    initialCapital: 5_000_000,
    equipmentCost: 2_700_000,
    rentDeposit: 800_000,
    waterPlumbing: 400_000,
    detergentsInitial: 250_000,
    packagingInitial: 150_000,
    brandingSignage: 200_000,
    workingCapital: 500_000,
    ordersPerDay: 15,
    avgRevenuePerOrder: 12_000,
    operatingDaysPerMonth: 26,
    variableCostPerOrder: 3_500,
    staffCost: 350_000,
    utilitiesCost: 180_000,
    transportPickupCost: 120_000,
    otherFixedCosts: 70_000,
    enableHospitalityContracts: false,
    hospitalityContractRevenue: 450_000,
    hospitalityContractVariableCost: 120_000,
    activeScenario: 'base',
  },
  zanzibarAirbnb: {
    totalStartupCost: 6_000_000,
    userContribution: 3_000_000,
    aliceContribution: 3_000_000,
    otherPartnerContribution: 0,
    userOwnershipPct: 50,
    nightlyPrice: 125_000,
    bookedNightsPerMonth: 15,
    availableNightsPerMonth: 30,
    occupancyPct: 50,
    cleaningFeePerStay: 35_000,
    avgStaysPerMonth: 5,
    platformFeePct: 15,
    monthlyRent: 450_000,
    monthlyUtilities: 120_000,
    monthlyInternet: 70_000,
    monthlyCleaning: 35_000,
    monthlyMaintenance: 60_000,
    monthlySupplies: 50_000,
    otherMonthlyCosts: 30_000,
    notes: 'Joint venture with Alice. 50/50 profit split. Written agreement executed prior to capital deployment.',
  },
  poultry: {
    initialCapital: 1_500_000,
    numChicks: 200,
    costPerChick: 2_000,
    feedCost: 680_000,
    vaccinationMedicine: 110_000,
    housingCoop: 250_000,
    feedersDrinkers: 70_000,
    beddingCost: 25_000,
    transportCost: 35_000,
    otherCosts: 30_000,
    mortalityRatePct: 6,
    expectedSellingAgeWeeks: 8,
    expectedSellingPrice: 10_500,
    cyclesPerYear: 4,
    cycles: [
      {
        cycleNumber: 1,
        flockSize: 200,
        costPerChick: 2000,
        feedCost: 680000,
        medsCost: 110000,
        mortalityRatePct: 6,
        sellingPricePerBird: 10500,
        reinvestProfitPct: 50,
      },
      {
        cycleNumber: 2,
        flockSize: 250,
        costPerChick: 2000,
        feedCost: 820000,
        medsCost: 130000,
        mortalityRatePct: 5,
        sellingPricePerBird: 10500,
        reinvestProfitPct: 50,
      },
      {
        cycleNumber: 3,
        flockSize: 320,
        costPerChick: 2000,
        feedCost: 1020000,
        medsCost: 160000,
        mortalityRatePct: 5,
        sellingPricePerBird: 11000,
        reinvestProfitPct: 60,
      },
      {
        cycleNumber: 4,
        flockSize: 400,
        costPerChick: 2000,
        feedCost: 1250000,
        medsCost: 190000,
        mortalityRatePct: 4,
        sellingPricePerBird: 11000,
        reinvestProfitPct: 60,
      },
    ],
  },
  utt: {
    investmentAmount: 10_000_000,
    expectedAnnualReturnPct: 13.5,
    investmentPeriodYears: 10,
    monthlyContribution: 0,
    reinvestReturns: true,
    fundName: 'UTT AMIS Liquid / Bond Fund',
  },
  car: {
    purchasePrice: 8_500_000,
    insurance: 450_000,
    registration: 250_000,
    initialRepairs: 450_000,
    initialServicing: 150_000,
    tyres: 300_000,
    otherInitialCosts: 50_000,
    monthlyFuel: 220_000,
    monthlyMaintenance: 80_000,
    useForKlinFitz: true,
    useForSuppliers: true,
    useForAirbnb: true,
    useForPoultry: true,
    useForPersonal: true,
  },
  laptop: {
    purchasePrice: 950_000,
    budgetCap: 1_000_000,
    brandModel: 'ThinkPad T480 / MacBook Refurb',
    primaryUse: 'Financial modeling, dispatch management, Airbnb guest messaging, business ops',
  },
  loan: {
    principal: 30_000_000,
    actualNetCashReceived: 28_800_000,
    monthlyRepayment: 950_000,
    tenureMonths: 48,
    interestRateAnnualPct: 18.5,
    originationFees: 800_000,
    insuranceCost: 400_000,
    startDate: '2026-03-01',
  },
  retroAtelier: {
    isIncludedInAllocation: false,
    status: 'Planning',
    startupCost: 7_500_000,
    furniture: 3_200_000,
    turntableAudio: 900_000,
    decorAesthetics: 800_000,
    rentDeposit: 1_800_000,
    monthlyRent: 550_000,
    monthlyUtilities: 140_000,
    nightlyRate: 140_000,
    occupancyPct: 45,
    monthlyOperatingExpenses: 690_000,
    notes: 'Spaces by Kairos concept. Distinct boutique listening & creative residency stay. Future expansion after month 6 review.',
  },
  monthlyRecords: [
    { monthIndex: 0, monthName: 'Jan', revenue: 0, expenses: 0, profit: 0, loanPayment: 0, personalContribution: 0, businessReinvestment: 0, investmentContribution: 0, cashReserve: 1050000, assetsPurchased: 'Planning & loan paperwork', isActual: true },
    { monthIndex: 1, monthName: 'Feb', revenue: 0, expenses: 0, profit: 0, loanPayment: 0, personalContribution: 0, businessReinvestment: 0, investmentContribution: 0, cashReserve: 1050000, assetsPurchased: 'Loan approval & account setup', isActual: true },
    { monthIndex: 2, monthName: 'Mar (M1)', revenue: 1450000, expenses: 1020000, profit: 430000, loanPayment: 950000, personalContribution: 520000, businessReinvestment: 100000, investmentContribution: 0, cashReserve: 1050000, assetsPurchased: 'Klin Fitz equipment, Laptop', isActual: false },
    { monthIndex: 3, monthName: 'Apr (M2)', revenue: 2900000, expenses: 1680000, profit: 1220000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 270000, investmentContribution: 0, cashReserve: 1100000, assetsPurchased: 'Poultry chicks & feed', isActual: false },
    { monthIndex: 4, monthName: 'May (M3)', revenue: 3850000, expenses: 2150000, profit: 1700000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 600000, investmentContribution: 150000, cashReserve: 1200000, assetsPurchased: 'Car acquired, Airbnb live', isActual: false },
    { monthIndex: 5, monthName: 'Jun (M4)', revenue: 4400000, expenses: 2350000, profit: 2050000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 800000, investmentContribution: 300000, cashReserve: 1300000, assetsPurchased: 'Klin Fitz linen supplies', isActual: false },
    { monthIndex: 6, monthName: 'Jul (M5)', revenue: 4750000, expenses: 2450000, profit: 2300000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 900000, investmentContribution: 450000, cashReserve: 1400000, assetsPurchased: 'Poultry cycle 2 expansion', isActual: false },
    { monthIndex: 7, monthName: 'Aug (M6)', revenue: 5100000, expenses: 2550000, profit: 2550000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 1000000, investmentContribution: 600000, cashReserve: 1500000, assetsPurchased: 'Mid-year audit & UTT boost', isActual: false },
    { monthIndex: 8, monthName: 'Sep (M7)', revenue: 5400000, expenses: 2650000, profit: 2750000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 1100000, investmentContribution: 700000, cashReserve: 1650000, assetsPurchased: 'Klin Fitz pickup upgrade', isActual: false },
    { monthIndex: 9, monthName: 'Oct (M8)', revenue: 5650000, expenses: 2720000, profit: 2930000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 1200000, investmentContribution: 780000, cashReserve: 1800000, assetsPurchased: 'Poultry cycle 3 batch', isActual: false },
    { monthIndex: 10, monthName: 'Nov (M9)', revenue: 5900000, expenses: 2800000, profit: 3100000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 1300000, investmentContribution: 850000, cashReserve: 1950000, assetsPurchased: 'High season Zanzibar prep', isActual: false },
    { monthIndex: 11, monthName: 'Dec (M10)', revenue: 6400000, expenses: 2950000, profit: 3450000, loanPayment: 950000, personalContribution: 0, businessReinvestment: 1500000, investmentContribution: 1000000, cashReserve: 2200000, assetsPurchased: 'Holiday peak & annual review', isActual: false },
  ],
  roadmap: [
    {
      id: 'm1',
      period: 'MONTH 1',
      title: 'Foundation & Capital Ingress',
      focus: 'Preserve reserve, establish core entities, confirm JV terms in writing',
      status: 'in_progress',
      milestones: [
        { id: 'm1-1', text: 'Finalize loan disbursement & lock starting capital of TZS 30M in bank', completed: true },
        { id: 'm1-2', text: 'Ringfence minimum cash reserve before any discretionary spending', completed: true },
        { id: 'm1-3', text: 'Setup Klin Fitz laundry physical location, plumbing & washer procurement', completed: false },
        { id: 'm1-4', text: 'Establish Mom’s poultry pilot coop infrastructure and order 200 chicks', completed: false },
        { id: 'm1-5', text: 'Execute written Zanzibar JV agreement with Alice (equity, responsibilities, exit)', completed: false },
      ],
    },
    {
      id: 'm2',
      period: 'MONTH 2',
      title: 'Operational Launch',
      focus: 'Initial operations, initial marketing, test supply chains',
      status: 'pending',
      milestones: [
        { id: 'm2-1', text: 'Official launch of Klin Fitz laundry operations with Mother', completed: false },
        { id: 'm2-2', text: 'Commence Poultry Pilot Cycle 1 (brooding, vaccinations, daily mortality tracking)', completed: false },
        { id: 'm2-3', text: 'Prepare & furnish Zanzibar Airbnb unit for listing on OTA channels', completed: false },
        { id: 'm2-4', text: 'Maintain strict expenditure logging on laptop command center', completed: false },
      ],
    },
    {
      id: 'm3',
      period: 'MONTH 3',
      title: 'Measure & Validate',
      focus: 'Do not expand yet. Measure real unit economics vs assumptions',
      status: 'pending',
      milestones: [
        { id: 'm3-1', text: 'Measure Klin Fitz actual orders/day vs break-even requirement (15 orders/day target)', completed: false },
        { id: 'm3-2', text: 'Measure Poultry Cycle 1 harvest weight, feed conversion, and final mortality rate', completed: false },
        { id: 'm3-3', text: 'Launch & calibrate Zanzibar Airbnb live calendar (target initial 40–50% occupancy)', completed: false },
        { id: 'm3-4', text: 'Verify first full month debt service payment covered by business cash flows', completed: false },
      ],
    },
    {
      id: 'm4_6',
      period: 'MONTHS 4–6',
      title: 'Optimization & Synergy',
      focus: 'Improve pricing, build repeat customers, pursue B2B contracts',
      status: 'pending',
      milestones: [
        { id: 'm4-1', text: 'Refine Klin Fitz pricing tiers and institute regular repeat subscription plans', completed: false },
        { id: 'm4-2', text: 'Pursue Airbnb, hotel, and local office linen B2B laundry contracts for Klin Fitz', completed: false },
        { id: 'm4-3', text: 'Reinvest only proven profits into Poultry Cycle 2 expansion (250–300 birds)', completed: false },
        { id: 'm4-4', text: 'Month 6 Major Financial Review: Audit DSCR, capital reserves, and ROI', completed: false },
      ],
    },
    {
      id: 'm7_9',
      period: 'MONTHS 7–9',
      title: 'Selective Scaling',
      focus: 'Double down on the highest ROIC business engine',
      status: 'pending',
      milestones: [
        { id: 'm7-1', text: 'Scale the strongest cash-flowing business engine based on proven data', completed: false },
        { id: 'm7-2', text: 'Evaluate launching dedicated pickup/delivery route using the utility vehicle', completed: false },
        { id: 'm7-3', text: 'Automate weekly operational reporting with Mom and Alice', completed: false },
      ],
    },
    {
      id: 'm10_12',
      period: 'MONTHS 10–12',
      title: 'Annual Review & APEX Expansion',
      focus: 'Year-end consolidation, debt reduction, and next-phase capital deployment',
      status: 'pending',
      milestones: [
        { id: 'm10-1', text: 'Complete 12-month comprehensive audit: Revenue, profit, debt paid down, UTT gains', completed: false },
        { id: 'm10-2', text: 'Strategic decision: Expand Klin Fitz branch or scale poultry to commercial farm', completed: false },
        { id: 'm10-3', text: 'Evaluate Spaces by Kairos (Retro Atelier boutique property launch)', completed: false },
        { id: 'm10-4', text: 'Increase recurring contributions into UTT wealth preservation fund', completed: false },
      ],
    },
  ],
  diaryEntries: [
    {
      id: 'entry-1',
      date: '2026-03-01',
      title: 'The Genesis: Why 30M is our turning point',
      category: 'Reflection',
      mood: '✨ Inspired',
      content:
        'Today we drew the map for Project Kairos 26. 30 million shillings is a significant responsibility, but dividing it into clear nodes—Klin Fitz with Mom, Zanzibar Airbnb with Alice, and preserving a solid 10M in UTT plus safety buffer—gives immense peace of mind. Not gambling, not rushing. Building steady cashflow engines.',
    },
    {
      id: 'entry-2',
      date: '2026-03-05',
      title: "Mom's smile & the 200-chick pilot agreement",
      category: 'Poultry',
      mood: '🌱 Calm',
      content:
        'Sat down over chai with Mom to review the poultry pilot. We agreed to start with 200 broilers rather than overcommitting to 1,000 birds right away. She smiled and said "pole pole ndio mwendo" (slow and steady is the way). We will measure feed conversion and mortality over cycle 1 before reinvesting.',
    },
    {
      id: 'entry-3',
      date: '2026-03-10',
      title: 'Klin Fitz: First wash cycle & laundry branding',
      category: 'Klin Fitz',
      mood: '🔥 Focused',
      content:
        'Inspected the washing equipment and delivery hampers today. Clean white linens, gentle soap scent. Break-even requires just 15 orders a day. With pickup runs and local guest houses, we have a clear path to profitability.',
    },
    {
      id: 'entry-4',
      date: '2026-03-18',
      title: 'Zanzibar JV terms locked with Alice',
      category: 'Zanzibar',
      mood: '🌱 Calm',
      content:
        'Signed the 50/50 partnership agreement for the Stone Town guest apartment. Our capital contribution stays capped at 5M. At 50% occupancy, the passive dividend of ~800k/month covers nearly the entire monthly loan service on its own!',
    },
    {
      id: 'entry-5',
      date: '2026-03-24',
      title: 'Financial rules to live by this year',
      category: 'Personal',
      mood: '🛡️ Cautious',
      isPinned: true,
      content:
        'Rule 1: Never touch the liquid safety reserve for lifestyle.\nRule 2: Keep DSCR above 1.5x at all times.\nRule 3: Reinvest 50% of poultry and laundry surplus into UTT compounding.\nRule 4: Write in this diary weekly to stay grounded.',
    },
  ],
  pinnedNotes: [
    {
      id: 'pin-1',
      target: 'overview',
      title: 'Golden Rule #1: The Safety Cushion',
      content: 'Never dip below 4,000,000 TZS liquid emergency reserve. It shields us against seasonal dips and loan payments.',
      pinColor: 'gold',
      createdAt: '2026-03-01',
      author: 'Founder Memo',
    },
    {
      id: 'pin-2',
      target: 'klinfitz',
      title: 'Pickup Run Timing',
      content: 'Morning residential drop-offs before 10 AM, evening commercial guest house laundry collections at 5 PM.',
      pinColor: 'emerald',
      createdAt: '2026-03-05',
      author: 'Operations Note',
    },
    {
      id: 'pin-3',
      target: 'zanzibar',
      title: 'Alice Contact & High Season Check',
      content: 'Review July-August booked calendar with Alice by May 15. Ensure backup power inverter is serviced.',
      pinColor: 'coral',
      createdAt: '2026-03-12',
      author: 'JV Agreement',
    },
    {
      id: 'pin-4',
      target: 'poultry',
      title: 'Feed Conversion Target',
      content: 'Aim for <1.8 FCR in Cycle 1. Weigh 10 random chicks weekly on Sunday mornings with Mom.',
      pinColor: 'gold',
      createdAt: '2026-03-15',
      author: 'Mom & I',
    },
  ],
  comments: [
    {
      id: 'c-1',
      targetId: 'entry-1',
      author: 'Self Reflection',
      content: 'Remember that staying disciplined in month 1 sets the tone for the entire 3-year arc.',
      createdAt: '2026-03-02',
      pinColor: 'emerald',
    },
    {
      id: 'c-2',
      targetId: 'overview',
      author: 'Mom',
      content: 'Tuanze taratibu mwanangu, Mungu atabariki kazi ya mikono yetu.',
      createdAt: '2026-03-06',
      pinColor: 'gold',
    },
  ],
};

interface KairosContextType {
  state: KairosState;
  setActiveTab: (tab: TabKey) => void;
  // Updaters
  updateHeroQuote: (quote: { text: string; author: string }) => void;
  updateAllocations: (allocations: Partial<AllocationBreakdown>) => void;
  updateKlinFitz: (klinFitz: Partial<KlinFitzModel>) => void;
  applyKlinFitzScenario: (scenario: ScenarioType) => void;
  updateZanzibar: (zanzibar: Partial<ZanzibarAirbnbModel>) => void;
  updatePoultry: (poultry: Partial<PoultryModel>) => void;
  updatePoultryCycle: (index: number, cycle: Partial<PoultryModel['cycles'][0]>) => void;
  updateUTT: (utt: Partial<UTTModel>) => void;
  updateCar: (car: Partial<CarModel>) => void;
  updateLaptop: (laptop: Partial<LaptopModel>) => void;
  updateLoan: (loan: Partial<LoanModel>) => void;
  updateRetroAtelier: (retro: Partial<RetroAtelierModel>) => void;
  updateMonthlyRecord: (monthIndex: number, record: Partial<MonthlyRecord>) => void;
  toggleMilestone: (roadmapId: string, milestoneId: string) => void;
  
  // Diary & Comments & Pins
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  updateDiaryEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteDiaryEntry: (id: string) => void;
  togglePinDiaryEntry: (id: string) => void;
  addCommentToDiaryEntry: (entryId: string, comment: { author: string; content: string; pinColor?: 'gold' | 'emerald' | 'coral' | 'indigo' }) => void;
  deleteCommentFromDiaryEntry: (entryId: string, commentId: string) => void;
  
  // Pinned Notes & Sticky comments
  addPinnedNote: (note: Omit<PinnedNote, 'id' | 'createdAt'>) => void;
  updatePinnedNote: (id: string, note: Partial<PinnedNote>) => void;
  deletePinnedNote: (id: string) => void;
  addGeneralComment: (comment: Omit<CommentItem, 'id' | 'createdAt'>) => void;
  deleteGeneralComment: (id: string) => void;

  toggleTheme: () => void;
  resetToDefaults: () => void;
  exportStateJSON: () => string;
  importStateJSON: (json: string) => boolean;

  // Calculated models
  klinFitzCalc: KlinFitzCalculations;
  zanzibarCalc: ZanzibarCalculations;
  poultryCalc: PoultryCalculations;
  uttCalc: UTTCalculations;
  carCalc: CarCalculations;
  loanCalc: LoanCalculations;
  masterCalc: MasterCalculations;
}

const KairosContext = createContext<KairosContextType | undefined>(undefined);

export const KairosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<KairosState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          allocations: { ...INITIAL_STATE.allocations, ...(parsed.allocations || {}) },
          klinFitz: { ...INITIAL_STATE.klinFitz, ...(parsed.klinFitz || {}) },
          zanzibarAirbnb: { ...INITIAL_STATE.zanzibarAirbnb, ...(parsed.zanzibarAirbnb || {}) },
          poultry: { ...INITIAL_STATE.poultry, ...(parsed.poultry || {}) },
          utt: { ...INITIAL_STATE.utt, ...(parsed.utt || {}) },
          car: { ...INITIAL_STATE.car, ...(parsed.car || {}) },
          laptop: { ...INITIAL_STATE.laptop, ...(parsed.laptop || {}) },
          loan: { ...INITIAL_STATE.loan, ...(parsed.loan || {}) },
          retroAtelier: { ...INITIAL_STATE.retroAtelier, ...(parsed.retroAtelier || {}) },
          heroQuote: parsed.heroQuote || INITIAL_STATE.heroQuote,
          diaryEntries: parsed.diaryEntries || INITIAL_STATE.diaryEntries,
          pinnedNotes: parsed.pinnedNotes || INITIAL_STATE.pinnedNotes,
          comments: parsed.comments || INITIAL_STATE.comments,
        };
      }
    } catch (e) {
      console.error('Failed to load Kairos state from localStorage:', e);
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save Kairos state to localStorage:', e);
    }
  }, [state]);

  // Ensure document always uses warm neutral aesthetic
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.className = 'bg-[#FAF8F5] text-[#242220] antialiased selection:bg-[#2D4A3E] selection:text-[#FAF8F5] transition-colors duration-200';
  }, []);

  // Synchronize allocation amounts when project capitals change
  const updateAllocations = (allocations: Partial<AllocationBreakdown>) => {
    setState((prev) => {
      const nextAlloc = { ...prev.allocations, ...allocations };
      // auto calculate remaining reserve
      const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
      const allocated =
        nextAlloc.utt +
        nextAlloc.klinFitz +
        nextAlloc.zanzibarAirbnb +
        nextAlloc.momsPoultry +
        nextAlloc.car +
        nextAlloc.laptop +
        customTotal;
      nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);

      // sync initial capital values if updated from allocation
      const nextKlin = allocations.klinFitz !== undefined ? { ...prev.klinFitz, initialCapital: allocations.klinFitz } : prev.klinFitz;
      const nextZanzibar = allocations.zanzibarAirbnb !== undefined ? { ...prev.zanzibarAirbnb, userContribution: allocations.zanzibarAirbnb } : prev.zanzibarAirbnb;
      const nextPoultry = allocations.momsPoultry !== undefined ? { ...prev.poultry, initialCapital: allocations.momsPoultry } : prev.poultry;
      const nextUtt = allocations.utt !== undefined ? { ...prev.utt, investmentAmount: allocations.utt } : prev.utt;
      const nextCar = allocations.car !== undefined ? { ...prev.car, purchasePrice: allocations.car } : prev.car;
      const nextLaptop = allocations.laptop !== undefined ? { ...prev.laptop, purchasePrice: allocations.laptop } : prev.laptop;

      return {
        ...prev,
        allocations: nextAlloc,
        klinFitz: nextKlin,
        zanzibarAirbnb: nextZanzibar,
        poultry: nextPoultry,
        utt: nextUtt,
        car: nextCar,
        laptop: nextLaptop,
      };
    });
  };

  const updateKlinFitz = (klinFitz: Partial<KlinFitzModel>) => {
    setState((prev) => {
      const next = { ...prev.klinFitz, ...klinFitz };
      const nextAlloc = { ...prev.allocations };
      if (klinFitz.initialCapital !== undefined) {
        nextAlloc.klinFitz = klinFitz.initialCapital;
        const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
        const allocated =
          nextAlloc.utt +
          nextAlloc.klinFitz +
          nextAlloc.zanzibarAirbnb +
          nextAlloc.momsPoultry +
          nextAlloc.car +
          nextAlloc.laptop +
          customTotal;
        nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);
      }
      return { ...prev, klinFitz: next, allocations: nextAlloc };
    });
  };

  const applyKlinFitzScenario = (scenario: ScenarioType) => {
    setState((prev) => {
      let ordersPerDay = 15;
      let avgRevenuePerOrder = 12000;
      let variableCostPerOrder = 3500;

      if (scenario === 'conservative') {
        ordersPerDay = 8;
        avgRevenuePerOrder = 10000;
        variableCostPerOrder = 3800;
      } else if (scenario === 'optimistic') {
        ordersPerDay = 25;
        avgRevenuePerOrder = 14000;
        variableCostPerOrder = 3200;
      }

      return {
        ...prev,
        klinFitz: {
          ...prev.klinFitz,
          activeScenario: scenario,
          ordersPerDay,
          avgRevenuePerOrder,
          variableCostPerOrder,
        },
      };
    });
  };

  const updateZanzibar = (zanzibar: Partial<ZanzibarAirbnbModel>) => {
    setState((prev) => {
      const next = { ...prev.zanzibarAirbnb, ...zanzibar };
      const nextAlloc = { ...prev.allocations };
      if (zanzibar.userContribution !== undefined) {
        nextAlloc.zanzibarAirbnb = zanzibar.userContribution;
        const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
        const allocated =
          nextAlloc.utt +
          nextAlloc.klinFitz +
          nextAlloc.zanzibarAirbnb +
          nextAlloc.momsPoultry +
          nextAlloc.car +
          nextAlloc.laptop +
          customTotal;
        nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);
      }
      return { ...prev, zanzibarAirbnb: next, allocations: nextAlloc };
    });
  };

  const updatePoultry = (poultry: Partial<PoultryModel>) => {
    setState((prev) => {
      const next = { ...prev.poultry, ...poultry };
      const nextAlloc = { ...prev.allocations };
      if (poultry.initialCapital !== undefined) {
        nextAlloc.momsPoultry = poultry.initialCapital;
        const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
        const allocated =
          nextAlloc.utt +
          nextAlloc.klinFitz +
          nextAlloc.zanzibarAirbnb +
          nextAlloc.momsPoultry +
          nextAlloc.car +
          nextAlloc.laptop +
          customTotal;
        nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);
      }
      return { ...prev, poultry: next, allocations: nextAlloc };
    });
  };

  const updatePoultryCycle = (index: number, cycle: Partial<PoultryModel['cycles'][0]>) => {
    setState((prev) => {
      const newCycles = [...prev.poultry.cycles];
      if (newCycles[index]) {
        newCycles[index] = { ...newCycles[index], ...cycle };
      }
      return {
        ...prev,
        poultry: { ...prev.poultry, cycles: newCycles },
      };
    });
  };

  const updateUTT = (utt: Partial<UTTModel>) => {
    setState((prev) => {
      const next = { ...prev.utt, ...utt };
      const nextAlloc = { ...prev.allocations };
      if (utt.investmentAmount !== undefined) {
        nextAlloc.utt = utt.investmentAmount;
        const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
        const allocated =
          nextAlloc.utt +
          nextAlloc.klinFitz +
          nextAlloc.zanzibarAirbnb +
          nextAlloc.momsPoultry +
          nextAlloc.car +
          nextAlloc.laptop +
          customTotal;
        nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);
      }
      return { ...prev, utt: next, allocations: nextAlloc };
    });
  };

  const updateCar = (car: Partial<CarModel>) => {
    setState((prev) => {
      const next = { ...prev.car, ...car };
      const nextAlloc = { ...prev.allocations };
      if (car.purchasePrice !== undefined) {
        nextAlloc.car = car.purchasePrice;
        const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
        const allocated =
          nextAlloc.utt +
          nextAlloc.klinFitz +
          nextAlloc.zanzibarAirbnb +
          nextAlloc.momsPoultry +
          nextAlloc.car +
          nextAlloc.laptop +
          customTotal;
        nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);
      }
      return { ...prev, car: next, allocations: nextAlloc };
    });
  };

  const updateLaptop = (laptop: Partial<LaptopModel>) => {
    setState((prev) => {
      const next = { ...prev.laptop, ...laptop };
      const nextAlloc = { ...prev.allocations };
      if (laptop.purchasePrice !== undefined) {
        nextAlloc.laptop = laptop.purchasePrice;
        const customTotal = (nextAlloc.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);
        const allocated =
          nextAlloc.utt +
          nextAlloc.klinFitz +
          nextAlloc.zanzibarAirbnb +
          nextAlloc.momsPoultry +
          nextAlloc.car +
          nextAlloc.laptop +
          customTotal;
        nextAlloc.cashReserve = Math.max(0, nextAlloc.startingCapital - allocated);
      }
      return { ...prev, laptop: next, allocations: nextAlloc };
    });
  };

  const updateLoan = (loan: Partial<LoanModel>) => {
    setState((prev) => ({ ...prev, loan: { ...prev.loan, ...loan } }));
  };

  const updateRetroAtelier = (retro: Partial<RetroAtelierModel>) => {
    setState((prev) => ({ ...prev, retroAtelier: { ...prev.retroAtelier, ...retro } }));
  };

  const updateMonthlyRecord = (monthIndex: number, record: Partial<MonthlyRecord>) => {
    setState((prev) => {
      const newRecords = [...prev.monthlyRecords];
      if (newRecords[monthIndex]) {
        newRecords[monthIndex] = { ...newRecords[monthIndex], ...record, isActual: true };
      }
      return { ...prev, monthlyRecords: newRecords };
    });
  };

  const toggleMilestone = (roadmapId: string, milestoneId: string) => {
    setState((prev) => {
      const newRoadmap = prev.roadmap.map((item) => {
        if (item.id === roadmapId) {
          const newMilestones = item.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const allCompleted = newMilestones.every((m) => m.completed);
          const anyCompleted = newMilestones.some((m) => m.completed);
          const status = allCompleted ? 'completed' : anyCompleted ? 'in_progress' : 'pending';
          return { ...item, milestones: newMilestones, status: status as RoadmapItem['status'] };
        }
        return item;
      });
      return { ...prev, roadmap: newRoadmap };
    });
  };

  const updateHeroQuote = (quote: { text: string; author: string }) => {
    setState((prev) => ({ ...prev, heroQuote: quote }));
  };

  const addDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      diaryEntries: [newEntry, ...(prev.diaryEntries || [])],
    }));
  };

  const updateDiaryEntry = (id: string, entry: Partial<DiaryEntry>) => {
    setState((prev) => ({
      ...prev,
      diaryEntries: (prev.diaryEntries || []).map((item) =>
        item.id === id ? { ...item, ...entry } : item
      ),
    }));
  };

  const deleteDiaryEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      diaryEntries: (prev.diaryEntries || []).filter((item) => item.id !== id),
    }));
  };

  const togglePinDiaryEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      diaryEntries: (prev.diaryEntries || []).map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      ),
    }));
  };

  const addCommentToDiaryEntry = (
    entryId: string,
    comment: { author: string; content: string; pinColor?: 'gold' | 'emerald' | 'coral' | 'indigo' }
  ) => {
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      targetId: entryId,
      author: comment.author || 'Me',
      content: comment.content,
      createdAt: new Date().toISOString().slice(0, 10),
      pinColor: comment.pinColor || 'gold',
    };
    setState((prev) => ({
      ...prev,
      diaryEntries: (prev.diaryEntries || []).map((entry) => {
        if (entry.id === entryId) {
          return {
            ...entry,
            comments: [...(entry.comments || []), newComment],
          };
        }
        return entry;
      }),
    }));
  };

  const deleteCommentFromDiaryEntry = (entryId: string, commentId: string) => {
    setState((prev) => ({
      ...prev,
      diaryEntries: (prev.diaryEntries || []).map((entry) => {
        if (entry.id === entryId) {
          return {
            ...entry,
            comments: (entry.comments || []).filter((c) => c.id !== commentId),
          };
        }
        return entry;
      }),
    }));
  };

  const addPinnedNote = (note: Omit<PinnedNote, 'id' | 'createdAt'>) => {
    const newNote: PinnedNote = {
      ...note,
      id: `pin-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({
      ...prev,
      pinnedNotes: [newNote, ...(prev.pinnedNotes || [])],
    }));
  };

  const updatePinnedNote = (id: string, note: Partial<PinnedNote>) => {
    setState((prev) => ({
      ...prev,
      pinnedNotes: (prev.pinnedNotes || []).map((p) =>
        p.id === id ? { ...p, ...note } : p
      ),
    }));
  };

  const deletePinnedNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      pinnedNotes: (prev.pinnedNotes || []).filter((p) => p.id !== id),
    }));
  };

  const addGeneralComment = (comment: Omit<CommentItem, 'id' | 'createdAt'>) => {
    const newComment: CommentItem = {
      ...comment,
      id: `gc-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({
      ...prev,
      comments: [newComment, ...(prev.comments || [])],
    }));
  };

  const deleteGeneralComment = (id: string) => {
    setState((prev) => ({
      ...prev,
      comments: (prev.comments || []).filter((c) => c.id !== id),
    }));
  };

  const setActiveTab = (tab: TabKey) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const toggleTheme = () => {
    // Kept for backward compatibility
  };

  const resetToDefaults = () => {
    setState(INITIAL_STATE);
  };

  const exportStateJSON = () => {
    return JSON.stringify(state, null, 2);
  };

  const importStateJSON = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      setState({
        ...INITIAL_STATE,
        ...parsed,
      });
      return true;
    } catch (e) {
      console.error('Failed to import JSON state:', e);
      return false;
    }
  };

  // Calculations
  const klinFitzCalc = calculateKlinFitz(state.klinFitz, state.loan.monthlyRepayment);
  const zanzibarCalc = calculateZanzibarAirbnb(state.zanzibarAirbnb);
  const poultryCalc = calculatePoultry(state.poultry);
  const uttCalc = calculateUTT(state.utt);
  const carCalc = calculateCar(state.car);
  const totalBusinessCashFlow =
    klinFitzCalc.monthlyOperatingProfit +
    zanzibarCalc.userProfitShare +
    poultryCalc.monthlyEquivalentProfit;
  const loanCalc = calculateLoan(state.loan, totalBusinessCashFlow);
  const masterCalc = calculateMasterDashboard(
    state.allocations,
    klinFitzCalc,
    zanzibarCalc,
    poultryCalc,
    uttCalc,
    carCalc,
    state.laptop,
    state.loan
  );

  return (
    <KairosContext.Provider
      value={{
        state,
        setActiveTab,
        updateHeroQuote,
        updateAllocations,
        updateKlinFitz,
        applyKlinFitzScenario,
        updateZanzibar,
        updatePoultry,
        updatePoultryCycle,
        updateUTT,
        updateCar,
        updateLaptop,
        updateLoan,
        updateRetroAtelier,
        updateMonthlyRecord,
        toggleMilestone,
        addDiaryEntry,
        updateDiaryEntry,
        deleteDiaryEntry,
        togglePinDiaryEntry,
        addCommentToDiaryEntry,
        deleteCommentFromDiaryEntry,
        addPinnedNote,
        updatePinnedNote,
        deletePinnedNote,
        addGeneralComment,
        deleteGeneralComment,
        toggleTheme,
        resetToDefaults,
        exportStateJSON,
        importStateJSON,
        klinFitzCalc,
        zanzibarCalc,
        poultryCalc,
        uttCalc,
        carCalc,
        loanCalc,
        masterCalc,
      }}
    >
      {children}
    </KairosContext.Provider>
  );
};

export const useKairos = () => {
  const context = useContext(KairosContext);
  if (!context) {
    throw new Error('useKairos must be used within a KairosProvider');
  }
  return context;
};
