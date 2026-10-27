import type { InjectionKey } from 'vue'

type SearchTask = (isCurrent: () => boolean) => Promise<boolean>

export const createSearchScheduler = (getDelay: () => number) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  let resolvePending: ((result: boolean) => void) | undefined
  let version = 0

  const cancel = () => {
    ++version
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    resolvePending?.(false)
    resolvePending = undefined
  }

  const schedule = (task: SearchTask): Promise<boolean> => {
    cancel()
    const current = version
    const isCurrent = () => current === version
    return new Promise((resolve) => {
      resolvePending = resolve
      timer = setTimeout(
        () => {
          timer = undefined
          resolvePending = undefined
          void task(isCurrent).then(
            (result) => resolve(isCurrent() && result),
            () => resolve(false),
          )
        },
        Math.max(0, getDelay()),
      )
    })
  }

  return {
    schedule,
    cancel,
    get version() {
      return version
    },
  }
}

// 组合组件与内部查询表单共用队列，不增加公开属性。
export const searchSchedulerKey: InjectionKey<
  ReturnType<typeof createSearchScheduler>
> = Symbol('pro-search-scheduler')
