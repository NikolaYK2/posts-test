import type { Ref } from 'vue'
import type { Article } from '@/feature/posts/model/types'

export async function doDataSearch(
  apiFn: (textQuery: string) => Promise<Article[]>,
  query: string,
  resultRef: Ref<Article[] | null>,
) {
  const trimmed = query.trim()
  if (!trimmed) {
    resultRef.value = null
    return
  }
  try {
    resultRef.value = await apiFn(trimmed)
  } catch {
    resultRef.value = []
  }
}
