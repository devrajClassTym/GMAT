/** This component accepts no result data. Removing its blur only reveals XX values. */
export function LockedResultsBackdrop() {
  return (
    <main
      className="max-w-260 m-auto pt-[65px] px-[35px] pb-17.5 blur-[9px] select-none pointer-events-none [&_h1]:mt-4 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:text-[clamp(30px,_4vw,_45px)] [&_h1]:font-medium [&_h1]:leading-[1.2] [&_h1]:tracking-[-1.5px] [&_>_p]:text-[13px] [&_>_p]:text-muted [&_>_p]:leading-[1.9] max-[650px]:py-9 max-[650px]:px-5"
      aria-hidden="true"
      inert
    >
      <span className="text-[9px] tracking-[1.8px] font-semibold text-accent">
        YOUR STARTING POINT
      </span>
      <h1>Your diagnostic, decoded.</h1>
      <p>A clearer picture of your strengths and what comes next.</p>
      <div className="grid grid-cols-3 gap-4.5 mt-[35px] [&_>_div]:bg-surface [&_>_div]:border [&_>_div]:border-line [&_>_div]:rounded-[12px] [&_>_div]:p-[25px] [&_span]:block [&_span]:text-[11px] [&_span]:text-muted [&_strong]:block [&_strong]:mt-4.5 [&_strong]:mx-0 [&_strong]:mb-3 [&_strong]:text-[42px] [&_strong]:tabular-nums [&_strong]:tracking-[-2px] [&_strong]:font-[550] [&_span:last-child]:text-[10px] max-[650px]:gap-2.5 max-[650px]:[&_>_div]:py-[17px] max-[650px]:[&_>_div]:px-3 max-[650px]:[&_strong]:text-[28px] max-[650px]:[&_strong]:tracking-[-1px] max-[650px]:[&_span]:text-[10px] max-[650px]:[&_span:last-child]:text-[8px]">
        {[
          ["Practice accuracy", "XX%"],
          ["Correct answers", "XX / XX"],
          ["Time taken", "XX:XX"],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <span>Diagnostic overview</span>
          </div>
        ))}
      </div>
      <section className="bg-surface border border-line rounded-[12px] p-7 mt-[25px] [&_h2]:text-[19px] [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-7 [&_h2]:font-[550] [&_h2]:tracking-[-.5px] [&_h2]:mb-3.5 max-[650px]:py-[23px] max-[650px]:px-[19px]">
        <h2>Your skill breakdown</h2>
        {["Quantitative Reasoning", "Verbal Reasoning", "Data Insights"].map(
          (section, index) => (
            <div
              className="[&:not(:first-child)]:mt-6.5 [&_>_div:first-child]:flex [&_>_div:first-child]:justify-between [&_>_div:first-child]:gap-[15px] [&_>_div:first-child]:text-[12px] [&_strong]:font-medium [&_strong]:text-accent [&_p]:text-[10px] [&_p]:text-muted [&_p]:m-0 [&_p]:leading-[1.8]"
              key={section}
            >
              <div>
                <span>{section}</span>
                <strong>XX%</strong>
              </div>
              <div className="h-[7px] bg-line rounded-[7px] my-3 mx-0 overflow-hidden [&_>_span]:block [&_>_span]:bg-accent [&_>_span]:h-full [&_>_span]:rounded-[inherit]">
                <span style={{ width: `${[72, 58, 64][index]}%` }} />
              </div>
              <p>XX correct · XX questions · XX:XX average time</p>
            </div>
          ),
        )}
      </section>
    </main>
  );
}
