"use client";

import { useMemo, useState } from "react";
import { calculateLoan } from "@/lib/finance";
import { formatPHP } from "@/lib/format";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

export default function FinancingCalculator({
  initialPrice = 1000000,
  compact = false,
}: {
  initialPrice?: number;
  compact?: boolean;
}) {
  const [vehiclePrice, setVehiclePrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [annualRate, setAnnualRate] = useState(9.5);
  const [termMonths, setTermMonths] = useState(48);

  const result = useMemo(
    () =>
      calculateLoan({
        vehiclePrice,
        downPaymentPercent,
        annualInterestRatePercent: annualRate,
        termMonths,
      }),
    [vehiclePrice, downPaymentPercent, annualRate, termMonths]
  );

  const animatedMonthly = useAnimatedNumber(result.monthlyPayment);
  const animatedInterest = useAnimatedNumber(result.totalInterest);
  const animatedTotal = useAnimatedNumber(result.totalPayable);
  const animatedDown = useAnimatedNumber(result.downPaymentAmount);
  const animatedPrincipal = useAnimatedNumber(result.principal);

  return (
    <div className="rounded-sm border border-white/10 bg-surface p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-body text-xs text-muted">Vehicle price</span>
          <input
            type="number"
            value={vehiclePrice}
            min={0}
            step={10000}
            onChange={(e) => setVehiclePrice(Number(e.target.value))}
            className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper focus:border-gold focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="font-body text-xs text-muted">
            Down payment — {downPaymentPercent}%
          </span>
          <input
            type="range"
            min={10}
            max={80}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="mt-3 w-full accent-gold"
          />
        </label>

        <label className="block">
          <span className="font-body text-xs text-muted">
            Interest rate — {annualRate}% per year
          </span>
          <input
            type="range"
            min={3}
            max={18}
            step={0.1}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="mt-3 w-full accent-gold"
          />
        </label>

        <label className="block">
          <span className="font-body text-xs text-muted">Loan term</span>
          <select
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value))}
            className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper focus:border-gold focus:outline-none"
          >
            {[12, 24, 36, 48, 60].map((m) => (
              <option key={m} value={m} className="bg-surface">
                {m} months
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <span className="font-body text-xs text-muted">
          Estimated monthly payment
        </span>
        <p className="font-display text-5xl text-gold-bright transition-colors">
          {formatPHP(Math.round(animatedMonthly))}
        </p>

        {!compact && (
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-body text-sm text-silver">
            <span>Down payment: {formatPHP(Math.round(animatedDown))}</span>
            <span>Loan amount: {formatPHP(Math.round(animatedPrincipal))}</span>
            <span>Total interest: {formatPHP(Math.round(animatedInterest))}</span>
            <span>Total payable: {formatPHP(Math.round(animatedTotal))}</span>
          </div>
        )}
      </div>

      <p className="mt-4 font-body text-xs text-muted">
        This is an estimate for planning purposes only and doesn&apos;t
        constitute a loan offer. Final terms depend on the financing
        partner&apos;s approval.
      </p>
    </div>
  );
}
