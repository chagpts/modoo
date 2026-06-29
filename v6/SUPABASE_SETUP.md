# Supabase 게시판 연결 방법

## 1. Supabase 프로젝트 생성
Supabase에서 새 프로젝트를 만든 뒤 `Project Settings > API`에서 아래 값을 확인합니다.

- Project URL
- anon public key

`service_role` 키는 절대 프론트엔드 코드에 넣지 마세요.

## 2. 테이블 생성
Supabase Dashboard의 `SQL Editor`에서 `supabase/schema.sql` 파일 내용을 전체 실행합니다.

생성되는 구성은 다음과 같습니다.

- `public.board_posts` 테이블
- 카테고리, 제목, 작성자, 본문, 조회수, 삭제 여부, 생성/수정 시각 컬럼
- 공개 읽기 정책
- 공개 작성 정책
- 조회수 증가 RPC `increment_board_post_views`

## 3. 프론트엔드 설정
`js/supabase-config.js` 파일을 열고 값을 바꿉니다.

```js
window.AUDITSECU_SUPABASE = {
  url: 'https://프로젝트REF.supabase.co',
  anonKey: '프로젝트_ANON_PUBLIC_KEY'
};
```

## 4. 실행
로컬에서 바로 파일을 열 수도 있지만, 브라우저 CORS/보안 정책을 피하려면 간단한 로컬 서버를 권장합니다.

```bash
python3 -m http.server 5500
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:5500
```

## 5. 운영 전환 시 권장 보완
현재는 교육용 데모라 누구나 글을 쓸 수 있는 공개 게시판입니다. 실제 운영 전에는 다음을 추가하는 것을 권장합니다.

- Supabase Auth 로그인
- 관리자만 공지 작성 가능
- 작성자별 수정/삭제 정책
- CAPTCHA 또는 Rate Limit
- 욕설/스팸 필터
- Storage를 이용한 첨부파일 업로드
