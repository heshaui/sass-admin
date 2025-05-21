import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useIntl } from 'umi';

interface MerchantFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues?: any;
}

const RootModal: React.FC<MerchantFormProps> = ({ visible, onCancel, onSave, initialValues }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  // **当 `initialValues` 变化时，重置表单数据**
  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'free.rootModal.message.formError' }));
    }
  };

  return (
    <Modal 
      title={intl.formatMessage({ id: 'free.rootModal.title' })} 
      open={visible} 
      onCancel={onCancel} 
      onOk={handleOk} 
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="nickname" 
          label={intl.formatMessage({ id: 'free.rootModal.form.nickname' })} 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'free.rootModal.form.nickname.required' }) 
          }]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.rootModal.form.nickname.placeholder' })} 
          />
        </Form.Item>
        
        <Form.Item 
          name="role" 
          label={intl.formatMessage({ id: 'free.rootModal.form.role' })} 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'free.rootModal.form.role.required' }) 
          }]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.rootModal.form.role.placeholder' })} 
          />
        </Form.Item>
        
        <Form.Item 
          name="email" 
          label={intl.formatMessage({ id: 'free.rootModal.form.email' })} 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'free.rootModal.form.email.required' }) 
          }]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.rootModal.form.email.placeholder' })} 
          />
        </Form.Item>
        
        <Form.Item 
          name="phone" 
          label={intl.formatMessage({ id: 'free.rootModal.form.phone' })} 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'free.rootModal.form.phone.required' }) 
          }]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.rootModal.form.phone.placeholder' })} 
          />
        </Form.Item>
        
        <Form.Item 
          name="remark" 
          label={intl.formatMessage({ id: 'free.rootModal.form.remark' })}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.rootModal.form.remark.placeholder' })} 
          />
        </Form.Item>
        {/* <Form.Item name="accountStatus" label="商户状态" rules={[{ required: true, message: "请选择状态" }]}>
          <Select>
            <Select.Option value="正常">正常</Select.Option>
            <Select.Option value="冻结">冻结</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default RootModal;