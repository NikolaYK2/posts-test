import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Article } from '@/feature/posts/model/types'
import { apiPosts } from '@/feature/posts/model/api'
import { doDataSearch } from '@/feature/posts/model/utils/doDataSearch'

export function useSearchPosts() {
  const filterById = ref('')
  const titleQuery = ref('')
  const bodyQuery = ref('')

  const searchResults = ref<Article[] | null>(null)
  const explicitIdResult = ref<Article | null>(null)
  const idError = ref<string | null>(null)

  // 1) debounced поиск по title/body
  const debouncedGlobalSearch = useDebounceFn(async () => {
    const t = titleQuery.value.trim()
    const b = bodyQuery.value.trim()

    // если оба пустые — сбросить результат и выйти
    if (!t && !b) {
      searchResults.value = null
      return
    }

    // Если пользователь ввёл title — сбросим body, и наоборот
    const query = t || b
    if (t) bodyQuery.value = ''
    else titleQuery.value = ''

    // собственно запрос
    await doDataSearch(apiPosts.searchPosts, query, searchResults)
  }, 300)

  watch([titleQuery, bodyQuery], debouncedGlobalSearch)

  // 2) debounced поиск по ID
  const fetchPostById = async (id: number) => {
    try {
      explicitIdResult.value = await apiPosts.getPostsId(id)
      idError.value = null
    } catch {
      explicitIdResult.value = null
      idError.value = 'Пост с таким ID не найден'
    }
  }
  const debouncedFetchById = useDebounceFn((val: string) => {
    const n = Number(val.trim())
    if (!val.trim()) {
      explicitIdResult.value = null
      idError.value = null
    } else if (!Number.isInteger(n) || n <= 0) {
      explicitIdResult.value = null
      idError.value = 'Введите корректный числовой ID'
    } else {
      fetchPostById(n)
    }
  }, 300)
  watch(filterById, debouncedFetchById)

  return {
    filterById,
    titleQuery,
    bodyQuery,
    searchResults,
    explicitIdResult,
    idError,
  }
}
