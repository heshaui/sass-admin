import * as Icons from '@ant-design/icons';
import { formatMessage } from '@umijs/max';
const iconMapping = {
  crown: Icons.CrownOutlined,
  home: Icons.HomeOutlined,
  setting: Icons.SettingOutlined,
  user: Icons.UserOutlined,
  menu: Icons.MenuOutlined,
  dashboard: Icons.DashboardOutlined,
  key: Icons.KeyOutlined,
  smile: Icons.SmileOutlined,
  TeamOutlined:Icons.TeamOutlined,
  IdcardOutlined:Icons.IdcardOutlined,
  GlobalOutlined:Icons.GlobalOutlined,
  SettingOutlined:Icons.SettingOutlined,
  StockOutlined:Icons.StockOutlined,
  MoneyCollectOutlined:Icons.MoneyCollectOutlined,
  UserOutlined:Icons.UserOutlined,
  SafetyOutlined:Icons.SafetyOutlined,
  DollarOutlined:Icons.DollarOutlined,
};

const getIcon = (iconName) => {
  if (!iconName || !iconMapping[iconName]) return null;
  const IconComponent = iconMapping[iconName];
  return <IconComponent />;
};

export const generateMenuTree = (menuList) => {
    const menuMap = new Map();
    const result = [];
  
    menuList.forEach((item) => {
      if (item.type === 1) {
        menuMap.set(item.id, {
          ...item,
          name: item.titleKey,
          icon: getIcon(item.icon),
          hideInMenu: item.titleKey === 'background' ? true : item.hideInMenu, // 当 titleKey 为 background 时设置 hideInMenu 为 true
          children: [],
        });
      }
    });
  
    menuList.forEach((item) => {
      if (item.type === 1 && item.parentId) {
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children.push(menuMap.get(item.id));
        }
      } else if (item.type === 1 && !item.parentId) {
        result.push(menuMap.get(item.id));
      }
    });
  
    return result;
  };


  // ✅ 将后端返回的权限列表转换成 `antd` 的 `Tree` 组件可识别的格式
  export const generateTreeData = (permissions, intl) => {
    const map = new Map();
    const tree = [];
  console.log("permissions", permissions);
    permissions.forEach((perm) => {
      map.set(perm.id, { ...perm, key: perm.id, title: intl ? intl.formatMessage({ id: `permission.${perm.titleKey}` }) : perm.titleKey, children: [] });
    });
  
    permissions.forEach((perm) => {
      if (perm.parentId && map.has(perm.parentId)) {
        map.get(perm.parentId).children.push(map.get(perm.id));
      } else {
        tree.push(map.get(perm.id));
      }
    });
  
    return tree;
  };


  export const merchantTreeData = (permissions, intl) => {
    console.log("permissions", permissions);
    const map = new Map();
    const tree = [];
  
    permissions.forEach((perm) => {
      map.set(perm.authorityId, { ...perm, key: perm.authorityId, title: intl ? intl.formatMessage({ id: `permission.${perm.titleKey}` }) : perm.titleKey, children: [] });
    });
  
    permissions.forEach((perm) => {
      if (perm.parentId && map.has(perm.parentId)) {
        map.get(perm.parentId).children.push(map.get(perm.authorityId));
      } else {
        tree.push(map.get(perm.authorityId));
      }
    });
    console.log("tree", tree);
    return tree;
  };


  export const clearAllCookies = () => {
         // 清除本地缓存
         localStorage.clear();
         // 清除所有cookies
         const cookies = document.cookie.split(';');
         for (let i = 0; i < cookies.length; i++) {
           const cookie = cookies[i];
           const eqPos = cookie.indexOf('=');
           const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
           document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
         }
  }