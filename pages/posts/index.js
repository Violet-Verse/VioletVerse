import ArticleGrid from "../../components/ArticleGrid";
import { server } from "../../components/config";

export const getStaticProps = async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Posts = ({ posts }) => {
    return (
        <ArticleGrid
            title="Curated Content Marketplace"
            posts={posts}
            maximum={100}
        />
    );
};

export default Posts;
