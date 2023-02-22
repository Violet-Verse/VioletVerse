import { Box } from "@mui/material";
import ArticleGrid from "../../components/Posts/ArticleGrid";
import connectDatabase from "../../lib/mongoClient";
import { getUsersByRole } from "../api/database/getUserByEmail";

export async function getServerSideProps() {
    const db = await connectDatabase();
    const collection = db.collection("posts");
    const data = await collection.find({ hidden: false }).toArray();

    const authors = await getUsersByRole("admin");
    const contributors = await getUsersByRole("contributor");

    return {
        props: {
            posts: JSON.parse(JSON.stringify(data)),
            authors: authors,
            contributors: contributors,
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
