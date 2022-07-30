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
        <ArticleGrid title="Layers of The Verse" posts={posts} maximum={100} />
    );
};

export default Posts;
