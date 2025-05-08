// src/composables/useEcharts.js
import * as echarts from 'echarts';
import { onBeforeUnmount } from 'vue';

export function useEcharts(chartRef) {
  let chartInstance = null;

  const initChart = () => {
    if (!chartRef.value) return;
    chartInstance = echarts.init(chartRef.value);
  };

  const setOption = (option) => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  };

  const resizeChart = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };

  window.addEventListener('resize', resizeChart);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  });

  return {
    initChart,
    setOption,
    resizeChart
  };
}
