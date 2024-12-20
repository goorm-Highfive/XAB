import { SurveyCard } from '~/components/common/survey-card'

// 게시글 뷰페이지 : 게시글 (작성자 + 콘텐츠)
function PostArticle() {
  return (
    <article>
      <SurveyCard
        date="March 15, 2025"
        question="Which landing page design do you prefer for our new product?"
        optionA="Design A"
        optionB="Design B"
        votesA={50}
        votesB={50}
        showVoteBtn={true} //투표 버튼은 상세페이지에서만 보입니다.
      />
    </article>
  )
}

export { PostArticle }
