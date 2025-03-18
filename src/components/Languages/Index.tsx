import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { languages } from '@/config/language';
interface LanguageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  // 处理语言选择变化
  const handleLanguageChange = (e: RadioChangeEvent) => {
    onChange?.(e.target.value);
  };

  return (
    <>
    {console.log(value)}
      <Radio.Group value={value} onChange={handleLanguageChange}>
        {languages.map((lang:any) => (
          <Radio.Button key={lang.key} value={lang.key}>
            {lang.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <div style={{ marginBottom: '8px', color: '#999', fontSize: '12px', marginTop: '4px' }}>
        *支持多个语言编辑，英文为必填，其他语言配置则显示，不配置不显示
      </div>
    </>
  );
};

export default LanguageSelector;