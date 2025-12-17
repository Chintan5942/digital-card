export const themePalettes = {
  indigo: {
    accentText: "text-indigo-100",
    accentBadge: "bg-indigo-500/15 text-indigo-100 border border-indigo-500/50",
    accentButton: "bg-indigo-500 hover:bg-indigo-400 text-white",
    accentBorder: "border-indigo-400/60",
    accentRing: "focus:border-indigo-400/60 focus:ring-indigo-500/40",
  },
  emerald: {
    accentText: "text-emerald-100",
    accentBadge: "bg-emerald-500/15 text-emerald-100 border border-emerald-500/50",
    accentButton: "bg-emerald-500 hover:bg-emerald-400 text-white",
    accentBorder: "border-emerald-400/60",
    accentRing: "focus:border-emerald-400/60 focus:ring-emerald-500/40",
  },
  rose: {
    accentText: "text-rose-100",
    accentBadge: "bg-rose-500/15 text-rose-100 border border-rose-500/50",
    accentButton: "bg-rose-500 hover:bg-rose-400 text-white",
    accentBorder: "border-rose-400/60",
    accentRing: "focus:border-rose-400/60 focus:ring-rose-500/40",
  },
  amber: {
    accentText: "text-amber-100",
    accentBadge: "bg-amber-500/15 text-amber-100 border border-amber-500/50",
    accentButton: "bg-amber-500 hover:bg-amber-400 text-slate-950",
    accentBorder: "border-amber-400/60",
    accentRing: "focus:border-amber-400/60 focus:ring-amber-500/40",
  },
};

export function getPalette(theme) {
  return themePalettes[theme] || themePalettes.indigo;
}
