export interface FreighterWindow {
  freighter?: {
    isConnected: () => Promise<{ isConnected: boolean }>;
    connect: () => Promise<{ address: string }>;
    getPublicKey: () => Promise<string>;
  };
}

declare global {
  interface Window {
    freighter?: FreighterWindow["freighter"];
  }
}

export async function isFreighterInstalled(): Promise<boolean> {
  return typeof window !== "undefined" && !!window.freighter;
}

export async function connectWallet(): Promise<string> {
  if (!(await isFreighterInstalled())) {
    throw new Error("Freighter is not installed");
  }
  const { address } = await window.freighter!.connect();
  return address;
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    if (!(await isFreighterInstalled())) return null;
    const { isConnected } = await window.freighter!.isConnected();
    if (!isConnected) return null;
    return window.freighter!.getPublicKey();
  } catch {
    return null;
  }
}
