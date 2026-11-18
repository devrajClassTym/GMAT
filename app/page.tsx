import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { NavLinks } from "./nav-links";

function Icon({
  name,
}: {
  name: "arrow" | "users" | "chart" | "list" | "spark" | "check";
}) {
  const paths = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    users:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    chart: "M4 19h16M6 14l4-4 4 3 6-8m-5 0h5v5",
    list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
    spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
    check: "m5 12 4 4L19 6",
  };
  return (
    <svg
      width="18"
      height="18"
      className="inline-block w-4.5 h-4.5 max-w-4.5 max-h-4.5 flex-none align-middle"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-svh">
      <header className="max-w-300 mx-auto py-6.5 px-9 flex justify-between items-center max-[700px]:flex-wrap max-[700px]:gap-3.5 max-[600px]:py-5.5 max-[600px]:px-5">
        <Link
          href="/"
          className="inline-flex items-center gap-[9px] text-[20px] font-bold tracking-[-0.8px] [&_svg]:w-8 [&_svg]:h-8 [&_svg]:text-accent [&_>_span]:text-muted [&_>_span]:font-normal [&_>_span]:ml-[-7px] max-[600px]:text-[18px] max-[600px]:[&_svg]:w-7 max-[600px]:[&_svg]:h-7"
          aria-label="GMAT Prep home"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="9" fill="currentColor" />
            <path
              d="M9 22V17M16 22V12M23 22V8"
              stroke="var(--background)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          GMAT<span>prep</span>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-5 max-[700px]:ml-auto max-[600px]:gap-3">
          <ThemeToggle />
          <Link href="/login">Log in</Link>
          <Link
            className="border border-line rounded-[7px] bg-surface text-foreground py-2.5 px-[21px] text-[13px] font-[550] max-[600px]:py-[9px] max-[600px]:px-3.5"
            href="/register"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="max-w-300 my-0 mx-auto pt-[clamp(65px,10vh,115px)] px-9 pb-15 grid grid-cols-[1.15fr_1fr] items-center gap-16 max-[950px]:gap-8 max-[760px]:grid-cols-1 max-[760px]:gap-10.5 max-[760px]:max-w-155 max-[600px]:pt-20 max-[600px]:px-5 max-[600px]:pb-10">
        <div className="min-w-0">
          <h1 className="m-0 text-[clamp(38px,_4.5vw,_60px)] leading-[1.08] font-medium tracking-[-2.5px] text-balance [&_em]:font-serif [&_em]:font-normal [&_em]:text-accent [&_em]:tracking-[-2.5px] max-[600px]:text-[clamp(34px,_8vw,_46px)] max-[600px]:tracking-[-1.6px]">
            Your <span className="[&&]:font-[650]">GMAT goal.</span>
            <br />A <em>smarter</em>
            <br />
            starting point<span className="text-accent">.</span>
          </h1>
          <div className="mt-[35px]">
            <Link
              className="inline-flex items-center justify-center gap-7.5 py-[17px] px-6 border-0 rounded-[8px] bg-accent text-button-text text-[14px] font-[550] [&_>_span]:text-[21px] [&_>_span]:leading-none"
              href="/diagnostic"
            >
              Start my diagnostic <Icon name="arrow" />
            </Link>
            <p className="mt-[15px] mx-0 mb-0 text-[11px] leading-[1.9] text-muted">
              15 questions · No signup to begin
              <br />
              Account required to view results.
            </p>
          </div>
          <section
            className="[&&]:[&_>_div_>_svg]:block [&&]:[&_>_div_>_svg]:w-[17px] [&&]:[&_>_div_>_svg]:h-[17px] [&&]:[&_>_div_>_svg]:text-accent [&&]:[&_>_div_>_svg]:mb-2.5 max-w-190 mt-11 mx-0 mb-0 pt-8 border-t border-t-line grid grid-cols-[1fr_1.3fr_1fr] [&_>_div]:py-0 [&_>_div]:px-3 [&_>_div:first-child]:pl-0 [&_>_div_+_div]:border-l [&_>_div_+_div]:border-l-line [&_strong]:text-[29px] [&_strong]:font-[550] [&_strong]:tracking-[-1.4px] [&_strong_>_span]:text-accent [&_p]:mt-2 [&_p]:mx-0 [&_p]:mb-0 [&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:text-muted max-[600px]:mt-9.5 max-[600px]:grid-cols-[1fr_1.3fr_1fr] max-[600px]:[&_>_div]:px-[9px] max-[600px]:[&_strong]:text-[25px] max-[600px]:[&_p]:mt-1"
            aria-label="Sample platform statistics"
          >
            <div>
              <Icon name="users" />
              <strong>
                10,000<span>+</span>
              </strong>
              <p>Learners registered</p>
            </div>
            <div>
              <Icon name="chart" />
              <strong>
                24<span>%</span>
              </strong>
              <p>Average practice score improvement</p>
            </div>
            <div>
              <Icon name="list" />
              <strong>15</strong>
              <p>Questions to get started</p>
            </div>
          </section>
        </div>
        <aside
          className="min-w-0 relative isolate pt-9.5 px-4 pb-6.5 before:content-[''] before:absolute before:inset-[-35px_-25px] before:-z-1 before:bg-[radial-gradient(ellipse,_var(--wash),_transparent_68%)] before:opacity-70 max-[950px]:pt-5.5 max-[950px]:px-4 max-[950px]:pb-3.5 max-[760px]:max-w-115 max-[760px]:w-full max-[760px]:justify-self-center max-[760px]:before:inset-x-0"
          aria-label="Illustrative GMAT practice question"
        >
          <div className="absolute z-1 flex items-center gap-2.5 border border-line bg-surface shadow-[0_10px_30px_var(--shadow)] text-accent top-2 right-0 py-3 px-4 rounded-[30px] text-[11px] font-[550] rotate-4 animate-badge-float motion-reduce:animate-none">
            <Icon name="spark" />
            <span>A smarter way to start</span>
          </div>
          <div className="bg-surface border border-line rounded-[18px] p-[27px] shadow-[0_28px_65px_var(--shadow),_0_3px_10px_var(--shadow)] -rotate-3 animate-card-float will-change-transform [&_h2]:text-[25px] [&_h2]:font-[550] [&_h2]:leading-[1.3] [&_h2]:tracking-[-.8px] [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-[15px] max-[950px]:p-5 max-[760px]:mx-[5px] motion-reduce:animate-none">
            <div className="flex justify-between items-center gap-3 max-[950px]:flex-wrap">
              <span className="flex items-center gap-[7px] text-accent text-[9px] font-semibold tracking-[1.2px] [&&]:[&_svg]:w-[15px] [&&]:[&_svg]:h-[15px]">
                <Icon name="chart" />
                QUANTITATIVE REASONING
              </span>
              <span className="text-muted text-[8px] tracking-[1px] border border-line py-1 px-1.5 rounded-[4px]">
                PREVIEW
              </span>
            </div>
            <div
              className="h-[3px] rounded-[3px] bg-line my-5.5 mx-0 [&_span]:block [&_span]:w-[7%] [&_span]:h-full [&_span]:bg-accent [&_span]:rounded-[inherit]"
              aria-hidden="true"
            >
              <span />
            </div>
            <p className="text-[10px] font-[550] mt-0 mx-0 mb-3 [&_span]:text-muted">
              Question 01 <span>/ 15</span>
            </p>
            <h2>
              A little practice.
              <br />A clearer path forward.
            </h2>
            <p className="text-[12px] leading-[1.8] text-muted mt-0 mx-0 mb-5.5">
              A number increased by 20% equals 60.
              <br />
              What is the original number?
            </p>
            <div className="grid grid-cols-2 gap-2.5 [&_>_div]:flex [&_>_div]:items-center [&_>_div]:gap-3 [&_>_div]:border [&_>_div]:border-line [&_>_div]:rounded-[7px] [&_>_div]:p-3 [&_>_div]:text-[13px] [&_>_div_>_span]:text-muted [&_>_div_>_span]:text-[10px]">
              <div>
                <span>A</span> 40
              </div>
              <div>
                <span>B</span> 48
              </div>
              <div className="[&&]:border-accent [&&]:bg-[color-mix(in_srgb,_var(--accent)_7%,_var(--background))] [&&]:text-accent [&_b]:ml-auto [&_b]:flex [&&]:[&_svg]:w-3.5 [&&]:[&_svg]:h-3.5">
                <span>C</span> 50{" "}
                <b>
                  <Icon name="check" />
                </b>
              </div>
              <div>
                <span>D</span> 54
              </div>
            </div>
            <div className="flex items-center gap-2 mt-[25px] pt-[19px] border-t border-t-line text-[10px] text-muted">
              <span className="flex text-accent [&&]:[&_svg]:w-[15px] [&&]:[&_svg]:h-[15px]">
                <Icon name="check" />
              </span>
              <span>One question. One step closer.</span>
            </div>
          </div>
          <div className="absolute z-1 flex items-center gap-2.5 border border-line bg-surface shadow-[0_10px_30px_var(--shadow)] text-accent bottom-13 -left-4 py-[15px] px-[19px] rounded-[12px] rotate-2 animate-count-float [&_strong]:block [&_strong]:text-[13px] [&_strong]:font-semibold [&_strong]:text-foreground [&_div_>_span]:block [&_div_>_span]:text-[9px] [&_div_>_span]:text-muted [&_div_>_span]:mt-1 max-[760px]:left-0 motion-reduce:animate-none">
            <span className="p-[9px] rounded-[10px] bg-[color-mix(in_srgb,_var(--accent)_10%,_var(--surface))] flex">
              <Icon name="list" />
            </span>
            <div>
              <strong>15 questions</strong>
              <span>Your starting point, simplified.</span>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted mt-10.5 mx-0 mb-[3px]">
            A glimpse of your GMAT prep journey.
          </p>
        </aside>
      </main>
    </div>
  );
}
