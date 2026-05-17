export const formatPostNumber = (n: number): string =>
  `N°.${String(n).padStart(3, '0')}`;

export const formatPostLabel = (n: number, category: string): string =>
  `${formatPostNumber(n)} · ${category}`;

export const formatKoreanDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}년 ${m}월 ${d}일`;
};

export const formatNumericDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

export const formatISODate = (date: Date): string =>
  date.toISOString().split('T')[0];
