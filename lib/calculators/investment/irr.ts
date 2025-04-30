export function calculateIRR(
    initialInvestment: number,
    cashFlows: number[],
    finalValue: number
  ): number {
    if (initialInvestment <= 0 || cashFlows.length === 0) return 0;
    
    try {
      const adjustedCashFlows = [...cashFlows];
      adjustedCashFlows[adjustedCashFlows.length - 1] += finalValue;
      
      let irr = 0.1; // Initial guess
      const MAX_ITERATIONS = 20;
      const TOLERANCE = 0.0001;
      
      for (let i = 0; i < MAX_ITERATIONS; i++) {
        let npv = -initialInvestment;
        let derivative = 0;
        
        for (let t = 0; t < adjustedCashFlows.length; t++) {
          const factor = Math.pow(1 + irr, t + 1);
          npv += adjustedCashFlows[t] / factor;
          derivative -= adjustedCashFlows[t] * (t + 1) / Math.pow(1 + irr, t + 2);
        }
        
        if (Math.abs(derivative) < TOLERANCE) break;
        
        const newIrr = irr - npv / derivative;
        
        if (Math.abs(newIrr - irr) < TOLERANCE) {
          irr = newIrr;
          break;
        }
        
        irr = newIrr;
      }
      
      return Math.max(0, irr * 100);
    } catch (error) {
      console.error("Error calculating IRR, using fallback");
      const totalCashFlows = cashFlows.reduce((sum, cf) => sum + cf, 0);
      const averageAnnualReturn = 
        (totalCashFlows + finalValue - initialInvestment) / cashFlows.length;
      return Math.max(0, (averageAnnualReturn / initialInvestment) * 100);
    }
  }