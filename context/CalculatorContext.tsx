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
    purchasePrice: 0,
    downPaymentPercent: 0,
    interestRate: 0,
    loanTerm: 0,
    closingCosts: 0,
    propertyTaxAnnual: 0,
    insuranceAnnual: 0,
    utilitiesMonthly: 0,
    maintenancePercent: 0,
    propertyManagementPercent: 0,
    nightlyRate: 0,
    occupancyRate: 0,
    cleaningFee: 0,
    platformFeesPercent: 0,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0
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