export function getPathString(path: string[]): string {
  // 用-连接，元素的-和.用.转义
  return path
    .map(segment => segment.replace(/[-.]/g, m => '.' + m))
    .join('-');
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