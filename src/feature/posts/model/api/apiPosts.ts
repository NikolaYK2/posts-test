import { api } from '@/shared/api'
import type { Article, PostsResponse } from '@/feature/posts/model/types'

const POSTS = '/posts'

type Params = {
  id?: number
  limit: number
  skip: number
  textQuery?: string
}
export const apiPosts = {
  async getPosts({ skip, limit }: Params) {
    const res = await api.get<PostsResponse>(POSTS, {
      params: {
        limit: limit,
        skip: skip,
      },
    })
    return res.data
  },

  async searchPosts(textQuery:string) {
    const textSearch = textQuery && textQuery.trim()

    const res = await api.get<PostsResponse>(`${POSTS}/search`, {
      params: {
        q: textSearch,
      },
    })
    return res.data
  },

  async getPostsId(id: number) {
    const res = await api.get<Article>(`${POSTS}/${id}`)
    return res.data
  },
}
