'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculatorType, CalculatorInputs, AnalysisResults } from '@/types/analysis';

interface CalculatorState<T extends CalculatorType> {
  type: T;
  inputs: CalculatorInputs[T];
  results: AnalysisResults[T] | null;
}

type CalculatorAction<T extends CalculatorType> =
  | { type: 'SET_INPUTS'; payload: Partial<CalculatorInputs[T]> }
  | { type: 'SET_RESULTS'; payload: AnalysisResults[T] | null };

const initialState: CalculatorState<CalculatorType> = {
  type: 'rental',
  inputs: {
    purchasePrice: 0,
    downPayment: 0,
    interestRate: 0,
    loanTerm: 0,
    monthlyRent: 0,
    propertyTaxes: 0,
    insurance: 0,
    maintenance: 0,
    vacancyRate: 0,
    managementFee: 0,
    utilities: 0,
    otherExpenses: 0,
    appreciationRate: 0,
    inflationRate: 0,
    taxRate: 0,
    depreciationPeriod: 0,
    exitStrategy: 'sell',
    exitYear: 0,
    exitPrice: 0,
    exitCosts: 0
  },
  results: null
};

function calculatorReducer<T extends CalculatorType>(
  state: CalculatorState<T>,
  action: CalculatorAction<T>
): CalculatorState<T> {
  switch (action.type) {
    case 'SET_INPUTS':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ...action.payload
        }
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
  dispatch: React.Dispatch<CalculatorAction<CalculatorType>>;
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