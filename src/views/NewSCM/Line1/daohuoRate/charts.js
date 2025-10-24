export const createChartOption = (data) => {
  // 定义固定的采购员名字顺序
  const fixedOrder = ['巩荣超', '李晓娅', '廖远美', '牛小环', '唐富群', '蒋智广', '徐程武'];
  
  // 按照固定顺序重新排列数据
  const orderedData = fixedOrder.map(name => {
    const item = data.find(d => d.purchaserName === name);
    return item || { purchaserName: name, aCount: 0, bCount: 0 };
  });
  
  // 处理数据，分离出名称和数值
  const names = orderedData.map(item => item.purchaserName);
  const aCounts = orderedData.map(item => item.aCount || 0);
  const bCounts = orderedData.map(item => item.bCount || 0);
  
  // 判断是否显示图例
  const hasACount = aCounts.some(count => count > 0);
  const hasBCount = bCounts.some(count => count > 0);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const name = params[0].name;
        let result = `${name}<br/>`;
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value}个<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: hasACount && hasBCount ? ['A类订单', '常规订单'] : 
            hasACount ? ['A类订单'] : 
            hasBCount ? ['常规订单'] : ['A类订单', '常规订单'],
      textStyle: {
        color: '#fff'
      },
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '20%',
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
        name: 'A类订单',
        type: 'bar',
        data: aCounts,
        itemStyle: {
          color: '#006cff'
        },
        barWidth: hasACount && hasBCount ? '40%' : '60%',
        label: {
          show: hasACount,
          position: 'top',
          formatter: '{c}个',
          color: '#fff',
          fontSize: 12
        }
      },
      {
        name: '常规订单',
        type: 'bar',
        data: bCounts,
        itemStyle: {
          color: '#60cda0'
        },
        barWidth: hasACount && hasBCount ? '40%' : '60%',
        label: {
          show: hasBCount,
          position: 'top',
          formatter: '{c}个',
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  };
}; 