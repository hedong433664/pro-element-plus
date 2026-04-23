import { createRouter, createWebHashHistory } from 'vue-router'
import { camelCase } from 'lodash-es'
import type { RouteRecordRaw } from 'vue-router'

export const generateRoutes = (): RouteRecordRaw[] => {
  const modules = import.meta.glob('../views/**/index.vue')

  return Object.keys(modules).map((path) => {
    const route: RouteRecordRaw = {
      path: '/' + camelCase(path.replace(/(\..\/views\/|\/index.vue)/g, '')),
      name: path.replace(/(\..\/views\/|\/index.vue)/g, ''),
      component: modules[path] as () => Promise<typeof import('*.vue')>,
    }
    return route
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/proHeader',
  },
  ...generateRoutes(),
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
