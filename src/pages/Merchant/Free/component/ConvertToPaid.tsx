import React, { useEffect, useState } from 'react';
import { Modal, Form, DatePicker, message } from 'antd';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';

interface ConvertToPaidProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const ConvertToPaid: React.FC<ConvertToPaidProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [curSelectTime, setCurSelectTime] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues && visible) {
      form.setFieldsValue({
        tenantEndTime: initialValues.tenantEndTime ? dayjs(initialValues.tenantEndTime) : null,
      });
      setCurSelectTime(
        initialValues.tenantEndTime
          ? dayjs(initialValues.tenantEndTime).format('YYYY-MM-DD HH:mm:ss')
          : null,
      );
    }
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...initialValues,
        tenantEndTime: values.tenantEndTime.format('YYYY-MM-DD HH:mm:ss'),
      });
      form.resetFields();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'free.convertToPaid.form.required' }));
    }
  };

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  // **禁用日期** 今日之前不可选
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // **禁用时间** 现在时分秒之前不可选
  const disabledDateTime = (current: dayjs.Dayjs | null) => {
    if (!current) {
      return {};
    }

    const now = dayjs();
    if (current.isSame(now, 'day')) {
      return {
        disabledHours: () => range(0, now.hour()),
        disabledMinutes: (selectedHour: number) => {
          if (selectedHour === now.hour()) {
            return range(0, now.minute() + 1);
          }
          return [];
        },
        disabledSeconds: (selectedHour: number, selectedMinute: number) => {
          if (selectedHour === now.hour() && selectedMinute === now.minute()) {
            return range(0, now.second() + 1);
          }
          return [];
        },
      };
    }
    return {};
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'free.convertToPaid.title' })}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tenantEndTime"
          label={
            <span style={{ fontWeight: 'bold', fontSize: 16 }}>
              {intl.formatMessage({ id: 'free.convertToPaid.form.expiry' })}
            </span>
          }
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'free.convertToPaid.form.required' }),
            },
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            onChange={(value) =>
              setCurSelectTime(value ? value.format('YYYY-MM-DD HH:mm:ss') : null)
            }
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={intl.formatMessage({ id: 'free.convertToPaid.form.placeholder' })}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <p>
          {intl.formatMessage({ id: 'free.convertToPaid.message.confirm' })}
          <strong>{curSelectTime || '-'}</strong>！
        </p>
      </Form>
    </Modal>
  );
};

export default ConvertToPaid;
