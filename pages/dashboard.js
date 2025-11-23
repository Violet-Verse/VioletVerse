import { Button, Grid, Box } from "@mui/material";
import Link from "next/link";
import ArticleGrid from "../components/article/ArticleGrid";
import { usePosts } from "../hooks/useAuth";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "contributor"],
        },
    };
}

const Dashboard = () => {
    const { posts, loaded } = usePosts();

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
