import { Box } from "@mui/material";
import ArticleGrid from "../../components/Posts/ArticleGrid";
import { getAllPosts } from "../api/database/getAllPosts";

export async function getServerSideProps() {
    const data = await getAllPosts();

    return {
        props: { posts: data },
    };
}

const Posts = ({ posts }) => {
    console.log(posts);
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
            />
        </Box>
    );
};

export default Posts;
