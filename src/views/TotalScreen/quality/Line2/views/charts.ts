

// chartOption.ts
export function createChartOption(data) {
    return {
      color: ["#006cff", "#60cda0", "#ed8884", "#ff9f7f", "#0096ff", "#9fe6b8", "#32c5e9", "#1d9dff"],
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#fff',
          rotate: 45, // 旋转45度，避免标签重叠
          interval: 0, // 强制显示所有标签
          fontSize: 12, // 设置字体大小
          formatter: function(value: string) {
            // 如果标签太长，进行换行处理（每8个字符换行）
            if (value.length > 8) {
              const lines = []
              for (let i = 0; i < value.length; i += 8) {
                lines.push(value.substr(i, 8))
              }
              return lines.join('\n')
            }
            return value
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: data.map(item => item.name),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0%', // 增加底部边距，为旋转的标签留出空间
        top: '15%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        // name: '数量',
        nameTextStyle: {
          color: '#fff'
        },
        axisLabel: {
          color: '#fff'
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
        formatter: '{c}' // 显示数量
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: {
              // color: {
              //   type: 'linear',
              //   x: 0,
              //   x2: 0,
              //   y: 0,
              //   y2: 1,
              //   colorStops: [
              //     {
              //       offset: 0,
              //       color: '#00b0ff'
              //     },
              //     {
              //       offset: 0.8,
              //       color: '#7052f4'
              //     }
              //   ],
              //   global: false, // 缺省为 false
              // },
            },
          },
          data: data.map(item => item.value),
        },
        // {
        //   name: "网络流量监控",
        //   type: "pie",
        //   radius: ["10%", "40%"],
        //   center: ["75%", "25%"],
        //   roseType: "radius",
        //   data: [
        //     { value: 60, name: "广东" },
        //     { value: 50, name: "深圳" },
        //     { value: 35, name: "浙江" },
        //     { value: 30, name: "江苏" },
        //     { value: 24, name: "河北" },
        //     { value: 12, name: "山东" },
        //     { value: 6, name: "北京" },
        //     { value: 5, name: "云南" },
        //   ],
        //   label: {
        //     fontSize: 10,
        //     formatter(params) {
        //       return params.percent + '%';
        //     }
        //   },
        //   labelLine: {
        //     length: 10,
        //     length2: 10
        //   }
        // }
      ]
    };
  }
  