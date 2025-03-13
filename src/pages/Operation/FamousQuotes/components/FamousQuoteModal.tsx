import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { getFamousAphorismsDetail,addFamousAphorisms,updateFamousAphorisms } from '@/services/ant-design-pro/operation';
import LanguageSelector from '@/components/Languages';


interface FamousQuoteModalProps {
  visible: boolean;
  editingId: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const FamousQuoteModal: React.FC<FamousQuoteModalProps> = ({
  visible,
  editingId,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en_US');
  const [content, setContent] = useState<string>('');


  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingId) {
        // 更新操作
       const res = await updateFamousAphorisms({
          ...values,
          id: editingId,
        });
        if(res.code==='0') {
          message.success('更新成功');
        } else {
          message.error('更新失败');
        }
      } else {
        // 添加操作
        const res = await addFamousAphorisms(values);
        if(res.code==='0') {
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      }
      
      onSuccess();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingId ? '编辑名言' : '添加名言'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
    >

      <Form form={form} layout="vertical">
        <Form.Item
          name="langId"
          label="语言"
          rules={[{ required: true, message: '请选择语言' }]}
        >
          <input type="text" />
        </Form.Item>
        <Form.Item
          name="text"
          label="名言内容"
          rules={[{ required: true, message: '请输入名言内容' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入名言内容" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default FamousQuoteModal; 