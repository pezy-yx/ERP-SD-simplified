import { VarTree, VarNode, createTreeFromConfig, createNodeFromConfig, cns, type NodeStructure } from '@/utils/VarTree'
import { ref, computed, type Ref } from 'vue'
import {
  materialSearch,
} from '@/utils/searchMethods'

/**
 * ItemCondition 配套工具类配置
 */
export interface ItemConditionKitConfig {
  validationEndpoint: string
  readonly?: boolean
  navigationLabels?: {
    cancel?: string
    save?: string
    previous?: string
    next?: string
  }
  // 可选：页面层用于更新总计数据的回调（如 netValue/expectOralVal）
  onGeneralData?: (generalData: any) => void
  // 自定义详细信息页面结构
  detailStructures?: {
    header?: NodeStructure
    sales?: NodeStructure
    conditions?: NodeStructure
  }
}

/**
 * ItemCondition 配套工具类
 * 提供完整的 items 列表和详细信息管理功能
 */
export class ItemConditionKit {
  private config: ItemConditionKitConfig
  private itemsNodeRef: Ref<VarNode | null> = ref(null)
  private detailTrees: { header?: VarTree, sales?: VarTree, conditions?: VarTree } = {}

  // 默认的详细信息结构
  private static defaultDetailStructures = {
    header: cns('dict','dict','itemDetailHeader',{},true,{
      childNameDisplayTranslation: {
        item: 'Sales Document Item',
        material: 'Material'
      }
    },[
      cns('string','leaf','item','',false,{},[]),
      cns('string','leaf','material','',false,{},[]),
    ]),

    sales: cns('dict','dict','itemDetailSales',{},false,{hideLabel:true},[
      cns('dict','dict','orderQuantityAndDeliveryDate',{},false,{
        childNameDisplayTranslation: {
          orderQuantity: 'Quantity',
          reqDelivDate: 'First Delivery Date'
        },
        hideList: ['orderQuantityUnit']
      },[
        cns('string','leaf','orderQuantity','',false,{},[]),
        cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
        cns('date','leaf','reqDelivDate','',false,{},[]),
      ],'Order Quantity and Delivery Date'),
      cns('dict','dict','generalSalesData',{},false,{
        childNameDisplayTranslation: {
          pricingDate: 'Pricing Date: ',
          orderProbability: 'Order Probability: '
        },
        hideList: ['netValueUnit']
      },[
        cns('string','leaf','netValue','',true,{},[]),
        cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
        cns('string','leaf','pricingDate','',false,{},[]),
        cns('string','leaf','orderProbability','1',false,{},[]),
      ])
    ]),

    conditions: cns('dict','dict','itemDetailConditions',{},false,{
      childNameDisplayTranslation: {
        orderQuantity: 'Quantity',
      },
      hideList: ['orderQuantityUnit', 'netValueUnit', 'taxValueUnit']
    },[
      cns('string','leaf','orderQuantity','',false,{},[]),
      cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[]),
      cns('string','leaf','netValue','',true,{},[]),
      cns('string','leaf','netValueUnit','',true,{hideLabel:true},[]),
      cns('string','leaf','taxValue','',true,{},[]),
      cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[]),
      cns('dynamiclist','list','pricingElements',null,true,{
        rowProvided:0,
        childTemplate:cns('dict','dict','condition',null,false,{},[
          cns('string','leaf','cnty','',false,{},[],"Cnty"),
          cns('string','leaf','name','',false,{},[],"Name"),
          cns('string','leaf','amount','',false,{},[],"Amount"),
          cns('string','leaf','city','',false,{},[],"City"),
          cns('string','leaf','per','',false,{},[],"per"),
          cns('string','leaf','uom','',false,{},[],"UoM"),
          cns('string','leaf','conditionValue','',false,{},[],"Condition Value"),
          cns('string','leaf','curr','',false,{},[],"Curr."),
          cns('string','leaf','status','',false,{},[],"Status"),
          cns('string','leaf','numC','',false,{},[],"NumC"),
          cns('string','leaf','atoMtsComponent','',false,{},[],"ATO/MTS Component"),
          cns('string','leaf','oun','',false,{},[],"OUn"),
          cns('string','leaf','cconDe','',false,{},[],"CConDe"),
          cns('string','leaf','un','',false,{},[],"Un"),
          cns('string','leaf','conditionValue2','',false,{},[],"Condition Value"),
          cns('string','leaf','cdCur','',false,{},[],"CdCur"),
          cns('boolean','leaf','stat',false,false,{},[],"Stat"),
        ]),
      },[],"Pricing Elements")
    ])
  }

  constructor(config: ItemConditionKitConfig) {
    this.config = {
      readonly: false,
      navigationLabels: {
        cancel: 'Cancel',
        save: 'Save',
        previous: '← Previous',
        next: 'Next →'
      },
      ...config
    }

    // 初始化详细信息树
    this.initializeDetailTrees()
  }

  /**
   * 初始化详细信息树
   */
  private initializeDetailTrees() {
    const structures = {
      ...ItemConditionKit.defaultDetailStructures,
      ...this.config.detailStructures
    }

    if (structures.header) {
      this.detailTrees.header = createTreeFromConfig(structures.header)
      // 设置根节点的名称用于识别
      if (this.detailTrees.header.root) {
        this.detailTrees.header.root.name = 'itemDetailHeader'
      }
    }
    if (structures.sales) {
      this.detailTrees.sales = createTreeFromConfig(structures.sales)
      if (this.detailTrees.sales.root) {
        this.detailTrees.sales.root.name = 'itemDetailSales'
      }
    }
    if (structures.conditions) {
      this.detailTrees.conditions = createTreeFromConfig(structures.conditions)
      if (this.detailTrees.conditions.root) {
        this.detailTrees.conditions.root.name = 'itemDetailConditions'
      }
    }
  }

  /**
   * 创建 items 节点的函数
   * @param tree - 目标 VarTree
   * @param path - items 节点在树中的路径
   * @param itemTemplate - 可选的自定义 item 模板
   */
  summonItemsNode = (tree: VarTree, path: string[], itemTemplate?: NodeStructure): VarNode => {
    // 默认的 item 模板
    const defaultItemTemplate = cns('dict','dict','item',null,false,{},[
      cns('string','leaf','item','',true,{},[],"Item"),
      cns('string','leaf','material','',false,{searchMethods: materialSearch},[],"Material"),
      cns('string','leaf','orderQuantity','',false,{},[],"Order Quantity"),
      cns('string','leaf','orderQuantityUnit','',false,{hideLabel:true},[],"SU"),
      cns('string','leaf','description','',false,{},[],"Description"),
      cns('date','leaf','reqDelivDate','',false,{},[],"Req. Deliv Date"),
      cns('string','leaf','netValue','',true,{},[],"Net: "),
      cns('string','leaf','netValueUnit','',true,{hideLabel:true},[],"Net Value Unit"),
      cns('string','leaf','taxValue','',true,{},[],"Tax: "),
      cns('string','leaf','taxValueUnit','',true,{hideLabel:true},[],"Tax Value Unit"),
      cns('date','leaf','pricingDate','',false,{},[],"Pricing Date"),
      cns('string','leaf','orderProbability','',false,{},[],"Order Probability"),
      cns('dynamiclist','list','pricingElements',null,false,{
        rowProvided:0,
        childTemplate: ItemConditionKit.defaultDetailStructures.conditions.children![6].config!.childTemplate
      },[],"Pricing Elements"),
    ])

    // 创建 items 节点
    const itemsNode = createNodeFromConfig(
      cns('dynamiclist','list','items',null,false,{
        hideLabel:true,
        hideList: ['netValue', 'netValueUnit', 'pricingDate', 'orderProbability','reqDelivDate','taxValue','taxValueUnit','pricingElements'],
        childTemplate: itemTemplate || defaultItemTemplate
      },[],"Items")
    )

    // 将节点添加到指定路径
    const parentNode = tree.findNodeByPath(path.slice(0, -1))
    if (parentNode) {
      itemsNode.name = path[path.length - 1]
      parentNode.addChild(itemsNode)
    } else {
      // 如果路径不存在，直接替换到指定路径
      tree.replaceNodeByPath(itemsNode, path)
    }

    // 保存引用
    this.itemsNodeRef.value = itemsNode

    return itemsNode
  }

  /**
   * 获取详细信息页面组件的配置
   */
  get detailPageConfig() {
    return {
      itemsNode: this.itemsNodeRef.value,
      validationEndpoint: this.config.validationEndpoint,
      detailTrees: [
        {
          name: 'sales',
          tree: this.detailTrees.sales!,
          headerTree: this.detailTrees.header,
          tabs: [
            { label: 'Sales', value: 0 },
            { label: 'Conditions', value: 1 }
          ]
        },
        {
          name: 'conditions',
          tree: this.detailTrees.conditions!,
          headerTree: this.detailTrees.header
        }
      ],
      readonly: this.config.readonly,
      navigationLabels: this.config.navigationLabels
    }
  }

  /**
   * 获取当前选中的 items
   */
  get selectedItems() {
    return computed(() => this.itemsNodeRef.value?.getSelectedChildren() || [])
  }

  /**
   * 获取 items 节点
   */
  get itemsNode() {
    return this.itemsNodeRef.value
  }

  /**
   * 设置 items 节点引用
   * @param itemsNode - 要设置的 items 节点
   */
  setItemsNode(itemsNode: VarNode | null) {
    this.itemsNodeRef.value = itemsNode
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<ItemConditionKitConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 批量验证并回填 item 数据
   * - 端点来自 this.config.validationEndpoint
   * - 回填 breakdowns 到传入的 itemNodes
   * - 设置每个节点的 config.data.validation
   * - 如配置了 onGeneralData，则将 generalData 交由页面层处理
   * - 完成后可选择对树或外部 AppContent 做 forceUpdate（VarTree 非响应式场景）
   */
  async validateItems(itemNodes: VarNode[], opts?: { forceUpdateTree?: VarTree; forceUpdateApp?: { forceUpdate: () => void } }): Promise<boolean> {
    if (!itemNodes || itemNodes.length === 0) return true

    const endpoint = this.config.validationEndpoint
    const itemValues = itemNodes.map(node => node.getValue())

    try {
      const response = await fetch(`${(window as any).getAPIBaseUrl?.() ?? ''}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemValues)
      })
      const data = await response.json()

      if (!data?.success) return false

      // 页面层按需更新总计数据
      if (this.config.onGeneralData && data.data?.generalData) {
        try { this.config.onGeneralData(data.data.generalData) } catch {}
      }

      // 更新每个 item 的详细信息
      if (Array.isArray(data.data?.breakdowns)) {
        data.data.breakdowns.forEach((breakdown: any, index: number) => {
          if (index < itemNodes.length) {
            itemNodes[index].forceSetValue(breakdown)
          }
        })
      }

      // 根据 badRecordIndices 设置 validation
      if (data.data?.result && Array.isArray(data.data.result.badRecordIndices)) {
        // 先重置所有节点的 validation
        itemNodes.forEach(node => {
          if (!node.config.data) node.config.data = {}
          node.config.data.validation = true
        })
        // 设置不合法节点
        data.data.result.badRecordIndices.forEach((badIndex: number) => {
          if (badIndex < itemNodes.length) {
            if (!itemNodes[badIndex].config.data) itemNodes[badIndex].config.data = {}
            itemNodes[badIndex].config.data.validation = false
          }
        })
      }

      // 非响应式：按需 forceUpdate
      if (opts?.forceUpdateTree) {
        opts.forceUpdateTree.forceUpdate()
      }
      if (opts?.forceUpdateApp) {
        opts.forceUpdateApp.forceUpdate()
      }

      return data.data?.result?.allDataLegal === 1
    } catch (error) {
      console.error('ItemConditionKit.validateItems 调用失败:', error)
      return false
    }
  }

  /**
   * 便捷方法：从树和路径中取出 items 的 children 进行验证
   */
  async validateItemsInTree(tree: VarTree, itemsPath: string[], opts?: { forceUpdateTree?: VarTree; forceUpdateApp?: { forceUpdate: () => void } }): Promise<boolean> {
    const itemsNode = tree.findNodeByPath(itemsPath)
    const children = itemsNode?.children ?? []
    return await this.validateItems(children, opts)
  }

  /**
   * 获取详细信息树（用于调试或高级用法）
   */
  getDetailTrees() {
    return this.detailTrees
  }
}

/**
 * 创建 ItemConditionKit 实例的工厂函数
 */
export function createItemConditionKit(config: ItemConditionKitConfig): ItemConditionKit {
  return new ItemConditionKit(config)
}
