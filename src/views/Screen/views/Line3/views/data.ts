
const size = window.devicePixelRatio ;
const getFontSize = () =>size>=2? 10 : size >= 1.5 ? 15 : 22;  

// createChartOption.ts
export function createChartOption(title: string, rawData: any) {
    const isEmpty = !rawData || rawData.length === 0;
  
    const data = isEmpty
      ? [{ name: '暂无异常', value: 1, itemStyle: { color: 'green 	' } }]
      : rawData;
  
    return {
//       color: [
//         '#247BA0', '#70C1B3', '#B2DBBF', '#F3FFBD',
//         '#247BA0',  // 深海蓝
// '#70C1B3',  // 湖水绿
// '#B2DBBF', // 薄荷绿
// '#F3FFBD',  // 柠檬黄
// '#FF1654'  // 活力红
//       ],
      grid:{},
      title: {
        text: title,
        top: '2%',
        left: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: getFontSize(),
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
          color: '#ffffff',
           fontSize:size>=2? 6 : size >= 1.5 ? 10 : 15,
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],  // 修改为环形
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
                fontSize: size >= 2 ? 7 : size >= 1.5 ? 10 : 16,
                  color: '#fff',
                  lineHeight: 15
              },
              value: {
                fontSize: size >= 2 ? 7 : size >= 1.5 ? 10 : 16,
                color: '#aaa'
              },
              percent: {
                fontSize: size >= 2 ? 7 : size >= 1.5 ? 10 : 16,
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
  