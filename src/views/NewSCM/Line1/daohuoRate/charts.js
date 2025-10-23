export const createChartOption = (data) => {
  // 处理数据，分离出名称和数值
  const names = data.map(item => item.purchaserName);
  const aCounts = data.map(item => item.aCount || 0);
  const bCounts = data.map(item => item.bCount || 0);
  
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
          result += `${param.seriesName}: ${param.value}辆<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: hasACount && hasBCount ? ['A类车型', '常规车型'] : 
            hasACount ? ['A类车型'] : 
            hasBCount ? ['常规车型'] : ['A类车型', '常规车型'],
      textStyle: {
        color: '#fff'
      },
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        color: '#fff',
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        formatter: '{value}辆'
      }
    },
    series: [
      {
        name: 'A类车型',
        type: 'bar',
        data: aCounts,
        itemStyle: {
          color: '#006cff'
        },
        barWidth: hasACount && hasBCount ? '40%' : '60%',
        label: {
          show: hasACount,
          position: 'top',
          formatter: '{c}辆',
          color: '#fff',
          fontSize: 12
        }
      },
      {
        name: '常规车型',
        type: 'bar',
        data: bCounts,
        itemStyle: {
          color: '#60cda0'
        },
        barWidth: hasACount && hasBCount ? '40%' : '60%',
        label: {
          show: hasBCount,
          position: 'top',
          formatter: '{c}辆',
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  };
}; 