export const createChartOption = (data, title) => {
  // 直接使用原始数据，不进行固定排序
  // 处理数据，分离出名称和数值
  const names = data.map(item => item.purchaserName);
  const totals = data.map(item => item.total || 0);
  
  // 判断是否有数据
  const hasData = totals.some(count => count > 0);

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '0%',
      top: '30%',
      containLabel: true
    },
    title: {
      text: title, // 传入标题
      left: 'center', // 标题居中
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      formatter: function(params) {
        const name = params[0].name;
        const value = params[0].value;
        return `<div style="margin-bottom: 5px; font-weight: bold;">${name}</div><div>总订单数: ${value}次</div>`;
      }
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
        formatter: '{value}次'
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
          formatter: '{c}次',
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  };
}; 