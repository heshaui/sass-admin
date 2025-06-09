// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    employeeResp?: EmployeeResp;
    /**
     * 权限数据 顶级父类Id是0
     */
    tenantAuthorityList?: TenantAuthority[];
    [property: string]: any;
  };

  type EmployeeResp = {
    /**
     * 员工邮箱
     */
    email?: string;
    /**
     * 员工ID
     */
    id?: number;
    /**
     * 员工昵称
     */
    nickname?: string;
    /**
     * 员工手机号
     */
    phone?: string;
    /**
     * 备注信息
     */
    remark?: string;
    /**
     * 员工角色/权限
     */
    role?: string;
    /**
     * 状态 1 正常 0 冻结
     */
    status?: number;
    [property: string]: any;
  };

  /**
   * 管理员权限表，权限数据 顶级父类Id是0
   */
  type TenantAuthority = {
    /**
     * 描述
     */
    description: string;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 主键ID
     */
    id?: number;
    /**
     * Shiro名称
     */
    name: string;
    /**
     * 父级ID
     */
    parentId: number;
    /**
     * 路径
     */
    path?: string;
    /**
     * 排序
     */
    sort: number;
    /**
     * 中文标题
     */
    title: string;
    /**
     * 多语言标题key
     */
    titleKey: string;
    /**
     * 类型，1 - 导航栏, 2 - 操作权限
     */
    type: number;
    [property: string]: any;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FackeParams = {
    number?: String;
    deviceType?: String;
  };

  type FackeResult = {
    code?: string;
    data?: { [key: string]: any };
    failMsg?: Response;
    message?: string;
    reqNo?: string;
    [property: string]: any;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    account?: string;
    password?: string;
    googleCode?: string;
    emailCode?: string;
    rememberPassword?: boolean;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  /**
   * TenantAuthorityVo，权限查询对象
   */
  export type TenantAuthorityVo = {
    /**
     * 描述
     */
    description?: string;
    /**
     * 名称
     */
    name?: string;
    pageNo?: number;
    pageSize?: number;
    /**
     * 父级ID
     */
    parentId?: number;
    /**
     * 中文标题
     */
    title?: string;
    /**
     * 类型: 1 - 导航栏, 2 - 操作权限
     */
    type?: number;
    [property: string]: any;
  };

  /**
   * BaseResponsePageRespTenantAuthority
   */
  export type Response = {
    code?: string;
    data?: PageRespTenantAuthority;
    failMsg?: BaseResponse;
    message?: string;
    reqNo?: string;
    [property: string]: any;
  };

  /**
   * PageRespTenantAuthority
   */
  export type PageRespTenantAuthority = {
    count?: number;
    list?: TenantAuthority[];
    [property: string]: any;
  };

  /**
   * 管理员权限表，权限数据 顶级父类Id是0
   */
  export type TenantAuthority = {
    /**
     * 描述
     */
    description: string;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 主键ID
     */
    id?: number;
    /**
     * Shiro名称
     */
    name: string;
    /**
     * 父级ID
     */
    parentId: number;
    /**
     * 路径
     */
    path?: string;
    /**
     * 排序
     */
    sort: number;
    /**
     * 中文标题
     */
    title: string;
    /**
     * 多语言标题key
     */
    titleKey: string;
    /**
     * 类型，1 - 导航栏, 2 - 操作权限
     */
    type: number;
    [property: string]: any;
  };

  /**
   * BaseResponse
   */
  export type BaseResponse = {
    code?: string;
    data?: { [key: string]: any };
    failMsg?: BaseResponse;
    message?: string;
    reqNo?: string;
  };

  type GoogleAuthVo = {
    /** Google Authenticator code */
    code: string;
    /** Google Authenticator secret key */
    secret?: string;
  };

  type GoogleAuthResponse = {
    /** Response code */
    code: string;
    /** Response message */
    message?: string;
    /** Response data */
    data?: {
      /** Whether the operation was successful */
      success: boolean;
      /** Additional message */
      message?: string;
    };
  };
}
