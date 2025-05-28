import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Modal, Form, Input, InputNumber, Radio, message, Select } from 'antd';
import { HelpCenterClassItem, getHelpCenterClassList } from '@/services/ant-design-pro/operation';
import AvatarUpload from '@/components/AvatarUpload';
import LanguageSelector from '@/components/LanguageSelector'

interface CategoryFormModalProps {
  visible: boolean;
  currentCategory?: HelpCenterClassItem;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ visible, onCancel, onSubmit, currentCategory }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en_US');
  const [titleMap, setTitleMap] = useState<Record<string, string>>({});
  const [currentTitle, setCurrentTitle] = useState('');
  const [helpCenterClassList, setHelpCenterClassList] = useState<HelpCenterClassItem[]>([]);
  const [formType, setFormType] = useState<number>(1);

  // 定义API响应类型
  interface ApiResponse {
    code: string;
    message?: string;
    success: boolean;
    data: HelpCenterClassItem[] | HelpCenterClassItem;
  }

  useEffect(() => {
    // 获取分类列表
    const fetchCategoryList = async () => {
      try {
        const res = await getHelpCenterClassList({}) as ApiResponse;
        if (res.code === '0' && res.success) {
          const data = Array.isArray(res.data) ? res.data : [];
          setHelpCenterClassList(data.filter((item: any) => item.type === 1));
        }
      } catch (error) {
        console.error('获取分类列表失败:', error);
      }
    };

    if (visible) {
      fetchCategoryList();
    }
  }, [visible]);

  const handleLanguageChange = (value: string) => {
    // 保存当前语言的标题
    if (language && currentTitle) {
      setTitleMap(prev => ({
        ...prev,
        [language]: currentTitle
      }));
    }

    // 切换到新语言
    setLanguage(value);

    // 设置新语言对应的标题
    const title = titleMap[value] || '';
    setCurrentTitle(title);
    form.setFieldsValue({ articleTitle: title });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 先保存当前选中语言的标题到titleMap
      if (language && currentTitle) {
        titleMap[language] = currentTitle;
      }

      // 检查是否至少有一种语言有标题
      if (Object.keys(titleMap).length === 0) {
        message.error(intl.formatMessage({ id: 'helpCenter.category.message.getCategoryListError' }));
        return;
      }

      // 构建多语言内容
      const languages = Object.entries(titleMap)
        .filter(([_, title]) => title.trim() !== '') // 过滤掉空标题
        .map(([code, title]) => ({
          languageCode: code,
          articleTitle: title.trim()
        }));

      console.log('提交的多语言数据:', languages); // 调试用

      // 从表单中提取黑白图标
      const { blackIcon, whiteIcon, articleTitle, ...restValues } = values;

      onSubmit({
        ...restValues,
        id: currentCategory?.id,
        blackIcon,
        whiteIcon,
        languages, // 传递所有语言的标题
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      // 重置状态
      let initialTitleMap: Record<string, string> = {};
      let initialLanguage = 'en_US';
      let initialTitle = '';

      if (currentCategory) {
        // 编辑模式 - 处理现有数据
        form.setFieldsValue({
          ...currentCategory,
          blackIcon: currentCategory.blackIcon,
          whiteIcon: currentCategory.whiteIcon,
        });

        // 处理多语言标题
        if (currentCategory.languages && Array.isArray(currentCategory.languages)) {
          // 如果有多语言数据
          currentCategory.languages.forEach((item: any) => {
            initialTitleMap[item.languageCode] = item.articleTitle;
          });

          // 设置初始语言和标题
          if (currentCategory.languages.length > 0) {
            initialLanguage = currentCategory.languages[0].languageCode;
            initialTitle = currentCategory.languages[0].articleTitle;
          }
        } else if (currentCategory.languageCode && currentCategory.articleTitle) {
          // 如果只有一种语言
          initialLanguage = currentCategory.languageCode;
          initialTitle = currentCategory.articleTitle;
          initialTitleMap[initialLanguage] = initialTitle;
        }
      } else {
        // 新增模式 - 重置表单
        form.resetFields();
        form.setFieldsValue({ languageCode: initialLanguage });
      }

      setTitleMap(initialTitleMap);
      setLanguage(initialLanguage);
      setCurrentTitle(initialTitle);
      form.setFieldsValue({
        languageCode: initialLanguage,
        articleTitle: initialTitle
      });
    }
  }, [visible, currentCategory, form]);

  return (
    <Modal
      title={currentCategory ? intl.formatMessage({ id: 'helpCenter.category.modal.editTitle' }) : intl.formatMessage({ id: 'helpCenter.category.modal.addTitle' })}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item name='type' label={intl.formatMessage({ id: 'helpCenter.category.form.type' })}>
          <Radio.Group value={form.getFieldValue('type')} defaultValue={1} onChange={(e) => setFormType(e.target.value)}>
            <Radio value={1}>{intl.formatMessage({ id: 'helpCenter.category.type.menu' })}</Radio>
            <Radio value={2}>{intl.formatMessage({ id: 'helpCenter.category.type.category' })}</Radio>
          </Radio.Group>
        </Form.Item>
        {formType === 1 &&(
          <Form.Item
            label={intl.formatMessage({ id: 'helpCenter.category.form.icon' })}
            extra={intl.formatMessage({ id: 'helpCenter.category.form.iconNote' })}
          >
            <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                {intl.formatMessage({ id: 'helpCenter.category.form.nightMode' })}
              </div>
              <Form.Item name="blackIcon" noStyle>
                <AvatarUpload/>
              </Form.Item>
              <div>142*72 png图片</div>
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>{intl.formatMessage({ id: 'helpCenter.category.form.dayMode' })}</div>
              <Form.Item name="whiteIcon" noStyle>
                <AvatarUpload/>
              </Form.Item>
              <div>142*72 png图片</div>
            </div>
          </div>
        </Form.Item>
           
          )}

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.category.form.description' })}
          name="helpDescription"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.category.form.validation.descriptionRequired' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'helpCenter.category.form.descriptionPlaceholder' })} />
        </Form.Item>

      {formType === 1 &&(
        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.category.form.sort' })}
          name="helpSort"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.category.form.validation.sortRequired' }) }]}
        >
          <InputNumber min={1} placeholder={intl.formatMessage({ id: 'helpCenter.category.form.sortPlaceholder' })} style={{ width: '100%' }} />
        </Form.Item>

  )}

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.category.form.parentCategory' })}
          name="parentId"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.category.form.validation.parentCategoryRequired' }) }]}
        >
          <Select
            placeholder={intl.formatMessage({ id: 'helpCenter.category.form.selectCategory' })}
            options={Array.isArray(helpCenterClassList) ? helpCenterClassList.map((item) => ({
              value: item.id,
              label: item.helpDescription,
            })) : []}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.category.form.language' })}
          name="languageCode"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.category.form.validation.languageRequired' }) }]}
        >
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.category.form.title' })}
          name="articleTitle"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.category.form.validation.titleRequired' }) }]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'helpCenter.category.form.titlePlaceholder' })}
            maxLength={30}
            value={currentTitle}
            onChange={handleTitleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal; 