import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Tree } from 'antd';
import { generateTreeData } from '@/utils/index';

interface RoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // 角色已有的权限（回显数据）
  allPermissions: any[]; // 后端返回的所有权限列表
}

// ✅ 解析回显数据，获取已选中的权限 ID
const extractCheckedKeys = (rolePermissions) => {
  return rolePermissions.map((item) => item);
};

const Dispense: React.FC<RoleModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  allPermissions,
}) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);

  // ✅ 加载树形数据
  useEffect(() => {
    if (allPermissions.length) {
      setTreeData(generateTreeData(allPermissions)); // 生成树结构
    }
  }, [allPermissions]);

  // ✅ 角色已有的权限（回显）
  useEffect(() => {
    if (initialValues && initialValues.permissions) {
      setSelectedPermissions(extractCheckedKeys(initialValues.permissions));
    }
  }, [initialValues]);

  // ✅ 处理权限勾选（支持父子级联选中）
  const handleSelect = (checkedKeys: React.Key[]) => {
    setSelectedPermissions(checkedKeys as string[]);
  };

  // ✅ 提交
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({
          roleId: initialValues?.roleId, // ✅ 返回角色 ID
          ...values,
          permissions: selectedPermissions, // ✅ 选中的权限
        });
        form.resetFields();
      })
      .catch(() => {
        message.error('请填写所有必填项');
      });
  };

  return (
    <Modal open={visible} title="权限分配" onCancel={onClose} onOk={handleSubmit}>
      <Form form={form} initialValues={initialValues} layout="vertical">
        {/* ✅ 角色权限列表 */}
        <Form.Item label="权限列表">
          <Tree
            checkable
            treeData={treeData}
            checkedKeys={selectedPermissions} // ✅ 绑定选中项（回显）
            onCheck={handleSelect}
            showLine
            defaultExpandAll
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Dispense;