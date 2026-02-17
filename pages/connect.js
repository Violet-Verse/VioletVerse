import * as fcl from "@blocto/fcl";
import { useSWRConfig } from "swr";
import "../flow/config.js";
import { Box, Button, Grid } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useUser } from "../hooks/useAuth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Connect = () => {
    const { user, loaded } = useUser();
    const { mutate } = useSWRConfig();

    const siteTitle = "Connect Your Wallet | Violet Verse";
    const metaTitle = "Connect Your Wallet";
    const siteDescription =
        "Connect your Blocto wallet to access Violet Verse — a Web3-powered lifestyle content marketplace.";
    const siteImage = "https://i.imgur.com/HOcgWqo.png";

    const login = async () => {
        try {
            const res = await fcl.authenticate();

            const accountProofService = res.services.find(
                (services) => services.type === "account-proof"
            );

            const userEmail = res.services.find(
                (services) => services.type === "open-id"
            ).data.email.email;

            if (accountProofService) {
                fetch("/api/auth/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        address: accountProofService.data.address,
                        nonce: accountProofService.data.nonce,
                        signatures: accountProofService.data.signatures,
                        userEmail,
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        global.analytics.track(
                            result.registration
                                ? "User Registration Success"
                                : "User Login Success ",
                            {
                                ...(result.registration && {
                                    userId: result.userData.userId,
                                }),
                                ...(result.registration && {
                                    email: result.userData.email,
                                }),
                                ...(result.registration && {
                                    role: result.userData.role,
                                }),
                                ...(result.registration && {
                                    flowAddress: result.userData.flowAddress,
                                }),
                            }
                        );
                        mutate("/api/database/getUser");
                    })
                    .catch(() => {
                        fcl.unauthenticate();
                    });
            }
        } catch {
            // Authentication error handled silently
        }
    };

    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={metaTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
            </Head>

            <Box
                sx={{
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                    py: { xs: 8, sm: 10, md: 12 },
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={4}
                    sx={{ textAlign: "center", maxWidth: 600 }}
                >
                    {loaded && !user && (
                        <>
                            <Grid item>
                                <AccountBalanceWalletIcon
                                    sx={{
                                        fontSize: 64,
                                        color: "#693E9A",
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <h1>Connect Your Wallet</h1>
                            </Grid>
                            <Grid item>
                                <p className="secondary">
                                    Sign in with your Blocto wallet to access
                                    Violet Verse. Create and publish content,
                                    earn $VV tokens, and join the Web3 fashion
                                    media community.
                                </p>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    onClick={() => {
                                        global.analytics.track(
                                            "Connect Page Login Clicked"
                                        );
                                        login();
                                    }}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        fontWeight: "400",
                                        fontSize: "18px",
                                    }}
                                >
                                    Connect Wallet
                                </Button>
                            </Grid>
                        </>
                    )}

                    {loaded && user && (
                        <>
                            <Grid item>
                                <CheckCircleOutlineIcon
                                    sx={{
                                        fontSize: 64,
                                        color: "#693E9A",
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <h1>Wallet Connected</h1>
                            </Grid>
                            <Grid item>
                                <p className="secondary">
                                    You&#39;re signed in as{" "}
                                    <strong>{user.name || user.email}</strong>.
                                    Explore the Violet Verse or manage your
                                    tokens.
                                </p>
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            onClick={() =>
                                                Router.push("/profile")
                                            }
                                            sx={{
                                                py: 1.5,
                                                px: 3,
                                                fontWeight: "400",
                                                fontSize: "16px",
                                            }}
                                        >
                                            View Profile
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            disableElevation
                                            onClick={() =>
                                                Router.push("/tokens")
                                            }
                                            sx={{
                                                py: 1.5,
                                                px: 3,
                                                fontWeight: "400",
                                                fontSize: "16px",
                                                borderColor: "#693E9A",
                                                color: "#693E9A",
                                                "&:hover": {
                                                    borderColor: "#815AAD",
                                                    color: "#815AAD",
                                                },
                                            }}
                                        >
                                            My Tokens
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
        </>
    );
};

export default Connect;
