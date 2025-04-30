// chartOption.ts
export function createChartOption() {
    return {
      backgroundColor: '#071347',
      color: ["#006cff", "#60cda0", "#ed8884", "#ff9f7f", "#0096ff", "#9fe6b8", "#32c5e9", "#1d9dff"],
      yAxis: {
        type: 'category',
        axisLabel: {
          color: '#fff'
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
      xAxis: {
        type: 'value',
        name: '加载时间/秒',
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
          data: [2.9, 1.0, 0.9, 0.6, 0.3],
        },
        {
          name: "网络流量监控",
          type: "pie",
          radius: ["10%", "40%"],
          center: ["75%", "25%"],
          roseType: "radius",
          data: [
            { value: 60, name: "广东" },
            { value: 50, name: "深圳" },
            { value: 35, name: "浙江" },
            { value: 30, name: "江苏" },
            { value: 24, name: "河北" },
            { value: 12, name: "山东" },
            { value: 6, name: "北京" },
            { value: 5, name: "云南" },
          ],
          label: {
            fontSize: 10,
            formatter(params) {
              return params.percent + '%';
            }
          },
          labelLine: {
            length: 10,
            length2: 10
          }
        }
      ]
    };
  }
  