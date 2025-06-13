import { Button, Form, message, Modal, Tabs, TabsProps } from 'antd';
import { useIntl } from '@umijs/max';
import { useEffect, useState } from 'react';
import { tenantLangList } from '@/services/ant-design-pro/WebConfig';
import TextArea from 'antd/es/input/TextArea';
import { findIntroductionVo, saveIntroductionVo } from '@/services/ant-design-pro/spot';
import { CurrencyIntroFormData } from '../index.d';

interface IntroductionProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: CurrencyIntroFormData | null;
}
interface DescriptionItem {
  id?: number;  // or string, depending on your actual ID type
  languageCode: string;
  content: string;
  // Add other properties that might exist on your description items
}

const Introduction: React.FC<IntroductionProps> = ({ visible, setVisible, initialValues }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [items, setItems] = useState<NonNullable<TabsProps['items']>>([]);
  const [describe, setDescribe] = useState<DescriptionItem[]>([]);

  // 获取语言列表
  const getLanguageList = async () => {
    const res = await tenantLangList({
      pageNo: 1,
      pageSize: 10000,
    });
    if (res.code === '0') {
      const items = res?.data?.list.map((item: any) => {
        return {
          label: item.lang,
          key: item.id,
          children: (
            <Form.Item
              name={item.langEncode}
              rules={[{ max: 12, message: intl.formatMessage({ id: 'currency.intro.maxLength' }) }]}
            >
              <TextArea showCount maxLength={100} style={{ height: 200 }} />
            </Form.Item>
          ),
          style: { height: 250 },
        };
      });
      setItems(items);
    }
  };

  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    if (visible) {
      getLanguageList();
    }
  }, [visible]);

  const getIntroductionVo = async (id: number) => {
    const res = await findIntroductionVo({
      id: id,
    });
    if (res.code === '0') {
      const obj: Record<string, string> = {};
      res.data.forEach((element: any) => {
        obj[element.languageCode] = element.content;
      });
      setDescribe(res.data);
      console.log(obj);
      form.setFieldsValue(obj);
    }
  };
  // 设置初始值
  useEffect(() => {
    if (visible && initialValues) {
      getIntroductionVo(initialValues.id);
    }
  }, [visible, initialValues, form]);

  const onSubmit = async () => {
    const values = await form.getFieldsValue(true)
    console.log('values', values);
    if  (values.en_US === '') {
      message.error(intl.formatMessage({ id: 'currency.intro.enUS_Required' }));
      return;
    }
    const params = {
      id: initialValues?.id,
      introductionVoList: Object.entries(values).map(([key, value]) => {
        return {
          languageCode: key,
          id: describe.length > 0 ? describe.find((item: DescriptionItem) => item.languageCode === key)?.id : undefined,
          content: value,
        };
      }),
    }
    console.log('params', params);
    const res = await saveIntroductionVo(params);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'currency.intro.saveSuccess' }));
      form.resetFields();
      onCancel();
    } else {
      message.error(res.message || intl.formatMessage({ id: 'currency.intro.saveFailed' }));
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'currency.intro.title' })}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'currency.intro.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
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
        <Tabs items={items}  />
      </Form>
    </Modal>
  );
};

export default Introduction;
