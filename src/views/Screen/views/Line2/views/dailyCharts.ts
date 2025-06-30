const size = window.devicePixelRatio ;
export function createChartOption({
  category,
  value1 = [],
  value2 = [],
  value3 = [],
  remarks = [],
  duties = [],
  carModels = []
}: {
  category: string[],
  value1?: number[],
  value2?: number[],
  value3?: number[],
  remarks?: string[],
  duties?: string[],
  carModels?: string[]
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
    const hour = params[0].axisValue; // x 轴的时段
    const index = category.indexOf(hour);
    let str = `时段${hour-1}-${hour}时 产能<br/>`;
    
    // 获取各个系列的值
    const actualValue = params.find(p => p.seriesName === '实际产能')?.value || 0;
    // const planValue = params.find(p => p.seriesName === '生产排产')?.value || 0;
    const planValue2 = params.find(p => p.seriesName === 'PMC排产')?.value || 0;
    
    // 计算产量差异
    const diff = planValue2 - actualValue;
    
    // 添加各个系列的值
    params.forEach(item => {
      str += `${item.marker}${item.seriesName}：${item.value}<br/>`;
    });
    
    // 添加产量差异
    str += `<br/>产量差异：${diff}<br/>`;
    
    // 添加车型信息（如果有）
    if (carModels[index] && carModels[index].trim()) {
      str += `车型：${carModels[index]}<br/>`;
    }
    
    // 添加原因分析（如果有）
    if (remarks[index] && remarks[index].trim()) {
      str += `原因分析：${remarks[index]}<br/>`;
    }

    // 添加责任人（如果有）
    if (duties[index] && duties[index].trim()) {
      str += `责任人：${duties[index]}`;
    }
    
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
  data: ['PMC排产','生产排产', '实际产能']
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
        name: '生产排产',
        type: 'line',
        data: value3,
        barWidth: '50%',
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
        name: 'PMC排产',
        type: 'line',
        data: value2,
        barWidth: '50%',
        itemStyle: {
          color: 'green'
        },
        label: {
          show: true,
          position: 'top',
          color: 'green',
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
        },
        
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
