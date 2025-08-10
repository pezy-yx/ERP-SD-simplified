export interface Overview {
  newOrders: number
  turnover: number
  shipments: number
  period: string
  startDate: string
  endDate: string
}

export interface CustomerContribution { customerNo: string; totalValue: number }
export interface MaterialStat { matId: string; totalQty: number }
export interface UrgentOrder { soId: string; customerNo: string; reqDeliveryDate: string; netValue: number }
export interface FinancialRisk { overdueAmount: number; monthStart: string; today: string }
export interface RevenueComparison { lastWeekRevenue: number; thisWeekRevenue: number; lastWeekStart: string; lastWeekEnd: string; thisWeekStart: string; today: string }

export interface ApiResponse<T> { code: number; message: string; data: T }

const base = () => window.getAPIBaseUrl()

async function get<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${base()}${url}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const DashboardApi = {
  overview: (period: 'today'|'week') => get<Overview>(`/api/dashboard/overview?period=${period}`),
  topCustomers: () => get<CustomerContribution[]>(`/api/dashboard/top-customers`),
  materialsTop: () => get<MaterialStat[]>(`/api/dashboard/materials?type=top`),
  materialsBottom: () => get<MaterialStat[]>(`/api/dashboard/materials?type=bottom`),
  urgentOrders: () => get<UrgentOrder[]>(`/api/dashboard/urgent-orders`),
  financialRisk: () => get<FinancialRisk>(`/api/dashboard/financial-risk`),
  revenueComparison: () => get<RevenueComparison>(`/api/dashboard/revenue-comparison`),
  all: (period: 'today'|'week') => get<any>(`/api/dashboard/all?period=${period}`)
}

