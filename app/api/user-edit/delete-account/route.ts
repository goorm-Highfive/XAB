import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  console.log(request.method) //임시
  return NextResponse.json({ message: 'Account deleted successfully.' })
}

// // Supabase 클라이언트 생성
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     persistSession: true, // 세션 지속 활성화
//     detectSessionInUrl: true, // URL에서 세션 정보 감지
//   },
// });

// const checkLoginStatus = async () => {
//   const { data: user, error } = await supabase.auth.getUser();
//   console.log('User:', user);
//   console.log('Error:', error);
// };

// checkLoginStatus();

// export async function DELETE(request: NextRequest) {
//   try {
//     // 요청 헤더에서 인증 토큰 읽기
//     const authHeader = request.headers.get('authorization');
//     const token = authHeader?.split(' ')[1];

//     if (!token) {
//       console.error('인증 토큰 누락');
//       return NextResponse.json({ error: '사용자 인증 실패' }, { status: 401 });
//     }

//     // 사용자 인증 확인
//     const { data: authData, error: authError } = await supabase.auth.getUser(token);

//     if (authError || !authData?.user) {
//       console.error('사용자 인증 실패:', authError?.message || '유효하지 않은 사용자');
//       return NextResponse.json({ error: '사용자 인증 실패' }, { status: 401 });
//     }

//     console.log('인증된 사용자 ID:', authData.user.id);

//     // 사용자 계정 삭제
//     const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);

//     if (deleteError) {
//       console.error('계정 삭제 실패:', deleteError.message);
//       return NextResponse.json({ error: '계정 삭제 실패: ' + deleteError.message }, { status: 400 });
//     }

//     console.log('계정 삭제 성공:', authData.user.id);
//     return NextResponse.json({ message: '계정이 성공적으로 삭제되었습니다.' }, { status: 200 });
//   } catch (error: any) {
//     console.error('서버 오류:', error.message);
//     return NextResponse.json({ error: '서버 오류: ' + error.message }, { status: 500 });
//   }
// }
