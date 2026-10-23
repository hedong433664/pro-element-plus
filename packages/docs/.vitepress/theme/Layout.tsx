import { defineComponent } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const DefaultLayout = DefaultTheme.Layout

export default defineComponent({
  name: 'DocsLayout',
  setup() {
    return () => (
      <ElConfigProvider locale={zhCn}>
        <DefaultLayout />
      </ElConfigProvider>
    )
  },
})
