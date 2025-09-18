// 全局错误处理器 - 解决ECharts重复注册错误
console.log('设置全局错误处理器...')

// 处理ECharts相关的错误
function handleEchartsError(error) {
  const errorMessage = error.message || error.toString()
  
  // 检查是否是axisPointer重复注册错误
  if (errorMessage.includes('axisPointer') && errorMessage.includes('exists')) {
    console.warn('ECharts axisPointer重复注册错误已忽略:', errorMessage)
    return true
  }
  
  // 检查是否是其他ECharts重复注册错误
  if (errorMessage.includes('exists') && errorMessage.includes('register')) {
    console.warn('ECharts重复注册错误已忽略:', errorMessage)
    return true
  }
  
  return false
}

// 全局错误处理
window.addEventListener('error', (event) => {
  if (handleEchartsError(event.error)) {
    event.preventDefault()
    event.stopPropagation()
  }
})

// 处理未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  if (handleEchartsError(event.reason)) {
    event.preventDefault()
  }
})

// 重写console.error来过滤ECharts错误
const originalConsoleError = console.error
console.error = function(...args) {
  const errorMessage = args.join(' ')
  if (handleEchartsError({ message: errorMessage })) {
    // 不输出ECharts重复注册错误
    return
  }
  originalConsoleError.apply(console, args)
}

console.log('全局错误处理器设置完成')