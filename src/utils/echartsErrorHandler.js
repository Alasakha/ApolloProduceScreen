// ECharts错误处理器
export function handleEchartsError(error) {
  // 检查是否是重复注册错误
  if (error.message && error.message.includes('exists')) {
    console.warn('ECharts组件已存在，跳过重复注册:', error.message);
    return true; // 表示已处理
  }
  
  // 检查是否是axisPointer相关错误
  if (error.message && error.message.includes('axisPointer')) {
    console.warn('ECharts axisPointer错误，尝试忽略:', error.message);
    return true; // 表示已处理
  }
  
  // 其他错误正常抛出
  return false;
}

// 全局错误处理
export function setupGlobalErrorHandler() {
  // 捕获未处理的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    if (handleEchartsError(event.reason)) {
      event.preventDefault(); // 阻止错误冒泡
    }
  });
  
  // 捕获全局JavaScript错误
  window.addEventListener('error', (event) => {
    if (handleEchartsError(event.error)) {
      event.preventDefault(); // 阻止错误冒泡
    }
  });
}

// 自动设置错误处理
setupGlobalErrorHandler();