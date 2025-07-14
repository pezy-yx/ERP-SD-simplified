import { SearchMethod, SearchResultHandler } from '@/utils/VarTree'
import { VarTree, createTreeFromConfig, cns } from '../utils/VarTree';

const bpParamSearchStructure = cns('dict', 'dict', 'params', null, false, {}, [
  cns('string', 'leaf', 'customer_id', '', false),
  cns('string','leaf',"search_term",'001',false)
]);
const bpParamSearchTree = createTreeFromConfig(bpParamSearchStructure);

export const bpSearch: SearchMethod[] = [
  {
    name: '业务伙伴搜索',
    paramTree: bpParamSearchTree,
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

