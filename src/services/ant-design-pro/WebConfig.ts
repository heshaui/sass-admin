// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function homeMenu(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeMenuList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



// /tenant/v1/saveHomeMenu
export async function saveHomeMenu(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/saveHomeMenu', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


// /tenant/v1/HomeMenuTranslationList
export async function HomeMenuTranslationList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeMenuTranslationRespList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}





export async function tenantLangList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/tenantLangList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function saveLang(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/saveLang', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}




export async function addLangList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/addLangList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// /tenant/v1/enablePackage
export async function enablePackage(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/enablePackage', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


// /tenant/v1/disablePackage
export async function disablePackage(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/disablePackage', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


// /tenant/v1/updateEndpointInfo
export async function updateEndpointInfo(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateEndpointInfo', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


// /tenant/v1/deleteTenantLangPackage
export async function deleteTenantLangPackage(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/deleteTenantLangPackage', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// /tenant/v1/checkUpdate
export async function checkUpdate(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/checkUpdate', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json', 
    },
    ...(options || {}),
  });
}


// /tenant/v1/readJsonFromAliyun
export async function readJsonFromAliyun(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/readJsonFromAliyun', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

