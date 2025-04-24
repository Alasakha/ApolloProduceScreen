export const formatPieChartData = (data, valuename, value) => {
  if (!Array.isArray(data)) {
    console.error('formatPieChartData 传入的数据格式错误:', data);
    return [];
  }

  return data.map(item => ({
    value: item[value],
    name: item[valuename],
    duration: item.guZhangTypeDuration || 0  // ➕ 添加 duration 字段
  }));
};