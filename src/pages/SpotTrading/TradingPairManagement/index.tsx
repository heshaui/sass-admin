import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProTable,
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, message, Modal, Space, Tag, Switch } from 'antd';
import TradingPairForm from './components/TradingPairForm';
import { exchangeCoinList,saveExchangeCoin } from '@/services/ant-design-pro/spot';
/**
 * 币对类型定义
 */
type TradingPair = {
  id: string;
  pairName: string;
  baseCurrency: string;
  quoteCurrency: string;
  status: 'enabled' | 'disabled';
  isVisible: boolean;
  openPrice: number;
  priceDecimal: number;
  amountDecimal: number;
  tags: string[];
  minAmount: number;
  maxAmount: number;
  tradingFee: number;
  createdAt: string;
  updatedAt: string;
  sortOrder: string;
};

/**
 * 币对管理页面
 */
const TradingPairManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TradingPair | undefined>(undefined);

  // 模拟数据获取
  const fetchTradingPairs = async (params: any) => {

    const res = await exchangeCoinList({
      pageNo: params.current,
      pageSize: params.pageSize,
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
      };
    }
  };

  // 处理添加或编辑币对
  const handleAddOrEdit = async (values: any) => {
    if (currentRow) {
     
    } else {
      // 添加新币对
      const res = await saveExchangeCoin(values);
      if(res.code==='0'){
        message.success('币对添加成功');
      }else{
        message.error(res.message);
      }
    }
    actionRef.current?.reload();
    setVisible(false);
    setCurrentRow(undefined);
  };

  // 表格列定义
  const columns: ProColumns<TradingPair>[] = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
    },
    {
      title: '币对',
      dataIndex: 'symbol',
    },
    {
      title: '是否开放交易',
      dataIndex: 'enable',
      render: (_, record) => (
        <Switch
          checked={record.enable === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '启用' : '禁用'}该币对交易吗？`,
              onOk: () => {
                message.success(`币对交易${checked ? '启用' : '禁用'}成功`);
                actionRef.current?.reload();
              },
            });
          }}
        />
      ),
    },
    {
      title: '是否显示',
      dataIndex: 'show',
      render: (_, record) => (
        <Switch
          checked={record.show===1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '显示' : '隐藏'}该币对吗？`,
              onOk: () => {
                message.success(`币对${checked ? '显示' : '隐藏'}成功`);
                actionRef.current?.reload();
              },
            });
          }}
        />
      ),
    },
    {
      title: '开盘价',
      dataIndex: 'openingPrice',
    },
    {
      title: '价格精度',
      dataIndex: 'baseCoinScale',
    },
    {
      title: '数量精度',
      dataIndex: 'coinScale',
    },
    {
      title: '币对标签',
      dataIndex: 'classLabel',
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setVisible(true);
          }}
        >
          修改
        </a>,
        <a 
          key="publish" 
          style={{ color: '#1890ff' }}
        >
          发布上线
        </a>,
        <a 
          key="cancelOrders" 
          style={{ color: '#ff4d4f' }}
        >
          撤销全部订单
        </a>,
        <a 
          key="mergeType"
        >
          提合类型
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TradingPair>
        headerTitle="币对管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setVisible(true);
            }}
          >
            <PlusOutlined /> 添加
          </Button>,
        ]}
        request={fetchTradingPairs}
        columns={columns}
      />

      <TradingPairForm
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setCurrentRow(undefined);
        }}
        onSubmit={handleAddOrEdit}
        values={currentRow}
      />
    </PageContainer>
  );
};

export default TradingPairManagement; 