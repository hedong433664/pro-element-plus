import { afterEach, describe, expect, it, vi } from 'vitest'
import * as docs from '../packages/docs/components/ProSearchTable/data'
import * as app from '../packages/app/src/views/ProSearchTable/data'
import * as play from '../packages/play/src/views/ProSearchTable/data'

afterEach(() => vi.useRealTimers())

describe('查询表格示例筛选', () => {
  it.each([
    { name: '文档', demo: docs },
    { name: 'app', demo: app },
    { name: 'play', demo: play },
  ])('$name 的查询项参与过滤，分页保持筛选条件', async ({ demo }) => {
    const model = demo.createSearchModel()
    expect(demo.filterRows(model)).toHaveLength(46)
    model.keyword = 'USER12@EXAMPLE.COM'
    expect(demo.filterRows(model).map((row) => row.id)).toEqual([12])

    Object.assign(model, demo.createSearchModel(), {
      department: '产品部',
      status: 'disabled',
      city: '上海',
      minScore: 80,
      createdAtRange: ['2026-02-14', '2026-02-14'],
    })
    expect(demo.filterRows(model).map((row) => row.id)).toEqual([14])
    model.status = 'enabled'
    expect(demo.filterRows(model)).toEqual([])

    Object.assign(model, demo.createSearchModel(), {
      minScore: 0,
      createdAtRange: null,
    })
    expect(demo.filterRows(model)).toHaveLength(46)
    model.status = 'disabled'
    vi.useFakeTimers()
    const pending = demo.request({ query: model, currentPage: 2, pageSize: 5 })
    await vi.advanceTimersByTimeAsync(200)
    const result = await pending
    expect(result.total).toBe(23)
    expect(result.data.map((row) => row.id)).toEqual([12, 14, 16, 18, 20])
  })
})
