interface Env {
  RESEND_API_KEY: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

interface IncomingBody {
  name?: unknown;
  contact?: unknown;
  coaching?: unknown;
  business?: unknown;
  message?: unknown;
}

const RECIPIENT = 'cobaltblue872@gmail.com';
const FROM = '"코칭노트 상담신청" <contact@note.seonbiz.com>';

const json = (status: number, data: unknown): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const escapeHtml = (str: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (c) => map[c] ?? c);
};

const isEmail = (str: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

const readString = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export const onRequestPost = async ({ request, env }: EventContext): Promise<Response> => {
  let raw: IncomingBody;
  try {
    raw = (await request.json()) as IncomingBody;
  } catch {
    return json(400, { ok: false, error: 'validation' });
  }

  const name = readString(raw.name);
  const contact = readString(raw.contact);
  const coaching = readString(raw.coaching);
  const business = readString(raw.business);
  const message = readString(raw.message);

  if (!name || !contact || !coaching || !message) {
    return json(400, { ok: false, error: 'validation' });
  }
  if (
    name.length > 50 ||
    contact.length > 100 ||
    coaching.length > 50 ||
    business.length > 100 ||
    message.length > 2000
  ) {
    return json(400, { ok: false, error: 'validation' });
  }

  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: 'send_failed' });
  }

  const html = [
    '<h2>새 상담신청이 접수되었습니다</h2>',
    '<table>',
    `  <tr><td><strong>이름</strong></td><td>${escapeHtml(name)}</td></tr>`,
    `  <tr><td><strong>연락처</strong></td><td>${escapeHtml(contact)}</td></tr>`,
    `  <tr><td><strong>관심 코칭</strong></td><td>${escapeHtml(coaching)}</td></tr>`,
    `  <tr><td><strong>사업체명</strong></td><td>${business ? escapeHtml(business) : '미입력'}</td></tr>`,
    '</table>',
    '<h3>문의 내용</h3>',
    `<p style="white-space: pre-wrap;">${escapeHtml(message)}</p>`,
    '<hr>',
    '<p style="color: #888; font-size: 12px;">note.seonbiz.com 상담신청 폼에서 발송됨</p>',
  ].join('\n');

  const payload: Record<string, unknown> = {
    from: FROM,
    to: RECIPIENT,
    subject: `[코칭노트] 새 상담신청 - ${name}`,
    html,
  };
  if (isEmail(contact)) {
    payload.reply_to = contact;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return json(500, { ok: false, error: 'send_failed' });
    }
    return json(200, { ok: true });
  } catch {
    return json(500, { ok: false, error: 'send_failed' });
  }
};
