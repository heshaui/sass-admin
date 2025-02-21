import { request } from '@umijs/max';


export async function tenantList(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenant/tenantList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }



  
  export async function tenantParams(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenant/tenantParams?idString='+body, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  

export async function saveTenant(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenant/saveTenant', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenant-admin/v1/tenantRoot/save
  export async function saveTenantRoot(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenantRoot/save', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  export async function updateTenantById(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenant/updateTenantById', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


//root列表
  export async function tenantRootList(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenantRoot/tenantRootList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenant-admin/v1/tenantRoot/updatePasswordById
  export async function updatePasswordById(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenantRoot/updatePasswordById?idString='+body, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  // /tenant-admin/v1/tenantRoot/updateGoogleById
  export async function updateGoogleById(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenantRoot/updateGoogleById?idString='+body, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  // /tenant-admin/v1/tenantRoot/updateTenantById
  export async function updateTenantRootById(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenantRoot/updateTenantById', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  export async function updatePaymentStatusById(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/tenantRoot/updatePaymentStatusById', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }




  export async function tenantRoleList(
    body:API.TenantRoleVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantRole>('/tenant-admin/v1/tenantRole/tenantRoleList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenantRole-admin/v1/tenantRole/saveTenantRole
  export async function saveTenantRole(
    body:API.TenantRoleVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantRole>('/tenant-admin/v1/tenantRole/saveTenantRole', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenantPermissions-admin/v1/tenantPermissions/tenantPermissionsList
  export async function tenantPermissionsList(
    body:API.TenantPermissionsVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantPermissions>('/tenant-admin/v1/tenantPermissions/tenantPermissionsList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenant-admin/v1/tenantPermissions/tenantPermissionsParams
  export async function tenantPermissionsParams(
    body:API.TenantPermissionsVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantPermissions>('/tenant-admin/v1/tenantPermissions/tenantPermissionsParams?idString='+body, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }



  export async function saveTenantPermissions(
    body:API.TenantPermissionsVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantPermissions>('/tenant-admin/v1/tenantPermissions/saveTenantPermissions', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }



  export async function updateTenantPermissionsById(
    body:API.TenantPermissionsVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantPermissions>('/tenant-admin/v1/tenantPermissions/updateTenantPermissionsById', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenant-admin/v1/tenantPermissions/deleteTenantPermissionsById
  export async function deleteTenantPermissionsById(
    body:API.TenantPermissionsVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantPermissions>('/tenant-admin/v1/tenantPermissions/deleteTenantPermissionsById?idString='+body, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  // /tenant-admin/v1/tenantRole/updateTenantRoleById
  export async function updateTenantRoleById(
    body:API.TenantRoleVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantRole>('/tenant-admin/v1/tenantRole/updateTenantRoleById', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenant-admin/v1/tenantRoot/updateRoleById
  export async function updateRoleById(
    body:API.TenantRoleVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantRole>(`/tenant-admin/v1/tenantRoot/updateRoleById?idLong=${body.id}&roleIds=${body.roleIds}`, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  // /tenant-admin/v1/tenantPermissions/saveList
  export async function saveList(
    body:API.TenantPermissionsVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantPermissions>('/tenant-admin/v1/tenantPermissions/saveList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }


  