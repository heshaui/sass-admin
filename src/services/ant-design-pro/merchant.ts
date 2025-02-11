import { request } from '@umijs/max';




// 
// export async function AuthorityList(
//     body:API.TenantAuthorityVo,
//     options?: { [key: string]: any },
//   ) {
//     return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/tenantAuthorityList', {
//       method: 'POST',
//       data: body,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       ...(options || {}),
//     });
//   }
  
// /tenant-admin/v1/tenant/tenantList
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

  
//   /tenant-admin/v1/tenant/saveTenant
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