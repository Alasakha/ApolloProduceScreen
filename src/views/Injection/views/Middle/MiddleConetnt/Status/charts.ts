


export function createChartOption(data: number,max: number ,color:string): echarts.EChartsOption {
  const option: echarts.EChartsOption = {
    series: [
      {
        type: 'gauge',
        max: max,
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            color: color
          }
        },
        axisLine: {
          lineStyle: {
            width: 5,
          }
        },
        pointer: {
          itemStyle: {
            color: color
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 3,
          lineStyle: {
            width: 1,
            color: color
          }
        },
        axisLabel: {
          distance: 25,
          color: color,
          fontSize: 0,
        },
        anchor: {
          show: false,
          showAbove: true,
          size: 10,
          itemStyle: {
            borderWidth: 10
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '100%'],
          color: color
        },
        data: [
          {
            value: Number(data)
          }
        ]
      }
    ]
  };

  return option;
}