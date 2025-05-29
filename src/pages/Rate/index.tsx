import React, { useRef, useState, createRef } from 'react';
import { useIntl } from '@umijs/max';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns, FormInstance } from '@ant-design/pro-components';
import { Button, message, Switch,Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormDigit, ProFormSwitch, ProFormItem } from '@ant-design/pro-components';
import { queryRateList, updateRate, queryTenantRateList,updateExchangeRateById,updateTenantExchangeRate } from '../../services/ant-design-pro/Rate';
import AvatarUpload from "@/components/AvatarUpload/index";

const Rate: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const formRef = useRef<FormInstance>();

  const merchantUpdateRate=async(id:string,status:number)=>{
    const res= await updateRate({
      id,
      status,
    });
    if(res.code === '0'){
      message.success(intl.formatMessage({ id: 'rate.message.operation.success' }));
      actionRef.current?.reload();
    }else{
      message.error(res.message);
    }
  }

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {

     const res= await updateExchangeRateById({
          ...values,
          id: currentRow.id,
        });
        if(res.code === '0'){
        message.success(intl.formatMessage({ id: 'rate.message.operation.success' }));
        }else{
          message.error(res.message);
        }
    
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;  
    } catch (error) {
      message.error(intl.formatMessage({ id: 'rate.message.operation.failed' }));
      return false;
    }
  };

  // 处理编辑
  const handleEdit = (record: any) => {
    setCurrentRow(record);
    setEditMode(true);
    setCreateModalVisible(true);
    
    // 延迟设置表单值，确保表单已完全挂载
    setTimeout(() => {
      formRef.current?.setFieldsValue({
        ...record,
        // 将 status 转换为 boolean 值用于 Switch 组件
        status: record.status === 1
      });
    }, 100);
  };

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'rate.table.id' }),
      dataIndex: 'id',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'rate.table.icon' }),
      dataIndex: 'iconUrl',
      search: false,
      render: (_, record: any) => (
        <Image 
          src={record.iconUrl} 
          width={50} 
          height={50} 
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'rate.table.shortName' }),
      dataIndex: 'shortName',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'rate.table.symbol' }),
      dataIndex: 'symbol',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'rate.table.exchangeRate' }),
      dataIndex: 'exchangeRate',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'rate.table.accuracy' }),
      dataIndex: 'accuracy',
      search: false,
    },
    // {
    //   title: '是否启用',
    //   dataIndex: 'status',
    //   renderText: (text: string) => text === 1 ? '是' : '否',
    //   valueEnum: {
    //     true: { text: '是', status: 'Success' },
    //     false: { text: '否', status: 'Default' },
    //   },
    // },
    ...(isAdmin ? [{
      title: intl.formatMessage({ id: 'rate.table.show' }),
      dataIndex: 'status',
      key: 'status',
      renderText: (text: number) => text === 1 ? '是' : '否',
      valueEnum: {
            1: { text: '是', status: 'Success' },
            0: { text: '否', status: 'Default' },
          },
    }] : []),

    ...(!isAdmin ? [{
      title: intl.formatMessage({ id: 'rate.table.enable' }),
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        1: { text: '是', status: 'Success' },
        0: { text: '否', status: 'Default' },
      },
      render: (_: any, record: any) => [
        <Switch key="switch" checked={record.status === 1} onChange={(checked: boolean) => merchantUpdateRate(record.id, checked ? 1 : 0)} />
      ]
    }] : []),
    {
      title: intl.formatMessage({ id: 'rate.table.action' }),
      valueType: 'option',
      render: (_, record) => [isAdmin?
        <a key="edit" onClick={() => handleEdit(record)} style={{ color: '#1890ff' }}>
          {intl.formatMessage({ id: 'rate.table.action.edit' })}
        </a>:
       ''
      ],
    },
  ];

  return (
    <PageContainer header={{ title: intl.formatMessage({ id: 'rate.title' }) }}>
      <ProTable
        headerTitle={false}
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params, sort, filter) => {
          // 转换分页参数名称
          const { current, pageSize, ...restParams } = params;
          const convertedParams = {
            ...restParams,
            pageNo: current,
            pageSize: pageSize,
          };
         
          const response = isAdmin ? await queryRateList(convertedParams) : await queryTenantRateList(convertedParams);
          return {
            data: response.data.list || [],
            success: response.code === '0',
            total: response.data.count || 0,
          };
        }}
        pagination={{
          pageSize: 20,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => intl.formatMessage({ id: 'pagination.total' }, { total }),
        }}
      />

      <ModalForm
        title={editMode ? intl.formatMessage({ id: 'rate.modal.edit' }) : intl.formatMessage({ id: 'rate.modal.create' })}
        width="400px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleSubmit}
        formRef={formRef}
        modalProps={{
          destroyOnClose: true,
          afterClose: () => formRef.current?.resetFields()
        }}
      >
        <ProFormText
          name="shortName"
          label={intl.formatMessage({ id: 'rate.form.shortName' })}
          placeholder={intl.formatMessage({ id: 'rate.form.shortName.placeholder' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'rate.form.shortName.required' }) }]}
        />
        <ProFormText
          name="symbol"
          label={intl.formatMessage({ id: 'rate.form.symbol' })}
          placeholder={intl.formatMessage({ id: 'rate.form.symbol.placeholder' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'rate.form.symbol.required' }) }]}
        />
        <ProFormDigit
          name="accuracy"
          label={intl.formatMessage({ id: 'rate.form.accuracy' })}
          placeholder={intl.formatMessage({ id: 'rate.form.accuracy.placeholder' })}
          min={0}
          max={18}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: intl.formatMessage({ id: 'rate.form.accuracy.required' }) }]}
        />
        <ProFormDigit
          name="exchangeRate"
          label={intl.formatMessage({ id: 'rate.form.exchangeRate' })}
          placeholder={intl.formatMessage({ id: 'rate.form.exchangeRate.placeholder' })}
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: intl.formatMessage({ id: 'rate.form.exchangeRate.required' }) }]}
        />
        
        <ProFormItem
          name="iconUrl"
          label={intl.formatMessage({ id: 'rate.form.icon' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'rate.form.icon.required' }) }]}
        >
          <AvatarUpload 

            onChange={(url) => formRef.current?.setFieldsValue({ iconUrl: url })} 
          />
        </ProFormItem>
        <ProFormSwitch
          name="status"
          label={intl.formatMessage({ id: 'rate.form.status' })}
          checkedChildren={intl.formatMessage({ id: 'rate.form.status.yes' })}
          unCheckedChildren={intl.formatMessage({ id: 'rate.form.status.no' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'rate.form.status.required' }) }]}
          valuePropName="checked"
          transform={(value) => ({ status: value ? 1 : 0 })}
        />
       
      </ModalForm>

     

    </PageContainer>
  );
};

export default Rate; 