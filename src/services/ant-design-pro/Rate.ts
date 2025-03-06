import { request } from 'umi';

export async function queryRateList(data?: any) {
  return request('/tenant-admin/v1/exchangeRate/exchangeRateList', {
    method: 'POST',
    data,
  });
}

export async function addRate(params: any) {
  return request('/api/currency/add', {
    method: 'POST',
    data: params,
  });
}

export async function updateRate(params: any) {
  return request('/api/currency/update', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteRate(id: string) {
  return request(`/api/currency/delete/${id}`, {
    method: 'DELETE',
  });
}