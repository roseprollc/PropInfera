import OpenAI from 'openai';
import type { Analysis, CalculatorType, AnalysisResults } from '@/types/analysis';
import type { GPTInsight, InsightMode } from '@/types/insights';
import { 
  isRentalResults, 
  isAirbnbResults, 
  isWholesaleResults,
  isMortgageResults,
  isRentersResults,
  isValidAnalysis
} from '@/types/analysis';

const openaiApiKey = process.env.OPENAI_API_KEY || '';

const openai = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : null;

export async function generateInsights<T extends CalculatorType>(
  analysis: Analysis<T>
): Promise<GPTInsight> {
  if (!isValidAnalysis(analysis)) {
    throw new Error('Invalid analysis data');
  }

  try {
    switch (analysis.type) {
      case 'rental':
        return generateRentalInsights(analysis as Analysis<'rental'>);
      case 'airbnb':
        return generateAirbnbInsights(analysis as Analysis<'airbnb'>);
      case 'wholesale':
        return generateWholesaleInsights(analysis as Analysis<'wholesale'>);
      case 'mortgage':
        return generateMortgageInsights(analysis as Analysis<'mortgage'>);
      case 'renters':
        return generateRentersInsights(analysis as Analysis<'renters'>);
      default:
        throw new Error(`Unsupported calculator type: ${analysis.type}`);
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return generateFallbackInsights(analysis);
  }
}

const generateRentalInsights = (analysis: Analysis<'rental'>): GPTInsight => {
  const { data } = analysis;
  if (!isRentalResults(data)) {
    throw new Error('Invalid rental analysis data');
  }

  const monthlyCashFlow = data.cashFlow;
  const capRate = data.capRate;
  const roi = data.roi;

  return {
    summary: `This rental property shows ${monthlyCashFlow > 0 ? 'positive' : 'negative'} cash flow with a ${capRate.toFixed(1)}% cap rate.`,
    roiAnalysis: `Projected ROI of ${roi.toFixed(1)}% based on current market conditions.`,
    marketComparison: `Rental rates in this area are ${monthlyCashFlow > 0 ? 'above' : 'below'} market average.`,
    riskFlags: [
      monthlyCashFlow < 0 ? 'Negative cash flow' : undefined,
      capRate < 5 ? 'Low cap rate' : undefined,
      data.vacancyRate > 5 ? 'High vacancy rate' : undefined
    ].filter(Boolean) as string[],
    strategyAdvice: monthlyCashFlow > 0 
      ? 'Consider long-term hold strategy with 15-year mortgage to build equity faster.'
      : 'Evaluate if property value appreciation potential justifies negative cash flow.',
    recommendations: [
      'Add 5% vacancy buffer to cash flow calculations',
      'Consider property management costs in ROI calculations',
      'Research local rental market trends'
    ],
    mode: 'rental',
    isMock: true,
    analysisId: analysis._id?.toString() ?? '',
    createdAt: new Date().toISOString()
  };
};

const generateAirbnbInsights = (analysis: Analysis<'airbnb'>): GPTInsight => {
  const { data } = analysis;
  if (!isAirbnbResults(data)) {
    throw new Error('Invalid Airbnb analysis data');
  }

  const monthlyIncome = data.monthlyAirbnbIncome;
  const annualCashFlow = data.annualCashFlow;
  const occupancyRate = data.occupancyRate;

  return {
    summary: `Airbnb potential shows ${monthlyIncome > 0 ? 'strong' : 'weak'} income with ${occupancyRate.toFixed(1)}% projected occupancy.`,
    roiAnalysis: `Annual cash flow of $${annualCashFlow.toLocaleString()} based on current market rates.`,
    marketComparison: `Occupancy rate is ${occupancyRate > 70 ? 'above' : 'below'} market average for this area.`,
    riskFlags: [
      monthlyIncome < 0 ? 'Negative monthly income' : undefined,
      occupancyRate < 60 ? 'Low projected occupancy' : undefined,
      data.seasonalVariation > 30 ? 'High seasonal variation' : undefined
    ].filter(Boolean) as string[],
    strategyAdvice: occupancyRate > 70
      ? 'Consider dynamic pricing strategy to maximize high-season revenue.'
      : 'Evaluate if property improvements could increase occupancy rates.',
    recommendations: [
      'Research local Airbnb regulations',
      'Consider professional photography for listing',
      'Analyze seasonal booking patterns'
    ],
    mode: 'airbnb',
    isMock: true,
    analysisId: analysis._id?.toString() ?? '',
    createdAt: new Date().toISOString()
  };
};

const generateWholesaleInsights = (analysis: Analysis<'wholesale'>): GPTInsight => {
  const { data } = analysis;
  if (!isWholesaleResults(data)) {
    throw new Error('Invalid wholesale analysis data');
  }

  const profit = data.profit;
  const assignmentFee = data.assignmentFee;
  const arv = data.arv;

  return {
    summary: `Wholesale opportunity shows ${profit > 0 ? 'positive' : 'negative'} profit potential with $${assignmentFee.toLocaleString()} assignment fee.`,
    roiAnalysis: `Projected profit of $${profit.toLocaleString()} based on ARV of $${arv.toLocaleString()}.`,
    marketComparison: `ARV is ${arv > 0 ? 'above' : 'below'} market average for this area.`,
    riskFlags: [
      profit < 0 ? 'Negative profit margin' : undefined,
      assignmentFee < 10000 ? 'Low assignment fee' : undefined,
      data.estimatedRepairCost > arv * 0.3 ? 'High repair costs' : undefined
    ].filter(Boolean) as string[],
    strategyAdvice: profit > 0
      ? 'Consider quick close strategy to minimize holding costs.'
      : 'Evaluate if property improvements could increase ARV.',
    recommendations: [
      'Verify ARV with multiple comps',
      'Get detailed repair estimates',
      'Research local buyer demand'
    ],
    mode: 'wholesale',
    isMock: true,
    analysisId: analysis._id?.toString() ?? '',
    createdAt: new Date().toISOString()
  };
};

const generateMortgageInsights = (analysis: Analysis<'mortgage'>): GPTInsight => {
  const { data } = analysis;
  if (!isMortgageResults(data)) {
    throw new Error('Invalid mortgage analysis data');
  }

  const monthlyPayment = data.totalMonthlyPayment;
  const interest = data.interest;
  const loanAmount = data.loanAmount;

  return {
    summary: `Mortgage analysis shows ${monthlyPayment > 0 ? 'affordable' : 'high'} monthly payments with $${interest.toLocaleString()} total interest.`,
    roiAnalysis: `Total loan amount of $${loanAmount.toLocaleString()} with ${data.interestRate}% interest rate.`,
    marketComparison: `Interest rate is ${data.interestRate < 5 ? 'below' : 'above'} current market average.`,
    riskFlags: [
      monthlyPayment > loanAmount * 0.4 ? 'High payment-to-income ratio' : undefined,
      data.pmi > 0 ? 'PMI required' : undefined,
      data.hoaFees > 0 ? 'HOA fees apply' : undefined
    ].filter(Boolean) as string[],
    strategyAdvice: data.interestRate < 5
      ? 'Consider locking in this rate with a longer-term mortgage.'
      : 'Evaluate refinancing options when rates improve.',
    recommendations: [
      'Compare with other loan terms',
      'Consider additional principal payments',
      'Review insurance and tax estimates'
    ],
    mode: 'mortgage',
    isMock: true,
    analysisId: analysis._id?.toString() ?? '',
    createdAt: new Date().toISOString()
  };
};

const generateRentersInsights = (analysis: Analysis<'renters'>): GPTInsight => {
  const { data } = analysis;
  if (!isRentersResults(data)) {
    throw new Error('Invalid renters analysis data');
  }

  const cashFlow = data.cashFlow;
  const roi = data.roi;
  const capRate = data.capRate;

  return {
    summary: `Renters property shows ${cashFlow > 0 ? 'positive' : 'negative'} cash flow with ${capRate.toFixed(1)}% cap rate.`,
    roiAnalysis: `Projected ROI of ${roi.toFixed(1)}% based on current market conditions.`,
    marketComparison: `Rental rates are ${cashFlow > 0 ? 'above' : 'below'} market average for this area.`,
    riskFlags: [
      cashFlow < 0 ? 'Negative cash flow' : undefined,
      capRate < 5 ? 'Low cap rate' : undefined,
      data.occupancyRate > 5 ? 'High occupancy rate' : undefined
    ].filter(Boolean) as string[],
    strategyAdvice: cashFlow > 0
      ? 'Consider long-term hold strategy with property management.'
      : 'Evaluate if property value appreciation potential justifies negative cash flow.',
    recommendations: [
      'Add occupancy buffer to cash flow calculations',
      'Consider property management costs',
      'Research local rental market trends'
    ],
    mode: 'renters',
    isMock: true,
    analysisId: analysis._id?.toString() ?? '',
    createdAt: new Date().toISOString()
  };
};

const generateFallbackInsights = <T extends CalculatorType>(analysis: Analysis<T>): GPTInsight => {
  return {
    summary: 'Unable to generate detailed insights at this time.',
    roiAnalysis: 'Please try again later or contact support.',
    marketComparison: 'Analysis data is temporarily unavailable.',
    riskFlags: ['Temporary service disruption'],
    strategyAdvice: 'Please try again in a few minutes.',
    recommendations: [
      'Refresh the page',
      'Check your internet connection',
      'Contact support if the issue persists'
    ],
    mode: analysis.type as InsightMode,
    isMock: true,
    analysisId: analysis._id?.toString() ?? '',
    createdAt: new Date().toISOString()
  };
};
