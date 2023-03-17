import useSWR from "swr";
import PostEditor from "../../components/Editor/PostEditorPage";
import connectDatabase from "../../lib/mongoClient";
import { getUserByIssuer } from "../api/database/getUser";
import { ObjectId } from "mongodb";

export async function getServerSideProps(context) {
    const postId = context.params.id;
    const db = await connectDatabase();
    const collection = db.collection("posts");
    const postData = await collection
        .find({ _id: new ObjectId(postId) })
        .toArray();

    if (!postData || postData.length === 0) {
        return { notFound: true, props: { posts: {} } };
    }

    const lastEditor =
        (await getUserByIssuer(postData?.[0]?.lastEditedBy)) ?? null;

    return {
        props: {
            posts: JSON.parse(JSON.stringify(postData[0])),
            lastEditor,
            protected: true,
            userTypes: ["admin", "contributor"],
        },
    };
}

const EditArticle = ({ posts, lastEditor }) => {
    const fetchAuthor = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data: author, error } = useSWR(
        ["/api/database/getUserForPost", posts.createdBy],
        fetchAuthor
    );

    return (
        <PostEditor
            data={posts}
            editorMode
            author={author?.user}
            lastEditor={lastEditor}
        />
    );
};

export default EditArticle;
