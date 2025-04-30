"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type {
  CalculatorType,
  MortgageInputs,
  RentalInputs,
  AirbnbInputs,
  WholesaleInputs,
  MortgageAnalysisResults,
  RentalAnalysisResults,
  AirbnbAnalysisResults,
  WholesaleAnalysisResults,
} from "@/types/analysis"; // Removed unused AnalysisResults

// ----------- Calculator State & Actions ------------

export interface CalculatorState {
  type?: CalculatorType;
  mortgage?: MortgageInputs;
  rental?: RentalInputs;
  airbnb?: AirbnbInputs;
  wholesale?: WholesaleInputs;

  mortgageResults?: MortgageAnalysisResults;
  rentalResults?: RentalAnalysisResults;
  airbnbResults?: AirbnbAnalysisResults;
  wholesaleResults?: WholesaleAnalysisResults;
}

type CalculatorAction =
  | { type: "SET_TYPE"; payload: CalculatorType }
  | { type: "SET_INPUTS"; payload: Partial<CalculatorState> }
  | { type: "SET_RESULTS"; payload: Partial<CalculatorState> }
  | { type: "RESET_CALCULATOR" };

// ----------- Initial State ------------

const initialState: CalculatorState = {
  type: undefined,
  mortgage: undefined,
  rental: undefined,
  airbnb: undefined,
  wholesale: undefined,
  mortgageResults: undefined,
  rentalResults: undefined,
  airbnbResults: undefined,
  wholesaleResults: undefined,
};

// ----------- Reducer Function ------------

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };

    case "SET_INPUTS":
      return { ...state, ...action.payload };

    case "SET_RESULTS":
      return { ...state, ...action.payload };

    case "RESET_CALCULATOR":
      return initialState;

    default:
      return state;
  }
}

// ----------- Context Setup ------------

const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
} | null>(null);

// ----------- Provider Component ------------

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

// ----------- Hook ------------

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}

CalculatorProvider.displayName = "CalculatorProvider";
