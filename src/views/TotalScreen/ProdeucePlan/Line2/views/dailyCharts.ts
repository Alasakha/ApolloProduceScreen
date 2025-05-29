
const size = window.devicePixelRatio ;
export function createChartOption({
  category,
  value1 = [],
  value2 = []
}: {
  category: string[],
  value1?: number[],
  value2: number[]
}) {
  return {
    grid:{bottom:30,top:20},
    title: {
    show: category.length == 0,   // 没数据才显示
    extStyle: {
        color: "grey",
        fontSize: 20
    },
    text: "暂无数据",
    left: "center",
    top: "center"
},
tooltip: {
  trigger: 'axis',
  formatter: function(params) {
    // params 是一个数组，包含当前 x 轴下所有系列的数据
    const hour = params[0].axisValue; // x 轴的时段
    let str = `时段${hour-1}-${hour}时 产能<br/>`;
    params.forEach(item => {
      // 圆点+系列名+值
      str += `${item.marker}${item.seriesName}：${item.value}<br/>`;
    });
    return str;
  }
},
    legend: {
  orient: 'horizontal',
  top: '0%',
  right:'5%',   // ← 图例从距离左边 60% 的位置开始（根据你实际需求微调）
  itemGap: 20,
  textStyle: {
    color: '#fff',
    fontSize: size >= 2 ? 6 : size >= 1.5 ? 8 : 12
  },
  data: ['计划产能', '实际产能']
},
    xAxis: {
      type: 'category',
      data: category,
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: size>=2 ? 5   :size>=1.5? 7 : 12,
      },
      name: '时间 (小时)',
      nameLocation: 'middle',
      nameTextStyle: {
        color: '#fff',
        fontSize: size >= 2 ? 6 : size >= 1.5 ? 8 : 12,
        padding: [1, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: size>=2 ? 5   :size>=1.5? 7 : 12,
      },
      splitLine: {
        lineStyle: {
          color: '#33ccff',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '计划产能',
        type: 'line',
        data: value2,
        barWidth: '30%',
        itemStyle: {
          color: 'orange'
        },
        label: {
          show: true,
          position: 'top',
         
          color: 'orange',
          fontSize: size >= 2 ? 6 : size >= 1.5 ? 8 : 12
        }
      },
      {
        name: '实际产能',
        type: 'bar',
        data: value1,
        barWidth: '30%',
        itemStyle: {
          color: '#3A5FCD'
        },
        label: {
          show: true,
          position: 'insideBottom',
          offset: [0, -10], // [水平偏移, 垂直偏移] 
          color: '#fff',
          fontSize: size >= 2 ? 6 : size >= 1.5 ? 8 : 12
        }
      },
      // {
      //   name: '实际产能',
      //   type: 'line',
      //   data: value2,
      //    color: '#fff'
      // }
    ]
  };
}
