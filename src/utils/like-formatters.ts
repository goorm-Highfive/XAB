const formatLikeCount = (count: number = 0) => {
  if (count >= 1000) return `${Math.round(count / 100) / 10}k`
  return count.toString()
}

export { formatLikeCount }
