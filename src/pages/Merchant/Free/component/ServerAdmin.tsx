import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useIntl } from 'umi';

interface ServerAdminProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const ServerAdmin: React.FC<ServerAdminProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'free.serverAdmin.message.validateError' }));
    }
  };

  return (
    <Modal 
      title={intl.formatMessage({ id: 'free.serverAdmin.title' })}
      open={visible} 
      onCancel={onCancel} 
      onOk={handleOk} 
      width={600}
    >
      <Form form={form} layout="vertical">
        {/* IP Configuration - Commented out */}
        {/* <Form.Item 
          name="ipWhitelist" 
          label={intl.formatMessage({ id: 'free.serverAdmin.form.ipWhitelist' })}
          extra={intl.formatMessage({ id: 'free.serverAdmin.form.ipWhitelist.extra' })}
        >
          <Input.TextArea 
            placeholder={intl.formatMessage({ id: 'free.serverAdmin.form.ipWhitelist.placeholder' })} 
            rows={2} 
          />
        </Form.Item> */}

        {/* Domain Configuration */}
        <Form.Item 
          name="tenantHost" 
          label={intl.formatMessage({ id: 'free.serverAdmin.form.domain' })} 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'free.serverAdmin.form.domain.required' }) 
          }]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.serverAdmin.form.domain.placeholder' })} 
          />
        </Form.Item>

        {/* Subdomain Configuration - Commented out */}
        {/* <Form.Item 
          name="subDomain" 
          label={intl.formatMessage({ id: 'free.serverAdmin.form.subdomain' })}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'free.serverAdmin.form.subdomain.placeholder' })} 
          />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ServerAdmin;