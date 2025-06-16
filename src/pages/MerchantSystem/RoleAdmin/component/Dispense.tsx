import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Tree } from 'antd';
import { useIntl } from '@umijs/max';
//@ts-ignore
import { merchantTreeData } from '@/utils/index';

interface RoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // 角色已有的权限（回显数据）
  allPermissions: any[]; // 后端返回的所有权限列表
}

// ✅ 解析回显数据，获取已选中的权限 ID
const extractCheckedKeys = (rolePermissions: any[]) => {
  return rolePermissions.map((item: any) => item);
};

// 添加一个辅助函数来获取所有选中的节点（包括父节点）
const getAllCheckedKeys = (checkedKeys: React.Key[], treeData: any[]) => {
  const allKeys = [...checkedKeys];
  const parentMap = new Map();

  // 构建父子节点映射关系
  const buildParentMap = (nodes: any[], parent: any = null) => {
    nodes.forEach(node => {
      if (parent) {
        parentMap.set(node.key, parent.key);
      }
      if (node.children && node.children.length > 0) {
        buildParentMap(node.children, node);
      }
    });
  };

  buildParentMap(treeData);

  // 查找所有父节点
  const findParents = (key: React.Key) => {
    const parentKey = parentMap.get(key);
    if (parentKey && !allKeys.includes(parentKey)) {
      allKeys.push(parentKey);
      findParents(parentKey);
    }
  };

  // 对每个选中的key查找其父节点
  checkedKeys.forEach(key => findParents(key));

  return allKeys;
};

const Dispense: React.FC<RoleModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  allPermissions,
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);

  // ✅ 加载树形数据
  useEffect(() => {
    if (allPermissions.length) {
      setTreeData(merchantTreeData(allPermissions, intl)); // 生成树结构
    }
  }, [allPermissions]);

  // ✅ 角色已有的权限（回显）
  useEffect(() => {
    if (initialValues && initialValues.permissions) {
      setSelectedPermissions(extractCheckedKeys(initialValues.permissions));
    }
  }, [initialValues]);

  // ✅ 处理权限勾选（支持父子级联选中）
  const handleSelect = (checkedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }, info: any) => {
    console.log("checkedKeys", checkedKeys);
    console.log("info", info);

    // 获取选中的keys
    const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;

    // 获取所有需要选中的keys（包括父节点）
    const allCheckedKeys = getAllCheckedKeys(keys as React.Key[], treeData);
    console.log(allCheckedKeys)
    setSelectedPermissions(allCheckedKeys as string[]);
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
        message.error(intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.fillRequired' }));
      });
  };

  return (
    <Modal open={visible} title={intl.formatMessage({ id: 'merchantSystem.roleAdmin.modal.assignPermission' })} onCancel={onClose} onOk={handleSubmit}>
      <Form form={form} initialValues={initialValues} layout="vertical">
        {/* ✅ 角色权限列表 */}
        <Form.Item label={intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.permissionList' })}>
          <Tree
            checkable
            treeData={treeData}
            checkedKeys={selectedPermissions} // ✅ 绑定选中项（回显）
            onCheck={handleSelect}
            showLine
            defaultExpandAll
            checkStrictly={true}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Dispense;
