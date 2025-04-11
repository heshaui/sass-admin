import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from 'umi';
import RiskControlForm from './components/RiskControlForm';


const TradingRiskControl: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
  
  const fetchData = async () => {
    setLoading(true);
 
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setVisible(true);
  };
  
  const handleAdd = () => {
    setEditingRecord(null);
    setVisible(true);
  };
  
  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    
    setLoading(false);
  };
  
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '币对',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: '交易价格偏离',
      dataIndex: 'priceDeviation',
      key: 'priceDeviation',
    },
    {
      title: '近30分钟内价格波动',
      dataIndex: 'priceFluctuation',
      key: 'priceFluctuation',
    },
    {
      title: '报警通知',
      dataIndex: 'notificationEmail',
      key: 'notificationEmail',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            修改
          </Button>
          <Popconfirm
            title="确定要删除此规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
     
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加风控规则
          </Button>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={{ showSizeChanger: true }}
        />
      </Card>
      
      <RiskControlForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingRecord}
        loading={loading}
      />
    </PageContainer>
  );
};

export default TradingRiskControl; 