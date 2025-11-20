export type SessionUser = { id: string; name: string; email: string; role: string } | null;

export async function getSessionUser(): Promise<SessionUser> {
  const res = await fetch("/users/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user ?? null;
}

