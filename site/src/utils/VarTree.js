/**
 * VarNode类：变量节点
 * 每个节点包含类型、名称、默认值、只读状态和子节点
 */
export class VarNode {
  /**
   * 构造函数
   * @param {string} nodeType - 节点类型："dict"|"list"|"leaf"
   * @param {string} varType - 变量类型：对应组件的变量类型
   * @param {string} name - 变量名称，留空时自动生成
   * @param {any} defaultValue - 默认值
   * @param {boolean} readonly - 是否只读
   * @param {VarNode[]} children - 子节点数组
   */
  constructor(nodeType = 'leaf', varType = 'string', name = '', defaultValue = null, readonly = false, children = []) {
    this.nodeType = nodeType // "dict"|"list"|"leaf"
    this.varType = varType   // 对应组件的变量类型
    this.name = name         // 变量名称
    this.defaultValue = defaultValue
    this.readonly = readonly
    this.children = children || []
    this.index = -1          // 中序遍历位置，由VarTree初始化时设置
  }

  /**
   * 添加子节点
   * @param {VarNode} child 
   */
  addChild(child) {
    this.children.push(child)
  }

  /**
   * 移除子节点
   * @param {number} index 
   */
  removeChild(index) {
    if (index >= 0 && index < this.children.length) {
      this.children.splice(index, 1)
    }
  }

  /**
   * 是否为叶子节点
   * @returns {boolean}
   */
  isLeaf() {
    return this.nodeType === 'leaf'
  }

  /**
   * 克隆节点
   * @returns {VarNode}
   */
  clone() {
    const clonedChildren = this.children.map(child => child.clone())
    return new VarNode(
      this.nodeType,
      this.varType,
      this.name,
      this.defaultValue,
      this.readonly,
      clonedChildren
    )
  }
}

/**
 * VarTree类：变量结构树
 * 由VarNode为节点组成的树结构
 */
export class VarTree {
  /**
   * 构造函数
   * @param {VarNode} rootNode - 根节点
   */
  constructor(rootNode = null) {
    this.root = rootNode
    this.nodeIndex = 0 // 用于生成默认变量名和索引
    
    // 如果有根节点，立即初始化索引和名称
    if (this.root) {
      this._initializeTree()
    }
  }

  /**
   * 设置根节点
   * @param {VarNode} rootNode 
   */
  setRoot(rootNode) {
    this.root = rootNode
    this._initializeTree()
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
  _inorderTraversal(node) {
    if (!node) return

    // 为字典类型的子节点遍历
    if (node.nodeType === 'dict' && node.children) {
      for (let child of node.children) {
        this._inorderTraversal(child)
      }
    }
    
    // 为列表类型的子节点遍历
    if (node.nodeType === 'list' && node.children) {
      for (let child of node.children) {
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
  getAllNodes() {
    const nodes = []
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
  _preorderTraversal(node, nodes) {
    if (!node) return
    
    nodes.push(node)
    
    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        this._preorderTraversal(child, nodes)
      }
    }
  }

  /**
   * 根据路径查找节点
   * @param {string[]} path - 节点路径
   * @returns {VarNode|null}
   */
  findNodeByPath(path) {
    if (!this.root || !path || path.length === 0) {
      return this.root
    }

    let currentNode = this.root
    
    for (let pathSegment of path) {
      if (!currentNode || !currentNode.children) {
        return null
      }
      
      // 根据节点类型查找子节点
      if (currentNode.nodeType === 'dict') {
        currentNode = currentNode.children.find(child => child.name === pathSegment)
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
   * 转换为JSON表示
   * @returns {Object}
   */
  toJSON() {
    return this.root ? this._nodeToJSON(this.root) : null
  }

  /**
   * 节点转JSON
   * @param {VarNode} node 
   * @returns {Object}
   * @private
   */
  _nodeToJSON(node) {
    const result = {
      nodeType: node.nodeType,
      varType: node.varType,
      name: node.name,
      defaultValue: node.defaultValue,
      readonly: node.readonly,
      index: node.index
    }

    if (node.children && node.children.length > 0) {
      if (node.nodeType === 'dict') {
        result.children = {}
        for (let child of node.children) {
          result.children[child.name] = this._nodeToJSON(child)
        }
      } else if (node.nodeType === 'list') {
        result.children = node.children.map(child => this._nodeToJSON(child))
      }
    }

    return result
  }

  /**
   * 从JSON创建VarTree
   * @param {Object} json 
   * @returns {VarTree}
   */
  static fromJSON(json) {
    if (!json) return new VarTree()
    
    const rootNode = VarTree._nodeFromJSON(json)
    return new VarTree(rootNode)
  }

  /**
   * 从JSON创建节点
   * @param {Object} json 
   * @returns {VarNode}
   * @private
   */
  static _nodeFromJSON(json) {
    const node = new VarNode(
      json.nodeType || 'leaf',
      json.varType || 'string',
      json.name || '',
      json.defaultValue,
      json.readonly || false
    )

    node.index = json.index || -1

    if (json.children) {
      if (json.nodeType === 'dict') {
        for (let childName in json.children) {
          const child = VarTree._nodeFromJSON(json.children[childName])
          node.addChild(child)
        }
      } else if (json.nodeType === 'list' && Array.isArray(json.children)) {
        for (let childJson of json.children) {
          const child = VarTree._nodeFromJSON(childJson)
          node.addChild(child)
        }
      }
    }

    return node
  }
}

// 内容检查函数集合
export const validators = {
  // 日期格式检查
  date: (value) => {
    if (!value) return true // 允许空值
    const date = new Date(value)
    return !isNaN(date.getTime())
  },

  // 数字检查
  number: (value) => {
    if (value === '' || value === null || value === undefined) return true
    return !isNaN(Number(value))
  },

  // 非空检查
  required: (value) => {
    return value !== undefined && value !== null && value !== ''
  },

  // 邮箱格式检查
  email: (value) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  // URL格式检查
  url: (value) => {
    if (!value) return true
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
}

// 工厂函数：快速创建常用节点
export const VarNodeFactory = {
  /**
   * 创建字符串叶子节点
   */
  createStringNode(name = '', defaultValue = '', readonly = false) {
    return new VarNode('leaf', 'string', name, defaultValue, readonly)
  },

  /**
   * 创建数字叶子节点
   */
  createNumberNode(name = '', defaultValue = 0, readonly = false) {
    return new VarNode('leaf', 'number', name, defaultValue, readonly)
  },

  /**
   * 创建日期叶子节点
   */
  createDateNode(name = '', defaultValue = '', readonly = false) {
    return new VarNode('leaf', 'date', name, defaultValue, readonly)
  },

  /**
   * 创建选择叶子节点
   */
  createSelectionNode(name = '', defaultValue = '', readonly = false) {
    return new VarNode('leaf', 'selection', name, defaultValue, readonly)
  },

  /**
   * 创建字典节点
   */
  createDictNode(name = '', children = [], readonly = false) {
    return new VarNode('dict', 'dict', name, null, readonly, children)
  },

  /**
   * 创建列表节点
   */
  createListNode(name = '', children = [], readonly = false, listType = 'fixlist') {
    return new VarNode('list', listType, name, null, readonly, children)
  }
}

/**
 * 从配置对象构建VarTree的便捷方法
 * @param {Object} config - 配置对象
 * @param {string} config.type - 变量类型
 * @param {string} [config.name] - 变量名称，留空则自动生成
 * @param {any} [config.defaultValue] - 默认值
 * @param {boolean} [config.readonly=false] - 是否只读
 * @param {Array|Object} [config.children] - 子节点配置
 * @returns {VarTree}
 *
 * @example
 * // 创建简单字符串
 * const tree = createVarTreeFromConfig({
 *   type: 'string',
 *   name: 'username',
 *   defaultValue: '张三'
 * })
 *
 * // 创建复杂字典结构
 * const complexTree = createVarTreeFromConfig({
 *   type: 'dict',
 *   name: 'user',
 *   children: {
 *     name: 'string',
 *     age: { type: 'number', defaultValue: 25 },
 *     address: {
 *       type: 'dict',
 *       children: {
 *         province: { type: 'string', defaultValue: '广东省' },
 *         city: 'string'
 *       }
 *     }
 *   }
 * })
 */
export function createVarTreeFromConfig(config) {
  const rootNode = createNodeFromConfig(config)
  return new VarTree(rootNode)
}

/**
 * 从配置对象创建VarNode
 * @param {Object} config - 配置对象
 * @returns {VarNode}
 */
function createNodeFromConfig(config) {
  const {
    type = 'string',
    name = '',
    defaultValue = null,
    readonly = false,
    children = null
  } = config

  // 根据type和children判断nodeType
  let nodeType = 'leaf'
  let varType = type
  let childNodes = []

  if (children) {
    if (Array.isArray(children)) {
      // 如果children是数组，创建list节点
      nodeType = 'list'
      varType = type || 'fixlist' // 默认为fixlist
      childNodes = children.map(childConfig => createNodeFromConfig(childConfig))
    } else if (typeof children === 'object') {
      // 如果children是对象，创建dict节点
      nodeType = 'dict'
      varType = type || 'dict'
      childNodes = Object.entries(children).map(([childName, childConfig]) => {
        // 如果childConfig是字符串，转换为完整配置
        if (typeof childConfig === 'string') {
          return createNodeFromConfig({
            type: childConfig,
            name: childName
          })
        }
        // 如果childConfig已经是对象，确保有name属性
        return createNodeFromConfig({
          ...childConfig,
          name: childConfig.name || childName
        })
      })
    }
  }

  return new VarNode(nodeType, varType, name, defaultValue, readonly, childNodes)
}