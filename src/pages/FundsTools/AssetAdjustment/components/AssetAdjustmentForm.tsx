import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Radio, Input, Space, Modal, message } from 'antd';
import styles from './AssetAdjustmentForm.css';
import { walletTypeList,tenantWallet,tenantSubWallet} from '@/services/ant-design-pro/fundsTools';
import {getCurrencyCoinList} from '@/services/ant-design-pro/inviteFriends';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import { sendGoogleKey,bindGoogleKey} from '@/services/ant-design-pro/authAdmin';
import { useModel } from 'umi';
import GoogleCode from '@/components/GoogleCode';
const { Option } = Select;

interface AssetAdjustmentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const AssetAdjustmentForm: React.FC<AssetAdjustmentFormProps> = ({ 
  visible, 
  onCancel, 
  onSubmit 
}) => {
  const [form] = Form.useForm();
  const [walletList, setWalletList] = useState<any[]>([]);
  const [coinList, setCoinList] = useState<any[]>([]);
  const { initialState,refresh } = useModel('@@initialState');
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  const { currentUser } = initialState || {};
  const [googleCode, setGoogleCode] = useState('');
  const [walletBalance, setWalletBalance] = useState<any>(null);
  const [coinName, setCoinName] = useState('');

  const getWalletBalance=async(coinId:string)=>{
    const res=await tenantWallet({
      walletType:'company_general_account',
      coinId:coinId
    });
    if(res.code==='0'){
      setWalletBalance(res.data);
    }
  }
  const walletData = async () => {
    const res = await walletTypeList();
    if (res.code === '0' ) {
      setWalletList(res.data.list);
    }
  };

  const getCoin=async()=>{
    let data={  
      pageNo:1,
      pageSize:10000
    }
    const res=await tenantCurrencyCoinList(data);
    if(res.code==='0'){
      setCoinList(res.data.list);
    }
  }


  const getGoogleCode=async()=>{
    const res=await sendGoogleKey();
    if(res.code==='0'){
        
        setGoogleCodeData(res.data);
        setGoogleCodeVisible(true);
    }else{
        message.error(res.message);
    }
    
  }

  const handleGoogleCodeSuccess = async (code: string) => {

    
    const res=await bindGoogleKey({ googleCode: code });
    if(res.code==='0'&&res.data){
      message.success('绑定成功');
      refresh();


    }else{
      message.error(res.message);
    }
    setGoogleCodeVisible(false);
  }

  useEffect(() => {
    walletData();
    getCoin();
  }, []);
  return (
    <Modal
      title="增减代币"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.validateFields().then(values => {
              onSubmit(values);
              form.resetFields();
            });
          }}
        >
          提交
        </Button>,
      ]}
      width={800}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 40 }}>
          <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="账户" name="account" initialValue="company_general_account">
              <Select disabled>
                {walletList.map((item: any) => (
                  <Option key={item.walletType} value={item.walletType}>{item.walletTypeDefeat}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="方向" name="direction" initialValue="increase">
              <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                <Radio.Button 
                  value="increase" 
                  style={{
                    width: '50%', 
                    textAlign: 'center',
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                  }}
                >
                  增币
                </Radio.Button>
                <Radio.Button 
                  value="decrease" 
                  style={{
                    width: '50%', 
                    textAlign: 'center',
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                >
                  减币
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item label="币种" name="currency" initialValue="">
              <Select style={{ width: '100%' }} onChange={(value,option)=>{
                getWalletBalance(value);
                setCoinName(option.children);
              }}>
                {coinList.map((item: any) => (
                  <Option key={item.coinId} value={item.coinId} >{item.coinName}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="金额" name="amount" rules={[{ required: true, message: '请输入金额' }]}>
              <Input placeholder="金额"  />
            </Form.Item>
            
            <Form.Item label="备注" name="description">
              <Input placeholder="原因"  />
            </Form.Item>
            
            <Form.Item label="谷歌验证码" name="googleCode" rules={[{ required: true, message: '请输入谷歌验证码' }]}>
                
               {
                currentUser?.employeeResp?.googleCode===false && (
                  <Button type="link"  onClick={getGoogleCode}>未绑定，点击前往绑定</Button>
                )
              }
              {
                currentUser?.employeeResp?.googleCode===true && (
                  <Input 
                    value={googleCode}
                    onChange={(e) => setGoogleCode(e.target.value)}
                    placeholder="请输入验证码"
                  />
                )
              }
            </Form.Item>
          </Form>
        </div>
        
        <div style={{ width: 300, paddingTop: 10 }}>
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <span>账户余额</span>
              <Space>
                <span>{walletBalance?.balance}</span>
                <span>{coinName}</span>
              </Space>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <span>累计增发金额</span>
              <Space>
                <span>12.620</span>
                <span>USDT</span>
              </Space>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', color: 'red' }}>
            <div>注意事项:</div>
            <div style={{ marginTop: 8 }}>
              1. <span style={{ color: '#ff4d4f' }}>增发资产建议谨慎操作，若资金流向用户，您需要承担对应损失；</span>
            </div>
            <div style={{ marginTop: 4 }}>
              2. <span style={{ color: '#ff4d4f' }}>建议用于做市服务。</span>
            </div>
          </div>
        </div>
      </div>
      <GoogleCode
       visible={googleCodeVisible} 
       qrCodeUrl={googleCodeData?.codeUri} 
       secretKey={googleCodeData?.secretKey} 
       onSubmit={handleGoogleCodeSuccess} 
       onCancel={() => setGoogleCodeVisible(false)}
      />
    </Modal>
  );
};

export default AssetAdjustmentForm; 