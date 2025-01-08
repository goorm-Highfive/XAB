// 좋아요 카운트 포맷
const formatLikeCount = (count: number) => {
  if (count >= 1000) return `${Math.round(count / 100) / 10}k`
  return count.toString()
}

export { formatLikeCount }
