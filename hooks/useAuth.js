import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

// Fetch additional user data from your database using wallet address
const useUserData = (walletAddress) => {
  const { data, error } = useSWR(
    walletAddress ? `/api/database/getUser?wallet=${walletAddress}` : null,
    fetcher
  );

  return {
    userData: data?.user,
    isLoading: !error && !data,
    isError: error
  };
};

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const router = useRouter();
  const { user: privyUser, authenticated, ready, login, logout } = usePrivy();
  const { wallets } = useWallets();
  
  // Get the primary wallet address
  const walletAddress = wallets && wallets[0] ? wallets[0].address : null;
  
  // Fetch additional user data from your database
  const { userData, isLoading } = useUserData(walletAddress);

  // Combine Privy user with database user data
  const user = authenticated && privyUser ? {
    id: privyUser.id,
    wallet: walletAddress,
    email: privyUser.email?.address || null,
    // Merge with database user data if available
    ...userData,
  } : null;

  const finished = ready && !isLoading;
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser, router]);

  return {
    user: user,
    loaded: finished,
    authenticated,
    login,
    logout,
  };
}

export function usePosts() {
  const { data: posts, error: postsError } = useSWR(
    "/api/database/getUserPosts",
    fetcher
  );

  return {
    posts,
    isLoading: !postsError && !posts,
    isError: postsError,
  };
}
