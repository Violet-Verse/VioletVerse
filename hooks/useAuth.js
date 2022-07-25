import Router from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) => {
            return { user: data?.user || null };
        });

const postFetcher = (url) => fetch(url).then((r) => r.json());

export function useUser({ redirectTo, redirectIfFound } = {}) {
    const { data: users, error: userError } = useSWR(
        "/api/database/getUser",
        fetcher
    );
    const user = users?.user;
    const finished = Boolean(users);
    const hasUser = Boolean(user);

    useEffect(() => {
        if (!redirectTo || !finished) return;
        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !hasUser) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && hasUser)
        ) {
            Router.push(redirectTo);
        }
    }, [redirectTo, redirectIfFound, finished, hasUser]);

    return {
        user: userError ? null : user,
        loaded: finished || null,
    };
}

export function usePosts() {
    const { data: posts, error: postsError } = useSWR(
        "/api/database/getUserPosts",
        postFetcher
    );
    const loaded = Boolean(posts);

    console.log(posts);

    return { posts: posts, loaded: loaded };
}
