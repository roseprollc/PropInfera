'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculatorInput, CalculatorResults } from '@/types/calculator';

interface CalculatorState {
  calculatorInputs: CalculatorInput;
  results: CalculatorResults | null;
}

type CalculatorAction = 
  | { type: 'SET_INPUT'; field: keyof CalculatorInput; value: any }
  | { type: 'SET_RESULTS'; results: CalculatorResults }
  | { type: 'RESET_CALCULATOR' };

const initialState: CalculatorState = {
  calculatorInputs: {
    propertyAddress: '',
    purchasePrice: 300000,
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTerm: 30,
    closingCosts: 9000,
    propertyTaxAnnual: 3600,
    insuranceAnnual: 1200,
    utilitiesMonthly: 200,
    maintenancePercent: 5,
    propertyManagementPercent: 8,
    monthlyRent: 2000,
    vacancyRatePercent: 5,
    capExReservePercent: 5,
    annualAppreciationPercent: 3,
    annualRentIncreasePercent: 2,
    holdingPeriodYears: 5,
    nightlyRate: 0,
    occupancyRate: 0,
    cleaningFee: 0,
    platformFeesPercent: 0
  },
  results: null
};

const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
} | undefined>(undefined);

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_INPUT':
      return {
        ...state,
        calculatorInputs: {
          ...state.calculatorInputs,
          [action.field]: action.value
        }
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.results
      };
    case 'RESET_CALCULATOR':
      return initialState;
    default:
      return state;
  }
}

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
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
} 