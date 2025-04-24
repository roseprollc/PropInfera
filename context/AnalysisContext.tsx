"use client";

import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { AnalysisState, AnalysisAction, PropertyAnalysis, CalculatorInputs } from '@/types/analysis';
import { calculateRentalMetrics, initialCalculatorInputs } from '@/lib/models/analysisModel';

// Initial state definition
const initialState: AnalysisState = {
  properties: [],
  currentProperty: null,
  calculatorInputs: initialCalculatorInputs,
  isLoading: false,
  error: null
};

// Create context with initial state
const AnalysisContext = createContext<{
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
  updateCalculatorInputs: (inputs: Partial<CalculatorInputs>) => void;
  runAnalysis: () => void;
  resetCalculator: () => void;
} | undefined>(undefined);

// Reducer function to handle state updates
function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SET_CURRENT_PROPERTY':
      return { ...state, currentProperty: action.payload };
    case 'UPDATE_CALCULATOR_INPUTS':
      return { 
        ...state, 
        calculatorInputs: { ...state.calculatorInputs, ...action.payload } 
      };
    case 'SET_ANALYSIS_RESULT':
      return { 
        ...state, 
        currentProperty: action.payload 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_CALCULATOR':
      return { 
        ...state, 
        calculatorInputs: initialCalculatorInputs,
        currentProperty: null
      };
    default:
      return state;
  }
}

// Provider component
export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  const updateCalculatorInputs = (inputs: Partial<CalculatorInputs>) => {
    dispatch({ type: 'UPDATE_CALCULATOR_INPUTS', payload: inputs });
  };

  const runAnalysis = () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Calculate metrics using the model
      const analysisResult = calculateRentalMetrics(state.calculatorInputs);
      
      // Update state with results
      dispatch({ 
        type: 'SET_ANALYSIS_RESULT', 
        payload: {
          id: 'current-analysis',
          address: state.calculatorInputs.propertyAddress || 'New Property',
          analysis: analysisResult,
          inputs: { ...state.calculatorInputs }
        } 
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An error occurred during analysis' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetCalculator = () => {
    dispatch({ type: 'RESET_CALCULATOR' });
  };

  const contextValue = {
    state,
    dispatch,
    updateCalculatorInputs,
    runAnalysis,
    resetCalculator
  };

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
};

// Custom hook for using the context
export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}; 