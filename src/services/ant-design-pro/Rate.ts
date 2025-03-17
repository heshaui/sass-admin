import { request } from 'umi';

export async function queryRateList(data?: any) {
  return request('/tenant-admin/v1/exchangeRate/exchangeRateList', {
    method: 'POST',
    data,
  });
}

export async function queryTenantRateList(data?: any) {
  return request('/tenant/v1/tenantExchangeRateList', {
    method: 'POST',
    data,
  });
}


export async function updateRate(params: any) {
  return request('/tenant/v1/updateExchangeRate', {
    method: 'POST',
    data: params,
  });
}

export async function updateExchangeRateById(params: any) {
  return request('/tenant-admin/v1/exchangeRate/updateExchangeRateById', {
    method: 'POST',
    data: params,
  });
}
