import { Button, Grid, Box } from "@mui/material";
import Link from "next/link";
import ArticleGrid from "../components/Posts/ArticleGrid";
import { usePosts } from "../hooks/useAuth";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator"],
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
                    <Link href="/posts/create">
                        <a>
                            <Button variant="contained" disableElevation>
                                Create Post
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
                        maximum={20}
                        buttonDisabled
                    />
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
