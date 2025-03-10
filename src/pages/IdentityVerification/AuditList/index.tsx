import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const AuditList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [form] = Form.useForm();
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 这里可以添加获取审核列表的逻辑
      // const data = await fetchAuditList();
      // 模拟数据
      const mockData = [
        {
          id: '1',
          userId: 'user001',
          userName: '张三',
          idType: 'idcard',
          submitTime: '2023-05-15 10:30:22',
          status: 'pending',
        },
        {
          id: '2',
          userId: 'user002',
          userName: '李四',
          idType: 'passport',
          submitTime: '2023-05-14 15:22:10',
          status: 'approved',
        },
        {
          id: '3',
          userId: 'user003',
          userName: '王五',
          idType: 'idcard',
          submitTime: '2023-05-13 09:15:42',
          status: 'rejected',
        },
      ];
      
      setDataSource(mockData);
    } catch (error) {
      console.error(error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: any) => {
    setCurrentRecord(record);
    setVisible(true);
    form.setFieldsValue({
      userId: record.userId,
      userName: record.userName,
      idType: record.idType,
      status: record.status,
      rejectReason: record.rejectReason || '',
    });
  };

  const handleApprove = async (id: string) => {
    try {
      // 这里可以添加审核通过的逻辑
      // await approveVerification(id);
      message.success('已通过审核');
      fetchData();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      const values = await form.validateFields();
      if (!values.rejectReason && values.status === 'rejected') {
        message.error('请填写拒绝原因');
        return;
      }
      
      // 这里可以添加拒绝审核的逻辑
      // await rejectVerification(currentRecord.id, values.rejectReason);
      message.success('已拒绝审核');
      setVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      key: 'idType',
      render: (text: string) => {
        const types: Record<string, string> = {
          'idcard': '身份证',
          'passport': '护照',
          'other': '其他证件',
        };
        return types[text] || text;
      }
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string, text: string }> = {
          'pending': { color: 'gold', text: '待审核' },
          'approved': { color: 'green', text: '已通过' },
          'rejected': { color: 'red', text: '已拒绝' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button 
                danger 
                size="small" 
                icon={<CloseOutlined />} 
                onClick={() => handleView(record)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="身份认证审核列表">
      <Card>
        <Table 
          rowKey="id"
          columns={columns} 
          dataSource={dataSource} 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title="审核详情"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            关闭
          </Button>,
          currentRecord?.status === 'pending' && (
            <Button 
              key="approve" 
              type="primary" 
              onClick={() => handleApprove(currentRecord.id)}
            >
              通过
            </Button>
          ),
          currentRecord?.status === 'pending' && (
            <Button 
              key="reject" 
              danger 
              onClick={handleReject}
            >
              拒绝
            </Button>
          ),
        ].filter(Boolean)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userId" label="用户ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="userName" label="用户名">
            <Input disabled />
          </Form.Item>
          <Form.Item name="idType" label="证件类型">
            <Select disabled>
              <Select.Option value="idcard">身份证</Select.Option>
              <Select.Option value="passport">护照</Select.Option>
              <Select.Option value="other">其他证件</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select disabled>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Form.Item>
          {(currentRecord?.status === 'rejected' || form.getFieldValue('status') === 'rejected') && (
            <Form.Item name="rejectReason" label="拒绝原因" rules={[{ required: true, message: '请填写拒绝原因' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AuditList; 