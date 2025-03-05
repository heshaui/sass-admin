import { login,tenantLogin} from '@/services/ant-design-pro/api';
import { emailCode, getFakeCaptcha } from '@/services/ant-design-pro/login';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { FormInstance, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef } from 'react';
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
      // 登录
      let msg=null;
      if(isAdmin){
         msg = await login({ ...values });
      }else{
         msg = await tenantLogin({ ...values });
      }
      
      if (msg.code === '0') {
        if(isAdmin){
          localStorage.setItem('sa-token-admin', msg.data.token);
        }else{
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
      }else{
        message.error(msg.message);
      }
      // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  const getEmailCode = async () => {
    try {
      const account = formRef.current?.getFieldValue('account');
      if (!account) {
        message.error('请输入账户后再获取验证码！');
        return;
      }

      let result = null;
      console.log(isAdmin);
      console.log(isMerchant);
      if (isAdmin) {
        result = await getFakeCaptcha({ number: account, deviceType: 'admin-pc' });
      } else if (isMerchant) {
        result = await emailCode({ number: account, deviceType: 'merchant-pc' });
      }
      console.log(result);
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

  const titles = isAdmin ? 'Sass总后台' : '商户后台';
  console.log(isAdmin)
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
          <>
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
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
                defaultMessage: '请输入验证码',
              })}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${intl.formatMessage({
                    id: 'pages.getCaptchaSecondText',
                    defaultMessage: '获取验证码',
                  })}`;
                }
                return intl.formatMessage({
                  id: 'pages.login.phoneLogin.getVerificationCode',
                  defaultMessage: '获取验证码',
                });
              }}
              name="emailCode"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.captcha.required"
                      defaultMessage="请输入验证码！"
                    />
                  ),
                },
              ]}
              onGetCaptcha={getEmailCode}
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
          </>

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

    </div>
  );
};

export default Login;
