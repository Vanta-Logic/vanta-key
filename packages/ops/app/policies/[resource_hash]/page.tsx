"use client";

import { useState } from "react";
import RevocationDialog from "../../components/RevocationDialog";

interface PageProps {
  params: Promise<{ resource_hash: string }>;
}

export default async function PolicyDetailPage({ params }: PageProps) {
  const { resource_hash } = await params;

  return (
    <div className="space-y-6">
      <div>
        <a
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          &larr; Dashboard
        </a>
        <h1 className="mt-2 text-2xl font-bold">Policy Detail</h1>
      </div>
      <div className="rounded border border-gray-700 bg-gray-900 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Resource
        </h2>
        <p className="font-mono text-sm text-gray-100 break-all">
          {resource_hash}
        </p>
      </div>
      <div className="rounded border border-gray-700 bg-gray-900 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Status
        </h2>
        <span className="inline-block rounded bg-green-900/50 px-2 py-0.5 text-xs font-medium text-green-400">
          Active
        </span>
      </div>
      <div>
        <RevokeButton resourceHash={resource_hash} />
      </div>
    </div>
  );
}

function RevokeButton({ resourceHash }: { resourceHash: string }) {
  const [showDialog, setShowDialog] = useState(false);

  const handleRevoke = (hash: string) => {
    console.log("Revoking policy for:", hash);
    setShowDialog(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
      >
        Revoke Policy
      </button>
      {showDialog && (
        <RevocationDialog
          resourceHash={resourceHash}
          onConfirm={handleRevoke}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
