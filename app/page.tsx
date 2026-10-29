import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import "./landing.css";

function Icon({ name }: { name: "arrow" | "users" | "chart" | "list" | "spark" | "check" }) {
  const paths = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    chart: "M4 19h16M6 14l4-4 4 3 6-8m-5 0h5v5",
    list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
    spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
    check: "m5 12 4 4L19 6",
  };
  return <svg width="18" height="18" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export default function Home() {
  return (
    <div className="landing">
      <header className="navbar">
        <Link href="/" className="logo" aria-label="GMAT Prep home">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="currentColor" />
            <path d="M9 22V17M16 22V12M23 22V8" stroke="var(--background)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          GMAT<span>prep</span>
        </Link>
        <nav className="navbar-actions" aria-label="Account and appearance">
          <ThemeToggle />
          <button className="signup-button" type="button" disabled title="Signup will be available later">Sign up</button>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-copy">
          <h1>Your <span className="title-goal">GMAT goal.</span><br />A <em>smarter</em><br />starting point<span className="title-period">.</span></h1>
          <div className="hero-action">
            <Link className="primary-button" href="/diagnostic">
              Start my diagnostic <Icon name="arrow" />
            </Link>
            <p className="diagnostic-note">15 questions · No signup to begin<br />Account required to view results.</p>
          </div>
          <section className="stats" aria-label="Sample platform statistics">
            <div><Icon name="users" /><strong>10,000<span>+</span></strong><p>Learners registered</p></div>
            <div><Icon name="chart" /><strong>24<span>%</span></strong><p>Average practice score improvement</p></div>
            <div><Icon name="list" /><strong>15</strong><p>Questions to get started</p></div>
          </section>
        </div>
        <aside className="study-visual" aria-label="Illustrative GMAT practice question">
          <div className="floating-topic"><Icon name="spark" /><span>A smarter way to start</span></div>
          <div className="practice-card">
            <div className="practice-header"><span className="practice-label"><Icon name="chart" />QUANTITATIVE REASONING</span><span className="preview-label">PREVIEW</span></div>
            <div className="practice-progress" aria-hidden="true"><span /></div>
            <p className="question-count">Question 01 <span>/ 15</span></p>
            <h2>A little practice.<br />A clearer path forward.</h2>
            <p className="practice-question">A number increased by 20% equals 60.<br />What is the original number?</p>
            <div className="practice-options">
              <div><span>A</span> 40</div>
              <div><span>B</span> 48</div>
              <div className="selected-option"><span>C</span> 50 <b><Icon name="check" /></b></div>
              <div><span>D</span> 54</div>
            </div>
            <div className="practice-footer"><span className="check-icon"><Icon name="check" /></span><span>One question. One step closer.</span></div>
          </div>
          <div className="floating-count"><span className="count-icon"><Icon name="list" /></span><div><strong>15 questions</strong><span>Your starting point, simplified.</span></div></div>
          <p className="visual-caption">A glimpse of your GMAT prep journey.</p>
        </aside>
      </main>
    </div>
  );
}
