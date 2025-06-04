import { getTenantKeyParams } from '@/services/ant-design-pro/kv';

// Default logo to use if API call fails
const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
const DEFAULT_LOGO = isAdmin ? '/index.png' : '';

/**
 * Fetches the logo URL from the API
 * @returns Promise with the logo URL
 */
export const fetchLogoUrl = async (): Promise<string> => {
  if(isAdmin){
    return DEFAULT_LOGO
  }
  try {
    const data = {
      key: 'logo'
    };
    const res = await getTenantKeyParams(data);
    
    if (res.code === '0' && res.data) {
      const keyData = JSON.parse(res.data.keyValue);
      // Use dark mode header logo by default
      return keyData.dark?.headerLogo || '';
    }
    return DEFAULT_LOGO;
  } catch (error) {
    console.error('Failed to fetch logo:', error);
    return DEFAULT_LOGO;
  }
};
