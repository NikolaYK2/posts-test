import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Article } from '@/feature/posts/model/types'
import { apiPosts } from '@/feature/posts/model/api'
import { doDataSearch } from '@/feature/posts/model/utils/doDataSearch.ts'

export function useSearchPosts() {
  const filterById = ref('')
  const titleQuery = ref('')
  const bodyQuery = ref('')

  // результат «глобального» поиска по API (title или body)
  const searchResults = ref<Article[] | null>(null)
  // результат точечного поиска по ID
  const explicitIdResult = ref<Article | null>(null)
  const idError = ref<string | null>(null)

  // debounced запрос по ID
  const fetchPostById = async (id: number) => {
    try {
      explicitIdResult.value = await apiPosts.getPostsId(id) // ожидаем { post: Article }
      idError.value = null
    } catch {
      explicitIdResult.value = null
      idError.value = 'Пост с таким ID не найден'
    }
  }
  const debouncedFetchById = useDebounceFn((val: string) => {
    const trimmed = val.trim()
    if (!trimmed) {
      explicitIdResult.value = null
      idError.value = null
      return
    }
    const num = Number(trimmed)
    if (!Number.isInteger(num) || num <= 0) {
      explicitIdResult.value = null
      idError.value = 'Введите корректный числовой ID'
      return
    }
    fetchPostById(num)
  }, 300)

  watch(filterById, (val) => {
    explicitIdResult.value = null
    idError.value = null
    debouncedFetchById(val)
  })

  const debouncedTitleSearch = useDebounceFn(
    (textQuery: string) => doDataSearch(apiPosts.searchPosts, textQuery, searchResults),
    300,
  )
  watch(titleQuery, (textQuery) => {
    if (textQuery.trim()) {
      debouncedTitleSearch(textQuery)
      bodyQuery.value = ''
    } else {
      debouncedTitleSearch.cancel()
      if (!bodyQuery.value.trim()) {
        searchResults.value = null
      }
    }
  })

  const debouncedBodySearch = useDebounceFn(
    (textQuery: string) => doDataSearch(apiPosts.searchPosts, textQuery, searchResults),
    300,
  )
  watch(bodyQuery, (textQuery) => {
    if (textQuery.trim()) {
      debouncedBodySearch(textQuery)
      titleQuery.value = ''
    } else {
      debouncedBodySearch.cancel()
      if (!titleQuery.value.trim()) {
        searchResults.value = null
      }
    }
  })

  return {
    // поля
    filterById,
    titleQuery,
    bodyQuery,
    // результаты
    searchResults,
    explicitIdResult,
    idError,
  }
}
