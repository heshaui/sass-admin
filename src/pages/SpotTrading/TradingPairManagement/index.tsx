import {
  exchangeCoinList,
  saveExchangeCoin,
  updateExchangeCoinById,
  updateExchangeGroup,
  revocationExchangeCoinOrder
} from '@/services/ant-design-pro/spot';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal, Radio, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import TradingPairForm from './components/TradingPairForm';
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
  baseSymbol: string;
  coinSymbol: string;
  enable: number;
  show: number;
  coinScale: number;
  baseCoinScale: number;
};

/**
 * 币对管理页面
 */
const TradingPairManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TradingPair | undefined>(undefined);
  const [matchingTypeVisible, setMatchingTypeVisible] = useState<boolean>(false);
  const [matchingType, setMatchingType] = useState<number>(1);
  const [currentMatchingRow, setCurrentMatchingRow] = useState<TradingPair | undefined>(undefined);

  const fetchTradingPairs = async (params: any) => {
    const res = await exchangeCoinList({
      pageNo: params.current,
      pageSize: params.pageSize,
      enable: params.enable,
      show: params.show,
    });
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    } else {
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
      values.id = currentRow.id;
      values.show = currentRow.show;
      const res = await updateExchangeCoinById(values);
      if (res.code === '0') {
        message.success('币对修改成功');
      } else {
        message.error(res.message);
      }
      actionRef.current?.reload();
      setVisible(false);
      setCurrentRow(undefined);
    } else {
      // 添加新币对
      values.show = 0;
      const res = await saveExchangeCoin(values);
      if (res.code === '0') {
        message.success('币对添加成功');
      } else {
        message.error(res.message);
      }
    }
    actionRef.current?.reload();
    setVisible(false);
    setCurrentRow(undefined);
  };

  //设置币对显示状态
  const handleShowOrHide = async (values: any, checked: boolean) => {
    let data = {
      id: values.id,
      show: checked ? 1 : 0,
    };
    const res = await updateExchangeCoinById(data);
    if (res.code === '0') {
      message.success('币对显示状态设置成功');
    } else {
      message.error(res.message);
    }
    actionRef.current?.reload();
  };

  //设置币对交易状态
  const handleEnableOrDisable = async (values: any, checked: boolean) => {
    let data = {
      id: values.id,
      enable: checked ? 1 : 0,
    };
    const res = await updateExchangeCoinById(data);
    if (res.code === '0') {
      message.success('币对交易状态设置成功');
    } else {
      message.error(res.message);
    }
    actionRef.current?.reload();
  };

  // 处理撮合类型选择
  const handleMatchingTypeSubmit = async () => {
    try {
      const res = await updateExchangeGroup({
        id: currentMatchingRow?.id,
        group: matchingType,
      });
      if (res.code === '0' && res.data) {
        message.success('撮合类型设置成功');
        setMatchingTypeVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('撮合类型设置失败');
    }
  };


  const handleCancelOrders=async (record: TradingPair) => {
    //弹出确认框
    Modal.confirm({
      title: `确定要撤销所有${record.coinSymbol}/${record.baseSymbol}订单吗？`,
      onOk: async () => {
        const res= await revocationExchangeCoinOrder({
          symbol: record.coinSymbol+'/'+record.baseSymbol
        });
        if(res.code === '0'){
          message.success('撤销订单成功');
        }else{
          message.error(res.message);
        }
      }
    });
  }


  // 表格列定义
  const columns: ProColumns<TradingPair>[] = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      search: false,
    },
    {
      title: '币对',
      search: false,
      render: (_, record) => (
        <div>
          <span>{record.coinSymbol}</span>/<span>{record.baseSymbol}</span>
        </div>
      ),
    },
    {
      title: '是否开放交易',
      dataIndex: 'enable',
      valueEnum: {
        0: '禁用',
        1: '启用',
      },
      render: (_, record) => (
        <Switch
          checked={record.enable === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '启用' : '禁用'}该币对交易吗？`,
              onOk: () => {
                handleEnableOrDisable(record, checked);
              },
            });
          }}
        />
      ),
    },
    {
      title: '是否显示',
      dataIndex: 'show',
      valueEnum: {
        0: '隐藏',
        1: '显示',
      },
      render: (_, record) => (
        <Switch
          checked={record.show === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '显示' : '隐藏'}该币对吗？`,
              onOk: () => {
                handleShowOrHide(record, checked);
              },
            });
          }}
        />
      ),
    },
    {
      title: '开盘价',
      dataIndex: 'openingPrice',
      search: false,
    },
    {
      title: '价格精度',
      dataIndex: 'baseCoinScale',
      search: false,
    },
    {
      title: '基础币种精度',
      dataIndex: 'coinScale',
      search: false,
    },
    {
      title: '币对标签',
      dataIndex: 'classLabel',
      search: false,
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      search: false,
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
        <a key="cancelOrders" style={{ color: '#ff4d4f' }} onClick={() => handleCancelOrders(record)}>
          撤销全部订单
        </a>,
        // <a
        //   key="mergeType"
        //   onClick={() => {
        //     setCurrentMatchingRow(record);
        //     setMatchingTypeVisible(true);
        //   }}
        // >
        //   撮合类型
        // </a>,
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

      {/* 撮合类型选择弹窗 */}
      <Modal
        title="撮合类型"
        open={matchingTypeVisible}
        onCancel={() => setMatchingTypeVisible(false)}
        footer={null}
        width={300}
      >
        <Radio.Group
          value={matchingType}
          onChange={(e) => setMatchingType(e.target.value)}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}
        >
          <Radio value={1}>集中撮合</Radio>
          <Radio value={2}>独立撮合</Radio>
        </Radio.Group>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button onClick={() => setMatchingTypeVisible(false)}>取消</Button>
          <Button type="primary" onClick={handleMatchingTypeSubmit}>
            确定
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default TradingPairManagement;
