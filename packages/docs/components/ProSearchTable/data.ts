import type { ProSearchTableRequestParams } from '@coderhd/pro-element-plus'

export interface SearchModel {
  keyword: string
  department: string
  status: '' | 'enabled' | 'disabled'
  city: string
  minScore: number | undefined
  createdAtRange: string[] | null
}
export interface DataRow {
  id: number
  name: string
  email: string
  department: string
  role: string
  city: string
  score: number
  createdAt: string
  status: 'enabled' | 'disabled'
}

export const departments = ['研发部', '产品部', '运营部']
export const cities = ['杭州', '上海', '深圳', '成都']
export const createSearchModel = (): SearchModel => ({
  keyword: '',
  department: '',
  status: '',
  city: '',
  minScore: undefined,
  createdAtRange: [],
})

const rows: DataRow[] = Array.from({ length: 46 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
  email: `user${index + 1}@example.com`,
  department: departments[index % departments.length]!,
  role: ['管理员', '编辑者', '查看者'][index % 3]!,
  city: cities[index % cities.length]!,
  score: 50 + ((index * 7) % 51),
  createdAt: `2026-${String(1 + (index % 6)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}`,
  status: index % 2 === 0 ? 'enabled' : 'disabled',
}))

export const filterRows = (query: SearchModel): DataRow[] => {
  const keyword = query.keyword.trim().toLowerCase()
  const [start, end] = query.createdAtRange ?? []
  return rows.filter(
    (row) =>
      (!keyword ||
        `${row.name} ${row.email}`.toLowerCase().includes(keyword)) &&
      (!query.department || row.department === query.department) &&
      (!query.status || row.status === query.status) &&
      (!query.city || row.city === query.city) &&
      (query.minScore == null || row.score >= query.minScore) &&
      (!start || row.createdAt >= start) &&
      (!end || row.createdAt <= end),
  )
}

export const request = async ({
  query,
  currentPage,
  pageSize,
}: ProSearchTableRequestParams<SearchModel>) => {
  const filtered = filterRows(query)
  await new Promise((resolve) => setTimeout(resolve, 200))
  const start = (currentPage - 1) * pageSize
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
  }
}
