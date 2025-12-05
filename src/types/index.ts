export interface FinancialGoal {
  description: string;
  value: number;
  targetDate: string;
}

export interface FinancialData {
  grossIncome: number;
  netIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  hasDebitCard: boolean;
  hasCreditCard: boolean;
  creditLimit: number;
  currentSavings: number;
}

export interface CalculationResult {
  canBuyNow: boolean;
  monthlySavings: number;
  monthsToSave: number;
  paymentMethod: 'debit' | 'credit' | 'save-first';
  recommendation: string;
  impactEmergencyFund: boolean;
  warnings: string[];
}
