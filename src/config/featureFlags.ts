// 功能开关配置
export const featureFlags = {
  // 是否启用大屏自适应插件
  enableScaleScreen: import.meta.env.VITE_ENABLE_SCALE_SCREEN === 'true',
  
  // 是否启用全屏模式
  enableFullScreen: import.meta.env.VITE_ENABLE_FULL_SCREEN === 'true',
  
  // 设计稿尺寸配置
  designDimensions: {
    width: 1920,
    height: 1080
  }
}

// 获取当前配置状态
export const getCurrentConfig = () => {
  return {
    ...featureFlags,
    environment: import.meta.env.MODE,
    scaleScreenEnabled: featureFlags.enableScaleScreen,
    fullScreenEnabled: featureFlags.enableFullScreen
  }
} 