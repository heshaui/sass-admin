import { request } from '@umijs/max';


// /language/languageList
export async function languageList(
    body:API.TenantAuthorityVo,
    options?: { [key: string]: any },
  ) {
    return request<API.TenantAuthority>('/language/languageList', {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  } 
    

  
  