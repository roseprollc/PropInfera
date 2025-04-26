'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculatorInputs, AnalysisResults, CalculatorType } from '@/types/analysis';

interface CalculatorState<T extends CalculatorType> {
  calculatorInputs: CalculatorInputs;
  results: AnalysisResults | null;
  type: T;
}

type CalculatorAction = 
  | { type: 'SET_INPUT'; field: keyof CalculatorInputs; value: string | number }
  | { type: 'SET_RESULTS'; results: AnalysisResults }
  | { type: 'RESET_CALCULATOR' };

const initialState = <T extends CalculatorType>(type: T): CalculatorState<T> => ({
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
    platformFeesPercent: 0,
    afterRepairValue: 0,
    repairCosts: 0,
    assignmentFee: 0,
    miscHoldingCosts: 0
  },
  results: null,
  type
});

const CalculatorContext = createContext<{
  state: CalculatorState<CalculatorType>;
  dispatch: React.Dispatch<CalculatorAction>;
} | undefined>(undefined);

function calculatorReducer(state: CalculatorState<CalculatorType>, action: CalculatorAction): CalculatorState<CalculatorType> {
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
      return initialState(state.type);
    default:
      return state;
  }
}

interface CalculatorProviderProps {
  children: ReactNode;
  type: CalculatorType;
}

export function CalculatorProvider({ children, type }: CalculatorProviderProps) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState(type));

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

CalculatorProvider.displayName = "CalculatorProvider"; 