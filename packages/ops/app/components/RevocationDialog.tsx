"use client";

import { useState } from "react";

interface RevocationDialogProps {
  resourceHash: string;
  onConfirm: (resourceHash: string) => void;
  onCancel: () => void;
}

export default function RevocationDialog({
  resourceHash,
  onConfirm,
  onCancel,
}: RevocationDialogProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-100">
          Revoke Access Policy
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Are you sure you want to revoke the policy for resource{" "}
          <code className="rounded bg-gray-800 px-1 font-mono text-xs text-gray-300">
            {resourceHash}
          </code>
          ?
        </p>
        <label className="mt-4 flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
          />
          I understand this action cannot be undone.
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded bg-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(resourceHash)}
            disabled={!confirmed}
            className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}
