import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Radio, Space, Button, ColorPicker,Image } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
    getTenantKeyParams,
    updateTenantKv, 
  } from '@/services/ant-design-pro/kv';
import { message } from 'antd';

const WebStyle: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('1');
  const [primaryColor, setPrimaryColor] = useState<Color>('#FF5F1F');

  const fetchConfig = async () => {
    try {
        
      const themeRes = await getTenantKeyParams({key:'theme'});
      const templateRes = await getTenantKeyParams({key:'template'});
      
      if (themeRes?.data) {
        console.log(themeRes.data)
        let colorData=JSON.parse(themeRes.data.keyValue)
        setPrimaryColor(colorData.color);
      }
      if (templateRes?.data) {
        console.log(templateRes.data)
        let templateData=JSON.parse(templateRes.data.keyValue)
        setSelectedTemplate(templateData.type);
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleColorChange = (color: Color) => {
    setPrimaryColor(color);
  };

  const handleSave = async () => {
    try {
      // 保存主题色配置
      await updateTenantKv({
        key: 'theme',
        keyValue: JSON.stringify({ color: primaryColor })
      });

      // 保存模板配置
      await updateTenantKv({
        key: 'template',
        keyValue: JSON.stringify({ type: selectedTemplate })
      });

      message.success('配置保存成功');
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存配置失败');
    }
  };

  return (
    <PageContainer>
      <Card>
       
        
        <div >
          <h2>首页模板</h2>
          <div >
            <div style={{display:'flex',flexDirection:'column'}}    >
              <Image 
                src="/home.png" 
                alt="模板1"
                width={100}
                height={100}
              />
              <Radio 
                checked={selectedTemplate === '1'}
                onChange={() => setSelectedTemplate('1')}
              >
                模板1
              </Radio>
              <Button type="primary" style={{width:'100px',marginTop:'10px'}} >
                使用中
              </Button>
            </div>
          </div>
        </div>

        <div style={{marginTop:'20px'}}>
          <h2>主题色</h2>
          <ul style={{listStyle:'none',margin:'0',padding:'0'}} >
                <li>1、默认主题色:#FF5F1F</li>
                <li>2、点击选择主题色</li>
            </ul>
          <Space direction="vertical" size="large">
           
            <ColorPicker value={primaryColor} onChange={handleColorChange} />
          </Space>
        </div>

        <Space style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleSave}>
            保存配置
          </Button>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default WebStyle;
