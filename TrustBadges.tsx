import { Shield, Zap, Award, Gift } from "lucide-react";

const badges = [
  {
    icon: Zap,
    label: "Instant digital delivery",
  },
  {
    icon: Shield,
    label: "Safe & secure payment",
  },
  {
    icon: Award,
    label: "Certified reseller",
  },
  {
    icon: Gift,
    label: "Millions of happy customers",
  },
];

export function TrustBadges({ variant = "horizontal" }: { variant?: "horizontal" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-4">
        {badges.slice(0, 2).map((badge) => (
          <div key={badge.label} className="flex items-center gap-2 text-sm text-slate-600">
            <badge.icon className="w-4 h-4 text-emerald-600" />
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <badge.icon className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
