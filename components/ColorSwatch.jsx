"use client";

type Props = { color: string };

export default function ColorSwatch({ color }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-8 w-8 rounded-md border border-slate-300"
        style={{ backgroundColor: color }}
        title={color}
      />
      <code className="text-sm">{color}</code>
    </div>
  );
}
