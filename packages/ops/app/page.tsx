"use client";

import { useState } from "react";
import FreighterConnect from "./components/FreighterConnect";
import PolicyForm from "./components/PolicyForm";

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Vanta-Key access policy management.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <FreighterConnect onAddressChange={setWalletAddress} />
        <PolicyForm initialClientIdentity={walletAddress ?? ""} />
      </div>
    </div>
  );
}
