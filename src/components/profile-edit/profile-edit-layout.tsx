// 개인정보 페이지 : 콘텐츠 공통 레이아웃 설정
function ProfileEditLayout({
  contentTitle,
  children,
}: {
  contentTitle: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-5 mt-8 text-lg">
        <b>{contentTitle}</b>
      </h2>
      {children}
    </section>
  )
}

export { ProfileEditLayout }
