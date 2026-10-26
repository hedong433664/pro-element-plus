import { describe, expect, it } from 'vitest'
import { ProElementPlusResolver } from '../packages/core/resolver'

describe('component resolver', () => {
  it('resolves only library-owned component names', async () => {
    const resolver = ProElementPlusResolver()
    expect(await resolver.resolve('ProSearchForm')).toEqual({
      name: 'ProSearchForm',
      from: '@coderhd/pro-element-plus/es/search-form',
      sideEffects: ['@coderhd/pro-element-plus/es/search-form/style'],
    })
    expect(await resolver.resolve('ProSearchTable')).toEqual({
      name: 'ProSearchTable',
      from: '@coderhd/pro-element-plus/es/search-table',
      sideEffects: ['@coderhd/pro-element-plus/es/search-table/style'],
    })
    expect(await resolver.resolve('ProBusinessCard')).toBeUndefined()
    expect(await resolver.resolve('ElInput')).toBeUndefined()
  })
  it('allows consumers to opt out of automatic styles', async () => {
    expect(
      await ProElementPlusResolver({ importStyle: false }).resolve('ProTable'),
    ).not.toHaveProperty('sideEffects')
  })
})
