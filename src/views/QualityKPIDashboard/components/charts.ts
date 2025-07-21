interface GaugeOptionResult {
    option: any;
    startAnimation: (chart: any) => () => void;
}
const colorMap = {
    normal: '#0CD3DB',   // 蓝色
    warn: '#FFA500',     // 橙色
    danger: '#FF4C4C'     // 红色
  };
  const gradientMap = {
    normal: {
      type: 'linear',
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: '#4FADFD' },
        { offset: 1, color: '#28E8FA' }
      ]
    },
    warn: {
      type: 'linear',
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: '#FFA500' },
        { offset: 1, color: '#FFCC66' }
      ]
    },
    danger: {
      type: 'linear',
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: '#FF4C4C' },
        { offset: 1, color: '#FF9999' }
      ]
    }
  };
export function createGaugeOption({
    // text = '标题',
    data = 0,
    max = 100,
    warnLevel = 'normal'
  }: {
    text?: string;
    data: number;
    max: number;
    warnLevel?: 'normal' | 'warn' | 'danger';
  }): GaugeOptionResult  {
    const gaugeColor = colorMap[warnLevel];
    let angle = 0;
    let value = data;     // 用外部传入的 data
    let animatedValue = 0;

    function createCustomSeries() {
        const arcs = [
            { start: 0, end: 90, r: 0.6 },
            { start: 180, end: 270, r: 0.6 },
            { start: 270, end: 40, r: 0.65 },
            { start: 90, end: 220, r: 0.65 },
        ];

        const points = [
            { angle: 90, r: 0.65 },
            { angle: 270, r: 0.65 }
        ];

        let seriesList: any[] = [];

        arcs.forEach((arc, i) => {
            seriesList.push({
                name: `ring_arc_${i}`,
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function (_: any, api: any) {
                    let currentAngle = api.value(0);
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * arc.r,
                            startAngle: (arc.start + currentAngle) * Math.PI / 180,
                            endAngle: (arc.end + currentAngle) * Math.PI / 180
                        },
                        style: {
                            stroke: gaugeColor, // 警告时橙色
                            fill: "transparent",
                            lineWidth: 1.5
                          },
                        silent: true
                    }
                },
                data: [[angle]]
            });
        });

        points.forEach((point, i) => {
            seriesList.push({
                name: `ring_dot_${i}`,
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function ( _: any,api: any) {
                    let currentAngle = api.value(0);
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * point.r;
                    let coords = getCirlPoint(x0, y0, r, point.angle + currentAngle);
                    return {
                        type: 'circle',
                        shape: {
                            cx: coords.x,
                            cy: coords.y,
                            r: 4
                        },
                        style: {
                            stroke: gaugeColor, // 警告时橙色
                            fill: "transparent",
                            lineWidth: 1.5
                          },
                        silent: true
                    }
                },
                data: [[angle]]
            });
        });

        return seriesList;
    }

    // 注意：这里 pie 的 data 不再写死
    const option = {
        backgroundColor: 'transparent',
        title: {
            text: `{a|${animatedValue.toFixed(0)}}{c|%}`,
            x: 'center',
            y: 'center',
            // textStyle: {
            //     rich: {
            //         a: {
            //             fontSize: 20,
            //             color: '#29EEF3'
            //         },
            //         c: {
            //             fontSize: 20,
            //              color: '#29EEF3'
            //         }
            //     }
            // }
            textStyle: {
                rich: {
                  a: {
                    fontSize: 20,
                    color: gaugeColor // 标题变橙色
                  },
                  c: {
                    fontSize: 20,
                    color: gaugeColor
                  }
                }
              }
        },
        // legend: {
        //     type: "plain",
        //     orient: "vertical",
        //     right: 0,
        //     top: "10%",
        //     align: "auto",
        //     // data: [
        //     //     { name: '涨价后没吃过', icon: "circle" },
        //     //     { name: '天天吃', icon: "circle" },
        //     //     { name: '三五天吃一次', icon: "circle" },
        //     //     { name: '半个月吃一次', icon: "circle" }
        //     // ],
        //     textStyle: {
        //         color: "white",
        //         fontSize: 16,
        //         padding: [10, 1, 10, 0]
        //     },
        //     selectedMode: false
        // },
        series: [
            ...createCustomSeries(),
            {
                name: '吃猪肉频率',
                type: 'pie',
                radius: ['58%', '45%'],
                silent: true,
                clockwise: true,
                startAngle: 90,
                z: 0,
                zlevel: 0,
                animation: false,
                animationDuration: 1000,
                animationEasing: 'cubicInOut',
                label: {
                    position: "center",
                },
                data: [
                    {
                        value: value,
                        name: "",
                        // itemStyle: {
                        //     color: {
                        //         colorStops: [
                        //             { offset: 0, color: '#4FADFD' },
                        //             { offset: 1, color: '#28E8FA' }
                        //         ]
                        //     }
                        // }
                        itemStyle: {
                            // color: warn
                            //   ? '#FFA500' // 橙色（警告）
                            //   : {
                            //       colorStops: [
                            //         { offset: 0, color: '#4FADFD' },
                            //         { offset: 1, color: '#28E8FA' }
                            //       ]
                            //     }
                            color: gradientMap[warnLevel]
                          }
                    },
                    {
                        value: max - value,
                        name: "",
                        label: { show: false },
                        itemStyle: { color: "#173164" }
                    }
                ]
            }
        ]
    };

    function animateValue(chart: any, duration: number) {
        let startTime: number | null = null;
    
        function step(timestamp: number) {
            if (!startTime) startTime = timestamp;
            let progress = Math.min((timestamp - startTime) / duration, 1);
            animatedValue = value * progress;
    
            // const percent = (animatedValue / max) * 100;
    
            chart.setOption({
                title: {
                    text: `{a|${animatedValue.toFixed(0)}}`
                }
            });
    
            if (progress < 1) { 
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }

    const startAnimation = (chart: any) => {
        let rotateAnimationId: number;

        // 启动数字 + Pie 动画
        animateValue(chart, 1000);

        // 启动旋转动画
        function animate() {
            angle = (angle + 0.5) % 360;  // 将旋转速度从3度/帧改为1度/帧，使动画更平滑

            let newSeries = option.series.map((series: any) => {
                if (series.type === "custom") {
                    return {
                        ...series,
                        data: [[angle]]
                    };
                }
                return series;
            });

            chart.setOption({
                series: newSeries
            });

            rotateAnimationId = requestAnimationFrame(animate);
        }

        animate();

        // 返回清理函数
        return () => {
            if (rotateAnimationId) {
                cancelAnimationFrame(rotateAnimationId);
            }
        };
    };

    return {
        option,
        startAnimation
    };
}

//获取圆上某点的坐标(x0,y0表示坐标，r半径，angle角度)
function getCirlPoint(x0: number, y0: number, r: number, angle: number) {
    let x1 = x0 + r * Math.cos(angle * Math.PI / 180);
    let y1 = y0 + r * Math.sin(angle * Math.PI / 180);
    return { x: x1, y: y1 };
}
