"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { startRound, type Round } from "./practice-engine";
import { PracticeSetup } from "./practice-setup";
import { PracticeRound } from "./practice-round";

export function PracticeScreen() {
  const params = useSearchParams();
  const [initial, setInitial] = useState<Round | null>(null);
  return initial ? <PracticeRound initial={initial} onReset={() => setInitial(null)} />
    : <PracticeSetup key={params.get("section")} section={params.get("section")} onStart={settings => setInitial(startRound(settings, Date.now(), crypto.randomUUID()))} />;
}
