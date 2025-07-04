import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
// 告诉 TypeScript：

// 我要用 JSX 写法（像 <div>Hello</div>）在 Vue 项目里。
// JSX 标签（像 <div>）是 Vue 的网页内容（VNode）。
// 自定义组件（像 <MyComponent>）是 Vue 组件（Vue）。
// 任何 HTML 标签和属性都允许，别报错。
// 这些规则全项目都有效。
// 效果：你可以在 .tsx 文件里写 <div>Hello</div> 或 <MyComponent />，TypeScript 不会报错，代码能正常跑。