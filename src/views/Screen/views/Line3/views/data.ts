// createChartOption.ts
export function createChartOption(title: string, rawData: any) {
    const isEmpty = !rawData || rawData.length === 0;
  
    const data = isEmpty
      ? [{ name: '暂无异常', value: 1, itemStyle: { color: '#7E8AA2	' } }]
      : rawData;
  
    return {
      color: [
        '#8F87F1', '#C68EFD', '#E9A5F1', '#FED2E2',
        '#5F6DF8', '#B6A0FF', '#493DF5'
      ],
      title: {
        text: title,
        top: '2%',
        left: 'center',
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
        top: '10%',
        left: 'center',
        textStyle: {
          color: '#ffffff'
        }
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
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
  