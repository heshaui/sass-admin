import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, Button, message, Modal } from 'antd';
import { useIntl } from '@umijs/max';
import AvatarUpload from '@/components/AvatarUpload';
import {
  updateValue,
  getTenantKeyParams,
  // updateTenantKv,
} from '@/services/ant-design-pro/kv';
import { validateImageFile } from '@/utils/validateImage';

const { TabPane } = Tabs;

const Logo: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [darkLogo, setDarkLogo] = useState({ header: '', favicon: '' });
  const [lightLogo, setLightLogo] = useState({ header: '', favicon: '' });
  const [showImage, setShowImage] = useState('');

  // 获取logo数据
  const getLogoData = async () => {
    setLoading(true);
    try {
      let data = {
        key: 'logo',
      };
      const res = await getTenantKeyParams(data);
      if (res.code === '0' && res.data) {
        let keyData = JSON.parse(res.data.keyValue);
        console.log(keyData);
        const darkData = keyData.dark;
        const lightData = keyData.light;

        setDarkLogo({
          header: darkData.headerLogo || '',
          favicon: darkData.favicon || '',
        });
        setLightLogo({
          header: lightData.headerLogo || '',
          favicon: lightData.favicon || '',
        });
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'webConfig.logo.fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  // 提交logo更新
  const handleSubmit = async (type: 'dark' | 'light') => {
    const logoData = type === 'dark' ? darkLogo : lightLogo;

    // 检查夜间版本是否填写
    if (type === 'dark' && (!logoData.header || !logoData.favicon)) {
      message.error(intl.formatMessage({ id: 'webConfig.logo.darkLogoRequired' }));
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
            keyProperty: 'logo',
            keyValue: JSON.stringify({
              dark: {
                headerLogo: darkLogo.header,
                favicon: darkLogo.favicon,
              },
              light: keyData.light, // 使用现有的日间版本数据
            }),
          };
        }
      } else {
        // 正常提交数据
        submitData = {
          keyProperty: 'logo',
          keyValue: JSON.stringify({
            dark: {
              headerLogo: darkLogo.header,
              favicon: darkLogo.favicon,
            },
            light: {
              headerLogo: lightLogo.header,
              favicon: lightLogo.favicon,
            },
          }),
        };
      }

      const res = await updateValue(submitData || { keyValue: '' });
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'webConfig.logo.updateSuccess' }));
      } else {
        message.error(intl.formatMessage({ id: 'webConfig.logo.updateFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'webConfig.logo.updateFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogoData();
  }, []);

  return (
    <PageContainer>
      <Modal
        open={!!showImage}
        centered
        onCancel={() => setShowImage('')}
        footer={null}
        style={{ backgroundColor: 'transparent' }}
      >
        <img src={showImage} style={{ width: '100%', height: '100%' }} />
      </Modal>
      <Tabs defaultActiveKey="1">
        <TabPane tab={intl.formatMessage({ id: 'webConfig.logo.darkMode' })} key="1">
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <div style={{ marginRight: 16 }}>
              <AvatarUpload
                beforeUpload={(file) =>
                  validateImageFile(file, {
                    maxSizeKB: 500,
                    exactWidth: 140,
                    exactHeight: 28,
                    intl
                  })
                }
                value={darkLogo.header}
                onChange={(value) => {
                  setDarkLogo((prev) => ({ ...prev, header: value }));
                }}
              />
              <p>
                {intl.formatMessage({ id: 'webConfig.logo.headerFooterNote.logo.size' })}
                <br />
                {intl.formatMessage({ id: 'webConfig.logo.headerFooterNote' })}
                {darkLogo.header && (
                  <Button type="link" onClick={() => setShowImage(darkLogo.header)}>
                    {intl.formatMessage({ id: 'language.button.view' })}
                  </Button>
                )}
              </p>
            </div>
            <div>
              <AvatarUpload
                beforeUpload={(file) =>
                  validateImageFile(file, {
                    maxSizeKB: 500,
                    exactWidth: 32,
                    exactHeight: 32,
                    intl
                  })
                }
                value={darkLogo.favicon}
                onChange={(value) => {
                  setDarkLogo((prev) => ({ ...prev, favicon: value }));
                }}
              />
              <p>
                {intl.formatMessage({ id: 'webConfig.logo.headerFooterNote.icon.size' })}
                <br />
                {intl.formatMessage({ id: 'webConfig.logo.browserTabNote' })}
                {darkLogo.favicon && (
                  <Button type="link" onClick={() => setShowImage(darkLogo.favicon)}>
                    {intl.formatMessage({ id: 'language.button.view' })}
                  </Button>
                )}
              </p>
            </div>
          </div>
          <Button type="primary" loading={loading} onClick={() => handleSubmit('dark')}>
            {intl.formatMessage({ id: 'webConfig.logo.submit' })}
          </Button>
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'webConfig.logo.lightMode' })} key="2">
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <div style={{ marginRight: 16 }}>
              <AvatarUpload
                beforeUpload={(file) =>
                  validateImageFile(file, {
                    maxSizeKB: 500,
                    exactWidth: 140,
                    exactHeight: 28,
                    intl
                  })
                }
                value={lightLogo.header}
                onChange={(value) => {
                  setLightLogo((prev) => ({ ...prev, header: value }));
                }}
              />
              <p>
                {intl.formatMessage({ id: 'webConfig.logo.headerFooterNote.logo.size' })}
                <br />
                {intl.formatMessage({ id: 'webConfig.logo.headerFooterNote' })}
                {lightLogo.header && (
                  <Button type="link" onClick={() => setShowImage(lightLogo.header)}>
                    {intl.formatMessage({ id: 'language.button.view' })}
                  </Button>
                )}
              </p>
            </div>
            <div>
              <AvatarUpload
                beforeUpload={(file) =>
                  validateImageFile(file, {
                    maxSizeKB: 500,
                    exactWidth: 32,
                    exactHeight: 32,
                    intl
                  })
                }
                value={lightLogo.favicon}
                onChange={(value) => {
                  setLightLogo((prev) => ({ ...prev, favicon: value }));
                }}
              />
              <p>
                {intl.formatMessage({ id: 'webConfig.logo.headerFooterNote.icon.size' })}
                <br />
                {intl.formatMessage({ id: 'webConfig.logo.browserTabNote' })}
                {lightLogo.favicon && (
                  <Button type="link" onClick={() => setShowImage(lightLogo.favicon)}>
                    {intl.formatMessage({ id: 'language.button.view' })}
                  </Button>
                )}
              </p>
            </div>
          </div>
          <Button type="primary" loading={loading} onClick={() => handleSubmit('light')}>
            {intl.formatMessage({ id: 'webConfig.logo.submit' })}
          </Button>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Logo;
