import { getCoinGiftConfirmImport } from '@/services/ant-design-pro/fundsTools';
import { useIntl } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './styles/gift.module.less';
interface BulkGiftProps {
  type?: string;
  current: number;
  onPrevious: () => void;
  onNext: () => void;
}
interface checkDataType {
  total: number;
  errorTotal: number;
  successTotal: number;
  successList: { [key: string]: { coinName: string; count: number; amount: string } };
  errorList: string[];
  batchId: string;
}
const BulkGiftSetp2: React.FC<BulkGiftProps> = ({ current, onPrevious, onNext }) => {
  const intl = useIntl();
  const [steps2NextFlag, setSteps2NextFlag] = useState(false);
  const [checkData, setCheckData] = useState<checkDataType>({} as checkDataType);
  const [nextLoading, setNextLoading] = useState(false);

  // const handleNext = () => {
  //   if(!steps2NextFlag) return;
  //   onNext();
  // }
  const getInfo = () => {
    const data = sessionStorage.getItem('checkData');
    const checkData = JSON.parse(data || '{}');
    setCheckData(checkData);
    // 是否有异常数据和异常提示
    if (checkData?.errorList?.length > 0 || checkData?.errorTotal?.length > 0) {
      setSteps2NextFlag(false);
    } else {
      setSteps2NextFlag(true);
    }
  };
  const getCoinGiftConfirmData = async () => {
    const batchId =
      checkData?.batchId || JSON.parse(sessionStorage.getItem('checkData') || '{}')?.batchId;
    if (!batchId) return;
    setNextLoading(true);
    try {
      const res = await getCoinGiftConfirmImport({ batchId: batchId });
      if (res.code === '0') {
        onNext();
      }
    } catch (error) {
      message.error(String(error));
    } finally {
      setNextLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window === 'undefined' || current !== 1) return;
    getInfo();
  }, [current]);
  return (
    <div style={{ marginTop: '20px' }}>
      <ul>
        <li className={styles.check_box}>
          <span>正常数据：{checkData?.successTotal || 0}条</span>
          <span className={styles.mt_10}>赠币详情</span>
          <ul className={``} style={{ padding: 0 }}>
            {checkData?.successList
              ? Object.keys(checkData.successList).map((key: any, index: number) => (
                  <li key={`item-${index}`} className={styles.mt_10}>
                    {intl.formatMessage(
                      { id: 'presentTool.steps.bulkGift.count2' },
                      {
                        coinName: key || '--',
                        count: checkData.successList[key].count || '--',
                        coinAmount: checkData.successList[key].amount || '--',
                        // rateAmount: '--',
                        // rate: '--',
                      },
                    )}
                  </li>
                ))
              : '无'}
          </ul>
        </li>
        {/* <li className={styles.check_box}>
          <p>异常数据：2条</p>
          <p>赠币详情</p>
          <ul className={``} style={{ padding: 0 }}>
            <li>
              {intl.formatMessage(
                { id: 'presentTool.steps.bulkGift.count' },
                { coinName: 'BTC', count: 2, coinAmount: 100, rateAmount: 1000, rate: 'USD' },
              )}
            </li>
          </ul>
        </li> */}
        <li className={styles.check_box}>
          <span>异常提示</span>
          <ul className={styles.mt_tipList}>
            {checkData?.errorList && checkData?.errorList.length > 0 ? (
              checkData.errorList.map((item: any, index: number) => (
                <li key={`errorItem-${index}`} className={styles.mt_10}>
                  {item}
                </li>
              ))
            ) : (
              <span style={{ color: '#333' }}>无</span>
            )}
          </ul>
        </li>
      </ul>
      <div className={styles.button_box}>
        <div>
          <Button key="cancel" onClick={onPrevious} style={{ marginRight: 10 }}>
            {intl.formatMessage({ id: 'presentTool.button.previous' })}
          </Button>
          <Button
            key="next"
            type={'primary'}
            onClick={getCoinGiftConfirmData}
            disabled={!steps2NextFlag}
            loading={nextLoading}
          >
            {intl.formatMessage({ id: 'presentTool.button.next' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkGiftSetp2;
