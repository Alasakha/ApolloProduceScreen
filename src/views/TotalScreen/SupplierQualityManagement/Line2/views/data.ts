// createChartOption.ts
import { GLOBAL_PIE_CHART_COLORS } from '@/utils/pieChartColors';

export function createChartOption(title: string, rawData: any) {
    const isEmpty = !rawData || rawData.length === 0;
  
    const data = isEmpty
      ? [{ name: '暂无数据', value: 1, itemStyle: { color: '#70C1B3' } }]
      : rawData;
  
    return {
      color: GLOBAL_PIE_CHART_COLORS,
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
        formatter: isEmpty ? '' : '{b}: {c} 件 ({d}%)',
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
          radius: ['25%', '50%'],  // 环形饼图
          data,
          label: {
            show: true,
            position: 'outside',
            formatter: (params: any) => {
                if (isEmpty) return `{name|暂无数据}`;
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
  