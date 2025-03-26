import React, { useState, useRef,useEffect } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
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



const CurrencyManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<CurrencyItem[]>([]);

  const [data, setData] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchData = async (params: any) => {
    setLoading(true);
    const res = await tenantCurrencyCoinList({
      pageNo: current,
      pageSize: pageSize,
    });
    if(res.code==='0'){
    return {
      data: res.data.list,
      success: true,
      total: res.data.count,
    };
  }else{
    message.error(res.message);
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
  };

  // 表格列定义
  const columns: ProColumns<CurrencyItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '币种简称',
      dataIndex: 'coinName',
      valueType: 'text',
    },
    {
      title: '网络类型',
      dataIndex: 'mianChain',
      renderText: (text: string) => {
        return text === '1' ? '主链' : 'token';
      },
    },
    {
      title: '币种状态',
      dataIndex: 'status',
      renderText: (text: number) => {
        return text === 0 ? '正常' : '禁用';
      },

    },
    {
      title: '充值',
      dataIndex: 'canRecharge',
    },
    {
      title: '提现',
      dataIndex: 'canWithdraw',
    },
    {
      title: '转账',
      dataIndex: 'canTransfer',
    },
    {
      title: '自动提币',
      dataIndex: 'canAutoWithdraw',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
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
          request={fetchData}
          columns={columns}
          toolBarRender={
            () => [
              <Button type="primary" onClick={handleAdd}>
                添加币种
              </Button>,
            ]
          }
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          pagination={{
            pageSize: 10,
          }}
        />
    </PageContainer>
  );
};

export default CurrencyManagement; 