import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, DatePicker, Modal, Radio, Button, message } from 'antd';
import { useIntl } from 'umi';
import {
  addAnnouncement,
  updateAnnouncement,
  getAnnouncementParams,
  getClassMenuList,
  updateAnnouncementContent,
} from '@/services/ant-design-pro/operation';
import SeedEditor from '@/components/SeedEditor';
import { languages } from '@/config/language';
import dayjs from 'dayjs';
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
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendType, setSendType] = useState(1);
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  const [contents, setContents] = useState<Record<string, string>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [menuList, setMenuList] = useState<any[]>([]);
  // 存储公告内容数据
  const [announcementContents, setAnnouncementContents] = useState<any[]>([]);
  // 使用 useRef 代替 useState 来存储编辑器引用
  const editorRef = useRef<any>(null);

  // 获取并回显数据
  useEffect(() => {
    if (type === 'create') {
      //表单内容清空
      form.resetFields();
      setContents({});
      setTitles({});
    }
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
              releaseTime: informAnnouncement.releaseTime ? dayjs(Number(informAnnouncement.releaseTime)) : undefined,
            });

            // 设置发送类型状态
            setSendType(informAnnouncement.releaseType);
            // 存储公告内容数据供后续使用
            setAnnouncementContents(informAnnouncementContents);
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
            message.error(intl.formatMessage({ id: 'announcement.form.validation.failed'}));
          }
        } catch (error) {
          console.error('获取公告详情出错:', error);
          message.error(intl.formatMessage({ id: 'announcement.form.validation.failed' }));
        } finally {
          setLoading(false);
        }
      };

      fetchAnnouncementDetail();
    }
    console.log(values, 'values');
  }, [type, values, visible, form]);


  const getMenu = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    }
    const response = await getClassMenuList(data);
    if (response.code === '0' && response.data) {
      console.log(response.data, 'response.data');
      setMenuList(response.data.list);
    }
  }

  const handleContentChange = (lang: string, content: string) => {
    setContents((prev) => ({
      ...prev,
      [activeLanguage]: content,
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

      // 在提交前保存当前活动语言的编辑器内容
      if (editorRef.current && activeLanguage) {
        const currentContent = editorRef.current.getHtml ? editorRef.current.getHtml() : '';
        // 直接更新contents对象以确保立即拿到最新值
        contents[activeLanguage] = currentContent;
      }

      if (!contents.en_US) {
        message.error(intl.formatMessage({ id: 'announcement.form.validation.english.content.required', defaultMessage: '请填写英语内容' }));
        return;
      }

      if (!titles.en_US) {
        message.error(intl.formatMessage({ id: 'announcement.form.validation.english.title.required', defaultMessage: '请填写英语标题' }));
        return;
      }

      setLoading(true);
     
      // 准备多语言内容列表
      const contentsList = Object.entries(contents).map(([languageCode, content]) => {
        // 在update模式下，从已存储的announcementContents中查找匹配的ID
        let contentId;
        if (type === 'update' && announcementContents.length > 0) {
          const matchedContent = announcementContents.find(
            (item: any) => item.languageCode === languageCode
          );
          contentId = matchedContent?.id;
        }
        
        return {
          languageCode,
          title: titles[languageCode] || titles.en_US,
          content,
          ...(type === 'update' && contentId ? { id: contentId } : {}),
          ...(type === 'update' ? { announcementId: values?.id } : {}),
        };
      });

      // 使用英语作为主要标题
      const mainTitle = titles.en_US;

      let response;

      if (type === 'create') {
        // 创建公告
        const createData = {
          informAnnouncement: {
            title: mainTitle,
            // content: mainContent,
            status: 1,
            describeText: fieldsValue.describeText,
            classMenu: fieldsValue.classMenu, // 使用表单选择的值，不硬编码
            releaseType: fieldsValue.releaseType,
            releaseTime: fieldsValue.releaseType === 2 ? fieldsValue.releaseTime?.valueOf() : null,
          }
          ,
          informAnnouncementContents: contentsList
        };

        response = await addAnnouncement(createData);
      } else {
        // 更新公告
        const data = {
            id: values?.id,
            title: mainTitle,
            status: 1,
            describeText: fieldsValue.describeText,
            classMenu: fieldsValue.classMenu,
            releaseType: fieldsValue.releaseType,
            releaseTime: fieldsValue.releaseType === 2 ? fieldsValue.releaseTime?.valueOf() : null,
        };

        const datas = {
          informAnnouncementContents: contentsList
        }
        
        response = await updateAnnouncement(data);
        await updateAnnouncementContent(datas); // 不需要存储返回值
      }

      setLoading(false);

      if (response.code === '0' && response.data) {
        message.success(type === 'create' 
          ? intl.formatMessage({ id: 'announcement.management.create.success', defaultMessage: '创建成功' })
          : intl.formatMessage({ id: 'announcement.category.update.success', defaultMessage: '更新成功' }));
        onSuccess();
      } else {
        message.error(type === 'create' 
          ? intl.formatMessage({ id: 'announcement.management.create.failed', defaultMessage: '创建失败' })
          : intl.formatMessage({ id: 'announcement.category.update.failed', defaultMessage: '更新失败' }));
      }
    } catch (error) {
      setLoading(false);
      console.error('提交表单出错:', error);
      message.error(intl.formatMessage({ id: 'announcement.form.validation.failed', defaultMessage: '表单校验失败' }));
    }
  };

  const handleLanguageChange = (value) => {
    // 先保存当前语言的内容
    if (editorRef.current && activeLanguage) {
      const currentContent = editorRef.current.getHtml ? editorRef.current.getHtml() : ''; // 获取当前编辑器内容
      setContents((prev) => ({
        ...prev,
        [activeLanguage]: currentContent, // 保存当前语言的内容
      }));
    }

    // 然后切换语言
    setActiveLanguage(value);
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <Modal
      title={type === 'create' 
        ? intl.formatMessage({ id: 'announcement.form.title.create', defaultMessage: '发布公告' })
        : intl.formatMessage({ id: 'announcement.form.title.update', defaultMessage: '编辑公告' })
      }
      visible={visible}
      width={640}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'announcement.form.button.cancel', defaultMessage: '取消' })}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {type === 'create' 
            ? intl.formatMessage({ id: 'announcement.form.button.publish', defaultMessage: '发布' })
            : intl.formatMessage({ id: 'announcement.form.button.save', defaultMessage: '保存' })
          }
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
          label={intl.formatMessage({ id: 'announcement.form.category', defaultMessage: '分类' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'announcement.form.category.required', defaultMessage: '请选择分类' }) }]}
          required
        >
          <Select>
            {menuList.map((item: any) => (
              <Option value={item.id}>{item.describe}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="describeText"
          label={intl.formatMessage({ id: 'announcement.form.description', defaultMessage: '描述' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'announcement.form.description.required', defaultMessage: '请输入描述' }) }]}
          required
        >
          <Input placeholder={intl.formatMessage({ id: 'announcement.form.description.placeholder', defaultMessage: '请输入描述' })} />
        </Form.Item>

        <Form.Item
          name="releaseType"
          label={intl.formatMessage({ id: 'announcement.form.sendTime', defaultMessage: '发送时间' })}
          required
        >
          <Radio.Group onChange={(e) => setSendType(e.target.value)}>
            <Radio value={1}>{intl.formatMessage({ id: 'announcement.form.sendTime.immediate', defaultMessage: '立即发送' })}</Radio>
            <Radio value={2}>{intl.formatMessage({ id: 'announcement.form.sendTime.scheduled', defaultMessage: '定时发送' })}</Radio>
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
          label={intl.formatMessage({ id: 'announcement.form.language', defaultMessage: '语言' })}
          required
        >
          <Radio.Group
            value={activeLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languages.map(lang => (
              <Radio.Button key={lang.key} value={lang.key}>{lang.label}</Radio.Button>
            ))}
          </Radio.Group>
          <div style={{ color: '#999', marginBottom: '15px' }}>
            {intl.formatMessage({ id: 'announcement.form.language.note', defaultMessage: '*支持多个语言同时编辑，英文为必填，其他语言配置则显示，不配置不显示' })}
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
          label={intl.formatMessage({ id: 'announcement.form.title', defaultMessage: '标题' })}
          required={activeLanguage === 'en_US'}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'announcement.form.title.placeholder', defaultMessage: '请输入标题' })}
            value={titles[activeLanguage] || ''}
            onChange={(e) => handleTitleChange(activeLanguage, e.target.value)}
          />
          {activeLanguage === 'en_US' && !titles.en_US && (
            <div style={{ color: 'red' }}>{intl.formatMessage({ id: 'announcement.form.title.required', defaultMessage: '英文标题为必填项' })}</div>
          )}
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'announcement.form.content', defaultMessage: '内容' })}
          required={activeLanguage === 'en_US'}
        >
          <SeedEditor
            initialContent={contents[activeLanguage] || ''}
            onChange={(content) => handleContentChange(activeLanguage, content)}
            ref={(node) => { editorRef.current = node; }}
            key={activeLanguage}
          />
          {activeLanguage === 'en_US' && !contents.en_US && (
            <div style={{ color: 'red' }}>{intl.formatMessage({ id: 'announcement.form.content.required', defaultMessage: '英文内容为必填项' })}</div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnnouncementForm; 