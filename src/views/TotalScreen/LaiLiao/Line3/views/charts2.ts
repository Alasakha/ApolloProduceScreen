// chartOption.ts
export function createChartOption(data: any[] = []) {
  const categories = data.map((item) => item?.label || '');
  const rateData = data.map((item) => item?.rate ?? 0);

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
        params.forEach((item) => {
          lines.push(`${item.marker}${item.seriesName}：${item.value}%`);
        });
        return lines.join('<br/>');
      }
    },
    grid: {
      left: '6%',
      right: '6%',
      top: '10%',
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
        color: '#cfd8ff',
        formatter: '{value}%'
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
        name: '合格率',
        type: 'bar',
        barWidth: 18,
        data: rateData,
        label: {
          show: true,
          position: 'top',
          color: '#ffff',
          formatter: '{c}%'
        },
        itemStyle: {
          color: '#006cff',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };
}