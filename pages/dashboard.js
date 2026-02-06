import { Button, Grid, Box, Chip } from "@mui/material";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}

const Dashboard = () => {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const router = useRouter();

    const handleDisconnect = () => {
        disconnect();
        router.push("/connect");
    };

    return (
        <Box
            sx={{
                px: {
                    xs: "5%",
                    sm: "10%",
                    md: "15%",
                    lg: "20%",
                    xl: "25%",
                },
                py: 6,
            }}
        >
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <h1>Creator Dashboard</h1>
                </Grid>
                <Grid item>
                    <p style={{ textAlign: "center", maxWidth: "500px" }}>
                        Welcome to the Violet Verse Creator Dashboard.
                        You are connected to the Polygon network.
                    </p>
                </Grid>

                {/* Wallet Info */}
                <Grid item>
                    <Box
                        sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "16px",
                            p: 3,
                            textAlign: "center",
                            minWidth: { xs: "280px", sm: "400px" },
                        }}
                    >
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                            Connected Wallet
                        </p>
                        <code
                            style={{
                                fontSize: "14px",
                                backgroundColor: "#f5f5f5",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                display: "inline-block",
                                marginBottom: "12px",
                            }}
                        >
                            {address
                                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                                : ""}
                        </code>
                        <br />
                        <Chip
                            label="Polygon"
                            size="small"
                            sx={{
                                backgroundColor: "#7B3FE4",
                                color: "white",
                                fontWeight: "500",
                            }}
                        />
                    </Box>
                </Grid>

                {/* RainbowKit button for chain switching etc */}
                <Grid item>
                    <ConnectButton
                        showBalance={true}
                        chainStatus="full"
                        accountStatus="address"
                    />
                </Grid>

                {/* Disconnect */}
                <Grid item>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleDisconnect}
                        sx={{ px: 4, py: 1 }}
                    >
                        Disconnect Wallet
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
