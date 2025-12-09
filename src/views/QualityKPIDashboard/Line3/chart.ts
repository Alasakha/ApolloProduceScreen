import { GLOBAL_PIE_CHART_COLORS } from '@/utils/pieChartColors';
export function createOption(title, data) {
  const BACKGROUND_COLOR = 'rgb(3, 4, 94,0.3)';
  
  return {
      backgroundColor: BACKGROUND_COLOR,
      title: {
          text: title,
          left: 'center',
          top: 10,
          textStyle: {
              color: '#ccc',
              fontSize: 16
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
              radius: ['40%', '60%'], // 改为环形图，节省空间
              center: ['50%', '55%'], // 稍微向下移动
              data: data,
              label: {
                show: true,
                color: '#fff',
                fontSize: 12, // 减小字体
                formatter: function (params) {
                  // 简化标签内容，节省空间
                  const percent = typeof params.percent === 'number'
                    ? params.percent.toFixed(1)
                    : params.percent;
              
                  return `${params.name}\n${percent}%`;
                },
                position: 'outside' // 确保标签在外部
              },
              labelLine: {
                  show: true,
                  lineStyle: {
                      color: '#fff',
                      width: 1
                  },
                  smooth: 0.2,
                  length: 8,  // 减少连接线长度
                  length2: 15
              },
              itemStyle: {
                  color: function(params) {
                      return GLOBAL_PIE_CHART_COLORS[params.dataIndex % GLOBAL_PIE_CHART_COLORS.length];
                  },
                  shadowBlur: 5,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
              },
              emphasis: {
                  scale: true,
                  scaleSize: 5
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