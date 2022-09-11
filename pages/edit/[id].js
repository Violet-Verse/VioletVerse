import useSWR from "swr";
import PostEditor from "../../components/Posts/PostEditorPage";
import { getPostsByID } from "../api/database/getPostsByID";
import { getUserByIssuer } from "../api/database/getUser";

export async function getServerSideProps(context) {
    const id = context.params.id;
    const data = await getPostsByID(id);
    const lastEditor = await getUserByIssuer(data[0]?.lastEditedBy);

    if (!data) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: {
            posts: data[0],
            lastEditor: lastEditor || null,
            protected: true,
            userTypes: ["admin", "contributor"],
        },
    };
}

const EditArticle = ({ posts, lastEditor }) => {
    const fetchWithId = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data, error } = useSWR(
        ["/api/database/getUserForPost", posts.createdBy],
        fetchWithId
    );
    const author = data?.user;

    return (
        <PostEditor
            data={posts}
            editorMode
            author={author}
            lastEditor={lastEditor}
        />
    );
};

export default EditArticle;
