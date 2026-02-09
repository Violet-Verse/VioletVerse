import { useAccount, useDisconnect } from 'wagmi';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) => {
            return { user: data?.user || null };
        });

const postFetcher = (url) => fetch(url).then((r) => r.json());

export function useUser({ redirectTo, redirectIfFound } = {}) {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Fetch user data from the database (session-based)
    const { data: users, error: userError, mutate } = useSWR(
        "/api/database/getUser",
        fetcher
    );
    const dbUser = users?.user;
    const finished = Boolean(users);

    // If wallet is connected but no DB user, build a minimal user object
    const user = dbUser
        ? dbUser
        : isConnected && address
            ? { wallet: address, userId: address, role: 'admin' }
            : null;

    const loaded = finished || null;
    const hasUser = Boolean(user);

    useEffect(() => {
        if (!redirectTo || !finished) return;
        if (
            (redirectTo && !redirectIfFound && !hasUser) ||
            (redirectIfFound && hasUser)
        ) {
            router.push(redirectTo);
        }
    }, [redirectTo, redirectIfFound, finished, hasUser, router]);

    const logout = useCallback(() => {
        disconnect();
        fetch('/api/auth/logout').then(() => {
            mutate();
            router.push('/connect');
        });
    }, [disconnect, mutate, router]);

    return {
        user: userError ? null : user,
        loaded: loaded,
        authenticated: isConnected,
        login: () => {
            router.push('/connect');
        },
        logout,
    };
}

export function usePosts() {
    const { data: posts, error: postsError } = useSWR(
        "/api/database/getUserPosts",
        postFetcher
    );
    const loaded = Boolean(posts);

    return { posts: posts, loaded: loaded };
}
