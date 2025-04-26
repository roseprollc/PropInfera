'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculatorType, CalculatorInputs, AnalysisResults } from '@/types/analysis';

interface CalculatorState<T extends CalculatorType> {
  type: T;
  inputs: CalculatorInputs;
  results: AnalysisResults | null;
}

type CalculatorAction =
  | { type: 'SET_INPUTS'; payload: { type: CalculatorType; inputs: CalculatorInputs } }
  | { type: 'SET_RESULTS'; payload: AnalysisResults };

const initialState: CalculatorState<CalculatorType> = {
  type: 'rental',
  inputs: {
    propertyAddress: '',
    purchasePrice: 0,
    downPaymentPercent: 0,
    interestRate: 0,
    loanTerm: 30,
    closingCosts: 0,
    propertyTaxAnnual: 0,
    insuranceAnnual: 0,
    utilitiesMonthly: 0,
    maintenancePercent: 0,
    propertyManagementPercent: 0,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: 0,
    nightlyRate: 0,
    occupancyRate: 0,
    cleaningFee: 0,
    platformFeesPercent: 0,
    afterRepairValue: 0,
    repairCosts: 0,
    assignmentFee: 0,
    miscHoldingCosts: 0,
    hoaFees: 0,
    securityDeposit: 0,
    leaseTerm: 0,
    utilitiesIncluded: false
  },
  results: null
};

function calculatorReducer(state: CalculatorState<CalculatorType>, action: CalculatorAction): CalculatorState<CalculatorType> {
  switch (action.type) {
    case 'SET_INPUTS':
      return {
        ...state,
        type: action.payload.type,
        inputs: action.payload.inputs
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload
      };
    default:
      return state;
  }
}

const CalculatorContext = createContext<{
  state: CalculatorState<CalculatorType>;
  dispatch: React.Dispatch<CalculatorAction>;
} | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

CalculatorProvider.displayName = "CalculatorProvider"; 