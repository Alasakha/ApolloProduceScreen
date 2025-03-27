import { format } from "date-fns";

/**
 * 获取最近 7 天的日期（正序）
 */
const getLast7Days = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), "yyyyMMdd"));
  }
  return days;
};

/**
 * 格式化生产计划达成率数据
 * @param data 原始接口返回数据
 * @returns ECharts 适配的数据格式
 */
export const formatProductionRateData = (data: any[]) => {
  const last7Days = getLast7Days();

  // 获取所有型号（去除空格），并排序
  const allModels = Array.from(new Set(data.map(item => item.ty009.trim()))).sort();

  // 初始化结果对象
  const result: Record<string, Record<string, string>> = {};
  last7Days.forEach(date => {
    result[date] = Object.fromEntries(allModels.map(model => [model, "0"]));
  });

  // 填充已有数据
  data.forEach(item => {
    const { ty003, ty009, rate } = item;
    if (result[ty003]) {
      result[ty003][ty009.trim()] = rate || "0"; // 为空补 0
    }
  });

  // 转换为 ECharts 适配格式
  return {
    dates: last7Days,
    series: allModels.map(model => ({
      name: model,
      type: "line",
      data: last7Days.map(date => parseFloat(result[date][model])) // 转换为数值
    }))
  };
};
