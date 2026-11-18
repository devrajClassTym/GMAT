"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { apiRequest, isRecord, setAccessToken } from "../lib/api";
import { useSetAuthUser } from "./auth-session";
import { ThemeToggle } from "./theme-toggle";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const router = useRouter();
  const setUser = useSetAuthUser();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") ?? "").trim();
    const email = String(fields.get("email") ?? "").trim();
    const password = String(fields.get("password") ?? "");
    setError("");
    if (register && !name) {
      setError("Please enter your name.");
      return;
    }
    if (register && password !== fields.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    submitting.current = true;
    setPending(true);
    let accountCreated = false;
    try {
      if (register) {
        await apiRequest("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        accountCreated = true;
      }

      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data =
        isRecord(result) && isRecord(result.data) ? result.data : result;
      const token = isRecord(data)
        ? (data.accessToken ?? data.access_token ?? data.token)
        : undefined;
      const user = isRecord(data) && isRecord(data.user) ? data.user : null;

      setAccessToken(typeof token === "string" ? token : undefined);
      setUser({
        id:
          typeof user?.id === "string" || typeof user?.id === "number"
            ? String(user.id)
            : email,
        name: typeof user?.name === "string" ? user.name : name,
      });
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next === "/diagnostic/results" ? next : "/dashboard");
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.";
      setError(
        accountCreated
          ? `Your account was created, but automatic login failed. Please log in. ${message}`
          : message,
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <div className="min-h-dvh pt-7 px-6 pb-15 bg-[radial-gradient(ellipse_at_top_right,_var(--wash),_transparent_60%)] max-[480px]:pt-5 max-[480px]:px-4 max-[480px]:pb-10">
      <header className="max-w-290 m-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-[24px] font-extrabold tracking-[-1px] [&_span]:text-accent"
        >
          GMAT<span>prep</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="max-w-115 mt-15 mx-auto mb-0 p-9 border border-line rounded-[24px] bg-surface shadow-[0_20px_60px_var(--shadow)] [&_h1]:text-[clamp(28px,_5vw,_36px)] [&_h1]:leading-[1.2] [&_h1]:tracking-[-1.2px] [&_h1]:my-4 [&_h1]:mx-0 max-[480px]:mt-9 max-[480px]:p-6">
        <p className="text-accent text-[11px] font-extrabold tracking-[2px]">
          YOUR NEXT CHAPTER
        </p>
        <h1>{register ? "Start your journey." : "Welcome back."}</h1>
        <p className="text-muted text-[14px] leading-[1.6]">
          {register
            ? "Create your account and take the next step toward your GMAT goal."
            : "Log in to continue your GMAT preparation."}
        </p>
        <form
          onSubmit={submit}
          className="mt-7 [&_fieldset]:border-0 [&_fieldset]:p-0 [&_fieldset]:m-0 [&_fieldset]:grid [&_fieldset]:gap-4.5 [&_fieldset]:min-w-0 [&_label]:grid [&_label]:gap-2 [&_label]:text-[13px] [&_label]:font-semibold [&_input]:w-full [&_input]:min-w-0 [&_input]:border [&_input]:border-line [&_input]:rounded-[10px] [&_input]:p-[13px] [&_input]:bg-background [&_input]:text-foreground [&_input]:text-[16px] [&_input:focus-visible]:outline-2 [&_input:focus-visible]:outline-accent [&_input:focus-visible]:outline-offset-2 [&_fieldset:disabled]:opacity-65"
          aria-busy={pending}
        >
          <fieldset disabled={pending}>
            {register && (
              <label>
                Full name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  placeholder="Your name"
                />
              </label>
            )}
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <div className="relative [&_input]:pr-16.5 [&_button]:absolute [&_button]:right-3 [&_button]:top-[50%] [&_button]:-translate-y-1/2 [&_button]:bg-transparent [&_button]:border-0 [&_button]:text-foreground [&_button]:cursor-pointer [&_button]:text-[12px]">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            {register && (
              <label>
                Confirm password
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                />
              </label>
            )}
            <button
              className="p-3.5 border-0 rounded-[10px] bg-accent text-button-text font-bold cursor-pointer mt-1.5"
              type="submit"
            >
              {pending
                ? "Please wait…"
                : register
                  ? "Create account"
                  : "Log in"}
            </button>
          </fieldset>
          {error && (
            <p className="text-danger text-[14px]" role="alert">
              {error}
            </p>
          )}
        </form>
        <p className="text-muted text-[14px] leading-[1.6] mt-6 [&_a]:text-accent [&_a]:font-semibold">
          {register ? "Already have an account?" : "New to GMATprep?"}{" "}
          <Link
            href={register ? "/login" : "/register"}
            onClick={(event) => {
              if (
                new URLSearchParams(window.location.search).get("next") ===
                "/diagnostic/results"
              ) {
                event.preventDefault();
                router.push(
                  `${register ? "/login" : "/register"}?next=/diagnostic/results`,
                );
              }
            }}
          >
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
        <Link
          className="text-muted text-[14px] leading-[1.6] inline-block mt-2"
          href="/"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
