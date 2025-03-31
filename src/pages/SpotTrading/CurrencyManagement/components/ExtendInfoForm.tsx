import React, { useEffect,useState } from 'react';
import { Button, Form, Input, InputNumber, Modal,Select,Switch } from 'antd';
import { protocolTypeList } from '@/services/ant-design-pro/spot';


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
        status: initialValues.status === 1
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
        status: values.status ? 1 : 0
      };
      
      onSubmit(submitValues);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="币种拓展信息"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      maskClosable={false}
      width={600}
      footer={
        <div style={{display:'flex',justifyContent:'center'}}>
        <Button key="cancel" onClick={handleCancel} style={{marginRight:'10px'}}>
          取消
        </Button>
        <Button key="submit" type="primary" onClick={handleSubmit}>
          提交
        </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ? { ...initialValues, status: initialValues.status === 1 } : {}}
      >
        <Form.Item
          name="coinId"
          label="币种ID"
          rules={[{ required: true, message: '请输入币种ID' }]}
        >
          <InputNumber style={{ width: '100%' }} disabled={true} />
        </Form.Item>
        <Form.Item
          name="coinName"
          label="币种名称"
          rules={[{ required: true, message: '请输入币种名称' }]}
        >
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          name="protocolId"
          label="协议ID"
          rules={[{ required: true, message: '请输入协议ID' }]}
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
          label="状态"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="启用" 
            unCheckedChildren="禁用" 
          />
        </Form.Item>
                
        <Form.Item
          name="mainAddress"
          label="主地址"
          rules={[{ required: true, message: '请输入主地址' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="token" label="Token">
          <Input />
        </Form.Item>

        <Form.Item
          name="decimals"
          label="小数位数"
          rules={[{ required: true, message: '请输入小数位数' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="withdrawFee"
          label="提现手续费"
          rules={[{ required: true, message: '请输入提现手续费' }]}
        >
          <InputNumber style={{ width: '100%' }}  />
        </Form.Item>

        <Form.Item
          name="minWithdrawFee"
          label="最小提现手续费"
          rules={[{ required: true, message: '请输入最小提现手续费' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="confirms"
          label="确认数"
          rules={[{ required: true, message: '请输入确认数' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExtendInfoForm;
