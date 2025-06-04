import { AvatarDropdown, AvatarName, Question, SelectLang } from '@/components';
import {
  currentUser as queryCurrentUser,
  merchantCurrentUser as queryCurrentUserMecharnt,
} from '@/services/ant-design-pro/api';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { generateMenuTree } from '@/utils/index';
import { fetchLogoUrl } from '@/utils/logoUtils';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
const isMerchant = process.env.UMI_APP_MERCHANT_FLAG === '1';
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {

  
  // Fetch logo from API
  const logoUrl = await fetchLogoUrl();

  const settingsWithLogo = {
    ...defaultSettings,
    logo: logoUrl || undefined,  // Use undefined instead of empty string to prevent 'logo' text from showing
  };
  
  const fetchUserInfo = async () => {
    try {
      let msg: any;
      if (isAdmin) {
        msg = await queryCurrentUser({
          skipErrorHandler: true,
        });
      } else if (isMerchant) {
        msg = await queryCurrentUserMecharnt({
          skipErrorHandler: true,
        });
      }
      let menuTree;
      if (isAdmin) {
        menuTree = generateMenuTree(msg.data.tenantAuthorityList);
      } else {
        menuTree = generateMenuTree(msg.data.tenantPermissionsRespList);
      }

      localStorage.setItem('menuTree', JSON.stringify(menuTree));
      console.log('msg', menuTree);
      return { ...msg.data, menuTree };
      // return { ...msg.data };
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: settingsWithLogo as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: settingsWithLogo as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  console.log('initialState', initialState);
  
  // Update title with tenantName if available
  
    if(isAdmin && initialState?.settings) {
      initialState.settings.title = 'IMSaaS'
    }else if(initialState?.settings && initialState?.currentUser) {
      initialState.settings.title = initialState.currentUser.tenantName;
    }

  
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src:
        initialState?.currentUser?.avatar ||
        'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.employeeResp?.nickname,
    },

    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },

    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态

    menuDataRender: () => initialState?.currentUser?.menuTree || [],
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
