let accessToken: string | undefined;

// Keep bearer credentials in memory; never persist them in browser storage.
export function setAccessToken(token?: string) { accessToken = token; }

export async function apiRequest(path: `/${string}`, options: RequestInit = {}): Promise<unknown> {
  const environment = process.env.NEXT_PUBLIC_API_ENV;
  if (environment !== "staging" && environment !== "production") {
    throw new Error("API environment must be staging or production.");
  }
  const baseUrl = environment === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL
    : process.env.NEXT_PUBLIC_STAGING_API_URL;
  if (!baseUrl) throw new Error("API URL is not configured.");
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  let response: Response;
  try {
    response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
      ...options, headers, credentials: "include", cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("Something went wrong. Please try again.");
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok || (isRecord(data) && data.success === false)) {
    const message = isRecord(data) && typeof data.message === "string" ? data.message : "Request failed. Please try again.";
    throw new Error(message);
  }
  return data;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
