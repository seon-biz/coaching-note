import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1200;
const HEIGHT = 630;

const COLOR = {
  paper: '#f5f1ea',
  paper2: '#ece7da',
  ink: '#1c2520',
  green: '#2a3d2e',
  terra: '#c4633b',
  terraSoft: '#d98f6a',
  mute: 'rgba(28, 37, 32, 0.55)',
  paperMute: 'rgba(245, 241, 234, 0.55)',
  rule: 'rgba(28, 37, 32, 0.16)',
} as const;

const FONT_URLS = {
  regular:
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Regular.otf',
  bold:
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf',
} as const;

let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null = null;
function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      const [regular, bold] = await Promise.all([
        fetch(FONT_URLS.regular).then((r) => r.arrayBuffer()),
        fetch(FONT_URLS.bold).then((r) => r.arrayBuffer()),
      ]);
      return { regular, bold };
    })();
  }
  return fontsPromise;
}

type Node = { type: string; props: Record<string, unknown> };
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: Node | Node[] | string | (Node | string)[],
): Node => ({ type, props: { style, children } });

const label = (n: number, category: string) =>
  `POST.${String(n).padStart(3, '0')} · ${category}`;

function frame(
  topLabel: string,
  body: Node,
  bottomBrand: string,
  bottomTitle: string,
  opts: { bg: string; labelColor: string; brandColor: string; titleColor: string },
): Node {
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      backgroundColor: opts.bg,
      fontFamily: 'Pretendard',
    },
    [
      el(
        'div',
        {
          display: 'flex',
          fontSize: 22,
          letterSpacing: '0.28em',
          color: opts.labelColor,
          textTransform: 'uppercase',
          fontWeight: 700,
        },
        topLabel,
      ),
      body,
      el(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        },
        [
          el(
            'div',
            {
              display: 'flex',
              fontSize: 22,
              color: opts.titleColor,
              fontWeight: 600,
              maxWidth: '95%',
              lineHeight: 1.4,
            },
            bottomTitle,
          ),
          el(
            'div',
            {
              display: 'flex',
              fontSize: 18,
              letterSpacing: '0.24em',
              color: opts.brandColor,
              textTransform: 'uppercase',
              fontWeight: 400,
            },
            bottomBrand,
          ),
        ],
      ),
    ],
  );
}

const BRAND = '코칭 노트 · NOTE.SEONBIZ.COM';

function keywordTemplate(post: any): Node {
  const body = el(
    'div',
    {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 32,
    },
    el(
      'div',
      {
        display: 'flex',
        fontSize: 320,
        fontWeight: 700,
        color: COLOR.paper,
        letterSpacing: '-0.04em',
        lineHeight: 1,
      },
      post.data.thumbnail.keyword,
    ),
  );
  return frame(label(post.data.number, post.data.category), body, BRAND, post.data.title, {
    bg: COLOR.green,
    labelColor: COLOR.terraSoft,
    brandColor: COLOR.terraSoft,
    titleColor: COLOR.paper,
  });
}

function splitHighlight(text: string, highlight?: string): Node[] {
  if (!highlight || !text.includes(highlight)) {
    return [el('span', { display: 'flex', whiteSpace: 'pre' }, text)];
  }
  const parts = text.split(highlight);
  const out: Node[] = [];
  parts.forEach((part, i) => {
    if (part) out.push(el('span', { display: 'flex', whiteSpace: 'pre' }, part));
    if (i < parts.length - 1) {
      out.push(
        el(
          'span',
          {
            display: 'flex',
            whiteSpace: 'pre',
            color: COLOR.terra,
            fontWeight: 700,
          },
          highlight,
        ),
      );
    }
  });
  return out;
}

function fragmentTemplate(post: any): Node {
  const { fragment, highlight } = post.data.thumbnail;
  const lines = String(fragment).split('\n').filter((l: string) => l.trim().length > 0);
  const body = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      gap: 18,
      paddingTop: 24,
    },
    lines.map((line: string) =>
      el(
        'div',
        {
          display: 'flex',
          flexWrap: 'wrap',
          fontSize: 80,
          fontWeight: 700,
          color: COLOR.ink,
          letterSpacing: '-0.024em',
          lineHeight: 1.2,
        },
        splitHighlight(line, highlight),
      ),
    ),
  );
  return frame(label(post.data.number, post.data.category), body, BRAND, post.data.title, {
    bg: COLOR.paper,
    labelColor: COLOR.terra,
    brandColor: COLOR.mute,
    titleColor: COLOR.ink,
  });
}

function numeralTemplate(post: any): Node {
  const { number: num, unit, quote } = post.data.thumbnail;
  const body = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      gap: 36,
      paddingTop: 24,
    },
    [
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        },
        [
          el(
            'div',
            {
              display: 'flex',
              fontSize: 260,
              fontWeight: 700,
              color: COLOR.terra,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
            },
            String(num),
          ),
          ...(unit
            ? [
                el(
                  'div',
                  {
                    display: 'flex',
                    fontSize: 72,
                    fontWeight: 500,
                    color: COLOR.ink,
                    letterSpacing: '-0.02em',
                  },
                  unit,
                ),
              ]
            : []),
        ],
      ),
      ...(quote
        ? [
            el(
              'div',
              {
                display: 'flex',
                fontSize: 34,
                color: COLOR.ink,
                fontWeight: 500,
                fontStyle: 'italic',
                maxWidth: 1000,
                lineHeight: 1.4,
              },
              `“${quote}”`,
            ),
          ]
        : []),
    ],
  );
  return frame(label(post.data.number, post.data.category), body, BRAND, post.data.title, {
    bg: COLOR.paper,
    labelColor: COLOR.terra,
    brandColor: COLOR.mute,
    titleColor: COLOR.ink,
  });
}

function questionTemplate(post: any): Node {
  const { question, attribution } = post.data.thumbnail;
  const body = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      gap: 32,
      paddingTop: 24,
    },
    [
      el(
        'div',
        {
          display: 'flex',
          fontSize: 28,
          color: COLOR.terra,
          fontWeight: 700,
          letterSpacing: '0.2em',
        },
        '"',
      ),
      el(
        'div',
        {
          display: 'flex',
          fontSize: question.length > 14 ? 60 : 88,
          fontWeight: 700,
          color: COLOR.ink,
          letterSpacing: '-0.022em',
          lineHeight: 1.3,
          maxWidth: 1040,
        },
        question,
      ),
      ...(attribution
        ? [
            el(
              'div',
              {
                display: 'flex',
                fontSize: 26,
                color: COLOR.mute,
                fontWeight: 400,
                letterSpacing: '-0.01em',
              },
              `— ${attribution}`,
            ),
          ]
        : []),
    ],
  );
  return frame(label(post.data.number, post.data.category), body, BRAND, post.data.title, {
    bg: COLOR.paper,
    labelColor: COLOR.terra,
    brandColor: COLOR.mute,
    titleColor: COLOR.ink,
  });
}

function listTemplate(post: any): Node {
  const { items, highlight, footer } = post.data.thumbnail;
  const body = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      gap: 18,
      paddingTop: 24,
    },
    [
      ...items.map((item: string, i: number) =>
        el(
          'div',
          {
            display: 'flex',
            alignItems: 'baseline',
            gap: 24,
          },
          [
            el(
              'div',
              {
                display: 'flex',
                fontSize: 28,
                color: i === highlight ? COLOR.terra : COLOR.mute,
                fontWeight: 700,
                letterSpacing: '0.16em',
                width: 60,
              },
              String(i + 1).padStart(2, '0'),
            ),
            el(
              'div',
              {
                display: 'flex',
                fontSize: 64,
                fontWeight: 700,
                color: i === highlight ? COLOR.terra : COLOR.ink,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                maxWidth: 980,
              },
              item,
            ),
          ],
        ),
      ),
      ...(footer
        ? [
            el(
              'div',
              {
                display: 'flex',
                fontSize: 24,
                color: COLOR.mute,
                marginTop: 16,
              },
              footer,
            ),
          ]
        : []),
    ],
  );
  return frame(label(post.data.number, post.data.category), body, BRAND, post.data.title, {
    bg: COLOR.paper,
    labelColor: COLOR.terra,
    brandColor: COLOR.mute,
    titleColor: COLOR.ink,
  });
}

function render(post: any): Node {
  switch (post.data.thumbnail.pattern) {
    case 'keyword':
      return keywordTemplate(post);
    case 'fragment':
      return fragmentTemplate(post);
    case 'numeral':
      return numeralTemplate(post);
    case 'question':
      return questionTemplate(post);
    case 'list':
      return listTemplate(post);
  }
  return keywordTemplate(post);
}

export const getStaticPaths = (async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: String(post.data.number).padStart(3, '0') },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const fonts = await loadFonts();
  const tree = render((props as { post: any }).post);
  const svg = await satori(tree as any, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Pretendard', data: fonts.regular, weight: 400, style: 'normal' },
      { name: 'Pretendard', data: fonts.bold, weight: 700, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
    .render()
    .asPng();
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
