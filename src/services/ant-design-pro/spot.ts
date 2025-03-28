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


// 币种添加
export async function saveTenantCurrencyCoin(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin/saveTenantCurrencyCoin', {
    method: 'POST',
    data: params,
  });
}

// /tenant/v1/tenant-coin/tenantCurrencyCoinAll
export async function tenantCurrencyCoinAll(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin/tenantCurrencyCoinAll', {
    method: 'POST',
    data: params,
  });
}


//协议新增
export async function saveProtocolType(params?: Record<string, any>) {
  return request('/tenant-admin/v1/protocol-type/saveProtocolType', {
    method: 'POST',
    data: params,
  });
}


//协议查询详情
export async function protocolTypeParams(params?: Record<string, any>) {
  return request(`/tenant-admin/v1/protocol-type/protocolTypeParams?idString=${params.id}`, {
    method: 'POST',
    data: params,
  });
}


//协议修改
export async function updateProtocolTypeById(params?: Record<string, any>) {
  return request('/tenant-admin/v1/protocol-type/updateProtocolTypeById', {
    method: 'POST',
    data: params,
  });
}

//协议删除
export async function deleteProtocolTypeById(params?: Record<string, any>) {
  return request(`/tenant-admin/v1/protocol-type/deleteProtocolTypeById?idString=${params.id}`, {
    method: 'POST',
    data: params,
  });
}

//协议列表
export async function protocolTypeList(params?: Record<string, any>) {
  return request('/tenant-admin/v1/protocol-type/protocolTypeList', {
    method: 'POST',
    data: params,
  });
}


// 总后台币种新增
export async function saveCurrencyCoin(params?: Record<string, any>) {
  return request('/tenant-admin/v1/coin/saveCurrencyCoin', {
    method: 'POST',
    data: params,
  });
}


// 总后台币种修改
export async function updateCurrencyCoinById(params?: Record<string, any>) {
  return request('/tenant-admin/v1/coin/updateCurrencyCoinById', {
    method: 'POST',
    data: params,
  });
}


// 总后台币种删除
export async function deleteCurrencyCoinById(params?: Record<string, any>) {
  return request(`/tenant-admin/v1/coin/deleteCurrencyCoinById?idString=${params.id}`, {
    method: 'POST',
    data: params,
  });
}

// 总后台币种查询详情
export async function currencyCoinParams(params?: Record<string, any>) {
  return request(`/tenant-admin/v1/coin/currencyCoinParams?idString=${params.id}`, {
    method: 'POST',
    data: params,
  });
}


// 总后台币种列表
export async function currencyCoinList(params?: Record<string, any>) {
  return request('/tenant-admin/v1/coin/currencyCoinList', {
    method: 'POST',
    data: params,
  });
}
