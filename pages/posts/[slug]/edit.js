import PostEditorPage from "../../../components/Editor/PostEditorPage";
import connectDatabase from "../../../lib/mongoClient";
import { getAuthorForPost } from "../../api/database/getUserForPost";

export async function getServerSideProps(context) {
    const { slug } = context.params;

    try {
        const db = await connectDatabase();
        if (!db) return { notFound: true };

        const collection = db.collection("posts");
        const results = await collection.find({ slug }).toArray();
        if (!results || results.length === 0) return { notFound: true };

        const post = JSON.parse(JSON.stringify(results[0]));

        let author = null;
        try {
            const authorData = await getAuthorForPost(slug);
            author = authorData?.user || null;
        } catch {}

        return {
            props: {
                protected: true,
                userTypes: ["admin", "contributor"],
                data: post,
                editorMode: true,
                author,
            },
        };
    } catch {
        return { notFound: true };
    }
}

const EditPostPage = (props) => {
    return <PostEditorPage {...props} />;
};

export default EditPostPage;
