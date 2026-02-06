import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon } from "wagmi/chains";
import { createConfig, http } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// During build/SSR without the env var, use a minimal config
// so the build doesn't crash. At runtime in the browser, the
// full RainbowKit config with WalletConnect will be used.
export const config = projectId
  ? getDefaultConfig({
      appName: "Violet Verse",
      projectId,
      chains: [polygon],
      ssr: true,
    })
  : createConfig({
      chains: [polygon],
      transports: {
        [polygon.id]: http(),
      },
      ssr: true,
    });
