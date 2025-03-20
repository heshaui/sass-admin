import { request } from 'umi';

// 媒体项接口定义
export interface MediaItem {
  id: string;
  name: string;
  icon: string;
  link: string;
}

// 公告项接口定义
export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 帮助中心分类接口定义
export interface HelpCenterClassItem {
  id: string;
  name: string;
  status: number;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

// 帮助中心分类内容接口定义
export interface HelpCenterClassContentItem {
  id: string;
  classId: string;
  title: string;
  content: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 帮助中心文章接口定义
export interface HelpCenterArticleItem {
  id: string;
  title: string;
  status: number;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

// 帮助中心文章内容接口定义
export interface HelpCenterArticleContentItem {
  id: string;
  articleId: string;
  title: string;
  content: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 公告分类接口定义
export interface ClassMenuItem {
  id: string;
  name: string;
  status: number;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

// 名言接口定义
export interface FamousAphorismsItem {
  id: string|number;
  langId: string;
  content: string;
  author?: string;
  status: number;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

// 轮播图接口定义
export interface CarouselImageItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  status: number;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

// 帮助中心自定义接口定义
export interface HelpCenterCustomizationItem {
  id: string;
  title: string;
  status: number;
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

// 帮助中心自定义内容接口定义
export interface HelpCenterCustomizationContentItem {
  id: string;
  customizationId: string;
  title: string;
  content: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 获取媒体列表
export async function getMediaList(data: any) {
  return request<{
    data: MediaItem[];
    success: boolean;
  }>('/tenant/v1/homeSocialMediaList', {
    method: 'POST',
    data,
  });
}

// 获取媒体参数
export async function getMediaParams() {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/homeSocialMediaParams', {
    method: 'POST',
  });
}

// 添加媒体
export async function addMedia(params: Omit<MediaItem, 'id'>) {
  return request<{
    success: boolean;
    data: MediaItem;
  }>('/tenant/v1/saveHomeSocialMedia', {
    method: 'POST',
    data: params,
  });
}

// 更新媒体
export async function updateMedia(params: MediaItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeSocialMediaById', {
    method: 'POST',
    data: params,
  });
}

// 删除媒体
export async function deleteMedia(id: string) {
  return request<{
    success: boolean;
  }>('/tenant/v1/deleteHomeSocialMediaById', {
    method: 'POST',
    data: { id },
  });
}

// 获取公告内容列表
export async function getAnnouncementContentList(data: any) {
  return request<{
    data: any[];
    success: boolean;
  }>('/tenant/v1/InformAnnouncementContentList', {
    method: 'POST',
    data,
  });
}

// 获取公告列表
export async function getAnnouncementList(data: any) {
  return request<{
    data: AnnouncementItem[];
    success: boolean;
  }>('/tenant/v1/informAnnouncementList', {
    method: 'POST',
    data,
  });
}

// 获取公告参数
export async function getAnnouncementParams(id: string) {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/informAnnouncementParams?idString='+id, {
    method: 'POST',
  });
}

// 添加公告
export async function addAnnouncement(params: Omit<AnnouncementItem, 'id'>) {
  return request<{
    success: boolean;
    data: AnnouncementItem;
  }>('/tenant/v1/saveInformAnnouncement', {
    method: 'POST',
    data: params,
  });
}

// 更新公告
export async function updateAnnouncement(params: AnnouncementItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateInformAnnouncementById', {
    method: 'POST',
    data: params,
  });
}

// 更新公告内容
export async function updateAnnouncementContent(params: any) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateInformAnnouncementContentById', {
    method: 'POST',
    data: params,
  });
}

// 获取帮助中心分类列表
export async function getHelpCenterClassList(data: any) {
  return request<{
    data: HelpCenterClassItem[];
    success: boolean;
  }>('/tenant/v1/homeHelpCenterClassList', {
    method: 'POST',
    data,
  });
}

// 获取帮助中心分类内容列表
export async function getHelpCenterClassContentList(data: any) {
  return request<{
    data: HelpCenterClassContentItem[];
    success: boolean;
  }>('/tenant/v1/HomeHelpCenterClassContentList', {
    method: 'POST',
    data,
  });
}

// 获取帮助中心分类参数
export async function getHelpCenterClassParams(id?: string) {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/homeHelpCenterClassParams' + (id ? `?idString=${id}` : ''), {
    method: 'POST',
  });
}

// 添加帮助中心分类
export async function addHelpCenterClass(params: Omit<HelpCenterClassItem, 'id'>) {
  return request<{
    success: boolean;
    data: HelpCenterClassItem;
  }>('/tenant/v1/saveHomeHelpCenterClass', {
    method: 'POST',
    data: params,
  });
}

// 更新帮助中心分类
export async function updateHelpCenterClass(params: HelpCenterClassItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeHelpCenterClassById', {
    method: 'POST',
    data: params,
  });
}

// 更新帮助中心分类内容
export async function updateHelpCenterClassContent(params: any) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeHelpCenterClassContentById', {
    method: 'POST',
    data: params,
  });
}

// 获取帮助中心文章列表
export async function getHelpCenterArticleList(data: any) {
  return request<{
    data: HelpCenterArticleItem[];
    success: boolean;
  }>('/tenant/v1/homeHelpCenterArticleList', {
    method: 'POST',
    data,
  });
}

// 获取帮助中心文章内容列表
export async function getHelpCenterArticleContentList(data: any) {
  return request<{
    data: HelpCenterArticleContentItem[];
    success: boolean;
  }>('/tenant/v1/HomeHelpCenterArticleContentList', {
    method: 'POST',
    data,
  });
}

// 获取帮助中心文章参数
export async function getHelpCenterArticleParams(id?: string) {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/homeHelpCenterArticleParams' + (id ? `?idString=${id}` : ''), {
    method: 'POST',
  });
}

// 添加帮助中心文章
export async function addHelpCenterArticle(params: Omit<HelpCenterArticleItem, 'id'>) {
  return request<{
    success: boolean;
    data: HelpCenterArticleItem;
  }>('/tenant/v1/saveHomeHelpCenterArticle', {
    method: 'POST',
    data: params,
  });
}

// 更新帮助中心文章
export async function updateHelpCenterArticle(params: HelpCenterArticleItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeHelpCenterArticleById', {
    method: 'POST',
    data: params,
  });
}

// 更新帮助中心文章内容
export async function updateHelpCenterArticleContent(params: any) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeHelpCenterArticleContentById', {
    method: 'POST',
    data: params,
  });
}

// 获取公告分类列表
export async function getClassMenuList(data: any) {
  return request<{
    data: ClassMenuItem[];
    success: boolean;
  }>('/tenant/v1/classMenuList', {
    method: 'POST',
    data,
  });
}

// 添加公告分类
export async function addClassMenu(params: Omit<ClassMenuItem, 'id'>) {
  return request<{
    success: boolean;
    data: ClassMenuItem;
  }>('/tenant/v1/saveClassMenu', {
    method: 'POST',
    data: params,
  });
}

// 获取公告分类参数
export async function getClassMenuParams(id?: string) {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/classMenuParams' + (id ? `?idString=${id}` : ''), {
    method: 'POST',
  });
}

// 删除公告分类
export async function deleteClassMenu(id: string) {
  return request<{
    success: boolean;
  }>('/tenant/v1/deleteClassMenuById?idString='+id, {
    method: 'POST',
    data: { id },
  });
}

// 更新公告分类
export async function updateClassMenu(params: ClassMenuItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateClassMenuById', {
    method: 'POST',
    data: params,
  });
}

// 获取名言列表
export async function getFamousAphorismsList(data: any) {
  return request<{
    data: FamousAphorismsItem[];
    success: boolean;
  }>('/tenant/v1/famousAphorismsList', {
    method: 'POST',
    data,
  });
}

// 获取名言详情
export async function getFamousAphorismsDetail(id: string) {
  return request<{
    data: FamousAphorismsItem;
    success: boolean;
  }>('/tenant/v1/famousAphorismsDetail?id='+id, {
    method: 'POST',
    data: { id },
  });
}

// 删除名言
export async function deleteFamousAphorisms(id: string) {
  return request<{
    success: boolean;
  }>('/tenant/v1/deleteFamousAphorismsById?id='+id, {
    method: 'POST',
    data: { id },
  });
}

// 添加名言
export async function addFamousAphorisms(params: Omit<FamousAphorismsItem, 'id'>) {
  return request<{
    success: boolean;
    data: FamousAphorismsItem;
  }>('/tenant/v1/saveFamousAphorisms', {
    method: 'POST',
    data: params,
  });
}

// 更新名言
export async function updateFamousAphorisms(params: FamousAphorismsItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateFamousAphorisms', {
    method: 'POST',
    data: params,
  });
}

// 获取轮播图列表
export async function getCarouselImageList(data: any) {
  return request<{
    data: CarouselImageItem[];
    success: boolean;
  }>('/tenant/v1/carouselImageList', {
    method: 'POST',
    data,
  });
}

// 获取轮播图详情
export async function getCarouselImageDetail(id: string) {
  return request<{
    data: CarouselImageItem;
    success: boolean;
  }>('/tenant/v1/CarouselImageDetail', {
    method: 'POST',
    data: { id },
  });
}

// 删除轮播图
export async function deleteCarouselImage(id: string) {
  return request<{
    success: boolean;
  }>('/tenant/v1/deletecarouselImageById', {
    method: 'POST',
    data: { id },
  });
}

// 添加轮播图
export async function addCarouselImage(params: Omit<CarouselImageItem, 'id'>) {
  return request<{
    success: boolean;
    data: CarouselImageItem;
  }>('/tenant/v1/savecarouselImage', {
    method: 'POST',
    data: params,
  });
}

// 更新轮播图
export async function updateCarouselImage(params: CarouselImageItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updatecarouselImage', {
    method: 'POST',
    data: params,
  });
}

// 获取帮助中心自定义列表
export async function getHelpCenterCustomizationList(data: any) {
  return request<{
    data: HelpCenterCustomizationItem[];
    success: boolean;
  }>('/tenant/v1/homeHelpCenterCustomizationList', {
    method: 'POST',
    data,
  });
}

// 获取帮助中心自定义内容列表
export async function getHelpCenterCustomizationContentList(data: any) {
  return request<{
    data: HelpCenterCustomizationContentItem[];
    success: boolean;
  }>('/tenant/v1/HomeHelpCenterCustomizationContentList', {
    method: 'POST',
    data,
  });
}

// 获取帮助中心自定义参数
export async function getHelpCenterCustomizationParams(id?: string) {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/homeHelpCenterCustomizationParams' + (id ? `?idString=${id}` : ''), {
    method: 'POST',
  });
}

// 添加帮助中心自定义
export async function addHelpCenterCustomization(params: Omit<HelpCenterCustomizationItem, 'id'>) {
  return request<{
    success: boolean;
    data: HelpCenterCustomizationItem;
  }>('/tenant/v1/saveHomeHelpCenterCustomization', {
    method: 'POST',
    data: params,
  });
}

// 更新帮助中心自定义
export async function updateHelpCenterCustomization(params: HelpCenterCustomizationItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeHelpCenterCustomizationById', {
    method: 'POST',
    data: params,
  });
}

// 更新帮助中心自定义内容
export async function updateHelpCenterCustomizationContent(params: any) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeHelpCenterCustomizationContentById', {
    method: 'POST',
    data: params,
  });
}
