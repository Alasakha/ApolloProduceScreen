// createChartOption.ts
export function createChartOption(title: string, rawData: any) {
    const isEmpty = !rawData || rawData.length === 0;
  
    // 处理柱状图数据：提取分类和数值
    const categories = isEmpty 
      ? ['暂无异常'] 
      : rawData.map((item: any) => item.name || '未知');
    
    const values = isEmpty 
      ? [1] 
      : rawData.map((item: any) => item.value || 0);
  
    // 颜色数组，循环使用
    const colors = [
      '#247BA0', '#70C1B3', '#B2DBBF', '#F3FFBD',
      '#FF1654'
    ];
  
    return {
      color: colors,
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          if (isEmpty) return '';
          const param = Array.isArray(params) ? params[0] : params;
          return `${param.name}<br/>${param.seriesName}: ${param.value} 件`;
        },
        textStyle: {
          color: 'black'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '0%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          color: '#ffffff',
          fontSize: 12,
          rotate: categories.length > 5 ? 45 : 0, // 如果分类太多，旋转标签
          interval: 0 // 显示所有标签
        },
        axisLine: {
          lineStyle: {
            color: '#ffffff'
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: '数量',
        nameTextStyle: {
          color: '#ffffff'
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#ffffff'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        }
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: values.map((value: number, index: number) => ({
            value,
            itemStyle: {
              color: colors[index % colors.length]
            }
          })),
          label: {
            show: true,
            position: 'top',
            color: '#ffffff',
            fontSize: 12,
            formatter: (params: any) => {
              if (isEmpty) return '';
              return `${params.value} 件`;
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          barWidth: '60%' // 柱状图宽度
        }
      ]
    };
  }
  