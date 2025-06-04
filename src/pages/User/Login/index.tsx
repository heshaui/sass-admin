import { login, loginCheck, tenantLogin, tenantLoginCheck } from '@/services/ant-design-pro/api';
import { emailCode, getFakeCaptcha } from '@/services/ant-design-pro/login';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Button, FormInstance, Input, message, Modal,Image} from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import loginImg from './login.png'
const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f0f2f5',
  },
  leftPanel: {
    flex: '0 0 750px',
    background: 'linear-gradient(180deg, #000 0%, #101010 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    display: 'flex',
    alignItems: 'center',
    '& img': {
      height: '32px',
      marginRight: '12px',
    },
    '& span': {
      color: '#fff',
      fontSize: '22px',
      fontWeight: 600,
    },
  },
  leftContent: {
    textAlign: 'center',
    color: '#fff',
    padding: '0 100px',
  },
  title: {
    fontSize: '44px',
    fontWeight: 600,
    marginBottom: '16px',
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: '20px',
    opacity: 0.8,
    marginBottom: '48px',
    lineHeight: 1.6,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  loginForm: {
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '8px',

  },
  welcome: {
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '40px',
    color: '#1d2129',
    textAlign: 'left',
  },

  formItem: {
    marginBottom: '24px',
    '& .ant-input, & .ant-input-affix-wrapper': {

      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '15px',
      transition: 'all 0.3s',
    },
    // // 普通输入框
    // '& .ant-input:not(.ant-input-disabled)': {
    //   '&:hover, &:focus': {
    //     borderColor: '#FF5F1F !important',
    //     boxShadow: '0 0 0 2px rgba(255, 95, 31, 0.1) !important',
    //   },
    // },
    // 带图标的输入框
    '& .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled)': {
      '&:hover, &:focus-within': {
        borderColor: '#FF5F1F !important',
        boxShadow: '0 0 0 2px rgba(255, 95, 31, 0.1) !important',
      },
    },
    '& .ant-input-prefix': {
      marginRight: '12px',
      color: '#c9cdd4',
      fontSize: '18px',
    },
  },
  loginBtn: {
    width: '100%',
    height: '48px',
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '8px',
    '&.ant-btn-primary': {
      background: '#FF5F1F',
      borderColor: '#FF5F1F',
      '&:not(:disabled):not(.ant-btn-disabled):hover': {
        background: '#e65119 !important',
        borderColor: '#e65119 !important',
      },
      '&:not(:disabled):not(.ant-btn-disabled):active': {
        background: '#cc4614 !important',
        borderColor: '#cc4614 !important',
      },
      '&:not(:disabled):not(.ant-btn-disabled):focus': {
        background: '#e65119 !important',
        borderColor: '#e65119 !important',
      },
    },
  },
  forgetPwd: {
    textAlign: 'right',
    marginTop: '16px',
    '& a': {
      color: '#86909c',
      fontSize: '14px',
      '&:hover': {
        color: '#FF5F1F',
      },
    },
  },
  lang: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    cursor: 'pointer',
  },
}));

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

        checkResult = await loginCheck(values);
      } else {
        checkResult = await tenantLoginCheck(values);
      }

      // 保存登录信息，以便后续使用
      setLoginValues(values);

      if (!checkResult || checkResult.code !== '0') {
        message.error(checkResult?.message || intl.formatMessage({ id: 'pages.login.check.failure' }));
        return;
      }

      if (!checkResult.data.googleCode) {
        // 需要邮箱验证码验证，显示弹框
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

  // 发送邮箱验证码
  const sendPhoneCode = async () => {
    try {
      if (!phoneNumber) {
        message.error(intl.formatMessage({ id: 'pages.login.email.empty' }));
        return;
      }

      let result = null;
      if (isAdmin) {
        result = await getFakeCaptcha({ number: phoneNumber, deviceType: 'admin-pc' });
      } else if (isMerchant) {
        result = await emailCode({ number: phoneNumber, deviceType: 'merchant-pc' });
      }

      if (!result) {
        message.error(intl.formatMessage({ id: 'pages.login.email.code.failure' }));
      }

      if (result.code === '0') {
        message.success(intl.formatMessage({ id: 'pages.login.email.code.success' }));
      } else {
        message.error(`${intl.formatMessage({ id: 'pages.login.email.code.failure' })}: ${result.message || intl.formatMessage({ id: 'pages.login.email.code.failure.unknown' })}`);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'pages.login.email.code.failure' }), error);
      message.error(intl.formatMessage({ id: 'pages.login.email.code.failure.request' }));
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
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  // 验证码弹框确认
  const handleSmsModalOk = async () => {
    if (!verificationCode) {
      message.error(intl.formatMessage({ id: 'pages.login.email.code.required' }));
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
      message.error(intl.formatMessage({ id: 'pages.login.google.code.required' }));
      return;
    }

    if (loginValues) {
      await completeLogin(loginValues, undefined, googleCode);
      setGoogleModalVisible(false);
      setGoogleCode('');
    }
  };

  // Removed unused titles variable
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <Image src={loginImg} alt="login"preview={false}/>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.loginForm}>
          
          <LoginForm
            formRef={formRef}
            logo={null}
            title={isAdmin ? 'IMSaaS' : ''}
            subTitle={isAdmin ? intl.formatMessage({ id: 'pages.login.admin' }) : intl.formatMessage({ id: 'pages.login.merchant' })}
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({ id: 'pages.login.submit' }),
              },
              submitButtonProps: {
                className: styles.loginBtn,
              },
            }}
          >
            <div className={styles.formItem}>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined style={{ color: '#bfbfbf' }} />,
                  placeholder: intl.formatMessage({ id: 'pages.login.username.placeholder' }),
                }}
                name="account"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'pages.login.username.required' }),
                  },
                ]}
              />
            </div>
            
            <div className={styles.formItem}>
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined style={{ color: '#bfbfbf' }} />,
                  placeholder: intl.formatMessage({ id: 'pages.login.password.placeholder' }),
                }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'pages.login.password.required' }),
                  },
                ]}
              />
            </div>
          </LoginForm>
          <Lang />
        </div>
      </div>

      {/* 短信验证码弹框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.login.email.modal.title' })}
        open={smsModalVisible}
        onOk={handleSmsModalOk}
        onCancel={() => setSmsModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p>{intl.formatMessage({ id: 'pages.login.email.modal.prompt' })}</p>
          <div style={{ display: 'flex' }}>
            <Input
              placeholder={intl.formatMessage({ id: 'pages.login.email.code.placeholder' })}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <Button onClick={sendPhoneCode}>{intl.formatMessage({ id: 'pages.login.email.code.get' })}</Button>
          </div>
        </div>
      </Modal>

      {/* 谷歌验证码弹框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.login.google.modal.title' })}
        open={googleModalVisible}
        onOk={handleGoogleModalOk}
        onCancel={() => setGoogleModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p>{intl.formatMessage({ id: 'pages.login.google.modal.prompt' })}</p>
          <Input
            placeholder={intl.formatMessage({ id: 'pages.login.google.code.placeholder' })}
            value={googleCode}
            onChange={(e) => setGoogleCode(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Login;
