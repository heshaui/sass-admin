import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Switch, Space, Divider, Typography, Radio, Tag, Button, Input, message } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { 
  getTenantKeyParams,
  updateValue, 
} from '@/services/ant-design-pro/kv';
const { Text, Title } = Typography;

const BasicConfig: React.FC = () => {
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
          setLoginEnabled(loginLimitResponse.data.keyValue !== '1');
        }
        
        if (registerLimitResponse && registerLimitResponse.data) {
          setRegisterEnabled(registerLimitResponse.data.keyValue !== '1');
        }
        
        if (loginNotificationResponse && loginNotificationResponse.data) {
          setLoginNotificationEnabled(loginNotificationResponse.data.keyValue === '1');
        }
        
        if (restrictedCountryCodesResponse && restrictedCountryCodesResponse.data) {
          setRestrictedCountryCodes(restrictedCountryCodesResponse.data.keyValue);
        }
      } catch (error) {
        console.error('获取配置失败:', error);
        message.error('获取配置数据失败');
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
      const loginLimitValue = checked ? '0' : '1';  // 禁止登录，1表示禁止
      
      const loginUpdateResult = await updateValue({
        keyProperty: 'login_limit_user',
        keyValue: loginLimitValue
      });
      
      if (loginUpdateResult.code==='0'&&loginUpdateResult.data) {
        message.success('登录限制配置更新成功');
      } else {
        message.error('登录限制配置更新失败');
        // 更新失败时恢复状态
        setLoginEnabled(!checked);
      }
    } catch (error) {
      console.error('更新登录限制配置失败:', error);
      message.error('更新登录限制配置失败');
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
      const registerLimitValue = checked ? '0' : '1';  // 禁止注册，1表示禁止
      
      const registerUpdateResult = await updateValue({
        keyProperty: 'register_limit_user',
        keyValue: registerLimitValue
      });
      
      if (registerUpdateResult.code==='0'&&registerUpdateResult.data) {
        message.success('注册限制配置更新成功');
      } else {
        message.error('注册限制配置更新失败');
        // 更新失败时恢复状态
        setRegisterEnabled(!checked);
      }
    } catch (error) {
      console.error('更新注册限制配置失败:', error);
      message.error('更新注册限制配置失败');
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
        message.success('登录通知配置更新成功');
      } else {
        message.error('登录通知配置更新失败');
        // 更新失败时恢复状态
        setLoginNotificationEnabled(!checked);
      }
    } catch (error) {
      console.error('更新登录通知配置失败:', error);
      message.error('更新登录通知配置失败');
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
        message.success('国家代码限制配置更新成功');
        return true;
      } else {
        message.error('国家代码限制配置更新失败');
        return false;
      }
    } catch (error) {
      console.error('更新国家代码限制配置失败:', error);
      message.error('更新国家代码限制配置失败');
      return false;
    }
  };

 
  return (
    <PageContainer>
      <Card title="登录注册配置" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Tips: 限制注册APP/PC，开启后移动用户无法登录注册交易所
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Space size="large">
              <div>
                <Text style={{ marginRight: 16 }}>禁止登录</Text>
                <Switch 
                  checked={loginEnabled} 
                  onChange={handleLoginSwitchChange} 
                  size="small"
                />
              </div>
              <div>
                <Text style={{ marginRight: 16 }}>禁止注册</Text>
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

      <Card title="登录通知配置" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Tip: 每次成功登录通知：开启后，用户每次成功登录交易所将收到手机短信或邮箱通知；关闭后，首次登录、新IP、新设备登录交易所将发送短信或邮箱通知，部件优于短信发送。
          </Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Text style={{ marginRight: 16 }}>每次成功登录通知</Text>
            <Switch 
              checked={loginNotificationEnabled} 
              onChange={handleLoginNotificationSwitchChange} 
              size="small"
            />
          </div>
        </div>
      </Card>

      <Card title="访问配置" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Tips:</Text>
          <ol style={{ marginTop: 8, paddingLeft: 24 }}>
            <li><Text type="secondary">多个数据使用逗号文，进行分割；</Text></li>
            <li><Text type="secondary">限制手机注册和开放手机注册只能二选一配置；</Text></li>
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
          <Typography.Text>限制手机注册的国家代码（多个用逗号隔开）</Typography.Text>
          <Input
            placeholder="例如: 86,1,44"
            value={restrictedCountryCodes}
            onChange={handleCountryCodesChange}
            style={{ marginTop: 8, width: '100%', maxWidth: 400 }}
          />
          <Typography.Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
            输入的国家代码将限制这些区号的手机号注册，例如: 86,1,
          </Typography.Text>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={saveRestrictedCountryCodes}>
            保存国家代码设置
          </Button>
        </div>

      </Card>

   
    </PageContainer>
  );
};

export default BasicConfig; 