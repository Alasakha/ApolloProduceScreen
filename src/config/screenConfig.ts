// 大屏适配配置
export const screenConfig = {
  // 设计稿尺寸
  designWidth: 1920,
  designHeight: 1080,
  
  // 是否自动缩放
  autoScale: true,
  
  // 是否全屏显示
  fullScreen: true,
  
  // 容器样式
  boxStyle: {
    background: 'transparent'
  },
  
  // 缩放模式: 'fit' | 'full' | 'stretch'
  scaleMode: 'fit',
  
  // 是否保持宽高比
  keepRatio: true,
  
  // 最小缩放比例
  minScale: 0.5,
  
  // 最大缩放比例
  maxScale: 2.0
}

// 获取当前屏幕尺寸
export const getCurrentScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// 获取当前屏幕配置
export const getCurrentScreenConfig = () => {
  return screenConfig
}

// 计算缩放比例
export const calculateScale = () => {
  const { width, height } = getCurrentScreenSize()
  const { designWidth, designHeight } = screenConfig
  
  const scaleX = width / designWidth
  const scaleY = height / designHeight
  
  return Math.min(scaleX, scaleY)
} 