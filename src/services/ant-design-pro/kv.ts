import { request } from 'umi';

// KV列表查询参数接口
interface KvListParams {
  key?: string;
  title?: string;
  category?: string;
  pageNo?: number;
  pageSize?: number;
}

// 获取KV配置列表
export async function getKvList(params: KvListParams) {
  return request('/tenant-admin/v1/keyValue/keyValueList', {
    method: 'POST',
    data: params,
  });
}

// 修改KV配置
export async function updateKv(data: any) {
  return request('/tenant-admin/v1/keyValue/updateTenantById', {
    method: 'POST',
    data,
  });
}

// kv配置表查询列表
export async function publishKv(data: { id: string }) {
  return request('/tenant-admin/v1/keyValue/keyValueList', {
    method: 'POST',
    data,
  });
}

// 新增KV配置
export async function addKv(data: any) {
  return request('/tenant-admin/v1/keyValue/saveKeyValue', {
    method: 'POST',
    data,
  });
}

// 删除KV配置
export async function deleteKv(data: { id: string }) {
  return request('/tenant-admin/v1/keyValue/deleteTenantById', {
    method: 'POST',
    data,
  });
}

// 获取租户KV配置列表
export async function getTenantKvList(params: any) {
  return request('/tenant/v1/tenantKeyValueList', {
    method: 'POST',
    data: params,
  });
}

// 新增租户KV配置
export async function addTenantKv(data: any) {
  return request('/tenant/v1/saveTenantKeyValue', {
    method: 'POST',
    data,
  });
}

// 删除租户KV配置
export async function deleteTenantKv(data: { id: string }) {
  return request('/tenant/v1/deleteTenantKeyValueById', {
    method: 'POST',
    data,
  });
}

// 更新租户KV配置
export async function updateTenantKv(data: any) {
  return request('/tenant/v1/updateTenantKeyValueById', {
    method: 'POST',
    data,
  });
}

// 获取租户KV配置参数
export async function getTenantKvParams(params: any) {
  return request('/tenant/v1/tenantKeyValueParams?idString='+params.keyValue, {
    method: 'POST',
    data: params,
  });
} 

// 发布KV配置
export async function releaseKv(data: { id: string }) {
  return request(`/tenant-admin/v1/keyValue/releaseKv/${data.id}`, {
    method: 'POST',
    data,
  });
}

// 取消发布KV配置
export async function cancelKv(data: { id: string }) {
  return request(`/tenant-admin/v1/keyValue/cancelKv/${data.id}`, {
    method: 'POST',
    data,
  });
}


export async function getTenantKeyParams(params: any) {
  return request('/tenant/v1/tenantKeyParams?key='+params.key, {
    method: 'POST',
    data: params,
  });
}
