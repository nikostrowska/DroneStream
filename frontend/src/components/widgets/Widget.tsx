interface WidgetProps {
  title: string;
  value?: string;
}

export default function Widget({ title, value }: WidgetProps) {
  return (
    <div className="w-full bg-white rounded-widget shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {title}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-2 min-h-[40px] flex items-center justify-center">
        <span className="text-lg font-mono font-bold text-slate-700">
          {value || "---"}
        </span>
      </div>
    </div>
  );
}
