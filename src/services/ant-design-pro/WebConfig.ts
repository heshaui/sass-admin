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


// 删除语言端:传tenantLangEndPointId
export async function deleteTenantLangEndpoint(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/deleteTenantLangEndpoint', {
    method: 'POST',
    data: body,
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

// 获取首页底部列表
export async function homeBottomList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeBottomList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// 获取首页底部翻译列表
export async function homeBottomTranslationList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/HomeBottomTranslationList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



// 更新首页底部翻译
export async function updateHomeBottomTranslationById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeBottomTranslationById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// 更新首页底部
export async function updateHomeBottomById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeBottomById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// /tenant/v1/saveHomeBottom
export async function saveHomeBottom(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/saveHomeBottom', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}





// 获取首页图片列表
export async function homeImageList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeImageList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// 保存首页图片
export async function saveHomeImage(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/saveHomeImage', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// 更新首页图片信息
export async function updateHomeImageById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeImageById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// 更新首页图片内容
export async function updateHomeImageContentById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeImageContentById', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// 获取首页图片内容列表
export async function homeImageContentList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/HomeImageContentList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

// /tenant/v1/saveHomeBottomFooter
export async function saveHomeBottomFooter(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/saveHomeBottomFooter', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// /tenant/v1/homeBottomFooterList
export async function homeBottomFooterList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeBottomFooterList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// /tenant/v1/updateHomeBottomFooterById
export async function updateHomeBottomFooterById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeBottomFooterById', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}



export async function pcAccessPathAll(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/pcAccessPathAll', {
    method: 'GET',
    ...(options || {}),
  });
}


// /tenant/v1/homeMenuParams
export async function homeMenuParams(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeMenuParams?idString='+body.menuId, {
    method: 'POST',
    ...(options || {}),
  });
}


// /tenant/v1/updateHomeMenuById
export async function updateHomeMenuById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeMenuById', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}




export async function updateHomeMenuTranslationById(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/updateHomeMenuTranslationById', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


// /tenant/v1/deleteHomeMenu
export async function deleteHomeMenu(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/deleteHomeMenu?id='+body.id, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


// /tenant/v1/deleteHomeBottom
export async function deleteHomeBottom(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/deleteHomeBottom?id='+body.id, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
  

// /tenant/v1/homeBottomParams
export async function homeBottomParams(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeBottomParams?idString='+body.id, {
    method: 'POST',
    ...(options || {}),
  });
}