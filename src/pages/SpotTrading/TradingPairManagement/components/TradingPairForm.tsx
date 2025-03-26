import React, { useEffect,useState } from 'react';
import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
type TradingPair = {
  id?: string;
  pairName?: string;
  baseCurrency?: string;
  quoteCurrency?: string;
  status?: 'enabled' | 'disabled';
  minAmount?: number;
  maxAmount?: number;
  tradingFee?: number;
  // 新增字段
  pairTag?: string;
  sortOrder?: number;
  enableTrading?: boolean;
  showInFrontend?: boolean;
  makerFee?: number;
  takerFee?: number;
  initialPrice?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  priceDecimalPlaces?: number;
  quantityDecimalPlaces?: number;
  maxMarketOrderQuantity?: number;
  maxLimitOrderQuantity?: number;
  priceDeviationPercentage?: number;
  depthPrecision1?: string;
  depthPrecision2?: string;
  depthPrecision3?: string;
  depthPrecision4?: string;
  depthPrecision5?: string;
};

interface TradingPairFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: TradingPair) => void;
  values?: TradingPair;
}

// 模拟的可用货币列表
const mockCurrencies = [
  { label: 'BTC', value: 'BTC' },
  { label: 'ETH', value: 'ETH' },
  { label: 'USDT', value: 'USDT' },
  { label: 'BNB', value: 'BNB' },
];

const TradingPairForm: React.FC<TradingPairFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  values,
}) => {
  const [form] = Form.useForm();

  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const getCoinList=async()=>{
    let data={
      "pageNo": 1,
      "pageSize": 10000
    }
    const res=await tenantCurrencyCoinList(data);
    if(res.code==='0'){
      setCurrencyList(res.data.list);
    }
  }


  useEffect(() => {
    getCoinList();
    if (visible && values) {
      form.setFieldsValue({
        ...values,
        tradingFee: values.tradingFee ? values.tradingFee * 100 : undefined,
        makerFee: values.makerFee ? values.makerFee * 100 : undefined,
        takerFee: values.takerFee ? values.takerFee * 100 : undefined,
        priceDeviationPercentage: values.priceDeviationPercentage ? values.priceDeviationPercentage * 100 : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [visible, form, values]);

  const handleSubmit = async () => {
    try {
      const fieldsValue = await form.validateFields();
      // 将百分比转换回小数
      const submitData = {
        ...fieldsValue,
        // tradingFee: fieldsValue.tradingFee / 100,
        // makerFee: fieldsValue.makerFee / 100,
        // takerFee: fieldsValue.takerFee / 100,
        // priceDeviationPercentage: fieldsValue.priceDeviationPercentage / 100,
      };
      onSubmit(submitData);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={values ? '编辑币对' : '新增币对'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'enabled',
          enableTrading: false,
          showInFrontend: true,
          makerFee: 0.001,
          takerFee: 0.001,
        }}
      >
        <h3>基本信息</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Form.Item
            name="coinSymbol"
            label="基础货币"
            rules={[{ required: true, message: '请选择基础货币' }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              {currencyList.map((item) => (
                <Select.Option value={item.coinName} key={item.coinName}>{item.coinName}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="baseSymbol"
            label="计价货币"
            rules={[{ required: true, message: '请选择计价货币' }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              {currencyList.map((item) => (
                <Select.Option value={item.coinName} key={item.coinName}>{item.coinName}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="classLabel"
            label="币对标签"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Input placeholder="例如: DeFi" />
          </Form.Item>

          {/* <Form.Item
            name="sortOrder"
            label="排序"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item> */}

          <Form.Item
            name="enable"
            label="开启交易"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="show"
            label="是否前台显示"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="buyFee"
            label="Maker手续费"
            rules={[{ required: true, message: '请输入Maker手续费' }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={1} precision={4} addonAfter="%" />
          </Form.Item>

          <Form.Item
            name="sellFee"
            label="Taker手续费"
            rules={[{ required: true, message: '请输入Taker手续费' }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={1} precision={4} addonAfter="%" />
          </Form.Item>

          <Form.Item
            name="openingPrice"
            label="开盘价"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>
        </div>

        <h3 style={{ marginTop: '20px' }}>交易规则</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <Form.Item
            name="maxBaseVolume"
            label="最大下单金额"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="minBaseVolume"
            label="最小下单金额"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="maxVolume"
            label="最大下单数量"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="minVolume"
            label="最小下单数量"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="baseCoinScale"
            label="价格精度"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  max={18} />
          </Form.Item>

          <Form.Item
            name="coinScale"
            label="数量精度"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} max={18} />
          </Form.Item>

          <Form.Item
            name="maxMarketPrice"
            label="市价单单笔最大数量"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="maxCurrentPrice"
            label="限价单最大挂单数量"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="priceDeviationPercentage"
            label="下单价格偏离"
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} addonAfter="%" />
          </Form.Item>
        </div>

        <h3 style={{ marginTop: '20px' }}>深度精度设置</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Form.Item
            name="depthOne"
            label="深度精度1"
            style={{ width: 'calc(20% - 16px)' }}
          >
            <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthTwo"
            label="深度精度2"
            style={{ width: 'calc(20% - 16px)' }}
          >
           <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthThree"
            label="深度精度3"
            style={{ width: 'calc(20% - 16px)' }}
          >
           <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthFour"
            label="深度精度4"
            style={{ width: 'calc(20% - 16px)' }}
          >
            <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          {/* <Form.Item
            name="depthPrecision5"
            label="深度精度5"
            style={{ width: 'calc(20% - 16px)' }}
          >
            <Select>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="0.1">0.1</Select.Option>
              <Select.Option value="0.01">0.01</Select.Option>
              <Select.Option value="0.001">0.001</Select.Option>
            </Select>
          </Form.Item> */}
        </div>

      </Form>
    </Modal>
  );
};

export default TradingPairForm; 