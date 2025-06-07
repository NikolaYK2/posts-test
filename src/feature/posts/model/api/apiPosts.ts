import { api } from '@/shared/api'
import type { Article, CommentsResponse, PostsResponse } from '@/feature/posts/model/types'

const POSTS = '/posts'

type CreatePostParams={
  postId: number
  title: string
  body: string
}
type Params = {
  id?: number
  limit: number
  skip: number
  textQuery?: string
}
export const apiPosts = {
  async createPost({ postId, title, body }: CreatePostParams) {
    const res = await api.patch<Article>(`${POSTS}/${postId}`, {body, title})
    return res.data
  },
  async getPosts({ skip, limit }: Params) {
    const res = await api.get<PostsResponse>(POSTS, {
      params: {
        select: 'userId,title,body,reactions',
        limit: limit,
        skip: skip,
      },
    })
    return res.data
  },

  async searchPosts(textQuery: string) {
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

  async getComment(id: number) {
    const res = await api.get<CommentsResponse>(`${POSTS}/${id}/comments`)
    return res.data
  },
}
