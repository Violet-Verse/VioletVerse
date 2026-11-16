import { Button, Grid, Box, Chip } from "@mui/material";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useAuth";

export async function getStaticProps() {
    return {
        props: {
            protected: true,
        },
    };
}

const Dashboard = () => {
    const router = useRouter();
    const { user, loaded } = useUser();

    if (!loaded) return null;

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
                    </p>
                </Grid>

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
                            Signed in as
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
                            {user?.email}
                        </code>
                        <br />
                        <Chip
                            label={user?.role || "user"}
                            size="small"
                            sx={{
                                backgroundColor: "#7B3FE4",
                                color: "white",
                                fontWeight: "500",
                            }}
                        />
                    </Box>
                </Grid>

                <Grid item>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => router.push("/api/auth/logout")}
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
