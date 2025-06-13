import { getCoinGiftImportStatus } from '@/services/ant-design-pro/fundsTools';
import { useIntl } from '@umijs/max';
import { Button, Image, message } from 'antd';
import React, { useEffect, useState } from 'react';
import loadingImg from './images/loading.png';
import styles from './styles/gift.module.less';

interface BulkGiftProps {
  current: number;
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
const BulkGiftSetp3: React.FC<BulkGiftProps> = ({ current, onPrevious, onCancel }) => {
  const intl = useIntl();
  const [checkData, setCheckData] = useState<checkDataType>({} as checkDataType);
  const [loading, setLoading] = useState(true);

  const handleOk = () => {
    onCancel();
  };
  const getImportStatus = async (data: checkDataType) => {
    const batchId =
      data.batchId ||
      checkData?.batchId ||
      JSON.parse(sessionStorage.getItem('checkData') || '{}')?.batchId;
    setLoading(true);
    try {
      const res = await getCoinGiftImportStatus({ batchId: batchId });
      if (res.code === '0') {
        setLoading(false);
        message.success('success');
      } else {
        setLoading(true);
        message.error(res.message);
      }
    } catch (error) {
      setLoading(true);
      message.error(String(error));
    }
  };
  const getInfo = () => {
    const data = sessionStorage.getItem('checkData');
    const checkData = JSON.parse(data || '{}');
    setCheckData(checkData);
    getImportStatus(checkData);
  };
  useEffect(() => {
    if (typeof window === 'undefined' || current !== 2) return;
    getInfo();
  }, [current]);
  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      {loading && (
        <div>
          <div className={styles.rotating}>
            <Image src={loadingImg} alt="" width={100} height={100} preview={false} />
          </div>
          <p className={`${styles.loading_p} ${styles.mt_20} `}>
            {/* 赠币处理中，请稍等几分钟。 */}
            {intl.formatMessage({ id: 'presentTool.steps.bulkGift.loading' })}
            {/* {intl.formatMessage({ id: 'presentTool.steps.bulkGift.success2' })} */}
          </p>
        </div>
      )}
      {!loading && (
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
              {intl.formatMessage({ id: 'presentTool.button.submit2' })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkGiftSetp3;
