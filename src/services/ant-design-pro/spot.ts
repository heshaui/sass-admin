import { request } from 'umi';

// 交易币种列表请求接口
export async function exchangeCoinList(params?: Record<string, any>) {
  return request('/tenant/v1/exchange-coin/exchangeCoinList', {
    method: 'POST',
    data: params,
  });
}

// 通过ID删除交易币种
export async function deleteExchangeCoinById(params: { id: string | number }) {
  return request('/tenant/v1/exchange-coin/deleteExchangeCoinById', {
    method: 'POST',
    data: params,
  });
}

// 获取交易币种参数
export async function exchangeCoinParams(params?: Record<string, any>) {
  return request('/tenant/v1/exchange-coin/exchangeCoinParams', {
    method: 'POST',
    data: params,
  });
}

// 保存交易币种信息
export async function saveExchangeCoin(params: Record<string, any>) {
  return request('/tenant/v1/exchange-coin/saveExchangeCoin', {
    method: 'POST',
    data: params,
  });
}

// 更新交易币种组
export async function updateExchangeGroup(params: Record<string, any>) {
  return request('/tenant/v1/exchange-coin/updateExchangeGroup', {
    method: 'POST',
    data: params,
  });
}

// 通过ID更新交易币种
export async function updateExchangeCoinById(params: Record<string, any>) {
  return request('/tenant/v1/exchange-coin/updateExchangeCoinById', {
    method: 'POST',
    data: params,
  });
}
// /tenant/v1/tenant-coin/tenantCurrencyCoinList
export async function tenantCurrencyCoinList(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin/tenantCurrencyCoinList', {
    method: 'POST',
    data: params,
  });
}
