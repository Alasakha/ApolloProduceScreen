export const formatPieChartData = (data, valuename, value) => {
  if (!Array.isArray(data)) {
    console.error('formatPieChartData 传入的数据格式错误:', data);
    return [];
  }

  return data.map(item => {
    // 检查并打印每个item的内容
    return {
      value: Number(item[value] || 0),
      name: item[valuename] || '未知',
      duration: item.guZhangTypeDuration || 0
    };
  });
};


