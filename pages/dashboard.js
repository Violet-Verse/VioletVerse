import { Button, Grid } from "@mui/material";
import Link from "next/link";
import ArticleGrid from "../components/ArticleGrid";
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
        <div>
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                align="center"
                spacing={4}
            >
                <Grid item>
                    <h1>Contributor Dashboard</h1>
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
                {loaded && (
                    <Grid item>
                        <ArticleGrid
                            title="Your Posts"
                            posts={posts}
                            maximum={20}
                            buttonDisabled
                        />
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default Dashboard;
