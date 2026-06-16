interface ColumnHeaderProps {
  title: string;
  meta?: string;
}

/** Shared section header for dashboard columns (Notion/Linear-style). */
export function ColumnHeader({ title, meta }: ColumnHeaderProps) {
  return (
    <div className="mb-4 flex shrink-0 items-baseline justify-between border-b border-gray-100 pb-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">{title}</h2>
      {meta ? <span className="text-xs tabular-nums text-gray-400">{meta}</span> : null}
    </div>
  );
}
