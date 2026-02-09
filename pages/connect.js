import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Box } from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import { useSWRConfig } from "swr";

const ConnectPage = () => {
    const { isConnected, address } = useAccount();
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (isConnected && address && !hasVerified.current) {
            hasVerified.current = true;

            // Create a session by calling verify with wallet data
            fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: address,
                    chainType: "ethereum",
                    walletType: "rainbowkit",
                }),
            })
                .then((response) => response.json())
                .then(() => {
                    mutate("/api/database/getUser");
                    router.push("/dashboard");
                })
                .catch((err) => {
                    console.error("Session creation error:", err);
                    router.push("/dashboard");
                });
        }
    }, [isConnected, address, router, mutate]);

    return (
        <>
            <Head>
                <title>Connect Wallet | Violet Verse</title>
                <meta
                    name="description"
                    content="Connect your wallet to Violet Verse, a Web3 lifestyle platform on Polygon."
                />
            </Head>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 3,
                }}
            >
                <Image
                    src="/Logo.svg"
                    alt="Violet Verse"
                    height={80}
                    width={140}
                    style={{ marginBottom: "32px" }}
                />

                <h1 style={{ marginBottom: "8px" }}>Connect Your Wallet</h1>
                <p
                    style={{
                        color: "#666",
                        maxWidth: "400px",
                        marginBottom: "32px",
                    }}
                >
                    Join the Violet Verse Web3 lifestyle community on Polygon.
                    Connect your wallet to access the Creator Dashboard.
                </p>

                <ConnectButton
                    showBalance={false}
                    chainStatus="icon"
                    accountStatus="address"
                />

                {isConnected && (
                    <p style={{ marginTop: "16px", color: "#693E9A" }}>
                        Connected! Redirecting to dashboard...
                    </p>
                )}
            </Box>
        </>
    );
};

export default ConnectPage;
