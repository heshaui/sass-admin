import component from './ko-KR/component';
import globalHeader from './ko-KR/globalHeader';
import menu from './ko-KR/menu';
import pages from './ko-KR/pages';
import pwa from './ko-KR/pwa';
import settingDrawer from './ko-KR/settingDrawer';
import settings from './ko-KR/settings';

export default {
  'navBar.lang': '언어',
  'layout.user.link.help': '도움말',
  'layout.user.link.privacy': '개인정보',
  'layout.user.link.terms': '약관',
  'app.preview.down.block': '이 페이지를 로컬 프로젝트에 다운로드하세요',
  'app.welcome.link.fetch-blocks': '모든 블록 가져오기',
  'app.welcome.link.block-list': '빠르게 표준 개발 기반의 페이지를 만들어보세요',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
