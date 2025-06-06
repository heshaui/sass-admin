import { request } from 'umi';
const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
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
  return request(`/tenant/v1/exchange-coin/updateExchangeGroup?id=${params.id}&group=${params.group}`, {
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



export async function tenantCoin(params?: Record<string, any>) {
  return request('/tenant/v1/coin/currencyCoinList', {
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
  return request(isAdmin ? '/tenant-admin/v1/protocol-type/protocolTypeList' : '/tenant/v1/protocol-type/protocolTypeList', {
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
export async function adminUpdateCurrencyCoinById(params?: Record<string, any>) {
  return request(isAdmin ? '/tenant-admin/v1/coin/updateCurrencyCoinById' : '/tenant/v1/tenant-coin/updateTenantCurrencyCoinById', {
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
  console.log(params);
  return request(isAdmin ? `/tenant-admin/v1/coin/currencyCoinParams?idString=${params.id}` : `/tenant/v1/coin/currencyCoinParams?idString=${params.id}`, {
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

// 总后台币种拓展新增
export async function adminSaveCurrencyCoinExt(params?: Record<string, any>) {
  return request('/tenant-admin/v1/coin-ext/saveCurrencyCoinExt', {
    method: 'POST',
    data: params,
  });
}

// 总后台币种基础信息新增
export async function adminSaveCurrencyCoin(params?: Record<string, any>) {
  return request('/tenant-admin/v1/coin/saveCurrencyCoin', {
    method: 'POST',
    data: params,
  });
}


// 总后台币种拓展列表
export async function adminCurrencyCoinExtList(params?: Record<string, any>) {
  return request(isAdmin ? '/tenant-admin/v1/coin-ext/currencyCoinExtList' : '/tenant/v1/tenant-coin-ext/tenantCurrencyCoinExtList', {
    method: 'POST',
    data: params,
  });
}

// 总后台币种拓展修改
export async function adminUpdateCurrencyCoinExtById(params?: Record<string, any>) {
  return request('/tenant-admin/v1/coin-ext/updateCurrencyCoinExtById', {
    method: 'POST',
    data: params,
  });
}



// /tenant/v1/tenant-coin-ext/saveTenantCurrencyCoinExt
export async function saveTenantCurrencyCoinExt(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin-ext/saveTenantCurrencyCoinExt', {
    method: 'POST',
    data: params,
  });
}


// /tenant/v1/tenant-coin-ext/updateTenantCurrencyCoinExtById
export async function updateTenantCurrencyCoinExtById(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin-ext/updateTenantCurrencyCoinExtById', {
    method: 'POST',
    data: params,
  });
}

// /tenant/v1/tenant-coin/tenantCurrencyCoinParams
export async function tenantCurrencyCoinParams(params?: Record<string, any>) {
  return request(`/tenant/v1/tenant-coin/tenantCurrencyCoinParams?idString=${params.id}`, {
    method: 'POST',
    data: params,
  });
}


//订单列表
export async function exchangeOrderList(params?: Record<string, any>) {
  return request(isAdmin ? '/tenant-admin/v1/exchangeOrder/exchangeOrderList' : '/tenant/v1/exchange-order/exchangeOrderList', {
    method: 'POST',
    data: params,
  });
}


// 撤销订单
export async function revocationOrder(params?: Record<string, any>) {
  return request('/tenant/v1/exchange-order/revocationOrder', {
    method: 'POST',
    data: params,
  });
}



// 保存币种简介
export async function saveIntroductionVo(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin/saveIntroductionVo', {
    method: 'POST',
    data: params,
  });
}


// 获取币种简介
export async function findIntroductionVo(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-coin/findIntroductionVo', {
    method: 'POST',
    data: params,
  });
}



export async function tradingRiskControlList(params?: Record<string, any>) {
  return request('/tenant/v1/trading-risk-control/tradingRiskControlList', {
    method: 'POST',
    data: params,
  });
}



export async function updateTradingRiskControlById(params?: Record<string, any>) {
  return request('/tenant/v1/trading-risk-control/updateTradingRiskControlById', {
    method: 'POST',
    data: params,
  });
}




export async function tradesInfo(params?: Record<string, any>) {
  return request(isAdmin ? '/tenant-admin/v1/tenant-trade/trades' : '/tenant/v1/tenant-trade/trades', {
    method: 'POST',
    data: params,
  });
}




export async function revocationExchangeCoinOrder(params?: Record<string, any>) {
  return request(`/tenant/v1/exchange-coin/revocationExchangeCoinOrder?symbol=${params.symbol}`, {
    method: 'POST',
    data: params,
  });
}



export async function selectExchangeGroup(params?: Record<string, any>) {
  return request('/tenant/v1/exchange-coin/selectExchangeGroup?id=' + params.id, {
    method: 'POST',
    data: params,
  });
}