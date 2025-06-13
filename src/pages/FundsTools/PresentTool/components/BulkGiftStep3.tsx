import { getCoinGiftImportStatus } from '@/services/ant-design-pro/fundsTools';
import { useIntl } from '@umijs/max';
import { Button, Image, message } from 'antd';
import React, { useEffect, useState } from 'react';
import failImg from './images/fail.svg';
import loadingImg from './images/loading.png';
import successImg from './images/success.png';
import styles from './styles/gift.module.less';

interface BulkGiftProps {
  type?: string;
  current: number;
  open: boolean;
  onPrevious: () => void;
  onCancel: () => void;
}
interface checkDataType {
  total: number;
  errorTotal: number;
  successTotal: number;
  successList: {
    coinName: string;
    count: number;
    amount: string;
  }[];
  errorList: string[];
  batchId: string;
}
const BulkGiftSetp3: React.FC<BulkGiftProps> = ({ current, onPrevious, onCancel, open }) => {
  const intl = useIntl();
  const [checkData, setCheckData] = useState<checkDataType>({} as checkDataType);
  const [status, setStatus] = useState<'loading' | 'startLoading' | 'success' | 'error'>(
    'startLoading',
  );
  const [pollingTimer, setPollingTimer] = useState<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);

  const handleOk = () => {
    // 清除定时器
    if (pollingTimer) {
      clearTimeout(pollingTimer);
      setPollingTimer(null);
    }
    onCancel();
  };
  const getImportStatus = async (data: checkDataType) => {
    // 清除之前的定时器
    if (pollingTimer) {
      clearTimeout(pollingTimer);
      setPollingTimer(null);
    }

    const batchId =
      data.batchId ||
      checkData?.batchId ||
      JSON.parse(sessionStorage.getItem('checkData') || '{}')?.batchId;

    // 如果是第一次请求，记录开始时间
    if (startTime === null) {
      setStartTime(Date.now());
    }

    // 检查是否超过10秒仍未进入processing状态
    const currentTime = Date.now();
    if (
      startTime &&
      processingStartTime === null &&
      currentTime - startTime > 10000 &&
      status === 'startLoading'
    ) {
      setStatus('error');
      message.error(
        intl.formatMessage({ id: 'presentTool.steps.bulkGift.failed2' }) +
          ' - ' +
          intl.formatMessage({ id: 'presentTool.steps.bulkGift.failed3' }),
      );
      return;
    }

    // 检查是否在processing状态超过3分钟
    if (processingStartTime && currentTime - processingStartTime > 3 * 60 * 1000) {
      // 超过3分钟仍未完成，停止轮询但保持loading状态
      message.info(
        intl.formatMessage({ id: 'presentTool.steps.bulkGift.processing' }) +
          ' - ' +
          intl.formatMessage({ id: 'presentTool.steps.bulkGift.failed4' }),
      );
      return;
    }

    try {
      const res = await getCoinGiftImportStatus({ batchId: batchId });
      if (res.code === '0') {
        if (res.data.status === 'completed') {
          setStatus('success');
          // 重置计时器
          setStartTime(null);
          setProcessingStartTime(null);
        } else if (res.data.status === 'processing') {
          setStatus('loading');
          // 如果首次进入processing状态，记录时间
          if (processingStartTime === null) {
            setProcessingStartTime(Date.now());
          }
          // 2秒后重新请求
          const timer = setTimeout(() => getImportStatus(data), 2000);
          setPollingTimer(timer);
        } else if (res.data.status === 'not_found') {
          setStatus('startLoading');
          // 2秒后重新请求
          const timer = setTimeout(() => getImportStatus(data), 2000);
          setPollingTimer(timer);
        } else if (res.data.status === 'failed') {
          setStatus('error');
          message.error(
            res.data.message || intl.formatMessage({ id: 'presentTool.steps.bulkGift.failed2' }),
          );
          // 重置计时器
          setStartTime(null);
          setProcessingStartTime(null);
        }
      } else {
        setStatus('error');
        message.error(res.message);
        // 重置计时器
        setStartTime(null);
        setProcessingStartTime(null);
      }
    } catch (error) {
      setStatus('error');
      message.error(String(error));
      // 重置计时器
      setStartTime(null);
      setProcessingStartTime(null);
    }
  };
  const getInfo = () => {
    const data = sessionStorage.getItem('checkData');
    const checkData = JSON.parse(data || '{}');
    setCheckData(checkData);
    getImportStatus(checkData);
  };
  // 监听current变化，当current为2时开始轮询
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (current === 2) {
      getInfo();
    } else {
      // 当current不为2时，清除定时器
      if (pollingTimer) {
        clearTimeout(pollingTimer);
        setPollingTimer(null);
      }
    }
    if (!open) {
      if (pollingTimer) {
        clearTimeout(pollingTimer);
        setPollingTimer(null);
      }
    }
    // 组件卸载时清除定时器
    return () => {
      if (pollingTimer) {
        clearTimeout(pollingTimer);
        setPollingTimer(null);
      }
    };
  }, [current, open]);

  // 确保在组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (pollingTimer) {
        clearTimeout(pollingTimer);
        setPollingTimer(null);
      }
    };
  }, []);
  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      {status === 'startLoading' && (
        <div>
          <div className={styles.rotating}>
            <Image src={loadingImg} alt="" width={100} height={100} preview={false} />
          </div>
          <p className={`${styles.loading_p} ${styles.mt_20} `}>
            {/* 赠币开始处理，请稍等... */}
            {intl.formatMessage({ id: 'presentTool.steps.bulkGift.notFound' })}
          </p>
        </div>
      )}
      {status === 'loading' && (
        <div>
          <div className={styles.rotating}>
            <Image src={loadingImg} alt="" width={100} height={100} preview={false} />
          </div>
          <p className={`${styles.loading_p} ${styles.mt_20} `}>
            {/* 赠币处理中，请稍等几分钟。 */}
            {intl.formatMessage({ id: 'presentTool.steps.bulkGift.loading' })}
          </p>
        </div>
      )}
      {(status === 'success' || status === 'error') && (
        <>
          <div>
            <div>
              <Image
                src={status === 'success' ? successImg : failImg}
                alt=""
                width={100}
                height={100}
                preview={false}
              />
            </div>
            <p className={`${styles.loading_p} ${styles.mt_20} `}>
              {status === 'success'
                ? intl.formatMessage({ id: 'presentTool.steps.bulkGift.success2' })
                : intl.formatMessage({ id: 'presentTool.steps.bulkGift.failed2' })}
            </p>
          </div>
          <div className={styles.button_box}>
            <div>
              <Button key="cancel" onClick={onPrevious} style={{ marginRight: 10 }}>
                {intl.formatMessage({ id: 'presentTool.button.previous' })}
              </Button>
              <Button
                key="next"
                type={'primary'}
                onClick={handleOk}
                // disabled={!steps1NextFlag || !steps2NextFlag}
              >
                {intl.formatMessage({ id: 'transferTool.form.button.confirm' })}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkGiftSetp3;
