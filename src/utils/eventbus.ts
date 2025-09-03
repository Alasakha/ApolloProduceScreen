// src/utils/eventBus.js

type EventHandler = (...args: any[]) => void

class EventBus {
  private events: { [key: string]: EventHandler[] } = {}
  private autoRefreshTimer: NodeJS.Timeout | null = null
  private autoRefreshInterval: number = 30000 // 默认30秒刷新一次
  private isAutoRefreshEnabled: boolean = false

  on(event: string, handler: EventHandler) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(handler)
  }

  off(event: string, handler: EventHandler) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(h => h !== handler)
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return
    this.events[event].forEach(handler => handler(...args))
  }

  // 启动全局自动刷新
  startAutoRefresh(interval: number = 30000) {
    if (this.isAutoRefreshEnabled) {
      this.stopAutoRefresh()
    }
    
    this.autoRefreshInterval = interval
    this.isAutoRefreshEnabled = true
    
    this.autoRefreshTimer = setInterval(() => {
      console.log('🔄 全局自动刷新触发...')
      // 触发全局刷新事件
      this.emit('globalRefresh')
      // 触发各个组件的刷新事件
      this.emit('refreshData')
      this.emit('refreshDetail')
      this.emit('refreshChart')
      this.emit('refreshTable')
    }, this.autoRefreshInterval)
    
    console.log(`✅ 全局自动刷新已启动，间隔: ${interval / 1000}秒`)
  }

  // 停止全局自动刷新
  stopAutoRefresh() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null
      this.isAutoRefreshEnabled = false
      console.log('⏹️ 全局自动刷新已停止')
    }
  }

  // 获取自动刷新状态
  getAutoRefreshStatus() {
    return {
      isEnabled: this.isAutoRefreshEnabled,
      interval: this.autoRefreshInterval
    }
  }

  // 设置自动刷新间隔
  setAutoRefreshInterval(interval: number) {
    if (this.isAutoRefreshEnabled) {
      this.stopAutoRefresh()
      this.startAutoRefresh(interval)
    } else {
      this.autoRefreshInterval = interval
    }
  }

  // 清理所有事件和定时器
  destroy() {
    this.stopAutoRefresh()
    this.events = {}
  }
}

export const eventBus = new EventBus()
