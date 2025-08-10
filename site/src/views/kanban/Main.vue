<template>
  <AppContent :stages="['main']" :hide-bottom-bar="true">
    <template #stage-main>
      <div class="kanban">
        <div class="toolbar">
          <label class="toolbar-label">统计周期：</label>
          <select class="toolbar-select" v-model="period" @change="loadAll">
            <option value="today">今日</option>
            <option value="week">本周</option>
          </select>
          <button class="toolbar-button" @click="loadAll">刷新</button>
        </div>

        <div class="cards">
          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconOverview" alt="overview" /> 本期核心业绩总览</h3>
            <div v-if="loading.overview" class="card-loading">加载中...</div>
            <div v-else-if="errors.overview" class="card-error">{{ errors.overview }}</div>
            <div v-else class="grid3">
              <div class="kpi"><span class="label">新增订单量</span><span class="value">{{ overview?.newOrders ?? 0 }}</span></div>
              <div class="kpi"><span class="label">本期营业额</span><span class="value">{{ currency(overview?.turnover || 0) }}</span></div>
              <div class="kpi"><span class="label">完成发货量</span><span class="value">{{ overview?.shipments ?? 0 }}</span></div>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconCustomers" alt="customers" /> Top 3 贡献客户（近5个工作日）</h3>
            <div v-if="loading.topCustomers" class="card-loading">加载中...</div>
            <div v-else-if="errors.topCustomers" class="card-error">{{ errors.topCustomers }}</div>
            <ul v-else class="list">
              <li v-for="c in topCustomers" :key="c.customerNo" class="list-item">
                <span class="muted">客户</span> {{ c.customerNo }} <span class="dot">·</span> {{ currency(c.totalValue) }}
              </li>
            </ul>
          </div>

          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconMaterials" alt="materials" /> 畅销物料 Top 5</h3>
            <div v-if="loading.topMaterials" class="card-loading">加载中...</div>
            <div v-else-if="errors.topMaterials" class="card-error">{{ errors.topMaterials }}</div>
            <ul v-else class="list">
              <li v-for="m in topMaterials" :key="m.matId" class="list-item">
                <span class="muted">物料</span> {{ m.matId }} <span class="dot">·</span> {{ m.totalQty }}
              </li>
            </ul>
          </div>

          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconMaterials" alt="materials" /> 滞销物料 Bottom 5</h3>
            <div v-if="loading.bottomMaterials" class="card-loading">加载中...</div>
            <div v-else-if="errors.bottomMaterials" class="card-error">{{ errors.bottomMaterials }}</div>
            <ul v-else class="list">
              <li v-for="m in bottomMaterials" :key="m.matId" class="list-item">
                <span class="muted">物料</span> {{ m.matId }} <span class="dot">·</span> {{ m.totalQty }}
              </li>
            </ul>
          </div>

          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconUrgent" alt="urgent" /> 紧急交付预警：Top 3 临近DDL订单</h3>
            <div v-if="loading.urgentOrders" class="card-loading">加载中...</div>
            <div v-else-if="errors.urgentOrders" class="card-error">{{ errors.urgentOrders }}</div>
            <ul v-else class="list">
              <li v-for="o in urgentOrders" :key="o.soId" class="list-item">
                <span class="muted">订单</span> {{ o.soId }} <span class="dot">·</span> <span class="muted">客户</span> {{ o.customerNo }} <span class="dot">·</span> {{ o.reqDeliveryDate }} <span class="dot">·</span> {{ currency(o.netValue) }}
              </li>
            </ul>
          </div>

          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconRisk" alt="risk" /> 财务风险预警（本月超期未清）</h3>
            <div v-if="loading.financialRisk" class="card-loading">加载中...</div>
            <div v-else-if="errors.financialRisk" class="card-error">{{ errors.financialRisk }}</div>
            <div v-else class="kpi">
              <span class="label">逾期金额</span>
              <span class="value danger">{{ currency(financialRisk?.overdueAmount || 0) }}</span>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title"><img class="icon" :src="iconRevenue" alt="revenue" /> 营收对比</h3>
            <div v-if="loading.revenue" class="card-loading">加载中...</div>
            <div v-else-if="errors.revenue" class="card-error">{{ errors.revenue }}</div>
            <div v-else class="grid2">
              <div class="kpi"><span class="label">上周营收</span><span class="value">{{ currency(revenue?.lastWeekRevenue || 0) }}</span></div>
              <div class="kpi"><span class="label">本周流水</span><span class="value">{{ currency(revenue?.thisWeekRevenue || 0) }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppContent>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import AppContent from '@/components/applicationContent/AppContent.vue'
import { DashboardApi, type Overview, type CustomerContribution, type MaterialStat, type UrgentOrder, type FinancialRisk, type RevenueComparison } from '@/api/dashboard'
import iconOverview from '@/assets/icons/default-app-icon.svg'
import iconCustomers from '@/assets/icons/maintain-BP.svg'
import iconMaterials from '@/assets/icons/material-documents-overview.svg'
import iconUrgent from '@/assets/icons/manage-outbound-deliveries.svg'
import iconRisk from '@/assets/icons/posting-incoming-payments.svg'
import iconRevenue from '@/assets/icons/posting-incoming-payments.svg'

const period = ref<'today'|'week'>('today')

const overview = ref<Overview | null>(null)
const topCustomers = ref<CustomerContribution[]>([])
const topMaterials = ref<MaterialStat[]>([])
const bottomMaterials = ref<MaterialStat[]>([])
const urgentOrders = ref<UrgentOrder[]>([])
const financialRisk = ref<FinancialRisk | null>(null)
const revenue = ref<RevenueComparison | null>(null)

const loading = reactive({
  overview: false,
  topCustomers: false,
  topMaterials: false,
  bottomMaterials: false,
  urgentOrders: false,
  financialRisk: false,
  revenue: false
})
const errors = reactive<Record<string, string | null>>({
  overview: null,
  topCustomers: null,
  topMaterials: null,
  bottomMaterials: null,
  urgentOrders: null,
  financialRisk: null,
  revenue: null
})

function currency(v: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(v)
}

async function loadAll() {
  await Promise.all([
    (async () => { loading.overview = true; errors.overview = null; try { const res = await DashboardApi.overview(period.value); overview.value = res.data } catch (e:any) { errors.overview = e.message } finally { loading.overview = false } })(),
    (async () => { loading.topCustomers = true; errors.topCustomers = null; try { const res = await DashboardApi.topCustomers(); topCustomers.value = res.data } catch (e:any) { errors.topCustomers = e.message } finally { loading.topCustomers = false } })(),
    (async () => { loading.topMaterials = true; errors.topMaterials = null; try { const res = await DashboardApi.materialsTop(); topMaterials.value = res.data } catch (e:any) { errors.topMaterials = e.message } finally { loading.topMaterials = false } })(),
    (async () => { loading.bottomMaterials = true; errors.bottomMaterials = null; try { const res = await DashboardApi.materialsBottom(); bottomMaterials.value = res.data } catch (e:any) { errors.bottomMaterials = e.message } finally { loading.bottomMaterials = false } })(),
    (async () => { loading.urgentOrders = true; errors.urgentOrders = null; try { const res = await DashboardApi.urgentOrders(); urgentOrders.value = res.data } catch (e:any) { errors.urgentOrders = e.message } finally { loading.urgentOrders = false } })(),
    (async () => { loading.financialRisk = true; errors.financialRisk = null; try { const res = await DashboardApi.financialRisk(); financialRisk.value = res.data } catch (e:any) { errors.financialRisk = e.message } finally { loading.financialRisk = false } })(),
    (async () => { loading.revenue = true; errors.revenue = null; try { const res = await DashboardApi.revenueComparison(); revenue.value = res.data } catch (e:any) { errors.revenue = e.message } finally { loading.revenue = false } })(),
  ])
}

onMounted(() => {
  loadAll()
  // 定时刷新：每10分钟
  setInterval(loadAll, 10 * 60 * 1000)
})
</script>

<style scoped>
.kanban { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
.toolbar-label { color: var(--theme-color-dark); font-weight: 600; }
.toolbar-select, .toolbar-button { height: 32px; padding: 0 10px; border: 1px solid var(--theme-color-lighter); border-radius: 6px; background: var(--theme-color-contrast); }
.toolbar-button { cursor: pointer; transition: all .2s; }
.toolbar-button:hover { background: var(--theme-color-light-a); }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.card { border: 1px solid var(--theme-color-lighter); border-radius: 10px; padding: 14px; background: var(--theme-color-contrast); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.card-title { margin: 0 0 10px; font-size: 16px; color: var(--theme-color-dark); font-weight: 700; }
.card-loading { color: var(--theme-color-light); font-size: 13px; }
.card-error { color: #dc2626; font-size: 13px; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.list-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px; background: rgba(0,0,0,0.02); }
.muted { color: var(--theme-color-light); font-size: 12px; }
.dot { color: var(--theme-color-light); }
.kpi { display: flex; justify-content: space-between; align-items: baseline; margin: 6px 0; padding: 6px 8px; background: rgba(0,0,0,0.02); border-radius: 6px; }
.kpi .label { color: var(--theme-color-light); font-size: 12px; }
.kpi .value { font-size: 22px; font-weight: 700; color: var(--theme-color-dark); }
.kpi .value.danger { color: #dc2626; }
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
@media (max-width: 640px) { .grid3 { grid-template-columns: 1fr; } .grid2 { grid-template-columns: 1fr; } }
.icon { width: 18px; height: 18px; vertical-align: -3px; margin-right: 6px; opacity: .9; }

/* 卡片动效 */
.card { transition: transform .2s ease, box-shadow .2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.10); }

/* 列表项动效 */
.list-item { transition: background .2s ease; }
.list-item:hover { background: rgba(0,0,0,0.05); }

/* KPI 数值渐现 */
.kpi .value { animation: fadeUp .25s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
</style>
