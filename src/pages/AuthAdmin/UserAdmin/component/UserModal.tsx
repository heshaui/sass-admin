// src/components/UserModal.tsx
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useIntl } from 'umi';
import { roleList as fetchRoleListApi } from '@/services/ant-design-pro/authAdmin';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // 编辑时传递的初始值
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();



  const [roleList, setRoleList] = useState<API.RoleListItem[]>([]);
  
  useEffect(() => {
    const fetchRoleList = async () => {
      try {
          let data={
            pageNo:1,
            pageSize:10000
          }
        const result = await fetchRoleListApi(data);
        if (result.code==='0') {
          setRoleList(result.data.list|| []);
        }
      } catch (error) {
        console.error(intl.formatMessage({ id: 'userModal.messages.getRoleListError' }), error);
      }
    };
    
    fetchRoleList();
  }, []);
  // 编辑时填充初始值
  useEffect(() => {
    if (initialValues) {
      const formValues = {
        ...initialValues,
        role: initialValues.role ? initialValues.role.split(',') : []
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
          role: values.role ? values.role.join(',') : ''
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
      visible={visible}
      title={initialValues ? 
        intl.formatMessage({ id: 'userModal.title.edit' }) : 
        intl.formatMessage({ id: 'userModal.title.create' })
      }
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nickname"
          label={intl.formatMessage({ id: 'userModal.form.nickname' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'userModal.form.nickname.required' }) },
            { max: 20, message: intl.formatMessage({ id: 'userModal.form.nickname.maxLength' }) }
          ]}
        >
          <Input maxLength={20} showCount />
        </Form.Item>

        <Form.Item
          name="phone"
          label={intl.formatMessage({ id: 'userModal.form.phone' })}
          rules={[
            { max: 15, message: intl.formatMessage({ id: 'userModal.form.phone.maxLength' }) }
          ]}
        >
          <Input maxLength={15} />
        </Form.Item>

        <Form.Item
          name="email"
          label={intl.formatMessage({ id: 'userModal.form.email' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'userModal.form.email.required' }) },
            { type: 'email', message: intl.formatMessage({ id: 'userModal.form.email.format' }) }
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="googleCode"
          label="googleCode"
          rules={[{ message: '请输入googleCode' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="role"
          label={intl.formatMessage({ id: 'userModal.form.role' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'userModal.form.role.required' }) },
            {
              validator: (_, value) =>
                !value || value.length === 0
                  ? Promise.reject(new Error(intl.formatMessage({ id: 'userModal.form.role.atLeastOne' })))
                  : Promise.resolve(),
            },
          ]}
        >
           <Select 
             mode="multiple" 
             placeholder={intl.formatMessage({ id: 'userModal.form.role.placeholder' })}
             optionLabelProp="label"
             style={{ width: '100%' }}
           >
            {roleList.map(role => (
              <Select.Option 
                key={role.roleId} 
                value={String(role.roleId)}
                label={role.roleName}
              >
                {role.roleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'userModal.form.status' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'userModal.form.status.required' }) }]}
        >
          <Select>
            <Select.Option value={1}>{intl.formatMessage({ id: 'userModal.form.status.normal' })}</Select.Option>
            <Select.Option value={0}>{intl.formatMessage({ id: 'userModal.form.status.disabled' })}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;