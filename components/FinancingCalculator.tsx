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

  const downPaymentAmount = Math.round(vehiclePrice * (downPaymentPercent / 100));

  return (
    <div className="rounded-sm border border-white/10 bg-surface">
      {/* Hero: Monthly payment */}
      <div className="border-b border-white/10 px-6 py-8 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.25em] text-muted">
          Estimated monthly payment
        </p>
        <p className="mt-3 font-display text-5xl tracking-tight text-gold-bright transition-colors sm:text-6xl">
          {formatPHP(Math.round(animatedMonthly))}
        </p>
        <p className="mt-2 font-body text-xs text-muted">
          for {termMonths} months
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-6 px-6 pt-6 pb-6">
        {/* Vehicle price */}
        <div>
          <label className="block">
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              Vehicle price
            </span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-body text-sm text-muted">
                ₱
              </span>
              <input
                type="number"
                value={vehiclePrice}
                min={0}
                step={10000}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full border-b border-white/10 bg-transparent py-2 pl-5 pr-2 font-body text-lg text-paper transition-colors placeholder:text-muted/40 focus:border-gold focus:outline-none"
              />
            </div>
          </label>
        </div>

        {/* Down payment slider */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              Down payment
            </span>
            <span className="font-display text-lg text-paper">
              {downPaymentPercent}%
              <span className="ml-1.5 font-body text-xs text-muted">
                ({formatPHP(downPaymentAmount)})
              </span>
            </span>
          </div>
          <div className="relative mt-3">
            <input
              type="range"
              min={10}
              max={80}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="slider-gold w-full"
              style={{
                background: `linear-gradient(to right, #C9A227 0%, #C9A227 ${((downPaymentPercent - 10) / 70) * 100}%, rgba(255,255,255,0.1) ${((downPaymentPercent - 10) / 70) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="mt-1.5 flex justify-between font-body text-[10px] text-muted">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        {/* Interest rate slider */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              Interest rate
            </span>
            <span className="font-display text-lg text-paper">
              {annualRate}%
              <span className="ml-1.5 font-body text-xs text-muted">/year</span>
            </span>
          </div>
          <div className="relative mt-3">
            <input
              type="range"
              min={3}
              max={18}
              step={0.1}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="slider-gold w-full"
              style={{
                background: `linear-gradient(to right, #C9A227 0%, #C9A227 ${((annualRate - 3) / 15) * 100}%, rgba(255,255,255,0.1) ${((annualRate - 3) / 15) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="mt-1.5 flex justify-between font-body text-[10px] text-muted">
              <span>3%</span>
              <span>18%</span>
            </div>
          </div>
        </div>

        {/* Loan term dropdown */}
        <div>
          <span className="font-body text-[11px] uppercase tracking-widest text-muted">
            Loan term
          </span>
          <div ref={dropdownRef} className="relative mt-2">
            <button
              type="button"
              onClick={() => setTermOpen(!termOpen)}
              className="flex w-full items-center justify-between border-b border-white/10 bg-transparent py-2 font-body text-left text-paper transition-colors hover:border-white/20 focus:border-gold focus:outline-none"
            >
              <span className="text-lg">{termMonths} months</span>
              <ChevronDown
                className={`h-4 w-4 text-muted transition-transform duration-300 ease-out ${
                  termOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

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

      {/* Breakdown stats */}
      {!compact && (
        <div className="border-t border-white/10 px-6 py-6">
          <p className="mb-4 font-body text-[11px] uppercase tracking-[0.25em] text-muted">
            Payment breakdown
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Down payment", value: Math.round(animatedDown), accent: false },
              { label: "Loan amount", value: Math.round(animatedPrincipal), accent: false },
              { label: "Total interest", value: Math.round(animatedInterest), accent: false },
              { label: "Total payable", value: Math.round(animatedTotal), accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} className="text-center">
                <p className="font-body text-[10px] uppercase tracking-wider text-muted">
                  {label}
                </p>
                <p
                  className={`mt-1 font-display text-lg ${
                    accent ? "text-gold-bright" : "text-paper"
                  }`}
                >
                  {formatPHP(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-t border-white/5 px-6 py-4">
        <p className="font-body text-[11px] leading-relaxed text-muted/70">
          This is an estimate for planning purposes only and doesn&apos;t
          constitute a loan offer. Final terms depend on the financing
          partner&apos;s approval.
        </p>
      </div>

      {/* Custom range slider styles */}
      <style jsx global>{`
        .slider-gold {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          outline: none;
        }

        .slider-gold::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #E9C567;
          cursor: pointer;
          border: 3px solid #16171B;
          box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .slider-gold::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.4), 0 2px 12px rgba(0, 0, 0, 0.5);
        }

        .slider-gold::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }

        .slider-gold::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #E9C567;
          cursor: pointer;
          border: 3px solid #16171B;
          box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .slider-gold::-moz-range-thumb:hover {
          transform: scale(1.15);
        }

        .slider-gold::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.1);
        }

        .slider-gold::-moz-range-progress {
          height: 4px;
          border-radius: 2px;
          background: #C9A227;
        }
      `}</style>
    </div>
  );
}
