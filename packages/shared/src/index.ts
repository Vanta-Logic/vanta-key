/**
 * Describes an access policy that governs who can access a protected resource
 * and until when that access is valid.
 *
 * This type is shared across all TypeScript packages in the monorepo:
 * - **shared** — canonical type definition consumed via workspace dependency
 * - **proxy** — receives policies via the `/api/verify` endpoint
 * - **ops** — renders a form for creating and submitting policies
 *
 * @property client_identity - Stellar public key (G... address) of the
 *   client or wallet requesting access. This is typically obtained from
 *   the Freighter wallet after connection.
 * @property resource_hash - SHA-256 hex digest of the protected resource
 *   (e.g. a document, API endpoint, or secret). Used to identify the
 *   resource the policy applies to.
 * @property expiration_ledger - Stellar ledger sequence number at which
 *   this policy expires. On-chain validation will reject policies whose
 *   `expiration_ledger` is less than or equal to the current ledger
 *   sequence.
 */
export interface SecretPolicy {
  client_identity: string;
  resource_hash: string;
  expiration_ledger: number;
}

export { SecretPolicySchema } from "./schemas";
