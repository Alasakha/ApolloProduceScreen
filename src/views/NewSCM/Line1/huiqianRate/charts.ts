

// chartOption.ts
export function createChartOption(data) {
    return {
      color: ["#006cff", "#60cda0", "#ed8884", "#ff9f7f", "#0096ff", "#9fe6b8", "#32c5e9", "#1d9dff"],
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
        data: data.map(item => item.name),
      },
      yAxis: {
        type: 'value',
        // name: '回签率/%',
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
        formatter: '{c}%' // 加上百分号
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#00b0ff'
                  },
                  {
                    offset: 0.8,
                    color: '#7052f4'
                  }
                ],
                global: false, // 缺省为 false
              },
            },
          },
          data: data.map(item => (item.value*100).toFixed(0)),
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
  