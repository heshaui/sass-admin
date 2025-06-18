// src/components/UserModal.tsx
import { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import { Modal, Form, Input, Select, message } from 'antd';
import { getTenantRoleList } from '@/services/ant-design-pro/merchantSystem';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // 编辑时传递的初始值
}

const UserModal: React.FC<UserModalProps> = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const [roleList, setRoleList] = useState<API.RoleListItem[]>([]);
  const fetchRoleList = async () => {
    try {
      let data = {
        pageNo: 1,
        pageSize: 10000,
      };
      const result = await getTenantRoleList(data);
      if (result.code === '0') {
        setRoleList(result.data.list || []);
      }
    } catch (error) {
      console.error(
        intl.formatMessage({ id: 'merchantSystem.userModal.message.fetchRoles.failed' }),
        error,
      );
    }
  };
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
      fetchRoleList();
    }
  }, [visible, initialValues, form]);

  // 提交表单
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values); // 调用提交函数
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error(intl.formatMessage({ id: 'merchantSystem.userModal.message.fillRequired' }));
      });
  };

  return (
    <Modal
      visible={visible}
      title={
        initialValues
          ? intl.formatMessage({ id: 'merchantSystem.userModal.title.edit' })
          : intl.formatMessage({ id: 'merchantSystem.userModal.title.create' })
      }
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nickname"
          label={intl.formatMessage({ id: 'merchantSystem.userModal.form.nickname' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'merchantSystem.userModal.form.nickname.required',
              }),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label={intl.formatMessage({ id: 'merchantSystem.userModal.form.phone' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'merchantSystem.userModal.form.phone.required' }),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label={intl.formatMessage({ id: 'merchantSystem.userModal.form.email' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'merchantSystem.userModal.form.email.required' }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="googleCode"
          label={intl.formatMessage({ id: 'merchantSystem.userModal.form.googleCode' })}
          rules={[{ message: intl.formatMessage({ id: 'merchantSystem.userModal.form.googleCode.required' }) }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="role"
          label={intl.formatMessage({ id: 'merchantSystem.userModal.form.permission' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'merchantSystem.userModal.form.permission.required',
              }),
            },
          ]}
        >
          <Select>
            {roleList.map((role) => (
              <Select.Option key={role.roleId} value={String(role.roleId)}>
                {role.roleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'merchantSystem.userModal.form.status' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'merchantSystem.userModal.form.status.required' }),
            },
          ]}
        >
          <Select>
            <Select.Option value={1}>
              {intl.formatMessage({ id: 'merchantSystem.userModal.form.status.normal' })}
            </Select.Option>
            <Select.Option value={0}>
              {intl.formatMessage({ id: 'merchantSystem.userModal.form.status.disabled' })}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
