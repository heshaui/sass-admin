import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Tabs, Tag, Typography, Image, Space } from 'antd';
import type { TabsProps } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';

const { Text } = Typography;

interface TableItem {
  key: string;
  title: string;
  image: string;
  url: string;
}

interface LanguageItem {
  key: string;
  label: string;
  tag?: string;
}

const PCLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [activeLanguage, setActiveLanguage] = useState('en');

  // 提示信息
  const tips = [
    '若配置，则使用您的配置；若不配置，则使用系统默认；',
    '英文语言&登录为必填项，其他语言若不配置则默认与英文下场景一致；',
    '图片建议尺寸：126*869',
  ];

  // 语言选项
  const languages: LanguageItem[] = [
    { key: 'en', label: 'English' },
    { key: 'zh_CN', label: '简体中文' },
    { key: 'zh_TW', label: '繁體中文' },
    { key: 'ja', label: '日本語' },
    { key: 'ko', label: '한국어', tag: '2' },
  ];

  // 处理语言切换
  const handleLanguageChange = (langKey: string) => {
    setActiveLanguage(langKey);
    // 这里可以添加加载对应语言数据的逻辑
  };

  // 表格列定义
  const columns: ProColumns<TableItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      search: false,
      render: (_, record) => (
        <Image
          src={record.image}
          alt="登录图片"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '跳转地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <a key="edit">编辑</a>,
      ],
    },
  ];

  // 表格数据 - 根据当前选中的语言可以加载不同的数据
  const loginData: TableItem[] = [
    {
      key: '1',
      title: '这是一个标题',
      image: 'https://via.placeholder.com/80',
      url: 'http.ww.mbti.com',
    },
  ];

  const registerData: TableItem[] = [];

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'login',
      label: '登录',
      children: (
        <ProTable<TableItem>
          columns={columns}
          dataSource={loginData}
          rowKey="key"
          search={false}
          options={false}
          pagination={false}
          toolBarRender={false}
        />
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <ProTable<TableItem>
          columns={columns}
          dataSource={registerData}
          rowKey="key"
          search={false}
          options={false}
          pagination={false}
          toolBarRender={false}
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
            {languages.map(lang => (
              <span 
                key={lang.key} 
                style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderBottom: activeLanguage === lang.key ? '2px solid #1890ff' : 'none',
                  color: activeLanguage === lang.key ? '#1890ff' : 'inherit',
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
          tabBarStyle={{ 
            borderBottom: '2px solid #f0f0f0',
            marginBottom: 16
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default PCLogin;
