"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addActiveTime, completeAttempt, createAttempt, navigateTo, remainingMs, selectOption, submitAnswer, type Attempt } from "../attempt";
import { readAttempt, saveAttempt } from "../attempt-storage";

type Actions = { select: (option: string) => void; submit: () => void; navigate: (index: number) => void; finish: () => void };

export function useDiagnostic() {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [now, setNow] = useState(0);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const actions = useRef<Actions | null>(null);

  useEffect(() => {
    let current = readAttempt();
    const started = Date.now();
    if (!current) current = createAttempt(started, crypto.randomUUID());
    if (current.completedAt !== null) { router.replace("/diagnostic/results"); return; }
    let activeSince: { wall: number; monotonic: number } | null = null;
    let disposed = false;
    function persist() {
      const saved = saveAttempt(current!);
      if (!disposed) { setAttempt(current); setStorageUnavailable(!saved); }
    }
    function isActive() { return document.visibilityState === "visible" && document.hasFocus(); }
    function checkpoint() {
      const wall = Date.now();
      if (activeSince) {
        const duration = Math.min(Math.max(0, performance.now() - activeSince.monotonic), Math.max(0, current!.deadlineAt - activeSince.wall));
        current = addActiveTime(current!, duration);
      }
      activeSince = isActive() && current!.completedAt === null ? { wall, monotonic: performance.now() } : null;
      if (!disposed) setNow(wall);
      return wall;
    }
    function finish(reason: "manual" | "timeout") {
      if (current!.completedAt !== null || disposed) return;
      const wall = checkpoint();
      current = completeAttempt(current!, wall, reason);
      activeSince = null;
      persist();
      router.replace("/diagnostic/results");
    }
    function update(change: (value: Attempt, wall: number) => Attempt) {
      const wall = checkpoint();
      if (remainingMs(current!, wall) === 0) { finish("timeout"); return; }
      current = change(current!, wall);
      persist();
    }
    actions.current = {
      select: option => update((value, wall) => selectOption(value, option, wall)),
      submit: () => update(submitAnswer),
      navigate: index => update((value, wall) => navigateTo(value, index, wall)),
      finish: () => finish("manual"),
    };
    function tick() {
      if (current!.completedAt !== null) return;
      const wall = checkpoint();
      if (remainingMs(current!, wall) === 0) finish("timeout");
      else persist();
    }
    function visibilityChanged() { tick(); }
    function pageHidden() { checkpoint(); persist(); activeSince = null; }
    tick();
    const interval = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("focus", visibilityChanged);
    window.addEventListener("blur", visibilityChanged);
    window.addEventListener("pagehide", pageHidden);
    return () => {
      disposed = true;
      checkpoint();
      saveAttempt(current!);
      actions.current = null;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("focus", visibilityChanged);
      window.removeEventListener("blur", visibilityChanged);
      window.removeEventListener("pagehide", pageHidden);
    };
  }, [router]);

  return { attempt, now, storageUnavailable,
    select: (option: string) => actions.current?.select(option),
    submit: () => actions.current?.submit(),
    navigate: (index: number) => actions.current?.navigate(index),
    finish: () => actions.current?.finish(),
  };
}
