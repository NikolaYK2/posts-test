//RES -------------------------------
export type Reactions = {
  likes: number
  dislikes: number
  views: number
  userId: number
}

export type Article = {
  id: number
  userId: number
  title: string
  body: string
  reactions: Reactions
  tags: string[]
}

export type PostsResponse = {
  posts: Article[]
  total: number
  skip: number
  limit: number
}

type CommentUser = {
  username: string
}

export type Comment = {
  user: CommentUser
  body: string
  id: number
}

export type CommentsResponse = {
  comments: Comment[]
}
// PARAMS --------------------
