import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Modal, Radio, Button, message } from 'antd';
import { 
  addAnnouncement, 
  updateAnnouncement 
} from '@/services/ant-design-pro/operation';

const { Option } = Select;
const { TextArea } = Input;

export type AnnouncementFormProps = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  values?: Record<string, any>;
  type: 'create' | 'update';
};

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
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
      form.setFieldsValue({
        ...values,
        sendTime: values.sendTime ? new Date(values.sendTime) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [visible, form, values, type]);

  const handleSubmit = async () => {
    try {
      const fieldsValue = await form.validateFields();
      setLoading(true);
      
      const submitData = {
        ...fieldsValue,
        sendTime: fieldsValue.sendTime ? fieldsValue.sendTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      
      let response;
      if (type === 'create') {
        response = await addAnnouncement(submitData);
      } else {
        response = await updateAnnouncement({
          id: values?.id,
          ...submitData,
        });
      }
      
      setLoading(false);
      if (response && response.success) {
        message.success(type === 'create' ? '创建成功' : '更新成功');
        onSuccess();
      } else {
        message.error(type === 'create' ? '创建失败' : '更新失败');
      }
    } catch (error) {
      setLoading(false);
      message.error('表单校验失败');
    }
  };

  return (
    <Modal
      title={type === 'create' ? '发布公告' : '编辑公告'}
      visible={visible}
      width={640}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {type === 'create' ? '发布' : '保存'}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          sendStatus: '待发布',
          category: '新功能',
        }}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <TextArea rows={4} placeholder="请输入描述" />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select>
            <Option value="新功能">新功能</Option>
            <Option value="APP优化">APP优化</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="sendTime"
          label="发送时间"
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="sendStatus"
          label="发送状态"
        >
          <Radio.Group>
            <Radio value="待发布">待发布</Radio>
            <Radio value="已发送">已发送</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnnouncementForm; 