import React, { useEffect,useState } from 'react';
import { Form, Input, InputNumber, Modal, Radio, Select, Button } from 'antd';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import { useIntl } from 'umi';
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
  coinScale?:number;
  baseCoinScale?:number;
  show?:number;
  enable?:number;
};

interface TradingPairFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: TradingPair) => void;
  values?: TradingPair;
}


const TradingPairForm: React.FC<TradingPairFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  values,
}) => {
  const intl = useIntl();
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
      console.error(intl.formatMessage({ id: 'tradingPair.form.validationFailed' }), error);
    }
  };

  return (
    <Modal
      title={values ? intl.formatMessage({ id: 'tradingPair.form.editTitle' }) : intl.formatMessage({ id: 'tradingPair.form.addTitle' })}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
      width={800}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'tradingPair.form.cancel' })}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'tradingPair.form.confirm' })}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
      >
        <h3>{intl.formatMessage({ id: 'tradingPair.form.section.basicInfo' })}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Form.Item
            name="coinSymbol"
            label={intl.formatMessage({ id: 'tradingPair.form.baseCurrency' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'tradingPair.form.baseCurrency.required' }) }]}
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
            label={intl.formatMessage({ id: 'tradingPair.form.quoteCurrency' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'tradingPair.form.quoteCurrency.required' }) }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              {currencyList.map((item) => (
                <Select.Option value={item.coinName} key={item.coinName}>{item.coinName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="coinScale"
            label={intl.formatMessage({ id: 'tradingPair.form.baseCoinDecimal' })}
            required
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Input placeholder={intl.formatMessage({ id: 'tradingPair.form.baseCoinDecimal.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="baseCoinScale"
            label={intl.formatMessage({ id: 'tradingPair.form.quoteCurrencyDecimal' })}
            required
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Input placeholder={intl.formatMessage({ id: 'tradingPair.form.quoteCurrencyDecimal.placeholder' })} />
          </Form.Item>

          <Form.Item
            name="classLabel"
            label={intl.formatMessage({ id: 'tradingPair.form.pairTag' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
            <Select.Option value="1">{intl.formatMessage({ id: 'tradingPair.category.mainstream' })}</Select.Option>
            <Select.Option value="2">{intl.formatMessage({ id: 'tradingPair.category.innovation' })}</Select.Option>
            <Select.Option value="3">{intl.formatMessage({ id: 'tradingPair.category.new' })}</Select.Option>
            <Select.Option value="4">{intl.formatMessage({ id: 'tradingPair.category.ai' })}</Select.Option>
            <Select.Option value="5">{intl.formatMessage({ id: 'tradingPair.category.meme' })}</Select.Option>
            <Select.Option value="6">{intl.formatMessage({ id: 'tradingPair.category.nft' })}</Select.Option>
            <Select.Option value="7">{intl.formatMessage({ id: 'tradingPair.category.defi' })}</Select.Option>
            <Select.Option value="8">{intl.formatMessage({ id: 'tradingPair.category.web3' })}</Select.Option>
            <Select.Option value="9">{intl.formatMessage({ id: 'tradingPair.category.payments' })}</Select.Option>
            <Select.Option value="10">{intl.formatMessage({ id: 'tradingPair.category.launchpad' })}</Select.Option>
            <Select.Option value="11">{intl.formatMessage({ id: 'tradingPair.category.layer2' })}</Select.Option>
            <Select.Option value="12">{intl.formatMessage({ id: 'tradingPair.category.solana' })}</Select.Option>
            <Select.Option value="13">{intl.formatMessage({ id: 'tradingPair.category.rwa' })}</Select.Option>
            <Select.Option value="14">{intl.formatMessage({ id: 'tradingPair.category.launchpool' })}</Select.Option>
            <Select.Option value="15">{intl.formatMessage({ id: 'tradingPair.category.gameMetaverse' })}</Select.Option>
            <Select.Option value="16">{intl.formatMessage({ id: 'tradingPair.category.storage' })}</Select.Option>
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="sortOrder"
            label={intl.formatMessage({ id: 'tradingPair.form.sortOrder' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item> */}

          <Form.Item
            name="enable"
            label={intl.formatMessage({ id: 'tradingPair.form.enableTrading' })}
            required
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              <Select.Option value={1}>{intl.formatMessage({ id: "tradingPair.form.yes" })}</Select.Option>
              <Select.Option value={0}>{intl.formatMessage({ id: "tradingPair.form.no" })}</Select.Option>
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="show"
            label={intl.formatMessage({ id: 'tradingPair.form.isVisible' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select disabled={true}>
              <Select.Option value={1}>{intl.formatMessage({ id: "tradingPair.form.yes" })}</Select.Option>
              <Select.Option value={0}>{intl.formatMessage({ id: "tradingPair.form.no" })}</Select.Option>
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="enableBuy"
            label={intl.formatMessage({ id: 'tradingPair.form.enableBuy' })}
            required
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              <Select.Option value={1}>{intl.formatMessage({ id: "tradingPair.form.yes" })}</Select.Option>
              <Select.Option value={0}>{intl.formatMessage({ id: "tradingPair.form.no" })}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="enableSell"
            label={intl.formatMessage({ id: 'tradingPair.form.enableSell' })}
            required
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Select>
              <Select.Option value={1}>{intl.formatMessage({ id: "tradingPair.form.yes" })}</Select.Option>
              <Select.Option value={0}>{intl.formatMessage({ id: "tradingPair.form.no" })}</Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item
            name="buyFee"
            label={intl.formatMessage({ id: 'tradingPair.form.makerFee' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'tradingPair.form.makerFee.required' }) }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Input style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="sellFee"
            label={intl.formatMessage({ id: 'tradingPair.form.takerFee' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'tradingPair.form.takerFee.required' }) }]}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <Input style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="openingPrice"
            label={intl.formatMessage({ id: 'tradingPair.form.openPrice' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>
        </div>

        <h3 style={{ marginTop: '20px' }}>{intl.formatMessage({ id: 'tradingPair.form.tradingRules' })}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <Form.Item
            name="maxBaseVolume"
            label={intl.formatMessage({ id: 'tradingPair.form.maxOrderAmount' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="minBaseVolume"
            label={intl.formatMessage({ id: 'tradingPair.form.minOrderAmount' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="maxVolume"
            label={intl.formatMessage({ id: 'tradingPair.form.maxOrderQuantity' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="minVolume"
            label={intl.formatMessage({ id: 'tradingPair.form.minOrderQuantity' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          {/* <Form.Item
            name="baseCoinScale"
            label={intl.formatMessage({ id: 'tradingPair.form.priceDecimal' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  max={18} />
          </Form.Item>

          <Form.Item
            name="coinScale"
            label={intl.formatMessage({ id: 'tradingPair.form.quantityDecimal' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} max={18} />
          </Form.Item> */}

          <Form.Item
            name="maxMarketPrice"
            label={intl.formatMessage({ id: 'tradingPair.form.maxMarketOrderQuantity' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="maxCurrentPrice"
            label={intl.formatMessage({ id: 'tradingPair.form.maxLimitOrderQuantity' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item>

          <Form.Item
            name="priceOffset"
            label={intl.formatMessage({ id: 'tradingPair.form.priceDeviationPercentage' })}
            style={{ width: 'calc(50% - 10px)' }}
          >
            <InputNumber style={{ width: '100%' }} addonAfter="%" />
          </Form.Item>
        </div>

        <h3 style={{ marginTop: '20px' }}>{intl.formatMessage({ id: 'tradingPair.form.section.depthPrecision' })}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Form.Item
            name="depthOne"
            label={intl.formatMessage({ id: 'tradingPair.form.depthPrecision1' })}
            style={{ width: 'calc(20% - 16px)' }}
          >
            <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthTwo"
            label={intl.formatMessage({ id: 'tradingPair.form.depthPrecision2' })}
            style={{ width: 'calc(20% - 16px)' }}
          >
           <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthThree"
            label={intl.formatMessage({ id: 'tradingPair.form.depthPrecision3' })}
            style={{ width: 'calc(20% - 16px)' }}
          >
           <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthFour"
            label={intl.formatMessage({ id: 'tradingPair.form.depthPrecision4' })}
            style={{ width: 'calc(20% - 16px)' }}
          >
            <InputNumber style={{ width: '100%' }}   />
          </Form.Item>

          <Form.Item
            name="depthFive"
            label={intl.formatMessage({ id: 'tradingPair.form.depthPrecision5' })}
            style={{ width: 'calc(20% - 16px)' }}
          >
            <InputNumber style={{ width: '100%' }}   />
          </Form.Item>
        </div>

      </Form>
    </Modal>
  );
};

export default TradingPairForm; 