export type Reactions = {
  likes: number
  dislikes: number
  views: number
  userId: number
}

export type Article = {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: Reactions
}
