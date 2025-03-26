import React, { useState, useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

// 币种类型定义
type CurrencyItem = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  networkType: string;
  status: 'enabled' | 'disabled';
  recharge: 'enabled' | 'disabled'; // 充值
  withdrawal: 'enabled' | 'disabled'; // 提现
  createdAt: string;
  updatedAt: string;
  sortId?: string; // 排序ID
};

// 模拟数据
const mockData: CurrencyItem[] = [
  {
    id: 1,
    name: '比特币',
    symbol: 'BTC',
    logo: 'https://example.com/btc.png',
    networkType: 'Bitcoin',
    status: 'enabled',
    recharge: 'enabled',
    withdrawal: 'enabled',
    createdAt: '2022-12-23 12:12:37',
    updatedAt: '2022-12-23 12:12:37',
    sortId: '003'
  },
  {
    id: 2,
    name: '泰达币',
    symbol: 'USDT',
    logo: 'https://example.com/usdt.png',
    networkType: '-',
    status: 'disabled',
    recharge: 'enabled',
    withdrawal: 'enabled',
    createdAt: '2022-12-23 12:12:12',
    updatedAt: '2022-12-23 12:12:12',
    sortId: '001'
  },
  // 添加更多模拟数据以匹配图片
  {
    id: 3,
    name: '波场',
    symbol: 'TRX',
    logo: 'https://example.com/trx.png',
    networkType: 'Tron (TRC20)',
    status: 'enabled',
    recharge: 'disabled',
    withdrawal: 'enabled',
    createdAt: '2022-12-23 12:12:12',
    updatedAt: '2022-12-23 12:12:12',
    sortId: '002'
  },
  // ... 其他币种
];

const CurrencyManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<CurrencyItem[]>([]);

  // 表格列定义
  const columns: ProColumns<CurrencyItem>[] = [
    {
      title: '排序',
      dataIndex: 'sortId',
      valueType: 'text',
      width: 80,
    },
    {
      title: '币种简称',
      dataIndex: 'symbol',
      valueType: 'text',
    },
    {
      title: '网络类型',
      dataIndex: 'networkType',
      valueType: 'text',
    },
    {
      title: '币种状态',
      dataIndex: 'status',

    },
    {
      title: '充值',
      dataIndex: 'recharge',
    },
    {
      title: '提现',
      dataIndex: 'withdrawal',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <a key="publish" onClick={() => handlePublish(record)}>
          发布上线
        </a>,
        <a key="addSameChain" onClick={() => handleAddSameChain(record)}>
          添加同币异链
        </a>,
        <a key="detail" onClick={() => handleDetail(record)}>
          币种简介
        </a>,
      ],
    },
  ];

  // 处理函数
  const handleAdd = () => {
    message.success('添加币种');
    // 这里实现添加逻辑
  };

  const handleEdit = (record: CurrencyItem) => {
    message.success(`编辑币种: ${record.name}`);
    // 这里实现编辑逻辑
  };

  const handlePublish = (record: CurrencyItem) => {
    message.success(`发布上线币种: ${record.name}`);
    // 实现发布上线逻辑
  };

  const handleAddSameChain = (record: CurrencyItem) => {
    message.success(`添加同币异链: ${record.name}`);
    // 实现添加同币异链逻辑
  };

  const handleDetail = (record: CurrencyItem) => {
    message.success(`查看币种简介: ${record.name}`);
    // 实现查看币种简介逻辑
  };

  const handleBatchDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的币种');
      return;
    }
    message.success(`批量删除${selectedRows.length}个币种`);
    // 这里实现批量删除逻辑
  };

  return (
    <PageContainer>

        <ProTable
          headerTitle="币种管理"
          actionRef={actionRef}
          rowKey="id"
          request={async (params) => {
            // 这里可以替换为实际的API请求
            console.log(params);
            return {
              data: mockData,
              success: true,
              total: mockData.length,
            };
          }}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          pagination={{
            pageSize: 10,
          }}
          options={false}
        />
    </PageContainer>
  );
};

export default CurrencyManagement; 