import { request } from '@umijs/max';

//权限列表
export async function AuthorityList(
  body:API.TenantAuthorityVo,
  options?: { [key: string]: any },
) {
  return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/tenantAuthorityList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}




//权限新增
export async function saveTenantAuthority(
  body:API.TenantAuthorityVo,
  options?: { [key: string]: any },
) {
  return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/saveTenantAuthority', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//权限删除
export async function deleteTenantById(
  body:API.TenantAuthorityVo,
  options?: { [key: string]: any },
) {
  return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/deleteTenantById?idString='+body, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//权限查询
export async function tenantParams(
  body:API.TenantAuthorityVo,
  options?: { [key: string]: any },
) {
  return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/tenantParams', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//权限修改
export async function updateTenantById(
  body:API.TenantAuthorityVo,
  options?: { [key: string]: any },
) {
  return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/updateTenantById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//角色列表
export async function roleList(
  body:API.RoleVo,
  options?: { [key: string]: any },
) {
  return request<API.Role>('/tenant-admin/v1/role/roleList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


//角色新增
export async function saveRole(
  body:API.RoleVo,
  options?: { [key: string]: any },
) {
  return request<API.Role>('/tenant-admin/v1/role/saveRole', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


//角色删除
export async function deleteRoleById(
  body:API.RoleVo,
  options?: { [key: string]: any },
) {
  return request<API.Role>('/tenant-admin/v1/role/deleteTenantById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//角色查询
export async function roleParams(
  body:API.RoleVo,
  options?: { [key: string]: any },
) {
  return request<API.Role>('/tenant-admin/v1/role/tenantParams', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//角色修改
export async function updateRoleById(
  body:API.RoleVo,
  options?: { [key: string]: any },
) {
  return request<API.Role>('/tenant-admin/v1/role/updateTenantById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//员工列表
export async function employeeList(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/employeeList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
