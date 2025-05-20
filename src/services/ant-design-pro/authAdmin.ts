import { request } from '@umijs/max';
const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';


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
  console.log(body);
  return request<API.Role>('/tenant-admin/v1/role/deleteTenantById?idString='+body.roleId, {
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

//权限分配
export async function savePermissionsList(
  body:API.PermissionsVo,
  options?: { [key: string]: any },
) {
  return request<API.Permissions>('/tenant-admin/v1/permissions/savePermissionsList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// /tenant-admin/v1/permissions/tenantParams
//权限查询
export async function permissionsParams(
  body:API.PermissionsVo,
  options?: { [key: string]: any },
) {
  return request<API.Permissions>('/tenant-admin/v1/permissions/permissionsList', {
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



//员工新增
export async function saveEmployee(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/saveEmployee', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


//员工删除
export async function deleteEmployeeById(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/deleteEmployeeById?idString='+body, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


//员工启用
export async function enableEmployee(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/enableEmployee/'+body+'/1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//员工禁用
export async function offEmployee(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/offEmployee/'+body+'/0', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//员工重置密码
export async function resetPassword(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/resetPassword/'+body.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



//员工修改
export async function updateEmployeeById(
  body:API.EmployeeVo,
  options?: { [key: string]: any },
) {
  return request<API.Employee>('/tenant-admin/v1/employee/updateEmployeeById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function deleteTenantByIdList(
  body:API.PermissionsVo,
  options?: { [key: string]: any },
) {
  return request<API.Permissions>('/tenant-admin/v1/permissions/deleteTenantByIdList?ids='+body, {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

//获取谷歌验证码
export async function sendGoogleKey(
  options?: { [key: string]: any },
) {
  return request<API.GoogleAuthResponse>( isAdmin?'/tenant-admin/v1/google/sendGoogleKey':'/tenant/v1/google/sendGoogleKey', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

//绑定谷歌验证码
export async function bindGoogleKey(
  body: API.GoogleAuthVo,
  options?: { [key: string]: any },
) {
  return request<API.GoogleAuthResponse>(isAdmin?'/tenant-admin/v1/google/bindGoogleKey?code='+body.googleCode:'/tenant/v1/google/bindGoogleKey?code='+body.googleCode, {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

//解除谷歌验证码绑定
export async function relieveGoogleKey(
  body: API.GoogleAuthVo,
  options?: { [key: string]: any },
) {
  return request<API.GoogleAuthResponse>(isAdmin?'/tenant-admin/v1/google/relieveGoogleKey':'/tenant/v1/google/relieveGoogleKey?code='+body.code, {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


