import { outLogin } from '@/services/ant-design-pro/api';
import { bindGoogleKey } from '@/services/ant-design-pro/authAdmin';
import { LogoutOutlined, SafetyOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import BindGoogleModal from './BindGoogleModal';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return <span className="anticon">{currentUser?.employeeResp?.nickname}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      color: 'rgba(0, 0, 0, 0)',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const [bindGoogleModalVisible, setBindGoogleModalVisible] = useState(false);
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const intl = useIntl();
  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    localStorage.clear();
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  // 处理绑定谷歌验证码
  const handleBindGoogle = () => {
    setBindGoogleModalVisible(true);
  };

  // 关闭绑定谷歌验证码弹窗
  const handleCloseBindGoogleModal = () => {
    setBindGoogleModalVisible(false);
  };

  // 提交绑定谷歌验证码
  const handleSubmitBindGoogle = async (values: { googleCode: string; secretKey: string }) => {
    try {
      const res = await bindGoogleKey({
        googleCode: values.googleCode,
        secret: values.secretKey,
        id: initialState?.currentUser?.employeeResp?.id,
      });
      if (res.code === '0') {
        message.success(
          intl.formatMessage({ id: 'bindGoogleModal.message.bindSuccess' }) || '绑定成功',
        );
        setBindGoogleModalVisible(false);
        // 更新用户信息中的谷歌验证状态
        setInitialState((s) => ({
          ...s,
          currentUser: {
            ...s?.currentUser,
            employeeResp: {
              ...s?.currentUser?.employeeResp,
              googleAuthenticatorEnabled: true,
            },
          },
        }));
      } else {
        message.error(
          res.message ||
            intl.formatMessage({ id: 'bindGoogleModal.message.bindFailed' }) ||
            '绑定失败',
        );
      }
    } catch (error) {
      console.error('绑定谷歌验证码失败:', error);
      message.error(intl.formatMessage({ id: 'bindGoogleModal.message.bindFailed' }) || '绑定失败');
    }
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      if (key === 'bindGoogle') {
        handleBindGoogle();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser?.employeeResp?.nickname) {
    return loading;
  }

  // 检查用户是否已绑定谷歌验证
  const isGoogleAuthEnabled = initialState?.currentUser?.employeeResp?.googleAuthenticatorEnabled;

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    // 如果未绑定谷歌验证，显示绑定选项
    ...(!isGoogleAuthEnabled
      ? [
          {
            key: 'bindGoogle',
            icon: <SafetyOutlined />,
            label: intl.formatMessage({ id: 'menu.account.bindGoogle' }) || '绑定谷歌验证',
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage({ id: 'menu.account.logout' }),
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>

      {/* 绑定谷歌验证弹窗 */}
      <BindGoogleModal
        visible={bindGoogleModalVisible}
        onClose={handleCloseBindGoogleModal}
        onSubmit={handleSubmitBindGoogle}
        userId={initialState?.currentUser?.employeeResp?.id || null}
      />
    </>
  );
};
