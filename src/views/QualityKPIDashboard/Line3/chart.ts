export function createOption(title, data) {
  const BACKGROUND_COLOR = 'rgb(3, 4, 94,0.3)';
  
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
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
      },
      series: [
          {
              name: 'title',
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              data: data,
              label: {
                show: true,
                color: '#fff',
                fontSize: 14,
                formatter: function (params) {
                  // 占比保留1位小数
                  const percent = typeof params.percent === 'number'
                    ? params.percent.toFixed(1)
                    : params.percent;
              
                  const value = typeof params.value === 'number'
                    ? params.value.toFixed(0) // 可选：数量保留 2 位小数
                    : params.value;
              
                  return `${params.name}\n${percent}%\n数量：${value}`;
                }
              },
              labelLine: {
                  show: true,
                  lineStyle: {
                      color: '#fff'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
              },
              itemStyle: {
                  color: function(params) {
                      const colors = ['#00ffff', '#0077ff'];
                      return colors[params.dataIndex];
                  },
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
              },
              emphasis: {  // 添加鼠标悬停效果
                  scale: true,
                  scaleSize: 10
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function() {
                  return Math.random() * 200;
              }
          }
      ]
  };
}