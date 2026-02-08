import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

export function useUser({ redirectTo, redirectIfFound } = {}) {
    const router = useRouter();
    const { ready, authenticated, user: privyUser, login, logout } = usePrivy();

    // Airtable profile state (role, name, username, etc.)
    const [profile, setProfile] = useState(null);
    const [syncing, setSyncing] = useState(false);

    // Sync Privy user to Airtable on login to get their role
    const syncUser = useCallback(async (pUser) => {
        if (syncing) return;
        setSyncing(true);

        try {
            const res = await fetch("/api/auth/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: pUser.wallet?.address || null,
                    email: pUser.email?.address || null,
                    privyId: pUser.id,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
            } else {
                // Fallback: basic user role
                setProfile({ role: "user", synced: false });
            }
        } catch (err) {
            console.error("Auth sync error:", err);
            setProfile({ role: "user", synced: false });
        } finally {
            setSyncing(false);
        }
    }, [syncing]);

    useEffect(() => {
        if (ready && authenticated && privyUser && !profile && !syncing) {
            syncUser(privyUser);
        }
        // Clear profile on logout
        if (ready && !authenticated) {
            setProfile(null);
        }
    }, [ready, authenticated, privyUser, profile, syncing, syncUser]);

    // Build user object combining Privy identity + Airtable profile
    const user =
        ready && authenticated && privyUser
            ? {
                  userId: privyUser.id,
                  wallet: privyUser.wallet?.address || null,
                  email: privyUser.email?.address || null,
                  name:
                      profile?.name ||
                      privyUser.email?.address ||
                      privyUser.wallet?.address?.slice(0, 8) ||
                      "User",
                  username: profile?.username || null,
                  picture: profile?.picture || null,
                  role: profile?.role || "user",
                  airtableId: profile?.airtableId || null,
              }
            : null;

    const loaded = ready;
    const hasUser = Boolean(user);

    useEffect(() => {
        if (!redirectTo || !ready) return;

        if (
            (redirectTo && !redirectIfFound && !hasUser) ||
            (redirectIfFound && hasUser)
        ) {
            router.push(redirectTo);
        }
    }, [redirectTo, redirectIfFound, hasUser, ready, router]);

    return {
        user,
        loaded,
        authenticated,
        login,
        logout,
    };
}

export function usePosts() {
    return {
        posts: [],
        isLoading: false,
        isError: false,
    };
}
