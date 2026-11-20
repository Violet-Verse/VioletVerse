import { Button, Grid, Box, Chip, Divider, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import { useUser } from "../hooks/useAuth";
import dateFormatter from "../lib/dateFormatter";

export async function getStaticProps() {
    return {
        props: {
            protected: true,
        },
    };
}

const fetcher = (url) => fetch(url).then((r) => r.json());

const Dashboard = () => {
    const router = useRouter();
    const { user, loaded } = useUser();
    const { data: userPosts, error: postsError } = useSWR(
        loaded && user ? "/api/database/getUserPosts" : null,
        fetcher
    );

    if (!loaded) return null;

    const isAdmin = user?.role === "admin";
    const postsLoading = !userPosts && !postsError;

    return (
        <Box sx={{ px: { xs: "5%", sm: "8%", md: "12%", lg: "16%" }, py: 6 }}>
            <Grid container direction="column" spacing={4}>
                <Grid item>
                    <h1 style={{ marginBottom: "4px" }}>Creator Dashboard</h1>
                    <p style={{ margin: 0, color: "#666" }}>Welcome to the Violet Verse Creator Dashboard.</p>
                </Grid>
                <Grid item>
                    <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "12px", p: 3, display: "inline-flex", alignItems: "center", gap: 2 }}>
                        <span style={{ color: "#666", fontSize: "14px" }}>Signed in as</span>
                        <code style={{ fontSize: "14px", backgroundColor: "#f5f5f5", padding: "4px 10px", borderRadius: "6px" }}>{user?.email}</code>
                        <Chip label={user?.role || "user"} size="small" sx={{ backgroundColor: "#7B3FE4", color: "white", fontWeight: "500" }} />
                    </Box>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Link href="/posts/create"><a>
                                <Button variant="contained" color="secondary" disableElevation sx={{ px: 4, py: 1.5, borderRadius: "8px" }}>
                                    + Create New Post
                                </Button>
                            </a></Link>
                        </Grid>
                        {isAdmin && (
                            <Grid item>
                                <Link href="/drafts"><a>
                                    <Button variant="outlined" color="secondary" sx={{ px: 4, py: 1.5, borderRadius: "8px" }}>
                                        Review Drafts
                                    </Button>
                                </a></Link>
                            </Grid>
                        )}
                        <Grid item>
                            <Link href="/posts"><a>
                                <Button variant="outlined" sx={{ px: 4, py: 1.5, borderRadius: "8px" }}>
                                    View All Posts
                                </Button>
                            </a></Link>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="error" onClick={() => router.push("/api/auth/logout")} sx={{ px: 4, py: 1.5, borderRadius: "8px" }}>
                                Sign Out
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item><Divider /></Grid>
                <Grid item>
                    <h2 style={{ marginBottom: "16px" }}>Your Posts</h2>
                    {postsLoading && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <CircularProgress size={20} color="secondary" />
                            <span style={{ color: "#666" }}>Loading your posts…</span>
                        </Box>
                    )}
                    {postsError && <p style={{ color: "#c62828" }}>Could not load posts. Please refresh.</p>}
                    {userPosts && userPosts.length === 0 && <p style={{ color: "#666" }}>No posts yet. Create your first one above.</p>}
                    {userPosts && userPosts.length > 0 && (
                        <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #e0e0e0" }}>
                                        <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", fontSize: "13px" }}>Title</th>
                                        <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", fontSize: "13px" }}>Category</th>
                                        <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", fontSize: "13px" }}>Status</th>
                                        <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", fontSize: "13px" }}>Date</th>
                                        <th style={{ padding: "12px 16px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userPosts
                                        .sort((a, b) => new Date(b.created) - new Date(a.created))
                                        .map((post, i) => (
                                            <tr key={post._id} style={{ borderBottom: i < userPosts.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                                                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "500", maxWidth: "320px" }}>
                                                    <Link href={`/${post.slug}`}><a style={{ color: "inherit", textDecoration: "none" }}>{post.title ?? "(Untitled)"}</a></Link>
                                                </td>
                                                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#666" }}>{post.category || "—"}</td>
                                                <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                                                    <span style={{ padding: "3px 10px", borderRadius: "100px", backgroundColor: post.hidden ? "#fff3e0" : "#e8f5e9", color: post.hidden ? "#e65100" : "#2e7d32", fontWeight: "500" }}>
                                                        {post.hidden ? "Draft" : "Published"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px 16px", fontSize: "13px", color: "#888", whiteSpace: "nowrap" }}>{dateFormatter(post.created)}</td>
                                                <td style={{ padding: "12px 16px" }}>
                                                    <Link href={`/posts/${post.slug}/edit`}><a>
                                                        <Button size="small" variant="outlined" color="secondary">Edit</Button>
                                                    </a></Link>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
