import { z } from "zod";

const STELLAR_PUBLIC_KEY_REGEX = /^G[A-Z2-7]{55}$/;

export const SecretPolicySchema = z.object({
  client_identity: z
    .string()
    .regex(STELLAR_PUBLIC_KEY_REGEX, "client_identity must be a valid Stellar public key (G...)"),
  resource_hash: z.string().min(1).max(256),
  expiration_ledger: z.number().int().positive(),
});

export type SecretPolicyInput = z.infer<typeof SecretPolicySchema>;
