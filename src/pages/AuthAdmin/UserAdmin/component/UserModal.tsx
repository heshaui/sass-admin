// src/components/UserModal.tsx
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { useIntl } from '@umijs/max';
import { roleList as fetchRoleListApi } from '@/services/ant-design-pro/authAdmin';
import { validatePhone, validateEmail } from '@/utils/regex';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // 编辑时传递的初始值
  setBindGoogleVisible?: (visible: boolean) => void;
  setShowGoogleKey?: (show: boolean) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  setBindGoogleVisible,
  setShowGoogleKey,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [roleList, setRoleList] = useState<API.RoleListItem[]>([]);

  const fetchRoleList = async () => {
    try {
      let data = {
        pageNo: 1,
        pageSize: 10000,
      };
      const result = await fetchRoleListApi(data);
      if (result.code === '0') {
        setRoleList(result?.data?.list || []);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'userModal.messages.getRoleListError' }), error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRoleList();
    }
  }, [visible]);
  // 编辑时填充初始值
  useEffect(() => {
    if (initialValues) {
      const formValues = {
        ...initialValues,
        role: initialValues.role ? initialValues.role.split(',') : [],
      };
      form.setFieldsValue(formValues);
    }
  }, [initialValues, form]);

  // 提交表单
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const submitValues = {
          ...values,
          role: values.role ? values.role.join(',') : '',
        };
        onSubmit(submitValues); // 调用提交函数
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error(intl.formatMessage({ id: 'userModal.messages.fillRequired' }));
      });
  };

  return (
    <Modal
      open={visible}
      title={
        initialValues
          ? intl.formatMessage({ id: 'userModal.title.edit' })
          : intl.formatMessage({ id: 'userModal.title.create' })
      }
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        {/* 昵称 */}
        <Form.Item
          name="nickname"
          label={intl.formatMessage({ id: 'userModal.form.nickname' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'userModal.form.nickname.required' }),
            },
            { max: 20, message: intl.formatMessage({ id: 'userModal.form.nickname.maxLength' }) },
          ]}
        >
          <Input maxLength={20} showCount />
        </Form.Item>

        {/* 邮箱 */}
        <Form.Item
          name="email"
          label={intl.formatMessage({ id: 'userModal.form.email' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'userModal.form.email.required' }), // "请输入邮箱"
            },
            {
              validator: (_, value) => {
                // 只有有值时才校验格式
                if (value && !validateEmail(value)) {
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'userModal.form.email.invalid' })), // "邮箱格式不正确"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* 手机 */}
        <Form.Item
          name="phone"
          label={intl.formatMessage({ id: 'userModal.form.phone' })}
          rules={[
            {
              max: 15,
              message: intl.formatMessage({ id: 'userModal.form.phone.maxLength' }),
            },
            {
              validator: (_, value) => {
                if (!validatePhone(value) && value) {
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'userModal.form.phone.invalid' })),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input maxLength={15} />
        </Form.Item>

        {/* 备注 */}
        <Form.Item name="remark" label={intl.formatMessage({ id: 'userModal.form.remark' })}>
          <Input />
        </Form.Item>

        {/* 角色 */}
        <Form.Item
          name="role"
          label={intl.formatMessage({ id: 'userModal.form.role' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'userModal.form.role.required' }) },
          ]}
        >
          <Select
            mode="multiple"
            placeholder={intl.formatMessage({ id: 'userModal.form.role.placeholder' })}
            optionLabelProp="label"
            style={{ width: '100%' }}
          >
            {roleList.map((role) => (
              <Select.Option key={role.roleId} value={String(role.roleId)} label={role.roleName}>
                {role.roleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* 状态 */}
        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'userModal.form.status' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'userModal.form.status.required' }),
            },
          ]}
        >
          <Select>
            <Select.Option value={1}>
              {intl.formatMessage({ id: 'userModal.form.status.normal' })}
            </Select.Option>
            <Select.Option value={0}>
              {intl.formatMessage({ id: 'userModal.form.status.disabled' })}
            </Select.Option>
          </Select>
        </Form.Item>

        {/* 2FA */}
        {initialValues?.googleCode ? null : (
          <Form.Item
            name="googleCode"
            label={intl.formatMessage({ id: 'bindGoogleModal.form.googleCode' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'bindGoogleModal.form.googleCode.required' }),
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        {/* 绑定2FA */}
        {initialValues?.googleCode ? null : (
          <Form.Item
            name="bindGoogle"
            label={intl.formatMessage({ id: 'userModal.form.bindGoogle' })}
          >
            {intl.formatMessage({ id: 'userModal.form.notBindGoogle' })}
            <Button
              type="link"
              onClick={() => {
                if (setBindGoogleVisible && setShowGoogleKey) {
                  setBindGoogleVisible(true);
                  setShowGoogleKey(true);
                }
              }}
            >
              {intl.formatMessage({ id: 'userModal.form.click' })}
            </Button>
            {intl.formatMessage({ id: 'userModal.form.gotoBind' })}
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserModal;
