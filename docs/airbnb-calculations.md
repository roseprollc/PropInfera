# Airbnb Calculator Documentation

## 📌 Overview
The Airbnb calculator estimates property profitability by analyzing key metrics including nightly rates, occupancy, operating expenses, and financing assumptions. It provides investors with a comprehensive view of potential returns on short-term rental properties.

## 🧠 Calculation Flow

### 1. Mortgage Calculation
```typescript
// Inputs: purchasePrice, downPaymentPercent, interestRate, loanTerm
const downPayment = (purchasePrice * downPaymentPercent) / 100;
const loanAmount = purchasePrice - downPayment;
const monthlyInterestRate = interestRate / 100 / 12;
const numberOfPayments = loanTerm * 12;
const monthlyMortgagePayment = (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
```

### 2. Operating Expenses
```typescript
// Fixed Monthly Expenses
const monthlyPropertyTax = propertyTaxAnnual / 12;
const monthlyInsurance = insuranceAnnual / 12;
const monthlyMaintenance = (purchasePrice * maintenancePercent) / 100 / 12;

// Variable Monthly Expenses
const monthlyCleaningFees = cleaningFee * nightsBooked;
const monthlyPlatformFees = (monthlyRevenue * platformFeesPercent) / 100;
const monthlyPropertyManagement = (monthlyRevenue * propertyManagementPercent) / 100;

const monthlyOperatingExpenses = monthlyPropertyTax + monthlyInsurance + utilitiesMonthly + monthlyMaintenance + monthlyPropertyManagement;
```

### 3. Revenue Calculation
```typescript
// Inputs: nightlyRate, occupancyRate, cleaningFee
const nightsBooked = (30 * occupancyRate) / 100;
const monthlyCleaningFees = cleaningFee * nightsBooked;
const monthlyRevenue = nightlyRate * nightsBooked + monthlyCleaningFees;
```

### 4. Cash Flow & Returns
```typescript
const monthlyCashFlow = monthlyRevenue - monthlyMortgagePayment - monthlyOperatingExpenses;
const annualCashFlow = monthlyCashFlow * 12;
const capRate = (annualCashFlow / purchasePrice) * 100;
const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
```

## 🔁 Update Summary

### Recent Changes
1. **Platform Fees**: Moved from revenue deduction to operating expenses for clearer financial reporting
2. **Code Structure**: Reordered variable declarations to resolve linter errors and improve readability
3. **Documentation**: Added inline comments to clarify calculation stages

### Key Improvements
- Better separation of fixed vs. variable expenses
- Clearer revenue calculation structure
- Improved type safety with explicit interfaces
- Enhanced error handling for edge cases

## 📄 File Reference
- Location: `/components/calculators/AirbnbCalculator.tsx`
- Key Components:
  - `AirbnbInputs` interface
  - `AirbnbResults` interface
  - `calculateResults` function
  - `formatCurrency` and `formatPercent` utilities

## 🎯 Key Metrics
1. **Monthly Cash Flow**: Net income after all expenses
2. **Cap Rate**: Annual return on total investment
3. **Cash-on-Cash Return**: Annual return on cash invested
4. **Occupancy Rate**: Percentage of nights booked
5. **Average Daily Rate**: Revenue per available night

## ⚠️ Important Notes
- All calculations assume 30-day months
- Platform fees are calculated on gross revenue
- Property management fees are calculated on gross revenue
- Maintenance costs are based on property value
- Cleaning fees are per booking 