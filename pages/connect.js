import { useEffect } from "react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import Head from "next/head";

const ConnectPage = () => {
    const { isConnected, address } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (isConnected && address) {
            router.push("/dashboard");
        }
    }, [isConnected, address, router]);

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
