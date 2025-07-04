module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
// Babel 的配置文件，告诉 Babel 使用 Vue CLI 提供的预设来编译项目中的 JavaScript 和 JSX 代码
// 它确保：
// 1.现代 JavaScript 语法被转成浏览器兼容的代码
// 2.Vue 单文件组件的 <script> 部分被正确处理
// 3.JSX（如果使用）被转成 Vue 的 h 函数