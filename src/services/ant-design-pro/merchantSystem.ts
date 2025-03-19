import { request } from '@umijs/max';

/**
 * 获取商户员工列表
 * @param params 请求参数
 */
export async function getTenantEmployeeList(params?: Record<string, any>) {
  return request('/tenant/v1/tenantEmployeeList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 保存商户员工信息
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
  return request('/tenant/v1/deleteTenantEmployeeById?idString='+params.userId, {
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


// 商户权限列表
export async function getTenantAuthorityList(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-authority/tenantAuthorityList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取商户角色列表
 * @param params 请求参数
 */
export async function getTenantRoleList(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-role/tenantRoleList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 保存商户角色信息
 * @param params 请求参数
 */
export async function saveTenantRole(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-role/saveTenantRole', {
    method: 'POST',
    data: params,
  });
}

/**
 * 根据ID删除商户角色
 * @param params 请求参数
 */
export async function deleteTenantRoleById(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-role/deleteTenantRoleById', {
    method: 'POST',
    data: params,
  });
}

/**
 * 商户角色查询详情
 * @param params 请求参数
 */
export async function getTenantRoleMenuParams(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-role/tomeMenuParams', {
    method: 'POST',
    data: params,
  });
}

/**
 * 根据ID更新商户角色信息
 * @param params 请求参数
 */
export async function updateTenantRoleById(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-role/updateTenantRoleById', {
    method: 'POST',
    data: params,
  });
}


export async function getTenantPermissionsList(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-permissions/tenantPermissionsList', {
    method: 'POST',
    data: params,
  });
}


// 保存商户权限
export async function saveTenantPermissions(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-permissions/saveList', {
    method: 'POST',
    data: params,
  });
}

// 删除商户权限
export async function deleteTenantPermissionsByIds(params?: Record<string, any>) {
  return request('/tenant/v1/tenant-permissions/deleteByIds', {
    method: 'POST',
    data: params,
  });
}

// 重置商户员工密码
export async function restPasswordTenantEmployee(params?: Record<string, any>) {
  return request(`/tenant/v1/restPasswordTenantEmployee?id=${params.id}`, {
    method: 'POST',
    data: params,
  });
}
