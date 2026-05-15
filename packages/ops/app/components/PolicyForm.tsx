"use client";

import { useState } from "react";
import type { SecretPolicy } from "@vanta-logic/shared";

interface PolicyFormProps {
  initialClientIdentity?: string;
}

export default function PolicyForm({
  initialClientIdentity = "",
}: PolicyFormProps) {
  const [policy, setPolicy] = useState<SecretPolicy>({
    client_identity: initialClientIdentity,
    resource_hash: "",
    expiration_ledger: 0,
  });

  const handleChange = (
    field: keyof SecretPolicy,
    value: string | number,
  ) => {
    setPolicy((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded border border-gray-700 bg-gray-900 p-4"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        New Access Policy
      </h2>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Client Identity
          </label>
          <input
            type="text"
            value={policy.client_identity}
            onChange={(e) => handleChange("client_identity", e.target.value)}
            placeholder="G... or account address"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Resource Hash
          </label>
          <input
            type="text"
            value={policy.resource_hash}
            onChange={(e) => handleChange("resource_hash", e.target.value)}
            placeholder="SHA-256 of the protected resource"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Expiration Ledger
          </label>
          <input
            type="number"
            value={policy.expiration_ledger}
            onChange={(e) =>
              handleChange("expiration_ledger", Number(e.target.value))
            }
            placeholder="e.g. 123456"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
