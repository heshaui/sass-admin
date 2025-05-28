import React, { useState, useEffect } from 'react';
import { Modal, Tag, Tabs, Radio, Input, Button, message } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { fetchWithdrawDepositDetail, manualProcessing } from '@/services/ant-design-pro/depositWithdraw';
import { useIntl } from 'umi';
import OperaLog from './OperaLog';
import RiskLog from './RiskLog';

interface WithdrawRecord {
  orderNo: string;
  key: string;
  withdrawalId: string;
  userId: string;
  coinName: string;
  network: string;
  amount: number;
  fee: number;
  actualAmount: number;
  minerFee: string;
  address: string;
  toAddress: string; // Address field for receiving funds
  txId: string;
  riskLevel: number;
  riskDesc: string;
  status: string | number; // Handle both string and number types
  withdrawTime: string;
  protocolName: string;
  fromAddress: string;
}

interface DetailModalProps {
  visible: boolean;
  record: WithdrawRecord | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, record, onClose }) => {
  const intl = useIntl();
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<WithdrawRecord | null>(null);
  const [checkStatus, setCheckStatus] = useState<string>('2');
  const [txId, setTxId] = useState<string>('');
  const [remark, setRemark] = useState<string>('');
  const [realityFee, setRealityFee] = useState<string>('');
  
  // Fetch detail data
  const fetchDetailData = async (orderId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetchWithdrawDepositDetail({ withdrawalId: orderId });
      if (res.code === '0') {
        setDetailData(res.data.detail || record);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const currentRecord = detailData || record;

  const handleUpdate = async () => {
    // Validate required fields
    if (!txId) {
      message.error(intl.formatMessage({ id: 'withdraw.message.txIdRequired' }));
      return;
    }
    
    if (!realityFee) {
      message.error(intl.formatMessage({ id: 'withdraw.message.minerFeeRequired' }));
      return;
    }

    if (!currentRecord) {
      message.error(intl.formatMessage({ id: 'withdraw.message.noRecordSelected' }));
      return;
    }

    const res = await manualProcessing({ 
      withdrawalId: currentRecord?.withdrawalId || '', 
      txHash: txId, 
      status: checkStatus, 
      remark: remark,
      realityFee: realityFee
    });
    
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'withdraw.message.processSuccess' }));
      onClose();
    } else {
      message.error(intl.formatMessage({ id: 'withdraw.message.processFailed' }));
    }
  };


  useEffect(() => {
    if (visible && record) {
      fetchDetailData(record.withdrawalId);
    }
  }, [visible, record]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      {currentRecord && (
        <>
          <ProDescriptions
            title={currentRecord.status !== 1 ?
              intl.formatMessage({ id: 'withdraw.modal.title.details' }) :
              intl.formatMessage({ id: 'withdraw.modal.title.review' })
            }
            loading={detailLoading}
            column={2}
            dataSource={currentRecord}
          >
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.withdrawId' })} span={1}>{currentRecord.orderNo}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.userId' })} span={1}>{currentRecord.userId}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.riskLevel' })} span={1}>{currentRecord.riskLevel}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.amount' })} span={1}>{currentRecord.amount} {currentRecord.coinName}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.fee' })} span={1}>{currentRecord.fee} {currentRecord.coinName}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.actualAmount' })} span={1}>{currentRecord.actualAmount} {currentRecord.actualAmount ? currentRecord.coinName : ''}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.protocol' })} span={1}>{currentRecord.protocolName}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.receivingAddress' })} span={1}>{currentRecord.toAddress || currentRecord.address}</ProDescriptions.Item>
            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.reviewStatus' })} span={1}>
              <Tag color={
                currentRecord.status === 3 || currentRecord.status === '3' ? 'red' :
                currentRecord.status === 2 || currentRecord.status === '2' ? 'green' :
                currentRecord.status === 4 || currentRecord.status === '4' ? 'gray' : 'blue'
              }>
                {
                  currentRecord.status === 0 || currentRecord.status === '0' ? intl.formatMessage({ id: 'withdraw.status.created' }) :
                  currentRecord.status === 1 || currentRecord.status === '1' ? intl.formatMessage({ id: 'withdraw.status.pending' }) :
                  currentRecord.status === 2 || currentRecord.status === '2' ? intl.formatMessage({ id: 'withdraw.status.completed' }) :
                  currentRecord.status === 3 || currentRecord.status === '3' ? intl.formatMessage({ id: 'withdraw.status.rejected' }) :
                  currentRecord.status === 4 || currentRecord.status === '4' ? intl.formatMessage({ id: 'withdraw.status.userCancelled' }) :
                  intl.formatMessage({ id: 'withdraw.status.unknown' })
                }
              </Tag>
            </ProDescriptions.Item>

            {(currentRecord.status === 1 || currentRecord.status === '1') && (
              <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.reviewResult' })} span={1}>
                <Radio.Group
                  value={checkStatus}
                  onChange={(e) => setCheckStatus(e.target.value)}
                >
                  <Radio value="2">{intl.formatMessage({ id: 'withdraw.modal.option.approve' })}</Radio>
                  <Radio value="3">{intl.formatMessage({ id: 'withdraw.modal.option.reject' })}</Radio>
                </Radio.Group>
              </ProDescriptions.Item>
            )}

            <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.processingMethod' })} span={1}>
              <div>
                {intl.formatMessage({ id: 'withdraw.modal.option.manualProcessing' })}
              </div>
            </ProDescriptions.Item>

            {(currentRecord.status === 1 || currentRecord.status === '1') && (
              <>
                {checkStatus === '2' && (
                  <>
                    <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.txId' })} span={1}>
                      <Input
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        placeholder={intl.formatMessage({ id: 'withdraw.modal.placeholder.txId' })}
                      />
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.actualMinerFee' })} span={1}>
                      <Input
                        value={realityFee}
                        onChange={(e) => setRealityFee(e.target.value)}
                        placeholder={intl.formatMessage({ id: 'withdraw.modal.placeholder.actualMinerFee' })}
                      />
                    </ProDescriptions.Item>
                  </>
                )}
                <ProDescriptions.Item label={intl.formatMessage({ id: 'withdraw.modal.label.remark' })} span={1}>
                  <Input
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'withdraw.modal.placeholder.remark' })}
                  />
                </ProDescriptions.Item>
              </>
            )}
          </ProDescriptions>

          {(currentRecord.status === 1 || currentRecord.status === '1') && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" onClick={handleUpdate}>
                {intl.formatMessage({ id: 'withdraw.button.confirm' })}
              </Button>
            </div>
          )}

          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={intl.formatMessage({ id: 'withdraw.tabs.operationLog' })} key="1">
              <OperaLog userId={currentRecord.userId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={intl.formatMessage({ id: 'withdraw.tabs.riskLog' })} key="2">
              <RiskLog userId={currentRecord.userId} />
            </Tabs.TabPane>
          </Tabs>
        </>
      )}
    </Modal>
  );
};

export default DetailModal; 