import PostEditor from "../../components/Posts/PostEditor";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator"],
        },
    };
}

const EditorPage = () => {
    return <PostEditor />;
};

export default EditorPage;
