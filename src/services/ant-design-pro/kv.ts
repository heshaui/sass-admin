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