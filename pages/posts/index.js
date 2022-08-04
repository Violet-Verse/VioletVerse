import { Box } from "@mui/material";
import ArticleGrid from "../../components/ArticleGrid";
import { server } from "../../components/config";

export async function getServerSideProps() {
    const res = await fetch(`${server}/api/database/getAllPosts`);
    const data = await res.json();

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
                title="Layers of The Verse"
                posts={posts}
                maximum={100}
            />
        </Box>
    );
};

export default Posts;
