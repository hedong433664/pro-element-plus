import { createRouter, createWebHashHistory } from 'vue-router'
import { camelCase } from 'lodash-es'
import type { RouteComponent, RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob<{ default: RouteComponent }>(
  '../views/**/index.vue',
)

export const componentRoutes: RouteRecordRaw[] = Object.entries(modules).map(
  ([path, component]) => {
    const name = path.replace(/(\.\.\/views\/|\/index\.vue)/g, '')
    return { path: '/' + camelCase(name), name, component }
  },
)

export default createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', redirect: '/proHeader' }, ...componentRoutes],
})
