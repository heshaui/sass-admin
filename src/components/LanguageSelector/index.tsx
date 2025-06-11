import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { tenantLangList } from '@/services/ant-design-pro/WebConfig';
import { useIntl } from '@umijs/max';

interface LanguageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  text?:string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange,text}) => {

  const intl = useIntl();
  const [languages, setLanguages] = useState<any[]>([]);
  useEffect(() => {
    const fetchLanguages = async () => {
      let data={
        pageNo:1,
        pageSize:10000
      }
      const res = await tenantLangList(data);
      if (res.code === '0') {
        setLanguages(res.data?.list || []);
      }
    };
    fetchLanguages();
  }, []);
  // 处理语言选择变化
  const handleLanguageChange = (e: RadioChangeEvent) => {
    onChange?.(e.target.value);
  };

const texts=text||intl.formatMessage({id:'helpCenter.serviceModal.form.languageNote'});
  return (
      <div>

      <Radio.Group value={value} onChange={handleLanguageChange}>
        {languages.map((lang:any) => (
          <Radio.Button key={lang.langEncode} value={lang.langEncode}>
            {lang.lang}
          </Radio.Button>
        ))}
      </Radio.Group>
      <div style={{ marginBottom: '8px', color: '#999', fontSize: '12px', marginTop: '4px' }}>
      *{texts}
      </div>
      </div>

  );
};

export default LanguageSelector;
