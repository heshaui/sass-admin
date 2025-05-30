import IdentityVerification from './zh-CN/IdentityVerification';
import InviteFriends from './zh-CN/InviteFriends';
import auth from './zh-CN/auth';
import common from './zh-CN/common';
import commonConfig from './zh-CN/commonConfig';
import component from './zh-CN/component';
import depositWithdraw from './zh-CN/depositWithdraw';
import fundsTools from './zh-CN/fundsTools';
import globalHeader from './zh-CN/globalHeader';
import kv from './zh-CN/kv';
import langPackage from './zh-CN/langPackage';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import merchant from './zh-CN/merchant';
import pages from './zh-CN/pages';
import pc from './zh-CN/pc';
import pwa from './zh-CN/pwa';
import rate from './zh-CN/rate';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import spot from './zh-CN/spot';
import user from './zh-CN/user';
import webConfig from './zh-CN/webConfig';
import merchantSystem from './zh-CN/merchantSystem';
import language from './zh-CN/language';  
import operation from './zh-CN/operation';
import permission from './zh-CN/permission';


export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
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
};
