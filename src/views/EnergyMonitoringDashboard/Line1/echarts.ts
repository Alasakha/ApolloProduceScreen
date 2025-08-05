export const getGaugeBaseOption = (name, min, max, value, unit, color) => {
    return {
    series: [{
      type: 'gauge',
      min,
      max,
      progress: {
        show: true,
        roundCap: true,
        width: 8,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0,
              color: color[0]
            }, {
              offset: 1,
              color: color[1]
            }]
          }
        }
      },
      pointer: {
        show: true,
        length: '60%',
        width: 6,
        itemStyle: {
          color: '#00eeff'
        }
      },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [[1, 'rgba(0,238,255,0.1)']]
        }
      },
      axisTick: {
        distance: -20,
        splitNumber: 5,
        lineStyle: {
          color: '#999',
          width: 1
        }
      },
      splitLine: {
        distance: -20,
        length: 14,
        lineStyle: {
          color: '#999',
          width: 2
        }
      },
      axisLabel: {
        distance: -17,
        formatter: (value) => Math.floor(value), // 添加formatter去掉小数点
        color: '#fff',
        fontSize: 12
      },
      anchor: {
        show: true,
        size: 20,
        itemStyle: {
          borderColor: '#00eeff',
          borderWidth: 2
        }
      },
      title: {
        show: true,
        offsetCenter: [0, '40%'],
        color: '#fff',
        fontSize: 14
      },
      detail: {
        valueAnimation: true,
        fontSize: 24,
        offsetCenter: [0, '100%'],
        formatter: value => Math.floor(value) + unit, // 这里也添加取整
        color: '#00eeff'
      },
      data: [{
        value: value,
        name: name
      }]
    }]
  }
}