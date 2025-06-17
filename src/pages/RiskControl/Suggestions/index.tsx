import { Button, Card, Form, Input, InputNumber, Select, Space, Spin } from 'antd';
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
}: {
  suggestion: any;
  intl: any;
  initData: any;
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      if (!values) return;
      setLoading(true);
      const params = form.getFieldsValue();
      console.log('params', params);
      const res = await saveActionRiskLevel({
        riskLevels: params,
      });
      if (res.code === '0' && res.data) {
        console.log(res.data);
      }
      setEditing(false);
      setLoading(false);
    });
  };
  const onCancel = () => {
    form.resetFields();
    form.setFieldsValue({
      riskLevels: initData,
    });
    setEditing(false);
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
          {/* 一级 */}
          <Space wrap>
            <Form.Item name={['riskLevels', 0, 'id']} hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name={['riskLevels', 0, 'riskLevel']}
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.riskLevelGreaterThanOrEqual',
              })}
            >
              <Input suffix={intl.formatMessage({ id: 'riskControl.config.level' })} />
            </Form.Item>
            <Form.Item
              name={['riskLevels', 0, 'actionTipsCode']}
              rules={[{ required: true }]}
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
            >
              <Select style={{ width: 300 }} options={suggestion} />
            </Form.Item>
          </Space>
          {/* 二级 */}
          <Space wrap>
            <Form.Item name={['riskLevels', 1, 'id']} hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name={['riskLevels', 1, 'riskLevel']}
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.riskLevelGreaterThanOrEqual',
              })}
            >
              <Input suffix={intl.formatMessage({ id: 'riskControl.config.level' })} />
            </Form.Item>
            <Form.Item
              name={['riskLevels', 1, 'actionTipsCode']}
              rules={[{ required: true }]}
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
            >
              <Select style={{ width: 300 }} options={suggestion} />
            </Form.Item>
          </Space>
          {/* 三级 */}
          <Space wrap>
            <Form.Item name={['riskLevels', 2, 'id']} hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name={['riskLevels', 2, 'riskLevel']}
              style={{ marginBottom: 0, marginRight: 5 }}
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.riskLevelGreaterThanOrEqual',
              })}
            >
              <Input suffix={intl.formatMessage({ id: 'riskControl.config.level' })} />
            </Form.Item>
            <Form.Item
              name={['riskLevels', 2, 'actionTipsCode']}
              rules={[{ required: true }]}
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
            >
              <Select style={{ width: 300 }} options={suggestion} />
            </Form.Item>
          </Space>
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
}: {
  suggestion: any;
  initData: any;
  intl: any;
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      console.log('Form values:', values);
      if (!values) return;
      setLoading(true);
      const res = await saveRiskConditions(values);
      if (res.code === '0') {
        console.log(res.data);
      }
      setLoading(false);
      setEditing(false);
    });
  };

  const onCancel = () => {
    form.resetFields();
    form.setFieldsValue({
      riskConditionVos: initData,
    });
    setEditing(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      riskConditionVos: initData,
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
        <Form form={form} disabled={!editing}>
          <Space style={{ marginBottom: 16, display: 'flex' }}>
            <Form.Item
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.prohibitWithdrawalAfterPasswordChange',
              })}
              name={['riskConditionVos', 0, 'thresholdMap', 'time']}
            >
              <InputNumber suffix="H" />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
              name={['riskConditionVos', 0, 'thresholdMap', 'unit']}
              rules={[{ required: true }]}
            >
              <Select style={{ width: 200 }} options={suggestion} />
            </Form.Item>
          </Space>

          <Space style={{ marginBottom: 16, display: 'flex' }}>
            <Form.Item
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.prohibitWithdrawalAfter2FAUnbinding',
              })}
              name={['riskConditionVos', 1, 'thresholdMap', 'time']}
            >
              <InputNumber suffix="H" />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
              rules={[{ required: true }]}
              name={['riskConditionVos', 1, 'thresholdMap', 'unit']}
            >
              <Select style={{ width: 200 }} options={suggestion} />
            </Form.Item>
          </Space>

          <Space style={{ marginBottom: 16, display: 'flex' }}>
            <Form.Item
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.prohibitWithdrawalAfterPhoneChange',
              })}
              name={['riskConditionVos', 2, 'thresholdMap', 'time']}
            >
              <InputNumber suffix="H" />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
              rules={[{ required: true }]}
              name={['riskConditionVos', 2, 'thresholdMap', 'unit']}
            >
              <Select style={{ width: 200 }} options={suggestion} />
            </Form.Item>
          </Space>

          <Space style={{ marginBottom: 16, display: 'flex' }}>
            <Form.Item
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.prohibitWithdrawalAfterEmailChange',
              })}
              name={['riskConditionVos', 3, 'thresholdMap', 'time']}
            >
              <InputNumber suffix="H" />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
              rules={[{ required: true }]}
              name={['riskConditionVos', 3, 'thresholdMap', 'unit']}
            >
              <Select style={{ width: 200 }} options={suggestion} />
            </Form.Item>
          </Space>

          <Space style={{ marginBottom: 16, display: 'flex' }}>
            <Form.Item
              rules={[{ required: true }]}
              label={intl.formatMessage({
                id: 'riskControl.suggestions.prohibitWithdrawalAfterFundPasswordChange',
              })}
              name={['riskConditionVos', 4, 'thresholdMap', 'time']}
            >
              <InputNumber suffix="H" />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'riskControl.suggestions.processingAdvice' })}
              rules={[{ required: true }]}
              name={['riskConditionVos', 4, 'thresholdMap', 'unit']}
            >
              <Select style={{ width: 200 }} options={suggestion} />
            </Form.Item>
          </Space>
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
        thresholdMap: item.thresholdMap,
      }));
      setSensitiveData(data);
    }
  };

  useEffect(() => {
    getSensitive();
    getSuggestions();
  }, []);

  return (
    <Space direction="vertical" size="large">
      <Suggestion suggestion={suggestion} initData={suggestionsData} intl={intl} />
      <Sensitive suggestion={suggestion} initData={sensitiveData} intl={intl} />
    </Space>
  );
};

export default RiskControlSuggestions;
