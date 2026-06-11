interface WidgetProps {
  title: string;
  value?: string;
}

export default function Widget({ title, value }: WidgetProps) {
  return (
    <div className="w-full bg-white/20 rounded-xl shadow-sm border border-white/20 p-4 flex flex-col gap-2 theme-transition">
      <div className="flex justify-between items-center">
        <span className="text-[16px] font-bold text-muted uppercase tracking-widest">
          {title}
        </span>
      </div>

      <div className="rounded-lg p-2 min-h-[40px] flex items-center justify-center">
        <span className="text-lg font-mono font-bold text-accent">
          {value || "---"}
        </span>
      </div>
    </div>
  );
}
