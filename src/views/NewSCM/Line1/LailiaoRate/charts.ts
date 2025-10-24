
// chartOption.ts
interface ChartDataItem {
  name: string;
  value: number;
}

export function createChartOption(regularData: ChartDataItem[], aClassData: ChartDataItem[]) {
    // 定义固定的采购员名字顺序
    const fixedOrder = ['巩荣超', '李晓娅', '廖远美', '牛小环', '唐富群', '蒋智广', '徐程武'];
    
    // 按照固定顺序重新排列数据
    const orderedRegularData = fixedOrder.map(name => {
      const item = regularData.find(d => d.name === name);
      return item || { name: name, value: 0 };
    });
    
    const orderedAClassData = fixedOrder.map(name => {
      const item = aClassData.find(d => d.name === name);
      return item || { name: name, value: 0 };
    });
    
    // 获取所有供应商名称（按固定顺序）
    const allNames = fixedOrder;

    return {
      color: ["#006cff", "#60cda0", "#ed8884", "#ff9f7f", "#0096ff", "#9fe6b8", "#32c5e9", "#1d9dff"],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      legend: {
        data: ['常规客户', 'A类客户'],
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        type: 'category',
        data: allNames,
        axisLabel: {
          color: '#fff',
          interval: 0,
          rotate: 0,
          fontSize: 12,
          formatter: function(value) {
            // 如果标签太长，可以换行显示
            if (value.length > 6) {
              return value.substring(0, 6) + '\n' + value.substring(6);
            }
            return value;
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
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
          data: orderedRegularData.map(item => item.value),
        },
        {
          name: 'A类客户',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#7ad7b6'
            },
          },
          data: orderedAClassData.map(item => item.value),
        }
      ]
    };
  }
  