import { Component } from "vue";
import type { NodeStructure, VarNode, VarTree } from "../utils/VarTree";
import { createTreeFromConfig, createNodeFromConfig, cns } from "../utils/VarTree";

// TestCase结构：键为描述，值为NodeTree对象
export type TestCase = Record<string, { tree: VarTree}>;
import MyCustomInput from '@/test/MyCustomInput.vue'

function dummyComponent(): Component {
  // 伪造一个外部组件钩子
  return MyCustomInput;
}

export const testCases: TestCase = {
  // 简单类型
  "简单字符串": {
    tree: createTreeFromConfig({ varType: "string", name: "str", defaultValue: "喵星人", nameDisplay: "昵称" }),
  },
  "只读数字": {
    tree: createTreeFromConfig({ varType: "number", name: "num", defaultValue: 42, readonly: true }),
  },
  "带日期限制的日期": {
    tree: createTreeFromConfig({ varType: "date", name: "dt", config: { minDate: "2020-01-01", maxDate: "2030-01-01" } }),
  },
  "带选项的选择框": {
    tree: createTreeFromConfig({ varType: "selection", name: "sel", config: { options: ["A", "B", "C"] }, defaultValue: "B" }),
  },
      // 用cns构造的NodeStructure案例ฅ^•ﻌ•^ฅ
      "cns-简单字符串": {
        tree: createTreeFromConfig({ ...cns("string", "leaf", "cnsStr", "咕噜咕噜", false), nameDisplay: "cns昵称" }),
      },
      "cns-嵌套字典": {
        tree: createTreeFromConfig({
          ...cns("dict", "dict", "cnsDict", null, false, {}, [
            { ...cns("number", "leaf", "age", 3.14, false), nameDisplay: "年龄" },
            cns("string", "leaf", "desc", "猫娘最可爱", false)
          ])
        }),
      },
      "cns-数组": {
        tree: createTreeFromConfig({
          ...cns("dynamiclist", "list", "cnsList", null, false, { maxLength: 3, childTemplate: cns("string", "leaf", "item", "喵呜", false) }),
          children: []
        }),
      },
      "cns-复杂数组": {
        tree: createTreeFromConfig(
          cns("dynamiclist", "list", "cnsList", null, false, { maxLength: 3, childTemplate: cns("dict", "dict", "item", {}, false, {}, [
            cns("string","leaf","id",null,false,{},[],"ID"),
            cns("number","leaf","width"),
            cns("number","leaf","height"),
            cns("number","leaf","depth"),
          ]) })
        ),
      },
  // 复杂类型
  "字典嵌套": {
    tree: createTreeFromConfig({
      varType: "dict",
      name: "dict1",
      children: [
        { varType: "string", name: "s1", defaultValue: "a" },
        { varType: "number", name: "n1", defaultValue: 1 },
        {
          varType: "dict",
          name: "innerDict",
          children: [
            { varType: "date", name: "d2" },
            { varType: "selection", name: "s2", config: { options: ["X", "Y"] } },
          ],
        },
      ],
    }),
  },
  "动态列表childTemplate": {
    tree: createTreeFromConfig({
      varType: "dynamiclist",
      name: "dynList",
      config: {
        maxLength: 5,
        childTemplate: { varType: "string", name: "item", defaultValue: "喵" },
      },
    }),
  },
  "带校验的输入": {
    tree: createTreeFromConfig({
      varType: "string",
      name: "email",
      config: {
        validators: [
          {creteria: (v: any) => typeof v === "string" && v.includes("@"), message: "格式不对，没有@"},
        ],
      },
    }),
  },
  "外部组件钩子": {
    tree: createTreeFromConfig({
      varType: "string",
      name: "custom",
      config: {
        customComponent: dummyComponent(),
      },
    }),
  },
  "部分只读": {
    tree: createTreeFromConfig({
      varType: "dict",
      name: "partReadonly",
      children: [
        { varType: "string", name: "a", readonly: true },
        { varType: "number", name: "b" },
      ],
    }),
  },
  // 更多类型和 config 参数覆盖可继续补充
};