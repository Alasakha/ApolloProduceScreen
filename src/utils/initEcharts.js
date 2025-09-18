import { configureEcharts, createSafeEchartsInstance } from './echartsConfig.js'
import './echartsErrorHandler.js' // 导入错误处理器
import * as echarts from 'echarts'

// 全局ECharts初始化
let isEchartsInitialized = false

export function initEcharts() {
  if (isEchartsInitialized) {
    return
  }

  try {
    // 配置ECharts
    configureEcharts()
    
    // 设置全局ECharts主题
    echarts.registerTheme('custom', {
      color: [
        '#4A90E2', '#7B68EE', '#9370DB', '#8A2BE2', 
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'
      ],
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Arial, sans-serif'
      }
    })

    isEchartsInitialized = true
    console.log('ECharts全局初始化完成')
  } catch (error) {
    // 使用错误处理器处理错误
    if (!handleEchartsError(error)) {
      console.warn('ECharts初始化警告:', error)
    }
  }
}

// 错误处理函数
function handleEchartsError(error) {
  if (error.message && error.message.includes('exists')) {
    console.warn('ECharts组件已存在，跳过重复注册')
    return true
  }
  return false
}

// 自动初始化
initEcharts()

// 导出安全的ECharts实例创建函数
export { createSafeEchartsInstance }
export default echarts