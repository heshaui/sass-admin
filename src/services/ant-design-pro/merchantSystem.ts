import { request } from '@umijs/max';

/**
 * 获取租户员工列表
 * @param params 请求参数
 */
export async function getTenantEmployeeList(params?: Record<string, any>) {
  return request('/tenant/v1/tenantEmployeeList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 保存租户员工信息
 * @param params 请求参数
 */
export async function saveTenantEmployee(params?: Record<string, any>) {
  return request('/tenant/v1/saveTenantEmployee', {
    method: 'POST',
    data: params,
  });
}

/**
 * 根据ID删除商户员工
 * @param params 请求参数
 */
export async function deleteTenantEmployeeById(params?: Record<string, any>) {
  return request('/tenant/v1/deleteTenantEmployeeById', {
    method: 'POST',
    data: params,
  });
}

/**
 * 商户员工查询详情
 * @param params 请求参数
 */
export async function getTomeMenuParams(params?: Record<string, any>) {
  return request('/tenant/v1/tomeMenuParams', {
    method: 'POST',
    data: params,
  });
}

/**
 * 根据ID更新租户员工信息
 * @param params 请求参数
 */
export async function updateTenantEmployeeById(params?: Record<string, any>) {
  return request('/tenant/v1/updateTenantEmployeeById', {
    method: 'POST',
    data: params,
  });
}