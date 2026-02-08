import { PrivyProvider } from "@privy-io/react-auth";

export default function Web3Providers({ children }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
            config={{
                appearance: {
                    theme: "dark",
                    accentColor: "#693E9A",
                    logo: "/Logo.svg",
                },
                loginMethods: ["email", "wallet", "google", "twitter"],
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: "users-without-wallets",
                    },
                },
                defaultChain: {
                    id: 137,
                    name: "Polygon",
                    network: "matic",
                    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
                    rpcUrls: {
                        default: { http: ["https://polygon-rpc.com"] },
                    },
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
