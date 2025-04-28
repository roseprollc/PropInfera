'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { CalculatorInputs, AnalysisResults } from '@/types/analysis';

interface CalculatorState {
  type: 'mortgage' | 'rental' | 'airbnb' | 'wholesale';
  inputs: CalculatorInputs;
  results: AnalysisResults | null;
}

type CalculatorAction =
  | { type: 'SET_TYPE'; payload: CalculatorState['type'] }
  | { type: 'SET_INPUTS'; payload: CalculatorInputs }
  | { type: 'SET_RESULTS'; payload: AnalysisResults }
  | { type: 'RESET_CALCULATOR' };

const initialState: CalculatorState = {
  type: 'mortgage',
  inputs: {},
  results: null
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_INPUTS':
      return { ...state, inputs: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'RESET_CALCULATOR':
      return initialState;
    default:
      return state;
  }
}

const CalculatorContext = createContext<{
  state: CalculatorState;
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

// Add displayName for debugging
CalculatorProvider.displayName = "CalculatorProvider";