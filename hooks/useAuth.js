import { useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Build user object from wallet connection
  const user = isConnected && address ? {
    wallet: address,
    userId: address,
    // Default role to allow dashboard access for any connected wallet
    role: 'admin',
  } : null;

  const loaded = true;
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, hasUser, router]);

  return {
    user: user,
    loaded: loaded,
    authenticated: isConnected,
    login: () => {
      // RainbowKit handles login via its own UI
      router.push('/connect');
    },
    logout: () => {
      disconnect();
      router.push('/connect');
    },
  };
}

export function usePosts() {
  // TODO: Replace with real API call when backend is ready
  return {
    posts: [],
    isLoading: false,
    isError: false,
  };
}
