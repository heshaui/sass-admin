import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, message, Tabs, Radio,Button,Image} from 'antd';
import { getTenantKeyParams,updateValue } from '@/services/ant-design-pro/kv';
import EditModal from './components/EditModal';

interface TableItem {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}

const Background: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [backgroundData, setBackgroundData] = useState<any>(null);
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  const [activeMode, setActiveMode] = useState('dark');
  const [activeStatus, setActiveStatus] = useState('before_login');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TableItem | null>(null);
  const [dataSource, setDataSource] = useState<TableItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('1');
  // 获取背景图数据
  const fetchBackgroundData = async () => {
    try {
      setLoading(true);
      const result = await getTenantKeyParams({ key: 'HomeBanner' });
      if (result.code === '0' && result.data) {
        const parsedData = JSON.parse(result.data.keyValue);
        // 获取当前选择条件下的数据对象
        const currentData = parsedData?.[activeLanguage]?.[activeMode]?.[activeStatus];
        // 确保数据是数组形式
        const filteredData = currentData ? [currentData] : [];
        setDataSource(filteredData);
        setBackgroundData(parsedData);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'webConfig.background.fetchError' }), error);
      message.error(intl.formatMessage({ id: 'webConfig.background.fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };

  // 确保在组件挂载时获取数据
  useEffect(() => {
    fetchBackgroundData();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 在语言、模式或状态改变时更新显示的数据
  useEffect(() => {
    if (backgroundData) {
      const currentData = backgroundData?.[activeLanguage]?.[activeMode]?.[activeStatus];
      const filteredData = currentData ? [currentData] : [];
      setDataSource(filteredData);
    }
  }, [activeLanguage, activeMode, activeStatus, backgroundData]);

  const columns: ProColumns<TableItem>[] = [
    {
      title: intl.formatMessage({ id: 'webConfig.background.column.title' }),
      dataIndex: 'title',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'webConfig.background.column.subtitle' }),
      dataIndex: 'subtitle',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'webConfig.background.column.image' }),
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
      title: intl.formatMessage({ id: 'webConfig.background.column.buttonText' }),
      dataIndex: 'buttonText',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'webConfig.background.column.url' }),
      dataIndex: 'url',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'webConfig.background.column.action' }),
      valueType: 'option',
      width: 100,
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>{intl.formatMessage({ id: 'webConfig.background.action.edit' })}</a>,
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

  // 添加查看按钮点击处理函数
  const handleViewWebsite = () => {
    window.open('https://www.imsaas.work/zh', '_blank');
  };

  return (
    <PageContainer>
    <Card>
    <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}    >
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
                {intl.formatMessage({ id: 'webConfig.background.template' })}1
              </Radio>
              <Button 
                type="primary" 
                style={{width:'100px',marginTop:'10px'}} 
                onClick={handleViewWebsite}
              >
                {intl.formatMessage({ id: 'webConfig.background.view' })}
              </Button>
            </div>
    </Card>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Radio.Group 
              value={activeLanguage} 
              onChange={(e) => setActiveLanguage(e.target.value)}
            >
              <Radio.Button value="en_US">English</Radio.Button>
              <Radio.Button value="zh_CN">{intl.formatMessage({ id: 'webConfig.background.language.zhCN' })}</Radio.Button>
              <Radio.Button value="zh_HK">{intl.formatMessage({ id: 'webConfig.background.language.zhTW' })}</Radio.Button>
              <Radio.Button value="ja_JP">日本語</Radio.Button>
              <Radio.Button value="ko_KR">한국인</Radio.Button>
            </Radio.Group>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Radio.Group 
              value={activeMode} 
              onChange={(e) => setActiveMode(e.target.value)}
            >
              <Radio.Button value="dark">{intl.formatMessage({ id: 'webConfig.background.mode.dark' })}</Radio.Button>
              <Radio.Button value="light">{intl.formatMessage({ id: 'webConfig.background.mode.light' })}</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <Radio.Group 
              value={activeStatus} 
              onChange={(e) => setActiveStatus(e.target.value)}
            >
              <Radio.Button value="before_login">{intl.formatMessage({ id: 'webConfig.background.status.beforeLogin' })}</Radio.Button>
              <Radio.Button value="after_login">{intl.formatMessage({ id: 'webConfig.background.status.afterLogin' })}</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
          {intl.formatMessage({ id: 'webConfig.background.tips' })}
        </div>

        <ProTable<TableItem>
          columns={columns}
          dataSource={dataSource}
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