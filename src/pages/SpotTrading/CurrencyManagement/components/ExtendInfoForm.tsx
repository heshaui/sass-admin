import React, { useEffect,useState } from 'react';
import { Button, Form, Input, InputNumber, Modal,Select,Switch } from 'antd';
import { protocolTypeList } from '@/services/ant-design-pro/spot';
import { useIntl } from 'umi';


// 拓展信息数据类型定义
export type ExtendInfoFormData = {
  id?: number;
  coinId?: number;
  protocolId?: number;
  mainAddress?: string;
  token?: string;
  decimals?: number;
  status?: number;
  withdrawFee?: number;
  minWithdrawFee?: number;
  confirms?: number;
  coinName?: string;
  withdraw?: number;
  recharge?: number;
  autoWithdraw?: number;
  minWithdraw?: number;
  maxWithdraw?: number;
  minRecharge?: number;
};

interface ExtendInfoFormProps {
  visible: boolean;
  initialValues?: ExtendInfoFormData | null;
  onSubmit: (values: ExtendInfoFormData) => void;
  onCancel: () => void;
  mode?: string;
}

const ExtendInfoForm: React.FC<ExtendInfoFormProps> = ({
  visible,
  initialValues,
  onSubmit,
  onCancel,
  mode
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [protocolList, setProtocolList] = useState([]);


  const getProtocol= async () => {
    let data={
        pageNo:1,
        pageSize:10000
    }
    const res = await protocolTypeList(data);
    if (res.code === '0') {
      setProtocolList(res.data.list);
    }
  }

  useEffect(() => {
    getProtocol();
    console.log(initialValues);
    if (visible && initialValues) {
      // 将状态值转换为布尔值，用于 Switch 组件
      const formValues = {
        ...initialValues,
        status: initialValues.status === 1,
        withdraw: initialValues.withdraw === 1,
        recharge: initialValues.recharge === 1,
        autoWithdraw: initialValues.autoWithdraw === 1
      };
      form.setFieldsValue(formValues);
    }
  }, [visible, initialValues, form]);

  

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 将布尔值转换回 0 或 1
      const submitValues = {
        ...values,
        status: values.status ? 1 : 0,
        withdraw: values.withdraw ? 1 : 0,
        recharge: values.recharge ? 1 : 0,
        autoWithdraw: values.autoWithdraw ? 1 : 0
      };
      
      onSubmit(submitValues);
      form.resetFields();
    } catch (error) {
      console.error(intl.formatMessage({ id: 'currency.extendInfo.formValidationFailed' }), error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'currency.extendInfo.title' })}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      maskClosable={false}
      width={600}
      footer={
        <div style={{display:'flex',justifyContent:'center'}}>
        <Button key="cancel" onClick={handleCancel} style={{marginRight:'10px'}}>
          {intl.formatMessage({ id: 'currency.extendInfo.cancel' })}
        </Button>
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'currency.extendInfo.submit' })}
        </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ? { 
          ...initialValues, 
          status: initialValues.status === 1,
          withdraw: initialValues.withdraw === 1,
          recharge: initialValues.recharge === 1,
          autoWithdraw: initialValues.autoWithdraw === 1
        } : {}}
      >
        <Form.Item
          name="coinId"
          label={intl.formatMessage({ id: 'currency.extendInfo.coinId' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterCoinId' }) }]}
        >
          <InputNumber style={{ width: '100%' }} disabled={true} />
        </Form.Item>
        <Form.Item
          name="coinName"
          label={intl.formatMessage({ id: 'currency.extendInfo.coinName' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterCoinName' }) }]}
        >
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          name="protocolId"
          label={intl.formatMessage({ id: 'currency.extendInfo.networkType' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseSelectNetworkType' }) }]}
        >
            <Select>
                {
                    protocolList.map((item:any)=>(
                        <Select.Option value={item.id} key={item.id}>{item.protocolName}</Select.Option>
                    ))
                }
            </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'currency.extendInfo.status' })}
          required
          valuePropName="checked"
        >
          <Switch 
            checkedChildren={intl.formatMessage({ id: 'currency.extendInfo.enabled' })} 
            unCheckedChildren={intl.formatMessage({ id: 'currency.extendInfo.disabled' })} 
          />
        </Form.Item>
                
        <Form.Item
          name="mainAddress"
          label={intl.formatMessage({ id: 'currency.extendInfo.mainChainAddress' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterMainChainAddress' }) }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
        name="token" 
        label={intl.formatMessage({ id: 'currency.extendInfo.contractAddress' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterContractAddress' }) }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="decimals"
          label={intl.formatMessage({ id: 'currency.extendInfo.contractPrecision' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterDecimals' }) }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="withdrawFee"
          label={intl.formatMessage({ id: 'currency.extendInfo.withdrawalFee' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterWithdrawalFee' }) }]}
        >
          <Input style={{ width: '100%' }}  />
        </Form.Item>

        {/* <Form.Item
          name="minWithdrawFee"
          label={intl.formatMessage({ id: 'currency.extendInfo.minWithdrawalFee' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterMinWithdrawalFee' }) }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item> 2025-06-12 zyj */}
        <Form.Item
          name="withdraw"
          label={intl.formatMessage({ id: 'currency.extendInfo.withdrawalSwitch' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseSelectWithdrawalSwitch' }) }]}
        >
          <Switch 
            checkedChildren={intl.formatMessage({ id: 'currency.extendInfo.enabled' })} 
            unCheckedChildren={intl.formatMessage({ id: 'currency.extendInfo.disabled' })} 
          />
        </Form.Item>
        <Form.Item
          name="recharge"
          label={intl.formatMessage({ id: 'currency.extendInfo.depositSwitch' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseSelectDepositSwitch' }) }]}
        >
          <Switch 
            checkedChildren={intl.formatMessage({ id: 'currency.extendInfo.enabled' })} 
            unCheckedChildren={intl.formatMessage({ id: 'currency.extendInfo.disabled' })} 
          />
        </Form.Item>
        {/* <Form.Item
          name="autoWithdraw"
          label={intl.formatMessage({ id: 'currency.extendInfo.autoWithdrawalSwitch' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseSelectAutoWithdrawalSwitch' }) }]}
        >
          <Switch 
            checkedChildren={intl.formatMessage({ id: 'currency.extendInfo.enabled' })} 
            unCheckedChildren={intl.formatMessage({ id: 'currency.extendInfo.disabled' })} 
          />
        </Form.Item> 2025-06-12 zyj */}
        <Form.Item
          name="minWithdraw"
          label={intl.formatMessage({ id: 'currency.extendInfo.minWithdrawalAmount' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterMinWithdrawalAmount' }) }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="maxWithdraw"
          label={intl.formatMessage({ id: 'currency.extendInfo.maxWithdrawalAmount' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterMaxWithdrawalAmount' }) }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="minRecharge"
          label={intl.formatMessage({ id: 'currency.extendInfo.minDepositAmount' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterMinDepositAmount' }) }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="confirms"
          label={intl.formatMessage({ id: 'currency.extendInfo.confirmations' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'currency.extendInfo.pleaseEnterConfirmations' }) }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExtendInfoForm;
