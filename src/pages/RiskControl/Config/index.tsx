import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, InputNumber, Button, Row, Col, Space, Typography } from 'antd';
import { riskConditionTemplateList } from '@/services/ant-design-pro/risk';

const { Text } = Typography;

const RiskControlConfig: React.FC = () => {
  const [form] = Form.useForm();

  // 添加编辑状态控制
  const [editingSection, setEditingSection] = useState<string | null>(null);



  const onFinish = (values: any) => {
    console.log('表单提交的值:', values);
    // 处理保存逻辑
    setEditingSection(null); // 提交后退出编辑模式
  };

  // 切换编辑状态的函数
  const toggleEdit = (section: string) => {
    if (editingSection === section) {
      setEditingSection(null);
    } else {
      setEditingSection(section);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await riskConditionTemplateList({});
      console.log(res);
    };
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* 资产不平 */}
        <Card 
          title="资产不平" 
          bordered={false} 
          style={{marginBottom:20}}
          extra={
            editingSection === 'asset' ? (
              <Space>
                <Button onClick={() => toggleEdit('asset')}>取消</Button>
                <Button type="primary" onClick={() => form.submit()}>保存</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => toggleEdit('asset')}>编辑</Button>
            )
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 资产折合 &gt;=</>}
                name="assetThreshold"
              >
                <Space>
                  <InputNumber min={0} placeholder="1.0" disabled={editingSection !== 'asset'} />
                  <Text>USDT</Text>
                </Space>
              </Form.Item>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="assetRiskLevel"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'asset'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="报警通知" name="alertMethod">
               <Input placeholder="邮箱或手机，以类文通号啓开" disabled={editingSection !== 'asset'} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 洗钱嫌疑 */}
        <Card 
          title="洗钱嫌疑" 
          bordered={false} 
          className="mt-4"
          style={{marginBottom:20}}
          extra={
            editingSection === 'money' ? (
              <Space>
                <Button onClick={() => toggleEdit('money')}>取消</Button>
                <Button type="primary" onClick={() => form.submit()}>保存</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => toggleEdit('money')}>编辑</Button>
            )
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span></>}
                name="timeLimit"
              >
                <Space>
                  <InputNumber min={1} placeholder="10" disabled={editingSection !== 'money'} />
                  <Text>分钟内，累计提现笔数 &gt;</Text>
                  <InputNumber min={1} placeholder="5" disabled={editingSection !== 'money'} />
                  <Text>次。</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="withdrawalCountRiskLevel"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'money'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 24小时内充值 &gt;</>}
                name="depositLimit"
              >
                <Space>
                  <InputNumber min={1} placeholder="100000" disabled={editingSection !== 'money'} />
                  <Text>USDT 且提现金额大于</Text>
                  <InputNumber min={1} max={100} placeholder="90" disabled={editingSection !== 'money'} />
                  <Text>%的充值金额。</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="depositWithdrawalRiskLevel"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'money'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 被盗预警 */}
        <Card 
          title="被盗预警" 
          bordered={false} 
          className="mt-4"
          extra={
            editingSection === 'theft' ? (
              <Space>
                <Button onClick={() => toggleEdit('theft')}>取消</Button>
                <Button type="primary" onClick={() => form.submit()}>保存</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => toggleEdit('theft')}>编辑</Button>
            )
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 用户提现的IP更换次数占比 &lt;</>}
                name="ipChangeRatio"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>%</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="ipChangeRiskLevel"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<>用户提现地址之前未成功提现 &gt;</>}
                name="newAddressCount"
              >
                <Space>
                  <InputNumber min={1} placeholder="5" disabled={editingSection !== 'theft'} />
                  <Text>次。</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="newAddressRiskLevel"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<>两个不同的账户提现到同一个地址</>}
                name="multiAccountWithdrawal"
              >
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><span style={{ color: 'red' }}>*</span> 风控等级+</>}
                name="multiAccountRiskLevel"
              >
                <Space>
                  <InputNumber min={1} placeholder="1" disabled={editingSection !== 'theft'} />
                  <Text>级</Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </PageContainer>
  );
};

export default RiskControlConfig; 