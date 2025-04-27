'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { CalculatorInputs, AnalysisResults, CalculatorType } from '@/types/analysis';

// Define action types as a discriminated union
type CalculatorAction = 
  | { type: 'SET_INPUTS'; inputs: CalculatorInputs }
  | { type: 'SET_RESULTS'; results: AnalysisResults }
  | { type: 'RESET' }
  | { type: 'SET_TYPE'; calculatorType: CalculatorType };

// Define state interface that properly matches reducer
interface CalculatorState {
  calculatorType: CalculatorType;
  inputs: CalculatorInputs | null;
  results: AnalysisResults | null;
}

const initialState: CalculatorState = {
  calculatorType: 'mortgage',
  inputs: null,
  results: null
};

// Create reducer with proper type handling
const calculatorReducer = (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  switch (action.type) {
    case 'SET_INPUTS':
      return {
        ...state,
        inputs: action.inputs
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.results
      };
    case 'RESET':
      return {
        ...initialState,
        calculatorType: state.calculatorType // Preserve the calculator type
      };
    case 'SET_TYPE':
      return {
        ...initialState, // Reset all data when changing calculator type
        calculatorType: action.calculatorType
      };
    default:
      return state;
  }
};

type CalculatorContextType = {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
};

// Add displayName for debugging
CalculatorProvider.displayName = "CalculatorProvider"; 