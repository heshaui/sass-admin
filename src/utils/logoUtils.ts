import { getTenantKeyParams } from '@/services/ant-design-pro/kv';

// Default logo to use if API call fails
const DEFAULT_LOGO = 'https://meta2025.oss-ap-northeast-2.aliyuncs.com/2025/05/21/19f97328-dada-444a-9f0c-5df7889328a3.png';

/**
 * Fetches the logo URL from the API
 * @returns Promise with the logo URL
 */
export const fetchLogoUrl = async (): Promise<string> => {
  try {
    const data = {
      key: 'logo'
    };
    const res = await getTenantKeyParams(data);
    
    if (res.code === '0' && res.data) {
      const keyData = JSON.parse(res.data.keyValue);
      // Use dark mode header logo by default
      return keyData.dark?.headerLogo || DEFAULT_LOGO;
    }
    return DEFAULT_LOGO;
  } catch (error) {
    console.error('Failed to fetch logo:', error);
    return DEFAULT_LOGO;
  }
};
