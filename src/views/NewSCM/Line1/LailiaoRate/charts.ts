
// chartOption.ts
interface ChartDataItem {
  name: string;
  value: number;
}

export function createChartOption(regularData: ChartDataItem[], aClassData: ChartDataItem[]) {
    // 获取所有供应商名称
    const allNames = [...new Set([
      ...regularData.map(item => item.name),
      ...aClassData.map(item => item.name)
    ])];

    return {
      color: ["#006cff", "#60cda0", "#ed8884", "#ff9f7f", "#0096ff", "#9fe6b8", "#32c5e9", "#1d9dff"],
      legend: {
        data: ['常规客户', 'A类客户'],
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#fff'
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: allNames,
      },
      yAxis: {
        type: 'value',
        // name: '合格率/%',
        nameTextStyle: {
          color: '#fff'
        },
        axisLabel: {
          color: '#fff',
          formatter: '{value}%' // 添加百分号
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      label: {
        show: true,
        position: 'top', // 显示在柱子顶部
        color: '#fff',   // 文字颜色
        formatter: (params: any) => {
          const value = params.value;
          // 如果小数位是0，就显示整数；否则显示一位小数
          const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
          return `${formattedValue}%`
        }
      },
      series: [
        {
          name: '常规客户',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#2a8afc'
            },
          },
          data: allNames.map(name => {
            const item = regularData.find(d => d.name === name);
            return item ? item.value : 0;
          }),
        },
        {
          name: 'A类客户',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#7ad7b6'
            },
          },
          data: allNames.map(name => {
            const item = aClassData.find(d => d.name === name);
            return item ? item.value : 0;
          }),
        }
      ]
    };
  }
  