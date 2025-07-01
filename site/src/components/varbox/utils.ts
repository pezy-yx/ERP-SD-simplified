import { VarTree } from "@/utils/VarTree";
export function getPathString(tree: VarTree ,path: string[]): string {
  // 用-连接，元素的-和.用.转义
  if(!tree.root){
    return "no root"
  }
  if(path.length == 0){
    return escape(tree.root.name)
  }
  return escape(tree.root.name) + "-" + path
    .map(segment => escape(segment))
    .join('-');
}
function escape(s:string):string {
  return s.replace(/[-.]/g, m => '.' + m)
}

// const test = computed<string>(()=>{
//   if(props.tree == undefined){
//     return "no tree"
//   }
//   if(props.node == undefined){
//     return "no node"
//   }
//   const paths = props.tree.findPathToNode(props.node)
//   if(!paths){
//     return "dfs failed"
//   }
//   return getPathString(paths)
// })