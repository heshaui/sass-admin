import LanguageSelector from '@/components/LanguageSelector';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const { TextArea } = Input;

// 语言内容类型定义
type LanguageContent = {
  languageCode: string;
  languageContent: string;
};

export type CategoryFormProps = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (values: Record<string, any>) => void;
  values?: Record<string, any>;
  type: 'create' | 'update';
  confirmLoading?: boolean;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  values,
  type,
  confirmLoading,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [activeLanguage, setActiveLanguage] = useState('en_US');

  // 多语言内容列表
  const [contentList, setContentList] = useState<LanguageContent[]>([
    { languageCode: 'en_US', languageContent: '' },
  ]);

  useEffect(() => {
    console.log(values, 'values');
    if (visible && type === 'update' && values) {
      // 处理已有的多语言内容数据
      let newContentList: LanguageContent[] = [];

      // 统一处理数据结构，尝试所有可能的字段名
      if (Array.isArray(values.languageCodes)) {
        console.log('使用 languageCodes 数据');
        newContentList = values.languageCodes.map((item) => ({
          languageCode: item.languageCode,
          languageContent: item.languageContent,
          id: item.id, // 保留id用于更新操作
        }));
      }
      // 如果没有languageCodes但有contentList，使用contentList
      else if (Array.isArray(values.contentList)) {
        console.log('使用 contentList 数据');
        newContentList = values.contentList.map((item) => ({
          languageCode: item.languageCode,
          languageContent: item.languageContent,
          id: item.id, // 保留id用于更新操作
        }));
      }
      // 如果是旧数据结构，转换为新格式
      else {
        console.log('使用旧格式数据结构');
        languages.forEach((lang) => {
          const langContent = values[`content_${lang.key}`] || '';
          if (langContent) {
            newContentList.push({
              languageCode: lang.key,
              languageContent: langContent,
            });
          }
        });

        // 如果有单一content字段但没有多语言版本，添加到英文
        if (values.content && !newContentList.some((item) => item.languageCode === 'en_US')) {
          newContentList.push({
            languageCode: 'en_US',
            languageContent: values.content,
          });
        }
      }

      // 确保至少有英文版本
      if (!newContentList.some((item) => item.languageCode === 'en_US')) {
        newContentList.push({ languageCode: 'en_US', languageContent: '' });
      }

      console.log('处理后的多语言内容:', newContentList);
      setContentList(newContentList);

      // 设置当前激活的语言（如果有英文则默认英文，否则取第一个）
      const enContent = newContentList.find((item) => item.languageCode === 'en_US');
      if (enContent) {
        setActiveLanguage('en_US');
        form.setFieldsValue({
          languageContent: enContent.languageContent,
          languageCode: 'en_US',
        });
      } else if (newContentList.length > 0) {
        setActiveLanguage(newContentList[0].languageCode);
        form.setFieldsValue({
          languageContent: newContentList[0].languageContent,
          languageCode: newContentList[0].languageCode,
        });
      }

      // 设置基础字段
      form.setFieldsValue({
        serialNum: values.serialNum,
        describe: values.describe,
      });
    } else {
      form.resetFields();
      // 重置为只有英文的空内容
      setContentList([{ languageCode: 'en_US', languageContent: '' }]);
      setActiveLanguage('en_US');
      form.setFieldsValue({
        languageCode: 'en_US',
        languageContent: '',
      });
    }
  }, [visible, form, values, type]);

  // 获取当前语言的内容
  const getCurrentContent = (langKey: string): string => {
    const langItem = contentList.find((item) => item.languageCode === langKey);
    return langItem ? langItem.languageContent : '';
  };

  // 处理语言切换
  const handleLanguageChange = (langKey: string) => {
    setActiveLanguage(langKey);

    // 如果切换到的语言不存在，添加该语言
    if (!contentList.some((item) => item.languageCode === langKey)) {
      setContentList((prev) => [...prev, { languageCode: langKey, languageContent: '' }]);
    }

    // 更新表单中的内容字段，确保切换后显示正确的内容
    const currentContent = getCurrentContent(langKey);
    form.setFieldsValue({
      languageContent: currentContent,
    });
  };

  // 处理内容变更
  const handleContentChange = (langKey: string, value: string) => {
    setContentList((prev) =>
      prev.map((item) =>
        item.languageCode === langKey ? { ...item, languageContent: value } : item,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      const fieldsValue = await form.validateFields();

      // 检查英文内容必填
      const enContent = contentList.find((item) => item.languageCode === 'en_US');
      if (!enContent || !enContent.languageContent) {
        message.error(
          intl.formatMessage({
            id: 'announcement.category.form.validation.english.required',
            defaultMessage: '英文内容为必填项',
          }),
        );
        return;
      }

      // 过滤掉空内容的语言
      const validContentList = contentList.filter((item) => item.languageContent.trim() !== '');

      // 构建提交数据
      const submitData: Record<string, any> = {
        id: values?.id,
        serialNum: fieldsValue.serialNum,
        describe: fieldsValue.describe,
        contentList: validContentList, // 按照表单命名存储数据
        languageCodes: validContentList, // 按照API需要的格式存储数据
      };

      // 记录当前已配置的语言
      submitData.languages = validContentList.map((item) => item.languageCode).join(',');

      onSuccess(submitData);
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error(
        intl.formatMessage({
          id: 'announcement.category.form.validation.form.failed',
          defaultMessage: '表单校验失败，请检查必填项',
        }),
      );
    }
  };

  return (
    <Modal
      width={600}
      title={
        type === 'create'
          ? intl.formatMessage({
              id: 'announcement.category.form.title.create',
              defaultMessage: '新建分类',
            })
          : intl.formatMessage({
              id: 'announcement.category.form.title.update',
              defaultMessage: '编辑分类',
            })
      }
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          sort: 0,
          languageContent: '',
        }}
      >
        {/* 修改输入框限制，正整数，长度 */}
        <Form.Item
          name="serialNum"
          label={intl.formatMessage({
            id: 'announcement.category.form.sort',
            defaultMessage: '排序',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'announcement.category.form.sort.required',
                defaultMessage: '请输入排序',
              }),
            },
            {
              pattern: /^[1-9]\d*$/, // 正则表达式：正整数（不包括0）
              message: intl.formatMessage({
                id: 'announcement.category.form.sort.integer',
                defaultMessage: '请输入整数且不能是负数',
              }),
            },
          ]}
        >
          <InputNumber
            min={0}
            maxLength={20}
            precision={0}
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({
              id: 'announcement.category.form.sort.placeholder',
              defaultMessage: '数字越小越靠前',
            })}
          />
        </Form.Item>

        <Form.Item
          name="describe"
          label={intl.formatMessage({
            id: 'announcement.category.form.description',
            defaultMessage: '描述',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'announcement.category.form.description.required',
                defaultMessage: '请输入描述',
              }),
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({
              id: 'announcement.category.form.description.placeholder',
              defaultMessage: '请输入描述',
            })}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({
            id: 'announcement.category.form.language',
            defaultMessage: '内容语言',
          })}
          required
          name="languageCode"
        >
          <LanguageSelector
            value={activeLanguage}
            onChange={handleLanguageChange}
            text={intl.formatMessage({ id: 'announcement.category.form.language.note' })}
          />
        </Form.Item>

        {/* 多语言内容编辑区域 */}
        <Form.Item
          name="languageContent"
          label={intl.formatMessage({
            id: 'announcement.category.form.content',
            defaultMessage: '内容',
          })}
          required={activeLanguage === 'en_US'}
        >
          <TextArea
            rows={4}
            placeholder={intl.formatMessage({
              id: 'announcement.category.form.content.placeholder',
              defaultMessage: '请输入内容',
            })}
            value={getCurrentContent(activeLanguage)}
            onChange={(e) => handleContentChange(activeLanguage, e.target.value)}
          />
          {activeLanguage === 'en_US' && !getCurrentContent('en_US') && (
            <div style={{ color: 'red' }}>
              {intl.formatMessage({
                id: 'announcement.category.form.content.required',
                defaultMessage: '英文内容为必填项',
              })}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
