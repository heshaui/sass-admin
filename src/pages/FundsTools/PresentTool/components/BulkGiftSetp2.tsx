import { useIntl } from '@umijs/max';
import React from 'react';
import styles from './styles/gift.module.less';

interface BulkGiftProps {
  type?: string;
  setps1Next?: () => void;
}

const BulkGiftSetp1: React.FC<BulkGiftProps> = () => {
  const intl = useIntl();
  // const [form] = Form.useForm();
  // const [typeList, setTypeList] = useState<SelectProps['options']>([]);

  return (
    <div style={{ marginTop: '20px' }}>
      <ul>
        <li className={styles.check_box}>
          <p>正常数据：2条</p>
          <p>赠币详情</p>
          <ul className={``} style={{ padding: 0 }}>
            <li>
              {intl.formatMessage(
                { id: 'presentTool.steps.bulkGift.count' },
                { coinName: 'BTC', count: 2, coinAmount: 100, rateAmount: 1000, rate: 'USD' },
              )}
            </li>
          </ul>
        </li>
        <li className={styles.check_box}>
          <p>异常提示</p>
          <ul className={styles.mt_tipList}>
            <li>
              {intl.formatMessage(
                { id: 'presentTool.steps.bulkGift.count' },
                { coinName: 'BTC', count: 2, coinAmount: 100, rateAmount: 1000, rate: 'USD' },
              )}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default BulkGiftSetp1;
