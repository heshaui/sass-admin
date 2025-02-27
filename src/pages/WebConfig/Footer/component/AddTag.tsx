import { Button, Flex, Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';

interface AddTagProps {
  visible: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddTag: React.FC<AddTagProps> = ({ visible, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [displayType, setDisplayType] = useState('vertical'); // 默认选中“竖排”
  const [tagType, setTagType] = useState('tag'); // 默认选中“添加标签”

  const onFinish = (values: any) => {
    onSubmit({
      ...values,
      type: tagType, // 添加标签或菜单类型
      displayType, // 展现形式
    });
    form.resetFields(); // 提交后重置表单
  };

  return (
    <Modal
      title="添加菜单"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable // 显示关闭按钮
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* 标签/菜单选择 - 13 */}
        <Form.Item label="标签/菜单">
          <Radio.Group value={tagType} onChange={(e) => setTagType(e.target.value)}>
            <Radio value="tag">添加标签</Radio>
            <Radio value="menu">添加菜单</Radio>
          </Radio.Group>
        </Form.Item>

        {/* 展现形式 - 14 */}
        <Form.Item label="展现形式">
          <Radio.Group value={displayType} onChange={(e) => setDisplayType(e.target.value)}>
            <Radio value="vertical">
              竖排 {/* <a style={{ color: "#1890ff", marginLeft: 4 }}>查看示例图</a> */}
            </Radio>
            <Radio value="horizontal">
              横排 {/* <a style={{ color: "#1890ff", marginLeft: 4 }}>查看示例图</a> */}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* 标签名 - 15 */}
        <Form.Item
          label="*标签名"
          name="tagName"
          rules={[{ required: true, message: '请输入标签名' }]}
        >
          <Input placeholder="标签" />
        </Form.Item>

        {/* 提交和取消按钮 - 22 */}
        <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
          <Flex justify="center" gap={10}>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTag;
