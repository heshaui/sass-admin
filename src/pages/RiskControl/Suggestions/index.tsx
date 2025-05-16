import React, { useState,useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Select, Space, Typography,message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { riskConditionTemplateList,saveRiskConditions,saveActionRiskLevel,actionRiskLevelParams} from '@/services/ant-design-pro/risk';
import GoogleCode from '@/components/GoogleCode';
import { sendGoogleKey,bindGoogleKey} from '@/services/ant-design-pro/authAdmin';
import ValidCode from '@/components/ValidCode'
import { useModel } from 'umi';
const { Option } = Select;
const { Title } = Typography;

const RiskControlSuggestions: React.FC = () => {
  // 风控建议数据
  const [suggestionsForm] = Form.useForm();
  const [sensitiveForm] = Form.useForm();
  // 添加编辑状态
  const [editingSuggestions, setEditingSuggestions] = useState(false);
  const [editingSensitive, setEditingSensitive] = useState(false);
  const { initialState,refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [template, setTemplate] = useState<any>({});
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  const [googleCode, setGoogleCode] = useState('');
  const [sugEdit, setSugEdit] = useState<any>();
  // 处理建议选项
  const suggestionOptions = [
    '建议禁止提现，并回访用户后再处理',
    '建议冻结用户提现',
    '建议禁止提现，回访用户后在处理',
    '人工审核'
  ];
  const suggestion = [
    {
      label:'建议禁止提现，并回访用户后再处理',
      code:'prohibit_withdrawa'
    },

    {
      label:'建议冻结用户提现',
      code:'freezing_withdrawal'
    },
    {
      code:'reject_withdrawal_review',
      label:'提现审核拒绝',
    },
    {
      code:'manual_review',
      label:'人工审核',
    }
  ];

  const getSugges=async()=>{
    const res= await actionRiskLevelParams();

  if(res.code==='0'&&res.data){ 
    suggestionsForm.setFieldsValue({
      riskLevel1:res.data[0]?.riskLevel,
      suggestion1:res.data[0]?.actionTipsCode,
      riskLevel2:res.data[1]?.riskLevel,
      suggestion2:res.data[1]?.actionTipsCode,
      riskLevel3:res.data[2]?.riskLevel,
      suggestion3:res.data[2]?.actionTipsCode,
    })
    setSugEdit(res.data)
  }


  }

  const getTemplate=async()=>{
   
    
    let res=await riskConditionTemplateList({});
    if(res.code==='0'&&res.data){
      res.data.forEach((item:any)=>{
        if(item.sceneCode==='SENSITIVE_INFO'){
          setTemplate(item);
          sensitiveForm.setFieldsValue({
            oneTime:item.riskConditions[0].thresholdMap.time,
            passwordSuggestion:item.riskConditions[0].thresholdMap.unit,
            twoTime:item.riskConditions[1].thresholdMap.time,
            twofaSuggestion:item.riskConditions[1].thresholdMap.unit,
            threeTime:item.riskConditions[2].thresholdMap.time,
            phoneSuggestion:item.riskConditions[2].thresholdMap.unit,
            fourTime:item.riskConditions[3].thresholdMap.time,
            emailSuggestion:item.riskConditions[3].thresholdMap.unit,
            fiveTime:item.riskConditions[4].thresholdMap.time,
            fundPasswordSuggestion:item.riskConditions[4].thresholdMap.unit,
          })
        }
      })
    }
  }
  const handleSave =async (values: any) => {
    let data
    if(sugEdit){
      data={
        riskLevels:[
          { 
            id:sugEdit[0].id,
            riskLevel:values.riskLevel1,
            actionTipsCode:values.suggestion1
          },
          {
            id:sugEdit[1].id,
            riskLevel:values.riskLevel2,
            actionTipsCode:values.suggestion2
          },
          {
            id:sugEdit[2].id,
            riskLevel:values.riskLevel3,
            actionTipsCode:values.suggestion3
          }
        ]
      }

      
    }else{
      data={
        riskLevels:[
          { 
            riskLevel:values.riskLevel1,
            actionTipsCode:values.suggestion1
          },
          {
            riskLevel:values.riskLevel2,
            actionTipsCode:values.suggestion2
          },
          {
            riskLevel:values.riskLevel3,
            actionTipsCode:values.suggestion3
          }
        ]
      }
    }
     

 const res=await saveActionRiskLevel(data);
if(res.code==='0'&&res.data){
  getSugges();
  getTemplate();
  message.success('保存成功');
}
  // 保存后关闭编辑状态
  setEditingSuggestions(false);
  setEditingSensitive(false);
  // 这里添加保存逻辑
};
   





  const handleSensitiveSave =async (values: any) => {
    
   let riskConditions=[
      {   
          ...(template?.riskConditions[0].conditionId!==14 ? {conditionId: template?.riskConditions[0].conditionId} : {}),
          "sceneCode": "SENSITIVE_INFO",
          "conditionCode": "SENSITIVE_INFO_1",
          "thresholdMap": {
              "unit": values.passwordSuggestion,
              "time": values.oneTime
          },
      },
      {
          ...(template?.riskConditions[1].conditionId!==19 ? {conditionId: template?.riskConditions[1].conditionId} : {}),
          "sceneCode": "SENSITIVE_INFO",
          "conditionCode": "SENSITIVE_INFO_2",
          "thresholdMap": {
              "unit": values.twofaSuggestion,
              "time": values.twoTime
          },
      },
      {
          ...(template?.riskConditions[2].conditionId!==20 ? {conditionId: template?.riskConditions[2].conditionId} : {}),
          "sceneCode": "SENSITIVE_INFO",
          "conditionCode": "SENSITIVE_INFO_3",
          "thresholdMap": {
              "unit": values.phoneSuggestion,
              "time": values.threeTime
          },

      },
      {
          ...(template?.riskConditions[3].conditionId!==21 ? {conditionId: template?.riskConditions[3].conditionId} : {}),
          "sceneCode": "SENSITIVE_INFO",
          "conditionCode": "SENSITIVE_INFO_4",
          "thresholdMap": {
              "unit": values.emailSuggestion,
              "time": values.fourTime
          },

      },
      {
          ...(template?.riskConditions[4].conditionId!==22 ? {conditionId: template?.riskConditions[4].conditionId} : {}),
          "sceneCode": "SENSITIVE_INFO",
          "conditionCode": "SENSITIVE_INFO_5",
          "thresholdMap": {
              "unit": values.fundPasswordSuggestion,
              "time": values.fiveTime
          },
      }
  ]

  let data={
    riskConditionVos:riskConditions,
    googleCode:values.googleCode,
  }
  let res=await saveRiskConditions(data);
  if(res.code==='0'){
    message.success('保存成功');
    setEditingSensitive(false);
    setEditingSuggestions(false);
    sensitiveForm.resetFields();
    refresh();
    getSugges();
    getTemplate();  
  }else{
    message.error(res.message);
  }
    // 保存后关闭编辑状态
    setEditingSensitive(false);
    // 这里添加保存逻辑
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

  useEffect(()=>{
    getSugges()
    getTemplate();
  },[]);

  return (
    <PageContainer>
    
      
          
          <Card style={{marginBottom:30}}>
          <Form form={suggestionsForm} layout="vertical" onFinish={handleSave}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <Title level={4}>提现处理建议</Title>
            {!editingSuggestions ? (
              <Button type="primary" onClick={() => currentUser?.employeeResp?.googleCode===true?setEditingSuggestions(true):getGoogleCode()}>编辑</Button>
            ) : (
              <Space>
                <Button onClick={() => setEditingSuggestions(false)}>取消</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </Space>
            )}
          </div>
          {/* 风险等级配置区域 */}
          <div style={{ padding: 20, marginBottom: 30 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Space align="baseline" size="large">
                <span style={{ color: 'red' }}>* 风险等级&gt;=</span>
                <Form.Item 
                  name="riskLevel1"
                  style={{ marginBottom: 0, marginRight: 5 }}
                >
                  <Input style={{ width: 60 }}  disabled={!editingSuggestions} />
                </Form.Item>
                <span>级</span>
                
                <span style={{ color: 'red', marginLeft: 15 }}>* 处理建议</span>
                <Form.Item
                  name="suggestion1"
                  style={{ marginBottom: 0, width: 500, marginLeft: 5 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSuggestions}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              <Space align="baseline" size="large">
                <span style={{ color: 'red' }}>* 风险等级&gt;=</span>
                <Form.Item 
                  name="riskLevel2"
                  style={{ marginBottom: 0, marginRight: 5 }}
                >
                  <Input style={{ width: 60 }} disabled={!editingSuggestions} />
                </Form.Item>
                <span>级</span>
                
                <span style={{ color: 'red', marginLeft: 15 }}>* 处理建议</span>
                <Form.Item
                  name="suggestion2"
                  style={{ marginBottom: 0, width: 500, marginLeft: 5 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSuggestions}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              <Space align="baseline" size="large">
                <span style={{ color: 'red' }}>* 风险等级&gt;=</span>
                <Form.Item 
                  name="riskLevel3"
                  style={{ marginBottom: 0, marginRight: 5 }}
                >
                  <Input style={{ width: 60 }}  disabled={!editingSuggestions} />
                </Form.Item>
                <span>级</span>
                
                <span style={{ color: 'red', marginLeft: 15 }}>* 处理建议</span>
                <Form.Item
                  name="suggestion3"
                  style={{ marginBottom: 0, width: 500, marginLeft: 5 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSuggestions}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
            </Space>
          </div>
          </Form>
          </Card>

          {/* 敏感信息修改区域 */}
          <Card>
          <Form form={sensitiveForm} layout="vertical" onFinish={handleSensitiveSave}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Title level={4}>敏感信息修改</Title>
              {!editingSensitive ? (
                <Button type="primary" onClick={() => currentUser?.employeeResp?.googleCode===true?setEditingSensitive(true):getGoogleCode()}>编辑</Button>
              ) : (
                <Space>
                  <Button onClick={() => setEditingSensitive(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </Space>
              )}
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 修改密码后禁止提现增加</span>
                <Form.Item name="oneTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }}  disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="passwordSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSensitive}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 解绑2FA后禁止提现增加</span>
                <Form.Item name="twoTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }}  disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="2faSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSensitive}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 更换手机号后禁止提现增加</span>
                <Form.Item name="threeTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }}  disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="phoneSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSensitive}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 更换邮箱后禁止提现增加</span>
                <Form.Item name="fourTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }}  disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="emailSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSensitive}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 修改资金密码后禁止提现增加</span>
                <Form.Item name="fiveTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }}  disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="fundPasswordSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    disabled={!editingSensitive}
                  >
                    {suggestion.map(option => (
                      <Option key={option.code} value={option.code}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Space>
          </div>
          <Form.Item name="googleCode" required label="谷歌验证码" style={{marginBottom:0,width:'30%'}}>
            <Input  disabled={!editingSensitive}/>
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

export default RiskControlSuggestions; 