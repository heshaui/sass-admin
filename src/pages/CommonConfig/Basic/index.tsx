import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Switch, Space, Divider, Typography, Radio, Tag, Button, Input, message } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { 
  getTenantKeyParams,
  updateValue, 
} from '@/services/ant-design-pro/kv';
const { Text, Title } = Typography;

const BasicConfig: React.FC = () => {
  const intl = useIntl();
  // 登录注册配置
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [registerEnabled, setRegisterEnabled] = useState(true);
  
  // 登录通知配置
  const [loginNotificationEnabled, setLoginNotificationEnabled] = useState(false);
  
  // 访问配置
  const [selectedVisitOption, setSelectedVisitOption] = useState('限制手机注册和开放手机注册只能二选一配置');
  const [phoneCodeList, setPhoneCodeList] = useState([

  ]);

  // 限制手机注册的国家代码
  const [restrictedCountryCodes, setRestrictedCountryCodes] = useState<string>('');

  // 获取配置数据
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        // 获取系统配置参数，一次只能传一个参数
        const loginLimitResponse = await getTenantKeyParams({key: 'login_limit_user'});
        const registerLimitResponse = await getTenantKeyParams({key: 'register_limit_user'});
        const loginNotificationResponse = await getTenantKeyParams({key: 'login_successful_new'});
        const restrictedCountryCodesResponse = await getTenantKeyParams({key: 'restricted_country_codes'});
        
        // 设置对应的状态
        if (loginLimitResponse && loginLimitResponse.data) {
          setLoginEnabled(loginLimitResponse.data.keyValue === '1');
        }
        
        if (registerLimitResponse && registerLimitResponse.data) {
          setRegisterEnabled(registerLimitResponse.data.keyValue === '1');
        }
        
        if (loginNotificationResponse && loginNotificationResponse.data) {
          setLoginNotificationEnabled(loginNotificationResponse.data.keyValue === '1');
        }
        
        if (restrictedCountryCodesResponse && restrictedCountryCodesResponse.data) {
          setRestrictedCountryCodes(restrictedCountryCodesResponse.data.keyValue);
        }
      } catch (error) {
        console.error(intl.formatMessage({ id: 'basicConfig.console.getConfig.error' }), error);
        message.error(intl.formatMessage({ id: 'basicConfig.message.getConfig.error' }));
      }
    };

    fetchConfigData();
  }, []);

  // 处理添加手机区号
  const handleAddPhoneCode = () => {
    const newId = phoneCodeList.length > 0 ? Math.max(...phoneCodeList.map(item => item.id)) + 1 : 1;
    setPhoneCodeList([...phoneCodeList, { id: newId, code: '+86 中国' }]);
  };

  // 处理删除手机区号
  const handleRemovePhoneCode = (id: number) => {
    setPhoneCodeList(phoneCodeList.filter(item => item.id !== id));
  };

  // 处理登录限制开关变化
  const handleLoginSwitchChange = async (checked: boolean) => {
    // 先更新本地状态
    setLoginEnabled(checked);
    
    // 然后调用接口更新服务器
    try {
      const loginLimitValue = checked ? '1' : '0';  // 启用登录，1表示允许
      
      const loginUpdateResult = await updateValue({
        keyProperty: 'login_limit_user',
        keyValue: loginLimitValue
      });
      
      if (loginUpdateResult.code==='0'&&loginUpdateResult.data) {
        message.success(intl.formatMessage({ id: 'basicConfig.message.loginConfig.success' }));
      } else {
        message.error(intl.formatMessage({ id: 'basicConfig.message.loginConfig.error' }));
        // 更新失败时恢复状态
        setLoginEnabled(!checked);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'basicConfig.console.loginConfig.error' }), error);
      message.error(intl.formatMessage({ id: 'basicConfig.message.loginConfig.error' }));
      // 更新失败时恢复状态
      setLoginEnabled(!checked);
    }
  };

  // 处理注册限制开关变化
  const handleRegisterSwitchChange = async (checked: boolean) => {
    // 先更新本地状态
    setRegisterEnabled(checked);
    
    // 然后调用接口更新服务器
    try {
      const registerLimitValue = checked ? '1' : '0';  // 启用注册，1表示允许
      
      const registerUpdateResult = await updateValue({
        keyProperty: 'register_limit_user',
        keyValue: registerLimitValue
      });
      
      if (registerUpdateResult.code==='0'&&registerUpdateResult.data) {
        message.success(intl.formatMessage({ id: 'basicConfig.message.registerConfig.success' }));
      } else {
        message.error(intl.formatMessage({ id: 'basicConfig.message.registerConfig.error' }));
        // 更新失败时恢复状态
        setRegisterEnabled(!checked);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'basicConfig.console.registerConfig.error' }), error);
      message.error(intl.formatMessage({ id: 'basicConfig.message.registerConfig.error' }));
      // 更新失败时恢复状态
      setRegisterEnabled(!checked);
    }
  };

  // 处理登录通知开关变化
  const handleLoginNotificationSwitchChange = async (checked: boolean) => {
    // 先更新本地状态
    setLoginNotificationEnabled(checked);
    
    // 然后调用接口更新服务器
    try {
      const loginNotificationValue = checked ? '1' : '0';  // 登录通知，1表示启用
      
      const notificationUpdateResult = await updateValue({
        keyProperty: 'login_successful_new',
        keyValue: loginNotificationValue
      });
      
      if (notificationUpdateResult.code==='0'&&notificationUpdateResult.data) {
        message.success(intl.formatMessage({ id: 'basicConfig.message.loginNotification.success' }));
      } else {
        message.error(intl.formatMessage({ id: 'basicConfig.message.loginNotification.error' }));
        // 更新失败时恢复状态
        setLoginNotificationEnabled(!checked);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'basicConfig.console.loginNotification.error' }), error);
      message.error(intl.formatMessage({ id: 'basicConfig.message.loginNotification.error' }));
      // 更新失败时恢复状态
      setLoginNotificationEnabled(!checked);
    }
  };

  // 处理国家代码输入变化
  const handleCountryCodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestrictedCountryCodes(e.target.value);
  };

  // 保存国家代码设置
  const saveRestrictedCountryCodes = async () => {
    try {
      const updateResult = await updateValue({
        keyProperty: 'restricted_country_codes',
        keyValue: restrictedCountryCodes
      });
      
      if (updateResult.code==='0'&&updateResult.data) {
        message.success(intl.formatMessage({ id: 'basicConfig.message.countryCode.success' }));
        return true;
      } else {
        message.error(intl.formatMessage({ id: 'basicConfig.message.countryCode.error' }));
        return false;
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'basicConfig.console.countryCode.error' }), error);
      message.error(intl.formatMessage({ id: 'basicConfig.message.countryCode.error' }));
      return false;
    }
  };

 
  return (
    <PageContainer>
      <Card title={intl.formatMessage({ id: 'basicConfig.card.loginRegister' })} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            {intl.formatMessage({ id: 'basicConfig.tips.loginRegister' })}
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Space size="large">
              <div>
                <Text style={{ marginRight: 16 }}>{intl.formatMessage({ id: 'basicConfig.switch.disableLogin' })}</Text>
                <Switch 
                  checked={loginEnabled} 
                  onChange={handleLoginSwitchChange} 
                  size="small"
                />
              </div>
              <div>
                <Text style={{ marginRight: 16 }}>{intl.formatMessage({ id: 'basicConfig.switch.disableRegister' })}</Text>
                <Switch 
                  checked={registerEnabled} 
                  onChange={handleRegisterSwitchChange} 
                  size="small"
                />
              </div>
            </Space>
          </div>
        </div>
      </Card>

      <Card title={intl.formatMessage({ id: 'basicConfig.card.loginNotification' })} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            {intl.formatMessage({ id: 'basicConfig.tips.loginNotification' })}
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Text style={{ marginRight: 16 }}>{intl.formatMessage({ id: 'basicConfig.switch.loginNotification' })}</Text>
            <Switch 
              checked={loginNotificationEnabled} 
              onChange={handleLoginNotificationSwitchChange} 
              size="small"
            />
          </div>
        </div>
      </Card>

      <Card title={intl.formatMessage({ id: 'basicConfig.card.accessConfig' })} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">{intl.formatMessage({ id: 'basicConfig.tips.accessConfig' })}</Text>
          <ol style={{ marginTop: 8, paddingLeft: 24 }}>
            <li><Text type="secondary">{intl.formatMessage({ id: 'basicConfig.tips.accessConfig.item1' })}</Text></li>
            <li><Text type="secondary">{intl.formatMessage({ id: 'basicConfig.tips.accessConfig.item2' })}</Text></li>
          </ol>
        </div>


        <div style={{ marginBottom: 24 }}>
          {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Text>限制手机注册的国家代码</Text>
          </div> */}
          
          {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {phoneCodeList.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '4px 8px', borderRadius: 4 }}>
                <Text>{item.code}</Text>
                <CloseOutlined 
                  style={{ marginLeft: 8, cursor: 'pointer', fontSize: 12 }} 
                  onClick={() => handleRemovePhoneCode(item.id)}
                />
              </div>
            ))}
          </div> */}
        </div>

        <div style={{ marginTop: 16 }}>
          <Typography.Text>{intl.formatMessage({ id: 'basicConfig.countryCode.title' })}</Typography.Text>
          <Input
            placeholder={intl.formatMessage({ id: 'basicConfig.countryCode.placeholder' })}
            value={restrictedCountryCodes}
            onChange={handleCountryCodesChange}
            style={{ marginTop: 8, width: '100%', maxWidth: 400 }}
          />
          <Typography.Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
            {intl.formatMessage({ id: 'basicConfig.countryCode.description' })}
          </Typography.Text>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={saveRestrictedCountryCodes}>
            {intl.formatMessage({ id: 'basicConfig.countryCode.saveButton' })}
          </Button>
        </div>

      </Card>

   
    </PageContainer>
  );
};

export default BasicConfig; 