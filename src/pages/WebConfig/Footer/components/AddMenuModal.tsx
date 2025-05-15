import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Button, Radio, Select } from 'antd';
import { saveHomeBottom, pcAccessPathAll } from '@/services/ant-design-pro/WebConfig';

const { Option } = Select;

interface AddMenuModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  parentId?: any;
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({ open, onCancel, onSubmit, parentId }) => {
  const [form] = Form.useForm();
  const [accessType, setAccessType] = useState("1");
  const [pcOptions, setPcOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPcOptions = async () => {
      try {
        const result = await pcAccessPathAll();
        if (result.code === '0' && result.data) {
          const options = JSON.parse(result.data);
          setPcOptions(options);
        }
      } catch (error) {
        console.error('获取PC功能列表失败:', error);
      }
    };
    
    fetchPcOptions();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={parentId ? "添加子菜单" : "添加菜单"}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        initialValues={{
          values: {
            accessType: "1",
            displayStatus: true
          }
        }}
      >
        <Form.Item
          label="标题"
          name={['values', 'menuName']}
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="菜单名字" />
        </Form.Item>
        <Form.Item
          label="菜单描述"
          name={['values', 'bottomDescription']}
          rules={[{ required: true, message: '请输入菜单描述' }]}
        >
          <Input placeholder="菜单描述" />
        </Form.Item>
        <Form.Item label="跳转地址">
          <Form.Item
            name={['values', 'accessType']}
            noStyle
          >
            <Radio.Group onChange={(e) => setAccessType(e.target.value)}>
              <Radio value="1">PC功能</Radio>
              <Radio value="2">自定义URL</Radio>
            </Radio.Group>
          </Form.Item>
          
          {accessType === "1" ? (
            <Form.Item 
              name={['values', 'accessPath']} 
              style={{ marginTop: 10 }}
            >
              <Select placeholder="请选择">
                {Array.isArray(pcOptions) && pcOptions.map(option => (
                  <Option key={option.accessPath} value={option.accessPath}>
                    {option.functionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item 
              name={['values', 'accessPath']} 
              style={{ marginTop: 10 }}
            >
              <Input placeholder="请输入URL" />
            </Form.Item>
          )}
        </Form.Item>
        
        <Form.Item
          label="是否显示"
          name={['values', 'show']}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMenuModal; 