import React, { useRef, useState } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components';
import { queryRateList, addRate, updateRate, deleteRate } from '../../services/ant-design-pro/Rate';
import AvatarUpload from "@/components/AvatarUpload/index";

const Rate: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [editMode, setEditMode] = useState<boolean>(false);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (editMode && currentRow) {
        await updateRate({
          ...values,
          id: currentRow.id,
        });
        message.success('更新成功');
      } else {
        await addRate(values);
        message.success('添加成功');
      }
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };

  // 处理编辑
  const handleEdit = (record: any) => {
    setCurrentRow(record);
    setEditMode(true);
    setCreateModalVisible(true);
  };

  const columns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      search: false,
      render: (_, record) => (
        <img 
          src={record.iconUrl} 
          style={{ maxWidth: '200px', maxHeight: '100px' }}
        />
      ),
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      valueType: 'text',
    },
    {
      title: '符号',
      dataIndex: 'symbol',
      search: false,
    },
    {
      title: '汇率',
      dataIndex: 'exchangeRate',
      search: false,
    },
    {
      title: '精度',
      dataIndex: 'accuracy',
      search: false,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      renderText: (text: string) => text === '1' ? '是' : '否',
      valueEnum: {
        true: { text: '是', status: 'Success' },
        false: { text: '否', status: 'Default' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)} style={{ color: '#1890ff' }}>
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer header={{ title: '计价单位' }}>
      <ProTable
        headerTitle={false}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            <Button 
              key="search" 
              type="primary" 
              onClick={() => formProps.form?.submit()}
              icon={<SearchOutlined />}
            >
              查询
            </Button>,
          ],
        }}
        options={false}
        columns={columns}
        request={async (params, sort, filter) => {
          // 转换分页参数名称
          const { current, pageSize, ...restParams } = params;
          const convertedParams = {
            ...restParams,
            PageNo: current,
            PageSize: pageSize,
          };
          
          const response = await queryRateList(convertedParams);
          return {
            data: response.data.list || [],
            success: response.success,
            total: response.count || 0,
          };
        }}
        pagination={{
          pageSize: 20,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <ModalForm
        title={editMode ? '编辑计价单位' : '新增计价单位'}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        onFinish={handleSubmit}
        initialValues={currentRow}
      >
        <ProFormText
          name="简称"
          label="币种代码"
          placeholder="请输入币种代码，例如: USD"
          rules={[{ required: true, message: '请输入币种代码' }]}
        />
        <ProFormText
          name="shortName"
          label="符号"
          placeholder="请输入币种名称，例如: 美元"
          rules={[{ required: true, message: '请输入币种名称' }]}
        />
        <ProFormDigit
          name="precision"
          label="精度"
          placeholder="请输入精度"
          min={0}
          max={8}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '请输入精度' }]}
        />
        <ProFormDigit
          name="exchangeRate"
          label="汇率"
          placeholder="请输入汇率"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入汇率' }]}
        />
        
        <ProFormDigit name="iconUrl"  label="图标">
        <AvatarUpload onChange={(url) => form.setFieldsValue({ iconUrl: url })} />
        </ProFormDigit>
        <ProFormSwitch
          name="isEnabled"
          label="是否启用"
          checkedChildren="是"
          unCheckedChildren="否"
          rules={[{ required: true, message: '请选择是否启用' }]}
        />
       
      </ModalForm>

     

    </PageContainer>
  );
};

export default Rate; 