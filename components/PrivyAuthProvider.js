import { PrivyProvider } from "@privy-io/react-auth";
import { polygon } from "viem/chains";

export default function PrivyAuthProvider({ children }) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

    return (
        <PrivyProvider
            appId={appId}
            config={{
                appearance: {
                    theme: "dark",
                    accentColor: "#693E9A",
                    logo: "/Logo.svg",
                },
                loginMethods: ["email", "wallet", "google", "twitter"],
                embeddedWallets: {
                    createOnLogin: "users-without-wallets",
                },
                defaultChain: polygon,
                supportedChains: [polygon],
            }}
        >
            {children}
        </PrivyProvider>
    );
}
