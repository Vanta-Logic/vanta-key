"use client";

import { useState, useCallback } from "react";
import { connectWallet, getWalletAddress } from "../../lib/freighter";

interface FreighterConnectProps {
  onAddressChange: (address: string | null) => void;
}

export default function FreighterConnect({
  onAddressChange,
}: FreighterConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      onAddressChange(addr);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to connect Freighter wallet",
      );
    } finally {
      setConnecting(false);
    }
  }, [onAddressChange]);

  const handleDisconnect = useCallback(() => {
    setAddress(null);
    onAddressChange(null);
  }, [onAddressChange]);

  return (
    <div className="rounded border border-gray-700 bg-gray-900 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Wallet
      </h2>
      {address ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Connected</p>
            <p className="font-mono text-sm text-green-400">{address}</p>
          </div>
          <button
            onClick={handleDisconnect}
            className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {connecting ? "Connecting..." : "Connect Freighter Wallet"}
          </button>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Freighter is the official Stellar wallet for your browser.
          </p>
        </div>
      )}
    </div>
  );
}
