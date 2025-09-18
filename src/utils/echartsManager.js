import * as echarts from 'echarts'

// 全局ECharts实例管理器
class EChartsManager {
  constructor() {
    this.instances = new Map()
    this.isInitialized = false
  }

  // 初始化ECharts（只执行一次）
  init() {
    if (this.isInitialized) return
    
    try {
      // 确保ECharts只初始化一次
      this.isInitialized = true
      console.log('ECharts全局初始化完成')
    } catch (error) {
      console.warn('ECharts初始化警告:', error)
    }
  }

  // 创建图表实例
  createInstance(dom, theme = null) {
    if (!dom) {
      console.error('DOM元素不存在')
      return null
    }

    // 检查是否已存在实例
    const existingInstance = this.instances.get(dom)
    if (existingInstance && !existingInstance.isDisposed()) {
      return existingInstance
    }

    try {
      const instance = echarts.init(dom, theme)
      this.instances.set(dom, instance)
      return instance
    } catch (error) {
      console.error('创建ECharts实例失败:', error)
      return null
    }
  }

  // 销毁图表实例
  disposeInstance(dom) {
    const instance = this.instances.get(dom)
    if (instance) {
      try {
        instance.dispose()
        this.instances.delete(dom)
      } catch (error) {
        console.warn('销毁ECharts实例失败:', error)
      }
    }
  }

  // 销毁所有实例
  disposeAll() {
    this.instances.forEach((instance, dom) => {
      try {
        instance.dispose()
      } catch (error) {
        console.warn('销毁ECharts实例失败:', error)
      }
    })
    this.instances.clear()
  }

  // 获取实例
  getInstance(dom) {
    return this.instances.get(dom)
  }

  // 检查实例是否存在且有效
  hasInstance(dom) {
    const instance = this.instances.get(dom)
    return instance && !instance.isDisposed()
  }
}

// 创建全局单例
const echartsManager = new EChartsManager()

// 初始化
echartsManager.init()

export default echartsManager
export { EChartsManager }