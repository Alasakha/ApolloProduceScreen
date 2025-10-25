export const createChartOption = (data) => {
  // 定义固定的采购员名字顺序
  const fixedOrder = ['巩荣超', '李晓娅', '廖远美', '牛小环', '唐富群', '蒋智广', '徐程武'];
  
  // 按照固定顺序重新排列数据
  const orderedData = fixedOrder.map(name => {
    const item = data.find(d => d.purchaserName === name);
    return item || { purchaserName: name, total: 0 };
  });
  
  // 处理数据，分离出名称和数值
  const names = orderedData.map(item => item.purchaserName);
  const totals = orderedData.map(item => item.total || 0);
  
  // 判断是否有数据
  const hasData = totals.some(count => count > 0);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const name = params[0].name;
        const value = params[0].value;
        return `${name}<br/>总订单数: ${value}个`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        color: '#fff',
        interval: 0,
        rotate: 0,
        fontSize: 12,
        formatter: function(value) {
          // 如果标签太长，可以换行显示
          if (value.length > 6) {
            return value.substring(0, 6) + '\n' + value.substring(6);
          }
          return value;
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        formatter: '{value}个'
      }
    },
    series: [
      {
        name: '总订单数',
        type: 'bar',
        data: totals,
        itemStyle: {
          color: '#006cff'
        },
        barWidth: '60%',
        label: {
          show: hasData,
          position: 'top',
          formatter: '{c}个',
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  };
}; 