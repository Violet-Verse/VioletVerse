import useSWR from "swr";
import { server } from "../../components/config";
import React, { useState, useEffect } from "react";
import PostEditor from "../../components/Posts/PostEditorPage";

export async function getServerSideProps(context) {
    const id = context.params.id;
    const res = await fetch(
        `${server}/api/database/getPostsByID?` +
            new URLSearchParams({
                id: id,
            })
    );

    const data = await res.json();

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
