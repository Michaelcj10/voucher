"use client";

import { useState } from "react";

interface Denomination {
  value: number;
  currency: string;
  label: string;
}

export function DenominationSelector({
  denominations,
  cardName,
}: {
  denominations: Denomination[];
  cardName: string;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="font-medium text-ink mb-1">Choose amount</h3>
      <p className="text-sm text-ink-muted mb-4">
        Select a denomination for your {cardName} gift card
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
        {denominations.map((d, i) => (
          <button
            key={d.value}
            onClick={() => setSelected(i)}
            className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
              selected === i
                ? "bg-brand-600 text-white shadow-md shadow-brand-200"
                : "bg-slate-100 text-ink hover:bg-slate-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <button className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors shadow-md shadow-brand-200/50">
        Buy {denominations[selected]?.label} {cardName} Gift Card
      </button>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-ink-faint">
        <span>Visa</span>
        <span>Mastercard</span>
        <span>PayPal</span>
        <span>Apple Pay</span>
        <span>+more</span>
      </div>
    </div>
  );
}
