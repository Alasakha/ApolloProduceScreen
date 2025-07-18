export function createOption(
    title,
    data
  ) {
    // ========= 常量区域 =========
 
    const BACKGROUND_COLOR = 'rgb(3, 4, 94,0.3)';

  
    // ========= 返回配置项 =========
    return {
        
            backgroundColor: BACKGROUND_COLOR,
            title: {
              text: title,
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: data,
                roseType: 'radius',
                label: {
                  color: 'rgba(255, 255, 255)'
                },
                labelLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                },
                itemStyle: {
                  color: '#90E0EF',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
              }
            ]
          };
    };
  
  