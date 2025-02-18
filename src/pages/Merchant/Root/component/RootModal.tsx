import React, { useEffect, useState } from "react";
import { Modal, Form, Select, message } from "antd";
import { tenantRoleList } from "@/services/ant-design-pro/merchant"; // 获取角色列表的API

const { Option } = Select;

interface RootModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (roleId: string) => void;
}

const RootModal: React.FC<RootModalProps> = ({ visible, onCancel, onSubmit }) => {
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
        message.error("获取角色列表失败");
      }
    } catch (error) {
      message.error("获取角色列表异常");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRoles();
      form.resetFields();
    }
  }, [visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values.roleId);
      form.resetFields();
    });
  };

  return (
    <Modal title="角色分配" open={visible} onCancel={onCancel} onOk={handleOk} destroyOnClose>
      <Form form={form} layout="vertical">
        <Form.Item name="roleId" label="选择角色" rules={[{ required: true, message: "请选择角色" }]}>
          <Select placeholder="请选择角色">
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