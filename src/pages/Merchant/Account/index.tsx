import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ProTable } from '@ant-design/pro-components';
import {  message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {walletTypeList} from '@/services/ant-design-pro/merchant';
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
  const actionRef = useRef<ActionType>();
  
  // 定义表格列
  const columns: ProColumns<AccountItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '账户唯一标识',
      dataIndex: 'walletType',
      valueType: 'text',
    },
    {
      title: '账户类型',
      dataIndex: 'walletTypeDefeat',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      sorter: true,
    },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
    //     <a key="details" onClick={() => handleDetails(record)}>详情</a>,
    //   ],
    // },
  ];

  // 处理编辑
  const handleEdit = (record: AccountItem) => {
    message.info(`编辑账户：${record.accountName}`);
    // 这里添加编辑逻辑
  };

  // 处理查看详情
  const handleDetails = (record: AccountItem) => {
    message.info(`查看账户详情：${record.accountName}`);
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