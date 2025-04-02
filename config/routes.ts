/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },

  {
    path: '/authAdmin',
    name: 'authAdmin',
    icon: 'crown',
    routes: [
      {
        path: '/authAdmin/role',
        name: 'role',
        component: './AuthAdmin/RoleAdmin',
      },
      {
        path: '/authAdmin/userAdmin',
        name: 'userAdmin',
        component: './AuthAdmin/UserAdmin',
      },
      {
        path: '/authAdmin/permissionAdmin',
        name: 'permission',
        component: './AuthAdmin/PermissionAdmin',
      },
    ],
  },

  {
    path: '/merchant',
    name: 'merchant',
    icon: 'crown',
    routes: [
      {
        path: '/merchant/free',
        name: 'free',
        component: './Merchant/Free',
      },
      {
        path: '/merchant/charge',
        name: 'charge',
        component: './Merchant/Charge',
      },
      {
        path: '/merchant/root',
        name: 'root',
        component: './Merchant/Root',
      },
      {
        path: '/merchant/allocation',
        name: 'allocation',
        component: './Merchant/Allocation',
      },
      {
        path: '/merchant/account',
        name: 'account',
        component: './Merchant/Account',
      },
    ],
  },
  {
    path: '/webConfig',
    name: 'webConfig',
    icon: 'crown',
    routes: [
      {
        path: '/webConfig/header',
        name: 'header',
        component: './WebConfig/Header',
      },
      {
        path: '/webConfig/footer',
        name: 'footer',
        component: './WebConfig/Footer',
      },
      {
        path: '/webConfig/logo',
        name: 'logo',
        component: './WebConfig/Logo',
      },
      {
        path: '/webConfig/style',
        name: 'style',
        component: './WebConfig/WebStyle',
      },
      {
        path: '/webConfig/background',
        name: 'background',
        component: './WebConfig/Background',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/common-config',
    name: 'commonConfig',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/common-config/kv-setting',
        name: 'kvSetting',
        component: './KvSetting',
      },
      {
        path: '/common-config/basic',
        name: 'basic',
        component: './CommonConfig/Basic',
      },
      {
        path: '/common-config',
        redirect: '/common-config/kv-setting',
      },
    ],
  },
  {
    path: '/operation',
    name: 'operation',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/operation/pc-login',
        name: 'pcLogin',
        component: './Operation/PCLogin',
      },
      {
        path: '/operation/media',
        name: 'media',
        component: './Operation/Media',
      },
      {
        path: '/operation/announcement',
        name: 'announcement',
        component: './Operation/Announcement',
      },
      {
        path: '/operation/help-center',
        name: 'helpCenter',
        component: './Operation/HelpCenter',
      },
      {
        path: '/operation/famous-quotes',
        name: 'famousQuotes',
        component: './Operation/FamousQuotes',
      },
      {
        path: '/operation/pc-images',
        name: 'pcImages',
        component: './Operation/PCImages',
      },
      {
        path: '/operation',
        redirect: '/operation/pc-login',
      },
    ],
  },
  {
    path: '/lang-package',
    name: 'langPackage',
    icon: 'GlobalOutlined',
    routes: [
      {
        path: '/lang-package/language',
        name: 'language',
        component: './LangPackage/Language',
      },
      {
        path: '/lang-package/package',
        name: 'package',
        component: './LangPackage/Package',
      },
      {
        path: '/lang-package',
        redirect: '/lang-package/language',
      },
    ],
  },
  {
    path: '/identity-verification',
    name: 'identityVerification',
    icon: 'IdcardOutlined',
    routes: [
      {
        path: '/identity-verification/basic-config',
        name: 'basicConfig',
        component: './IdentityVerification/BasicConfig',
      },
      {
        path: '/identity-verification/audit-list',
        name: 'auditList',
        component: './IdentityVerification/AuditList',
      },
      {
        path: '/identity-verification',
        redirect: '/identity-verification/basic-config',
      },
    ],
  },
  {
    path: '/user-management',
    name: 'userManagement',
    icon: 'UserOutlined',
    routes: [
      {
        path: '/user-management/user-list',
        name: 'userList',
        component: './UserManagement/UserList',
      },
      {
        path: '/user-management',
        redirect: '/user-management/user-list',
      },
    ],
    // component: './UserManagement',
  },
  {
    path: '/merchantSystem',
    name: 'merchantSystem',
    icon: 'user',
    routes: [
      {
        path: '/merchantSystem/UserAdmin',
        name: 'userAdmin',
        component: './MerchantSystem/UserAdmin',
      },
      {
        path: '/merchantSystem/role',
        name: 'roleAdmin',
        component: './MerchantSystem/RoleAdmin',
      },
      {
        path: '/merchantSystem/PermissionAdmin',
        name: 'permissionAdmin',
        component: './MerchantSystem/PermissionAdmin',
      },
      {
        path: '/merchantSystem',
        redirect: '/merchantSystem/UserAdmin',
      },
    ],
    // component: './UserManagement',
  },
  {
    path: '/invite-friends',
    name: 'inviteFriends',
    icon: 'TeamOutlined',
    routes: [
      {
        path: '/invite-friends/basic-config',
        name: 'basicConfig',
        component: './InviteFriends/BascConfig',
      },
      {
        path: '/invite-friends/invite-records',
        name: 'inviteRecords',
        component: './InviteFriends/InviteRecords',
      },
      {
        path: '/invite-friends/reward-records',
        name: 'rewardRecords',
        component: './InviteFriends/RewardRecords',
      },
      {
        path: '/invite-friends',
        redirect: '/invite-friends/basic-config',
      },
    ],
  },
  {
    path: '/deposit-withdraw',
    name: 'depositWithdraw',
    icon: 'MoneyCollectOutlined',
    routes: [
      {
        path: '/deposit-withdraw/deposit-manage',
        name: 'depositManage',
        component: './DepositWithdraw/DepositManage',
      },
      {
        path: '/deposit-withdraw/withdraw-manage',
        name: 'withdrawManage',
        component: './DepositWithdraw/WithdrawManage',
      },
      {
        path: '/deposit-withdraw',
        redirect: '/deposit-withdraw/deposit-manage',
      },
    ],
  },
  {
    path: '/funds-tools',
    name: 'fundsTools',
    icon: 'DollarOutlined',
    routes: [
      {
        path: '/funds-tools/asset-adjustment',
        name: 'assetAdjustment',
        component: './FundsTools/AssetAdjustment',
      },
      {
        path: '/funds-tools/transfer-tool',
        name: 'transferTool',
        component: './FundsTools/TransferTool',
      },
      {
        path: '/funds-tools/transfer-records',
        name: 'transferRecords',
        component: './FundsTools/TransferRecords',
      },
      {
        path: '/funds-tools',
        redirect: '/funds-tools/asset-adjustment',
      },
    ],
  },
  {
    path: '/spot-trading',
    name: 'spotTrading',
    icon: 'StockOutlined',
    routes: [
      {
        path: '/spot-trading/currency-management',
        name: 'currencyManagement',
        icon: 'DollarOutlined',
        component: './SpotTrading/CurrencyManagement',
      },
      {
        path: '/spot-trading/currency-protocol',
        name: 'currencyProtocol',
        component: './SpotTrading/CurrencyProtocol',
      },
      {
        path: '/spot-trading/trading-pair-management',
        name: 'tradingPairManagement',
        component: './SpotTrading/TradingPairManagement',
      },
      {
        path: '/spot-trading',
        redirect: '/spot-trading/currency-management',
      },
    ],
  },
  {
    path: '/risk-control',
    name: 'riskControl',
    icon: 'SafetyOutlined',
    routes: [
      {
        path: '/risk-control/config',
        name: 'config',
        component: './RiskControl/Config',
      },
      {
        path: '/risk-control/suggestions',
        name: 'suggestions',
        component: './RiskControl/Suggestions',
      },
      {
        path: '/risk-control/alerts',
        name: 'alerts',
        component: './RiskControl/Alerts',
      },
      {
        path: '/risk-control',
        redirect: '/risk-control/config',
      },
    ],
  },
  {
    path: '/kvSetting',
    name: 'kvSetting',
    icon: 'smile',
    component: './KvSetting',
  },
  {
    path: '/language',
    name: 'language',
    icon: 'smile',
    component: './Language',
  },
  {
    path: '/rate',
    name: 'rate',
    icon: 'smile',
    component: './Rate',
  },
  {
    path: '/pc',
    name: 'pc',
    component: './PC/Index',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
