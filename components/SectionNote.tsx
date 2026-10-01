/**
 * The `◆ …` annotations in the design doc are notes-to-the-builder, not page
 * copy, so they are not rendered. This component exists so the handful that
 * double as user-facing hints (the "click the green words" nudge) can still be
 * shown in the same monospace key the design used for them.
 */
export default function SectionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 font-mono text-[11px] leading-relaxed text-mute-4">
      ◆ {children}
    </p>
  );
}
