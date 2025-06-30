import * as echarts from "echarts";

export const createChart = (el: HTMLElement, options: echarts.EChartsOption) => {
  const chart = echarts.init(el);
  chart.setOption(options);
  return chart;
};

export const updateChart = (chart: echarts.ECharts, options: echarts.EChartsOption) => {
  if (chart) {
    chart.setOption(options);
  }
};

export const destroyChart = (chart: echarts.ECharts | null) => {
  if (chart) {
    chart.dispose();
  }
};