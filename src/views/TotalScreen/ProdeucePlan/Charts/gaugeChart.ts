// gaugeChart.ts
export function createGaugeOption({ text = '标题', data = 0, max = 100 }: { text?: string; data: number; max: number }) {
    return {
      title: {
        text: text,
        textStyle: {
          color: '#fff', // ← 加这一行，外面统一白色
          rich: {
            title: {
              fontSize: 14,
              fontWeight: 400,
              color: '#fff', // 这里设置的是白色
              padding: [0, 0, 60, 0],
            },
          },
        },
        x: "center",
        y: "center",
      },
      series: [
        {
          type: 'gauge',
          radius: '75%',
          z: 1,
          clockwise: false,
          startAngle: -269.99,
          endAngle: 90,
          splitNumber: 24,
          splitLine: { show: false },
          detail: {
            show: true,
            color: "#fff",
            offsetCenter: [0, 30],
            fontSize: 18,
            formatter: () => {
              // 判断标题是否是 'xx'，如果是加百分号
              if (text === '点检及时率') {
                return `${Math.round(data)}%`;
              }
              return `${Math.round(data)}`;
            },
            rich: {
              a: {
                fontSize: 36,
                fontFamily: 'DINCond-Bold, DINCond',
                fontWeight: 'bold',
                color: '#FFF',
              },
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 15,
              opacity: 1,
              color: [
                [
                  data / max,
                  {
                    x: 1,
                    y: 1,
                    x1: 0,
                    y1: 0,
                    colorStops: [
                      { offset: 1, color: 'rgba(0, 228, 255, 1)' },
                      { offset: 0, color: 'rgba(105, 255, 151, 1)' },
                    ],
                  },
                ],
                [1, 'rgba(2, 189, 235, 0.29)'],
              ],
            },
          },
          axisLabel: { show: false },
          pointer: { show: false },
          axisTick: {
            show: true,
            splitNumber: 1,
            distance: -15,
            lineStyle: {
              color: 'rgb(5, 160, 187)', //刻度线颜色
              width: 2,
            },
            length: 15,
          },
          data: [{ value: data }],
        },
        {
          type: 'pie',
          radius: ['78%', '80%'],
          center: ['50%', '50%'],
          hoverAnimation: false,
          clockwise: false,
          startAngle: 90,//起始角度
         
          labelLine: { show: false },
          label: { position: 'center' },
          data: [
            {
              value: data,
              itemStyle: {
                shadowBlur: 0,
                shadowColor: '#fff',
                color: 'rgba(58, 131, 102, 1)',
              },
            },
            {
              value: max - data,
              itemStyle: {
                label: { show: false },
                labelLine: { show: false },
                color: 'rgba(255,255,255,0.1)',
                borderWidth: 0,
              },
            },
          ],
        },
        {
          type: 'gauge',
          // max: max, // ← 关键就是补这一行
          z: 5,
          clockwise: false,
          startAngle: -269.99,
          endAngle: 90,
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLabel: { show: false },
          pointer: {
            icon: 'circle',
            length: '12%',
            width: 14,
            height: 14,
            offsetCenter: [0, '-100%'],
            itemStyle: {
              color: 'rgba(74, 234, 174, 1)',
            },
          },
          detail: { show: false },
          title: { show: false },
          data: [
            { value: data },
            { value: 0 },
          ],
        },
      ],
    };
  }
  