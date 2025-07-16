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

export type SelectableDependingOn = (
  node?: VarNode,
  parent?: VarNode,
  tree?: VarTree
) => boolean

export type VarNodeConfig = {
  /**
   * @description 自定义组件钩子
   */
  customComponent?: Component;

  /**
   * @description 验证钩子
   * @example [{creteria: (v) => typeof v === 'string' && v.length > 0, message: '不能为空'}]
   */
  validators?: VarNodeValueValidators; // 内容检查函数集合

  // 值相关参数
  /**
   * @description 最小日期（ISO格式）
   * @example "2024-01-01"
   */
  minDate?: string; // 
  /**
   * @description 最大日期（ISO格式）
   * @example "2024-01-01"
   */
  maxDate?: string;
  /**
   * @description 选项列表（用于selection类型）
   * @example ["选项1", "选项2", "选项3"]
   */
  options?: string[];

  // 搜索相关参数
  /**
   * @description 搜索方法配置
   * @description 如果有配置，将显示搜索按钮
   * @example [{name: "搜索方法1", paramTree: null, serviceUrl: "/api/search/1"}, {name: "搜索方法2", paramTree: null, serviceUrl: "/api/search/2"}]
   */
  searchMethods?: SearchMethod[] | null;
  /**
   * @description 自定义搜索结果处理函数
   * @description 如果有配置，将覆盖默认的搜索结果处理逻辑
   * @param {SearchResult} data - 搜索结果数据
   * @param {VarNode} currentNode - 当前节点
   * @example (data, currentNode) => {console.log(data, currentNode)}
   */
  customSearchResultHandler?: SearchResultHandler; // 自定义搜索结果处理函数

  // 显示相关参数
  // parent
  /**
   * @description 隐藏列表，用于父节点，决定哪些子节点不显示，优先级低于showWhiteList
   * @example ["需要隐藏的子节点name1", "需要隐藏的子节点name2"]
   */
  hideList?: string[];
  /**
   * @description 显示白名单，用于父节点，决定只有哪些子节点显示，优先级高于hideList
   * @example ["只需要显示的子节点name1", "只需要显示的子节点name2"]
   */
  showWhiteList?: string[];
  /**
   * @description 子节点名称显示翻译，用于父节点，决定子节点名称的显示
   * @example {name1: "显示名称1", name2: "显示名称2"}
   */
  childNameDisplayTranslation?: Record<string, string>;
  // child
  /**
   * @description CSS类名前缀，用于自定义布局样式
   * @example "custom-class-prefix"
   */
  classPrefix?: string; // CSS类名前缀，用于自定义布局样式
  /**
   * @description 是否隐藏当前的Label
   */
  hideLabel?: boolean; // 是否隐藏当前的Label
  /**
   * @description 是否在父节点下隐藏当前节点
   */
  hideSelf?: boolean;

  // 动态列表-表格形式 相关参数
  // parent
  /**
   * @description 动态列表，用于父节点，决定动态列表子节点的模板
   * @description 动态列表必填参数
   * @example {varType: 'dict', children: [{varType: 'string', name: 'name'}, {varType: 'string', name: 'age'}]}
   */
  childTemplate?: NodeStructure; // 子节点模板，用于动态列表
  /**
   * @description 动态列表，用于父节点，决定动态列表最大行数，缺省为Infinity
   */
  maxLength?: number; // 最大长度，用于动态列表
  /**
   * @description 动态列表，用于父节点，决定动态列表初始行数，缺省为3
   */
  rowProvided?: number;
  /**
   * @description 动态列表，用于父节点，决定选择列是否可用的函数
   * @description 如果返回false，选择列将不可用
   * @param {VarNode} [node] 当前节点 可选
   * @param {VarNode} [parent] 父节点
   * @param {VarTree} [tree] 整个树
   * @returns {boolean} true为可用，false为不可用
   * @example (node, parent, tree) => {return true}
   * @example (node, parent, tree) => {return node.getValue().columnA == 'magic value'}
   */
  selectableDependingOn?: SelectableDependingOn;
  // child
  /**
   * @description 动态列表，用于子节点，记录是否被选中
   * @description 高频读写
   */
  selected?: boolean; // 是否为选中状态

  /**
   * @description 用于读写任意数据，适用于较为独特的场景
   * 
   * ### 推荐使用场景
   * - 需要将一些状态与VarNode绑定，但又不想污染VarNode的值
   * - 需要将一些状态与VarNode绑定，但不限制于boolean/string/number类型
   * - 需要将一些状态与VarNode绑定，但又不想使用Vue的响应式系统
   * 
   * 高频场景建议在VarNodeConfig中添加一个字段，写清说明
   */
  data?: any //
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
    config: VarNodeConfig | null = null,
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
    this.config = config ? { ...config } : {} // 创建新的config对象，避免引用共享
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
        const newChild = new VarNode('leaf', this.varType, '', val[i], this.readonly, [], { ...this.config }, this.nameDisplay, this.iconPath) // **传递 iconPath**
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
   * 强制设置值，会覆盖所有字段包括缺省字段
   * @param {VarNodeValue} newValue
   */
  forceSetValue(newValue: VarNodeValue): void {
    if (this.nodeType === 'dict' && typeof newValue === 'object' && newValue !== null) {
      // 对于字典类型，强制设置所有子节点
      for (const child of this.children) {
        const childValue = (newValue as any)[child.name]
        if (childValue !== undefined) {
          child.forceSetValue(childValue)
        } else {
          // 对于list类型的子节点，如果没有数据就清空，不设置默认值
          if (child.nodeType === 'list') {
            child.children = []
          } else {
            // 对于非list类型，设置为默认值
            child.forceSetValue(child.defaultValue)
          }
        }
      }
    } else if (this.nodeType === 'list' && Array.isArray(newValue)) {
      // 对于列表类型，清空现有子节点并重新创建
      this.children = []
      for (let i = 0; i < newValue.length; i++) {
        if (this.config?.childTemplate) {
          const newChild = createNodeFromConfig(this.config.childTemplate).clone()
          if (newChild) {
            newChild.forceSetValue(newValue[i])
            this.addChild(newChild)
          }
        } else {
          const newChild = new VarNode('leaf', this.varType, '', null, this.readonly, [], { ...this.config }, '', this.iconPath)
          newChild.forceSetValue(newValue[i])
          this.addChild(newChild)
        }
      }
    } else {
      // 对于叶子节点，直接设置值
      this.currentValue = newValue
    }
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
   * @description 拿到选中的child节点
   */
  getSelectedChildren(): VarNode[] {
    return this.children.filter(child => child.config.selected)
  }

  /**
   * @description 设置是否被选中
   * @param value
   */
  setSelection(value: boolean): void {
    this.config.selected = value
  }

  /**
   * @description 选择子节点
   * @param index
   * @param value
   */
  selectChild(index:number, value: boolean): void {
    if (this.children.length <= index || index<0) {
      return
    }
    this.children[index].setSelection(value)
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
        return new VarNode(child.nodeType, child.varType, child.name, null, child.readonly, [], { ...child.config }, child.nameDisplay, child.iconPath) // **新增：传递 iconPath**
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

  /**
   * 根据路径查找节点
   * @param {string[]} path - 节点路径
   * @returns {VarNode|null}
   */
  findNodeByPath(path: string[]): VarNode | null {
    if (!this || !path || path.length === 0) {
      return this
    }
  
    let currentNode: VarNode = this
    
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
   * 写值
   * @param {VarNodeValue} newValue
   */
  setValue(newValue: VarNodeValue): void {
    if(!this.root) {
      return
    }
    this.root.currentValue = newValue
  }

  /**
   * 强制设置值，会覆盖所有字段包括缺省字段
   * @param {VarNodeValue} newValue
   */
  forceSetValue(newValue: VarNodeValue): void {
    if(!this.root) {
      return
    }
    this.root.forceSetValue(newValue)
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
   * @description 通过json设置值，缺省的节点不覆盖为空，和setValue有区别
   * @param {VarNodeValue} newValue
   */
  setValueByJson(newValue: VarNodeValue): void {
    if(!this.root) {
      return
    }
    this._setValueByJson(this.root, newValue)
  }

  /**
   * @description 通过json设置值，缺省的节点不覆盖为空，和setValue有区别
   * @param {VarNode} node 
   * @param {VarNodeValue} newValue
   * @private
   */
  _setValueByJson(node: VarNode, newValue: VarNodeValue): void {
    if (node.nodeType === 'dict' && typeof newValue === 'object' && newValue !== null) {
      for (const key in newValue) {
        const child = node.children.find(child => child.name === key)
        if (child) {
          this._setValueByJson(child, newValue[key as keyof typeof newValue])
        }
      }
    } else if (node.nodeType === 'list' && Array.isArray(newValue)) {
      for (let i = 0; i < newValue.length; i++) {
        if (node.children[i]) {
          this._setValueByJson(node.children[i], newValue[i])
        } else {
          if (!node.config?.childTemplate) {
            const newChild = new VarNode('leaf', node.varType, '', null, node.readonly, [], { ...node.config }, '', node.iconPath)
            newChild.setValue(newValue[i])
            node.addChild(newChild)
          }else {
            const newChild = createNodeFromConfig(node.config.childTemplate).clone()
            if (newChild) {
              newChild.setValue(newValue[i])
              node.addChild(newChild)
            }
          }
        }
      }
    } else if (node.nodeType === 'leaf') {
      node.currentValue = newValue
    }
  }

  /**
   * @description 设置节点，引用设置
   * @param sourceNode - 要替换的源节点
   * @param targetPath - 目标路径
   */
  replaceNodeByPath(sourceNode: VarNode, targetPath: string[]): void {
    if (!this.root || !targetPath || targetPath.length === 0) {
      // 如果路径为空，替换根节点
      this.root = sourceNode
      this._initializeTree()
      return
    }

    // 如果只有一个路径段，说明要替换根节点的直接子节点
    if (targetPath.length === 1) {
      if (!this.root.children) {
        this.root.children = []
      }
      
      const pathSegment = targetPath[0]
      
      if (this.root.nodeType === 'dict') {
        // 查找是否已存在该名称的子节点
        const existingIndex = this.root.children.findIndex(child => child.name === pathSegment)
        if (existingIndex !== -1) {
          // 替换现有节点
          this.root.children[existingIndex] = sourceNode
        } else {
          // 添加新节点
          sourceNode.name = pathSegment
          this.root.children.push(sourceNode)
        }
      } else if (this.root.nodeType === 'list') {
        const index = parseInt(pathSegment)
        if (isNaN(index) || index < 0) {
          throw new Error(`Invalid list index: ${pathSegment}`)
        }
        
        // 扩展数组到所需长度
        while (this.root.children.length <= index) {
          this.root.children.push(new VarNode())
        }
        
        this.root.children[index] = sourceNode
      }
      
      this._initializeTree()
      return
    }

    // 多层路径，需要找到父节点
    const parentPath = targetPath.slice(0, -1)
    const lastSegment = targetPath[targetPath.length - 1]
    
    const parentNode = this.findNodeByPath(parentPath)
    if (!parentNode) {
      throw new Error(`Parent node not found at path: ${parentPath.join('/')}`)
    }

    if (!parentNode.children) {
      parentNode.children = []
    }

    if (parentNode.nodeType === 'dict') {
      // 查找是否已存在该名称的子节点
      const existingIndex = parentNode.children.findIndex(child => child.name === lastSegment)
      if (existingIndex !== -1) {
        // 替换现有节点
        parentNode.children[existingIndex] = sourceNode
      } else {
        // 添加新节点
        sourceNode.name = lastSegment
        parentNode.children.push(sourceNode)
      }
    } else if (parentNode.nodeType === 'list') {
      const index = parseInt(lastSegment)
      if (isNaN(index) || index < 0) {
        throw new Error(`Invalid list index: ${lastSegment}`)
      }
      
      // 扩展数组到所需长度
      while (parentNode.children.length <= index) {
        parentNode.children.push(new VarNode())
      }
      
      parentNode.children[index] = sourceNode
    } else {
      throw new Error(`Cannot add child to leaf node at path: ${parentPath.join('/')}`)
    }

    this._initializeTree()
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
    config = null,
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
  config: VarNodeConfig | null = null,
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
    config: config || {},
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