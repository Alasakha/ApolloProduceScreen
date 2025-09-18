// ECharts修复文件 - 解决重复注册错误
import * as echarts from 'echarts'

// 保存原始的registerAxisPointerClass方法
const originalRegisterAxisPointerClass = echarts.AxisView2?.registerAxisPointerClass

if (originalRegisterAxisPointerClass) {
  // 重写registerAxisPointerClass方法，避免重复注册
  echarts.AxisView2.registerAxisPointerClass = function(name, clazz) {
    try {
      return originalRegisterAxisPointerClass.call(this, name, clazz)
    } catch (error) {
      if (error.message && error.message.includes('exists')) {
        console.warn('ECharts axisPointer已存在，跳过重复注册')
        return
      }
      throw error
    }
  }
}

// 全局错误处理
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('axisPointer')) {
    console.warn('捕获到ECharts axisPointer错误，已忽略')
    event.preventDefault()
  }
})

// 处理未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('axisPointer')) {
    console.warn('捕获到ECharts axisPointer Promise错误，已忽略')
    event.preventDefault()
  }
})

export default echarts