import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { walletTypeList } from '@/services/ant-design-pro/merchant';
// 定义表格数据接口
interface AccountItem {
  id: string;
  accountName: string;
  merchantName: string;
  balance: number;
  status: string;
  createTime: string;
  updateTime: string;
}

const AccountPage: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  
  // 定义表格列
  const columns: ProColumns<AccountItem>[] = [
    {
      title: intl.formatMessage({ id: 'account.table.id' }),
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'account.table.walletType' }),
      dataIndex: 'walletType',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({ id: 'account.table.walletTypeDefeat' }),
      dataIndex: 'walletTypeDefeat',
    },
    // {
    //   title: intl.formatMessage({ id: 'account.table.status' }),
    //   dataIndex: 'status',
    // },
    {
      title: intl.formatMessage({ id: 'account.table.createTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    // {
    //   title: intl.formatMessage({ id: 'account.table.updateTime' }),
    //   dataIndex: 'updateTime',
    //   valueType: 'dateTime',
    //   sorter: true,
    // },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a key="edit" onClick={() => handleEdit(record)}>
    //       {intl.formatMessage({ id: 'account.action.edit' })}
    //     </a>,
    //     <a key="details" onClick={() => handleDetails(record)}>
    //       {intl.formatMessage({ id: 'account.action.details' })}
    //     </a>,
    //   ],
    // },
  ];

  // 处理编辑
  const handleEdit = (record: AccountItem) => {
    message.info(
      `${intl.formatMessage({ id: 'account.message.editAccount' })}${record.accountName}`
    );
    // 这里添加编辑逻辑
  };

  // 处理查看详情
  const handleDetails = (record: AccountItem) => {
    message.info(
      `${intl.formatMessage({ id: 'account.message.viewAccountDetails' })}${record.accountName}`
    );
    // 这里添加查看详情逻辑
  };

  const getList=async (params:any,sorter:any,filter:any)=>{
    let res=await walletTypeList(params,sorter,filter);
    return {
      data:res.data.list,
      success:true,
    };
  }
  return (
    <PageContainer>
        <ProTable<AccountItem>
          actionRef={actionRef}
          rowKey="id"
          search={false}
          toolBarRender={() => [
            // 可以在这里添加工具栏按钮
          ]}
          request={getList}
          columns={columns}
        />

    </PageContainer>
  );
};

export default AccountPage; 