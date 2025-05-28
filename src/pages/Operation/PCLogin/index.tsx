import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Tabs, Tag, Typography, Image, Space } from 'antd';
import type { TabsProps } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { 
  getTenantKeyParams,
  updateTenantKv, 
} from '@/services/ant-design-pro/kv';
import EditModal  from './components/EditModal';
import { languages } from '@/config/language';
const { Text } = Typography;

interface TableItem {
  key: string;
  title: string;
  image: string;
  url: string;
}



const PCLogin: React.FC = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('login');
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  const [pcLoginData, setPcLoginData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TableItem | null>(null);

  // 获取 pcLogin 数据
  const fetchPcLoginData = async () => {
    try {
      setLoading(true);
      const result = await getTenantKeyParams({key: 'pcLogin'});
      if (result.code==='0' && result.data) {
        setPcLoginData(JSON.parse(result.data.keyValue));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'pcLogin.message.getPcLoginFailed' }), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPcLoginData();
  }, []);

  // 提示信息
  const tips = [
    intl.formatMessage({ id: 'pcLogin.tips.1' }),
    intl.formatMessage({ id: 'pcLogin.tips.2' }),
    intl.formatMessage({ id: 'pcLogin.tips.3' }),
  ];

  // 语言选项
  const languageOptions: LanguageItem[] = languages



  // 处理语言切换
  const handleLanguageChange = (langKey: string) => {
    setActiveLanguage(langKey);
    // 这里可以添加加载对应语言数据的逻辑
  };

  // 处理编辑操作
  const handleEdit = (record: TableItem) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  // 处理模态框关闭
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // 处理保存成功
  const handleSaveSuccess = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    fetchPcLoginData();
  };

  // 表格列定义
  const columns: ProColumns<TableItem>[] = [
    {
      title: intl.formatMessage({ id: 'pcLogin.column.title' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'pcLogin.column.image' }),
      dataIndex: 'image',
      key: 'image',
      search: false,
      render: (_, record) => (
        <Image
          src={record.image}
          alt={intl.formatMessage({ id: 'pcLogin.column.image.alt' })}
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'pcLogin.column.url' }),
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: intl.formatMessage({ id: 'pcLogin.column.action' }),
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>{intl.formatMessage({ id: 'pcLogin.action.edit' })}</a>,
      ],
    },
  ];

  // 修改表格数据获取逻辑
  const loginData: TableItem[] = pcLoginData?.[activeLanguage]?.login ? [
    {
      key: '1',
      ...pcLoginData[activeLanguage].login
    }
  ] : [];

  const registerData: TableItem[] = pcLoginData?.[activeLanguage]?.register ? [
    {
      key: '1',
      ...pcLoginData[activeLanguage].register
    }
  ] : [];

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'login',
      label: intl.formatMessage({ id: 'pcLogin.tab.login' }),
      children: (
        <ProTable<TableItem>
          columns={columns}
          dataSource={loginData}
          rowKey="key"
          search={false}
          options={false}
          pagination={false}
          toolBarRender={false}
          loading={loading}
        />
      ),
    },
    {
      key: 'register',
      label: intl.formatMessage({ id: 'pcLogin.tab.register' }),
      children: (
        <ProTable<TableItem>
          columns={columns}
          dataSource={registerData}
          rowKey="key"
          search={false}
          options={false}
          pagination={false}
          toolBarRender={false}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 20 }}>
          <Text strong>Tips:</Text>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            {tips.map((tip, index) => (
              <li key={index}>
                <Text type="secondary">{`${index + 1}. ${tip}`}</Text>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Space size="middle">
            {languageOptions.map(lang => (
              <span 
                key={lang.key} 
                style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderBottom: activeLanguage === lang.key ? '2px solid #FF5F1F' : 'none',
                  color: activeLanguage === lang.key ? '#FF5F1F' : 'inherit',
                  fontWeight: activeLanguage === lang.key ? 'bold' : 'normal',
                }}
                onClick={() => handleLanguageChange(lang.key)}
              >
                {lang.label}
                {lang.tag && (
                  <Tag 
                    color="gold" 
                    style={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: -10,
                      fontSize: '12px',
                      padding: '0 4px',
                      height: '18px',
                      lineHeight: '18px'
                    }}
                  >
                    {lang.tag}
                  </Tag>
                )}
              </span>
            ))}
          </Space>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
          loading={loading}
          tabBarStyle={{ 
            borderBottom: '2px solid #f0f0f0',
            marginBottom: 16
          }}
        />

        <EditModal
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onSuccess={handleSaveSuccess}
          record={editingRecord}
          activeLanguage={activeLanguage}
          activeTab={activeTab}
          pcLoginData={pcLoginData}
        />
      </Card>
    </PageContainer>
  );
};

export default PCLogin;
