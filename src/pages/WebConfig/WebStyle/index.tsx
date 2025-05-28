import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Radio, Space, Button, ColorPicker, Image } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
    getTenantKeyParams,
    updateValue, 
  } from '@/services/ant-design-pro/kv';
import { message } from 'antd';
import { history, useIntl } from 'umi';

const WebStyle: React.FC = () => {
  const intl = useIntl();
  const [selectedTemplate, setSelectedTemplate] = useState('1');
  const [primaryColor, setPrimaryColor] = useState<string>('#FF5F1F');

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
      console.error(intl.formatMessage({ id: 'webConfig.webStyle.fetchFailed' }), error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleColorChange = (color: Color) => {
    console.log(color);
    // Convert the color to a hex string
    const hexValue = typeof color === 'string' ? color : color.toHexString();
    setPrimaryColor(hexValue);
  };

  const handleSave = async () => {
    try {
      // 保存主题色配置
     const result = await updateValue({
        keyProperty: 'theme',
        keyValue: JSON.stringify({ color: primaryColor })
      });

      // 保存模板配置
     const templateResult = await updateValue({
        keyProperty: 'template',
        keyValue: JSON.stringify({ type: selectedTemplate })
      });
      if(result.code === '0'&&templateResult.code === '0'&&result.data&&templateResult.data){
        message.success(intl.formatMessage({ id: 'webConfig.webStyle.saveSuccess' }));
      }else{
        message.error(intl.formatMessage({ id: 'webConfig.webStyle.saveFailed' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'webConfig.webStyle.saveError' }), error);
      message.error(intl.formatMessage({ id: 'webConfig.webStyle.saveFailed' }));
    }
  };

  const handleGoToBackground = () => {
    history.push('/webConfig/background');
  };

  return (
    <PageContainer>
      <Card>
       
        
        <div >
          <h2>{intl.formatMessage({ id: 'webConfig.webStyle.homeTemplate' })}</h2>
          <div >
            <div style={{display:'flex',flexDirection:'column'}}    >
              <Image 
                src="/home.png" 
                alt={`${intl.formatMessage({ id: 'webConfig.webStyle.template' })}1`}
                width={100}
                height={100}
              />
              <Radio 
                checked={selectedTemplate === '1'}
                onChange={() => setSelectedTemplate('1')}
              >
                {`${intl.formatMessage({ id: 'webConfig.webStyle.template' })}1`}
              </Radio>
              <Button type="primary" style={{width:'100px',marginTop:'10px'}} >
                {intl.formatMessage({ id: 'webConfig.webStyle.inUse' })}
              </Button>
              <Button 
                type="primary" 
                style={{width:'100px',marginTop:'10px'}}
                onClick={handleGoToBackground}
              >
               {intl.formatMessage({ id: 'webConfig.webStyle.backgroundSetting' })}
              </Button>
            </div>
          </div>
        </div>

        <div style={{marginTop:'20px'}}>
          <h2>{intl.formatMessage({ id: 'webConfig.webStyle.themeColor' })}</h2>
          <ul style={{listStyle:'none',margin:'0',padding:'0'}} >
                <li>{intl.formatMessage({ id: 'webConfig.webStyle.defaultThemeColor' })}</li>
                <li>{intl.formatMessage({ id: 'webConfig.webStyle.selectThemeColor' })}</li>
            </ul>
          <Space direction="vertical" size="large">
           
            <ColorPicker format="hex" defaultValue={primaryColor} onChangeComplete={handleColorChange} />
          </Space>
        </div>

        <Space style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleSave}>
            {intl.formatMessage({ id: 'webConfig.webStyle.saveConfig' })}
          </Button>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default WebStyle;
