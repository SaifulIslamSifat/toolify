interface AdPlaceholderProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdPlaceholder({
  format = "horizontal",
  className = "",
}: AdPlaceholderProps) {
  // Respect user experience - non-intrusive, clean placeholder for future monetization
  return (
    <div
      className={`relative w-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-4 text-center my-6 overflow-hidden ${className}`}
    >
      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Advertisement Space
        </span>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
          Toolify is free. In the future, non-intrusive sponsor placements may support our infrastructure costs.
        </p>
      </div>
    </div>
  );
}
