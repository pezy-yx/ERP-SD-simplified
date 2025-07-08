import { SearchMethod } from '@/utils/VarTree'

// 搜索服务配置 - 从环境变量读取
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'

// 搜索响应接口
export interface SearchResponse {
  success: boolean
  data: SearchResultItem[]
  total: number
  message?: string
  error?: string
}

// 搜索结果项接口
export interface SearchResultItem {
  id: string
  result: string
  description: string
  [key: string]: any // 允许额外的字段
}

// 搜索服务类
export class SearchService {
  /**
   * 执行搜索请求
   * @param method 搜索方法配置
   * @param params 搜索参数
   * @returns 搜索结果
   */
  static async executeSearch(method: SearchMethod, params: any): Promise<SearchResponse> {
    try {
      console.log('发送搜索请求:', {
        url: `${API_BASE_URL}${method.serviceUrl}`,
        method: method.name,
        params
      })

      const response = await fetch(`${API_BASE_URL}${method.serviceUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
      }

      const result: SearchResponse = await response.json()
      
      console.log('搜索响应:', result)
      
      return result

    } catch (error) {
      console.error('搜索请求失败:', error)
      
      // 返回错误响应格式
      return {
        success: false,
        data: [],
        total: 0,
        message: '搜索请求失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  /**
   * 业务伙伴搜索
   * @param params 搜索参数
   */
  static async searchBusinessPartner(params: {
    bpId?: string
    companyName?: string
    bpType?: string
  }): Promise<SearchResponse> {
    const method: SearchMethod = {
      name: '业务伙伴搜索',
      paramTree: null,
      serviceUrl: '/search/mock/business-partner'
    }
    
    return this.executeSearch(method, params)
  }

  /**
   * 产品搜索
   * @param params 搜索参数
   */
  static async searchProduct(params: {
    productCode?: string
    productName?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<SearchResponse> {
    const method: SearchMethod = {
      name: '产品搜索',
      paramTree: null,
      serviceUrl: '/search/mock/product'
    }
    
    return this.executeSearch(method, params)
  }

  /**
   * 简单搜索
   * @param query 搜索关键词
   */
  static async simpleSearch(query?: string): Promise<SearchResponse> {
    const method: SearchMethod = {
      name: '简单搜索',
      paramTree: null,
      serviceUrl: '/search/mock/simple'
    }
    
    return this.executeSearch(method, { query })
  }

  /**
   * 高级搜索
   * @param params 高级搜索参数
   */
  static async advancedSearch(params: {
    keyword?: string
    category?: string
    startDate?: string
    endDate?: string
    strict?: boolean
  }): Promise<SearchResponse> {
    const method: SearchMethod = {
      name: '高级搜索',
      paramTree: null,
      serviceUrl: '/search/mock/advanced'
    }
    
    return this.executeSearch(method, params)
  }
}

// 导出默认实例
export default SearchService
