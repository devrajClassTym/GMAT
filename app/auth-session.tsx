"use client";

import { createContext, useContext } from "react";

export type AuthUser = { id: string; name: string };
const AuthContext = createContext<AuthUser | null>(null);

/** Replace initialUser with the verified server session when authentication is connected. */
export function AuthSessionProvider({ initialUser = null, children }: {
  initialUser?: AuthUser | null;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={initialUser}>{children}</AuthContext.Provider>;
}

export function useAuthUser() { return useContext(AuthContext); }
