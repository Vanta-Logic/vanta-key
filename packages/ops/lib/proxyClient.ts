import type { SecretPolicy } from "@vanta-logic/shared";

const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL ?? "http://localhost:3001";

export async function verifyPolicy(policy: SecretPolicy): Promise<unknown> {
  const res = await fetch(`${PROXY_URL}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
  return res.json();
}
