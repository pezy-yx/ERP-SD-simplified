import { Component } from "vue";
import type { NodeStructure, VarNode, VarTree } from "../../utils/VarTree";
import { createTreeFromConfig, createNodeFromConfig, cns } from "../../utils/VarTree";

// TestCase结构：键为描述，值为NodeTree对象
export type TestCase = Record<string, { tree: VarTree}>;
import MyCustomInput from '@/test/varbox/MyCustomInput.vue'

function dummyComponent(): Component {
  // 伪造一个外部组件钩子
  return MyCustomInput;
}

export const testCases: TestCase = {
  "客户": {
    tree: createTreeFromConfig(
      // ...cns("dict", "dict", "cnsDict", null, false, {}, [
      //   { ...cns("number", "leaf", "age", 3.14, false), nameDisplay: "年龄" },
      //   cns("string", "leaf", "desc", "111", false)
      // ])
      cns("dict","dict","all1",null,false,{hideLabel:true},[
        cns("dict","dict","name",null,false,{},[
          cns("string","leaf","title",null,false,{},[],"Title:"),
          cns("string","leaf","name",null,false,{},[],"Name:"),
        ],"Name"),
        cns("dict","dict","searchTerms",null,false,{},[
          cns("string","leaf","searchTerm",null,false,{},[],"Search Term:"),
        ],"Search Terms"),
        cns("dict","dict","address",null,false,{},[
          cns("string","leaf","street",null,false,{},[],"Street:"),
          cns("string","leaf","postalCode",null,false,{},[],"Postal Code:"),
          cns("string","leaf","city",null,false,{},[],"City:"),
        ],"Address"),
        cns("dynamiclist","list","testList",null,false,{
          childTemplate:createNodeFromConfig(cns("dict","dict","template",null,false,{},[
            cns("string","leaf","searchTerm",null,false,{},[],"Search Term"),
            cns("string","leaf","city",null,false,{},[],"City"),
            cns("string","leaf","postalCode",null,false,{},[],"Postal Code"),
            cns("string","leaf","searchTerm1",null,false,{},[],"Search Term"),
            cns("string","leaf","city1",null,false,{},[],"City"),
            cns("string","leaf","postalCode1",null,false,{},[],"Postal Code"),
            cns("string","leaf","searchTerm2",null,false,{},[],"Search Term"),
            cns("string","leaf","city2",null,false,{},[],"City"),
            cns("string","leaf","postalCode2",null,false,{},[],"Postal Code"),
            cns("string","leaf","searchTerm3",null,false,{},[],"Search Term"),
            cns("string","leaf","city3",null,false,{},[],"City"),
            cns("string","leaf","postalCode3",null,false,{},[],"Postal Code"),
          ]))
        },[],"表格渲染组件")
      ])
    ),
  },
  "客户2": {
    tree: createTreeFromConfig(
      // ...cns("dict", "dict", "cnsDict", null, false, {}, [
      //   { ...cns("number", "leaf", "age", 3.14, false), nameDisplay: "年龄" },
      //   cns("string", "leaf", "desc", "111", false)
      // ])
      cns("dict","dict","all",null,false,{},[
        cns("dict","dict","name",null,false,{},[
          cns("string","leaf","title",null,false,{},[],"Title:"),
          cns("string","leaf","name",null,false,{},[],"Name:"),
          cns("date","leaf","birthday",null,false,{},[],"Birthday:")
        ],"Name"),
        cns("dict","dict","searchTerms",null,false,{},[
          cns("string","leaf","searchTerm",null,false,{},[],"Search Term:"),
        ],"Search Terms"),
        cns("dict","dict","address",null,false,{},[
          cns("string","leaf","street",null,false,{},[],"Street:"),
          cns("string","leaf","postalCode",null,false,{},[],"Postal Code:"),
          cns("string","leaf","city",null,false,{},[],"City:"),
        ],"Address"),
      ])
    ),
  },
  "cns-嵌套字典": {
    tree: createTreeFromConfig({
      ...cns("dict", "dict", "cnsDict", null, false, {}, [
        { ...cns("number", "leaf", "age", 3.14, false), nameDisplay: "年龄" },
        cns("string", "leaf", "desc", "111", false)
      ])
    }),
  },
  "客户查询": {
    tree: createTreeFromConfig(
      cns("string", "leaf", "customer_id", null, false, {
        validators: [
          {
            creteria: (val: any) => typeof val === 'string' && /^\d{6}$/.test(val),
            message: "客户ID必须是六位数字"
          }
        ]
      })
    ),
  },
};