import { request } from '@umijs/max';

// /language/languageList
export async function languageList(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/language/languageList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  } 
    


  export async function langPackageList(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/language/langPackageList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  
  // /tenant-admin/v1/language/saveLangPackage
  export async function saveLangPackage(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/language/saveLangPackage', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  } 

  // /tenant-admin/v1/language/updateLangPackage
  export async function updateLangPackage(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/language/updateLangPackage', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }
  
  // /tenant-admin/v1/language/deleteLangPackage
  export async function deleteLangPackage(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/tenant-admin/v1/language/deleteLangPackage', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }
