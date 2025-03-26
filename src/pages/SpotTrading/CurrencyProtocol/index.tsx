import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Form, Input, Select, Modal, message, Space, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;
const { TextArea } = Input;

interface ProtocolItem {
  id: string;
  name: string;
  currency: string;
  type: string;
  content: string;
  isActive: boolean;
}

const CurrencyProtocol: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [protocols, setProtocols] = useState<ProtocolItem[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentProtocol, setCurrentProtocol] = useState<ProtocolItem | undefined>(undefined);
  const [form] = Form.useForm();
  
  // 模拟加载数据
  React.useEffect(() => {
    setLoading(true);
    // 这里应该是从API获取数据
    setTimeout(() => {
      setProtocols([
        {
          id: '1',
          name: 'BTC充值协议',
          currency: 'BTC',
          type: 'deposit',
          content: 'BTC充值需要确认6个区块...',
          isActive: true,
        },
        {
          id: '2', 
          name: 'ETH提现说明',
          currency: 'ETH',
          type: 'withdraw',
          content: 'ETH提现手续费为0.005ETH...',
          isActive: true,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setCurrentProtocol(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ProtocolItem) => {
    setCurrentProtocol(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个协议吗？',
      onOk: () => {
        // 模拟删除操作
        setProtocols(protocols.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleStatusChange = (checked: boolean, record: ProtocolItem) => {
    // 模拟更新状态
    const newProtocols = protocols.map(item => {
      if (item.id === record.id) {
        return { ...item, isActive: checked };
      }
      return item;
    });
    setProtocols(newProtocols);
    message.success(`协议状态已${checked ? '启用' : '禁用'}`);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentProtocol) {
        // 更新
        const newProtocols = protocols.map(item => {
          if (item.id === currentProtocol.id) {
            return { ...item, ...values };
          }
          return item;
        });
        setProtocols(newProtocols);
        message.success('协议更新成功');
      } else {
        // 新增
        const newProtocol = {
          id: Date.now().toString(),
          ...values,
          isActive: true,
        };
        setProtocols([...protocols, newProtocol]);
        message.success('协议添加成功');
      }
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '协议名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: '协议类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        const typeMap: Record<string, string> = {
          'deposit': '充值',
          'withdraw': '提现',
          'trading': '交易',
        };
        return typeMap[text] || text;
      },
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: ProtocolItem) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ProtocolItem) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          style={{ marginBottom: 16 }}
          onClick={handleAdd}
        >
          添加协议
        </Button>
        
        <Table
          loading={loading}
          columns={columns}
          dataSource={protocols}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={currentProtocol ? '编辑协议' : '添加协议'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="协议名称"
            rules={[{ required: true, message: '请输入协议名称' }]}
          >
            <Input placeholder="请输入协议名称" />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select placeholder="请选择币种">
              <Option value="BTC">BTC</Option>
              <Option value="ETH">ETH</Option>
              <Option value="USDT">USDT</Option>
              <Option value="ALL">全部币种</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="type"
            label="协议类型"
            rules={[{ required: true, message: '请选择协议类型' }]}
          >
            <Select placeholder="请选择协议类型">
              <Option value="deposit">充值</Option>
              <Option value="withdraw">提现</Option>
              <Option value="trading">交易</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="协议内容"
            rules={[{ required: true, message: '请输入协议内容' }]}
          >
            <TextArea rows={6} placeholder="请输入协议内容" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CurrencyProtocol; 