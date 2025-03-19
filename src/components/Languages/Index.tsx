import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
interface LanguageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  // 处理语言选择变化
  const handleLanguageChange = (e: RadioChangeEvent) => {
    onChange?.(e.target.value);
  };
 const languages = [
    { "key": "en_US", "label": "English" },
    { "key": "zh_CN", "label": "简体中文" },
    { "key": "zh_TW", "label": "繁體中文" },
    { "key": "ja_JP", "label": "日本語" },
    { "key": "ko_KR", "label": "한국어"}
]
  return (
      <div>

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
      </div>

  );
};

export default LanguageSelector;