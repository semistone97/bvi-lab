# 프로젝트 구조 설명서
이 프로젝트는 React + Supabase + Vercel로 만든 연구실 홈페이지입니다.

## 📂 파일 구조 및 역할

### 1. 라우팅 & 설정
- **src/App.jsx**: 메인 라우터. `/` (MainPage)와 `/admin` (AdminPage) 경로를 정의함.
- **vercel.json**: SPA 라우팅 문제 해결을 위한 배포 설정 파일.

### 2. 메인 페이지 (MainPage.jsx)
- **src/MainPage.jsx**: 
  - Supabase에서 데이터(`news`, `members`)를 fetching함.
  - 하위 컴포넌트(`Header`, `HeroSection`, `NewsSection`, `MembersSection`)를 조립하여 화면을 구성함.

### 3. 컴포넌트 (src/components/)
- **Header.jsx**: 상단 로고 및 Admin 페이지 이동 링크.
- **HeroSection.jsx**: 메인 배너 ("Leading the Future...") 텍스트 영역.
- **NewsSection.jsx**: 뉴스 데이터를 받아 카드 리스트 형태로 렌더링.
- **MembersSection.jsx**: 
  - 연구원 리스트 렌더링.
  - **필터링 로직 포함**: 재학/수료 필터, 태그 필터, 이름 검색 기능이 여기서 동작함.

### 4. 관리자 페이지 (AdminPage.jsx)
- **src/AdminPage.jsx**: 
  - 구글 로그인 인증 (Supabase Auth).
  - 뉴스 및 멤버 데이터 CRUD (추가, 삭제) 기능.
  - 이미지 업로드 기능.

## 🗄️ 데이터베이스 (Supabase)
- **news 테이블**: `id`, `title`, `description`, `date`, `category`, `author`, `image_url`
- **members 테이블**: `id`, `name`, `role`, `status` (재학/수료), `tags` (쉼표로 구분), `image_url`