import React, { useState ,useEffect} from 'react';
import { Card, Descriptions, Badge, Space, Button, Modal, message, Input, Form, Select, Tabs } from 'antd';
import type { UserItem } from '@/services/ant-design-pro/UserManagement';
import {  ProTable } from '@ant-design/pro-components';
import { useModel } from 'umi';
import { 
  freezeLogin, freezeTransaction, freezeWithdrawal,
  unfreezeLogin, unfreezeTransaction, unfreezeWithdrawal,
  updatePhone, updateEmail,getUserOperationLogs,getUserDetail,relieveGoogle
} from '@/services/ant-design-pro/UserManagement';
import { sendGoogleKey,bindGoogleKey} from '@/services/ant-design-pro/authAdmin';
import TextArea from 'antd/es/input/TextArea';
import GoogleCode from '@/components/GoogleCode';
import dayjs from 'dayjs';
const { Option } = Select;

interface UserDetailProps {
  visible: boolean;
  userId: string | number;
  onClose: () => void;
}




const UserDetail: React.FC<UserDetailProps> = ({ visible, userId, onClose }) => {
  if (!visible || !userId) return null;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  console.log(currentUser);

  // 模态框显示状态
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [user, setUser] = useState<any>({});
  
  // 操作类型
  const [loginActionType, setLoginActionType] = useState<'freeze' | 'unfreeze'>('freeze');
  const [transactionActionType, setTransactionActionType] = useState<'freeze' | 'unfreeze'>('freeze');
  const [withdrawalActionType, setWithdrawalActionType] = useState<'freeze' | 'unfreeze'>('freeze');
  
  // 操作原因
  const [loginReason, setLoginReason] = useState('');
  const [transactionReason, setTransactionReason] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  
  // 手机号和邮箱修改表单
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [googleCode, setGoogleCode] = useState('');
  const [phoneRemark, setPhoneRemark] = useState('');
  const [emailRemark, setEmailRemark] = useState('');
  const [countryCode, setCountryCode] = useState('86');
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);

  // 添加解绑谷歌验证状态和原因
  const [unbindGoogleModalVisible, setUnbindGoogleModalVisible] = useState(false);
  const [unbindGoogleReason, setUnbindGoogleReason] = useState('');

  const columns: ProColumns<any>[] = [
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '操作管理员',
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
    {
      title: '操作行为',
      dataIndex: 'operationType',
      key: 'operationType',
    },
    {
      title: '修改前',
      dataIndex: 'beforeValue',
      key: 'beforeValue',
    },
    {
      title: '修改后',
      dataIndex: 'afterValue',
      key: 'afterValue',
    },
    {
      title: '备注',
      dataIndex: 'remarkMsg',
      key: 'remarkMsg',
    },
  ];

  const userDetailInfo=async()=>{
    const res=await getUserDetail(userId);
    if(res.code==='0'){
      setUser(res.data);
    }else{
      message.error(res.message);
    }
  }
  const getLog=async()=>{
    const res=await getUserOperationLogs({ userId: userId,pageNo:1,pageSize:10});
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count || res.data.list.length
      };
    }else{
      message.error(res.message);
      return {
        data: [],
        success: false,
        total: 0
      };
    }
  }

  // 修改解绑谷歌验证的处理函数
  const showUnbindGoogleModal = () => {
    setUnbindGoogleReason('');
    setUnbindGoogleModalVisible(true);
  };
  
  const handleUnbindGoogleCode = async () => {
    if (!unbindGoogleReason.trim()) {
      message.error('请输入解绑原因');
      return;
    }
    
    const res = await relieveGoogle({ 
      userId: user.userId, 
      remark: unbindGoogleReason 
    });
    
    if(res.code === '0') {
      message.success('解绑成功');
      await userDetailInfo();
      setUnbindGoogleModalVisible(false);
     await getLog()
    } else {
      message.error(res.message);
    }
  };

  const getGoogleCode=async()=>{
    const res=await sendGoogleKey();
    if(res.code==='0'){
      setGoogleCodeVisible(true);
      setEmailModalVisible(false);
      setPhoneModalVisible(false);
      setGoogleCodeData(res.data);
      await getLog()
    }else{
      message.error(res.message);
    }
    
  }

  const handleGoogleCodeSuccess = async (code: string) => {
    setGoogleCode(code);
    
    const res=await bindGoogleKey({ googleCode: code });
    if(res.code==='0'){
      message.success('绑定成功');
      await getLog()
    }else{
      message.error(res.message);
    }
    setGoogleCodeVisible(false);
  }

  // 处理登录权限操作
  const handleLoginAction = async () => {
    try {
      if (!loginReason.trim()) {
        message.error('请输入操作原因');
        return;
      }
      
      if (loginActionType === 'freeze') {
        const res= await freezeLogin({ userId: user.userId, remark: loginReason });
        if(res.code==='0'){
          message.success('冻结登录操作成功');
          await getLog()
        }else{
          message.error(res.message);
        }
      } else {
        const res= await unfreezeLogin({ userId: user.userId, remark: loginReason });
        if(res.code==='0'){
          message.success('解冻登录操作成功');
          await getLog()
        }else{
          message.error(res.message);
        }
      }
      setLoginModalVisible(false);
    } catch (error) {
      console.error(`${loginActionType === 'freeze' ? '冻结' : '解冻'}登录失败`, error);
      message.error(`${loginActionType === 'freeze' ? '冻结' : '解冻'}登录操作失败`);
    }
   await userDetailInfo();
  };

  // 处理交易权限操作
  const handleTransactionAction = async () => {
    try {
      if (!transactionReason.trim()) {
        message.error('请输入操作原因');
        return;
      }
      
      if (transactionActionType === 'freeze') {
        const res= await freezeTransaction({ userId: user.userId, remark: transactionReason });
        if(res.code==='0'){
          message.success('冻结交易操作成功');
          await getLog()
        }else{
          message.error(res.message);
        }
      } else {
        const res= await unfreezeTransaction({ userId: user.userId, remark: transactionReason });
        if(res.code==='0'){
          message.success('解冻交易操作成功');
          await getLog()
        }else{ 
          message.error(res.message);
        }
      }
      setTransactionModalVisible(false);
    } catch (error) {
      console.error(`${transactionActionType === 'freeze' ? '冻结' : '解冻'}交易失败`, error);
      message.error(`${transactionActionType === 'freeze' ? '冻结' : '解冻'}交易操作失败`);
    }
    await userDetailInfo();
  };

  // 处理提现权限操作
  const handleWithdrawalAction = async () => {
    try {
      if (!withdrawalReason.trim()) {
        message.error('请输入操作原因');
        return;
      }
      
      if (withdrawalActionType === 'freeze') {
       const res= await freezeWithdrawal({ userId: user.userId, remark: withdrawalReason });
       if(res.code==='0'){
        message.success('冻结提现操作成功');
        await getLog()
       }else{
        message.error(res.message);
       }
      } else {
        const res= await unfreezeWithdrawal({ userId: user.userId, remark: withdrawalReason });
        if(res.code==='0'){
          message.success('解冻提现操作成功');
          await getLog()
        }else{
          message.error(res.message);
        }
      }
      setWithdrawalModalVisible(false);
    } catch (error) {
      console.error(`${withdrawalActionType === 'freeze' ? '冻结' : '解冻'}提现失败`, error);
      message.error(`${withdrawalActionType === 'freeze' ? '冻结' : '解冻'}提现操作失败`);
    }
    await userDetailInfo();
  };

  // 处理修改手机号
  const handleUpdatePhone = async () => {
    try {
      if (!newPhone.trim()) {
        message.error('请输入新手机号');
        return;
      }
      
      if (!googleCode.trim()) {
        message.error('请输入谷歌验证码');
        return;
      }
      
     const res= await updatePhone({ 
        userId: user.userId, 
        phone:user.phone,
        newPhone:newPhone,
        googleCode:googleCode,
        remark: phoneRemark 
      });
      if(res.code==='0'){
        message.success('手机号更新成功');
        await getLog()
      }else{
        message.error(res.message);
      }
      setPhoneModalVisible(false);
    } catch (error) {
      message.error('手机号更新失败');
    }
    await userDetailInfo();
  };

  // 处理修改邮箱
  const handleUpdateEmail = async () => {
    try {
      if (!newEmail.trim()) {
        message.error('请输入新邮箱');
        return;
      }
      
      if (!googleCode.trim()) {
        message.error('请输入谷歌验证码');
        return;
      }
      
     const res= await updateEmail({ 
        userId: user.userId, 
        email:user.email,
        newEmail:newEmail,
        googleCode:googleCode,
        remark: emailRemark 
      });
      if(res.code==='0'){
        message.success('邮箱更新成功');
        await getLog()
      }else{
        message.error(res.message);
      }
      setEmailModalVisible(false);
    } catch (error) {
      console.error('更新邮箱失败', error);
      message.error('邮箱更新失败');
    }
    await userDetailInfo();
  };

  // 显示登录权限操作模态框
  const showLoginModal = (type: 'freeze' | 'unfreeze') => {
    setLoginActionType(type);
    setLoginReason('');
    setLoginModalVisible(true);
  };

  // 显示交易权限操作模态框
  const showTransactionModal = (type: 'freeze' | 'unfreeze') => {
    setTransactionActionType(type);
    setTransactionReason('');
    setTransactionModalVisible(true);
  };

  // 显示提现权限操作模态框
  const showWithdrawalModal = (type: 'freeze' | 'unfreeze') => {
    setWithdrawalActionType(type);
    setWithdrawalReason('');
    setWithdrawalModalVisible(true);
  };
  
  // 显示修改手机号模态框
  const showUpdatePhoneModal = () => {
    setNewPhone('');
    setGoogleCode('');
    setPhoneRemark('');
    setCountryCode('86');
    setPhoneModalVisible(true);
  };
  
  // 显示修改邮箱模态框
  const showUpdateEmailModal = () => {
    setNewEmail('');
    setGoogleCode('');
    setEmailRemark('');
    setEmailModalVisible(true);
  };
  
  useEffect(()=>{
    userDetailInfo();
  },[userId]);
  return (
    <>
      <Card 
        title="用户详情" 
        extra={<a onClick={onClose}>返回</a>} 
        className="user-detail-card"
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="用户ID">{user?.userId}</Descriptions.Item>
          <Descriptions.Item label="昵称">{user?.account}</Descriptions.Item>
          <Descriptions.Item label="用户状态">
            <Space>
            {user.status===1 ? '正常' : '冻结'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="提现状态">
            <Space>
            {user.withdrawalStatus===1 ? '正常' : '冻结'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="交易状态">
            <Space>
            {user.transactionStatus===1 ? '正常' : '冻结'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="手机号码">
            {user.phone}
            {user.phone ? (
              <Button 
                type="link" 
                onClick={showUpdatePhoneModal} 
                style={{ marginLeft: '8px' }}
              >
            

              修改
            </Button>) : ''}
          </Descriptions.Item>
          <Descriptions.Item label="姓名">
            {user.lastName} {user.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">{dayjs(user.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {user.email}
            {
              user.email ? (
                <Button 
                  type="link" 
                  onClick={showUpdateEmailModal} 
                  style={{ marginLeft: '8px' }}
                >
                  
                  修改
                </Button>
              ) : ''
            }
     
          </Descriptions.Item>
          <Descriptions.Item label="实名认证">{user.realnessStatus===1 ? '已认证' : '未认证'}</Descriptions.Item>
          <Descriptions.Item label="证件编号">{user.idNumber || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="操作">
            {/* 登录状态操作按钮 */}
            {user.status === 1 ? (
              <Button 
                type="primary" 
                danger 
                style={{marginRight: '10px'}} 
                onClick={() => showLoginModal('freeze')}
              >
                冻结登录
              </Button>
            ) : (
              <Button 
                type="primary"
                style={{marginRight: '10px'}} 
                onClick={() => showLoginModal('unfreeze')}
              >
                解冻登录
              </Button>
            )}
            
            {/* 交易状态操作按钮 */}
            {user.transactionStatus === 1 ? (
              <Button 
                type="primary" 
                danger 
                style={{marginRight: '10px'}} 
                onClick={() => showTransactionModal('freeze')}
              >
                冻结交易
              </Button>
            ) : (
              <Button 
                type="primary"
                style={{marginRight: '10px'}} 
                onClick={() => showTransactionModal('unfreeze')}
              >
                解冻交易
              </Button>
            )}
            
            {/* 提现状态操作按钮 */}
            {user.withdrawalStatus === 1 ? (
              <Button 
                type="primary" 
                danger 
                onClick={() => showWithdrawalModal('freeze')}
              >
                冻结提现
              </Button>
            ) : (
              <Button 
                type="primary"
                onClick={() => showWithdrawalModal('unfreeze')}
              >
                解冻提现
              </Button>
            )}
            {user.googleKey && (
              <Button 
                type="primary" 
                style={{marginLeft: '10px'}} 
                onClick={showUnbindGoogleModal}
              >
                解绑谷歌验证
              </Button>
            )}
          </Descriptions.Item>
        </Descriptions>
        <Tabs>
          <Tabs.TabPane tab="操作日志" key="1">
            <ProTable
              columns={columns}
              rowKey="id"
              search={false}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total) => `共 ${total} 条记录`
              }}
              request={getLog}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 登录权限操作对话框 */}
      <Modal
        title={`确认${loginActionType === 'freeze' ? '冻结' : '解冻'}登录`}
        open={loginModalVisible}
        onOk={handleLoginAction}
        onCancel={() => setLoginModalVisible(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: !loginReason.trim() }}
      >
        <p>您确定要{loginActionType === 'freeze' ? '冻结' : '解冻'}用户 <strong>{user.account}</strong> (ID: {user.userId}) 的登录权限吗？</p>
        <p>{loginActionType === 'freeze' ? '冻结后，该用户将无法登录系统。' : '解冻后，该用户将恢复登录系统的权限。'}</p>
        <Form layout="vertical">
          <Form.Item label={`${loginActionType === 'freeze' ? '冻结' : '解冻'}原因：`} required>
            <TextArea
              placeholder={`请输入${loginActionType === 'freeze' ? '冻结' : '解冻'}原因`}
              value={loginReason}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setLoginReason(e.target.value);
                }
              }}
              rows={4}
              maxLength={50}
            />
            <div style={{ textAlign: 'right', color: '#999' }}>
              {loginReason.length}/50
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 交易权限操作对话框 */}
      <Modal
        title={`确认${transactionActionType === 'freeze' ? '冻结' : '解冻'}交易`}
        open={transactionModalVisible}
        onOk={handleTransactionAction}
        onCancel={() => setTransactionModalVisible(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: !transactionReason.trim() }}
      >
        <p>您确定要{transactionActionType === 'freeze' ? '冻结' : '解冻'}用户 <strong>{user.account}</strong> (ID: {user.userId}) 的交易权限吗？</p>
        <p>{transactionActionType === 'freeze' ? '冻结后，该用户将无法进行任何交易操作。' : '解冻后，该用户将恢复交易功能。'}</p>
        <Form layout="vertical">
          <Form.Item label={`${transactionActionType === 'freeze' ? '冻结' : '解冻'}原因：`} required>
            <TextArea
              placeholder={`请输入${transactionActionType === 'freeze' ? '冻结' : '解冻'}原因`}
              value={transactionReason}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setTransactionReason(e.target.value);
                }
              }}
              rows={4}
              maxLength={50}
            />
            <div style={{ textAlign: 'right', color: '#999' }}>
              {transactionReason.length}/50
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 提现权限操作对话框 */}
      <Modal
        title={`确认${withdrawalActionType === 'freeze' ? '冻结' : '解冻'}提现`}
        open={withdrawalModalVisible}
        onOk={handleWithdrawalAction}
        onCancel={() => setWithdrawalModalVisible(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: !withdrawalReason.trim() }}
      >
        <p>您确定要{withdrawalActionType === 'freeze' ? '冻结' : '解冻'}用户 <strong>{user.account}</strong> (ID: {user.userId}) 的提现权限吗？</p>
        <p>{withdrawalActionType === 'freeze' ? '冻结后，该用户将无法进行提现操作。' : '解冻后，该用户将恢复提现功能。'}</p>
        <Form layout="vertical">
          <Form.Item label={`${withdrawalActionType === 'freeze' ? '冻结' : '解冻'}原因：`} required>
            <TextArea
              placeholder={`请输入${withdrawalActionType === 'freeze' ? '冻结' : '解冻'}原因`}
              value={withdrawalReason}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setWithdrawalReason(e.target.value);
                }
              }}
              rows={4}
              maxLength={50}
            />
            <div style={{ textAlign: 'right', color: '#999' }}>
              {withdrawalReason.length}/50
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改手机号模态框 */}
      <Modal
        title="更改手机号"
        open={phoneModalVisible}
        onOk={handleUpdatePhone}
        onCancel={() => setPhoneModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <p style={{ color: '#ff4d4f', marginBottom: '24px' }}>
          更改手机号后，24小时内无法出金，请确保已告知终端用户！
        </p>
        <Form layout="vertical">
          <Form.Item 
            label="旧手机号："
            required
            style={{ marginBottom: '16px' }}
          >
            <Input value={user?.phone} disabled />
          </Form.Item>
          
          <Form.Item 
            label="新手机号："
            required
            style={{ marginBottom: '16px' }}
          >
            <Input.Group compact>
              <Select 
                style={{ width: '30%' }} 
                value={countryCode}
                onChange={setCountryCode}
              >
                <Option value="86">全部</Option>
                <Option value="1">美国 +1</Option>
                <Option value="44">英国 +44</Option>
                <Option value="86">中国 +86</Option>
                <Option value="852">香港 +852</Option>
                <Option value="81">日本 +81</Option>
              </Select>
              <Input 
                style={{ width: '70%' }} 
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="请输入手机号"
              />
            </Input.Group>
          </Form.Item>
          
          <Form.Item 
            label="谷歌验证码："
            required
            style={{ marginBottom: '16px' }}
          >
            {
              currentUser?.employeeResp?.googleCode===false && (
                <Button type="link"  onClick={getGoogleCode}>未绑定，点击前往绑定</Button>
              )
            }
            {
              currentUser?.employeeResp?.googleCode===true && (
                <Input 
                  value={googleCode}
                  onChange={(e) => setGoogleCode(e.target.value)}
                  placeholder="请输入验证码"
                />
              )
            }
          </Form.Item>
          
          <Form.Item 
            label="备注："
            style={{ marginBottom: '8px' }}
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <TextArea
              placeholder="请输入原因，50字符以内"
              value={phoneRemark}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setPhoneRemark(e.target.value);
                }
              }}
              rows={4}
              maxLength={50}
            />
            <div style={{ textAlign: 'right', color: '#999' }}>
              {phoneRemark.length}/50
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 修改邮箱模态框 */}
      <Modal
        title="更改邮箱"
        open={emailModalVisible}
        onOk={handleUpdateEmail}
        onCancel={() => setEmailModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <p style={{ color: '#ff4d4f', marginBottom: '24px' }}>
          更改邮箱后，24小时内无法出金，请确保已告知终端用户！
        </p>
        <Form layout="vertical">
          <Form.Item 
            label="旧邮箱："
            required
            style={{ marginBottom: '16px' }}
          >
            <Input value={user?.email} disabled />
          </Form.Item>
          
          <Form.Item 
            label="新邮箱："
            required
            style={{ marginBottom: '16px' }}
          >
            <Input 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="请输入新邮箱"
            />
          </Form.Item>
          
          <Form.Item 
            label="谷歌验证码："
            required
            style={{ marginBottom: '16px' }}
            
          >
            {
              currentUser?.employeeResp?.googleCode===false && (
                <Button type="link" onClick={getGoogleCode}>未绑定，点击前往绑定</Button>
              )
            }
            {
              currentUser?.employeeResp?.googleCode===true && (
                <Input 
                  value={googleCode}
                  onChange={(e) => setGoogleCode(e.target.value)}
                  placeholder="请输入验证码"
                />
              )
            }
          </Form.Item>
          
          <Form.Item 
            label="备注："
            style={{ marginBottom: '8px' }}
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <TextArea
              placeholder="请输入原因，50字符以内"
              value={emailRemark}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setEmailRemark(e.target.value);
                }
              }}
              rows={4}
              maxLength={50}
            />
            <div style={{ textAlign: 'right', color: '#999' }}>
              {emailRemark.length}/50
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 添加解绑谷歌验证弹框 */}
      <Modal
        title="解绑谷歌验证"
        open={unbindGoogleModalVisible}
        onOk={handleUnbindGoogleCode}
        onCancel={() => setUnbindGoogleModalVisible(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: !unbindGoogleReason.trim() }}
      >
        <p style={{ marginBottom: '20px' }}>解绑谷歌后，该用户可登录账号重新绑定！</p>
        <Form layout="vertical">
          <Form.Item>
            <TextArea
              placeholder="请输入原因，50字符以内"
              value={unbindGoogleReason}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setUnbindGoogleReason(e.target.value);
                }
              }}
              rows={4}
              maxLength={50}
            />
            <div style={{ textAlign: 'right', color: '#999', marginTop: '5px' }}>
              {unbindGoogleReason.length}/50
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      <GoogleCode 
        visible={googleCodeVisible} 
        qrCodeUrl={googleCodeData?.codeUri} 
        secretKey={googleCodeData?.secretKey} 
        onSubmit={handleGoogleCodeSuccess} 
        onCancel={() => setGoogleCodeVisible(false)}
      />
    </>
  );
};

export default UserDetail; 