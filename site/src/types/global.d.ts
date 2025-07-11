/**
 * 全局类型声明文件
 */

declare global {
  interface Window {
    /**
     * API基础URL - 后端服务地址
     * 默认值: http://localhost:3000
     */
    API_BASE_URL: string;
  }
}

// 这个文件必须作为模块导出，否则declare global不会生效
export {};