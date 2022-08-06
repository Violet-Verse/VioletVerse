import useSWR from "swr";
import PostEditor from "../../components/Posts/PostEditorPage";
import { getPostsByID } from "../api/database/getPostsByID";

export async function getServerSideProps(context) {
    const id = context.params.id;
    const data = await getPostsByID(id);

    if (!data) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: {
            posts: data[0],
            protected: true,
            userTypes: ["admin", "collaborator"],
        },
    };
}

const EditArticle = ({ posts }) => {
    const fetchWithId = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data, error } = useSWR(
        ["/api/database/getUserForPost", posts.createdBy],
        fetchWithId
    );
    const author = data?.user;

    return <PostEditor data={posts} editorMode author={author} />;
};

export default EditArticle;
