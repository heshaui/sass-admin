import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Switch, Space, Divider, Typography, Radio, Tag, Button, Input } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

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
    { id: 1, code: '+86 中国' }
  ]);

  // 处理添加手机区号
  const handleAddPhoneCode = () => {
    const newId = phoneCodeList.length > 0 ? Math.max(...phoneCodeList.map(item => item.id)) + 1 : 1;
    setPhoneCodeList([...phoneCodeList, { id: newId, code: '+86 中国' }]);
  };

  // 处理删除手机区号
  const handleRemovePhoneCode = (id: number) => {
    setPhoneCodeList(phoneCodeList.filter(item => item.id !== id));
  };

  // 保存配置
  const handleSave = () => {
    console.log('保存配置');
  };

  // 修改配置
  const handleModify = () => {
    console.log('修改配置');
  };

  return (
    <PageContainer>
      <Card title="登录注册配置" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Tips: 限制注册APP/PC，开启后移动用户无法登录注册交易所
          </Text>
          <Tag color="gold" style={{ marginLeft: 16 }}>4</Tag>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Space size="large">
              <div>
                <Text style={{ marginRight: 16 }}>禁止登录</Text>
                <Switch 
                  checked={loginEnabled} 
                  onChange={setLoginEnabled} 
                  size="small"
                />
              </div>
              <div>
                <Text style={{ marginRight: 16 }}>禁止注册</Text>
                <Switch 
                  checked={registerEnabled} 
                  onChange={setRegisterEnabled} 
                  size="small"
                />
              </div>
            </Space>
          </div>
          <div style={{ maxWidth: '50%', padding: 16, backgroundColor: '#fff9e6', borderRadius: 4 }}>
            <Text>默认状态-关闭，开启/关闭需要进行二次确认，二次确认后，更新开关状态</Text>
            <div style={{ color: '#999', marginTop: 8 }}>mock</div>
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
              onChange={setLoginNotificationEnabled} 
              size="small"
            />
          </div>
          <div style={{ maxWidth: '50%', padding: 16, backgroundColor: '#fff9e6', borderRadius: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag color="gold" style={{ marginRight: 8 }}>5</Tag>
              <Text>每次成功登录通知-关闭（默认状态一）</Text>
            </div>
            <Text>开启/关闭需要进行二次确认，二次确认后，更新开关状态</Text>
            <div style={{ color: '#999', marginTop: 8 }}>mock</div>
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

        <div style={{ marginBottom: 16 }}>
          <Radio.Group 
            value={selectedVisitOption}
            onChange={(e) => setSelectedVisitOption(e.target.value)}
          >
            <Radio value="限制手机注册和开放手机注册只能二选一配置">限制手机注册和开放手机注册只能二选一配置</Radio>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Text>限制手机注册的国家代码</Text>
            <Tag color="gold" style={{ marginLeft: 8 }}>12</Tag>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {phoneCodeList.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '4px 8px', borderRadius: 4 }}>
                <Text>{item.code}</Text>
                <CloseOutlined 
                  style={{ marginLeft: 8, cursor: 'pointer', fontSize: 12 }} 
                  onClick={() => handleRemovePhoneCode(item.id)}
                />
                <Tag color="gold" style={{ marginLeft: 8 }}>8</Tag>
              </div>
            ))}
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={handleAddPhoneCode}
              style={{ height: 32 }}
            >
              添加
            </Button>
            <Tag color="gold">9</Tag>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>
            <Text>开放手机注册的国家代码</Text>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={() => console.log('添加开放手机注册国家代码')}
              style={{ height: 32 }}
            >
              添加
            </Button>
            <Tag color="gold">10</Tag>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        <Tag color="gold">6</Tag>
        <Button type="primary" onClick={handleModify}>修改</Button>
        <Tag color="gold">7</Tag>
        <Button type="primary" onClick={handleSave}>保存</Button>
      </div>
    </PageContainer>
  );
};

export default BasicConfig; 