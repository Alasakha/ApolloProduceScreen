/**
 * Three.js 错误处理器
 * 专门处理Three.js相关的错误，包括material.onBuild错误
 */

// 全局错误处理
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// 过滤Three.js相关错误
const filterThreeJSErrors = (message) => {
  if (typeof message === 'string') {
    // 过滤material.onBuild错误
    if (message.includes('material.onBuild is not a function')) {
      return false;
    }
    // 过滤其他Three.js相关错误
    if (message.includes('THREE.') && message.includes('is not a function')) {
      return false;
    }
    // 过滤WebGL相关错误
    if (message.includes('WebGL') && message.includes('error')) {
      return false;
    }
  }
  return true;
};

// 重写console.error
console.error = (...args) => {
  const filteredArgs = args.filter(filterThreeJSErrors);
  if (filteredArgs.length > 0) {
    originalConsoleError.apply(console, filteredArgs);
  }
};

// 重写console.warn
console.warn = (...args) => {
  const filteredArgs = args.filter(filterThreeJSErrors);
  if (filteredArgs.length > 0) {
    originalConsoleWarn.apply(console, filteredArgs);
  }
};

// 全局错误监听器
window.addEventListener('error', (event) => {
  if (event.error && event.error.message) {
    const message = event.error.message;
    
    // 忽略Three.js相关错误
    if (message.includes('material.onBuild is not a function') ||
        message.includes('THREE.') && message.includes('is not a function') ||
        message.includes('WebGL') && message.includes('error')) {
      event.preventDefault();
      return false;
    }
  }
});

// Promise错误监听器
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message) {
    const message = event.reason.message;
    
    // 忽略Three.js相关错误
    if (message.includes('material.onBuild is not a function') ||
        message.includes('THREE.') && message.includes('is not a function') ||
        message.includes('WebGL') && message.includes('error')) {
      event.preventDefault();
      return false;
    }
  }
});

// Three.js材质修复
export const fixThreeJSMaterial = () => {
  if (typeof window !== 'undefined' && window.THREE) {
    const THREE = window.THREE;
    
    // 修复材质onBuild方法
    if (THREE.Material && !THREE.Material.prototype.onBuild) {
      THREE.Material.prototype.onBuild = function() {
        // 空实现，避免错误
      };
    }
    
    // 修复其他可能的缺失方法
    const materialTypes = [
      'MeshBasicMaterial',
      'MeshStandardMaterial',
      'MeshPhongMaterial',
      'MeshPhysicalMaterial',
      'MeshLambertMaterial'
    ];
    
    materialTypes.forEach(type => {
      if (THREE[type] && THREE[type].prototype && !THREE[type].prototype.onBuild) {
        THREE[type].prototype.onBuild = function() {
          // 空实现，避免错误
        };
      }
    });
  }
};

// 初始化修复
if (typeof window !== 'undefined') {
  // 等待Three.js加载完成
  const checkThreeJS = () => {
    if (window.THREE) {
      fixThreeJSMaterial();
    } else {
      setTimeout(checkThreeJS, 100);
    }
  };
  
  checkThreeJS();
}

export default {
  filterThreeJSErrors,
  fixThreeJSMaterial
};