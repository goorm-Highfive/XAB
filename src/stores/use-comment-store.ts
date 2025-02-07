import { create } from 'zustand'
import { Comment } from '~/types/comment'
import { Tables } from '~/types/supabase'

type UserCommentsStoreType = {
  comments: Comment[]
  setComments: (comments: Comment[]) => void
  addComment: (newComment: Tables<'comments'>, currentUserName: string) => void
  deleteComment: (commentId: number) => void
  updateComment: (updateComment: Tables<'comments'>) => void
  toggleLike: (commentId: number, liked: boolean) => void
}

const useCommentsStore = create<UserCommentsStoreType>((set) => ({
  comments: [],

  setComments: (comments) => set({ comments }),

  addComment: (newComment, currentUserName) =>
    set((state) => ({
      comments: addCommentToTree(state.comments, newComment.parent_id, {
        ...newComment,
        username: currentUserName,
        replies: [],
        likeCount: 0,
        userLiked: false,
      }),
    })),

  deleteComment: (commentId) =>
    set((state) => ({
      comments: removeCommentFromTree(state.comments, commentId),
    })),

  updateComment: (updatedComment) =>
    set((state) => {
      const updatedComments = updateCommentInTree(
        state.comments,
        updatedComment,
      )
      return { comments: [...updatedComments] }
    }),

  toggleLike: (commentId, liked) =>
    set((state) => ({
      comments: toggleLikeInTree(state.comments, commentId, liked),
    })),
}))

// 🔹 댓글 트리에 댓글 추가
const addCommentToTree = (
  comments: Comment[],
  parentId: number | null,
  newReply: Comment,
): Comment[] => {
  if (parentId === null) {
    return [...comments, newReply]
  }

  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, newReply],
      }
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: addCommentToTree(comment.replies, parentId, newReply),
      }
    }

    return comment
  })
}

// 🔹 댓글 트리에서 댓글 삭제
const removeCommentFromTree = (
  comments: Comment[],
  commentId: number,
): Comment[] => {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => ({
      ...comment,
      replies: removeCommentFromTree(comment.replies, commentId),
    }))
}

// 🔹 댓글 트리에서 댓글 업데이트
const updateCommentInTree = (
  comments: Comment[],
  updatedComment: Tables<'comments'>,
): Comment[] => {
  return comments.map((comment) => {
    if (comment.id === updatedComment.id) {
      return { ...comment, ...updatedComment }
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, updatedComment),
      }
    }

    return comment
  })
}

// 🔹 좋아요 상태 변경
const toggleLikeInTree = (
  comments: Comment[],
  commentId: number,
  liked: boolean,
): Comment[] => {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        userLiked: liked,
        likeCount: liked ? comment.likeCount + 1 : comment.likeCount - 1,
      }
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: toggleLikeInTree(comment.replies, commentId, liked),
      }
    }

    return comment
  })
}

export { useCommentsStore }
