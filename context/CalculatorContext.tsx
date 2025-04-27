'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculatorType, CalculatorInputsMap, AnalysisResultsMap } from '@/types/analysis';

interface CalculatorState<T extends CalculatorType> {
  type: T;
  inputs: CalculatorInputsMap[T];
  results: AnalysisResultsMap[T] | null;
}

type CalculatorAction<T extends CalculatorType> =
  | { type: 'SET_INPUTS'; payload: Partial<CalculatorInputsMap[T]> }
  | { type: 'SET_RESULTS'; payload: AnalysisResultsMap[T] | null };

function calculatorReducer<T extends CalculatorType>(
  state: CalculatorState<T>,
  action: CalculatorAction<T>
): CalculatorState<T> {
  switch (action.type) {
    case 'SET_INPUTS':
      return {
        ...state,
        inputs: { ...state.inputs, ...action.payload }
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

interface CalculatorContextType<T extends CalculatorType> {
  state: CalculatorState<T>;
  dispatch: React.Dispatch<CalculatorAction<T>>;
}

const CalculatorContext = createContext<CalculatorContextType<any> | undefined>(undefined);

export function CalculatorProvider<T extends CalculatorType>({
  children,
  initialState
}: {
  children: ReactNode;
  initialState: CalculatorState<T>;
}) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator<T extends CalculatorType>() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context as CalculatorContextType<T>;
}

CalculatorProvider.displayName = "CalculatorProvider"; 