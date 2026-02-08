import { Button, Grid, Box, Chip, Divider, CircularProgress } from "@mui/material";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
        },
    };
}

const fetcher = (url) => fetch(url).then((r) => r.json());

const Dashboard = () => {
    const { user, logout, ready, authenticated } = usePrivy();
    const router = useRouter();

    const walletAddress = user?.wallet?.address;
    const emailAddress = user?.email?.address;

    // Fetch user's posts from the API
    const { data: userPosts, isLoading: postsLoading } = useSWR(
        authenticated ? "/api/database/getUserPosts" : null,
        fetcher
    );

    const handleLogout = async () => {
        await logout();
        router.push("/connect");
    };

    return (
        <Box
            sx={{
                px: { xs: "5%", sm: "10%", md: "15%", lg: "20%", xl: "25%" },
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
                    <h1 style={{ fontFamily: "Ogg, serif" }}>Creator Dashboard</h1>
                </Grid>
                <Grid item>
                    <p style={{ textAlign: "center", maxWidth: "500px", color: "#999" }}>
                        Welcome to the Violet Verse Creator Dashboard.
                        Manage your content, review drafts, and publish articles.
                    </p>
                </Grid>

                {/* Account Info */}
                <Grid item sx={{ width: "100%", maxWidth: "600px" }}>
                    <Box
                        sx={{
                            border: "1px solid rgba(105, 62, 154, 0.3)",
                            borderRadius: "16px",
                            p: 3,
                            textAlign: "center",
                            background: "rgba(105, 62, 154, 0.05)",
                        }}
                    >
                        <p style={{
                            fontFamily: "Test Calibre, sans-serif",
                            fontWeight: "600",
                            marginBottom: "12px",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "#693E9A",
                        }}>
                            Account
                        </p>

                        {emailAddress && (
                            <Box sx={{ mb: 1 }}>
                                <code style={{
                                    fontSize: "14px",
                                    backgroundColor: "rgba(105, 62, 154, 0.1)",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    display: "inline-block",
                                }}>
                                    {emailAddress}
                                </code>
                            </Box>
                        )}

                        {walletAddress && (
                            <Box sx={{ mb: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                <code style={{
                                    fontSize: "14px",
                                    backgroundColor: "rgba(105, 62, 154, 0.1)",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    display: "inline-block",
                                }}>
                                    {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                                </code>
                                <Chip
                                    label="Polygon"
                                    size="small"
                                    sx={{
                                        backgroundColor: "#7B3FE4",
                                        color: "white",
                                        fontWeight: "500",
                                        fontSize: "11px",
                                    }}
                                />
                            </Box>
                        )}

                        {!emailAddress && !walletAddress && (
                            <p style={{ color: "#999" }}>Account connected via Privy</p>
                        )}
                    </Box>
                </Grid>

                <Grid item sx={{ width: "100%", maxWidth: "600px" }}>
                    <Divider sx={{ borderColor: "rgba(105, 62, 154, 0.2)" }} />
                </Grid>

                {/* CMS Quick Actions */}
                <Grid item sx={{ width: "100%", maxWidth: "600px" }}>
                    <p style={{
                        fontFamily: "Test Calibre, sans-serif",
                        fontWeight: "600",
                        marginBottom: "16px",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#693E9A",
                        textAlign: "center",
                    }}>
                        Content Management
                    </p>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Link href="/posts/create" legacyBehavior>
                                <a style={{ textDecoration: "none" }}>
                                    <Box sx={{
                                        border: "1px solid rgba(105, 62, 154, 0.3)",
                                        borderRadius: "12px",
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "#693E9A",
                                            background: "rgba(105, 62, 154, 0.08)",
                                        },
                                    }}>
                                        <Box sx={{ fontSize: "28px", mb: 1 }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#693E9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                        </Box>
                                        <p style={{
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            margin: 0,
                                        }}>
                                            New Article
                                        </p>
                                        <p style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            margin: "4px 0 0 0",
                                        }}>
                                            Create content
                                        </p>
                                    </Box>
                                </a>
                            </Link>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Link href="/drafts" legacyBehavior>
                                <a style={{ textDecoration: "none" }}>
                                    <Box sx={{
                                        border: "1px solid rgba(105, 62, 154, 0.3)",
                                        borderRadius: "12px",
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "#693E9A",
                                            background: "rgba(105, 62, 154, 0.08)",
                                        },
                                    }}>
                                        <Box sx={{ fontSize: "28px", mb: 1 }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#693E9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                        </Box>
                                        <p style={{
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            margin: 0,
                                        }}>
                                            Drafts
                                        </p>
                                        <p style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            margin: "4px 0 0 0",
                                        }}>
                                            Review & approve
                                        </p>
                                    </Box>
                                </a>
                            </Link>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Link href="/posts" legacyBehavior>
                                <a style={{ textDecoration: "none" }}>
                                    <Box sx={{
                                        border: "1px solid rgba(105, 62, 154, 0.3)",
                                        borderRadius: "12px",
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "#693E9A",
                                            background: "rgba(105, 62, 154, 0.08)",
                                        },
                                    }}>
                                        <Box sx={{ fontSize: "28px", mb: 1 }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#693E9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="2" y1="12" x2="22" y2="12" />
                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                            </svg>
                                        </Box>
                                        <p style={{
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            margin: 0,
                                        }}>
                                            Published
                                        </p>
                                        <p style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            margin: "4px 0 0 0",
                                        }}>
                                            Browse articles
                                        </p>
                                    </Box>
                                </a>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sx={{ width: "100%", maxWidth: "600px" }}>
                    <Divider sx={{ borderColor: "rgba(105, 62, 154, 0.2)" }} />
                </Grid>

                {/* User's Posts */}
                <Grid item sx={{ width: "100%", maxWidth: "600px" }}>
                    <p style={{
                        fontFamily: "Test Calibre, sans-serif",
                        fontWeight: "600",
                        marginBottom: "16px",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#693E9A",
                        textAlign: "center",
                    }}>
                        Your Articles
                    </p>

                    {postsLoading && (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                            <CircularProgress size={24} sx={{ color: "#693E9A" }} />
                        </Box>
                    )}

                    {!postsLoading && (!userPosts || userPosts.length === 0) && (
                        <Box sx={{
                            border: "1px dashed rgba(105, 62, 154, 0.3)",
                            borderRadius: "12px",
                            p: 4,
                            textAlign: "center",
                        }}>
                            <p style={{ color: "#999", margin: 0 }}>
                                {"You haven't created any articles yet."}
                            </p>
                            <Link href="/posts/create" legacyBehavior>
                                <a style={{ textDecoration: "none" }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            mt: 2,
                                            borderColor: "#693E9A",
                                            color: "#693E9A",
                                            "&:hover": {
                                                borderColor: "#693E9A",
                                                background: "rgba(105, 62, 154, 0.08)",
                                            },
                                        }}
                                    >
                                        Create your first article
                                    </Button>
                                </a>
                            </Link>
                        </Box>
                    )}

                    {!postsLoading && userPosts && userPosts.length > 0 && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {userPosts.map((post, i) => (
                                <Link key={post._id || i} href={`/edit/${post._id}`} legacyBehavior>
                                    <a style={{ textDecoration: "none" }}>
                                        <Box sx={{
                                            border: "1px solid rgba(105, 62, 154, 0.2)",
                                            borderRadius: "10px",
                                            p: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            "&:hover": {
                                                borderColor: "#693E9A",
                                                background: "rgba(105, 62, 154, 0.05)",
                                            },
                                        }}>
                                            <Box>
                                                <p style={{
                                                    fontWeight: "600",
                                                    fontSize: "15px",
                                                    margin: 0,
                                                }}>
                                                    {post.title || "Untitled"}
                                                </p>
                                                <p style={{
                                                    fontSize: "12px",
                                                    color: "#999",
                                                    margin: "4px 0 0 0",
                                                }}>
                                                    {post.category || "Uncategorized"}
                                                    {post.hidden ? " — Draft" : " — Published"}
                                                </p>
                                            </Box>
                                            <Chip
                                                label={post.hidden ? "Draft" : "Live"}
                                                size="small"
                                                sx={{
                                                    backgroundColor: post.hidden
                                                        ? "rgba(255, 165, 0, 0.15)"
                                                        : "rgba(105, 62, 154, 0.15)",
                                                    color: post.hidden ? "#e69500" : "#693E9A",
                                                    fontWeight: "600",
                                                    fontSize: "11px",
                                                }}
                                            />
                                        </Box>
                                    </a>
                                </Link>
                            ))}
                        </Box>
                    )}
                </Grid>

                {/* Sign Out */}
                <Grid item sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{
                            px: 4,
                            py: 1,
                            borderColor: "rgba(105, 62, 154, 0.3)",
                            color: "#999",
                            "&:hover": {
                                borderColor: "#693E9A",
                                color: "#693E9A",
                            },
                        }}
                    >
                        Sign Out
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
