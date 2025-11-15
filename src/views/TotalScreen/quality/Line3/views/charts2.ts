// chartOption.ts
export function createChartOption(data: any[] = []) {
  const categories = data.map((item) => item?.label || '');
  const performanceData = data.map((item) => item?.performance ?? 0);
  const nonPerformanceData = data.map((item) => item?.nonPerformance ?? 0);

  return {
    backgroundColor: 'transparent',
    color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any[]) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const dataIndex = params[0].dataIndex;
        const meta = data[dataIndex] || {};
        const lines: string[] = [];
        if (meta.label) {
          lines.push(meta.label);
        }
        if (meta.range) {
          lines.push(meta.range);
        }
        params.forEach((item) => {
          lines.push(`${item.marker}${item.seriesName}：${item.value}`);
        });
        return lines.join('<br/>');
      }
    },
    legend: {
      data: ['功性能数量', '其它数量'],
      textStyle: {
        color: '#cfd8ff'
      }
    },
    grid: {
      left: '6%',
      right: '6%',
      top: '18%',
      bottom: '14%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#cfd8ff',
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#cfd8ff'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)'
        }
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        name: '功性能数量',
        type: 'bar',
        barWidth: 18,
        data: performanceData,
        label: {
          show: true,
          position: 'top',
          color: '#ffff'
        },
        itemStyle: {
          color: '#006cff',
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '其它数量',
        type: 'bar',
        barWidth: 18,
        data: nonPerformanceData,
        label: {
          show: true,
          position: 'top',
          color: '#ffffff'
        },
        itemStyle: {
          color: '#60cda0',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };
}