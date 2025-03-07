import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Button, message } from 'antd';
import { 

} from '@/services/ant-design-pro/operation';

const { TextArea } = Input;

export type CategoryFormProps = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  values?: Record<string, any>;
  type: 'create' | 'update';
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  values,
  type,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (visible && type === 'update' && values) {
      form.setFieldsValue(values);
    } else {
      form.resetFields();
    }
  }, [visible, form, values, type]);

  const handleSubmit = async () => {
    try {
    //   const fieldsValue = await form.validateFields();
    //   setLoading(true);
      
    //   let response;
    //   if (type === 'create') {
    //     response = await addCategory(fieldsValue);
    //   } else {
    //     response = await updateCategory({
    //       id: values?.id,
    //       ...fieldsValue,
    //     });
    //   }
      
    //   setLoading(false);
    //   if (response && response.success) {
    //     message.success(type === 'create' ? '创建成功' : '更新成功');
    //     onSuccess();
    //   } else {
    //     message.error(type === 'create' ? '创建失败' : '更新失败');
    //   }
    } catch (error) {
      setLoading(false);
      message.error('表单校验失败');
    }
  };

  return (
    <Modal
      title={type === 'create' ? '添加分类' : '编辑分类'}
      visible={visible}
      width={500}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          确定
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          sort: 0,
        }}
      >
        <Form.Item
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <TextArea rows={4} placeholder="请输入描述" />
        </Form.Item>
        
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="数字越小越靠前" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm; 