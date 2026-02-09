import { Button, Grid, Box, Chip } from "@mui/material";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ArticleGrid from "../components/article/ArticleGrid";
import { usePosts } from "../hooks/useAuth";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}

const Dashboard = () => {
    const { posts, loaded } = usePosts();
    const { address } = useAccount();

    return (
        <Box
            sx={{
                px: {
                    xs: "0",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                    xl: "20%",
                },
            }}
        >
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                align="center"
                spacing={4}
            >
                <Grid item>
                    <h1>Creator Dashboard</h1>
                </Grid>
                <Grid item>
                    <p>
                        The Creator Dashboard is a page for editors to manage
                        their articles before approval. Editors can view their
                        drafts and published articles, making the process more
                        efficient.
                    </p>
                </Grid>

                {/* Wallet Info */}
                {address && (
                    <Grid item>
                        <Box
                            sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "16px",
                                p: 2,
                                textAlign: "center",
                            }}
                        >
                            <code style={{ fontSize: "14px" }}>
                                {`${address.slice(0, 6)}...${address.slice(-4)}`}
                            </code>
                            {" "}
                            <Chip
                                label="Polygon"
                                size="small"
                                sx={{
                                    backgroundColor: "#7B3FE4",
                                    color: "white",
                                    fontWeight: "500",
                                    ml: 1,
                                }}
                            />
                        </Box>
                    </Grid>
                )}

                <Grid item>
                    <ConnectButton
                        showBalance={true}
                        chainStatus="full"
                        accountStatus="address"
                    />
                </Grid>

                <Grid item>
                    <Link href="/posts/create" legacyBehavior>
                        <a>
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{ px: 5, py: 1 }}
                            >
                                Create Post
                            </Button>
                        </a>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/drafts" legacyBehavior>
                        <a>
                            <Button
                                variant="contained"
                                disableElevation
                                color="secondary"
                                sx={{ px: 5, py: 1 }}
                            >
                                View Draft Page
                            </Button>
                        </a>
                    </Link>
                </Grid>
            </Grid>
            {loaded && (
                <Box sx={{ mt: 10 }}>
                    <ArticleGrid
                        title="Your Posts"
                        posts={posts}
                        buttonDisabled
                        dashboardPage
                    />
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
