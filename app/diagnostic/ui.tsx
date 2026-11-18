import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { NavLinks } from "../nav-links";

export function DiagnosticIcon({
  name,
}: {
  name: "clock" | "arrow" | "check" | "lock" | "book" | "close";
}) {
  const paths = {
    clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    check: "m5 12 4 4L19 6",
    lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5V10Zm7 4v3",
    book: "M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4V4Zm8 1v15",
    close: "m6 6 12 12M6 18 18 6",
  };
  return (
    <svg
      width="18"
      height="18"
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
export function DiagnosticHeader({ label }: { label: string }) {
  return (
    <header className="max-w-350 m-auto py-6 px-10 border-b border-b-line flex items-center gap-5.5 max-[700px]:flex-wrap max-[900px]:py-5 max-[900px]:px-6 max-[600px]:py-4.5 max-[600px]:px-4 max-[600px]:gap-[13px]">
      <Link
        href="/"
        className="flex items-center gap-[7px] text-[19px] font-[650] tracking-[-.5px] [&_>_svg]:text-accent [&_>_svg]:mr-[3px] [&_>_span]:text-muted [&_>_span]:font-normal [&_>_span]:ml-[-5px]"
      >
        <DiagnosticIcon name="book" />
        GMAT<span>prep</span>
      </Link>
      <NavLinks />
      <span className="text-[9px] tracking-[1.5px] ml-auto text-muted max-[600px]:text-[7px] max-[600px]:tracking-[.8px]">
        {label}
      </span>
      <ThemeToggle />
    </header>
  );
}
