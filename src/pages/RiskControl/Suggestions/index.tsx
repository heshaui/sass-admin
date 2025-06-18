import { Button, Card, Form, Input, InputNumber, message, Select, Space, Spin } from 'antd';
import { useIntl } from '@umijs/max';
import { useEffect, useState } from 'react';
import {
  actionRiskLevelParams,
  riskConditionTemplateList,
  saveActionRiskLevel,
  saveRiskConditions,
} from '@/services/ant-design-pro/risk';

// 提现处理建议
const Suggestion = ({
  suggestion,
  intl,
  initData,
  getData,
}: {
  suggestion: any;
  intl: any;
  initData: any;
  getData: () => Promise<void>;
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const labels: Record<number, string> = {
    0: intl.formatMessage({
      id: 'riskControl.suggestions.riskLevelGreaterThanOrEqual',
    }),
    1: intl.formatMessage({
      id: 'riskControl.suggestions.riskLevelGreaterThanOrEqual',
    }),
    2: intl.formatMessage({
      id: 'riskControl.suggestions.riskLevelGreaterThanOrEqual',
    }),
  };

  const onCancel = () => {
    form.resetFields();
    form.setFieldsValue({
      riskLevels: initData,
    });
    setEditing(false);
  };

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      if (!values) return;
      setLoading(true);
      const params = form.getFieldsValue();
      console.log('params', params);
      const res = await saveActionRiskLevel(params);
      if (res.code === '0' && res.data) {
        console.log(res.data);
        message.success(res.message);
        await getData();
      } else {
        message.error(res.message);
      }
      onCancel();
      setLoading(false);
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      riskLevels: initData,
    });
  }, [initData]);

  return (
    <Card
      title={intl.formatMessage({
        id: 'riskControl.suggestions.withdrawalProcessingSuggestions',
      })}
      extra={
        editing ? (
          <Space>
            <Button onClick={onCancel}>
              {intl.formatMessage({ id: 'riskControl.config.cancel' })}
            </Button>
            <Button type="primary" onClick={onSubmit} loading={loading}>
              {intl.formatMessage({ id: 'riskControl.config.save' })}
            </Button>
          </Space>
        ) : (
          <Button type="primary" onClick={() => setEditing(true)}>
            {intl.formatMessage({ id: 'riskControl.config.edit' })}
          </Button>
        )
      }
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          disabled={!editing}
          labelWrap={true}
          labelCol={{ flex: '100px' }}
          labelAlign="left"
        >
          {Object.keys(labels).map((key: any) => {
            return (
              <Space style={{ marginBottom: 16, display: 'flex' }} key={key} wrap>
                <Form.Item name={['riskLevels', Number(key), 'id']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true }]}
                  label={labels[key]}
                  name={['riskLevels', Number(key), 'riskLevel']}
                >
                  <Input suffix={intl.formatMessage({ id: 'riskControl.config.level' })} />
                </Form.Item>
                <Form.Item
                  name={['riskLevels', Number(key), 'actionTipsCode']}
                  rules={[{ required: true }]}
                  label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
                >
                  <Select style={{ width: 300 }} options={suggestion} />
                </Form.Item>
              </Space>
            );
          })}
        </Form>
      </Spin>
    </Card>
  );
};

// 敏感信息
const Sensitive = ({
  suggestion,
  initData,
  intl,
  getData,
}: {
  suggestion: any;
  initData: any;
  intl: any;
  getData: () => Promise<void>;
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputList: Record<string, { label: string }> = {
    SENSITIVE_INFO_1: {
      label: intl.formatMessage({
        id: 'riskControl.suggestions.prohibitWithdrawalAfterPasswordChange',
      }),
    },
    SENSITIVE_INFO_2: {
      label: intl.formatMessage({
        id: 'riskControl.suggestions.prohibitWithdrawalAfter2FAUnbinding',
      }),
    },
    SENSITIVE_INFO_3: {
      label: intl.formatMessage({
        id: 'riskControl.suggestions.prohibitWithdrawalAfterPhoneChange',
      }),
    },
    SENSITIVE_INFO_4: {
      label: intl.formatMessage({
        id: 'riskControl.suggestions.prohibitWithdrawalAfterEmailChange',
      }),
    },
    SENSITIVE_INFO_5: {
      label: intl.formatMessage({
        id: 'riskControl.suggestions.prohibitWithdrawalAfterFundPasswordChange',
      }),
    },
  };
  const onCancel = () => {
    form.resetFields();
    form.setFieldsValue({
      riskConditionVos: Object.keys(inputList).map((key) => ({
        ...initData.find((item: any) => item.conditionCode === key),
      })),
      googleCode: undefined,
    });
    setEditing(false);
  };

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      console.log('Form values:', values);
      if (!values) return;
      setLoading(true);
      const res = await saveRiskConditions(values);
      if (res.code === '0') {
        console.log(res.data);
        message.success(res.message);
        await getData();
      } else {
        message.error(res.message);
      }
      setLoading(false);
      onCancel();
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      riskConditionVos: Object.keys(inputList).map((key) => ({
        ...initData.find((item: any) => item.conditionCode === key),
      })),
      googleCode: undefined,
    });
  }, [initData]);

  return (
    <Card
      title={intl.formatMessage({ id: 'riskControl.suggestions.sensitiveInfoModification' })}
      extra={
        editing ? (
          <Space>
            <Button onClick={onCancel}>
              {intl.formatMessage({ id: 'riskControl.config.cancel' })}
            </Button>
            <Button type="primary" onClick={onSubmit} loading={loading}>
              {intl.formatMessage({ id: 'riskControl.config.save' })}
            </Button>
          </Space>
        ) : (
          <Button type="primary" onClick={() => setEditing(true)}>
            {intl.formatMessage({ id: 'riskControl.config.edit' })}
          </Button>
        )
      }
    >
      <Spin spinning={loading}>
        <Form form={form} disabled={!editing} labelWrap labelAlign="left">
          {Object.keys(inputList).map((item, index) => {
            return (
              <Space style={{ marginBottom: 16, display: 'flex' }} key={item}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={inputList[item].label}
                  name={['riskConditionVos', Number(index), 'thresholdMap', 'time']}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item name={['riskConditionVos', Number(index), 'thresholdMap', 'unit']}>
                  <Select options={[{ value: 'H', label: 'H' }]} />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
                  name={['riskConditionVos', Number(index), 'actionMethod']}
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: 200 }} options={suggestion} />
                </Form.Item>
                <Form.Item name={['riskConditionVos', Number(index), 'sceneCode']} hidden>
                  <Input style={{ width: 200 }} />
                </Form.Item>
                <Form.Item name={['riskConditionVos', Number(index), 'conditionCode']} hidden>
                  <Input style={{ width: 200 }} />
                </Form.Item>
                <Form.Item name={['riskConditionVos', Number(index), 'conditionId']} hidden>
                  <Input style={{ width: 200 }} />
                </Form.Item>
              </Space>
            );
          })}
          <Form.Item
            label={intl.formatMessage({ id: 'riskControl.config.googleVerificationCode' })}
            rules={[{ required: true }]}
            name="googleCode"
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

const RiskControlSuggestions: React.FC = () => {
  const intl = useIntl();
  const [sensitiveData, setSensitiveData] = useState<any>([]);
  const [suggestionsData, setSuggestionsData] = useState<any>([]);

  const suggestion = [
    {
      label: intl.formatMessage({ id: 'riskControl.suggestions.prohibitWithdrawalAndCallback' }),
      value: 'prohibit_withdrawa',
    },
    {
      label: intl.formatMessage({ id: 'riskControl.suggestions.freezeUserWithdrawal' }),
      value: 'freezing_withdrawal',
    },
    {
      value: 'reject_withdrawal_review',
      label: intl.formatMessage({ id: 'riskControl.suggestions.withdrawalReviewRejected' }),
    },
    {
      value: 'manual_review',
      label: intl.formatMessage({ id: 'riskControl.suggestions.manualReview' }),
    },
  ];

  // 获取 处理信息建议
  const getSuggestions = async () => {
    const res = await actionRiskLevelParams();
    if (res.code === '0' && res.data) {
      const sensitiveInfo = res.data.map((item: any) => ({
        riskLevel: item.riskLevel.toString(),
        id: item.id,
        actionTipsCode: item.actionTipsCode,
      }));
      setSuggestionsData(sensitiveInfo);
    }
  };

  // 获取 敏感信息
  const getSensitive = async () => {
    let res = await riskConditionTemplateList({});
    if (res.code === '0' && res.data) {
      console.log(res.data);
      const sensitiveInfo = res.data.find((item: any) => item.sceneCode === 'SENSITIVE_INFO');
      console.log(sensitiveInfo);
      const data = sensitiveInfo.riskConditions.map((item: any) => ({
        conditionCode: item.conditionCode,
        sceneCode: item.sceneCode,
        actionMethod: item.actionMethod,
        thresholdMap: item.thresholdMap,
        conditionId: item.conditionId,
      }));
      console.log(data);
      setSensitiveData(data);
    }
  };

  useEffect(() => {
    getSensitive();
    getSuggestions();
  }, []);

  return (
    <Space direction="vertical" size="large">
      <Suggestion
        suggestion={suggestion}
        initData={suggestionsData}
        getData={getSuggestions}
        intl={intl}
      />
      <Sensitive
        suggestion={suggestion}
        initData={sensitiveData}
        getData={getSensitive}
        intl={intl}
      />
    </Space>
  );
};

export default RiskControlSuggestions;
