import React, { useState, useEffect } from 'react';
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, Button, message } from "antd";
import AvatarUpload from '@/components/AvatarUpload';
import { 
  getTenantKvParams,
  getTenantKeyParams,
  updateTenantKv, 
} from '@/services/ant-design-pro/kv';

const { TabPane } = Tabs;

const Logo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [darkLogo, setDarkLogo] = useState({ header: '', favicon: '' });
  const [lightLogo, setLightLogo] = useState({ header: '', favicon: '' });

  // 获取logo数据
  const getLogoData = async () => {
    setLoading(true);
    try {
      let data={
        key:'logo'
      }
      const res = await getTenantKeyParams(data);
      if (res.code === '0' && res.data) {
        let keyData=JSON.parse(res.data.keyValue) 
        console.log(keyData)  
        const darkData = keyData.dark;
        const lightData = keyData.light
        
        setDarkLogo({
          header: darkData.headerLogo || '',
          favicon: darkData.favicon || ''
        });
        setLightLogo({
          header: lightData.headerLogo || '',
          favicon: lightData.favicon || ''
        });
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交logo更新
  const handleSubmit = async (type: 'dark' | 'light') => {
    const logoData = type === 'dark' ? darkLogo : lightLogo;

    // 检查夜间版本是否填写
    if (type === 'dark' && (!logoData.header || !logoData.favicon)) {
      message.error('请填写夜间版本的 Logo');
      return;
    }

    setLoading(true);
    try {
      // 如果是日间版本且未填写，获取现有数据
      let submitData;
      if (type === 'light' && (!logoData.header || !logoData.favicon)) {
        const existingData = await getTenantKeyParams({ key: 'logo' });
        if (existingData.code === '0' && existingData.data) {
          const keyData = JSON.parse(existingData.data.keyValue);
          submitData = {
            keyProperty:'logo',
            keyValue: JSON.stringify({
              dark: {
                headerLogo: darkLogo.header,
                favicon: darkLogo.favicon
              },
              light: keyData.light // 使用现有的日间版本数据
            })
          };
        }
      } else {
        // 正常提交数据
        submitData = {
          keyProperty:'logo',
          keyValue: JSON.stringify({
            dark: {
              headerLogo: darkLogo.header,
              favicon: darkLogo.favicon
            },
            light: {
              headerLogo: lightLogo.header,
              favicon: lightLogo.favicon
            }
          })
        };
      }

      const res = await updateTenantKv(submitData);
      if (res.code === '0') {
        message.success('更新成功');
      } else {
        message.error('更新失败');
      }
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogoData();
  }, []);

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <TabPane tab="夜间版" key="1">
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <div style={{ marginRight: 16 }}>
              <AvatarUpload
                value={darkLogo.header}
                onChange={(value) => {
                  setDarkLogo(prev => ({ ...prev, header: value }));
                }}
              />
              <p>(适用于顶部Header/底部Footer)</p>
            </div>
            <div>
              <AvatarUpload
                value={darkLogo.favicon}
                onChange={(value) => {
                  setDarkLogo(prev => ({ ...prev, favicon: value }));
                }}
              />
              <p>(适用于浏览器标签)</p>
            </div>
          </div>
          <Button type="primary" loading={loading} onClick={() => handleSubmit('dark')}>
            提交
          </Button>
        </TabPane>
        <TabPane tab="日间版" key="2">
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <div style={{ marginRight: 16 }}>
              <AvatarUpload
                value={lightLogo.header}
                onChange={(value) => {
                  setLightLogo(prev => ({ ...prev, header: value }));
                }}
              />
              <p>(适用于顶部Header/底部Footer)</p>
            </div>
            <div>
              <AvatarUpload
                value={lightLogo.favicon}
                onChange={(value) => {
                  setLightLogo(prev => ({ ...prev, favicon: value }));
                }}
              />
              <p>(适用于浏览器标签)</p>
            </div>
          </div>
          <Button type="primary" loading={loading} onClick={() => handleSubmit('light')}>
            提交
          </Button>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Logo;