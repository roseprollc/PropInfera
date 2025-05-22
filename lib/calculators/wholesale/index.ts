import type { WholesaleInputs, WholesaleAnalysisResults } from '@/types/analysis';

export function calculateWholesale(inputs: WholesaleInputs): WholesaleAnalysisResults {
  const purchasePrice = inputs.purchasePrice;
  const repairCosts = inputs.estimatedRepairCost;
  const arv = inputs.arv;
  const assignmentFee = inputs.assignmentFee;
  const closingCosts = (purchasePrice * inputs.closingCostsPercent) / 100;
  const holdingCosts = purchasePrice * 0.01; // 1% of purchase price
  const marketingCosts = purchasePrice * 0.005; // 0.5% of purchase price

  const totalInvestment = purchasePrice + repairCosts + holdingCosts + assignmentFee;
  const profit = arv - totalInvestment;
  const returnOnInvestment = (profit / totalInvestment) * 100;

  return {
    type: 'wholesale',
    purchasePrice: inputs.purchasePrice,
    estimatedRepairCost: inputs.estimatedRepairCost,
    arv: inputs.arv,
    assignmentFee: inputs.assignmentFee,
    closingCosts: inputs.purchasePrice * (inputs.closingCostsPercent / 100),
    holdingCosts: inputs.purchasePrice * 0.01, // 1% of purchase price
    marketingCosts: inputs.purchasePrice * 0.005, // 0.5% of purchase price
    totalInvestment: totalInvestment,
    profit: profit,
    returnOnInvestment: returnOnInvestment,
    profitMargin: (profit / inputs.arv) * 100,
    roi: returnOnInvestment,
    repairCosts: inputs.estimatedRepairCost
  };
} 