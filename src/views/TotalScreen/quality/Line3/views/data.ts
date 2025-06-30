// createChartOption.ts
export function createChartOption(title: string, rawData: any) {
    const isEmpty = !rawData || rawData.length === 0;
  
    const data = isEmpty
      ? [{ name: '暂无异常', value: 1, itemStyle: { color: '#70C1B3' } }]
      : rawData;
  
    return {
      color: [
        '#247BA0', '#70C1B3', '#B2DBBF', '#F3FFBD',
        '#FF1654'
      ],
      title: {
        text: title,
        top: '4%',
        left: 'left',
        textStyle: {
          color: '#ffffff',
          fontSize: 25,
          fontWeight: 'bold',
          fontFamily: 'Microsoft YaHei',
          letterSpacing: 2
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: isEmpty ? '' : '{b}: {c} ({d}%)',
        textStyle: {
          color: 'black'
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: '0%',
        left: 'center',
        textStyle: {
          color: '#ffffff'
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['25%', '50%'],  // 修改为环形
          data,
          label: {
            show: true,
            position: 'outside',
            formatter: (params: any) => {
                if (isEmpty) return `{name|暂无异常}`;
                return `{name|${params.name}}\n{value|${params.value} 件}  {percent|${params.percent}%}`;
              },
            rich: {
              name: {
                fontSize: 14,
                color: '#fff',
                lineHeight: 22
              },
              value: {
                fontSize: 12,
                color: '#aaa'
              },
              percent: {
                fontSize: 12,
                color: '#66ccff'
              }
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  