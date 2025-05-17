export function createChartOption({
  category,
  value1 = [],
  value2 = []
}: {
  category: string[],
  value1?: number[],
  value2: number[]
}) {
  const upperSeries: number[] = [];
  const lowerSeries: number[] = [];
  const upperLabel: string[] = [];
  const lowerLabel: string[] = [];

  const planColor = '#00BFFF'; // 实际产能：天蓝
  const  actualColor= '#32CD32';   // 计划产能：浅绿

  value1.forEach((v1, i) => {
    const v2 = value2[i] ?? 0;
    if (v1 <= v2) {
      upperSeries.push(v1);
      lowerSeries.push(v2);
      upperLabel.push('实际产能');
      lowerLabel.push('计划产能');
    } else {
      upperSeries.push(v2);
      lowerSeries.push(v1);
      upperLabel.push('计划产能');
      lowerLabel.push('实际产能');
    }
  });

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['实际产能', '计划产能'],
      textStyle: { color: '#fff' }
    },
    xAxis: {
      type: 'category',
      data: category,
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12
      },
      name: '时间 (小时)',
      nameLocation: 'middle',
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [15, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 15
      },
      lineStyle: {
        color: '#33ccff',
        width: 20,
        type: 'dashed'
      }
    },
    series: [
      {
        name: '计划产能',
        type: 'bar',
        data: lowerSeries,
        barWidth: '40%',
        barGap: '-100%',
        itemStyle: {
          color: (params) =>
            lowerLabel[params.dataIndex] === '实际产能' ? actualColor : planColor
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff'
        },
        z: 2
      },
      {
        name: '实际产能',
        type: 'bar',
        data: upperSeries,
        barWidth: '40%',
        itemStyle: {
          color: (params) =>
            upperLabel[params.dataIndex] === '实际产能' ? actualColor : planColor
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff'
        },
        z: 3
      }
    ]
  };
}
