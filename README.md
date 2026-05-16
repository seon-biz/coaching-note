# 코칭 노트

서정옥 · 온라인 비즈니스 코치의 노트형 블로그.
Astro · TypeScript · CSS만 사용, 본문에 이미지 없이 텍스트·여백·컬러로만 위계를 만든다.

---

## 새 글 발행하기

새 글은 `src/content/posts/` 폴더에 마크다운 파일 한 장으로 추가합니다.
`014-새-글-제목.md` 같이 **번호-제목** 형식으로 파일명을 짓고 아래 두 단계를 따르면, 디자인은 자동으로 입혀집니다.

### 1단계 — Frontmatter 작성

파일 맨 위에 메타데이터를 YAML로 적습니다.

```markdown
---
title: "글 제목"
number: 14
category: "도구"
date: 2026-05-20
readingTime: "8분"
excerpt: |
  메인 페이지와 글 목록에 노출되는 발췌. 3~4줄 분량.
thumbnail:
  pattern: keyword
  keyword: "도구"
---
```

`number`는 글 번호(정수). URL은 자동으로 `/blog/014` 형식이 됩니다.
`date`는 `YYYY-MM-DD` 형식. 메인 페이지에 가장 최근 글이 큰 자리로 들어갑니다.

#### 썸네일 패턴 5종 — 하나만 선택

**A. Keyword** — 큰 한글 키워드, Forest Green 배경
```yaml
thumbnail:
  pattern: keyword
  keyword: "전환"      # 1~4자
```

**B. Fragment** — 구절, Paper-2 배경
```yaml
thumbnail:
  pattern: fragment
  fragment: "위임이 어려운\n진짜 이유는,"   # \n으로 줄바꿈
  highlight: "이유"                       # 선택, Terra 컬러로 강조
```

**C. Numeral** — 큰 숫자, Paper 배경
```yaml
thumbnail:
  pattern: numeral
  number: "7"
  unit: "년"                              # 선택
  quote: "내가 나를 부정하게 된 거였다."    # 선택
```

**D. Question** — 인용 따옴표, Forest Green 배경
```yaml
thumbnail:
  pattern: question
  question: "결정하는 게 외로워서요."
  attribution: "어느 대표가, 세션 중에"   # 선택
```

**E. List** — 3분할 목록, Paper-2 배경
```yaml
thumbnail:
  pattern: list
  items: ["일정", "고객", "가격"]    # 정확히 3개
  highlight: 1                       # 0·1·2 중 강조 인덱스 (선택)
  footer: "위임되지 않는 세 가지 일 —→"  # 선택
```

### 2단계 — 본문 작성

`---` 아래에 마크다운으로 본문을 작성하면 다음 스타일이 자동 적용됩니다.

- **단락**: 빈 줄로 구분 (17px / line-height 1.85)
- **따옴표**: `"..."` → `"..."` (curly quote) 자동 변환
- **한글 줄바꿈**: 단어 중간에서 끊기지 않음 (`word-break: keep-all`)

#### 본문에서 쓸 수 있는 디자인 요소

| 마크업 | 효과 | 쓰는 자리 |
|---|---|---|
| `<em class="hi">구문</em>` | Terra 1.5px 언더라인 | 글의 핵심 발언, 결정 문장 (1~2개) |
| `<em class="hi-soft">구문</em>` | Terra 컬러만 | 부드러운 강조 (1개 정도) |
| `<hr class="beat" />` | 폭 48px / 2px 짧은 Terra 가로선 | 단락 흐름이 크게 전환되는 자리 (2~4개) |
| `> 한 문장` | Forest Green 컬러 단락 (blockquote) | 글의 핵심 통찰을 한 줄로 분리 (1개) |

> 이 네 가지가 코칭 노트 본문의 표준 디자인 요소입니다.
> 한 글에 너무 많이 넣지 말고 절제하는 게 톤에 맞습니다.

#### 본문 예시

```markdown
첫 단락. 사건의 시작이나 발단.

두 번째 단락. 코칭 자리의 풍경이나 대화.
누군가 이런 말을 했어요. <em class="hi">"이건 제가 할 수 있는 게 아닌 것 같아요."</em>

<hr class="beat" />

회상의 시작. 다른 시기로 흐름이 옮겨가는 자리.

여러 단락들...

거기서 깨달았다. <em class="hi-soft">친절함이 벽의 높이를 낮췄다</em>.

<hr class="beat" />

결심으로 돌아오는 마무리 단락.

> 한 줄로 결정 문장.
```

#### 소제목 (현재 사용하지 않음)

`## 소제목` / `### 작은 소제목`을 쓰면 H2/H3 스타일이 적용됩니다.
다만 코칭 노트는 단락 흐름과 `<hr class="beat" />`로만 전개하는 톤이라 소제목은 권장하지 않습니다.

---

## 발행 흐름

1. `src/content/posts/` 폴더에 새 `.md` 파일 추가
2. Frontmatter + 본문 작성
3. `git add` + `git commit` + `git push`
4. Cloudflare Pages가 자동으로 빌드해 1~2분 내 라이브 반영

---

## 로컬에서 미리 보기

```bash
npm run dev
```

브라우저에서 `http://localhost:4321` (또는 4322) 열기.
빌드만 확인하려면 `npm run build`.

---

## 디자인 시스템 요약

| 위치 | 폰트 사이즈 / 굵기 | 비고 |
|---|---|---|
| H1 (제목) | 38px / 700 | letter-spacing -0.024em, line-height 1.3 |
| 날짜 | 15px / 400 | Mute 컬러 |
| H2 (소제목) | 26px / 600 | 단락 위 64px 여백 |
| H3 | 20px / 600 | 단락 위 48px 여백 |
| 본문 | 17px / 400 | line-height 1.85 |
| 블록쿼트 | 17px / 400 | Forest Green 컬러 |
| em.hi | 17px / 400 | Terra 1.5px 언더라인 |
| em.hi-soft | 17px / 400 | Terra 컬러만 |

브랜드 컬러·폰트 토큰: [src/styles/tokens.css](src/styles/tokens.css)
글 상세 페이지 스타일: [src/pages/blog/[slug].astro](src/pages/blog/[slug].astro)
컨텐츠 스키마: [src/content.config.ts](src/content.config.ts)
