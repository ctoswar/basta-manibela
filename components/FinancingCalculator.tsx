"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { calculateLoan } from "@/lib/finance";
import { formatPHP } from "@/lib/format";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

const TERM_OPTIONS = [12, 24, 36, 48, 60];

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
  const [termOpen, setTermOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTermOpen(false);
      }
    }
    if (termOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [termOpen]);

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

        <div className="block">
          <span className="font-body text-xs text-muted">Loan term</span>
          <div ref={dropdownRef} className="relative mt-1">
            <button
              type="button"
              onClick={() => setTermOpen(!termOpen)}
              className="flex w-full items-center justify-between border-b border-white/20 bg-transparent py-2 font-body text-left text-paper transition-colors hover:border-white/30 focus:border-gold focus:outline-none"
            >
              <span>{termMonths} months</span>
              <ChevronDown
                className={`h-4 w-4 text-muted transition-transform duration-300 ease-out ${
                  termOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Dropdown panel */}
            <div
              className={`absolute z-20 mt-1 w-full overflow-hidden border border-white/10 bg-surface shadow-xl transition-all duration-300 ease-out ${
                termOpen
                  ? "max-h-60 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="py-1">
                {TERM_OPTIONS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setTermMonths(m);
                      setTermOpen(false);
                    }}
                    className={`flex w-full flex-col px-4 py-2.5 text-left font-body transition-all duration-200 ${
                      termMonths === m
                        ? "bg-gold/10 text-gold-bright"
                        : "text-silver hover:bg-white/5 hover:text-paper"
                    }`}
                    style={{
                      transitionDelay: termOpen ? `${i * 40}ms` : "0ms",
                    }}
                  >
                    <span className="text-sm">{m} months</span>
                    <span className="text-xs text-muted">
                      ~{formatPHP(Math.round(result.monthlyPayment * m / termMonths * m))} total
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
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
