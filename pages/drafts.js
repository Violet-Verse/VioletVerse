import { Button, Grid, Box } from "@mui/material";
import Link from "next/link";
import ArticleGrid from "../components/Posts/ArticleGrid";
import { getAllDraftPosts } from "./api/database/getAllPosts";
import { getUsersByRole } from "./api/database/getUserByEmail";

export async function getStaticProps(context) {
    const data = await getAllDraftPosts();
    const authors = await getUsersByRole("admin");
    const contributors = await getUsersByRole("contributor");
    return {
        props: {
            protected: true,
            userTypes: ["admin", "contributor"],
            posts: data,
            authors: authors,
            contributors: contributors,
        },
    };
}

const Dashboard = ({ posts, authors, contributors }) => {
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
                    <h1>Drafts Panel</h1>
                </Grid>
                <Grid item>
                    <p>Unpublished articles of the Verse.</p>
                </Grid>
                <Grid item>
                    <Link href="/dashboard">
                        <a>
                            <Button
                                color="secondary"
                                variant="contained"
                                disableElevation
                                sx={{ px: 5, py: 1 }}
                            >
                                Back to Dashboard
                            </Button>
                        </a>
                    </Link>
                </Grid>
            </Grid>

            <Box sx={{ mt: 10 }}>
                <ArticleGrid
                    title="Unpublished Posts"
                    posts={posts}
                    mt={5}
                    buttonDisabled
                    authors={authors}
                    contributors={contributors}
                />
            </Box>
        </Box>
    );
};

export default Dashboard;
