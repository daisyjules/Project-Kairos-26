import {
  AllocationBreakdown,
  KlinFitzModel,
  SteazyModel,
  ZanzibarAirbnbModel,
  PoultryModel,
  DSEPortfolioModel,
  UTTModel,
  CarModel,
  LaptopModel,
  LoanModel,
  RetroAtelierModel,
  MonthlyRecord,
  SalarySavingsModel,
} from '../types';

export interface KlinFitzCalculations {
  monthlyOrders: number;
  coreMonthlyRevenue: number;
  hospitalityRevenue: number;
  totalMonthlyRevenue: number;
  coreVariableCosts: number;
  hospitalityVariableCosts: number;
  totalVariableCosts: number;
  totalFixedCosts: number;
  totalMonthlyExpenses: number;
  monthlyOperatingProfit: number;
  profitMarginPct: number;
  contributionMarginPerOrder: number;
  breakEvenOrdersPerMonth: number;
  breakEvenOrdersPerDay: number;
  breakEvenMonthlyRevenue: number;
  annualOperatingProfit: number;
  annualROI: number;
  paybackMonths: number;
  debtCoverageRatio: number; // profit / monthly loan payment
}

export function calculateKlinFitz(model: KlinFitzModel, monthlyLoanPayment: number = 950000): KlinFitzCalculations {
  const monthlyOrders = model.ordersPerDay * model.operatingDaysPerMonth;
  const coreMonthlyRevenue = monthlyOrders * model.avgRevenuePerOrder;
  const hospitalityRevenue = model.enableHospitalityContracts ? model.hospitalityContractRevenue : 0;
  const totalMonthlyRevenue = coreMonthlyRevenue + hospitalityRevenue;

  const coreVariableCosts = monthlyOrders * model.variableCostPerOrder;
  const hospitalityVariableCosts = model.enableHospitalityContracts ? model.hospitalityContractVariableCost : 0;
  const totalVariableCosts = coreVariableCosts + hospitalityVariableCosts;

  const totalFixedCosts =
    model.staffCost +
    model.utilitiesCost +
    model.transportPickupCost +
    model.otherFixedCosts;

  const totalMonthlyExpenses = totalVariableCosts + totalFixedCosts;
  const monthlyOperatingProfit = totalMonthlyRevenue - totalMonthlyExpenses;
  const profitMarginPct = totalMonthlyRevenue > 0 ? (monthlyOperatingProfit / totalMonthlyRevenue) * 100 : 0;

  const contributionMarginPerOrder = Math.max(0, model.avgRevenuePerOrder - model.variableCostPerOrder);
  const breakEvenOrdersPerMonth =
    contributionMarginPerOrder > 0 ? Math.ceil(totalFixedCosts / contributionMarginPerOrder) : 0;
  const breakEvenOrdersPerDay =
    model.operatingDaysPerMonth > 0 ? Number((breakEvenOrdersPerMonth / model.operatingDaysPerMonth).toFixed(1)) : 0;
  const breakEvenMonthlyRevenue = breakEvenOrdersPerMonth * model.avgRevenuePerOrder;

  const annualOperatingProfit = monthlyOperatingProfit * 12;
  const annualROI = model.initialCapital > 0 ? (annualOperatingProfit / model.initialCapital) * 100 : 0;
  const paybackMonths =
    monthlyOperatingProfit > 0 ? Number((model.initialCapital / monthlyOperatingProfit).toFixed(1)) : 999;

  const debtCoverageRatio =
    monthlyLoanPayment > 0 ? Number((monthlyOperatingProfit / monthlyLoanPayment).toFixed(2)) : 0;

  return {
    monthlyOrders,
    coreMonthlyRevenue,
    hospitalityRevenue,
    totalMonthlyRevenue,
    coreVariableCosts,
    hospitalityVariableCosts,
    totalVariableCosts,
    totalFixedCosts,
    totalMonthlyExpenses,
    monthlyOperatingProfit,
    profitMarginPct,
    contributionMarginPerOrder,
    breakEvenOrdersPerMonth,
    breakEvenOrdersPerDay,
    breakEvenMonthlyRevenue,
    annualOperatingProfit,
    annualROI,
    paybackMonths,
    debtCoverageRatio,
  };
}

export interface SteazyCalculations {
  unitCost: number;
  weightedSellingPrice: number;
  unitGrossProfit: number;
  unitMarginPct: number;
  grossMarginPct: number;
  tshirtsProducedPerMonth: number;
  tshirtsProducedPerYear: number;
  monthlyRevenue: number;
  monthlyCOGS: number;
  monthlyGrossProfit: number;
  monthlyOperatingExpenses: number;
  monthlyNetProfit: number;
  netMarginPct: number;
  annualRevenue: number;
  annualCOGS: number;
  annualGrossProfit: number;
  annualNetProfit: number;
  breakEvenTshirtsPerMonth: number;
  annualROI: number;
  paybackMonths: number;
}

export function calculateSteazy(model: SteazyModel): SteazyCalculations {
  const unitCost =
    (model.blankCostPerUnit || 0) +
    (model.printingCostPerUnit || 0) +
    (model.tagPackagingCostPerUnit || 0);

  const retailPct = Math.min(100, Math.max(0, model.retailSalesPct ?? 80)) / 100;
  const wholesalePct = 1 - retailPct;

  const weightedSellingPrice =
    model.retailSellingPrice * retailPct + model.wholesaleSellingPrice * wholesalePct;

  const unitGrossProfit = weightedSellingPrice - unitCost;
  const unitMarginPct = weightedSellingPrice > 0 ? (unitGrossProfit / weightedSellingPrice) * 100 : 0;

  const tshirtsProducedPerMonth = model.tshirtsProducedPerMonth || 0;
  const tshirtsProducedPerYear = tshirtsProducedPerMonth * 12;

  const monthlyRevenue = tshirtsProducedPerMonth * weightedSellingPrice;
  const monthlyCOGS = tshirtsProducedPerMonth * unitCost;
  const monthlyGrossProfit = monthlyRevenue - monthlyCOGS;
  const grossMarginPct = monthlyRevenue > 0 ? (monthlyGrossProfit / monthlyRevenue) * 100 : 0;
  const monthlyOperatingExpenses = model.monthlyOperatingExpenses || 0;
  const monthlyNetProfit = monthlyGrossProfit - monthlyOperatingExpenses;
  const netMarginPct = monthlyRevenue > 0 ? (monthlyNetProfit / monthlyRevenue) * 100 : 0;

  const annualRevenue = monthlyRevenue * 12;
  const annualCOGS = monthlyCOGS * 12;
  const annualGrossProfit = monthlyGrossProfit * 12;
  const annualNetProfit = monthlyNetProfit * 12;

  const contributionMarginPerUnit = Math.max(0, weightedSellingPrice - unitCost);
  const breakEvenTshirtsPerMonth =
    contributionMarginPerUnit > 0 ? Math.ceil(monthlyOperatingExpenses / contributionMarginPerUnit) : 0;

  const annualROI = model.initialCapital > 0 ? (annualNetProfit / model.initialCapital) * 100 : 0;
  const paybackMonths =
    monthlyNetProfit > 0 ? Number((model.initialCapital / monthlyNetProfit).toFixed(1)) : 999;

  return {
    unitCost,
    weightedSellingPrice,
    unitGrossProfit,
    unitMarginPct,
    grossMarginPct,
    tshirtsProducedPerMonth,
    tshirtsProducedPerYear,
    monthlyRevenue,
    monthlyCOGS,
    monthlyGrossProfit,
    monthlyOperatingExpenses,
    monthlyNetProfit,
    netMarginPct,
    annualRevenue,
    annualCOGS,
    annualGrossProfit,
    annualNetProfit,
    breakEvenTshirtsPerMonth,
    annualROI,
    paybackMonths,
  };
}

export interface DSEPortfolioCalculations {
  totalInvestedCapital: number;
  totalMarketValue: number;
  totalUnrealizedGainLoss: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  annualEstimatedDividends: number;
  weightedDividendYieldPct: number;
  totalLiquidAndShares: number;
  totalPortfolioValue: number;
  uninvestedCash: number;
  milestones: Array<{
    threshold: number;
    label: string;
    reached: boolean;
  }>;
  highestReachedMilestone: number | null;
}

export function calculateDSEPortfolio(portfolio: DSEPortfolioModel): DSEPortfolioCalculations {
  const holdings = portfolio?.holdings || [];
  let totalInvestedCapital = 0;
  let totalMarketValue = 0;
  let annualEstimatedDividends = 0;

  holdings.forEach((h) => {
    const cost = (h.sharesHeld || 0) * (h.buyPrice || 0);
    const market = (h.sharesHeld || 0) * (h.currentPrice || 0);
    totalInvestedCapital += cost;
    totalMarketValue += market;
    annualEstimatedDividends += market * (((h.dividendYieldPct || 0)) / 100);
  });

  const totalUnrealizedGainLoss = totalMarketValue - totalInvestedCapital;
  const totalGainLoss = totalUnrealizedGainLoss;
  const totalGainLossPct =
    totalInvestedCapital > 0 ? (totalUnrealizedGainLoss / totalInvestedCapital) * 100 : 0;

  const weightedDividendYieldPct =
    totalMarketValue > 0 ? (annualEstimatedDividends / totalMarketValue) * 100 : 0;

  const uninvestedCash = portfolio?.cashBalance || 0;
  const totalLiquidAndShares = totalMarketValue + uninvestedCash;
  const totalPortfolioValue = totalLiquidAndShares;

  const milestoneTargets = [5_000_000, 6_000_000, 7_000_000, 8_000_000, 9_000_000, 10_000_000];
  const milestones = milestoneTargets.map((threshold) => ({
    threshold,
    label: `${(threshold / 1_000_000).toFixed(0)}M TZS`,
    reached: totalLiquidAndShares >= threshold,
  }));

  const reachedList = milestones.filter((m) => m.reached);
  const highestReachedMilestone = reachedList.length > 0 ? reachedList[reachedList.length - 1].threshold : null;

  return {
    totalInvestedCapital,
    totalMarketValue,
    totalUnrealizedGainLoss,
    totalGainLoss,
    totalGainLossPct,
    annualEstimatedDividends,
    weightedDividendYieldPct,
    totalLiquidAndShares,
    totalPortfolioValue,
    uninvestedCash,
    milestones,
    highestReachedMilestone,
  };
}

export interface ZanzibarCalculations {
  totalCapital: number;
  userOwnershipPct: number;
  bookedNights: number;
  staysPerMonth: number;
  nightlyGrossRevenue: number;
  cleaningFeeRevenue: number;
  grossRevenue: number;
  platformFee: number;
  variableCleaningCosts: number;
  monthlyFixedCosts: number;
  totalMonthlyExpenses: number;
  monthlyOperatingProfit: number;
  userProfitShare: number;
  aliceProfitShare: number;
  annualUserProfit: number;
  paybackMonths: number;
  annualROI: number;
}

export function calculateZanzibarAirbnb(model: ZanzibarAirbnbModel): ZanzibarCalculations {
  const totalCapital = model.totalStartupCost;
  const totalContributions = model.userContribution + model.aliceContribution + model.otherPartnerContribution;
  const calculatedOwnership =
    totalContributions > 0 ? (model.userContribution / totalContributions) * 100 : model.userOwnershipPct;

  const userOwnershipPct = model.userOwnershipPct || calculatedOwnership;

  const bookedNights = Math.round((model.occupancyPct / 100) * model.availableNightsPerMonth);
  const staysPerMonth = Math.max(1, Math.round(bookedNights / 3.2)); // avg stay 3.2 nights
  const nightlyGrossRevenue = bookedNights * model.nightlyPrice;
  const cleaningFeeRevenue = staysPerMonth * model.cleaningFeePerStay;
  const grossRevenue = nightlyGrossRevenue + cleaningFeeRevenue;

  const platformFee = grossRevenue * (model.platformFeePct / 100);
  const variableCleaningCosts = staysPerMonth * model.monthlyCleaning;
  const monthlyFixedCosts =
    model.monthlyRent +
    model.monthlyUtilities +
    model.monthlyInternet +
    model.monthlyMaintenance +
    model.monthlySupplies +
    model.otherMonthlyCosts;

  const totalMonthlyExpenses = platformFee + variableCleaningCosts + monthlyFixedCosts;
  const monthlyOperatingProfit = grossRevenue - totalMonthlyExpenses;
  const userProfitShare = monthlyOperatingProfit * (userOwnershipPct / 100);
  const aliceProfitShare = monthlyOperatingProfit * ((100 - userOwnershipPct) / 100);

  const annualUserProfit = userProfitShare * 12;
  const paybackMonths =
    userProfitShare > 0 ? Number((model.userContribution / userProfitShare).toFixed(1)) : 999;
  const annualROI = model.userContribution > 0 ? (annualUserProfit / model.userContribution) * 100 : 0;

  return {
    totalCapital,
    userOwnershipPct,
    bookedNights,
    staysPerMonth,
    nightlyGrossRevenue,
    cleaningFeeRevenue,
    grossRevenue,
    platformFee,
    variableCleaningCosts,
    monthlyFixedCosts,
    totalMonthlyExpenses,
    monthlyOperatingProfit,
    userProfitShare,
    aliceProfitShare,
    annualUserProfit,
    paybackMonths,
    annualROI,
  };
}

export interface PoultryCalculations {
  survivingBirds: number;
  totalPilotProductionCost: number;
  recurringBatchCost: number;
  costPerSurvivingBird: number;
  expectedSalesRevenue: number;
  pilotProfitLoss: number;
  recurringBatchProfit: number;
  profitPerBird: number;
  pilotROI: number;
  profitMarginPct: number;
  annualizedProfit: number;
  monthlyEquivalentProfit: number;
}

export function calculatePoultry(model: PoultryModel): PoultryCalculations {
  const survivingBirds = Math.max(0, Math.round(model.numChicks * (1 - model.mortalityRatePct / 100)));
  const chickPurchaseCost = model.numChicks * model.costPerChick;
  
  // Recurring costs
  const recurringBatchCost =
    chickPurchaseCost +
    model.feedCost +
    model.vaccinationMedicine +
    model.beddingCost +
    model.transportCost +
    model.otherCosts;

  // Initial infrastructure
  const fixedInfrastructure = model.housingCoop + model.feedersDrinkers;
  const totalPilotProductionCost = recurringBatchCost + fixedInfrastructure;

  const costPerSurvivingBird = survivingBirds > 0 ? totalPilotProductionCost / survivingBirds : 0;
  const expectedSalesRevenue = survivingBirds * model.expectedSellingPrice;
  const pilotProfitLoss = expectedSalesRevenue - totalPilotProductionCost;
  const recurringBatchProfit = expectedSalesRevenue - recurringBatchCost;
  const profitPerBird = survivingBirds > 0 ? recurringBatchProfit / survivingBirds : 0;
  const pilotROI = totalPilotProductionCost > 0 ? (pilotProfitLoss / totalPilotProductionCost) * 100 : 0;
  const profitMarginPct = expectedSalesRevenue > 0 ? (recurringBatchProfit / expectedSalesRevenue) * 100 : 0;

  const cyclesPerYear = model.cyclesPerYear || 4; // ~10-12 weeks per cycle = 4-5 cycles/yr
  const annualizedProfit = recurringBatchProfit * cyclesPerYear;
  const monthlyEquivalentProfit = annualizedProfit / 12;

  return {
    survivingBirds,
    totalPilotProductionCost,
    recurringBatchCost,
    costPerSurvivingBird,
    expectedSalesRevenue,
    pilotProfitLoss,
    recurringBatchProfit,
    profitPerBird,
    pilotROI,
    profitMarginPct,
    annualizedProfit,
    monthlyEquivalentProfit,
  };
}

export interface UTTCalculations {
  annualEstimatedReturn: number;
  monthlyEquivalentReturn: number;
  valueAfter1Year: number;
  valueAfter3Years: number;
  valueAfter5Years: number;
  valueAfter10Years: number;
  totalGains10Years: number;
  totalFutureValue: number;
  projectedValue5Y: number;
  isLiquid: boolean;
  liquidityTurnaround: string;
  liquidityTurnaroundDays: number;
}

export function calculateUTT(model: UTTModel): UTTCalculations {
  const P = model.investmentAmount;
  const rAnnual = model.expectedAnnualReturnPct / 100;
  const rMonthly = rAnnual / 12;
  const pmt = model.monthlyContribution;

  const annualEstimatedReturn = P * rAnnual;
  const monthlyEquivalentReturn = annualEstimatedReturn / 12;

  function futureValue(months: number): number {
    if (!model.reinvestReturns) {
      return P + pmt * months;
    }
    if (rMonthly === 0) {
      return P + pmt * months;
    }
    // FV = P*(1+r)^n + PMT * [((1+r)^n - 1) / r]
    const compPrincipal = P * Math.pow(1 + rMonthly, months);
    const compPmt = pmt > 0 ? pmt * ((Math.pow(1 + rMonthly, months) - 1) / rMonthly) : 0;
    return compPrincipal + compPmt;
  }

  const valueAfter1Year = futureValue(12);
  const valueAfter3Years = futureValue(36);
  const valueAfter5Years = futureValue(60);
  const valueAfter10Years = futureValue(120);

  const totalInvested10Years = P + pmt * 120;
  const totalGains10Years = Math.max(0, valueAfter10Years - totalInvested10Years);

  return {
    annualEstimatedReturn,
    monthlyEquivalentReturn,
    valueAfter1Year,
    valueAfter3Years,
    valueAfter5Years,
    valueAfter10Years,
    totalGains10Years,
    totalFutureValue: valueAfter10Years,
    projectedValue5Y: valueAfter5Years,
    isLiquid: true,
    liquidityTurnaround: 'T+1 (24–48h to M-Pesa / Bank)',
    liquidityTurnaroundDays: model.liquidityTurnaroundDays || 1,
  };
}

export interface CarCalculations {
  totalInitialCost: number;
  monthlyRunningCost: number;
  firstYearTotalCost: number;
  isOverBudget: boolean;
  budgetCap: number;
}

export function calculateCar(model: CarModel): CarCalculations {
  const budgetCap = 10_000_000;
  const totalInitialCost =
    model.purchasePrice +
    model.insurance +
    model.registration +
    model.initialRepairs +
    model.initialServicing +
    model.tyres +
    model.otherInitialCosts;

  const monthlyRunningCost = model.monthlyFuel + model.monthlyMaintenance;
  const firstYearTotalCost = totalInitialCost + monthlyRunningCost * 12;
  const isOverBudget = model.purchasePrice > budgetCap;

  return {
    totalInitialCost,
    monthlyRunningCost,
    firstYearTotalCost,
    isOverBudget,
    budgetCap,
  };
}

export interface LoanCalculations {
  totalRepayments: number;
  totalFinancingCost: number;
  annualDebtService: number;
  businessOperatingCashFlow: number; // monthly
  cashFlowAfterDebtService: number; // profit - repayment
  dscr: number; // DSCR = cashFlow / repayment
  dscrStatus: 'CRITICAL' | 'FRAGILE' | 'IMPROVING' | 'HEALTHY';
  dscrMessage: string;
}

export function calculateLoan(
  model: LoanModel,
  businessOperatingCashFlow: number
): LoanCalculations {
  const totalRepayments = model.monthlyRepayment * model.tenureMonths;
  const totalFinancingCost = Math.max(
    0,
    totalRepayments - model.principal + model.originationFees + model.insuranceCost
  );
  const annualDebtService = model.monthlyRepayment * 12;
  const cashFlowAfterDebtService = businessOperatingCashFlow - model.monthlyRepayment;

  const dscr = model.monthlyRepayment > 0 ? businessOperatingCashFlow / model.monthlyRepayment : 0;

  let dscrStatus: 'CRITICAL' | 'FRAGILE' | 'IMPROVING' | 'HEALTHY' = 'CRITICAL';
  let dscrMessage = 'Businesses do not currently cover debt service. Personal subsidy required.';

  if (dscr >= 1.5) {
    dscrStatus = 'HEALTHY';
    dscrMessage = 'Healthy debt coverage cushion (>1.5x). Strong resilience for reinvestment.';
  } else if (dscr >= 1.25) {
    dscrStatus = 'IMPROVING';
    dscrMessage = 'Improving debt cushion (1.25–1.5x). Moderate resilience against revenue drops.';
  } else if (dscr >= 1.0) {
    dscrStatus = 'FRAGILE';
    dscrMessage = 'Fragile debt coverage (1.0–1.25x). Any drop in sales creates debt stress.';
  }

  return {
    totalRepayments,
    totalFinancingCost,
    annualDebtService,
    businessOperatingCashFlow,
    cashFlowAfterDebtService,
    dscr: Number(dscr.toFixed(2)),
    dscrStatus,
    dscrMessage,
  };
}

export interface MasterCalculations {
  startingCapital: number;
  totalAllocated: number;
  remainingReserve: number;
  reservePct: number;
  isOverAllocated: boolean;
  productiveCapital: number;
  productivePct: number;
  lifestyleProductivityCapital: number;
  lifestylePct: number;
  monthlyBusinessRevenue: number;
  monthlyBusinessProfit: number;
  monthlyLoanRepayment: number;
  monthlyCashFlowAfterDebt: number;
  dscr: number;
  dscrStatus: 'CRITICAL' | 'FRAGILE' | 'IMPROVING' | 'HEALTHY';
  totalInvestmentValue: number;
  totalLiquidCapital: number;
  liquidRunwayMonths: number;
}

export function calculateMasterDashboard(
  allocations: AllocationBreakdown,
  klinFitz: KlinFitzCalculations,
  zanzibar: ZanzibarCalculations,
  poultry: PoultryCalculations,
  utt: UTTCalculations,
  car: CarCalculations,
  laptop: LaptopModel,
  loan: LoanModel,
  steazy?: SteazyCalculations,
  dse?: DSEPortfolioCalculations
): MasterCalculations {
  const startingCapital = allocations.startingCapital;

  const customTotal = (allocations.customAllocations || []).reduce((acc, c) => acc + c.amount, 0);

  const totalAllocated =
    allocations.utt +
    allocations.klinFitz +
    allocations.zanzibarAirbnb +
    allocations.momsPoultry +
    allocations.car +
    allocations.laptop +
    customTotal;

  const remainingReserve = startingCapital - totalAllocated;
  const reservePct = startingCapital > 0 ? (remainingReserve / startingCapital) * 100 : 0;
  const isOverAllocated = totalAllocated > startingCapital;

  // Productive: UTT + Klin Fitz + Zanzibar + Poultry + Laptop + Productive customs
  const customProductive = (allocations.customAllocations || [])
    .filter((c) => c.isProductive)
    .reduce((acc, c) => acc + c.amount, 0);

  const productiveCapital =
    allocations.utt +
    allocations.klinFitz +
    allocations.zanzibarAirbnb +
    allocations.momsPoultry +
    allocations.laptop +
    customProductive;

  const productivePct = startingCapital > 0 ? (productiveCapital / startingCapital) * 100 : 0;

  const lifestyleProductivityCapital = allocations.car;
  const lifestylePct = startingCapital > 0 ? (lifestyleProductivityCapital / startingCapital) * 100 : 0;

  // Total Business Monthly Revenue (Klin Fitz + Zanzibar User Share of revenue + Poultry monthly revenue + Steazy)
  const zanzibarUserRevenue = zanzibar.grossRevenue * (zanzibar.userOwnershipPct / 100);
  const poultryMonthlyRevenue = (poultry.expectedSalesRevenue * 4) / 12;
  const steazyMonthlyRevenue = steazy ? steazy.monthlyRevenue : 0;
  const monthlyBusinessRevenue =
    klinFitz.totalMonthlyRevenue + zanzibarUserRevenue + poultryMonthlyRevenue + steazyMonthlyRevenue;

  // Total Business Monthly Operating Profit (Klin Fitz + Zanzibar User profit + Poultry monthly profit + Steazy net profit)
  const steazyMonthlyProfit = steazy ? steazy.monthlyNetProfit : 0;
  const monthlyBusinessProfit =
    klinFitz.monthlyOperatingProfit + zanzibar.userProfitShare + poultry.monthlyEquivalentProfit + steazyMonthlyProfit;

  const monthlyLoanRepayment = loan.monthlyRepayment;
  const monthlyCashFlowAfterDebt = monthlyBusinessProfit - monthlyLoanRepayment;

  const loanCalc = calculateLoan(loan, monthlyBusinessProfit);

  const dseValue = dse ? dse.totalMarketValue : 0;
  const dseCash = dse ? dse.uninvestedCash : 0;
  const totalInvestmentValue = allocations.utt + dseValue; // starting UTT + DSE portfolio value

  // UTT is a liquid open-ended fund with daily NAV & 24-48h redemption.
  // Total Liquid Capital = Unallocated bank reserve + UTT liquid fund + DSE brokerage cash
  const totalLiquidCapital = Math.max(0, remainingReserve) + allocations.utt + dseCash;
  const liquidRunwayMonths = monthlyLoanRepayment > 0
    ? Number((totalLiquidCapital / monthlyLoanRepayment).toFixed(1))
    : 0;

  return {
    startingCapital,
    totalAllocated,
    remainingReserve,
    reservePct,
    isOverAllocated,
    productiveCapital,
    productivePct,
    lifestyleProductivityCapital,
    lifestylePct,
    monthlyBusinessRevenue,
    monthlyBusinessProfit,
    monthlyLoanRepayment,
    monthlyCashFlowAfterDebt,
    dscr: loanCalc.dscr,
    dscrStatus: loanCalc.dscrStatus,
    totalInvestmentValue,
    totalLiquidCapital,
    liquidRunwayMonths,
  };
}

export interface SalarySavingsCalculations {
  monthlyNetSalary: number;
  totalMonthlyExpenses: number;
  monthlySavingsCapacity: number;
  savingsRatePct: number;
  totalAllocatedSavings: number;
  unallocatedSurplus: number;
  annualDSESavings: number;
  annualUTTSavings: number;
  annualEmergencySavings: number;
  annualTotalSavings: number;
  fiveYearProjectedDSE: number;
  fiveYearProjectedUTT: number;
  fiveYearTotalNetWorthGain: number;
  monthsTo5MMilestoneDSE: number;
  monthsTo10MMilestoneDSE: number;
  emergencyFundCoverageMonths: number;
  savingsStatus: 'HEALTHY' | 'MODERATE' | 'TIGHT' | 'DEFICIT';
}

export function calculateSalarySavings(
  salary: SalarySavingsModel,
  currentDSEValue: number = 0,
  currentEmergencyCash: number = 0
): SalarySavingsCalculations {
  const monthlyNetSalary = Math.max(0, salary?.monthlyNetSalary || 0);
  const totalMonthlyExpenses = Math.max(
    0,
    (salary?.monthlyLivingExpenses || 0) + (salary?.loanRepaymentDeduction || 0)
  );
  const monthlySavingsCapacity = Math.max(0, monthlyNetSalary - totalMonthlyExpenses);
  const savingsRatePct = monthlyNetSalary > 0 ? (monthlySavingsCapacity / monthlyNetSalary) * 100 : 0;

  const dseMonthly = Math.max(0, salary?.monthlyAllocatedToDSE || 0);
  const uttMonthly = Math.max(0, salary?.monthlyAllocatedToUTT || 0);
  const emergencyMonthly = Math.max(0, salary?.monthlyAllocatedToEmergency || 0);
  const totalAllocatedSavings = dseMonthly + uttMonthly + emergencyMonthly;
  const unallocatedSurplus = monthlySavingsCapacity - totalAllocatedSavings;

  const annualDSESavings = dseMonthly * 12;
  const annualUTTSavings = uttMonthly * 12;
  const annualEmergencySavings = emergencyMonthly * 12;
  const annualTotalSavings = totalAllocatedSavings * 12;

  // 5-year projections (conservative 10% on DSE and 13% on UTT)
  const rDSE = 0.1 / 12;
  const rUTT = 0.13 / 12;
  const nMonths = 60;

  const fiveYearProjectedDSE =
    dseMonthly > 0 ? dseMonthly * ((Math.pow(1 + rDSE, nMonths) - 1) / rDSE) : 0;
  const fiveYearProjectedUTT =
    uttMonthly > 0 ? uttMonthly * ((Math.pow(1 + rUTT, nMonths) - 1) / rUTT) : 0;
  const fiveYearTotalNetWorthGain =
    fiveYearProjectedDSE + fiveYearProjectedUTT + emergencyMonthly * 60;

  const remainingTo5M = Math.max(0, 5_000_000 - currentDSEValue);
  const monthsTo5MMilestoneDSE =
    dseMonthly > 0 ? Number((remainingTo5M / dseMonthly).toFixed(1)) : 999;

  const remainingTo10M = Math.max(0, 10_000_000 - currentDSEValue);
  const monthsTo10MMilestoneDSE =
    dseMonthly > 0 ? Number((remainingTo10M / dseMonthly).toFixed(1)) : 999;

  const livingExp = salary?.monthlyLivingExpenses || 1;
  const emergencyFundCoverageMonths = Number((currentEmergencyCash / livingExp).toFixed(1));

  let savingsStatus: 'HEALTHY' | 'MODERATE' | 'TIGHT' | 'DEFICIT' = 'HEALTHY';
  if (monthlyNetSalary <= 0 || monthlyNetSalary < totalMonthlyExpenses) {
    savingsStatus = 'DEFICIT';
  } else if (savingsRatePct < 15) {
    savingsStatus = 'TIGHT';
  } else if (savingsRatePct < 25) {
    savingsStatus = 'MODERATE';
  } else {
    savingsStatus = 'HEALTHY';
  }

  return {
    monthlyNetSalary,
    totalMonthlyExpenses,
    monthlySavingsCapacity,
    savingsRatePct: Number(savingsRatePct.toFixed(1)),
    totalAllocatedSavings,
    unallocatedSurplus,
    annualDSESavings,
    annualUTTSavings,
    annualEmergencySavings,
    annualTotalSavings,
    fiveYearProjectedDSE: Math.round(fiveYearProjectedDSE),
    fiveYearProjectedUTT: Math.round(fiveYearProjectedUTT),
    fiveYearTotalNetWorthGain: Math.round(fiveYearTotalNetWorthGain),
    monthsTo5MMilestoneDSE,
    monthsTo10MMilestoneDSE,
    emergencyFundCoverageMonths,
    savingsStatus,
  };
}
