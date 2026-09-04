export interface LoanInput {
  vehiclePrice: number;
  downPaymentPercent: number; // 0-100
  annualInterestRatePercent: number;
  termMonths: number;
}

export interface LoanResult {
  downPaymentAmount: number;
  principal: number;
  monthlyPayment: number;
  totalPayable: number;
  totalInterest: number;
}

export function calculateLoan(input: LoanInput): LoanResult {
  const downPaymentAmount =
    input.vehiclePrice * (input.downPaymentPercent / 100);
  const principal = input.vehiclePrice - downPaymentAmount;
  const monthlyRate = input.annualInterestRatePercent / 100 / 12;
  const n = input.termMonths;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayable = monthlyPayment * n;
  const totalInterest = totalPayable - principal;

  return {
    downPaymentAmount,
    principal,
    monthlyPayment,
    totalPayable,
    totalInterest,
  };
}
