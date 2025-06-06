import {
  exchangeCoinList,
  saveExchangeCoin,
  updateExchangeCoinById,
  updateExchangeGroup,
  revocationExchangeCoinOrder,
  selectExchangeGroup
} from '@/services/ant-design-pro/spot';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal, Radio, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import TradingPairForm from './components/TradingPairForm';
import GoogleCode from '@/components/GoogleCode';
import { sendGoogleKey, bindGoogleKey } from '@/services/ant-design-pro/authAdmin';
import { clearAllCookies } from '@/utils';
import { useModel, useIntl } from 'umi';
import ValidCode from '@/components/ValidCode';
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
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TradingPair | undefined>(undefined);
  const [matchingTypeVisible, setMatchingTypeVisible] = useState<boolean>(false);
  const [matchingType, setMatchingType] = useState<number>(1);
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentMatchingRow, setCurrentMatchingRow] = useState<TradingPair | undefined>(undefined);
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  const [validCodeVisible, setValidCodeVisible] = useState(false);
  const [cancelOrder, setCancelOrder] = useState();
  const [editType, setEditType] = useState<boolean>(false);

  const tradingPairCategories = {
    '1': '主流区',
    '2': '创新区',
    '3': '新币区',
    '4': 'AI',
    '5': 'Meme',
    '6': 'NFT',
    '7': 'DeFi',
    '8': 'Web3',
    '9': 'Payments',
    '10': 'Launchpad',
    '11': 'Layer2',
    '12': 'Solana',
    '13': 'RWA',
    '14': 'Launchpool',
    '15': '游戏元宇宙',
    '16': '存储'
  } as const;
  




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

  const getExchangeGroupType=async(id: number)=>{
    const res=await selectExchangeGroup({id})
    if(res.code==='0'){
      setEditType(true)
    }else{
      setEditType(false)
    }
  }

  // 处理添加或编辑币对
  const handleAddOrEdit = async (values: any) => {
    if (currentRow) {
      values.id = currentRow.id;
      values.show = currentRow.show;
      const res = await updateExchangeCoinById(values);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'tradingPair.message.editSuccess' }));
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
        message.success(intl.formatMessage({ id: 'tradingPair.message.addSuccess' }));
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
      message.success(intl.formatMessage({ id: 'tradingPair.message.showStatusSuccess' }));
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
      message.success(intl.formatMessage({ id: 'tradingPair.message.enableStatusSuccess' }));
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
        message.success(intl.formatMessage({ id: 'tradingPair.message.matchingTypeSuccess' }));
        setMatchingTypeVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(intl.formatMessage({ id: 'tradingPair.message.matchingTypeFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'tradingPair.message.matchingTypeFailed' }));
    }
  };


  const handleCancelOrders = async (record: TradingPair) => {
    setValidCodeVisible(true)
    setCancelOrder(record)

  }


  const handleOk = async (code: string) => {
    setValidCodeVisible(false)
    //弹出确认框
    Modal.confirm({
      title: intl.formatMessage(
        { id: 'tradingPair.modal.confirmCancelOrders' },
        { coinSymbol: cancelOrder?.coinSymbol, baseSymbol: cancelOrder?.baseSymbol }
      ),
      onOk: async () => {
        const res = await revocationExchangeCoinOrder({
          symbol: cancelOrder?.coinSymbol + '/' + cancelOrder?.baseSymbol,
          googleCode: code
        });
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'tradingPair.message.cancelOrderSuccess' }));
        } else {
          message.error(res.message);
        }
      }
     
    });
    
  }
  const getGoogleCode = async () => {
    const res = await sendGoogleKey();
    if (res.code === '0') {
      setGoogleCodeData(res.data);
      setGoogleCodeVisible(true);
    } else {
      message.error(res.message);
    }

  }



  const handleGoogleCodeSuccess = async (code: string) => {
    const res = await bindGoogleKey({ googleCode: code });
    if (res.code === '0' && res.data) {
      message.success(intl.formatMessage({ id: 'tradingPair.message.bindSuccess' }));
      clearAllCookies();
      window.location.reload();
    } else {
      message.error(res.message);
    }
    setGoogleCodeVisible(false);
  }


  // 表格列定义
  const columns: ProColumns<TradingPair>[] = [
    {
      title: intl.formatMessage({ id: 'tradingPair.column.sortOrder' }),
      dataIndex: 'sortOrder',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.tradingPair' }),
      search: false,
      render: (_, record) => (
        <div>
          <span>{record.coinSymbol}</span>/<span>{record.baseSymbol}</span>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.enableTrading' }),
      dataIndex: 'enable',
      valueEnum: {
        0: intl.formatMessage({ id: 'tradingPair.status.disabled' }),
        1: intl.formatMessage({ id: 'tradingPair.status.enabled' }),
      },
      render: (_, record) => (
        <Switch
          checked={record.enable === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: intl.formatMessage({
                id: checked ? 'tradingPair.modal.confirmEnable' : 'tradingPair.modal.confirmDisable'
              }),
              onOk: () => {
                handleEnableOrDisable(record, checked);
              },
            });
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.isVisible' }),
      dataIndex: 'show',
      valueEnum: {
        0: intl.formatMessage({ id: 'tradingPair.status.hidden' }),
        1: intl.formatMessage({ id: 'tradingPair.status.visible' }),
      },
      render: (_, record) => (
        <Switch
          checked={record.show === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: intl.formatMessage({
                id: checked ? 'tradingPair.modal.confirmShow' : 'tradingPair.modal.confirmHide'
              }),
              onOk: () => {
                handleShowOrHide(record, checked);
              },
            });
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.openPrice' }),
      dataIndex: 'openingPrice',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.priceDecimal' }),
      dataIndex: 'baseCoinScale',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.baseCoinDecimal' }),
      dataIndex: 'coinScale',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.tag' }),
      dataIndex: 'classLabel',
      search: false,
      render: (text) => tradingPairCategories[text],
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.createTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'tradingPair.column.action' }),
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
          {intl.formatMessage({ id: 'tradingPair.action.edit' })}
        </a>,
        <a key="cancelOrders" style={{ color: '#ff4d4f' }} onClick={() => currentUser?.employeeResp?.googleCode === true ? handleCancelOrders(record) : getGoogleCode()}>
          {intl.formatMessage({ id: 'tradingPair.action.cancelOrders' })}
        </a>,
        <a
          key="mergeType"
          onClick={() => {
            setCurrentMatchingRow(record);
            setMatchingTypeVisible(true);
            getExchangeGroupType(record.id)
          }}
        >
          {intl.formatMessage({ id: 'tradingPair.action.matchingType' })}
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TradingPair>
        headerTitle={intl.formatMessage({ id: 'tradingPair.table.title' })}
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
            <PlusOutlined /> {intl.formatMessage({ id: 'tradingPair.button.add' })}
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

      {/* 撥合类型选择弹窗 */}
      <Modal
        title={intl.formatMessage({ id: 'tradingPair.modal.matchingType' })}
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
          <Radio value={1}>{intl.formatMessage({ id: 'tradingPair.matchingType.centralized' })}</Radio>
          <Radio value={2}>{intl.formatMessage({ id: 'tradingPair.matchingType.independent' })}</Radio>
        </Radio.Group>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button onClick={() => setMatchingTypeVisible(false)}>{intl.formatMessage({ id: 'tradingPair.button.cancel' })}</Button>
          <Button type="primary" onClick={handleMatchingTypeSubmit} disabled={editType}>
            {intl.formatMessage({ id: 'tradingPair.button.confirm' })}
          </Button>
        </div>
      </Modal>
      <GoogleCode
        visible={googleCodeVisible}
        qrCodeUrl={googleCodeData?.codeUri}
        secretKey={googleCodeData?.secretKey}
        onSubmit={handleGoogleCodeSuccess}
        onCancel={() => setGoogleCodeVisible(false)}
      />
      <ValidCode visible={validCodeVisible} onCancel={() => setValidCodeVisible(false)} onOk={handleOk} />
    </PageContainer>
  );
};

export default TradingPairManagement;
