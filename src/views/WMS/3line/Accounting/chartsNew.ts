// 新图表的配置文件 - 使用 total 和 purchaserName

// 图表1: 柱状图
export const createChartOption1 = (data: any[], title: string, barFields: string[] = ['qty']) => {
  const names = data.map(item => item.warehouseKeeper || '未知');
  // 优先考虑 rate&pmcKpiCount 的自定义命名
  const fieldNameMap: Record<string, string> = {
    'rate': '及时率',
    'pmcKpiCount': '出库异常次数',
    'qty': '数量',
    'bjsNum': '报警数'
  };
  // 动态生成每个barField对应的数据列
  const seriesList = barFields.map((field, idx) => ({
    name: fieldNameMap[field] || field,
    type: 'bar',
    data: data.map(item => item[field] ?? 0),
    itemStyle: { color: ['#006cff', '#ed8884', '#60cda0', '#ff9f7f'][idx % 4] },
    barWidth: '40%',
    label: {
      show: true,
      position: 'top',
      formatter: '{c}',
      color: '#fff',
      fontSize: 12
    }
  }));
  return {
    grid: { left: '3%', right: '4%', bottom: '0%', top: '15%', containLabel: true },
    title: {
      text: title,
      left: 'center',
      top: '0%',
      textStyle: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 14 }
    },
    legend: {
      data: seriesList.map(s => s.name),
      top: '8%',
      textStyle: { color: '#fff' }
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        color: '#fff', interval: 0, rotate: 0, fontSize: 12,
        formatter(value: string) {
          if (value.length > 6) {
            return value.substring(0, 6) + '\n' + value.substring(6)
          }
          return value
        }
      },
      axisLine: { lineStyle: { color: '#fff' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: '#fff' } }
    },
    series: seriesList
  }
}

// // 图表2: 饼图
// export const createChartOption2 = (data: any[], title: string) => {
//   const chartData = data
//     .filter(item => item.total > 0)
//     .map(item => ({
//       name: item.purchaserName || '未知',
//       value: item.total || 0
//     }));

//   const total = chartData.reduce((sum, item) => sum + item.value, 0);

//   return {
//     grid: {
//       bottom: '10%',
//       top: '15%'
//     },
//     title: {
//       text: title,
//       left: 'center',
//       textStyle: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold'
//       }
//     },
//     tooltip: {
//       trigger: 'item',
//       backgroundColor: 'rgba(0, 0, 0, 0.8)',
//       borderColor: '#333',
//       textStyle: {
//         color: '#fff',
//         fontSize: 14
//       },
//       formatter: '{b}: {c} ({d}%)'
//     },
//     legend: {
//       orient: 'vertical',
//       right: '10%',
//       top: 'middle',
//       textStyle: {
//         color: '#fff',
//         fontSize: 12
//       }
//     },
//     series: [
//       {
//         name: '数据',
//         type: 'pie',
//         radius: ['40%', '70%'],
//         center: ['40%', '50%'],
//         avoidLabelOverlap: false,
//         itemStyle: {
//           borderColor: '#000',
//           borderWidth: 2
//         },
//         label: {
//           show: true,
//           color: '#fff',
//           fontSize: 12,
//           formatter: '{b}\n{c} ({d}%)'
//         },
//         labelLine: {
//           show: true,
//           lineStyle: {
//             color: '#fff'
//           }
//         },
//         color: [
//           '#006cff',
//           '#60cda0',
//           '#ed8884',
//           '#ff9f7f',
//           '#0096ff',
//           '#9fe6b8',
//           '#32c5e9',
//           '#1d9dff'
//         ],
//         data: chartData
//       }
//     ],
//     graphic: {
//       type: 'text',
//       left: '40%',
//       top: '50%',
//       style: {
//         text: `总计\n${total}`,
//         textAlign: 'center',
//         fill: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold'
//       }
//     }
//   };
// };

// // 图表3: 折线图
// export const createChartOption3 = (data: any[], title: string) => {
//   const names = data.map(item => item.purchaserName || '未知');
//   const totals = data.map(item => item.total || 0);
  
//   return {
//     grid: {
//       left: '3%',
//       right: '4%',
//       bottom: '10%',
//       top: '15%',
//       containLabel: true
//     },
//     title: {
//       text: title,
//       left: 'center',
//         textStyle: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold'
//       }
//     },
//     tooltip: {
//       trigger: 'axis',
//       backgroundColor: 'rgba(0, 0, 0, 0.8)',
//       borderColor: '#333',
//       textStyle: {
//         color: '#fff',
//         fontSize: 14
//       }
//     },
//     xAxis: {
//       type: 'category',
//       data: names,
//       axisLabel: {
//         color: '#fff',
//         interval: 0,
//         rotate: 0,
//         fontSize: 12,
//         formatter: function(value: string) {
//           if (value.length > 6) {
//             return value.substring(0, 6) + '\n' + value.substring(6);
//           }
//           return value;
//         }
//       },
//       axisLine: {
//         lineStyle: {
//           color: '#fff'
//         }
//       }
//     },
//     yAxis: {
//       type: 'value',
//       axisLabel: {
//         color: '#fff'
//       },
//       axisLine: {
//         lineStyle: {
//           color: '#fff'
//         }
//       }
//     },
//     series: [
//       {
//         name: '总计',
//         type: 'line',
//         data: totals,
//         smooth: true,
//         itemStyle: {
//           color: '#60cda0'
//         },
//         lineStyle: {
//           color: '#60cda0',
//           width: 2
//         },
//         areaStyle: {
//           color: {
//             type: 'linear',
//             x: 0,
//             y: 0,
//             x2: 0,
//             y2: 1,
//             colorStops: [
//               {
//                 offset: 0,
//                 color: 'rgba(96, 205, 160, 0.3)'
//               },
//               {
//                 offset: 1,
//                 color: 'rgba(96, 205, 160, 0.1)'
//               }
//             ]
//           }
//         },
//         label: {
//           show: true,
//           position: 'top',
//           color: '#fff',
//           fontSize: 12
//         }
//       }
//     ]
//   };
// };
