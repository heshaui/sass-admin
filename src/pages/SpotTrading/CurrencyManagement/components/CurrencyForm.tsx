import React, { useState,useEffect } from 'react';
import { Form, Input, Radio, InputNumber, Select, DatePicker, Button, Card, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { tenantCurrencyCoinAll,currencyCoinParams,tenantCoin } from '@/services/ant-design-pro/spot';
import AvatarUpload from '@/components/AvatarUpload';


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
  const [form] = Form.useForm();
  const [currencyAll, setCurrencyAll] = useState([]);
  const [mainChainValue, setMainChainValue] = useState(1);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG  === "1";
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log(values);
        if (values.issuingDate) {
          values.unit=values.coinName
          values.issuingDate = dayjs(values.issuingDate).format('YYYY-MM-DD');
        }
        onSubmit(values);
      })
      .catch(info => {
        message.error('表单验证失败');
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
    const res = await currencyCoinParams(data);
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
    }
  }

  useEffect(() => {
    if(initialValues){
      getEditInfo(initialValues.coinId);
    }
    getCurrencyAll();
  }, []);

  const handleMainChainChange = (e:any) => {
    console.log(e.target.value);
    setMainChainValue(e.target.value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        mianChain: 1,
        status: 1,
        canRecharge: 0,
        canWithdraw: 0,
        unitScale: 8,

      }}
    >
      <Card 
        title="基本信息" 
        style={{ marginBottom: 16 }}
        extra={
          onCancel && (
            <Button type="link" onClick={onCancel}>
              返回
            </Button>
          )
        }
      >
        <Row gutter={24}>
          <Col span={24}> 
            <Form.Item
              name="mianChain"
              label="币种类型"
              required
            >
              <Radio.Group onChange={handleMainChainChange}>
                <Radio value={1}>主链币</Radio>
                <Radio value={2}>Token币</Radio>
              </Radio.Group>
            </Form.Item>
            
        
          </Col>
          { !isAdmin && (
          <Col span={12}>

          <Form.Item
              name="chainCoin"
              label="币种"
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
                  <Input />
                )
              }
              
            </Form.Item>
          </Col>
          )}
          <Col span={12}>
            <Form.Item
              name="coinName"
              label="币种简称"
              required
              rules={[{ required: true, message: '请输入币种简称' }]}
            >
              <Input disabled={mainChainValue !== 2&&!isAdmin} />
            </Form.Item>
          </Col>
              {
                isAdmin && (
             
          <Col span={12}>
            <Form.Item
              name="iconUrl"
              label="币种图标"
              required
              rules={[{ required: true, message: '请输入币种简称' }]}
            >
              <AvatarUpload />
            </Form.Item>
          </Col>
                )
           }
          
          <Col span={12}>
            <Form.Item
              name="nameDefault"
              label="币种英文全称"
              required
              rules={[{ required: true, message: '请输入币种英文全称' }]}
            >
              <Input placeholder="例如: Ethereum" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="sort"
              label="排序"
              required
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="unitScale"
              label="显示精度"
              required
            >
              <InputNumber min={0} max={18} style={{ width: '100%' }} placeholder="现货/资产显示的币种精度" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="memoTag"
              label="Memo/Tag"
              required
            >
              <Select>
                <Select.Option value={0}>不需要标签</Select.Option>
                <Select.Option value={1}>需要标签</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="issuingDate"
              label="发行日期"
              required
            >
              <DatePicker format="YYYY-MM-DD"/>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="transactionNum"
              label="流通数量"
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="maxSupplyQuantity"
              label="最大总供应量"
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      
      <Card title="币种开关" style={{ marginBottom: 16 }}>
      <Row gutter={24}>
      <Col span={8}>
        <Form.Item
          name="status"
          label="是否启用"
          required
        >
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        </Form.Item>
        </Col>
        </Row>
      </Card>
      <Card title="是否为平台币" style={{ marginBottom: 16 }}>
      <Row gutter={24}>
      <Col span={8}>
        <Form.Item
          name="isPlatformCoin"
          label="是否为平台币"
          required
        >
          <Select>
            <Select.Option value={0}>是</Select.Option>
            <Select.Option value={1}>否</Select.Option>
          </Select>
        </Form.Item>
        </Col>
        </Row>
      </Card>
      
      <Card title="充值信息" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="canRecharge"
              label="是否开放充值"
              required
            >
              <Select>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="minTopUp"
              label="最低充值金额"
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      
      <Card title="提现信息" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="canWithdraw"
              label="是否开放提现"
              required
            >
              <Select>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="minWithdrawAmount"
              label="单次提现最小值"
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="maxWithdrawAmount"
              label="单次提现最大值"
              required
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button type="primary" onClick={handleSubmit} style={{ marginRight: 16 }}>
          保存
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </Form>
  );
};

export default CurrencyForm;