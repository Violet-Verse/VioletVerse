import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const fetcher = (url) => fetch(url).then((r) => r.json())

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const router = useRouter()
  const { data, error } = useSWR('/api/database/getUser', fetcher)

  const user = data?.user || null
  const loaded = data !== undefined || error !== undefined
  const hasUser = Boolean(user)

  useEffect(() => {
    if (!redirectTo || !loaded) return
    if (
      (redirectTo && !redirectIfFound && !hasUser) ||
      (redirectIfFound && hasUser)
    ) {
      router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, hasUser, loaded, router])

  return {
    user,
    loaded,
    authenticated: hasUser,
    login: () => {},
    logout: () => {
      router.push('/api/auth/logout')
    },
  }
}

export function usePosts() {
  return { posts: [], isLoading: false, isError: false }
}
