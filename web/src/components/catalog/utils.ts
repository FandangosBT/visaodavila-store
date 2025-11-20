import { ReadonlyURLSearchParams } from "next/navigation";

export function toggleInQueryArray(
  key: string,
  value: string,
  sp: URLSearchParams | ReadonlyURLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(sp.toString());
  const current = next.getAll(key);
  const idx = current.indexOf(value);
  if (idx >= 0) {
    const filtered = current.filter((v) => v !== value);
    next.delete(key);
    filtered.forEach((v) => next.append(key, v));
  } else {
    next.append(key, value);
  }
  next.set("page", "1");
  return next;
}

export function setInQuery(
  key: string,
  value: string | undefined,
  sp: URLSearchParams | ReadonlyURLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(sp.toString());
  if (value === undefined || value === "") next.delete(key);
  else next.set(key, value);
  next.set("page", "1");
  return next;
}
