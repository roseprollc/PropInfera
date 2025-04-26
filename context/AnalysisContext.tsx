"use client";

import React, { createContext, useContext, useReducer } from 'react';
import { AnalysisState, AnalysisAction, CalculatorInputs } from '@/types/analysis';

interface AnalysisContextType {
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
}

const initialState: AnalysisState = {
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
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: 0,
    nightlyRate: 0,
    occupancyRate: 0,
    cleaningFee: 0,
    platformFeesPercent: 0
  },
  results: null
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
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

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

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