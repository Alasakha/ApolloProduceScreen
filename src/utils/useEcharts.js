import { createSafeEchartsInstance } from './initEcharts.js';
import { onBeforeUnmount } from 'vue';

export function useEcharts(chartRef) {
  let chartInstance = null;

  const initChart = () => {
    if (!chartRef.value || chartInstance) return;
    
    try {
      // 使用安全的实例创建函数
      chartInstance = createSafeEchartsInstance(chartRef.value);
      if (chartInstance) {
        window.addEventListener('resize', resizeChart);
      }
    } catch (error) {
      console.error('创建ECharts实例失败:', error);
    }
  };

  const setOption = (option) => {
    if (chartInstance && !chartInstance.isDisposed()) {
      chartInstance.setOption(option);
    }
  };

  const resizeChart = () => {
    if (chartInstance && !chartInstance.isDisposed()) {
      chartInstance.resize();
    }
  };

  const onClick = (handler) => {
    if (chartInstance && !chartInstance.isDisposed()) {
      chartInstance.on('click', handler);
    }
  };

  const offClick = (handler) => {
    if (chartInstance && !chartInstance.isDisposed()) {
      chartInstance.off('click', handler);
    }
  };

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
    if (chartInstance && !chartInstance.isDisposed()) {
      chartInstance.dispose();
      chartInstance = null;
    }
  });

  return {
    initChart,
    setOption,
    resizeChart,
    onClick,
    offClick,
    getChart: () => chartInstance,
  };
}
