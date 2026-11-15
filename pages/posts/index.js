import { Box } from "@mui/material";
import ArticleGrid from "../../components/article/ArticleGrid";
import connectDatabase from "../../lib/mongoClient";
import { getUsersByRole } from "../api/database/getUserByEmail";

export async function getServerSideProps() {
    let posts = [];
    let authors = [];
    let contributors = [];

    try {
        const db = await connectDatabase();
        if (db) {
            const collection = db.collection("posts");
            const data = await collection.find({ hidden: false }).toArray();
            posts = JSON.parse(JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error fetching posts:", error.message);
    }

    try {
        authors = await getUsersByRole("admin");
        contributors = await getUsersByRole("contributor");
    } catch (error) {
        console.error("Error fetching users:", error.message);
    }

    return {
        props: {
            posts,
            authors,
            contributors,
        },
    };
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
                title="Layers of the Verse"
                posts={posts}
                authors={authors}
                contributors={contributors}
                marketPage
            />
        </Box>
    );
};

export default Posts;
