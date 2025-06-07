import type { Ref } from 'vue'
import type { Article, PostsResponse } from '@/feature/posts/model/types'

export async function doDataSearch(
  apiFn: (textQuery: string) => Promise<PostsResponse>,
  query: string,
  resultRef: Ref<Article[] | null>,
) {
  const trimmed = query.trim()
  if (!trimmed) {
    resultRef.value = null
    return
  }
  try {
    resultRef.value = (await apiFn(trimmed)).posts
  } catch {
    resultRef.value = []
  }
}
