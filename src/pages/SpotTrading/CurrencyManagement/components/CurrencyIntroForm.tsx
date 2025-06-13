import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Tabs, Button, message } from 'antd';
import type { TabsProps } from 'antd';
import LanguageSelector from '@/components/LanguageSelector';
import { saveIntroductionVo, findIntroductionVo } from '@/services/ant-design-pro/spot';
import { useIntl } from 'umi';

export interface CurrencyIntroFormData {
  id: number;
  coinId?: number | string;
  intro_en_US?: string;
  intro_zh_CN?: string;
  intro_zh_HK?: string;
  intro_ja_JP?: string;
  intro_ko_KR?: string;
}

interface CurrencyIntroFormProps {
  visible: boolean;
  initialValues?: CurrencyIntroFormData;
  onSubmit: (values: CurrencyIntroFormData) => void;
  onCancel: () => void;
}

const CurrencyIntroForm: React.FC<CurrencyIntroFormProps> = ({
  visible,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('en_US');
  const [wordCount, setWordCount] = useState<Record<string, number>>({
    en_US: 0,
    zh_CN: 0,
    zh_HK: 0,
    ja_JP: 0,
    ko_KR: 0,
  });

  const getIntroductionVo = async (id: number) => {
    const res = await findIntroductionVo({
      id: id,
    });
    if (res.code === '0') {
      form.setFieldsValue(res.data);
    }
  };
  // 设置初始值
  useEffect(() => {
    if (visible && initialValues) {
      console.log(initialValues);

      getIntroductionVo(initialValues.id);
    }
  }, [visible, initialValues, form]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, lang: string) => {
    const text = e.target.value;
    setWordCount((prev) => ({
      ...prev,
      [lang]: text.length,
    }));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 构建提交数据结构
      const introductionVoList = [];

      // 检查每种语言是否有内容，有则添加到数组
      if (values.intro_en_US) {
        introductionVoList.push({
          languageCode: 'en_US',
          introduction: values.intro_en_US,
        });
      }

      if (values.intro_zh_CN) {
        introductionVoList.push({
          languageCode: 'zh_CN',
          introduction: values.intro_zh_CN,
        });
      }

      if (values.intro_zh_HK) {
        introductionVoList.push({
          languageCode: 'zh_HK',
          introduction: values.intro_zh_HK,
        });
      }

      if (values.intro_ja_JP) {
        introductionVoList.push({
          languageCode: 'ja_JP',
          introduction: values.intro_ja_JP,
        });
      }

      if (values.intro_ko_KR) {
        introductionVoList.push({
          languageCode: 'ko_KR',
          introduction: values.intro_ko_KR,
        });
      }

      const data = {
        introductionVoList,
        id: initialValues?.id,
      };

      // 调用API保存数据
      const res = await saveIntroductionVo(data);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'currency.intro.saveSuccess' }));
        form.resetFields();
        onCancel();
      } else {
        message.error(res.message || intl.formatMessage({ id: 'currency.intro.saveFailed' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'currency.intro.formValidationFailed' }), error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'en_US',
      label: 'English',
      children: (
        <Form.Item
          name="intro_en"
          rules={[{ max: 1000, message: intl.formatMessage({ id: 'currency.intro.maxLength' }) }]}
        >
          <Input.TextArea
            rows={10}
            placeholder={intl.formatMessage({ id: 'currency.intro.placeholder.en' })}
            onChange={(e) => handleTextChange(e, 'en')}
          />
        </Form.Item>
      ),
    },
    {
      key: 'zh_CN',
      label: '简体中文',
      children: (
        <Form.Item
          name="intro_zh_CN"
          rules={[{ max: 1000, message: intl.formatMessage({ id: 'currency.intro.maxLength' }) }]}
        >
          <Input.TextArea
            rows={10}
            placeholder={intl.formatMessage({ id: 'currency.intro.placeholder.zhCN' })}
            onChange={(e) => handleTextChange(e, 'zh_CN')}
          />
        </Form.Item>
      ),
    },
    {
      key: 'zh_HK',
      label: '繁體中文',
      children: (
        <Form.Item
          name="intro_zh_HK"
          rules={[{ max: 1000, message: intl.formatMessage({ id: 'currency.intro.maxLength' }) }]}
        >
          <Input.TextArea
            rows={10}
            placeholder={intl.formatMessage({ id: 'currency.intro.placeholder.zhTW' })}
            onChange={(e) => handleTextChange(e, 'zh_HK')}
          />
        </Form.Item>
      ),
    },
    {
      key: 'ja_JP',
      label: '日本語',
      children: (
        <Form.Item
          name="intro_ja"
          rules={[{ max: 1000, message: intl.formatMessage({ id: 'currency.intro.maxLength' }) }]}
        >
          <Input.TextArea
            rows={10}
            placeholder={intl.formatMessage({ id: 'currency.intro.placeholder.ja' })}
            onChange={(e) => handleTextChange(e, 'ja')}
          />
        </Form.Item>
      ),
    },
    {
      key: 'ko_KR',
      label: '한국어',
      children: (
        <Form.Item
          name="intro_ko"
          rules={[{ max: 1000, message: intl.formatMessage({ id: 'currency.intro.maxLength' }) }]}
        >
          <Input.TextArea
            rows={10}
            placeholder={intl.formatMessage({ id: 'currency.intro.placeholder.ko' })}
            onChange={(e) => handleTextChange(e, 'ko')}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Modal
      title={intl.formatMessage({ id: 'currency.intro.title' })}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {intl.formatMessage({ id: 'currency.intro.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'currency.intro.submit' })}
        </Button>,
      ]}
      width={800}
    >
      <div style={{ marginBottom: '16px' }}>
        <span style={{ color: 'red' }}>*</span>{' '}
        {intl.formatMessage({ id: 'currency.intro.language' })}
        <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          {intl.formatMessage({ id: 'currency.intro.languageNote' })}
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <span>{wordCount[activeTab]}/1000</span>
        </div>
      </Form>
    </Modal>
  );
};

export default CurrencyIntroForm;
