declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// TypeScript 默认不认识 .vue 文件
// TypeScript 主要为 JavaScript 文件（.js、.ts）设计
// 对于 Vue 的单文件组件（.vue 文件），它无法直接理解其结构和导出的内容
// 如果没有类型声明，导入 .vue 文件时 TypeScript 会报错
// 例如“无法找到模块 './App.vue'”
// shims-vue.d.ts 通过声明 '*.vue' 模块
// 为所有 .vue 文件提供了一个通用的类型定义
// 这样 TypeScript 就能识别 .vue 文件，知道它们导出一个 Vue 组件