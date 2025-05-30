import IdentityVerification from './ko-KR/IdentityVerification';
import InviteFriends from './ko-KR/InviteFriends';
import auth from './ko-KR/auth';
import common from './ko-KR/common';
import commonConfig from './ko-KR/commonConfig';
import component from './ko-KR/component';
import depositWithdraw from './ko-KR/depositWithdraw';
import fundsTools from './ko-KR/fundsTools';
import globalHeader from './ko-KR/globalHeader';
import kv from './ko-KR/kv';
import langPackage from './ko-KR/langPackage';
import login from './ko-KR/login';
import menu from './ko-KR/menu';
import merchant from './ko-KR/merchant';
import pages from './ko-KR/pages';
import pc from './ko-KR/pc';
import pwa from './ko-KR/pwa';
import rate from './ko-KR/rate';
import settingDrawer from './ko-KR/settingDrawer';
import settings from './ko-KR/settings';
import spot from './ko-KR/spot';
import user from './ko-KR/user';
import webConfig from './ko-KR/webConfig';
import merchantSystem from './ko-KR/merchantSystem';
import language from './ko-KR/language';  
import operation from './ko-KR/operation';
import permission from './ko-KR/permission';
import riskControl from './ko-KR/riskControl';
export default {
  'navBar.lang': '언어',
  'layout.user.link.help': '도움말',
  'layout.user.link.privacy': '개인정보',
  'layout.user.link.terms': '약관',
  'app.preview.down.block': '이 페이지를 로컬 프로젝트에 다운로드하세요',
  'app.welcome.link.fetch-blocks': '모든 블록 가져오기',
  'app.welcome.link.block-list': '빠르게 표준 개발 기반의 페이지를 만들어보세요',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...common,
  ...langPackage,
  ...merchant,
  ...rate,
  ...pc,
  ...user,
  ...kv,
  ...spot,
  ...auth,
  ...login,
  ...IdentityVerification,
  ...InviteFriends,
  ...depositWithdraw,
  ...webConfig,
  ...fundsTools,
  ...commonConfig,
  ...merchantSystem,
  ...language,
  ...operation,
  ...permission,
  ...riskControl,
};
