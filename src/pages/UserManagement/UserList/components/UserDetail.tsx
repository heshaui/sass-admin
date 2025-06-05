import React, { useState ,useEffect} from 'react';
import { Card, Descriptions, Space, Button, Modal, message, Input, Form, Select, Tabs } from 'antd';
import {  ProTable } from '@ant-design/pro-components';
import { useModel, useIntl } from 'umi';
import { 
  freezeLogin, freezeTransaction, freezeWithdrawal,
  unfreezeLogin, unfreezeTransaction, unfreezeWithdrawal,
  updatePhone, updateEmail,getUserOperationLogs,getUserDetail,relieveGoogle
} from '@/services/ant-design-pro/UserManagement';
import { sendGoogleKey,bindGoogleKey} from '@/services/ant-design-pro/authAdmin';
import { selectHomeCountryList } from '@/services/ant-design-pro/api';
import TextArea from 'antd/es/input/TextArea';
import GoogleCode from '@/components/GoogleCode';
import dayjs from 'dayjs';
import Asset from './Asset';
import UserTransaction from './UserTransaction';
import Reconciliation from './Reconciliation';
import Log from './log';
import { clearAllCookies } from '@/utils';
import { getTenantKeyParams, getTenantAdminKeyParams } from '@/services/ant-design-pro/kv';

const { Option } = Select;


interface UserDetailProps {
  visible: boolean;
  tenantId: string | number;
  userId: string | number;
  onClose: () => void;
}




const UserDetail: React.FC<UserDetailProps> = ({ visible, userId, onClose, tenantId }) => {
  const intl = useIntl();
  if (!visible || !userId) return null;
  const { initialState,refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
   const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';

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
  const [countryCode, setCountryCode] = useState('');
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);

  // 添加解绑谷歌验证状态和原因
  const [unbindGoogleModalVisible, setUnbindGoogleModalVisible] = useState(false);
  const [unbindGoogleReason, setUnbindGoogleReason] = useState('');
  const [countryList, setCountryList] = useState<any[]>([]);
  const [time,setTime] = useState('');


  const getKvInfo=async ()=>{
    if(isAdmin){
      const result = await getTenantAdminKeyParams({ key: 'out_money' ,tenantId: tenantId});
      if(result.code==='0' && result.data) {
        setTime(result.data.keyValue);
      }
    }else{
      const result = await getTenantKeyParams({ key: 'out_money' });
      if(result.code==='0'){
        setTime(result.data.keyValue);
      }
    }
   

  }

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.operationTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.adminId' }),
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.adminName' }),
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.operationType' }),
      dataIndex: 'operationType',
      key: 'operationType',
    },
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.beforeValue' }),
      dataIndex: 'beforeValue',
      key: 'beforeValue',
    },
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.afterValue' }),
      dataIndex: 'afterValue',
      key: 'afterValue',
    },
    {
      title: intl.formatMessage({ id: 'userDetail.operationLog.remark' }),
      dataIndex: 'operationRemark',
      key: 'operationRemark',
    },
  ];

 const getCountryList=async()=>{
  const res=await selectHomeCountryList();
  if(res.code==='0'){
    setCountryList(res.data);
  }
 }

  const userDetailInfo=async()=>{
    const res=await getUserDetail(userId);
    if(res.code==='0'){
      setUser(res.data);
    }else{
      message.error(res.message);
    }
  }
  const getLog=async(params:any)=>{
    const res=await getUserOperationLogs({ userId: userId,pageNo:params.current,pageSize:params.pageSize});
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
      message.error(intl.formatMessage({ id: 'userDetail.message.unbindGoogleAuthReason' }));
      return;
    }
    
    const res = await relieveGoogle({ 
      userId: user.userId, 
      remark: unbindGoogleReason 
    });
    
    if(res.code === '0'&&res.data) {
      message.success(intl.formatMessage({ id: 'userDetail.message.unbindGoogleAuthSuccess' }));
      await userDetailInfo();
      setUnbindGoogleModalVisible(false);
      refresh();
      await getLog({current:1,pageSize:10})
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
      await getLog({current:1,pageSize:10})
    }else{
      message.error(res.message);
    }
    
  }

  const handleGoogleCodeSuccess = async (code: string) => {
    setGoogleCode(code);
    
    const res=await bindGoogleKey({ googleCode: code });
    if(res.code==='0'&&res.data){
      message.success(intl.formatMessage({ id: 'assetAdjustment.googleCode.bindSuccess' }));
       clearAllCookies();
            window.location.reload();

    }else{
      message.error(res.message);
    }
    setGoogleCodeVisible(false);
  }

  // 处理登录权限操作
  const handleLoginAction = async () => {
    try {
      if (!loginReason.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterOperationReason' }));
        return;
      }
      
      if (loginActionType === 'freeze') {
        const res= await freezeLogin({ userId: user.userId, remark: loginReason });
        if(res.code==='0'&&res.data){
          message.success(intl.formatMessage({ id: 'userDetail.message.freezeLoginSuccess' }));
          await getLog({current:1,pageSize:10})

        }else{
          message.error(res.message);
        }
      } else {
        const res= await unfreezeLogin({ userId: user.userId, remark: loginReason });
        if(res.code==='0'&&res.data){
          message.success(intl.formatMessage({ id: 'userDetail.message.unfreezeLoginSuccess' }));
          await getLog({current:1,pageSize:10})

        }else{
          message.error(res.message);
        }
      }
      setLoginModalVisible(false);
    } catch (error) {
      console.error(loginActionType === 'freeze' ? 
        intl.formatMessage({ id: 'userDetail.message.freezeLoginError' }) : 
        intl.formatMessage({ id: 'userDetail.message.unfreezeLoginError' }), error);
      message.error(loginActionType === 'freeze' ? 
        intl.formatMessage({ id: 'userDetail.message.freezeLoginError' }) : 
        intl.formatMessage({ id: 'userDetail.message.unfreezeLoginError' }));
    }
   await userDetailInfo();
  };

  // 处理交易权限操作
  const handleTransactionAction = async () => {
    try {
      if (!transactionReason.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterOperationReason' }));
        return;
      }
      
      if (transactionActionType === 'freeze') {
        const res= await freezeTransaction({ userId: user.userId, remark: transactionReason });
        if(res.code==='0'){
          message.success(intl.formatMessage({ id: 'userDetail.message.freezeTransactionSuccess' }));
          await getLog({current:1,pageSize:10})

        }else{
          message.error(res.message);
        }
      } else {
        const res= await unfreezeTransaction({ userId: user.userId, remark: transactionReason });
        if(res.code==='0'&&res.data){
          message.success(intl.formatMessage({ id: 'userDetail.message.unfreezeTransactionSuccess' }));
          await getLog({current:1,pageSize:10})

        }else{ 
          message.error(res.message);
        }
      }
      setTransactionModalVisible(false);
    } catch (error) {
      console.error(transactionActionType === 'freeze' ? 
        intl.formatMessage({ id: 'userDetail.message.freezeTransactionError' }) : 
        intl.formatMessage({ id: 'userDetail.message.unfreezeTransactionError' }), error);
      message.error(transactionActionType === 'freeze' ? 
        intl.formatMessage({ id: 'userDetail.message.freezeTransactionError' }) : 
        intl.formatMessage({ id: 'userDetail.message.unfreezeTransactionError' }));
    }
    await userDetailInfo();
  };

  // 处理提现权限操作
  const handleWithdrawalAction = async () => {
    try {
      if (!withdrawalReason.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterOperationReason' }));
        return;
      }
      
      if (withdrawalActionType === 'freeze') {
       const res= await freezeWithdrawal({ userId: user.userId, remark: withdrawalReason });
       if(res.code==='0'&&res.data){
        message.success(intl.formatMessage({ id: 'userDetail.message.freezeWithdrawalSuccess' }));
        await getLog({current:1,pageSize:10})

       }else{
        message.error(res.message);
       }
      } else {
        const res= await unfreezeWithdrawal({ userId: user.userId, remark: withdrawalReason });
        if(res.code==='0'&&res.data){
          message.success(intl.formatMessage({ id: 'userDetail.message.unfreezeWithdrawalSuccess' }));
          await getLog({current:1,pageSize:10})

        }else{
          message.error(res.message);
        }
      }
      setWithdrawalModalVisible(false);
    } catch (error) {
      console.error(withdrawalActionType === 'freeze' ? 
        intl.formatMessage({ id: 'userDetail.message.freezeWithdrawalError' }) : 
        intl.formatMessage({ id: 'userDetail.message.unfreezeWithdrawalError' }), error);
      message.error(withdrawalActionType === 'freeze' ? 
        intl.formatMessage({ id: 'userDetail.message.freezeWithdrawalError' }) : 
        intl.formatMessage({ id: 'userDetail.message.unfreezeWithdrawalError' }));
    }
    await userDetailInfo();
  };

  // 处理修改手机号
  const handleUpdatePhone = async () => {
    try {
      if (!newPhone.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterNewPhone' }));
        return;
      }
      
      if (!googleCode.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterGoogleAuthCode' }));
        return;
      }

      if(!phoneRemark.trim()){
        message.error(intl.formatMessage({ id: 'userDetail.message.enterRemark' }));
        return;
      }
      
     const res= await updatePhone({ 
        userId: user.userId, 
        phone:user.phone,
        newPhone:newPhone,
        googleCode:googleCode,
        remark: phoneRemark 
      });
      if(res.code==='0'&&res.data){
        message.success(intl.formatMessage({ id: 'userDetail.message.updatePhoneSuccess' }));
        await getLog({current:1,pageSize:10})

      }else{
        message.error(res.message);
      }
      setPhoneModalVisible(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'userDetail.message.updatePhoneError' }));
    }
    await userDetailInfo();
  };

  // 处理修改邮箱
  const handleUpdateEmail = async () => {
    try {
      if (!newEmail.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterNewEmail' }));
        return;
      }
      
      if (!googleCode.trim()) {
        message.error(intl.formatMessage({ id: 'userDetail.message.enterGoogleAuthCode' }));
        return;
      }
      
      if(!emailRemark.trim()){
        message.error(intl.formatMessage({ id: 'userDetail.message.enterRemark' }));
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
        message.success(intl.formatMessage({ id: 'userDetail.message.updateEmailSuccess' }));
        await getLog({current:1,pageSize:10})

      }else{
        message.error(res.message);
      }
      setEmailModalVisible(false);
    } catch (error) {
      console.error(intl.formatMessage({ id: 'userDetail.message.updateEmailError' }), error);
      message.error(intl.formatMessage({ id: 'userDetail.message.updateEmailError' }));
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
    getCountryList();
    userDetailInfo();
    getKvInfo()
  },[userId]);
  return (
    <>
      <Card 
        title={intl.formatMessage({ id: 'userDetail.title' })} 
        extra={<a onClick={onClose}>{intl.formatMessage({ id: 'userDetail.return' })}</a>} 
        className="user-detail-card"
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.userId' })}>{user?.userId}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.nickname' })}>{user?.account}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.userStatus' })}>
            <Space>
            {user.status===1 ? intl.formatMessage({ id: 'userDetail.status.normal' }) : intl.formatMessage({ id: 'userDetail.status.frozen' })}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.withdrawalStatus' })}>
            <Space>
            {user.withdrawalStatus===1 ? intl.formatMessage({ id: 'userDetail.status.normal' }) : intl.formatMessage({ id: 'userDetail.status.frozen' })}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.transactionStatus' })}>
            <Space>
            {user.transactionStatus===1 ? intl.formatMessage({ id: 'userDetail.status.normal' }) : intl.formatMessage({ id: 'userDetail.status.frozen' })}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.phoneNumber' })}>
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
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.name' })}>
            {user.surname} {user.firstName}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.registrationTime' })}>{dayjs(user.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.email' })}>
            {user.email}
            {
              user.email ? (
                <Button 
                  type="link" 
                  onClick={showUpdateEmailModal} 
                  style={{ marginLeft: '8px' }}
                >
                  
                  {intl.formatMessage({ id: 'userDetail.action.edit' })}
                </Button>
              ) : ''
            }
     
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.realNameVerification' })}>{user.realnessStatus===1 ? intl.formatMessage({ id: 'userDetail.verification.verified' }) : intl.formatMessage({ id: 'userDetail.verification.unverified' })}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.idNumber' })}>{user.cardCode || intl.formatMessage({ id: 'userDetail.idNumber.none' })}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'userDetail.actions' })}>
            {/* 登录状态操作按钮 */}
            {user.status === 1 ? (
              <Button 
                type="primary" 
                danger 
                style={{marginRight: '10px'}} 
                onClick={() => showLoginModal('freeze')}
              >
                {intl.formatMessage({ id: 'userDetail.action.freezeLogin' })}
              </Button>
            ) : (
              <Button 
                type="primary"
                style={{marginRight: '10px'}} 
                onClick={() => showLoginModal('unfreeze')}
              >
                {intl.formatMessage({ id: 'userDetail.action.unfreezeLogin' })}
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
                {intl.formatMessage({ id: 'userDetail.action.freezeTransaction' })}
              </Button>
            ) : (
              <Button 
                type="primary"
                style={{marginRight: '10px'}} 
                onClick={() => showTransactionModal('unfreeze')}
              >
                {intl.formatMessage({ id: 'userDetail.action.unfreezeTransaction' })}
              </Button>
            )}
            
            {/* 提现状态操作按钮 */}
            {user.withdrawalStatus === 1 ? (
              <Button 
                type="primary" 
                danger 
                onClick={() => showWithdrawalModal('freeze')}
              >
                {intl.formatMessage({ id: 'userDetail.action.freezeWithdrawal' })}
              </Button>
            ) : (
              <Button 
                type="primary"
                onClick={() => showWithdrawalModal('unfreeze')}
              >
                {intl.formatMessage({ id: 'userDetail.action.unfreezeWithdrawal' })}
              </Button>
            )}
            {user.googleKey && (
              <Button 
                type="primary" 
                style={{marginLeft: '10px'}} 
                onClick={showUnbindGoogleModal}
              >
                {intl.formatMessage({ id: 'userDetail.action.unbindGoogleAuth' })}
              </Button>
            )}
          </Descriptions.Item>
        </Descriptions>
        <Tabs>
        <Tabs.TabPane tab={intl.formatMessage({ id: 'userDetail.tab.assets' })} key="1">
          <Asset userId={userId} />
        </Tabs.TabPane>
          <Tabs.TabPane tab={intl.formatMessage({ id: 'userDetail.tab.transactions' })} key="2">
            <UserTransaction userId={userId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={intl.formatMessage({ id: 'userDetail.tab.reconciliation' })} key="3">
            <Reconciliation userId={userId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={intl.formatMessage({ id: 'userDetail.tab.logs' })} key="4">
            <Log userId={userId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={intl.formatMessage({ id: 'userDetail.tab.operationLogs' })} key="5">
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
        title={loginActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.confirmFreezeLogin' }) : 
          intl.formatMessage({ id: 'userDetail.modal.confirmUnfreezeLogin' })}
        open={loginModalVisible}
        onOk={handleLoginAction}
        onCancel={() => setLoginModalVisible(false)}
        okText={intl.formatMessage({ id: 'userDetail.button.confirm' })}
        cancelText={intl.formatMessage({ id: 'userDetail.button.cancel' })}
        okButtonProps={{ disabled: !loginReason.trim() }}
      >
        <p>{loginActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.confirmFreezeLoginText' }, { account: user.account, userId: user.userId }) : 
          intl.formatMessage({ id: 'userDetail.modal.confirmUnfreezeLoginText' }, { account: user.account, userId: user.userId })}</p>
        <p>{loginActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.freezeLoginDescription' }) : 
          intl.formatMessage({ id: 'userDetail.modal.unfreezeLoginDescription' })}</p>
        <Form layout="vertical">
          <Form.Item label={loginActionType === 'freeze' ? 
            intl.formatMessage({ id: 'userDetail.form.freezeReason' }) : 
            intl.formatMessage({ id: 'userDetail.form.unfreezeReason' })} required>
            <TextArea
              placeholder={loginActionType === 'freeze' ? 
                intl.formatMessage({ id: 'userDetail.placeholder.enterFreezeReason' }) : 
                intl.formatMessage({ id: 'userDetail.placeholder.enterUnfreezeReason' })}
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
        title={transactionActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.confirmFreezeTransaction' }) : 
          intl.formatMessage({ id: 'userDetail.modal.confirmUnfreezeTransaction' })}
        open={transactionModalVisible}
        onOk={handleTransactionAction}
        onCancel={() => setTransactionModalVisible(false)}
        okText={intl.formatMessage({ id: 'userDetail.button.confirm' })}
        cancelText={intl.formatMessage({ id: 'userDetail.button.cancel' })}
        okButtonProps={{ disabled: !transactionReason.trim() }}
      >
        <p>{transactionActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.confirmFreezeTransactionText' }, { account: user.account, userId: user.userId }) : 
          intl.formatMessage({ id: 'userDetail.modal.confirmUnfreezeTransactionText' }, { account: user.account, userId: user.userId })}</p>
        <p>{transactionActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.freezeTransactionDescription' }) : 
          intl.formatMessage({ id: 'userDetail.modal.unfreezeTransactionDescription' })}</p>
        <Form layout="vertical">
          <Form.Item label={transactionActionType === 'freeze' ? 
            intl.formatMessage({ id: 'userDetail.form.freezeReason' }) : 
            intl.formatMessage({ id: 'userDetail.form.unfreezeReason' })} required>
            <TextArea
              placeholder={transactionActionType === 'freeze' ? 
                intl.formatMessage({ id: 'userDetail.placeholder.enterFreezeReason' }) : 
                intl.formatMessage({ id: 'userDetail.placeholder.enterUnfreezeReason' })}
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
        title={withdrawalActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.confirmFreezeWithdrawal' }) : 
          intl.formatMessage({ id: 'userDetail.modal.confirmUnfreezeWithdrawal' })}
        open={withdrawalModalVisible}
        onOk={handleWithdrawalAction}
        onCancel={() => setWithdrawalModalVisible(false)}
        okText={intl.formatMessage({ id: 'userDetail.button.confirm' })}
        cancelText={intl.formatMessage({ id: 'userDetail.button.cancel' })}
        okButtonProps={{ disabled: !withdrawalReason.trim() }}
      >
        <p>{withdrawalActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.confirmFreezeWithdrawalText' }, { account: user.account, userId: user.userId }) : 
          intl.formatMessage({ id: 'userDetail.modal.confirmUnfreezeWithdrawalText' }, { account: user.account, userId: user.userId })}</p>
        <p>{withdrawalActionType === 'freeze' ? 
          intl.formatMessage({ id: 'userDetail.modal.freezeWithdrawalDescription' }) : 
          intl.formatMessage({ id: 'userDetail.modal.unfreezeWithdrawalDescription' })}</p>
        <Form layout="vertical">
          <Form.Item label={withdrawalActionType === 'freeze' ? 
            intl.formatMessage({ id: 'userDetail.form.freezeReason' }) : 
            intl.formatMessage({ id: 'userDetail.form.unfreezeReason' })} required>
            <TextArea
              placeholder={withdrawalActionType === 'freeze' ? 
                intl.formatMessage({ id: 'userDetail.placeholder.enterFreezeReason' }) : 
                intl.formatMessage({ id: 'userDetail.placeholder.enterUnfreezeReason' })}
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
        title={intl.formatMessage({ id: 'userDetail.modal.updatePhone' })}
        open={phoneModalVisible}
        onOk={handleUpdatePhone}
        onCancel={() => setPhoneModalVisible(false)}
        okText={intl.formatMessage({ id: 'userDetail.button.submit' })}
        cancelText={intl.formatMessage({ id: 'userDetail.button.cancel' })}
      >
        <p style={{ color: '#ff4d4f', marginBottom: '24px' }}>
          {intl.formatMessage({ id: 'userDetail.modal.updatePhoneWarning' }, { time })}
        </p>
        <Form layout="vertical">
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.oldPhone' })}
            required
            style={{ marginBottom: '16px' }}
          >
            <Input value={user?.phone} disabled />
          </Form.Item>
          
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.newPhone' })}
            required
            style={{ marginBottom: '16px' }}
          >
            <Input.Group compact>
              <Select 
                style={{ width: '30%' }} 
                value={countryCode}
                onChange={setCountryCode}
              >
                {countryList.map((item:any)=>(
                  <Option key={item.id} value={item.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.countryName}</span>
                      <span>+{item.areaCode}</span>
                    </div>
                  </Option>
                ))}
              </Select>
              <Input 
                style={{ width: '70%' }} 
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterNewPhone' })}
              />
            </Input.Group>
          </Form.Item>
          
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.googleAuthCode' })}
            required
            style={{ marginBottom: '16px' }}
          >
            {
              currentUser?.employeeResp?.googleCode===false && (
                <Button type="link" onClick={getGoogleCode}>{intl.formatMessage({ id: 'userDetail.button.bindGoogleAuth' })}</Button>
              )
            }
            {
              currentUser?.employeeResp?.googleCode===true && (
                <Input 
                  value={googleCode}
                  onChange={(e) => setGoogleCode(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterGoogleAuthCode' })}
                />
              )
            }
          </Form.Item>
          
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.remark' })}
            style={{ marginBottom: '8px' }}
            required
          >
            <TextArea
              placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterRemark' })}
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
        title={intl.formatMessage({ id: 'userDetail.modal.updateEmail' })}
        open={emailModalVisible}
        onOk={handleUpdateEmail}
        onCancel={() => setEmailModalVisible(false)}
        okText={intl.formatMessage({ id: 'userDetail.button.submit' })}
        cancelText={intl.formatMessage({ id: 'userDetail.button.cancel' })}
      >
        <p style={{ color: '#ff4d4f', marginBottom: '24px' }}>
          {intl.formatMessage({ id: 'userDetail.modal.updateEmailWarning' }, { time })}
        </p>
        <Form layout="vertical">
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.oldEmail' })}
            required
            style={{ marginBottom: '16px' }}
          >
            <Input value={user?.email} disabled />
          </Form.Item>
          
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.newEmail' })}
            required
            style={{ marginBottom: '16px' }}
          >
            <Input 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterNewEmail' })}
            />
          </Form.Item>
          
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.googleAuthCode' })}
            required
            style={{ marginBottom: '16px' }}
            
          >
            {
              currentUser?.employeeResp?.googleCode===false && (
                <Button type="link" onClick={getGoogleCode}>{intl.formatMessage({ id: 'userDetail.button.bindGoogleAuth' })}</Button>
              )
            }
            {
              currentUser?.employeeResp?.googleCode===true && (
                <Input 
                  value={googleCode}
                  onChange={(e) => setGoogleCode(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterGoogleAuthCode' })}
                />
              )
            }
          </Form.Item>
          
          <Form.Item 
            label={intl.formatMessage({ id: 'userDetail.form.remark' })}
            style={{ marginBottom: '8px' }}
            required
          >
            <TextArea
              placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterRemark' })}
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
        title={intl.formatMessage({ id: 'userDetail.modal.unbindGoogleAuth' })}
        open={unbindGoogleModalVisible}
        onOk={handleUnbindGoogleCode}
        onCancel={() => setUnbindGoogleModalVisible(false)}
        okText={intl.formatMessage({ id: 'userDetail.button.confirm' })}
        cancelText={intl.formatMessage({ id: 'userDetail.button.cancel' })}
        okButtonProps={{ disabled: !unbindGoogleReason.trim() }}
      >
        <p style={{ marginBottom: '20px' }}>{intl.formatMessage({ id: 'userDetail.modal.unbindGoogleAuthDescription' })}</p>
        <Form layout="vertical">
          <Form.Item>
            <TextArea
              placeholder={intl.formatMessage({ id: 'userDetail.placeholder.enterRemark' })}
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