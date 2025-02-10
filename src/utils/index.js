import * as Icons from '@ant-design/icons';

const iconMapping = {
  crown: Icons.CrownOutlined,
  home: Icons.HomeOutlined,
  setting: Icons.SettingOutlined,
  user: Icons.UserOutlined,
  menu: Icons.MenuOutlined,
  dashboard: Icons.DashboardOutlined,
  key: Icons.KeyOutlined,
  smile: Icons.SmileOutlined,
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
          name: item.titleKey, // 确保 titleKey 作为 name
          icon: getIcon(item.icon), // 预处理 icon
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