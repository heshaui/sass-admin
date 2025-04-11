import React, { useState, useEffect,useRef } from 'react';
import { Select, Radio, Typography } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { userWalletList,userWalletCount} from '@/services/ant-design-pro/UserManagement';
import { getCurrencyCoinList } from '@/services/ant-design-pro/inviteFriends';
import { currencyCoinList } from '@/services/ant-design-pro/spot';
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
  const [currency, setCurrency] = useState<string>();
  const [hideZeroAssets, setHideZeroAssets] = useState<boolean>(false);
  const [totalAsset, setTotalAsset] = useState<string>('0');
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const actionRef = useRef<ActionType>();

  const getTotalAsset=async()=>{
    let data={
      userId:userId,
    }
    const res = await userWalletCount(data);
    if(res.code==='0'){
      setTotalAsset(res.data);
    }
  }

  const getCurrencyList=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    let res
    if(isAdmin){
       res=await currencyCoinList(data)
    }else{
       res=await getCurrencyCoinList(data)
    }
    if(res.code==='0'){
      setCurrencyList(res.data.list)
    }
  }

  const columns: ProColumns<AssetItem>[] = [
    {
      title: '币种',
      dataIndex: 'coinName',
      key: 'coinName',
    },
    {
      title: '持仓',
      dataIndex: 'balance',
      key: 'balance',
      render: (text:string, record: AssetItem)=>{
        return Number(text)+Number(record?.releaseBalance)+Number(record?.frozenBalance)
      }
    },
    {
      title: '可用',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: '冻结',
      dataIndex: 'frozenBalance',
      key: 'frozenBalance',
    },
  ];


  const fetchAssetData = async (params: any) => {
    
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      userId:userId,
      coinId:currency
    }
    const res = await userWalletList(data);

    if(res.code==='0'){
      let filteredData = res.data.list;
      
      // 如果选择了隐藏0资产，过滤掉可用资产为0的记录
      if (hideZeroAssets) {
        filteredData = filteredData.filter((item: AssetItem) => Number(item.balance) > 0);
      }
      
      return {
        data: filteredData,
        success: true,
        total: hideZeroAssets ? filteredData.length : res.data.count,
      }
    }
  };

  useEffect(() => {
    // 获取总资产
    getCurrencyList()
    getTotalAsset()
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
            actionRef.current?.reload();
          }} 
          style={{ width: 120, marginRight: '16px' }}
        >
          <Option value="">全部</Option>
          {currencyList.map((item:any)=>(
            <Option key={item.coinId} value={item.coinId}>{item.coinName}</Option>
          ))}
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
        actionRef={actionRef}
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