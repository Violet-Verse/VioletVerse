import { Box } from "@mui/material";
import ArticleGrid from "../../components/article/ArticleGrid";
import connectDatabase from "../../lib/mongoClient";
import { getUsersByRole } from "../api/database/getUserByEmail";

export async function getServerSideProps() {
    try {
        const db = await connectDatabase();
        const data = await db.collection("posts").find({ hidden: { $ne: true } }).toArray();
        let authors = [], contributors = [];
        try { authors = await getUsersByRole("admin"); } catch {}
        try { contributors = await getUsersByRole("contributor"); } catch {}
        return {
            props: { posts: JSON.parse(JSON.stringify(data)), authors, contributors },
        };
    } catch {
        return { props: { posts: [], authors: [], contributors: [] } };
    }
}

const Posts = ({ posts, authors, contributors }) => {
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
            <ArticleGrid
                title="Pages of the Verse"
                posts={posts}
                authors={authors}
                contributors={contributors}
                marketPage
            />
        </Box>
    );
};

export default Posts;
