import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Tree } from 'antd';

interface RoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;  // 编辑时传递的初始值
  allPermissions: any[];  // 所有权限数据，包括树形结构的权限
}

const Dispense: React.FC<RoleModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  allPermissions,
}) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // 设置初始权限选择，编辑时填充用户已分配的权限
  useEffect(() => {
    if (initialValues) {
      setSelectedPermissions(initialValues.permissions || []);
    }
  }, [initialValues]);

  // 提交表单
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({
          ...values,
          permissions: selectedPermissions, // 添加选中的权限
        });
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error('请填写所有必填项');
      });
  };

  // 处理树形结构的选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    setSelectedPermissions(selectedKeys as string[]);
  };

  return (
    <Modal
      visible={visible}
      title='权限分配'
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
      >
     

        {/* 权限选择（树形结构） */}
        <Form.Item
          label="权限列表"
          required
        >
          <Tree
            checkable
            treeData={allPermissions}
            defaultCheckedKeys={selectedPermissions}
            onCheck={handleSelect}
            checkStrictly
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Dispense;