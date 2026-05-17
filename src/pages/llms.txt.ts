import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const RECENT_LIMIT = 10;

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('posts', ({ data }) => !data.draft);

  // 최신순 정렬 (사이트 전역 정책: number desc — 같은 날짜 글 순서까지 보장)
  allPosts.sort((a, b) => b.data.number - a.data.number);

  const displayedPosts = allPosts.slice(0, RECENT_LIMIT);
  const hasMore = allPosts.length > RECENT_LIMIT;

  const postLines = displayedPosts.map(post => {
    const slug = String(post.data.number).padStart(3, '0');
    return `- [${post.data.title}](https://note.seonbiz.com/blog/${slug}): N°.${slug} · ${post.data.category}`;
  }).join('\n');

  const sectionTitle = hasMore ? `## 최근 글 (${RECENT_LIMIT}개)` : '## 모든 글';
  const moreNotice = hasMore
    ? `\n\n전체 ${allPosts.length}개 글은 [블로그 인덱스](https://note.seonbiz.com/blog)에서 확인할 수 있습니다.`
    : '';

  const content = `# 코칭 노트

> 서정옥 · 온라인 비즈니스 코치. 8년의 코칭 사고가 쌓이는 노트.

가르치지 않습니다. 그 사람의 속도로, 옆에서 같이 걷습니다.
1:1 코칭과 상세페이지·쇼핑몰·SEO 그룹 코칭을 진행합니다.

## 코치 소개

- [About](https://note.seonbiz.com/about): 서정옥 코치의 배경, 방법론, 코칭 영역

## 코칭

- [상담 신청](https://note.seonbiz.com/consult): 1:1 코칭과 그룹 코칭 안내

${sectionTitle}

${postLines}${moreNotice}

## Optional

- [블로그 전체 목록](https://note.seonbiz.com/blog): 블로그 인덱스
- [세온코더](https://seoncoder.shop): 코칭에서 이어진 도구 (외부 사이트)
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
