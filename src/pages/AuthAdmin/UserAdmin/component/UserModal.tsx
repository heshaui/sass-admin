// src/components/UserModal.tsx
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
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
        console.error('获取角色列表失败', error);
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
        message.error('请填写所有必填项');
      });
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? '编辑用户' : '新建用户'}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nickname"
          label="昵称"
          rules={[
            { required: true, message: '请输入昵称' },
            { max: 20, message: '昵称最多20个字符' }
          ]}
        >
          <Input maxLength={20} showCount />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { max: 15, message: '手机号最多15个字符' }
          ]}
        >
          <Input maxLength={15} />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱格式' }
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
          label="角色"
          rules={[
            { required: true, message: '请选择角色' },
            {
              validator: (_, value) =>
                !value || value.length === 0
                  ? Promise.reject(new Error('请至少选择一个角色'))
                  : Promise.resolve(),
            },
          ]}
        >
           <Select 
             mode="multiple" 
             placeholder="请选择角色"
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
          label="状态"
          rules={[{ required: true, message: '请选择用户状态' }]}
        >
          <Select>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;