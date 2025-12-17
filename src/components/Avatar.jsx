import { getPalette } from "../utils/theme";

export default function Avatar({ url, initials, theme = "indigo", size = "12", className = "" }) {
  const palette = getPalette(theme);
  const sizeClass = size === "14" ? "h-14 w-14" : size === "10" ? "h-10 w-10" : "h-12 w-12";
  const textSize = size === "14" ? "text-xl" : "text-lg";
  const fallbackInitials = initials || "DP";

  if (url) {
    return (
      <img
        src={url}
        alt="Avatar"
        className={`${sizeClass} rounded-2xl border border-slate-700/70 object-cover shadow-inner shadow-slate-950/40 ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/60 ${textSize} font-semibold ${palette.accentText} ${className}`}
    >
      {fallbackInitials}
    </div>
  );
}
