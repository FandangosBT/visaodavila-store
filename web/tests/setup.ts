import "@testing-library/jest-dom";
import React from "react";

// Stub next/image for tests
vi.mock("next/image", () => ({
  default: (props: any) => React.createElement("img", props),
}));

// Basic fetch mock fallback
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
}

