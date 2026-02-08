import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import { Box } from "@mui/material";
import Image from "next/image";
import Head from "next/head";

const ConnectPage = () => {
    const { ready, authenticated, login } = usePrivy();
    const router = useRouter();

    useEffect(() => {
        if (ready && authenticated) {
            router.push("/dashboard");
        }
    }, [ready, authenticated, router]);

    return (
        <>
            <Head>
                <title>Connect | Violet Verse</title>
                <meta
                    name="description"
                    content="Sign in to Violet Verse, a Web3 lifestyle platform."
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

                <h1 style={{ marginBottom: "8px" }}>Welcome to Violet Verse</h1>
                <p
                    style={{
                        color: "#666",
                        maxWidth: "400px",
                        marginBottom: "32px",
                    }}
                >
                    Sign in with your email, wallet, or social account to join
                    the Web3 lifestyle community.
                </p>

                <button
                    onClick={login}
                    disabled={!ready}
                    style={{
                        backgroundColor: "#693E9A",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        padding: "14px 32px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: ready ? "pointer" : "not-allowed",
                        opacity: ready ? 1 : 0.6,
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        if (ready) e.currentTarget.style.backgroundColor = "#7c4db0";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#693E9A";
                    }}
                >
                    {ready ? "Sign In" : "Loading..."}
                </button>

                {authenticated && (
                    <p style={{ marginTop: "16px", color: "#693E9A" }}>
                        Signed in! Redirecting to dashboard...
                    </p>
                )}
            </Box>
        </>
    );
};

export default ConnectPage;
