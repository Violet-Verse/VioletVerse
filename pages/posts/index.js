import { Box } from "@mui/material";
import ArticleGrid from "../../components/Posts/ArticleGrid";
import { getAllPosts } from "../api/database/getAllPosts";
import { getUsersByRole } from "../api/database/getUserByEmail";

export async function getServerSideProps() {
    const data = await getAllPosts();
    const authors = await getUsersByRole("admin");
    const contributors = await getUsersByRole("contributor");

    return {
        props: { posts: data, authors: authors, contributors: contributors },
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
                maximum={100}
                authors={authors}
                contributors={contributors}
            />
        </Box>
    );
};

export default Posts;
