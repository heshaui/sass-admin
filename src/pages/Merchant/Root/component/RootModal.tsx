import React, { useEffect, useState } from "react";
import { Modal, Form, Select, message } from "antd";
import { useIntl } from 'umi';
import { tenantRoleList } from "@/services/ant-design-pro/merchant";

const { Option } = Select;

interface RootModalProps {
  visible: boolean;       
  onCancel: () => void;
  onSubmit: (roleId: string) => void;
  currentRecord: any;
}

const RootModal: React.FC<RootModalProps> = ({ visible, onCancel, onSubmit, currentRecord  }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      let data={pageNo:1,pageSize:1000}
      const res = await tenantRoleList(data);

      if (res.code === "0") {
        setRoles(res.data.list);
      } else {
        message.error(intl.formatMessage({ id: 'merchant.message.roleListFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'merchant.message.roleListError' }));
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRoles();
      form.resetFields();
    }
    if (currentRecord) {
      form.setFieldsValue({
        roleId: Number(currentRecord.role),
      });
    }
  }, [visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values.roleId);
      form.resetFields();
    });
  };

  return (
    <Modal 
      title={intl.formatMessage({ id: 'merchant.message.roleAssign' })}
      open={visible} 
      onCancel={onCancel} 
      onOk={handleOk} 
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="roleId" 
          label={intl.formatMessage({ id: 'merchant.form.role.selectLabel' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'merchant.form.role.required' }) 
          }]}
        >
          <Select 
            placeholder={intl.formatMessage({ id: 'merchant.form.role.placeholder' })}
          >
            {roles.map((role:any) => (
              <Option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RootModal;