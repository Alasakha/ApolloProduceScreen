import * as echarts from "echarts";
import { createSafeEchartsInstance } from './initEcharts.js';

export const createChart = (el: HTMLElement, options: echarts.EChartsOption) => {
  try {
    const chart = createSafeEchartsInstance(el);
    if (chart) {
      chart.setOption(options);
    }
    return chart;
  } catch (error) {
    console.error('创建图表失败:', error);
    return null;
  }
};

export const updateChart = (chart: echarts.ECharts, options: echarts.EChartsOption) => {
  if (chart && !chart.isDisposed()) {
    chart.setOption(options);
  }
};

export const destroyChart = (chart: echarts.ECharts | null) => {
  if (chart && !chart.isDisposed()) {
    chart.dispose();
  }
};