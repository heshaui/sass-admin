import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Select, InputNumber, message, Table, Divider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { walletTypeList,tenantToWallet } from '@/services/ant-design-pro/fundsTools';
import {getCurrencyCoinList} from '@/services/ant-design-pro/inviteFriends';
import { sendGoogleKey,bindGoogleKey} from '@/services/ant-design-pro/authAdmin';
import { useModel } from 'umi';
import GoogleCode from '@/components/GoogleCode';
const { Option } = Select;

const TransferTool: React.FC = () => {
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [transferRecords, setTransferRecords] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(1000);
  const [walletList, setWalletList] = useState<any[]>([]);
  const [coinList, setCoinList] = useState<any[]>([]);
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const { initialState,refresh } = useModel('@@initialState');
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  const { currentUser } = initialState || {};
  const [googleCode, setGoogleCode] = useState('');
  
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
    const res=await getCurrencyCoinList(data);
    if(res.code==='0'){
      setCoinList(res.data.list);
    }

  }
  const onFinish =async  (values: any) => {
    if(fromAccount==='user'){
      values.form=values.formUid;
    }
    if(toAccount==='user'){
      values.to=values.toUid;
    }
// M2M("M2M", "商户转商户"),
// M2U("M2U", "商户转用户"),
// U2M("U2M", "用户转商户"),
// U2U("U2U", "用户转用户"),
let sceneTypeEnum='';
if(fromAccount==='user'&&toAccount==='user'){
  sceneTypeEnum='U2U';
}else if(fromAccount==='user'&&toAccount!=='user'){
  sceneTypeEnum='U2M';
}else if(fromAccount!=='user'&&toAccount!=='user'){
  sceneTypeEnum='M2M';
}else if(fromAccount!=='user'&&toAccount==='user'){
  sceneTypeEnum='M2U';
}
    let data={
      form:values.form,
      to:values.to,
      coinId:values.coinId,
      count:values.count,
      remark:values.remark,
      sceneTypeEnum:sceneTypeEnum,
      googleCode:values.googleCode
    }
   const res= await tenantToWallet(data);
   if(res.code==='0'){
    message.success('转账成功');
    form.resetFields();
   }else{
    message.error(res.message);
   }
  };

  const handleFromAccountChange = (value: string) => {
    setFromAccount(value);
  };

  const handleToAccountChange = (value: string) => {
    setToAccount(value);
  };

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
    <PageContainer>
      <Card title="用户间转账">
        <Form form={form} layout="vertical" onFinish={onFinish} style={{width:'50%',margin:'0 auto'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="form"
              label="转出账户"
              rules={[{ required: true, message: '请选择转出账户' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择转出账户" onChange={handleFromAccountChange}>
                <Option key='user' value='user'>用户账户</Option>
                {walletList.map((item: any) => (
                  <Option key={item.walletType} value={item.walletType}>{item.walletTypeDefeat}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', marginTop: '20px' }}>
              <SwapOutlined style={{ fontSize: '20px', color: '#aaa' }} />
            </div>
            
            <Form.Item
              name="to"
              label="转入账户"
              rules={[{ required: true, message: '请选择转入账户' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择转入账户" onChange={handleToAccountChange}>
                <Option key='user' value='user'>用户账户</Option>
                {walletList.map((item: any) => (
                  <Option key={item.walletType} value={item.walletType}>{item.walletTypeDefeat}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          {(fromAccount === 'user' || toAccount === 'user') && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {fromAccount === 'user' && (
                <Form.Item
                  label="uid"
                  name="formUid"
                  rules={[{ required: true, message: '请输入转出账户uid' }]}
                >
                  <Input placeholder="请输入uid" />
                </Form.Item>
              )}

              {toAccount === 'user' && (
                <Form.Item
                  label="uid"
                  name="toUid"
                  rules={[{ required: true, message: '请输入转入账户uid' }]}
                >
                  <Input placeholder="请输入uid" />  
                </Form.Item>
              )}
            </div>
          )}
          
          <Form.Item
            name="coinId"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select placeholder="请选择转账币种">
                {coinList.map((item: any) => (
                  <Option key={item.coinId} value={item.coinId}>{item.coinName}</Option>
                ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="count"
            label="转账金额"
            rules={[{ required: true, message: '请输入转账金额' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          
          <div style={{ marginTop: '-15px', marginBottom: '15px' }}>
            <span>可用: {availableBalance} USDT</span>
          </div>

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
                       
          <Form.Item
            name="description"
            label="备注"
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入" />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <GoogleCode
       visible={googleCodeVisible} 
       qrCodeUrl={googleCodeData?.codeUri} 
       secretKey={googleCodeData?.secretKey} 
       onSubmit={handleGoogleCodeSuccess} 
       onCancel={() => setGoogleCodeVisible(false)}
      />


    </PageContainer>
  );
};

export default TransferTool; 