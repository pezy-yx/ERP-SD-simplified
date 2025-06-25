/**
 * 变量定义器类
 */
export class NameTree {
  constructor() {
    this.nodeIndex = 0; // 用于生成默认变量名
  }

  /**
   * 创建一个叶子节点
   * @param {string} type 变量类型
   * @param {string} name 变量名称（可选）
   * @param {any} defaultValue 默认值（可选）
   * @returns {Array} 节点元组
   */
  createLeaf(type, name = '', defaultValue = undefined) {
    const nodeName = name || `value_${this.nodeIndex++}`;
    return ['leaf', type, nodeName, defaultValue];
  }

  /**
   * 创建一个字典节点
   * @param {Object} children 子节点
   * @param {string} name 变量名称（可选）
   * @returns {Array} 节点元组
   */
  createDict(children, name = '') {
    const nodeName = name || `value_${this.nodeIndex++}`;
    return ['dict', 'dict', nodeName, children];
  }

  /**
   * 创建一个列表节点
   * @param {Array} children 子节点数组
   * @param {string} name 变量名称（可选）
   * @returns {Array} 节点元组
   */
  createList(children, name = '') {
    const nodeName = name || `value_${this.nodeIndex++}`;
    return ['list', 'list', nodeName, children];
  }
}

// 导出类型检查函数
export const validators = {
  // 日期格式检查
  date: (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  },

  // 数字检查
  number: (value) => {
    return !isNaN(Number(value));
  },

  // 非空检查
  required: (value) => {
    return value !== undefined && value !== null && value !== '';
  }
};