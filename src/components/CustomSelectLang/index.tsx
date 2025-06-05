import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';
import { setLocale, getLocale } from '@umijs/max';

interface CustomSelectLangProps {
  type: number;
}
export const CustomSelectLang: React.FC<CustomSelectLangProps> = ({ type }) => {
  const currentLocale = getLocale();

  const changeLang = (locale: string) => {
    setLocale(locale);
  };

  const items: MenuProps['items'] = [
    {
      key: 'en-US',
      label: (
        <span onClick={() => changeLang('en-US')}>
          <span style={{ marginRight: 8 }}>🇺🇸</span>
          English
        </span>
      ),
    },
    {
      key: 'ko-KR',
      label: (
        <span onClick={() => changeLang('ko-KR')}>
          <span style={{ marginRight: 8 }}>🇰🇷</span>
          한국어
        </span>
      ),
    },
    {
      key: 'zh-CN',
      label: (
        <span onClick={() => changeLang('zh-CN')}>
          <span style={{ marginRight: 8 }}>🇨🇳</span>
          简体中文
        </span>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <span style={{ cursor: 'pointer', padding: '0 12px' }}>
        {type?<img src="/language.png" alt="language" style={{ height: 20 }} />:<img src="/lang.png" alt="language" style={{ height: 20 }} />}
      </span>
    </Dropdown>
  );
};

export default CustomSelectLang;
