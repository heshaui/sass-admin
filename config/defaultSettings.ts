import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#FF5F1F',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'IMBIT',
  pwa: true,
  logo: 'https://meta2025.oss-ap-northeast-2.aliyuncs.com/2025/05/21/19f97328-dada-444a-9f0c-5df7889328a3.png',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    header: {
      colorBgHeader: '#000000',
      colorHeaderTitle: '#fff',
      colorTextMenu: '#fff',
      colorTextMenuSelected: '#fff',
      colorTextMenuActive: '#fff',
      colorBgMenuItemSelected: '#1f1f1f',
      colorBgMenuItemHover: '#1f1f1f',
      colorTextMenuSecondary: '#fff',
      colorTextRightActionsItem: '#fff',
      colorBgRightActionsItemHover: '#1f1f1f',
    },
  },
  "splitMenus": false,
  "footerRender": false
};

export default Settings;
