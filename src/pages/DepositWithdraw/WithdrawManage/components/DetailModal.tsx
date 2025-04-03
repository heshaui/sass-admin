import React, { useState, useEffect } from 'react';
import { Modal, Tag, Tabs, Table, Radio,Input,Button,message } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { fetchWithdrawDepositDetail,updateWithdrawDeposit } from '@/services/ant-design-pro/depositWithdraw';
import OperaLog from './OperaLog';
import RiskLog from './RiskLog';
interface WithdrawRecord {
  key: string;
  withdrawalId: string;
  userId: string;
  coinType: string;
  network: string;
  amount: number;
  fee: number;
  actualAmount: number;
  minerFee: string;
  address: string;
  txId: string;
  riskLevel: number;
  riskDesc: string;
  status: string;
  withdrawTime: string;
}

interface RiskLogRecord {
  triggerType: string;
  triggerReason: string;
  triggerRiskLevel: number;
  suggestion: string;
  triggerTime: string;
}

interface DetailModalProps {
  visible: boolean;
  record: WithdrawRecord | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, record, onClose }) => {
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<WithdrawRecord | null>(null);
  const [riskLogs, setRiskLogs] = useState<RiskLogRecord[]>([]);
  const [processingMethod, setProcessingMethod] = useState<string>('wallet');
  const [checkStatus, setCheckStatus] = useState<string>('2');
  const [txId, setTxId] = useState<string>('');
  const [remark, setRemark] = useState<string>('');

  // 获取详情数据
  const fetchDetailData = async (orderId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetchWithdrawDepositDetail({ withdrawalId:orderId });
      if (res.code === '0') {
        setDetailData(res.data.detail || record);
        setRiskLogs(res.data.riskLogs || []);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  // 风控日志表格列
  const riskLogColumns = [
    { title: '触发类型', dataIndex: 'triggerType', key: 'triggerType' },
    { title: '触发原因', dataIndex: 'triggerReason', key: 'triggerReason' },
    { title: '触发后风控等级', dataIndex: 'triggerRiskLevel', key: 'triggerRiskLevel' },
    { title: '处理建议', dataIndex: 'suggestion', key: 'suggestion' },
    { title: '触发时间', dataIndex: 'triggerTime', key: 'triggerTime' },
  ];

  const currentRecord = detailData || record;

const handleUpdate = async () => {

    const res = await updateWithdrawDeposit({ withdrawalId: currentRecord.withdrawalId, txHash: txId, status: checkStatus, remark: remark});
    if (res.code === '0') {
      message.success('更新成功');
      onClose();
    }else{
      message.error('更新失败');
    }

}


  useEffect(() => {
    if (visible && record) {
      fetchDetailData(record.withdrawalId);
    }
  }, [visible, record]);

  return (
    <Modal
      title="提现详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      {currentRecord && (
        <>
          <ProDescriptions
            title="提现详情"
            loading={detailLoading}
            column={2}
            dataSource={currentRecord}
          >
            <ProDescriptions.Item label="提现单号" span={1}>{currentRecord.orderNo}</ProDescriptions.Item>
            <ProDescriptions.Item label="UID" span={1}>{currentRecord.userId}</ProDescriptions.Item>
            <ProDescriptions.Item label="风控等级" span={1}>{currentRecord.riskLevel}</ProDescriptions.Item>
            <ProDescriptions.Item label="提现金额" span={1}>{currentRecord.amount} {currentRecord.coinType}</ProDescriptions.Item>
            <ProDescriptions.Item label="手续费" span={1}>{currentRecord.fee} {currentRecord.coinType}</ProDescriptions.Item>
            <ProDescriptions.Item label="应到金额" span={1}>{currentRecord.actualAmount} {currentRecord.coinType}</ProDescriptions.Item>
            <ProDescriptions.Item label="提币协议" span={1}>{currentRecord.protocolName}</ProDescriptions.Item>
            <ProDescriptions.Item label="收款地址" span={1}>{currentRecord.fromAddress}</ProDescriptions.Item>
            <ProDescriptions.Item label="审核状态" span={1}>
              <Tag color={
                currentRecord.status === 3 || currentRecord.status === '3' ? 'red' : 
                currentRecord.status === 2 || currentRecord.status === '2' ? 'green' : 
                currentRecord.status === 4 || currentRecord.status === '4' ? 'gray' : 'blue'
              }>
                {
                  currentRecord.status === 0 || currentRecord.status === '0' ? '创建' :
                  currentRecord.status === 1 || currentRecord.status === '1' ? '待审核' :
                  currentRecord.status === 2 || currentRecord.status === '2' ? '完成' :
                  currentRecord.status === 3 || currentRecord.status === '3' ? '拒绝' :
                  currentRecord.status === 4 || currentRecord.status === '4' ? '用户撤销' : '未知状态'
                }
              </Tag>
            </ProDescriptions.Item>
            {
              currentRecord.status === 1 && (
                <ProDescriptions.Item label="审核结果" span={1}>
                  <Radio.Group 
                value={checkStatus} 
                onChange={(e) => setCheckStatus(e.target.value)}
              >
                <Radio value="2">通过</Radio>
                <Radio value="3">拒绝</Radio>
              </Radio.Group>
            </ProDescriptions.Item>
            )
            }
              
            <ProDescriptions.Item label="处理方式" span={1}>
              {/* <Radio.Group 
                value={processingMethod} 
                onChange={(e) => setProcessingMethod(e.target.value)}
              >
                <Radio value="wallet">钱包处理</Radio>
                <Radio value="manual">人工处理</Radio>
              </Radio.Group> */}
              <div>
              人工处理
              </div>
            </ProDescriptions.Item>
            {
              currentRecord.status === 1 && (
                <>
                <ProDescriptions.Item label="TXID" span={1} ><Input/></ProDescriptions.Item>
                <ProDescriptions.Item label="实际矿工费" span={1} ><Input/></ProDescriptions.Item>
                <ProDescriptions.Item label="审核备注" span={1}><Input/></ProDescriptions.Item>
                </>
              )
            }
          </ProDescriptions>
          {
            currentRecord.status === 1 && (
              <>
              <div style={{display: 'flex', justifyContent: 'center', gap: 10,marginTop: 20}}>
                <Button type="primary" onClick={handleUpdate}>提交</Button>
                <Button  onClick={onClose}>取消</Button>
              </div>
              </>
            )
          }

          <Tabs
            defaultActiveKey="riskLogs"
            items={[
              {
                key: 'riskLogs',
                label: '风控日志',
                children: <RiskLog userId={currentRecord.userId} />,
              },
              {
                key: 'operationLogs',
                label: '操作日志',
                children: <OperaLog userId={currentRecord.userId} />,
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

export default DetailModal; 