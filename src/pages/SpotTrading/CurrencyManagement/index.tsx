import React, { useState, useRef,useEffect } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Button, message, Modal,Switch } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { tenantCurrencyCoinList,saveTenantCurrencyCoin,currencyCoinList,updateCurrencyCoinById,adminSaveCurrencyCoin,adminSaveCurrencyCoinExt } from '@/services/ant-design-pro/spot';
import CurrencyForm from './components/CurrencyForm';
import ExtendInfoForm, { ExtendInfoFormData } from './components/ExtendInfoForm';
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
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [extendInfoVisible, setExtendInfoVisible] = useState<boolean>(false);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyItem | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === "1";

  const fetchData = async (params: any) => {
    setLoading(true);

    const res = isAdmin ? await currencyCoinList({
      pageNo: current,
      pageSize: pageSize,
    }) : await tenantCurrencyCoinList({
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
      title: '排序',
      dataIndex: 'sort',
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
      render: (_, record) => (
        <Switch
          checked={record.canRecharge===1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}充值吗？`,
              onOk: () => {
                message.success(`充值${checked ? '开启' : '关闭'}成功`);
                actionRef.current?.reload();
              },
            });
          }}
        />
      ),
    },
    {
      title: '提现',
      dataIndex: 'canWithdraw',
      render: (_, record) => (
        <Switch
          checked={record.canWithdraw===1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}提现吗？`,
              onOk: () => {
                message.success(`提现${checked ? '开启' : '关闭'}成功`);
                actionRef.current?.reload();
              },
            });
          }}
        />
      ),
    },
    {
      title: '转账',
      dataIndex: 'canTransfer',
      render: (_, record) => (
        <Switch
          checked={record.canTransfer===1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}转账吗？`,
              onOk: () => {
                message.success(`转账${checked ? '开启' : '关闭'}成功`);
                actionRef.current?.reload();
              },
            });
          }}
        />
      ),
    },
    {
      title: '自动提币',
      dataIndex: 'canAutoWithdraw',
      render: (_, record) => (
        <Switch
          checked={record.canAutoWithdraw===1} 
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}自动提币吗？`,
              onOk: () => {
                message.success(`自动提币${checked ? '开启' : '关闭'}成功`);
                actionRef.current?.reload();
              },
            });
          }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => isAdmin ? [
        <Button key="edit" onClick={() => handleEdit(record)}>
          编辑
        </Button>,
        <Button key="extendInfo" onClick={() => handleExtendInfo(record)}>
          拓展信息增加
        </Button>
      ] : [
        <Button key="edit" onClick={() => handleEdit(record)}>
          编辑
        </Button>,
        <Button key="addSameChain" onClick={() => handleAddSameChain(record)}>
          添加同币异链
        </Button>,
        <Button key="detail" onClick={() => handleDetail(record)}>
          币种简介
        </Button>,
        <Button key="extendInfo" onClick={() => handleExtendInfo(record)}>
          拓展信息
        </Button>
      ],
    },
  ];

  // 处理函数
  const handleAdd = () => {
    setFormMode('add');
    setCurrentCurrency(null);
    setFormVisible(true);

  };

  const handleEdit = (record: CurrencyItem) => {
    setFormMode('edit');
    setCurrentCurrency(record.id);
    setFormVisible(true);

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

  const handleExtendInfo = (record: CurrencyItem) => {
    setCurrentCurrency(record);
    setExtendInfoVisible(true);
  };

  const handleExtendInfoSubmit = async (values: ExtendInfoFormData) => {
    console.log('拓展信息表单提交数据:', values);
    
    let res;
    if(isAdmin){
      res = await adminSaveCurrencyCoinExt(values);
    }
    
    if(res && res.code==='0'){
      message.success('拓展信息保存成功');
    }else if(res){
      message.error(res.message);
    }
    
    setExtendInfoVisible(false);
    actionRef.current?.reload();
  };

  const handleExtendInfoCancel = () => {
    setExtendInfoVisible(false);
  };

  const handleBatchDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的币种');
      return;
    }
    message.success(`批量删除${selectedRows.length}个币种`);
    // 这里实现批量删除逻辑
  };

  const handleFormSubmit = async (values: CurrencyFormData) => {
    console.log('表单提交数据:', values);
    if (formMode === 'add') {
      let res;
      if(isAdmin){
         res = await adminSaveCurrencyCoin(values);
      }else{
         res = await saveTenantCurrencyCoin(values);
      }
      if(res.code==='0'){
        message.success('添加币种成功');
      }else{
        message.error(res.message);
      }
    } else {
      message.success(`编辑币种成功: ${values.coinName}`);
    }

    // 重新加载数据
    actionRef.current?.reload();
  };

  const handleFormCancel = () => {
    console.log('取消');
    setFormVisible(false);
  };

  return (
    <PageContainer>
      {!formVisible ? (
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
      ) : (
        <CurrencyForm
          initialValues={currentCurrency}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
      
      <ExtendInfoForm
        visible={extendInfoVisible}
        initialValues={currentCurrency ? { coinId: currentCurrency.id } : null}
        onSubmit={handleExtendInfoSubmit}
        onCancel={handleExtendInfoCancel}
      />
    </PageContainer>
  );
};

export default CurrencyManagement; 