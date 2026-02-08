import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const router = useRouter();
  const { ready, authenticated, user: privyUser, login, logout } = usePrivy();

  // Build user object from Privy user
  const user = ready && authenticated && privyUser ? {
    userId: privyUser.id,
    wallet: privyUser.wallet?.address || null,
    email: privyUser.email?.address || null,
    name: privyUser.email?.address || privyUser.wallet?.address?.slice(0, 8) || 'User',
    picture: null,
    role: 'admin',
  } : null;

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
