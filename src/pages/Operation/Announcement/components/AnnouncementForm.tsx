import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Modal, Radio, Button, message } from 'antd';
import { 
  addAnnouncement, 
  updateAnnouncement,
  getAnnouncementParams
} from '@/services/ant-design-pro/operation';
import SeedEditor from '@/components/SeedEditor';
import { languages } from '@/config/language';
import moment from 'moment';
const { Option } = Select;

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
  const [sendType, setSendType] = useState(1);
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  const [contents, setContents] = useState<Record<string, string>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});

  // 获取并回显数据
  useEffect(() => {
    if (type === 'update' && values?.id && visible) {
      const fetchAnnouncementDetail = async () => {
        try {
          setLoading(true);
          const response = await getAnnouncementParams(values.id);
          if (response.code === '0' && response.data) {
            const { informAnnouncement, informAnnouncementContents = [] } = response.data;
            
            // 设置基本表单数据
            form.setFieldsValue({
              classMenu: informAnnouncement.classMenu,
              describeText: informAnnouncement.describeText,
              releaseType: informAnnouncement.releaseType,
              releaseTime: informAnnouncement.releaseTime ? moment(Number(informAnnouncement.releaseTime)) : undefined,
            });
            
            // 设置发送类型状态
            setSendType(informAnnouncement.releaseType);
            
            // 处理多语言内容和标题
            const newContents: Record<string, string> = {};
            const newTitles: Record<string, string> = {};
            
            informAnnouncementContents.forEach((item: any) => {
              newContents[item.languageCode] = item.content || '';
              newTitles[item.languageCode] = item.title || '';
            });
            
            setContents(newContents);
            setTitles(newTitles);
          } else {
            message.error('获取公告详情失败');
          }
        } catch (error) {
          console.error('获取公告详情出错:', error);
          message.error('获取公告详情出错');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAnnouncementDetail();
    }
  }, [type, values, visible, form]);

  const handleContentChange = (lang: string, content: string) => {
    setContents((prev) => ({
      ...prev,
      [lang]: content,
    }));
  };

  const handleTitleChange = (lang: string, title: string) => {
    setTitles((prev) => ({
      ...prev,
      [lang]: title,
    }));
  };

  const handleSubmit = async () => {
    try {
      const fieldsValue = await form.validateFields();
      
      if (!contents.en_US) {
        message.error('请填写英语内容');
        return;
      }

      if (!titles.en_US) {
        message.error('请填写英语标题');
        return;
      }
      
      setLoading(true);
      
      const contentsList = Object.entries(contents).map(([languageCode, content]) => ({
        languageCode,
        title: titles[languageCode] || titles.en_US, // 如果没有对应语言的标题，使用英文标题
        content,
        isAdd: true
      }));
      
      const submitData = {
        "informAnnouncement": {
          "describeText": fieldsValue.describeText,
          "classMenu": '1',
          "releaseType": fieldsValue.releaseType,
          "releaseTime": fieldsValue.releaseType === 2 ? fieldsValue.releaseTime?.valueOf() : '',
        },
        "informAnnouncementContents": contentsList
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
      if (response.code==='0' && response.data) {
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
          category: '1',
          sendType: 1,
        }}
      >
      
        
        <Form.Item
          name="classMenu"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
          required
        >
          <Select>
            <Option value="1">最新动态</Option>
            <Option value="2">APP优化</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="describeText"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
          required
        >
        <Input placeholder="请输入描述" />
        </Form.Item>
        
        <Form.Item
          name="releaseType"
          label="发送时间"
          required
        >
          <Radio.Group onChange={(e) => setSendType(e.target.value)}>
            <Radio value={1}>立即发送</Radio>
            <Radio value={2}>定时发送</Radio>
          </Radio.Group>
        </Form.Item>
        
        {sendType === 2 && (
          <Form.Item
            name="releaseTime"
            label=""
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>
        )}
        
        <Form.Item
          label="语言"
          required
        >
          <Radio.Group 
            value={activeLanguage} 
            onChange={(e) => setActiveLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <Radio.Button key={lang.key} value={lang.key}>{lang.label}</Radio.Button>
            ))}
          </Radio.Group>
          <div style={{ color: '#999', marginBottom: '15px' }}>
            *支持多个语言同时编辑，英文为必填，其他语言配置则显示，不配置不显示
          </div>
        </Form.Item>
        <Form.Item
          name="title"
          label="标题"
          hidden={true}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="标题"
          required={activeLanguage === 'en_US'}
        >
          <Input 
            placeholder="请输入标题" 
            value={titles[activeLanguage] || ''}
            onChange={(e) => handleTitleChange(activeLanguage, e.target.value)}
          />
          {activeLanguage === 'en_US' && !titles.en_US && (
            <div style={{ color: 'red' }}>英文标题为必填项</div>
          )}
        </Form.Item>
        
        <Form.Item
          label="内容"
          required={activeLanguage === 'en_US'}
        >
          <SeedEditor 
            initialContent={contents[activeLanguage] || ''}
            onChange={(content) => handleContentChange(activeLanguage, content)}
          />
          {activeLanguage === 'en_US' && !contents.en_US && (
            <div style={{ color: 'red' }}>英文内容为必填项</div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnnouncementForm; 