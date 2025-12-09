

export type ChartDataItem = {
  name: string
  aClassRatio: number  // A类 ratio
  regularRatio: number // 常规 ratio
  inspectorName?: string
}

const A_CLASS_COLOR = '#1890FF'  // A类颜色 (蓝色)
const REGULAR_COLOR = '#27ae60'  // 常规颜色 (绿色)

export function createChartOption(title: string, data: ChartDataItem[]) {
  const categories = data.map(item => item.name)
  const dataIsEmpty = data.length === 0

  // A类 ratio 数据
  const aClassData = dataIsEmpty 
    ? categories.map(() => 0) 
    : data.map(item => item.aClassRatio)

  // 常规 ratio 数据
  const regularData = dataIsEmpty 
    ? categories.map(() => 0) 
    : data.map(item => item.regularRatio)

  return {
    color: [A_CLASS_COLOR, REGULAR_COLOR],
    title: {
      text: title,
      left: 'left',
      top: '4%',
      textStyle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Microsoft YaHei'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        if (!params || !params.length) return ''
        const category = params[0].name
        const aClassItem = params.find((p: any) => p.seriesName === 'A类')
        const regularItem = params.find((p: any) => p.seriesName === '常规')
        
        return [
          `${category}`,
          aClassItem ? `A类: ${aClassItem.value}%` : '',
          regularItem ? `常规: ${regularItem.value}%` : ''
        ].filter(Boolean).join('<br/>')
      }
    },
    legend: {
      data: ['A类', '常规'],
      top: '10%',
      textStyle: {
        color: '#ffffff',
        fontSize: 14
      }
    },
    grid: {
      top: '25%',
      left: '5%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#ffffff',
        fontSize: 14
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
      name: '合格率 (%)',
      nameTextStyle: {
        color: '#ffffff',
        fontSize: 14,
        padding: [0, 0, 0, 10]
      },
      axisLabel: {
        color: '#ffffff',
        formatter: '{value}%'
      },
      max: 100,
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff'
        }
      }
    },
    series: [
      {
        name: 'A类',
        type: 'bar',
        barWidth: 50,
        data: aClassData,
        itemStyle: {
          color: A_CLASS_COLOR
        },
        label: {
          show: true,
          position: 'top',
          color: '#ffffff',
          formatter: (params: any) => `${params.value}%`
        }
      },
      {
        name: '常规',
        type: 'bar',
        barWidth: 50,
        data: regularData,
        itemStyle: {
          color: REGULAR_COLOR
        },
        label: {
          show: true,
          position: 'top',
          color: '#ffffff',
          formatter: (params: any) => `${params.value}%`
        }
      }
    ]
  }
}