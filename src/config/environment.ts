// 环境配置管理
import { developmentConfig } from './env.development'
import { scaleConfig } from './env.scale'

// 根据环境模式获取配置
const getConfigByMode = () => {
  const mode = import.meta.env.MODE || 'development'
  
  switch (mode) {
    case 'scale':
      return scaleConfig
    case 'development':
    default:
      return developmentConfig
  }
}

export const environment = {
  // 当前环境
  mode: import.meta.env.MODE || 'development',
  
  // 从配置文件获取设置
  ...getConfigByMode(),
  
  // 是否开发模式
  isDev: import.meta.env.DEV,
  
  // 是否生产模式
  isProd: import.meta.env.PROD
}

// 获取环境配置
export const getEnvironmentConfig = () => {
  const config = getConfigByMode()
  
  return {
    ...environment,
    // 根据环境返回不同的配置
    scaleScreenConfig: {
      enabled: config.enableScaleScreen,
      width: config.designWidth,
      height: config.designHeight,
      autoScale: true,
      fullScreen: config.enableFullScreen,
      delay: 500,
      bodyOverflowHidden: true
    }
  }
}

// 环境配置预设
export const environmentPresets = {
  development: developmentConfig,
  production: {
    enableScaleScreen: true,
    enableFullScreen: true,
    designWidth: 1920,
    designHeight: 1080
  },
  scale: scaleConfig
}

// 获取当前配置状态
export const getCurrentConfig = () => {
  const config = getEnvironmentConfig()
  return {
    ...config,
    environment: config.mode,
    scaleScreenEnabled: config.scaleScreenConfig.enabled,
    fullScreenEnabled: config.scaleScreenConfig.fullScreen
  }
} 