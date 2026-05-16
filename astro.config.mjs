// @ts-check
import { defineConfig } from 'astro/config';

// TODO: 커스텀 도메인 연결 시 아래 값을 실제 도메인으로 교체.
//   배포 직후에는 https://<프로젝트명>.pages.dev 가 들어갑니다.
export default defineConfig({
  site: 'https://coaching-note.pages.dev',
  trailingSlash: 'ignore',
});
