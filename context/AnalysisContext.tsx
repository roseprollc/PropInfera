"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Analysis, CalculatorType } from '@/types/analysis';

type AnalysisState<T extends CalculatorType> = {
  currentAnalysis: Analysis<T> | null;
  savedAnalyses: Analysis<T>[];
};

type AnalysisAction<T extends CalculatorType> =
  | { type: 'SET_CURRENT_ANALYSIS'; payload: Analysis<T> | null }
  | { type: 'ADD_SAVED_ANALYSIS'; payload: Analysis<T> }
  | { type: 'UPDATE_SAVED_ANALYSIS'; payload: Analysis<T> }
  | { type: 'DELETE_SAVED_ANALYSIS'; payload: string }
  | { type: 'SET_SAVED_ANALYSES'; payload: Analysis<T>[] };

const initialState = <T extends CalculatorType>(): AnalysisState<T> => ({
  currentAnalysis: null,
  savedAnalyses: [],
});

const AnalysisContext = createContext<{
  state: AnalysisState<CalculatorType>;
  dispatch: React.Dispatch<AnalysisAction<CalculatorType>>;
} | undefined>(undefined);

function analysisReducer<T extends CalculatorType>(
  state: AnalysisState<T>,
  action: AnalysisAction<T>
): AnalysisState<T> {
  switch (action.type) {
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    case 'ADD_SAVED_ANALYSIS':
      return { ...state, savedAnalyses: [...state.savedAnalyses, action.payload] };
    case 'UPDATE_SAVED_ANALYSIS':
      return {
        ...state,
        savedAnalyses: state.savedAnalyses.map((analysis) =>
          analysis.id === action.payload.id ? action.payload : analysis
        ),
      };
    case 'DELETE_SAVED_ANALYSIS':
      return {
        ...state,
        savedAnalyses: state.savedAnalyses.filter(
          (analysis) => analysis.id !== action.payload
        ),
      };
    case 'SET_SAVED_ANALYSES':
      return { ...state, savedAnalyses: action.payload };
    default:
      return state;
  }
}

interface AnalysisProviderProps {
  children: ReactNode;
}

export function AnalysisProvider({ children }: AnalysisProviderProps) {
  const [state, dispatch] = useReducer(analysisReducer, initialState());

  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}

AnalysisProvider.displayName = "AnalysisProvider"; 