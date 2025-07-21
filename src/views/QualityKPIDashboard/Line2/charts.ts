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
                    formatter: '{b}\n{d}%',
                    fontSize: 14
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
  