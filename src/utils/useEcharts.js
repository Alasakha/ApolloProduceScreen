import * as echarts from 'echarts';
import { onBeforeUnmount } from 'vue';

export function useEcharts(chartRef) {
  let chartInstance = null;

  const initChart = () => {
    if (!chartRef.value || chartInstance) return;
    chartInstance = echarts.init(chartRef.value);
    window.addEventListener('resize', resizeChart);
  };

  const setOption = (option) => {
    chartInstance?.setOption(option);
  };

  const resizeChart = () => {
    chartInstance?.resize();
  };

  const onClick = (handler) => {
    chartInstance?.on('click', handler);
  };

  const offClick = (handler) => {
    chartInstance?.off('click', handler);
  };

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
    resizeChart,
    onClick,
    offClick,
  };
}
