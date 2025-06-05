import { ref, onMounted } from 'vue'
import { api } from '@/shared/api'
import type { Article } from '@/feature/posts/model/types'

export function usePosts() {
  const posts = ref<Article[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const STORAGE_KEY = 'posts'

  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const cachedData = sessionStorage.getItem(STORAGE_KEY)

      if (cachedData) {

        posts.value = JSON.parse(cachedData)
      } else {

        const response = await api.get('/posts')
        posts.value = response.data.posts


        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(posts.value))
      }
    } catch (err: unknown) {
      error.value = err as Error
      console.error('Fetch users failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  const clearCache = () => {
    sessionStorage.removeItem(STORAGE_KEY)
  }

  onMounted(() => {
    fetchUsers()
  })

  return {
    posts,
    isLoading,
    error,
    fetchUsers,
    clearCache,
  }
}
