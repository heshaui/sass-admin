import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, message, Tabs, Radio } from 'antd';
import { getTenantKeyParams } from '@/services/ant-design-pro/kv';
import EditModal from './components/EditModal';

interface TableItem {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}

const Background: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [backgroundData, setBackgroundData] = useState<any>(null);
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [activeMode, setActiveMode] = useState('夜间版');
  const [activeStatus, setActiveStatus] = useState('登录前');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TableItem | null>(null);

  // 获取背景图数据
  const fetchBackgroundData = async () => {
    try {
      setLoading(true);
      const result = await getTenantKeyParams('background');
      if (result.success && result.data) {
        setBackgroundData(JSON.parse(result.data));
      }
    } catch (error) {
      console.error('获取背景图数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackgroundData();
  }, []);

  const columns: ProColumns<TableItem>[] = [
    {
      title: '主标题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '副标题',
      dataIndex: 'subtitle',
      width: 200,
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: (_, record) => (
        <img 
          src={record.image} 
          alt={record.title} 
          style={{ maxWidth: '200px', maxHeight: '100px' }}
        />
      ),
    },
    {
      title: '按钮文案',
      dataIndex: 'buttonText',
      width: 150,
    },
    {
      title: '跳转地址',
      dataIndex: 'url',
      width: 200,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
      ],
    },
  ];

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
    fetchBackgroundData();
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Radio.Group 
              value={activeLanguage} 
              onChange={(e) => setActiveLanguage(e.target.value)}
            >
              <Radio.Button value="English">English</Radio.Button>
              <Radio.Button value="简体中文">简体中文</Radio.Button>
              <Radio.Button value="繁體中文">繁體中文</Radio.Button>
              <Radio.Button value="日本語">日本語</Radio.Button>
              <Radio.Button value="한국인">한국인</Radio.Button>
            </Radio.Group>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Radio.Group 
              value={activeMode} 
              onChange={(e) => setActiveMode(e.target.value)}
            >
              <Radio.Button value="夜间版">夜间版</Radio.Button>
              <Radio.Button value="日间版">日间版</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <Radio.Group 
              value={activeStatus} 
              onChange={(e) => setActiveStatus(e.target.value)}
            >
              <Radio.Button value="登录前">登录前</Radio.Button>
              <Radio.Button value="登录后">登录后</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
          Tips: 建议尺寸：2560*540, 若不配置则使用系统默认内容！
        </div>

        <ProTable<TableItem>
          columns={columns}
          dataSource={[]}
          rowKey="key"
          search={false}
          options={false}
          pagination={false}
          loading={loading}
          toolBarRender={false}
        />

        <EditModal
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onSuccess={handleSaveSuccess}
          record={editingRecord}
          backgroundData={backgroundData}
          activeLanguage={activeLanguage}
          activeMode={activeMode}
          activeStatus={activeStatus}
        />
      </Card>
    </PageContainer>
  );
};

export default Background; 