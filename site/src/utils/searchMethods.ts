import { SearchMethod, SearchResultHandler } from '@/utils/VarTree'

export const bpSearch: SearchMethod[] = [
  {
    name: '业务伙伴搜索',
    paramTree: null,
    serviceUrl: '/api/search/business-partner'
  }
]

export const relationSearch: SearchMethod[] = [
  {
    name: '关系搜索',
    paramTree: null,
    serviceUrl: '/api/search/relation'
  }
]