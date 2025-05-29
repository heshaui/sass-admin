import auth from './en-US/auth';
import commonConfig from './en-US/commonConfig';
import component from './en-US/component';
import depositWithdraw from './en-US/depositWithdraw';
import fundsTools from './en-US/fundsTools';
import globalHeader from './en-US/globalHeader';
import kv from './en-US/kv';
import langPackage from './en-US/langPackage';
import login from './en-US/login';
import menu from './en-US/menu';
import merchant from './en-US/merchant';
import pages from './en-US/pages';
import pc from './en-US/pc';
import pwa from './en-US/pwa';
import rate from './en-US/rate';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import spot from './en-US/spot';
import user from './en-US/user';
import webConfig from './en-US/webConfig';
import common from './en-US/common';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...merchant,
  ...pc,
  ...user,
  ...kv,
  ...rate,
  ...langPackage,
  ...auth,
  ...spot,
  ...depositWithdraw,
  ...fundsTools,
  ...webConfig,
  ...commonConfig,
  ...login,
  ...common,
};
