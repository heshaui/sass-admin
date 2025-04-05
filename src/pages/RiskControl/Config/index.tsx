import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, InputNumber, Button, Row, Col, Space, Typography,message } from 'antd';
import { riskConditionTemplateList,saveRiskConditions } from '@/services/ant-design-pro/risk';
import { useModel } from 'umi';
import GoogleCode from '@/components/GoogleCode';
import { sendGoogleKey,bindGoogleKey} from '@/services/ant-design-pro/authAdmin';
const { Text } = Typography;

const RiskControlConfig: React.FC = () => {
  const [assetForm] = Form.useForm();
  const [moneyForm] = Form.useForm();
  const [theftForm] = Form.useForm();

  // 添加编辑状态控制
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [assetTemplate, setAssetTemplate] = useState<any>({});
  const [moneyTemplate, setMoneyTemplate] = useState<any>({});
  const [theftTemplate, setTheftTemplate] = useState<any>({});
  const { initialState,refresh } = useModel('@@initialState');
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  const { currentUser } = initialState || {};
  const [googleCode, setGoogleCode] = useState('');

  const assetFinish = async(values: any) => {
    let conditionId
    let conditionCode='ASSET_IMBALANCE_1'
    let sceneCode='ASSET_IMBALANCE'
    assetTemplate?.riskConditions.forEach((item: any) => {
      if(item.conditionCode==='ASSET_IMBALANCE_1'){
        if(item.conditionId!==1){
          conditionId=item.conditionId;
        }
      }
    });

    let riskConditionVos=[
      { 
        conditionId:conditionId,
        sceneCode:sceneCode,
        conditionCode:conditionCode,
        riskIncrement:values.riskIncrement,
        earlyWarning:values.earlyWarning,
        thresholdMap:{
          count:values.count,
          coin:'USDT'
        }
      }
    ]
    let data={
      googleCode:values.googleCode,
      
      
      riskConditionVos:riskConditionVos,
    }
   let res= await saveRiskConditions(data);
   if(res.code==='0'){
    message.success('保存成功');
   }else{
    message.error(res.message);
   }
   setEditingSection(null); // 提交后退出编辑模式
  };

  const moneyFinish = async(values: any) => {
    let conditionId1
    let conditionId2
    if(moneyTemplate?.riskConditions[0].conditionId!==2){
      conditionId1=moneyTemplate?.riskConditions[0].conditionId;
    }
    if(moneyTemplate?.riskConditions[1].conditionId!==3){
      conditionId2=moneyTemplate?.riskConditions[1].conditionId;
    }
    let riskConditionVos=[
      { 
        conditionId:conditionId1,
        sceneCode:'AML_STRUCTURING_DETECTION',
        conditionCode:'AML_WITHDRAW_FREQ_10M',
        riskIncrement:values.oneRiskIncrement,
        thresholdMap:{
          time_window:values.time_window,
          count:values.count
        }
      },
      {
        conditionId:conditionId2,
        sceneCode:'AML_STRUCTURING_DETECTION',
        conditionCode:'AML_RECHARGE_WITHDRAW_RATIO_24H',
        riskIncrement:values.twoRiskIncrement,
        thresholdMap:{
          time_window:'24',
          recharge_min:values.recharge_min,
          withdraw_ratio:values.withdraw_ratio
        }
      }
    ]

    let data={
      googleCode:values.googleCode,
      riskConditionVos:riskConditionVos,
    }
    let res= await saveRiskConditions(data);
    if(res.code==='0'){
      message.success('保存成功');
    }
  }

  const theftFinish = async(values: any) => {
    let riskConditionVos=[
      {
        conditionId:theftTemplate?.riskConditions[0].conditionId,
        sceneCode:'THEFT_WARNING',
        conditionCode:'THEFT_WARNING_1',
        count:values.oneCount,
        riskIncrement:values.oneRiskIncrement,
      },
      {
        conditionId:theftTemplate?.riskConditions[0].conditionId,
        sceneCode:'THEFT_WARNING',
        conditionCode:'THEFT_WARNING_2',
        count:values.twoCount,
        riskIncrement:values.twoRiskIncrement,
      },
      {
        conditionId:theftTemplate?.riskConditions[0].conditionId,
        sceneCode:'THEFT_WARNING',
        conditionCode:'THEFT_WARNING_3',
        count:values.multiAccountWithdrawal,
        riskIncrement:values.threeRiskIncrement,
      }
    ]
    let data={
      googleCode:values.googleCode,
      riskConditionVos:riskConditionVos,
    }
    let res= await saveRiskConditions(data);
    if(res.code==='0'){
      message.success('保存成功');
    }
    setEditingSection(null); // 提交后退出编辑模式
  };
  
  

  // 切换编辑状态的函数
  const toggleEdit = (section: string) => {
    if (editingSection === section) {
      setEditingSection(null);
    } else {
      setEditingSection(section);
    }
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
    const fetchData = async () => {
      const res = await riskConditionTemplateList({});
      if(res.code==='0'&&res.data){
        res.data.forEach((item: any) => {
          if(item.sceneCode==='ASSET_IMBALANCE'){
            setAssetTemplate(item);
            if(item.riskConditions[0].conditionId!==1){
              console.log(item.riskConditions[0]);
              assetForm.setFieldsValue({
                count:Number(item.riskConditions[0].thresholdMap.count),
                riskIncrement:Number(item.riskConditions[0].riskIncrement),
                earlyWarning:item.riskConditions[0].earlyWarning,
              });
            }
          }else if(item.sceneCode==='AML_STRUCTURING_DETECTION'){
            setMoneyTemplate(item);
            if(item.riskConditions[0].conditionId!==2){
              moneyForm.setFieldsValue({
                time_window:Number(item.riskConditions[0].thresholdMap.count),
                count:Number(item.riskConditions[0].thresholdMap.count),
                oneRiskIncrement:Number(item.riskConditions[0].riskIncrement),
                twoRiskIncrement:Number(item.riskConditions[1].riskIncrement),
              });
            }
          }else if(item.sceneCode==='THEFT_WARNING'){
            setTheftTemplate(item);
          }
        });
      }
    };
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Form form={assetForm} onFinish={assetFinish} layout="vertical">
        {/* 资产不平 */}
        <Card
          title="资产不平"
          style={{ marginBottom: 20 }}
          extra={
            editingSection === 'asset' ? (
              <Space>
                <Button onClick={() => toggleEdit('asset')}>取消</Button>
                <Button type="primary" onClick={() => assetForm.submit()}>保存</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => currentUser?.employeeResp?.googleCode===true?toggleEdit('asset'):getGoogleCode()}>编辑</Button>
            )
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label='资产折合'
                required
                name="count"
              >
                <Space>
                  <Input   disabled={editingSection !== 'asset'} />
                  <Text>USDT</Text>
                </Space>
              </Form.Item>
              <Form.Item
                label='风控等级'
                required
                name="riskIncrement"
              >
                <Space>
                  <Input   disabled={editingSection !== 'asset'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="报警通知" name="earlyWarning">
                <Input placeholder="邮箱或手机，以类文通号啓开" disabled={editingSection !== 'asset'} />
              </Form.Item>
            </Col>
            {
              currentUser?.employeeResp?.googleCode===true&&(
                <Col span={8}>
                  <Form.Item label="谷歌验证码" name="googleCode" required>
                    <Input placeholder="请输入谷歌验证码" disabled={editingSection !== 'asset'} />
              </Form.Item>
            </Col>
            )
          }
          </Row>
        </Card>
      </Form>

      {/* 洗钱嫌疑 */}
      <Form form={moneyForm} onFinish={moneyFinish} layout="vertical">
        <Card
          title="洗钱嫌疑"
          className="mt-4"
          style={{ marginBottom: 20 }}
          extra={
            editingSection === 'money' ? (
              <Space>
                <Button onClick={() => toggleEdit('money')}>取消</Button>
                <Button type="primary" onClick={() => moneyForm.submit()}>保存</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => currentUser?.employeeResp?.googleCode===true?toggleEdit('money'):getGoogleCode()}>编辑</Button>
            )
          }
        >
          <Row gutter={24}>
            <Col span={12}>
            <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>

              <span style={{color:'red'}}>*</span>
              <Form.Item
                required
                name='time_window'
              >
                <Space>
                  <Input disabled={editingSection !== 'money'} />
                  <Text>分钟内，累计提现笔数 &gt;</Text>
                
                  
                </Space>
              </Form.Item>
              <Form.Item name="count">
              <Input placeholder="5" disabled={editingSection !== 'money'} />
              <Text>次。</Text>
              </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="oneRiskIncrement"
              >
                <Space>
                  <Input  disabled={editingSection !== 'money'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>




          <Row gutter={24}>
            <Col span={12}>
            <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>

              <span style={{color:'red'}}>*</span><span>24小时内充值</span>
              <Form.Item
                name='recharge_min' 
              >
                <Space>
                  <Input min={1}  disabled={editingSection !== 'money'} />
                  <Text>USDT 且提现金额大于</Text>
                </Space>
              </Form.Item>
              <Form.Item name="withdraw_ratio">
                <Input min={1} max={100}  disabled={editingSection !== 'money'} />
                <Text>%的充值金额。</Text>
              </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="twoRiskIncrement"
              >
                <Space>
                  <Input min={1}  disabled={editingSection !== 'money'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
          {
            currentUser?.employeeResp?.googleCode===true&&(
              <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="谷歌验证码" name="googleCode">
                <Input placeholder="请输入谷歌验证码" disabled={editingSection !== 'money'} />
              </Form.Item>
            </Col>
          </Row>
            )
          }
        </Card>
      </Form>


      {/* 被盗预警 */}
      <Form form={theftForm} onFinish={theftFinish} layout="vertical">
        <Card
          title="被盗预警"
          className="mt-4"
          extra={
            editingSection === 'theft' ? (
              <Space>
                <Button onClick={() => toggleEdit('theft')}>取消</Button>
                <Button type="primary" onClick={() => theftForm.submit()}>保存</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => currentUser?.employeeResp?.googleCode===true?toggleEdit('theft'):getGoogleCode()}>编辑</Button>
            )
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 用户提现的IP更换次数占比 &lt;</>}
                name="oneCount"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>%</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="oneRiskIncrement"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<>用户提现地址之前未成功提现 &gt;</>}
                name="twoCount"
              >
                <Space>
                  <InputNumber min={1} placeholder="5" disabled={editingSection !== 'theft'} />
                  <Text>次。</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="twoRiskIncrement"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<>两个不同的账户提现到同一个地址</>}
                name="multiAccountWithdrawal"
              >

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="threeRiskIncrement"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
          {
            currentUser?.employeeResp?.googleCode===true&&(
              <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="谷歌验证码" name="googleCode">
                <Input placeholder="请输入谷歌验证码" disabled={editingSection !== 'theft'} />
              </Form.Item>
            </Col>
          </Row>
            )
          }
          
        </Card>
      </Form>
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

export default RiskControlConfig; 