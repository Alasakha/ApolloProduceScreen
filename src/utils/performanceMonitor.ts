/**
 * 性能监控工具
 * 用于监控页面性能、错误和资源使用情况
 */

interface PerformanceMetrics {
  fps: number
  memoryUsage?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  errors: Array<{
    message: string
    stack?: string
    timestamp: number
    type: string
  }>
  warnings: Array<{
    message: string
    timestamp: number
    type: string
  }>
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 0,
    errors: [],
    warnings: []
  }
  
  private frameCount = 0
  private lastTime = performance.now()
  private isMonitoring = false
  private monitorInterval: number | null = null
  
  constructor() {
    this.setupErrorHandling()
    this.setupWarningHandling()
  }
  
  /**
   * 开始性能监控
   */
  start() {
    if (this.isMonitoring) return
    
    this.isMonitoring = true
    this.monitorInterval = window.setInterval(() => {
      this.updateMetrics()
    }, 5000) // 从1秒改为5秒，减少输出频率
    
    console.log('性能监控已启动')
  }
  
  /**
   * 停止性能监控
   */
  stop() {
    if (!this.isMonitoring) return
    
    this.isMonitoring = false
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval)
      this.monitorInterval = null
    }
    
    console.log('性能监控已停止')
  }
  
  /**
   * 更新性能指标
   */
  private updateMetrics() {
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTime
    
    if (deltaTime > 0) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime)
    }
    
    this.frameCount = 0
    this.lastTime = currentTime
    
    // 获取内存使用情况
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
      }
    }
    
    // 输出性能信息
    this.logPerformance()
  }
  
  /**
   * 记录帧数
   */
  recordFrame() {
    this.frameCount++
  }
  
  /**
   * 设置错误处理
   */
  private setupErrorHandling() {
    // 全局错误处理
    window.addEventListener('error', (event) => {
      this.metrics.errors.push({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        type: 'runtime'
      })
      
      console.error('性能监控捕获到错误:', event)
    })
    
    // Promise 错误处理
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.push({
        message: event.reason?.message || 'Promise rejected',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        type: 'promise'
      })
      
      console.error('性能监控捕获到Promise错误:', event)
    })
  }
  
  /**
   * 设置警告处理
   */
  private setupWarningHandling() {
    // 拦截 console.warn
    const originalWarn = console.warn
    console.warn = (...args) => {
      this.metrics.warnings.push({
        message: args.join(' '),
        timestamp: Date.now(),
        type: 'console'
      })
      
      originalWarn.apply(console, args)
    }
  }
  
  /**
   * 输出性能信息
   */
  private logPerformance() {
    const { fps, memoryUsage, errors, warnings } = this.metrics
    
    // 只在有性能问题或重要信息时才输出
    const hasIssues = this.checkPerformanceIssues().length > 0
    const hasNewErrors = errors.length > 0 && errors.length % 10 === 0 // 每10个错误输出一次
    const hasNewWarnings = warnings.length > 0 && warnings.length % 50 === 0 // 每50个警告输出一次
    
    if (!hasIssues && !hasNewErrors && !hasNewWarnings) {
      return // 没有重要问题时不输出
    }
    
    console.group('📊 性能监控报告')
    console.log(`🎯 FPS: ${fps}`)
    
    if (memoryUsage) {
      console.log(`💾 内存使用: ${memoryUsage.usedJSHeapSize}MB / ${memoryUsage.totalJSHeapSize}MB (限制: ${memoryUsage.jsHeapSizeLimit}MB)`)
    }
    
    if (hasNewErrors) {
      console.warn(`❌ 错误数量: ${errors.length}`)
      errors.slice(-3).forEach(error => {
        console.error(`  - ${error.type}: ${error.message}`)
      })
    }
    
    if (hasNewWarnings) {
      console.warn(`⚠️ 警告数量: ${warnings.length}`)
      warnings.slice(-3).forEach(warning => {
        console.warn(`  - ${warning.type}: ${warning.message}`)
      })
    }
    
    console.groupEnd()
  }
  
  /**
   * 获取性能报告
   */
  getReport(): PerformanceMetrics {
    return { ...this.metrics }
  }
  
  /**
   * 清理错误和警告记录
   */
  clearLogs() {
    this.metrics.errors = []
    this.metrics.warnings = []
  }
  
  /**
   * 检查性能问题
   */
  checkPerformanceIssues(): string[] {
    const issues: string[] = []
    
    if (this.metrics.fps < 30) {
      issues.push(`FPS过低: ${this.metrics.fps}`)
    }
    
    if (this.metrics.memoryUsage) {
      const { usedJSHeapSize, jsHeapSizeLimit } = this.metrics.memoryUsage
      const memoryUsagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100
      
      if (memoryUsagePercent > 80) {
        issues.push(`内存使用过高: ${memoryUsagePercent.toFixed(1)}%`)
      }
    }
    
    if (this.metrics.errors.length > 10) {
      issues.push(`错误数量过多: ${this.metrics.errors.length}`)
    }
    
    return issues
  }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor()

// 导出实例和类
export { performanceMonitor, PerformanceMonitor }
export type { PerformanceMetrics }

// 自动启动监控（开发环境）
if (import.meta.env.DEV) {
  performanceMonitor.start()
} else {
  // 生产环境使用轻量级监控
  performanceMonitor.start()
  // 在生产环境中，我们只监控严重问题
  const originalLogPerformance = performanceMonitor['logPerformance']
  performanceMonitor['logPerformance'] = function() {
    const report = this.getReport()
    const { fps, memoryUsage, errors } = report
    
    // 只在有严重性能问题时才输出
    const hasCriticalIssues = fps < 20 || 
      (memoryUsage && (memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit) > 0.9) ||
      errors.length > 50
    
    if (hasCriticalIssues) {
      originalLogPerformance.call(this)
    }
  }
} 