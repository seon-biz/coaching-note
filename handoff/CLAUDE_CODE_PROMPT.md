# 코칭 노트 — Claude Code 핸드오프 프롬프트

> 이 문서를 Claude Code 채팅창에 통째로 붙여 넣으세요.
> 첫 메시지로 보내면 됩니다.

---

## 프로젝트 개요

"코칭 노트"라는 한국어 블로그형 웹사이트를 만들려고 합니다.

- **운영자**: 서정옥 (온라인 비즈니스 코치, 8년차)
- **성격**: 영업 페이지가 아닌 **노트형 블로그**. 코칭 사고가 쌓이는 자리.
- **콘텐츠**: 본문에 이미지를 일절 쓰지 않고, 텍스트 + 여백 + 컬러로만 위계를 만든다.
- **배포**: GitHub 푸시 → Cloudflare Pages 자동 빌드
- **저는 처음 작업해봅니다**. 단계별로 친절히 설명해주세요.

---

## 기술 스택 (이걸로 만들어주세요)

- **Astro** (정적 사이트 생성기 — 블로그 + Cloudflare Pages 조합에 최적)
- **Content Collections** + Markdown frontmatter로 글 관리
- **TypeScript**
- **CSS만 사용** — Tailwind 등 추가 프레임워크 없이, design tokens 기반
- 외부 폰트: Google Fonts (Nanum Gothic Coding, JetBrains Mono) + Pretendard CDN

---

## 폴더 구조 제안

```
coaching-note/
├── public/
│   ├── favicon.svg
│   ├── favicon-dark.svg
│   ├── mark.svg
│   └── og-default.png             # 나중에 추가
├── src/
│   ├── assets/
│   │   └── brand/                 # SVG 마크들 (handoff/ 폴더에서 복사)
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Wordmark.astro
│   │   ├── SpiralMark.astro
│   │   ├── PostCard.astro         # 메인 페이지의 글 카드 (큰/작은 사이즈)
│   │   └── thumbnails/
│   │       ├── ThumbnailKeyword.astro
│   │       ├── ThumbnailFragment.astro
│   │       ├── ThumbnailNumeral.astro
│   │       ├── ThumbnailQuestion.astro
│   │       └── ThumbnailList.astro
│   ├── content/
│   │   ├── config.ts              # Content Collection 스키마 정의
│   │   └── posts/
│   │       ├── 001-위임이-되지-않는-세-가지-일.md
│   │       └── 002-혼자-결정해야-하는-자리에서-일어나는-일들.md
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro            # 메인 페이지
│   │   ├── blog/
│   │   │   ├── index.astro        # 블로그 목록 (전체 글)
│   │   │   └── [slug].astro       # 글 상세 페이지
│   │   └── consult.astro          # 상담신청 페이지
│   └── styles/
│       ├── tokens.css             # 디자인 토큰 (컬러 변수)
│       └── global.css             # 전역 스타일
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## 디자인 시스템 (브랜드)

### 컬러 토큰

```css
:root {
  --paper:      #f5f1ea;   /* 페이지 배경 */
  --paper-2:    #ece7da;   /* 카드/세컨더리 배경 */
  --ink:        #1c2520;   /* 본문 텍스트 */
  --green:      #2a3d2e;   /* Forest — 다크 surface 전용 */
  --green-2:    #3d5942;
  --terra:      #c4633b;   /* 액센트 — 페이지당 5~10% 이하 */
  --terra-soft: #d98f6a;   /* Forest 위 액센트용 */
  --mute:       rgba(28, 37, 32, 0.55);
  --rule:       rgba(28, 37, 32, 0.16);
}
```

### 폰트

```css
:root {
  --font-brand:   'Nanum Gothic Coding', monospace;     /* 워드마크 전용 — 고정 */
  --font-meta:    'JetBrains Mono', monospace;          /* 메타/라벨 — 고정 */
  --font-display: 'Pretendard Variable', -apple-system, system-ui, sans-serif;
  --font-body:    'Pretendard Variable', -apple-system, system-ui, sans-serif;
}
```

폰트 로드:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding:wght@400;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
```

### 컨테이너 폭

- 일반 페이지: **920px** (`--container`)
- 본문 읽기: **680px** (`--reading`)
- 폼: **680px** (`--form-width`)
- 좌우 거터: **24px** (모바일)
- 섹션 간격: **128px** (데스크톱), **80px** (모바일)

### 핵심 원칙

- 그림자 없음
- 카드 없음 — 위계는 여백 + 글자 크기로만
- 둥근 모서리 최소 (버튼 4px 정도만)
- Terra는 페이지당 5~10% 이하로 등장
- Forest Green은 다크 surface(신뢰 배너 등) 전용

---

## 마크 SVG (Solid Comma Spiral)

핸드오프 폴더의 `assets/` 또는 아래 path 그대로 사용:

```html
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-label="코칭 노트">
  <path d="M 110 22 C 165 22, 198 60, 198 110 C 198 162, 158 198, 110 198
           C 62 198, 22 162, 22 114 C 22 78, 50 50, 86 50
           C 116 50, 140 72, 140 102 C 140 126, 122 144, 100 144
           C 84 144, 72 132, 72 116 C 72 106, 80 98, 90 98
           C 96 98, 102 102, 104 108"
        fill="#c4633b" stroke="#c4633b" stroke-width="2" stroke-linejoin="round"/>
</svg>
```

---

## 워드마크 (코칭 노트)

Nanum Gothic Coding 700 + 손그림 Terra 언더라인. **Wordmark.astro** 컴포넌트로 만들어주세요.
`size`, `accent` prop을 받고 헤더(22px), 푸터, 락업 어디서든 재사용.

표준 락업 비율: **마크 사이즈 ≈ 워드마크 font-size × 1.18**, gap ≈ 마크의 0.3배.
헤더에서는 마크 26px / 워드마크 22px / gap 8px.

---

## 페이지 시안 (handoff/mockups/)

세 페이지의 HTML 시안을 그대로 보고 구현해주세요. **시안의 모든 CSS·HTML 구조·여백·폰트 사이즈가 정답입니다.** Astro 컴포넌트로 분해할 때 픽셀 단위로 충실히 옮겨주세요.

1. **`01-home.html`** — 메인 페이지
   - 헤더 (마크 + 코칭 노트 워드마크 + 메인/블로그/상담신청)
   - 히어로 ("서정옥 · 8 Years" + 3행 statement)
   - 최근 글 (큰 글 1편 + 작은 글 2편, 가로 2단)
   - 신뢰 배너 (Forest Green 풀블리드, 숫자 강조)
   - 코칭 안내 + 텍스트 링크 CTA
   - 푸터

2. **`02-article.html`** — 글 상세 페이지
   - 헤더 동일
   - 제목 + 날짜 (한글 "2026년 5월 12일")
   - 헤더-본문 사이 룰 한 줄
   - 본문 (680px, 17px/1.85, 단락 사이 Terra-soft 짧은 라인 `<hr class="beat">`)
   - 블록쿼트 (왼쪽 1px 룰 + Mute 컬러)
   - 강조: `em.hi` (Terra 언더라인) / `em.hi-soft` (Terra 컬러만)
   - 글 끝 Spiral 마크 (42px, 가운데, opacity 0.9)
   - 이전/다음 글 네비
   - 작가 짧은 소개
   - 푸터 동일

3. **`03-consult.html`** — 상담신청 페이지
   - 헤더 동일
   - "CONSULTATION" 라벨 + "상담신청" h1
   - 코칭 안내 4종 (200px 번호 칼럼 + 본문, 카드 없이 룰만)
     - 01 · 1:1 코칭
     - 02 · 상세페이지 기획·디자인 그룹
     - 03 · SEO · AI SEO 그룹
     - 04 · 웹사이트 제작
   - "모두 주 1회 줌으로 진행합니다." 한 줄
   - 폼 (680px) — 밑줄 입력 필드만, 카드/박스 없음
     - 이름, 연락처, 관심 코칭(드롭다운), 사업체명(선택), 문의 내용
     - **[신청하기 →]** Terra 4px 라운드 버튼 (페이지 안 유일한 강한 CTA)
   - 제출 후 화면 — "잘 제출되었습니다." + 안내 + "메인으로 →" + Spiral 마크
   - 푸터 동일

---

## 글 데이터 구조 (Content Collection)

`src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const thumbnailSchema = z.discriminatedUnion('pattern', [
  z.object({
    pattern: z.literal('keyword'),
    keyword: z.string().min(1).max(4),
  }),
  z.object({
    pattern: z.literal('fragment'),
    fragment: z.string(),
    highlight: z.string().optional(),
  }),
  z.object({
    pattern: z.literal('numeral'),
    number: z.string(),
    unit: z.string().optional(),
    quote: z.string().optional(),
  }),
  z.object({
    pattern: z.literal('question'),
    question: z.string(),
    attribution: z.string().optional(),
  }),
  z.object({
    pattern: z.literal('list'),
    items: z.array(z.string()).length(3),
    highlight: z.number().min(0).max(2).optional(),
    footer: z.string().optional(),
  }),
]);

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    number: z.number(),                          // N°.012 의 12
    category: z.string(),                        // "결정", "위임" 등
    date: z.date(),
    excerpt: z.string(),                         // 메인 페이지에 보일 발췌 (3~4줄)
    readingTime: z.string().optional(),          // "6분" — 자동 계산해도 됨
    thumbnail: thumbnailSchema,
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

---

## 썸네일 패턴 (5가지) — 컴포넌트로 구현

글마다 frontmatter에서 5가지 패턴 중 **하나**를 선택. 메인 페이지 + 블로그 목록에서 자동 렌더. 5종 모두 16:9 비율, 큰 자리(872×491px)와 작은 자리(436×245px) 두 사이즈 지원.

### A · Keyword (키워드)

```yaml
thumbnail:
  pattern: keyword
  keyword: "결정"          # 1~3자
```
- Forest Green 배경, 거대 한글 (큰 자리 240px / 작은 자리 108px)
- 왼쪽 상단: `N°.012 · 결정` (Terra-soft)
- 오른쪽 상단: Spiral 마크 (Terra-soft)

### B · Fragment (구절)

```yaml
thumbnail:
  pattern: fragment
  fragment: "위임이 어려운 진짜 이유는,"   # 5~14자, \n 가능
  highlight: "이유"                       # Terra 컬러로 강조
```
- Paper-2 배경, 큰 글자 (38px), 왼쪽 상단 정렬
- 오른쪽 하단: `N°.011 · 위임`

### C · Numeral (숫자)

```yaml
thumbnail:
  pattern: numeral
  number: "90"
  unit: "분"
  quote: "시간을 어떻게 쓰는가에서 가장 분명히 갈립니다."
```
- Paper 배경, 1px Rule 보더
- 왼쪽 상단: `N°.010 · 리듬`
- 가운데 좌측: 거대 숫자 (96px) + 작은 unit
- 오른쪽 하단: 짧은 quote

### D · Question (문답)

```yaml
thumbnail:
  pattern: question
  question: "결정하는 게 외로워서요."     # 인용문
  attribution: "어느 대표가, 세션 중에"   # 익명 attribution
```
- Forest Green 배경
- 큰 따옴표 `"` `"` (Noto Serif KR, Terra-soft, 120px)로 인용 감싸기
- 가운데: 큰 인용문 (Pretendard, 30px)
- 왼쪽 상단: `N°.012 · 결정`
- 오른쪽 하단: attribution

### E · List (목록)

```yaml
thumbnail:
  pattern: list
  items: ["일정", "고객", "가격"]    # 정확히 3개
  highlight: 1                       # 0·1·2 중 강조 인덱스 (선택)
  footer: "위임되지 않는 세 가지 일 —→"  # (선택)
```
- Paper-2 배경
- 가운데 3분할 그리드 (구분선): `01 / 02 / 03` 인덱스 + 한 단어
- 강조 인덱스는 Terra 컬러
- 오른쪽 하단: footer 텍스트

각 패턴의 자세한 마크업과 폰트 사이즈는 `mockups/04-thumbnail-patterns.html`에 모두 들어 있습니다 (있다면) — 아니면 `01-home.html`의 첫 큰 글 블록(thumb-big = keyword 패턴)을 참고하세요.

---

## 글 한 편의 Markdown 예시

`src/content/posts/012-혼자-결정해야-하는-자리에서-일어나는-일들.md`:

```markdown
---
title: "혼자 결정해야 하는 자리에서 일어나는 일들"
number: 12
category: "결정"
date: 2026-05-12
readingTime: "6분"
excerpt: |
  어느 대표가 말했습니다. "결정하는 게 외로워서요."
  외로움이라는 단어 뒤에는 보통 능력의 부족이 숨어 있다고 여겨지지만,
  그 자리의 외로움은 조금 다른 종류더군요.
thumbnail:
  pattern: keyword
  keyword: "결정"
---

세션 첫날, 일정 정리 얘기를 하다가 그가 갑자기 말을 멈추고 한참 창밖을 봤습니다.
무슨 일인가 싶어 기다렸는데, 한참 만에 돌아본 그가 한 말이 그것이었어요.
"결정하는 게 외로워서요."

대표 자리에 처음 앉은 사람들은 보통 결정의 양에 먼저 놀랍니다.
어제 안 정해진 일이 오늘 책상 위에 쌓여 있고, 오늘 정한 일이 내일 다시 흔들립니다.
결국 익숙해지지 않는 건 양이 아니라,
<em class="hi">결정에 대한 책임을 처음부터 끝까지 한 사람이 지고 가는 자리</em>
그 자체였어요.

<hr class="beat" />

## 결정의 무게가 다르게 실리는 사람들

8년을 거치며 30명에 가까운 대표를 만났습니다...
```

Markdown에서 `<em class="hi">`, `<em class="hi-soft">`, `<hr class="beat" />` 직접 사용 가능하도록 Astro Markdown 설정에서 raw HTML 허용해주세요.

---

## 구현 순서 (단계별 — 저는 처음이라 천천히 가주세요)

### 1단계 — Astro 프로젝트 생성 + 디자인 토큰

1. `npm create astro@latest coaching-note -- --template minimal --typescript strict`
2. `src/styles/tokens.css`, `src/styles/global.css` 작성
3. `src/layouts/BaseLayout.astro` (head 설정, 폰트 로드, 토큰 import)
4. `Header.astro`, `Footer.astro`, `Wordmark.astro`, `SpiralMark.astro` 구현
5. **여기까지 한 다음 `npm run dev`로 보여주세요.** 헤더·푸터만 있는 빈 페이지 확인.

### 2단계 — 메인 페이지 (글은 더미)

1. Content Collection 스키마 정의 (`src/content/config.ts`)
2. 더미 글 1~3편 만들기 (각 패턴별로 한 편씩)
3. 5가지 썸네일 컴포넌트 구현 (mockup의 CSS 그대로)
4. `PostCard.astro` (`size="big" | "small"` prop)
5. `src/pages/index.astro` — 시안 그대로 구현
6. **확인 후 다음 단계로.**

### 3단계 — 글 상세 페이지

1. `src/pages/blog/[slug].astro` — 시안 그대로
2. 이전/다음 글 자동 계산 (number 기준)
3. **확인 후 다음 단계로.**

### 4단계 — 상담신청 페이지

1. `src/pages/consult.astro` — 시안 그대로
2. 폼 제출: 처음에는 단순히 form action을 외부 폼 서비스로 (예: Formspree, Tally, Getform). 또는 Cloudflare Pages Functions로 이메일 전송 처리.
   - **추천: Formspree 무료 플랜으로 시작**. 나중에 필요하면 Cloudflare Functions로 옮기기.
3. 제출 후 화면은 `?sent=true` 쿼리 파라미터로 토글

### 5단계 — 블로그 목록 페이지

1. `src/pages/blog/index.astro` — 전체 글 카드 그리드
2. 메인 페이지 카드와 같은 컴포넌트 재사용

### 6단계 — 배포 준비

1. `.gitignore` (node_modules, dist, .env)
2. `README.md` — 블로그 글 발행 방법 문서화
3. GitHub 레포 생성 + 첫 푸시
4. Cloudflare Pages 연결 (다음 섹션 참조)

---

## Cloudflare Pages 배포

1. https://dash.cloudflare.com 접속
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. GitHub 레포 선택 + Authorize
4. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 20
5. **Save and Deploy**
6. 도메인은 자동으로 `<프로젝트명>.pages.dev` 부여. 커스텀 도메인은 나중에 연결.

이후 main 브랜치에 푸시할 때마다 자동 배포됩니다.

---

## 글 발행 워크플로 (제가 매번 할 일)

1. `src/content/posts/` 폴더에 새 `.md` 파일 생성 (파일명: `<번호>-<제목-슬러그>.md`)
2. Frontmatter 작성 (5가지 패턴 중 하나 선택)
3. 본문 작성
4. Git commit + push
5. Cloudflare Pages가 자동 빌드해서 1~2분 안에 라이브 반영

처음 몇 번은 Claude Code에 "글 한 편 추가해줘. 제목은 ○○, 패턴은 keyword, keyword 값은 '결정', 본문은:..." 식으로 부탁해도 됩니다.

---

## 첫 작업 요청

위 1단계부터 시작해주세요.

1. Astro 프로젝트 초기 설정
2. 디자인 토큰 (tokens.css)
3. Header, Footer, Wordmark, SpiralMark 컴포넌트
4. BaseLayout

여기까지 끝나면 보여주시고, 제 확인 후 2단계로 넘어가겠습니다.

**핸드오프 폴더의 mockups/01-home.html, 02-article.html, 03-consult.html이 정답입니다.** 디자인 디테일이 모호하면 시안의 CSS를 그대로 차용해주세요.

브랜드 시스템 전체 문서: `handoff/코칭 노트 - 브랜드 핸드오프.md`

---

---

## 추가 결정 사항

**폼 처리 — Formspree 확정**
- 상담신청 폼은 Formspree 무료 플랜 사용 (월 50건)
- 사용자(저)는 아직 Formspree 계정이 없습니다. 빌드 4단계(상담신청 페이지) 진입 시점에 가입 안내 부탁드립니다.

**글 3편 — 이미 준비 완료**
- 더미 글 만들지 마세요. 실제 글 3편이 `handoff/posts/` 폴더에 준비되어 있습니다:
  - 011-10년-후-은퇴하겠다는-말을-듣고.md  (패턴 A keyword "전환")
  - 012-내-속도로-같이-걷는-자리.md  (패턴 D question)
  - 013-워드프레스를-거두며.md  (패턴 C numeral)
- 이 글들을 `src/content/posts/`로 복사한 후 사용해주세요.
- 글 본문에서 `<em class="hi">` 같은 raw HTML 표시는 아직 들어가 있지 않습니다. 빌드 후 본문 강조를 추가할 자리는 사용자와 한 번 더 보면서 결정하겠습니다.

**도메인 — 아직 미정**
- 빌드 단계 6(배포 준비)에서 Cloudflare Pages 기본 도메인(<프로젝트명>.pages.dev)으로 먼저 배포합니다.
- 커스텀 도메인 연결은 나중에 결정합니다.

**이메일 수신처 — cobaltblue872@gmail.com**
- 폼 제출 이메일은 이 주소로 수신.

*궁금한 게 생기면 질문하면서 진행해주세요. 처음이라 차근차근 가고 싶습니다.*
