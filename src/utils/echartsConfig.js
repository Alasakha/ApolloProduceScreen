// ECharts全局配置，避免重复注册错误
import * as echarts from 'echarts'

// 防止重复注册的标记
let isConfigured = false

export function configureEcharts() {
  if (isConfigured) return
  
  try {
    // 设置全局配置（不需要setOption，这是实例方法）
    // 可以在这里设置全局主题或其他配置
    console.log('ECharts全局配置完成')
    isConfigured = true
  } catch (error) {
    // 忽略重复注册错误
    if (error.message && error.message.includes('exists')) {
      console.warn('ECharts组件已存在，跳过重复注册')
    } else {
      console.error('ECharts配置错误:', error)
    }
  }
}

// 创建安全的ECharts实例
export function createSafeEchartsInstance(dom, theme = null) {
  try {
    return echarts.init(dom, theme)
  } catch (error) {
    if (error.message && error.message.includes('exists')) {
      console.warn('ECharts实例已存在，返回现有实例')
      // 尝试获取现有实例
      return echarts.getInstanceByDom(dom) || echarts.init(dom, theme)
    }
    throw error
  }
}

// 导出ECharts
export default echarts