/**
 * Stand-in for a screenshot. The design uses a 135° diagonal hatch with the
 * intended shot named in monospace — keeping that here means every empty slot
 * tells you what image belongs in it. Drop a <Image> in place of this when the
 * real asset exists.
 */
export default function Hatch({
  label,
  className = "",
  ratio = "16/10",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`hatch flex select-none items-center justify-center font-mono text-[11px] text-mute-4 md:text-xs ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {label}
    </div>
  );
}
