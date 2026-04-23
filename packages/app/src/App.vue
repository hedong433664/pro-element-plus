<template>
  <div class="app">
    <ElConfigProvider :locale="zhCn">
      <el-menu :default-active="activeMenu" mode="vertical" router>
        <el-menu-item
          v-for="menu in routes"
          :index="menu.path"
          :key="menu.path"
        >
          {{ menu.name }}
        </el-menu-item>
      </el-menu>

      <el-scrollbar class="content" wrap-style="padding: 20px;">
        <router-view />
      </el-scrollbar>
    </ElConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { generateRoutes } from './router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const activeMenu = ref('/proHeader')
const router = useRouter()
const routes = generateRoutes()

watchEffect(() => {
  activeMenu.value = router.currentRoute.value.path
})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    height: 100%;
  }
}
</style>
