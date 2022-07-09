import Link from 'next/link';

export const getStaticPaths = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    const paths = data.map((posts) => {
        return {
            params: { id: posts.id.toString() },
        };
    });

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps = async (context) => {
    const id = context.params.id;
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/` + id);
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Article = ({ posts }) => {
    return (
        <div>
            <h1>{posts.title}</h1>
            <p>{posts.body}</p>
            <Link href='/posts'>
                <a>
                    <h3 style={{color: 'blue'}}>See more posts</h3>
                </a>
            </Link>
        </div>
    );
};

export default Article;
