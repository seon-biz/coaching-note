# 코칭 노트 — 핸드오프 패키지

Claude Code로 작업하기 위한 모든 자료가 이 폴더에 있습니다.

## 📦 폴더 구조

```
handoff/
├── README.md                        # 이 파일
├── CLAUDE_CODE_PROMPT.md            # ⭐ Claude Code에 통째로 붙여 넣을 프롬프트
├── 코칭 노트 - 브랜드 핸드오프.md   # 컬러/타입/마크/락업 전체 문서
├── mockups/
│   ├── 01-home.html                 # 메인 페이지 시안
│   ├── 02-article.html              # 글 상세 페이지 시안
│   └── 03-consult.html              # 상담신청 페이지 시안
├── mark.svg                         # 마크 (Terra)
├── mark-cream.svg                   # 마크 (Cream — 다크 배경용)
├── mark-ink.svg                     # 마크 (Ink — 단색)
├── favicon.svg                      # 파비콘 (라이트)
└── favicon-dark.svg                 # 파비콘 (다크)
```

## 🚀 시작하기 (3단계)

### 1. 폴더 다운로드
이 `handoff` 폴더 전체를 컴퓨터에 저장하세요. 폴더 어디에 두든 상관없습니다.

### 2. Claude Code 열기
- 터미널에서 작업할 디렉토리를 만든 후
  ```bash
  mkdir coaching-note
  cd coaching-note
  ```
- 이 `handoff/` 폴더를 그 안에 그대로 복사해 넣으세요.
- 그 디렉토리에서 Claude Code를 실행하세요.

### 3. 프롬프트 붙여 넣기
- `CLAUDE_CODE_PROMPT.md` 파일을 열어 **전체 내용을 복사**
- Claude Code 채팅창에 **첫 메시지로 통째로 붙여 넣기**

Claude Code가 핸드오프 폴더의 mockup 파일들을 직접 읽으면서 작업을 시작합니다.

## 🌐 GitHub + Cloudflare Pages 배포

상세 가이드는 `CLAUDE_CODE_PROMPT.md` 마지막 부분에 있습니다. 요약:

1. Claude Code가 사이트를 만들면 `.git`이 자동 초기화됩니다.
2. GitHub.com에서 새 레포 생성 → 로컬에서 `git remote add` + `git push`
3. https://dash.cloudflare.com → Pages → Connect to Git → GitHub 레포 선택
4. Framework: **Astro**, Build command: `npm run build`, Output: `dist`
5. Deploy. 자동으로 `<프로젝트명>.pages.dev` 주소 부여.

이후로는 글을 쓸 때마다:
1. `src/content/posts/`에 `.md` 파일 추가
2. `git push`
3. 1~2분 후 사이트에 반영

## ❓ 처음이라 막힐 때

Claude Code에 그대로 물어보세요:
- "GitHub 레포 만들고 첫 푸시하는 법 알려줘"
- "Cloudflare Pages 연결 단계별로 설명해줘"
- "이 글을 추가하고 싶어. 제목은 ◯◯, 패턴은 keyword, 본문은: ..."

처음에는 천천히, 한 단계씩 가도 됩니다.

---

*디자인 시안 v1.0 · 2026.05*
