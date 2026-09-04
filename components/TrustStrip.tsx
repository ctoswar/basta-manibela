import { ShieldCheck, Handshake, SearchCheck, Gauge } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Quality used vehicles" },
  { icon: Handshake, label: "Fair prices you can trust" },
  { icon: SearchCheck, label: "Inspected & ready to drive" },
  { icon: Gauge, label: "Smooth transactions", animate: true },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-surface">
      <div className="mx-auto grid max-w-6xl divide-y divide-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
        {ITEMS.map(({ icon: Icon, label, animate }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-6 py-6 md:justify-center"
          >
            <Icon
              className={`h-5 w-5 shrink-0 text-gold ${animate ? "needle-sweep" : ""}`}
              strokeWidth={1.5}
            />
            <span className="font-body text-sm text-silver">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
