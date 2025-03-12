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

// ✅ 添加辅助函数：查找所有父节点
const findParentKeys = (treeData: any[], targetKeys: string[], parentKeys: string[] = []) => {
  treeData.forEach(node => {
    if (node.children && node.children.length > 0) {
      // 检查当前节点的子节点是否有被选中的
      const hasSelectedChild = node.children.some(child => 
        targetKeys.includes(child.key) || 
        (child.children && findParentKeys([child], targetKeys, []).length > 0)
      );
      
      // 如果有子节点被选中，将当前节点添加到父节点列表
      if (hasSelectedChild && !parentKeys.includes(node.key)) {
        parentKeys.push(node.key);
      }
      
      // 递归检查子节点
      findParentKeys(node.children, targetKeys, parentKeys);
    }
  });
  
  return parentKeys;
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
  // ✅ 处理权限勾选
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
            checkedKeys={selectedPermissions} 
            onCheck={handleSelect}
            showLine
            defaultExpandAll
            checkStrictly={true} // ✅ 保持为 true，实现独立选择
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Dispense;