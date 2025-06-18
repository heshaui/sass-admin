import { request } from '@umijs/max';
const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';




export async function flashExchangeConfig(params: any) {
    return request('/tenant/v1/trade_convert/config', {
      method: 'POST',
      data: params,
    });
  }



export async function saveOrUpdateConfig(params: any) {
    return request('/tenant/v1/trade_convert/saveOrUpdateConfig', {
      method: 'POST',
      data: params,
    });
  }
    


export async function trade(params: any) {
    return request('/tenant/v1/trade_convert/trade', {
      method: 'POST',
      data: params,
    });
  }



export async function records(params: any) {
    return request(isAdmin? '/tenant-admin/v1/trade_convert/records':'/tenant/v1/trade_convert/records', {
      method: 'POST',
      data: params,
    });
  }
      
    
    