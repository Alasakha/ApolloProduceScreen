export const formatPieChartData = (data, valuename, value) => {
  if (!Array.isArray(data)) {
    console.error('formatPieChartData 传入的数据格式错误:', data);
    return [];
  }

  return data.map(item => ({
    value: item[value],  // 动态获取值，使用传入的 `value` 字段
    name: item[valuename] // 动态获取 name，使用传入的 `valuename` 字段
  }));
};
