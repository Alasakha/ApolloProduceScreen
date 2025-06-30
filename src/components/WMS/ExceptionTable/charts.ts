// chartOption.ts
export function createChartOption(data, showPurchaseTotal) {
    return {
      backgroundColor: 'transparent', // 或深色如 '#000' 视页面背景而定
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          if (showPurchaseTotal && params.data.purchase_total !== undefined) {
            return `${params.name}: ${params.value}批（采购总数：${params.data.purchase_total}）`;
          }
          return `${params.name}: ${params.value}批 (${params.percent}%)`;
        }
      },
      legend: undefined, // 或直接删除整个 legend 配置
      
      series: [
        {
          name: '来源',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '80%'], // 居中
          startAngle: 180,
          endAngle: 360,
          itemStyle: {
            borderColor: '#000',
            borderWidth: 0
          },
          label: {
            color: '#fff',
            fontSize: 14,
            formatter: function(params) {
              if (showPurchaseTotal && params.data.purchase_total !== undefined) {
                const roundedPercent = Math.round(params.percent);
                return `${params.name} ${params.data.purchase_total}单 ${params.value}批 (${roundedPercent}%)`;
              }else{
                const roundedPercent = Math.round(params.percent);
                return `${params.name} ${params.value}批 (${roundedPercent}%)`;
              }
            
            }
          },
          labelLine: {  
            length: 15,     // 第一段（连接扇区）
            length2: 10,    // 第二段（水平线）
            lineStyle: {
              color: '#fff'
            }
          },
          color: [
            '#006cff',
            '#60cda0',
            '#ed8884',
            '#ff9f7f',
            '#0096ff',
            '#9fe6b8',
            '#32c5e9',
            '#1d9dff'
          ],
          data: data
        }
      ]
      
    };
  }
  