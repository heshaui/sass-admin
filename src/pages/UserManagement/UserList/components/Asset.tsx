import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from '@umijs/max';
import { Select, Checkbox, Typography } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { userWalletList, userWalletCount } from '@/services/ant-design-pro/UserManagement';
import { getCurrencyCoinList } from '@/services/ant-design-pro/inviteFriends';
import { currencyCoinList } from '@/services/ant-design-pro/spot';
import type { ActionType } from '@ant-design/pro-components';
import Big from 'big.js';

const { Option } = Select;
const { Text } = Typography;

interface AssetItem {
  balance: number;
  frozenBalance: number;
  releaseBalance: number;
  isLock: number;
  memberId: string;
  version: number;
  coinId: string;
  coinName: string;
}

interface AssetProps {
  userId: string | number;
}

const Asset: React.FC<AssetProps> = ({ userId }) => {
  const [currency, setCurrency] = useState<string>();
  const [hideZeroAssets, setHideZeroAssets] = useState<boolean>(false);
  const [totalAsset, setTotalAsset] = useState<string>('0');
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const { formatMessage } = useIntl();

  const getTotalAsset = async () => {
    let data = {
      userId: userId,
    };
    const res = await userWalletCount(data);
    if (res.code === '0') {
      setTotalAsset(res.data);
    }
  };

  const getCurrencyList = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    let res;
    if (isAdmin) {
      res = await currencyCoinList(data);
    } else {
      res = await getCurrencyCoinList(data);
    }
    if (res.code === '0') {
      setCurrencyList(res.data.list);
    }
  };

  const columns: ProColumns<AssetItem>[] = [
    {
      title: formatMessage({ id: 'asset.columns.currency' }),
      dataIndex: 'coinName',
      key: 'coinName',
    },
    {
      title: formatMessage({ id: 'asset.columns.position' }),
      dataIndex: 'balance',
      key: 'balance',
      render: (_, record) => {
        const balance = new Big(record.balance); // 大数推荐用字符串初始化
        const frozenBalance = new Big(record?.frozenBalance);
        const releaseBalance = new Big(record?.releaseBalance);
        const sum = balance.plus(frozenBalance).plus(releaseBalance).toString(); // 转为字符串，避免科学计数法
        return sum;
      },
    },
    {
      title: formatMessage({ id: 'asset.columns.orderLock' }),
      dataIndex: 'isLock',
      key: 'isLock',
    },
    {
      title: formatMessage({ id: 'asset.columns.available' }),
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: formatMessage({ id: 'asset.columns.frozen' }),
      dataIndex: 'frozenBalance',
      key: 'frozenBalance',
    },
  ];

  const fetchAssetData = async (params: any) => {
    let data = {
      pageNo: params.current,
      pageSize: params.pageSize,
      userId: userId,
      coinId: currency,
    };
    const res = await userWalletList(data);

    if (res.code === '0') {
      let filteredData = res.data.list;

      // 如果选择了隐藏0资产，过滤掉可用资产为0的记录
      if (hideZeroAssets) {
        filteredData = filteredData.filter((item: AssetItem) => Number(item.balance) > 0);
      }

      return {
        data: filteredData,
        success: true,
        total: hideZeroAssets ? filteredData.length : res.data.count,
      };
    }
    return {
      data: [],
      success: false,
      total: 0,
    };
  };

  useEffect(() => {
    // 获取总资产
    getCurrencyList();
    getTotalAsset();
  }, []);

  const handleRadioChange = (e: any) => {
    setHideZeroAssets(e.target.value);
  };

  return (
    <div className="asset-component" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Text strong style={{ fontSize: '16px' }}>
          {formatMessage({ id: 'asset.title' })}
        </Text>
      </div>

      <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>{formatMessage({ id: 'asset.currency' })}</span>
        <Select
          value={currency}
          onChange={(value) => {
            setCurrency(value);
            actionRef.current?.reload();
          }}
          style={{ width: 120, marginRight: '16px' }}
        >
          <Option value="">{formatMessage({ id: 'asset.all' })}</Option>
          {currencyList.map((item: any) => (
            <Option key={item.coinId} value={item.coinId}>
              {item.coinName}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ marginRight: '24px' }}>
          <Text type="secondary">{formatMessage({ id: 'asset.total' })}: </Text>
          <Text strong>{totalAsset} USDT</Text>
        </div>
        <Checkbox value={hideZeroAssets} onChange={handleRadioChange}>
          {formatMessage({ id: 'asset.hideZero' })}
        </Checkbox>
      </div>

      <ProTable<AssetItem>
        columns={columns}
        actionRef={actionRef}
        request={fetchAssetData}
        rowKey="currency"
        search={false}
        options={false}
        bordered
        cardProps={{ bodyStyle: { padding: 0 } }}
      />
    </div>
  );
};

export default Asset;
