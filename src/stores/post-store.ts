import { create } from 'zustand'
import { Post } from '~/types/post'

type PostStore = {
  posts: Post[]
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  updatePost: (postId: number, updater: (post: Post) => Post) => void
  removePost: (postId: number) => void
}

const usePostStore = create<PostStore>((set) => ({
  posts: [],
  setPosts: (posts) => set(() => ({ posts })), // 전체 게시글 설정
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),
  updatePost: (postId, updater) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.post_id === postId ? updater(post) : post,
      ),
    })),
  removePost: (postId) =>
    set((state) => {
      const updatedPosts = state.posts.filter((post) => post.post_id !== postId)
      return { posts: updatedPosts }
    }),
}))

export default usePostStore
