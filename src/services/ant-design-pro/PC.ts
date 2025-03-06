// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** PC访问路径相关API */

/** 创建PC访问路径 POST /tenant-admin/v1/pcAccessPath/savePcAccessPath */
export async function savePcAccessPath(body: API.PcAccessPathParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult>('/tenant-admin/v1/pcAccessPath/savePcAccessPath', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新PC访问路径 PUT /tenant-admin/v1/pcAccessPath/updatePcAccessPathById */
export async function updatePcAccessPathById(body: API.PcAccessPathParams, options?: { [key: string]: any }) {
  return request<API.ResponseResult>('/tenant-admin/v1/pcAccessPath/updatePcAccessPathById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取PC访问路径列表 GET /tenant-admin/v1/pcAccessPath/pcAccessPathList */
export async function getPcAccessPathList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<API.PcAccessPathListResult>('/tenant-admin/v1/pcAccessPath/pcAccessPathList', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 删除PC访问路径 DELETE /tenant-admin/v1/pcAccessPath/deletePcAccessPathById */
export async function deletePcAccessPathById(id: string | number, options?: { [key: string]: any }) {
  return request<API.ResponseResult>('/tenant-admin/v1/pcAccessPath/deletePcAccessPathById?idString='+id, {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 类型定义 */
declare namespace API {
  type ResponseResult = {
    success?: boolean;
    errorMessage?: string;
    data?: any;
  };

  type PcAccessPathParams = {
    id?: string | number;
    name?: string;
    path?: string;
    description?: string;
    // 根据实际需求添加更多字段
  };

  type PcAccessPathListResult = {
    success?: boolean;
    errorMessage?: string;
    data?: {
      list: PcAccessPathParams[];
      total: number;
      pageSize: number;
      current: number;
    };
  };
}


