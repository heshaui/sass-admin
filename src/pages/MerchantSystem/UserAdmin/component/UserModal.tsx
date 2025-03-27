// src/components/UserModal.tsx
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { roleList as fetchRoleListApi } from '@/services/ant-design-pro/authAdmin';
import { getTenantRoleList } from '@/services/ant-design-pro/merchantSystem';

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
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
    const fetchRoleList = async () => {
      try {
          let data={
            pageNo:1,
            pageSize:10000
          }
        const result = await getTenantRoleList(data);
        if (result.code==='0') {
          setRoleList(result.data.list|| []);
        }
      } catch (error) {
        console.error('获取角色列表失败', error);
      }
    };
    
    fetchRoleList();
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
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
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
          label="权限"
          rules={[{ required: true, message: '请选择权限' }]}
        >
           <Select>
            {roleList.map(role => (
              <Select.Option key={role.roleId} value={String(role.roleId)}>
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