import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon } from "wagmi/chains";
import { createConfig, http } from "wagmi";

function createWagmiConfig() {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  if (!projectId) {
    // Fallback config for build/SSR when env var is not available
    console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set, using fallback config");
    return createConfig({
      chains: [polygon],
      transports: {
        [polygon.id]: http(),
      },
      ssr: true,
    });
  }

  try {
    return getDefaultConfig({
      appName: "Violet Verse",
      projectId,
      chains: [polygon],
      ssr: true,
    });
  } catch (e) {
    console.warn("RainbowKit config failed, using fallback:", e.message);
    return createConfig({
      chains: [polygon],
      transports: {
        [polygon.id]: http(),
      },
      ssr: true,
    });
  }
}

export const config = createWagmiConfig();
