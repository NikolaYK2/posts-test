import { onMounted, ref, watch } from 'vue'
import type { Article } from '@/feature/posts/model/types'
import { apiPosts } from '@/feature/posts/model/api'

type CachedPosts = {
  posts: Article[]
  total: number
  page: number
  limit: number
}

export function usePosts(initialLimit = 10) {
  const posts = ref<Article[]>([])
  const currentPage = ref(1)
  const limit = ref(initialLimit)
  const totalPages = ref(0)
  const skip = ref((currentPage.value - 1) * limit.value)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const textQuery = ref('')
  const filterById = ref('')
  const filterByLikes = ref('')
  const filterByDislikes = ref('')

  const POSTS_STORAGE_KEY = 'posts'
  const PAGE_STORAGE_KEY = 'currentPage'

  const savedPage = sessionStorage.getItem(PAGE_STORAGE_KEY)
  if (savedPage) {
    currentPage.value = parseInt(savedPage, 10)
  }

  const loadInitialPosts = async () => {
    isLoading.value = true
    error.value = null

    try {
      const cachedString = sessionStorage.getItem(POSTS_STORAGE_KEY)
      if (cachedString) {
        const cached = JSON.parse(cachedString) as CachedPosts
        if (cached.page === currentPage.value && cached.limit === limit.value) {
          posts.value = cached.posts
          totalPages.value = Math.ceil(cached.total / limit.value) || 1
          return
        }
      }
      await fetchAndCachePosts()
    } finally {
      isLoading.value = false
    }
  }

  const fetchAndCachePosts = async () => {
    isLoading.value = true
    error.value = null

    try {
      skip.value = (currentPage.value - 1) * limit.value

      if (textQuery.value.trim()) {
        const res = await apiPosts.searchPosts(textQuery.value)
        posts.value = res.posts
        totalPages.value = Math.ceil(res.total / limit.value) || 1

        const toCache: CachedPosts = {
          posts: res.posts,
          total: res.total,
          page: currentPage.value,
          limit: limit.value,
        }
        sessionStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(toCache))
        sessionStorage.setItem(PAGE_STORAGE_KEY, currentPage.value.toString())
      } else {
        const res = await apiPosts.getPosts({ limit: limit.value, skip: skip.value })
        posts.value = res.posts
        totalPages.value = Math.ceil(res.total / limit.value) || 1

        const toCache: CachedPosts = {
          posts: res.posts,
          total: res.total,
          page: currentPage.value,
          limit: limit.value,
        }
        sessionStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(toCache))
        sessionStorage.setItem(PAGE_STORAGE_KEY, currentPage.value.toString())
      }
    } catch (err: unknown) {
      error.value = err as Error
      console.error('Fetch posts failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadInitialPosts()
  })

  watch([currentPage, limit, textQuery], () => {
    sessionStorage.removeItem(POSTS_STORAGE_KEY)
    fetchAndCachePosts()
  })

  const clearCache = () => {
    sessionStorage.removeItem(POSTS_STORAGE_KEY)
    sessionStorage.removeItem(PAGE_STORAGE_KEY)
  }

  return {
    posts,
    totalPages,
    currentPage,
    limit,
    isLoading,
    error,
    textQuery,
    filterById,
    filterByLikes,
    filterByDislikes,
    fetchAndCachePosts,
    clearCache,
  }
}
