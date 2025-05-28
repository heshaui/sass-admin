import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Form, Modal, message, Space, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { protocolTypeList,deleteProtocolTypeById,saveProtocolType,updateProtocolTypeById } from '@/services/ant-design-pro/spot';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import ProtocolForm, { ProtocolItem } from './components/ProtocolForm';
import { useIntl } from 'umi';

const CurrencyProtocol: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentProtocol, setCurrentProtocol] = useState();
  const [form] = Form.useForm();
  const actionRef = React.useRef<ActionType>();
  
  const getList = async (params:any) => {
    console.log(params);
    setLoading(true);
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      keyword:params.keyword,
      protocolName:params.protocolName,
      protocol:params.protocol,
      symbol:params.symbol,
      chainId:params.chainId,
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
      title: intl.formatMessage({ id: 'protocol.confirm.delete' }),
      content: intl.formatMessage({ id: 'protocol.confirm.deleteContent' }),
      onOk: async () => {
        // Delete operation
        const res = await deleteProtocolTypeById({id:id});
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'protocol.message.deleteSuccess' }));
          actionRef.current?.reload();
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
          message.success(intl.formatMessage({ id: 'protocol.message.updateSuccess' }));
          actionRef.current?.reload();
        }else{
          message.error(res.message);
        }
      } else {
        // Add new protocol
        const res = await saveProtocolType(values);
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'protocol.message.addSuccess' }));
          actionRef.current?.reload();
        }
      }
      setModalVisible(false);
    });
  };

  const columns: ProColumns<ProtocolItem>[] = [
    {
      title: intl.formatMessage({ id: 'protocol.column.id' }),
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'protocol.column.protocolName' }),
      dataIndex: 'protocolName',
      key: 'protocolName',
      search: true,
    },
    {
      title: intl.formatMessage({ id: 'protocol.column.protocol' }),
      dataIndex: 'protocol',
      key: 'protocol',
      search: true,
    },
    {
      title: intl.formatMessage({ id: 'protocol.column.browser' }),
      dataIndex: 'browser',
      key: 'browser',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'protocol.column.symbol' }),
      dataIndex: 'symbol',
      key: 'symbol',
      search: true,
    },
    {
      title: intl.formatMessage({ id: 'protocol.column.chainId' }),
      dataIndex: 'chainId',
      key: 'chainId',
      search: true,
    },
    {
      title: intl.formatMessage({ id: 'protocol.column.action' }),
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
            {intl.formatMessage({ id: 'protocol.edit' })}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            {intl.formatMessage({ id: 'protocol.delete' })}
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
        headerTitle={intl.formatMessage({ id: 'protocol.title' })}
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
            {intl.formatMessage({ id: 'protocol.add' })}
          </Button>,
        ]}
        columns={columns}
        request={getList}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={currentProtocol ? intl.formatMessage({ id: 'protocol.edit' }) : intl.formatMessage({ id: 'protocol.add' })}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            {intl.formatMessage({ id: 'protocol.button.cancel' })}
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {intl.formatMessage({ id: 'protocol.button.submit' })}
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