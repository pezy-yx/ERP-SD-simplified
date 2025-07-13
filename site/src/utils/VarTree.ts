import { DefineComponent } from "vue";
import type { Component } from 'vue'
/**
 * VarNode类：变量节点
 * 每个节点包含类型、名称、默认值、只读状态和子节点
 */
export type VarTypeString = 'string' | 'date' | 'selection' | 'dict' | 'dynamiclist' | 'fixlist' | 'number' | 'boolean'
export type NodeTypeString = 'dict' | 'list' | 'leaf'
export type VarNodeValue = Object | null
export type VarNodeValueValidator = {
  creteria: (value: VarNodeValue) => boolean,
  message?: string
}
export type VarNodeValueValidators = VarNodeValueValidator[]

// 搜索方法接口
export interface SearchMethod {
  name: string
  paramTree: VarTree | null
  serviceUrl: string
  resultHeaderDisplay?: Record<string, string>
}

// 搜索结果处理函数类型
export type SearchResultHandler = (data: {
  method: SearchMethod
  params: any
  results: any
  selectedResults: any[]
  firstSelectedResult: any
}, currentNode: VarNode) => void

export type VarNodeConfig = {
  childTemplate?: NodeStructure; // 子节点模板，用于动态列表
  maxLength?: number; // 最大长度，用于动态列表
  validators?: VarNodeValueValidators; // 内容检查函数集合
  customComponent?: Component; // 自定义组件钩子
  minDate?: string; // 最小日期（ISO格式）
  maxDate?: string; // 最大日期（ISO格式）
  options?: string[]; // 选择项列表（用于selection类型）
  classPrefix?: string; // CSS类名前缀，用于自定义布局样式
  hideLabel?: boolean; // 是否隐藏当前的Label
  searchMethods?: SearchMethod[] | null; // 搜索方法配置
  customSearchResultHandler?: SearchResultHandler; // 自定义搜索结果处理函数
  selected?: boolean; // 是否为选中状态
  rowProvided?: number; // 动态列表初始行数
}

export type NodeStructure = {
  varType: VarTypeString;
  nodeType?: NodeTypeString;
  name?: string;
  nameDisplay?: string;
  defaultValue?: VarNodeValue;
  readonly?: boolean;
  config?: VarNodeConfig;
  children?: NodeStructure[];
  iconPath?: string; // **新增：图标路径，用于显示在UI上**
}

export class VarNode {
  public nodeType: NodeTypeString;
  public varType: VarTypeString;
  public name: string;
  public nameDisplay: string;
  public defaultValue: VarNodeValue;
  public readonly: boolean;
  public children: VarNode[];
  public index: number;
  public config: VarNodeConfig;
  public iconPath?: string; // **新增：图标路径，用于显示在UI上**

  /**
   * 当前值，object，可读写
   */
  private _currentValue: VarNodeValue = {};

  /**
   * 构造函数
   * @param {NodeTypeString} nodeType - 节点类型："dict"|"list"|"leaf"
   * @param {VarTypeString} varType - 变量类型：对应组件的变量类型
   * @param {string} name - 变量名称，留空时自动生成
   * @param {string} nameDisplay - 变量名称，留空时自动生成
   * @param {VarNodeValue} defaultValue - 默认值
   * @param {boolean} readonly - 是否只读
   * @param {VarNode[]} children - 子节点数组
   * @param {VarNodeConfig} config - 其他配置参数，钩子等
   * @param {string} iconPath - **新增：图标路径**
   */
  constructor(
    nodeType: NodeTypeString = 'leaf',
    varType: VarTypeString = 'string',
    name: string = '',
    defaultValue: VarNodeValue = null,
    readonly: boolean = false,
    children: VarNode[] = [],
    config: VarNodeValue = {},
    nameDisplay?: string,
    iconPath?: string, // **新增参数**
  ) {
    this.nodeType = nodeType // "dict"|"list"|"leaf"
    this.varType = varType   // 对应组件的变量类型
    this.name = name         // 变量名称
    this.nameDisplay = nameDisplay || "" // 显示名称，默认为name
    this.defaultValue = defaultValue
    this.readonly = readonly
    this.children = children || []
    this.index = -1          // 中序遍历位置，由VarTree初始化时设置
    this.config = config || {} // 自定义配置参数
    this.iconPath = iconPath; // **新增：设置iconPath**
    // this._currentValue = defaultValue; // 初始化object
    if (this.nodeType === 'leaf') {
      this.currentValue = defaultValue; // 设置初始值
    }
  }

  /**
   * 获取当前值（自动聚合子节点）
   */
  get currentValue(): VarNodeValue {
    if (this.nodeType === 'dict') {
      // 聚合dict类型的子节点
      const result: { [key: string]: VarNodeValue } = {}
      this.children.forEach(child => {
        result[child.name] = child.currentValue // 递归获取子节点的当前值
      })
      return result
    }
    if (this.nodeType === 'list') {
      // 聚合list类型的子节点
      return this.children.map(child => child.currentValue) // 递归获取子节点的当前值
    }
    // leaf节点直接返回当前值
    return this._currentValue; // 递归结束
  }

  /**
   * 设置当前值（自动分发到子节点）
   */
  set currentValue(val: VarNodeValue) {
    if (this.nodeType === 'dict' && typeof val === 'object' && val !== null) {
      this.children.forEach(child => {
        if (val.hasOwnProperty(child.name)) {
          child.currentValue = val[child.name as keyof typeof val]
        }
      })
    } else if (this.nodeType === 'list' && Array.isArray(val)) {
      const deletions: VarNode[] = [];
      this.children.forEach((child, index) => {
        if (index < val.length) {
          child.currentValue = val[index]
        } else {
          child.currentValue = null;
          deletions.push(child);
        }
      })
      this.children = this.children.filter(child => !deletions.includes(child));

      for (let i = this.children.length; i < val.length; i++) {
        // 创建新子节点时，传递父节点的 varType, readonly, config, nameDisplay, iconPath
        const newChild = new VarNode('leaf', this.varType, '', val[i], this.readonly, [], this.config, this.nameDisplay, this.iconPath) // **传递 iconPath**
        this.children.push(newChild)
      }
    } else {
      this._currentValue = val;
    }
  }

  /**
   * 读值
   */
  getValue(): VarNodeValue {
    return this.currentValue
  }

  /**
   * 读值
   * @param {VarNodeValue} newValue
   */
  setValue(newValue: VarNodeValue): void {
    this.currentValue = newValue
  }

  /**
   * 添加子节点
   * @param {VarNode} child 
   */
  addChild(child: VarNode): void {
    this.children.push(child)
  }

  /**
   * 移除子节点
   * @param {number} index
   */
  removeChild(index: number): void {
    if (index >= 0 && index < this.children.length) {
      this.children.splice(index, 1)
    }
  }

  /**
   * 是否为叶子节点
   * @returns {boolean}
   */
  isLeaf(): boolean {
    return this.nodeType === 'leaf'
  }

  /**
   * 获取显示名称
   * @returns {string}
   */
  getNameDisplay(): string {
    if (this.nameDisplay == ""){
      return this.name || ''
    }
    return this.nameDisplay;
  }

  /**
   * 克隆节点
   * @returns {VarNode}
   */
  clone(): VarNode {
    const clonedChildren: VarNode[] = this.children.map(child => child.clone())
    const node = new VarNode(
      this.nodeType,
      this.varType,
      this.name,
      this.defaultValue,
      this.readonly,
      clonedChildren,
      { ...this.config }, // 深拷贝config对象
      this.nameDisplay, // 传递 nameDisplay
      this.iconPath // **新增：传递 iconPath**
    )
    if(node.nodeType==='leaf'){
      node.currentValue = this.currentValue
    }
    return node
  }

  /**
   * 返回一个模板节点
   * 清空所有子节点的值，保留类型和配置
   * @returns {VarNode}
   */
  template(): VarNode {
    const clearedChildren: VarNode[] = this.children.map(child => {
      if (child.isLeaf()) {
        // 创建叶子节点模板时也传递 iconPath
        return new VarNode(child.nodeType, child.varType, child.name, null, child.readonly, [], child.config, child.nameDisplay, child.iconPath) // **新增：传递 iconPath**
      } else {
        return child.template() // 递归清空子节点
      }
    })
    return new VarNode(
      this.nodeType,
      this.varType,
      this.name,
      null,
      this.readonly,
      clearedChildren,
      { ...this.config }, // 深拷贝config对象
      this.nameDisplay, // 传递 nameDisplay
      this.iconPath // **新增：传递 iconPath**
    )
  }
}

/**
 * VarTree类：变量结构树
 * 由VarNode为节点组成的树结构
 */
export class VarTree {
  public root: VarNode | null;
  public nodeIndex: number;
  
  /**
   * 构造函数
   * @param {VarNode} rootNode - 根节点
   */
  constructor(rootNode: VarNode | null = null) {
    this.root = rootNode
    this.nodeIndex = 0 // 用于生成默认变量名和索引
    
    // 如果有根节点，立即初始化索引和名称
    if (this.root) {
      this._initializeTree()
    }
  }

  /**
   * 读值
   */
  getValue(): any {
    if(!this.root) return {}
    return this.root.currentValue
  }

  /**
   * 读值
   * @param {VarNodeValue} newValue
   */
  setValue(newValue: VarNodeValue): void {
    if(!this.root) {
      return
    }
    this.root.currentValue = newValue
  }

  /**
   * 设置根节点
   * @param {VarNode} rootNode 
   */
  setRoot(rootNode: VarNode | null): void {
    this.root = rootNode
    this._initializeTree()
  }


  getChildren(node: VarNode): VarNode[] {
    if (!node || !node.children) {
      return []
    } else if (node.nodeType === 'dict') {
      // 返回字典类型的子节点
      return node.children.filter(child => child.nodeType !== 'leaf')
    }
    else if (node.nodeType === 'list') {
      // 返回列表类型的子节点
      return node.children.filter(child => child.nodeType !== 'leaf')
    }
    else {
      // 返回叶子节点的子节点（通常为空）
      return []
    }
  }

  /**
   * 获取根节点
   */
  getRoot(): VarNode | null {
    return this.root
  }

  /**
   * 克隆根节点
   */
  cloneRoot(): VarNode | null {
    if (!this.root) return null
    return this.root.clone()
  }

  /**
   * 初始化树结构（设置索引和默认名称）
   * @private
   */
  _initializeTree() {
    this.nodeIndex = 0
    if (this.root) {
      this._inorderTraversal(this.root)
    }
  }

  /**
   * 中序遍历设置索引和默认名称
   * @param {VarNode} node 
   * @private
   */
  _inorderTraversal(node: VarNode) {
    if ( !node ) {
      return
    }

    // 为字典类型的子节点遍历
    if (node.nodeType === 'dict' && node.children) {
      for (const child of node.children) {
        this._inorderTraversal(child)
      }
    }
    
    // 为列表类型的子节点遍历
    if (node.nodeType === 'list' && node.children) {
      for (const child of node.children) {
        this._inorderTraversal(child)
      }
    }

    // 设置节点索引
    node.index = this.nodeIndex++
    
    // 如果名称为空，设置默认名称
    if (!node.name) {
      node.name = `value_${node.index}`
    }
  }

  /**
   * 获取所有节点（前序遍历）
   * @returns {VarNode[]}
   */
  getAllNodes(): VarNode[] {
    const nodes: VarNode[] = []
    if (this.root) {
      this._preorderTraversal(this.root, nodes)
    }
    return nodes
  }

  /**
   * 前序遍历收集节点
   * @param {VarNode} node 
   * @param {VarNode[]} nodes 
   * @private
   */
  _preorderTraversal(node: VarNode, nodes: VarNode[]): void {
    if (!node) return

    nodes.push(node)

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this._preorderTraversal(child, nodes)
      }
    }
  }

  /**
   * 根据路径查找节点
   * @param {string[]} path - 节点路径
   * @returns {VarNode|null}
   */
  findNodeByPath(path: string[]): VarNode | null {
    if (!this.root || !path || path.length === 0) {
      return this.root
    }
  
    let currentNode = this.root
    
    for (const pathSegment of path) {
      if (!currentNode || !currentNode.children) {
        return null
      }
      
      // 根据节点类型查找子节点
      if (currentNode.nodeType === 'dict') {
        currentNode = currentNode.children.find(child => child.name === pathSegment) as VarNode
      } else if (currentNode.nodeType === 'list') {
        const index = parseInt(pathSegment)
        currentNode = currentNode.children[index]
      }
      
      if (!currentNode) {
        return null
      }
    }
    
    return currentNode
  }

  /**
   * 根据节点查找路径，深度优先查找，请尽量不要在响应式变量里调用
   * @param {VarNode} targetNode - 目标节点
   * @returns {string[]|null} - 返回从根节点到目标节点的路径，如果未找到则返回 null
   */
  findPathToNode(targetNode: VarNode): string[] | null {
    if (!this.root) {
      return null;
    }

    // DFS
    const dfs = (currentNode: VarNode, currentPath: string[]): string[] | null => {
      // 如果当前节点就是目标节点，则返回当前路径
      if (currentNode === targetNode) {
        return currentPath;
      }

      // 遍历子节点
      if (currentNode.children && currentNode.children.length > 0) {
        for (let i = 0; i < currentNode.children.length; i++) {
          const child = currentNode.children[i];
          let nextSegment: string;

          // 根据父节点的类型决定路径片段
          if (currentNode.nodeType === 'dict') {
            nextSegment = child.name; // 字典用子节点的名字
          } else if (currentNode.nodeType === 'list') {
            nextSegment = String(i); // 列表用子节点的索引
          } else {
            // 如果父节点是叶子节点，则不应该有子节点，跳过
            continue;
          }

          const result = dfs(child, [...currentPath, nextSegment]);
          if (result) {
            return result; // 找到路径，立即返回
          }
        }
      }

      return null; // 未在当前路径下找到
    };

    // 从根节点开始搜索
    return dfs(this.root, []);
  }
}

// 内容检查函数集合
export const validators = {
  // 日期格式检查
  date: (value: any) => {
    if (!value) { return true } // 允许空值
    const date = new Date(value)
    return !isNaN(date.getTime())
  },
  
  // 数字检查
  number: (value: any) => {
    if (value === '' || value === null || value === undefined) {
      return true
    }
    return !isNaN(Number(value))
  },
  
  // 非空检查
  required: (value: any) => {
    return value !== undefined && value !== null && value !== ''
  },
  
  // 邮箱格式检查
  email: (value: any) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  // URL格式检查
  url: (value: any) => {
    if (!value) return true
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
}

/**
 * 从配置对象创建VarNode
 * @param {NodeStructure} struct - 配置对象
 * @returns {VarNode}
 */
export function createNodeFromConfig(struct: NodeStructure): VarNode {
  const {
    varType = 'string', // 默认类型为string
    nodeType = varType === 'dict' ? 'dict' : varType === 'dynamiclist' || varType === 'fixlist' ? 'list' : 'leaf',
    name = '',
    nameDisplay = '',
    defaultValue = null,
    readonly = false,
    config = {},
    children,
    iconPath = '' // **新增：从 struct 中解构出 iconPath**
  } = struct
  
  // 支持children为对象（dict）或数组（list）
  let childNodes: VarNode[] = []
  if (nodeType === 'dict' && children && typeof children === 'object' && !Array.isArray(children)) {
    childNodes = Object.entries(children).map(([key, child]) => {
      // 保证子节点name属性
      if (typeof child === 'object' && child !== null) {
        // 保证varType存在，优先(child as any).type/(child as any).varType，否则默认为'string'
        const c: any = child
        const childStruct = { 
          name: key, 
          varType: c.type ?? c.varType ?? 'string', 
          ...c,
          iconPath: c.iconPath || '' // **新增：递归创建子节点时传递 iconPath**
        }
        return createNodeFromConfig(childStruct)
      }
      // 如果 child 不是对象，而是原始值，为其创建叶子节点，并传递 iconPath
      return createNodeFromConfig({ 
        name: key, 
        varType: 'string', 
        defaultValue: String(child),
        iconPath: (child as any).iconPath || '' // **新增：如果原始值有 iconPath**
      })
    })
    // **新增：将 iconPath 传递给 VarNode 构造函数**
    return new VarNode(nodeType, varType, name, defaultValue, readonly, childNodes, config, nameDisplay, iconPath)
  }
  if (Array.isArray(children) && children.length > 0 && nodeType !== 'leaf') {
    childNodes = children.map(child => createNodeFromConfig(child))
    // **新增：将 iconPath 传递给 VarNode 构造函数**
    return new VarNode(nodeType, varType, name, defaultValue, readonly, childNodes, config, nameDisplay, iconPath)
  }
  // leaf节点或无children
  // **新增：将 iconPath 传递给 VarNode 构造函数**
  return new VarNode(nodeType, varType, name, defaultValue, readonly, [], config, nameDisplay, iconPath)
}

export function createTreeFromConfig(struct: NodeStructure): VarTree {
  const rootNode = createNodeFromConfig(struct)
  const tree = new VarTree(rootNode)
  tree._initializeTree() // 初始化树结构
  return tree
}

// // 示例nodeStructure：
// const simpleNodeStructure: NodeStructure = {
//   varType: 'string',
//   nodeType: 'leaf',
//   name: 'exampleString',
//   defaultValue: 'Hello, World!',
//   readonly: false,
//   config: {},
//   children: [],
//   iconPath: 'path/to/simple-icon.svg' // **示例新增**
// }
// const complexNodeStructure: NodeStructure = {
//   varType: 'dict',
//   nodeType: 'dict',
//   name: 'userProfile',
//   defaultValue: null,
//   readonly: false,
//   config: {},
//   iconPath: 'path/to/user-profile-icon.svg', // **示例新增**
//   children: [
//     {
//       varType: 'string',
//       nodeType: 'leaf',
//       name: 'username',
//       defaultValue: 'JohnDoe',
//       readonly: false,
//       iconPath: 'path/to/username-icon.svg' // **示例新增**
//     },
//     {
//       varType: 'number',
//       nodeType: 'leaf',
//       name: 'age',
//       defaultValue: 30,
//       readonly: false
//     },
//     {
//       varType: 'dict',
//       nodeType: 'dict',
//       name: 'address',
//       defaultValue: null,
//       readonly: false,
//       iconPath: 'path/to/address-icon.svg', // **示例新增**
//       children: [
//         {
//           varType: 'string',
//           nodeType: 'leaf',
//           name: 'city',
//           defaultValue: 'New York',
//           readonly: false
//         },
//         {
//           varType: 'string',
//           nodeType: 'leaf',
//           name: 'country',
//           defaultValue: 'USA',
//           readonly: false
//         }
//       ]
//     },
//     {
//       varType: 'dynamiclist',
//       nodeType: 'list',
//       name: 'hobbies',
//       defaultValue: [],
//       readonly: false,
//       iconPath: 'path/to/hobbies-icon.svg', // **示例新增**
//       children: [
//         {
//           varType: 'string',
//           nodeType: 'leaf',
//           name: '',
//           defaultValue: '',
//           readonly: false
//         }
//       ]
//     }
//   ]
// }

// 快速创建，使用元组创建一个NodeStructure对象
export function createNodeStructure(
  varType: VarTypeString,
  nodeType: NodeTypeString = 'leaf',
  name: string = '',
  defaultValue: VarNodeValue = null,
  readonly: boolean = false,
  config: VarNodeConfig = {},
  children: NodeStructure[] = [],
  nameDisplay:string = '',
  iconPath: string = '' // **新增参数**
): NodeStructure {
  return {
    varType,
    nodeType,
    name,
    defaultValue,
    readonly,
    config,
    children,
    nameDisplay,
    iconPath // **新增：返回对象中包含 iconPath**
  }
}
export const cns = createNodeStructure

export function isNodeStructure(obj: any): obj is NodeStructure {
  if (obj?.children && Array.isArray(obj.children)){
    for (const child of obj.children) {
      if (!isNodeStructure(child)) {
        return false
      }
    }
  }
  return obj && typeof obj === 'object' && 'varType' in obj && 'nodeType' in obj
}
// // example:
// const exampleNode: NodeStructure = 
// cns('string','leaf','exampleString','Hello, World!',false,{},[],'', 'path/to/icon.svg' // **示例：新增 iconPath**
// )
// // 嵌套结构示例
// const exampleComplexNode: NodeStructure = cns('dict', 'dict', 'parentDict', null, false, {}, [
//   cns('string', 'leaf', 'childString', 'Child Value', false, {}, [], '', 'path/to/child-icon.svg'), // **示例：子节点新增 iconPath**
//   cns('number', 'leaf', 'childNumber', 123, false)
// ], '', 'path/to/parent-icon.svg'); // **示例：父节点新增 iconPath**