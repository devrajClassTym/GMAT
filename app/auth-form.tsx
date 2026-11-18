"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { apiRequest, isRecord, setAccessToken } from "../lib/api";
import { useSetAuthUser } from "./auth-session";
import { ThemeToggle } from "./theme-toggle";
import styles from "./auth.module.css";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const router = useRouter();
  const setUser = useSetAuthUser();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") ?? "").trim();
    const email = String(fields.get("email") ?? "").trim();
    const password = String(fields.get("password") ?? "");
    setError("");
    setMessage("");
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
    try {
      const result = await apiRequest(
        register ? "/auth/signup" : "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(
            register ? { name, email, password } : { email, password },
          ),
        },
      );
      if (register) {
        setMessage(
          "Account created. You can now log in. If verification is required, check your email first.",
        );
        return;
      }
      const data =
        isRecord(result) && isRecord(result.data) ? result.data : result;
      if (isRecord(data)) {
        const token = data.accessToken ?? data.access_token ?? data.token;
        setAccessToken(typeof token === "string" ? token : undefined);
        const user = isRecord(data.user) ? data.user : null;
        setUser({
          id:
            user && (typeof user.id === "string" || typeof user.id === "number")
              ? String(user.id)
              : email,
          name: user && typeof user.name === "string" ? user.name : "",
        });
      } else {
        setUser({ id: email, name: "" });
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next === "/diagnostic/results" ? next : "/dashboard");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          GMAT<span>prep</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className={styles.card}>
        <p className={styles.eyebrow}>YOUR NEXT CHAPTER</p>
        <h1>{register ? "Start your journey." : "Welcome back."}</h1>
        <p className={styles.description}>
          {register
            ? "Create your account and take the next step toward your GMAT goal."
            : "Log in to continue your GMAT preparation."}
        </p>
        <form onSubmit={submit} className={styles.form} aria-busy={pending}>
          <fieldset disabled={pending || Boolean(message)}>
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
              <div className={styles.password}>
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
            <button className={styles.submit} type="submit">
              {pending
                ? "Please wait…"
                : register
                  ? "Create account"
                  : "Log in"}
            </button>
          </fieldset>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {message && <p role="status">{message}</p>}
        </form>
        <p className={styles.switch}>
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
        <Link className={styles.back} href="/">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
