"use client";

import { createContext, useContext, useState } from "react";

export type AuthUser = { id: string; name: string };
const AuthContext = createContext<AuthUser | null>(null);
const AuthUpdateContext = createContext<(user: AuthUser) => void>(() => {});

/** Replace initialUser with the verified server session when authentication is connected. */
export function AuthSessionProvider({ initialUser = null, children }: {
  initialUser?: AuthUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  return <AuthUpdateContext.Provider value={setUser}><AuthContext.Provider value={user}>{children}</AuthContext.Provider></AuthUpdateContext.Provider>;
}

export function useAuthUser() { return useContext(AuthContext); }
export function useSetAuthUser() { return useContext(AuthUpdateContext); }
