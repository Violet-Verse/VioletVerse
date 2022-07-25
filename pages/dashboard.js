import { Button, Grid } from "@mui/material";
import Link from "next/link";
import ArticleGrid from "../components/ArticleGrid";
import { server } from "../components/config";

export async function getServerSideProps() {
    try {
        const res = await fetch(`${server}/api/database/getUserPosts`);
        const data = await res.json();
        return { props: { posts: data } };
    } catch (err) {
        return { props: {} };
    }
}

const Dashboard = ({ posts }) => {
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
                    <Link href="/editor">
                        <a>
                            <Button variant="contained">Create Post</Button>
                        </a>
                    </Link>
                </Grid>
                <Grid item>
                    <ArticleGrid
                        title="Your Posts"
                        posts={posts}
                        maximum={20}
                        buttonDisabled
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
