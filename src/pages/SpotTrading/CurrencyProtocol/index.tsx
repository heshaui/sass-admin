import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Form, Modal, message, Space, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { protocolTypeList,deleteProtocolTypeById,saveProtocolType,updateProtocolTypeById } from '@/services/ant-design-pro/spot';
 import type { ProColumns, ActionType } from '@ant-design/pro-components';
import ProtocolForm, { ProtocolItem } from './components/ProtocolForm';

const CurrencyProtocol: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentProtocol, setCurrentProtocol] = useState();
  const [form] = Form.useForm();
  const actionRef = React.useRef<ActionType>();
  
  const getList = async (params:any) => {
    setLoading(true);
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
    }
    const res = await protocolTypeList(data);
    if (res.code === '0') {
      setLoading(false);
      return {
        data: res.data.list,
        total: res.data.count,
      }
    }
    
  };

  const handleAdd = () => {
    setCurrentProtocol(undefined);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (id: number) => {
    setCurrentProtocol(id);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个协议吗？',
      onOk: async () => {
        // 模拟删除操作
        const res = await deleteProtocolTypeById({id:id});
        if (res.code === '0') {
          message.success('删除成功');
        }
      },
    });
  };



  const handleModalOk = async () => {
    form.validateFields().then(async values => {
      if (currentProtocol) {
        values.id = currentProtocol;
        const res = await updateProtocolTypeById(values);
        if (res.code === '0'&&res.data) {
          message.success('协议更新成功');
          actionRef.current?.reload();
        }else{
          message.error(res.message);
        }
      } else {
        // 新增
        const res = await saveProtocolType(values);
        if (res.code === '0') {
          message.success('协议添加成功');
          actionRef.current?.reload();
        }
      }
      setModalVisible(false);
    });
  };

  const columns: ProColumns<ProtocolItem>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: '协议名称',
      dataIndex: 'protocolName',
      key: 'protocolName',
      search: true,
    },
    {
      title: '代币协议',
      dataIndex: 'protocol',
      key: 'protocol',
      search: true,
    },
    {
      title: '区块浏览器',
      dataIndex: 'browser',
      key: 'browser',
      search: true,
    },
    {
      title: '主币名称',
      dataIndex: 'symbol',
      key: 'symbol',
      search: true,
    },
    {
      title: '链ID',
      dataIndex: 'chainId',
      key: 'chainId',
      search: true,
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: (_, record: ProtocolItem) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record.id)}
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

  useEffect(() => {
  }, []);

  return (
    <PageContainer>
      <ProTable<ProtocolItem>
        headerTitle="协议管理"
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        toolBarRender={() => [
          <Button 
            type="primary" 
            key="add" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
          >
            添加协议
          </Button>,
        ]}
        columns={columns}
        request={getList}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentProtocol ? '编辑协议' : '添加协议'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            提交
          </Button>,
        ]}
      >
        <ProtocolForm 
          form={form} 
          id={currentProtocol} 
        />
      </Modal>
    </PageContainer>
  );
};

export default CurrencyProtocol; 