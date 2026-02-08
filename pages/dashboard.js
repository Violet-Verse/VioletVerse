import { Button, Grid, Box, Chip } from "@mui/material";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}

const Dashboard = () => {
    const { user, logout, ready, authenticated } = usePrivy();
    const router = useRouter();

    const walletAddress = user?.wallet?.address;
    const emailAddress = user?.email?.address;

    const handleLogout = async () => {
        await logout();
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
                        You are signed in and ready to create.
                    </p>
                </Grid>

                {/* Account Info */}
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
                        {emailAddress && (
                            <>
                                <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                                    Email
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
                                    {emailAddress}
                                </code>
                                <br />
                            </>
                        )}

                        {walletAddress && (
                            <>
                                <p style={{ fontWeight: "600", marginBottom: "8px", marginTop: emailAddress ? "16px" : 0 }}>
                                    Wallet
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
                                    {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
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
                            </>
                        )}

                        {!emailAddress && !walletAddress && (
                            <p style={{ color: "#999" }}>Account connected via Privy</p>
                        )}
                    </Box>
                </Grid>

                {/* Sign Out */}
                <Grid item>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLogout}
                        sx={{ px: 4, py: 1 }}
                    >
                        Sign Out
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
