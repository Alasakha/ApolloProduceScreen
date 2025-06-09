export const createChartOption = (data) => {
  // 处理数据，分离出名称和数值
  const names = data.map(item => item.purchaserName);
  const deliveryRates = data.map(item => (item.deliveryRate * 100).toFixed(0));
  const productionRates = data.map(item => (item.productionRate * 100).toFixed(0));

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
          result += `${param.seriesName}: ${param.value}%<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['预交达成率', '准时排交达成率'],
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
        formatter: '{value}%'
      },
      max: 100
    },
    series: [
      {
        name: '预交达成率',
        type: 'bar',
        data: deliveryRates,
        itemStyle: {
          color: '#006cff'
        },
        barWidth: '40%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#fff',
          fontSize: 12
        }
      },
      {
        name: '准时排交达成率',
        type: 'bar',
        data: productionRates,
        itemStyle: {
          color: '#60cda0'
        },
        barWidth: '40%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  };
}; 