import { login, loginCheck, tenantLogin, tenantLoginCheck } from '@/services/ant-design-pro/api';
import { emailCode, getFakeCaptcha } from '@/services/ant-design-pro/login';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Button, FormInstance, Input, message, Modal } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login: React.FC = () => {
  console.log('Login', process.env);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const isMerchant = process.env.UMI_APP_MERCHANT_FLAG === '1';
  const { initialState, setInitialState } = useModel('@@initialState');
  const formRef = useRef<FormInstance>();

  const { styles } = useStyles();
  const intl = useIntl();

  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [googleCode, setGoogleCode] = useState('');
  const [loginValues, setLoginValues] = useState<API.LoginParams | null>(null);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 先调用loginCheck接口
      let checkResult = null;
      const account = values.account;
      if (isAdmin) {
        checkResult = await loginCheck(account);
      } else {
        checkResult = await tenantLoginCheck(account);
      }

      // 保存登录信息，以便后续使用
      setLoginValues(values);

      if (!checkResult || checkResult.code !== '0') {
        message.error(checkResult?.message || '登录前检查失败');
        return;
      }

      if (!checkResult.data) {
        // 需要手机验证码验证，显示弹框
        setPhoneNumber(account);
        setSmsModalVisible(true);
      } else {
        // 需要谷歌验证码，显示弹框
        setGoogleModalVisible(true);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  // 发送手机验证码
  const sendPhoneCode = async () => {
    try {
      if (!phoneNumber) {
        message.error('手机号不能为空');
        return;
      }

      let result = null;
      if (isAdmin) {
        result = await getFakeCaptcha({ number: phoneNumber, deviceType: 'admin-pc' });
      } else if (isMerchant) {
        result = await emailCode({ number: phoneNumber, deviceType: 'merchant-pc' });
      }

      if (!result) {
        message.error(`验证码获取失败`);
      }

      if (result.code === '0') {
        message.success('获取验证码成功！');
      } else {
        message.error(`验证码获取失败: ${result.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('获取验证码失败:', error);
      message.error('验证码请求失败，请稍后再试');
    }
  };

  // 完成登录过程
  const completeLogin = async (
    values: API.LoginParams,
    smsCode?: string,
    googleAuthCode?: string,
  ) => {
    try {
      // 添加验证码到登录参数
      const loginParams = { ...values };
      if (smsCode) {
        loginParams.emailCode = smsCode;
      }
      if (googleAuthCode) {
        loginParams.googleCode = googleAuthCode;
      }

      // 登录流程
      let msg = null;
      if (isAdmin) {
        msg = await login(loginParams);
      } else {
        msg = await tenantLogin(loginParams);
      }

      if (msg.code === '0') {
        if (isAdmin) {
          localStorage.setItem('sa-token-admin', msg.data.token);
        } else {
          localStorage.setItem('sa-token-tenant', msg.data.token);
        }

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        message.error(msg.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  // 验证码弹框确认
  const handleSmsModalOk = async () => {
    if (!verificationCode) {
      message.error('请输入验证码');
      return;
    }

    if (loginValues) {
      await completeLogin(loginValues, verificationCode);
      setSmsModalVisible(false);
      setVerificationCode('');
    }
  };

  // 谷歌验证码弹框确认
  const handleGoogleModalOk = async () => {
    if (!googleCode) {
      message.error('请输入谷歌验证码');
      return;
    }

    if (loginValues) {
      await completeLogin(loginValues, undefined, googleCode);
      setGoogleModalVisible(false);
      setGoogleCode('');
    }
  };

  const titles = isAdmin ? 'Sass总后台' : '商户后台';
  console.log(isAdmin);
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          formRef={formRef}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title={titles}
          subTitle={titles}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            name="account"
            placeholder="请输入账户"
            rules={[
              {
                required: true,
                message: '请输入账户',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码!"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码!"
                  />
                ),
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            {/* <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox> */}
          </div>
        </LoginForm>
      </div>

      {/* 短信验证码弹框 */}
      <Modal
        title="手机验证"
        open={smsModalVisible}
        onOk={handleSmsModalOk}
        onCancel={() => setSmsModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p>请输入手机验证码</p>
          <div style={{ display: 'flex' }}>
            <Input
              placeholder="验证码"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <Button onClick={sendPhoneCode}>获取验证码</Button>
          </div>
        </div>
      </Modal>

      {/* 谷歌验证码弹框 */}
      <Modal
        title="谷歌验证"
        open={googleModalVisible}
        onOk={handleGoogleModalOk}
        onCancel={() => setGoogleModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p>请输入谷歌验证码</p>
          <Input
            placeholder="谷歌验证码"
            value={googleCode}
            onChange={(e) => setGoogleCode(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Login;
