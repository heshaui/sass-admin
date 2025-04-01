import React, { useState, useEffect } from 'react';
import { Select, Input, Radio, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { userWalletList } from '@/services/ant-design-pro/UserManagement';
const { Option } = Select;
const { Text } = Typography;

interface AssetItem {
  balance:number;
  frozenBalance:number;
  releaseBalance:number;
  isLock:number;
  memberId:string;
  version:number;
  coinId:string;
  coinName:string;
}

interface AssetProps {
  userId: string | number;
}

const Asset: React.FC<AssetProps> = ({ userId }) => {
  const [currency, setCurrency] = useState<string>('全部');
  const [searchValue, setSearchValue] = useState<string>('');
  const [hideZeroAssets, setHideZeroAssets] = useState<boolean>(false);
  const [totalAsset, setTotalAsset] = useState<string>('0');

  const columns: ProColumns<AssetItem>[] = [
    {
      title: '币种',
      dataIndex: 'coinId',
      key: 'coinId',
    },
    {
      title: '持仓',
      dataIndex: 'holding',
      key: 'holding',
      render: (record:AssetItem)=>{
        console.log(record);
        return Number(record?.balance)+Number(record?.releaseBalance)+Number(record?.frozenBalance)
      }
    },
    {
      title: '可用',
      dataIndex: 'releaseBalance',
      key: 'releaseBalance',

    },
    {
      title: '冻结',
      dataIndex: 'frozen',
      key: 'frozen',
    },
  ];


  const fetchAssetData = async (params: any) => {
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      userId:userId
    }
    const res = await userWalletList(data);

    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      }
    }
  
  
  };

  useEffect(() => {
    // 获取总资产

  }, []);

  const handleRadioChange = (e: any) => {
    setHideZeroAssets(e.target.value);
  };

  return (
    <div className="asset-component" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Text strong style={{ fontSize: '16px' }}>现货账户</Text>
      </div>
      
      <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>币种</span>
        <Select 
          value={currency} 
          onChange={(value) => {
            setCurrency(value);
          }} 
          style={{ width: 120, marginRight: '16px' }}
        >
          <Option value="全部">全部</Option>
          <Option value="USDT">USDT</Option>
          <Option value="BTC">BTC</Option>
          <Option value="ETH">ETH</Option>
        </Select>
        
      </div>
      
      <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ marginRight: '24px' }}>
          <Text type="secondary">总资产: </Text>
          <Text strong>{totalAsset} USDT</Text>
        </div>
        
        <Radio.Group onChange={handleRadioChange} value={hideZeroAssets}>
          <Radio value={true}>隐藏0资产</Radio>
        </Radio.Group>
      </div>
      
      <ProTable<AssetItem>
        columns={columns}
        request={fetchAssetData}
        rowKey="currency"
        search={false}
        options={false}
        toolbar={false}
        bordered
        cardProps={{ bodyStyle: { padding: 0 } }}
      />
    </div>
  );
};

export default Asset;