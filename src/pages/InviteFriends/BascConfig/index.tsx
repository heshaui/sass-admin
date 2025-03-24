import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  InputNumber, 
  Switch, 
  message, 
  Alert, 
  Select, 
  Radio, 
  Tabs, 
  Upload 
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { Option } = Select;
const { TabPane } = Tabs;

const BasicConfig: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单提交的值：', values);
    message.success('配置保存成功');
  };

  return (
    <PageContainer title="邀请好友基础配置">
      {/* 账户余额警告 */}
      <Alert
        message="账户余额不足提醒！"
        description="尊敬的客户！检测到您邀请返佣账户余额不足！请及时补充余额！若余额不足，自动停止发放奖励，资金充足后自动补发。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary">
            前往
          </Button>
        }
      />

      {/* 账户配置 */}
      <Card title="账户配置" style={{ marginBottom: 24 }}>
        <Form.Item
          name="enabled"
          label="是否开启"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <div className="tips">
          <p>Tips:</p>
          <p>1. 开启后，个人中心将显示入口，及之不显示，查通过URL配置，也需要开启;</p>
        </div>
      </Card>

      {/* 奖励配置 */}
      <Card 
        title="奖励配置" 
        style={{ marginBottom: 24 }}
        extra={<Button type="primary">编辑</Button>}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            enabled: true,
            inviteReward: 10,
            inviteeReward: 5,
            returnCurrency: 'USDT',
            returnRatio: 20,
            validityPeriod: 14,
            minValue: 50,
            realNameRequired: 'required'
          }}
        >
          <Form.Item
            name="returnCurrency"
            label="返佣返币币种"
            rules={[{ required: true, message: '请选择返佣币种' }]}
          >
            <Select style={{ width: 200 }}>
              <Option value="USDT">USDT</Option>
              <Option value="TRX">TRX</Option>
              <Option value="BTC">BTC</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="returnRatio"
            label="返佣比例"
            rules={[{ required: true, message: '请输入返佣比例' }]}
          >
            <InputNumber min={0} max={100} addonAfter="%" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="validityPeriod"
            label="任务有效期限"
            rules={[{ required: true, message: '请输入有效期限' }]}
          >
            <InputNumber min={1} addonAfter="天" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="minValue"
            label="充值最小充值低于"
            rules={[{ required: true, message: '请输入最小充值金额' }]}
          >
            <InputNumber min={0} addonAfter="USDT" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="realNameRequired"
            label="是否要求实名"
          >
            <Radio.Group>
              <Radio value="required">需要实名</Radio>
              <Radio value="not_required">无需实名</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="inviteReward"
            label="邀请人奖励积分"
            rules={[{ required: true, message: '请输入邀请人奖励积分' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="inviteeReward"
            label="被邀请人奖励积分"
            rules={[{ required: true, message: '请输入被邀请人奖励积分' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="inviteDescription"
            label="邀请活动说明"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Card>

      {/* 邀请页面配置 */}
      <Card title="邀请页面配置" style={{ marginBottom: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="English" key="1"></TabPane>
          <TabPane tab="简体中文" key="2"></TabPane>
          <TabPane tab="繁體中文" key="3"></TabPane>
          <TabPane tab="日本語" key="4"></TabPane>
          <TabPane tab="한국어" key="5"></TabPane>
        </Tabs>
        
        <div style={{ marginTop: 20 }}>
          <h4>邀请页背景配置（PC）</h4>
          <Upload
            action="/upload.do"
            listType="picture-card"
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
          <p>建议尺寸1236*452</p>
        </div>
        
        <div style={{ marginTop: 20 }}>
          <h4>邀请海报底图（PC）</h4>
          <Upload
            action="/upload.do"
            listType="picture-card"
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
          <p>建议尺寸856*452</p>
        </div>
      </Card>

      {/* 资金账户列表 */}
      <Card title="资金账户列表">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px' }}>币种</th>
              <th style={{ padding: '10px' }}>账户可用</th>
              <th style={{ padding: '10px' }}>状态</th>
              <th style={{ padding: '10px' }}>添加时间</th>
              <th style={{ padding: '10px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px' }}>USDT</td>
              <td style={{ padding: '10px' }}>210.00</td>
              <td style={{ padding: '10px' }}>使用中</td>
              <td style={{ padding: '10px' }}>2025-02-12 12:12:12</td>
              <td style={{ padding: '10px' }}><a href="#">发放记录</a></td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>TRX</td>
              <td style={{ padding: '10px' }}>210.00</td>
              <td style={{ padding: '10px' }}>未使用</td>
              <td style={{ padding: '10px' }}>2024-02-12 12:12:12</td>
              <td style={{ padding: '10px' }}><a href="#">发放记录</a></td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>BTC</td>
              <td style={{ padding: '10px' }}>210.00</td>
              <td style={{ padding: '10px' }}>未使用</td>
              <td style={{ padding: '10px' }}>2024-02-12 12:12:12</td>
              <td style={{ padding: '10px' }}><a href="#">发放记录</a></td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 15, textAlign: 'right' }}>
          <Button>上一页</Button>
          <span style={{ margin: '0 10px' }}>2/5</span>
          <Button>下一页</Button>
        </div>
      </Card>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" onClick={() => form.submit()}>
          保存配置
        </Button>
      </div>
    </PageContainer>
  );
};

export default BasicConfig; 