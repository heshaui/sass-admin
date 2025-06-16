import React, { useState,useEffect } from 'react';
import { Form, Input, Radio, InputNumber, Select, DatePicker, Button, Card, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { tenantCurrencyCoinAll,currencyCoinParams,tenantCoin,tenantCurrencyCoinParams } from '@/services/ant-design-pro/spot';
import AvatarUpload from '@/components/AvatarUpload';
import { useIntl } from 'umi';


// 币种表单类型
export type CurrencyFormData = {
  mianChain: number;
  coinName: string;
  nameDefault: string;
  sort: number;
  unitScale: number;
  memoTag: number;
  issueTime: string;
  transactionNum: number;
  maxSupplyQuantity: number;
  status: number;
  canRecharge: number;
  minTopUp: number;
  canWithdraw: number;
  withdrawFee: number;
  minWithdrawAmount: number;
  maxWithdrawAmount: number;
};

interface CurrencyFormProps {
  initialValues?: Partial<CurrencyFormData>;
  onSubmit: (values: CurrencyFormData) => void;
  onCancel?: () => void;
}

const CurrencyForm: React.FC<CurrencyFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [currencyAll, setCurrencyAll] = useState([]);
  const [mainChainValue, setMainChainValue] = useState(1);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG  === "1";
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log("表单值",values);
        if (values.issuingDate) {
          values.unit=values.coinName
          values.issuingDate = dayjs(values.issuingDate).format('YYYY-MM-DD');
        }
        onSubmit(values);
      })
      .catch(info => {
        console.log(info);
        message.error(intl.formatMessage({ id: 'currency.form.validation.failed' }));
      });
  };

  const getCurrencyAll = async () => {
    if(!isAdmin){
      let data={
        pageNo:1,
        pageSize:10000
      }
      const res = await tenantCoin(data);
      if(res.code==='0'){
        setCurrencyAll(res.data.list);
      }
    }else{
      setCurrencyAll([]);
    }
  }

  const getEditInfo = async (coinId:any) => {
    let data={
      id:coinId
    }
    const res = isAdmin ?await currencyCoinParams(data):await tenantCurrencyCoinParams(data);
    if(res.code==='0'){
      console.log(res.data);
      if (res.data.issuingDate) {
        res.data.issuingDate = dayjs(res.data.issuingDate);
      }
     

      form.setFieldsValue(
        {
          ...res.data,
          chainCoin:res.data.coinId,
        }
      );

      if(res.data.mianChain===2){
        const selectedCoin = currencyAll.find(item => item.coinId === res.data.coinId);
        console.log(selectedCoin);
        if (selectedCoin) {
          form.setFieldsValue({
            mainChainValue: selectedCoin.coinName
          });
        }
      }
    }
  }

  useEffect(() => {
    if(initialValues){
      if(isAdmin){
        getEditInfo(initialValues?.coinId);
      }else{
        getEditInfo(initialValues?.id);
      }
      
    }
    getCurrencyAll();
  }, []);

  const handleMainChainChange = (e:any) => {
    console.log(e.target.value);
    setMainChainValue(e.target.value);
    if(e.target.value===2){
      //获取表单chainCoin参数
      const chainCoin = form.getFieldValue('chainCoin');
      console.log(chainCoin);
      if(chainCoin){
        const selectedCoin = currencyAll.find(item => item.coinId === chainCoin);
        console.log(selectedCoin);
        if (selectedCoin) {
          form.setFieldsValue({
            chainCoin: selectedCoin.coinName
          });
      }
    }
  };
}

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        mianChain: 1,
        status: 1,
        canRecharge: 0,
        canWithdraw: 0,


      }}
    >
      <Card 
        title={intl.formatMessage({ id: 'currency.form.basicInfo' })} 
        style={{ marginBottom: 16 }}
        extra={
          onCancel && (
            <Button type="link" onClick={onCancel}>
              {intl.formatMessage({ id: 'currency.form.return' })}
            </Button>
          )
        }
      >
        <Row gutter={24}>
          <Col span={24}> 
            <Form.Item
              name="mianChain"
              label={intl.formatMessage({ id: 'currency.form.currencyType' })}
              required
            >
              <Radio.Group onChange={handleMainChainChange}>
                <Radio value={1}>{intl.formatMessage({ id: 'currency.form.mainChainCoin' })}</Radio>
                <Radio value={2}>{intl.formatMessage({ id: 'currency.form.tokenCoin' })}</Radio>
              </Radio.Group>
            </Form.Item>
            
        
          </Col>
          { !isAdmin && (
          <Col span={12}>

          <Form.Item
              name="chainCoin"
              label={intl.formatMessage({ id: 'currency.form.currency' })}
              required
            >
              { !isAdmin&&mainChainValue === 1 && (
                <Select onChange={(value) => {
                  const selectedCoin = currencyAll.find(item => item.coinId === value);
                  if (selectedCoin) {
                  form.setFieldsValue({
                    coinName: selectedCoin.coinName
                  });
                }
              }}>
                {
                  currencyAll.map((item) => (
                    <Select.Option value={item.coinId} key={item.coinId}>{item.coinName}</Select.Option>
                  ))
                }
              </Select>
              )

              }
              { 
                mainChainValue === 2 && (
                  <Input/>
                )
              }
              
            </Form.Item>
          </Col>
          )}
          <Col span={12}>
            <Form.Item
              name="coinName"
              label={intl.formatMessage({ id: 'currency.form.currencyAbbr' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'currency.form.pleaseEnterCurrencyAbbr' }) }]}
            >
              <Input disabled={mainChainValue !== 2&&!isAdmin} />
            </Form.Item>
          </Col>
            
             
          <Col span={12}>
            <Form.Item
              name="iconUrl"
              label={intl.formatMessage({ id: 'currency.form.currencyIcon' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'currency.form.pleaseUploadCurrencyIcon' }) }]}
            >
              <AvatarUpload />
            </Form.Item>
            <span>{intl.formatMessage({ id: 'currency.form.frontendDisplayLogo' })}</span>
          </Col>


          
          <Col span={12}>
            <Form.Item
              name="nameDefault"
              label={intl.formatMessage({ id: 'currency.form.currencyEnglishName' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'currency.form.pleaseEnterCurrencyEnglishName' }) }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'currency.form.exampleEthereum' })} />
             
            </Form.Item>
            <span>{intl.formatMessage({ id: 'currency.form.exampleTether' })}</span>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="sort"
              label={intl.formatMessage({ id: 'currency.column.sort' })}
              required
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="unitScale"
              label={intl.formatMessage({ id: 'currency.form.displayPrecision' })}
              required
            >
              <InputNumber min={0} max={18} style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'currency.form.spotAssetDisplayPrecision' })} />
            </Form.Item>
            <span>{intl.formatMessage({ id: 'currency.form.spotAssetDisplayPrecision' })}</span>
          </Col>
          
          {
          mainChainValue === 1 && (
          <Col span={12}>
            <Form.Item
              name="memoTag"  
              label={intl.formatMessage({ id: 'currency.form.memoTag' })}
              required
            >
              <Select>
                <Select.Option value={0}>{intl.formatMessage({ id: 'currency.form.noTagRequired' })}</Select.Option>
                <Select.Option value={1}>{intl.formatMessage({ id: 'currency.form.tagRequired' })}</Select.Option>
              </Select>
             
            </Form.Item>
            <span>{intl.formatMessage({ id: 'currency.form.tagRequiredForWithdrawal' })}</span>
          </Col>
           )}
            
          
          <Col span={24}>
            <Form.Item
              name="issuingDate"
              label={intl.formatMessage({ id: 'currency.form.issueDate' })}
              required
            >
              <DatePicker format="YYYY-MM-DD"/>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="transactionNum"
              label={intl.formatMessage({ id: 'currency.form.circulatingSupply' })}
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="maxSupplyQuantity"
              label={intl.formatMessage({ id: 'currency.form.maxTotalSupply' })}
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      
      <Card title={intl.formatMessage({ id: 'currency.form.currencySwitch' })} style={{ marginBottom: 16 }}>
      <Row gutter={24}>
      <Col span={8}>
        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'currency.form.isEnabled' })}
          required
        >
          <Select>
            <Select.Option value={1}>{intl.formatMessage({ id: 'currency.form.yes' })}</Select.Option>
            <Select.Option value={0}>{intl.formatMessage({ id: 'currency.form.no' })}</Select.Option>
          </Select>
        </Form.Item>
        <span>{intl.formatMessage({ id: 'currency.form.enabledDisplayFrontend' })}</span>
        </Col>
        </Row>
      </Card>
      {/* <Card title={intl.formatMessage({ id: 'currency.form.isPlatformCoin' })} style={{ marginBottom: 16 }}>
      <Row gutter={24}>
      <Col span={8}>
        <Form.Item
          name="isPlatformCoin"
          label={intl.formatMessage({ id: 'currency.form.isPlatformCoin' })}
          required
        >
          <Select>
            <Select.Option value={0}>{intl.formatMessage({ id: 'currency.form.yes' })}</Select.Option>
            <Select.Option value={1}>{intl.formatMessage({ id: 'currency.form.no' })}</Select.Option>
          </Select>
        </Form.Item>
        </Col>
        </Row>
      </Card>2025-06-12 zyj */}
      
      <Card title={intl.formatMessage({ id: 'currency.form.depositInfo' })} style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="canRecharge"
              label={intl.formatMessage({ id: 'currency.form.isDepositEnabled' })}
              required
            >
              <Select>
                <Select.Option value={1}>{intl.formatMessage({ id: 'currency.form.yes' })}</Select.Option>
                <Select.Option value={0}>{intl.formatMessage({ id: 'currency.form.no' })}</Select.Option>
              </Select>
            
            </Form.Item>
            <span>{intl.formatMessage({ id: 'currency.form.statusAffectsSubCoins' })}</span>
          </Col>
          
          {/* <Col span={12}>
            <Form.Item
              name="minTopUp"
              label={intl.formatMessage({ id: 'currency.form.minDepositAmount' })}
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col> 2025-06-12 zyj */}
        </Row>
      </Card>
      
      <Card title={intl.formatMessage({ id: 'currency.form.withdrawalInfo' })} style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="canWithdraw"
              label={intl.formatMessage({ id: 'currency.form.isWithdrawalEnabled' })}
              required
            >
              <Select>
                <Select.Option value={1}>{intl.formatMessage({ id: 'currency.form.yes' })}</Select.Option>
                <Select.Option value={0}>{intl.formatMessage({ id: 'currency.form.no' })}</Select.Option>
              </Select>
             
            </Form.Item>
            <span>{intl.formatMessage({ id: 'currency.form.statusAffectsSubCoins' })}</span>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              name="minWithdrawAmount"
              label={intl.formatMessage({ id: 'currency.form.minWithdrawalAmount' })}
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col> 2025-06-12 zyj */}
          
          {/* <Col span={12}>
            <Form.Item
              name="maxWithdrawAmount"
              label={intl.formatMessage({ id: 'currency.form.maxWithdrawalAmount' })}
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col> 2025-06-12 zyj */}
        </Row>
      </Card>
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button type="primary" onClick={handleSubmit} style={{ marginRight: 16 }}>
          {intl.formatMessage({ id: 'currency.form.save' })}
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>
            {intl.formatMessage({ id: 'currency.form.cancel' })}
          </Button>
        )}
      </div>
    </Form>
  );
};

export default CurrencyForm;