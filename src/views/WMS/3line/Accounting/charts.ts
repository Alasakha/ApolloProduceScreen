

// chartOption.ts
// 适配多种数据结构的图表配置函数
export function createChartOption(data, title, barFields) {
  // 如果没有传 barFields，使用默认的单个字段（向后兼容）
  const fields = barFields || ['rate']
  
  // 确定 x 轴字段：优先使用 warehouseKeeper，如果没有则尝试其他常见字段
  const getXAxisField = (item) => {
    if (item.warehouseKeeper) return item.warehouseKeeper
    if (item.purchaserName) return item.purchaserName
    if (item.name) return item.name
    return '未知'
  }
  
  const names = data.map(item => getXAxisField(item))
  
  // 字段名称映射
  const fieldNameMap = {
    'rate': '及时率',
    'pmcKpiCount': '出库异常次数',
    'qty': '数量',
    'bjsNum': '报警数',
    'total': '总计',
    'a_count': 'A类数量',
    'b_count': 'B类数量',
    'jsNum': '及时数',
    'bjshfs': '不合格数'
  }
  
  // 根据字段数量决定是否显示百分号
  const isRateField = fields.includes('rate')
  
  // 如果是多个字段，生成多个 series
  const seriesList = fields.map((field, idx) => ({
    name: fieldNameMap[field] || field,
    type: 'bar',
    data: data.map(item => item[field] ?? 0),
    itemStyle: {
      color: ["#006cff", "#60cda0", "#ed8884", "#ff9f7f", "#0096ff", "#9fe6b8", "#32c5e9", "#1d9dff"][idx % 8]
    },
    barWidth: fields.length > 1 ? '40%' : undefined,
    label: {
      show: true,
      position: 'top',
      color: '#fff',
      formatter: isRateField && fields.length === 1 ? '{c}%' : '{c}'
    }
  }))
  
  return {
    grid: { 
      left: '3%', 
      right: '4%', 
      bottom: fields.length > 1 ? '0%' : '40', 
      top: fields.length > 1 ? '15%' : '10%', 
      containLabel: true 
    },
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 14 }
    },
    legend: fields.length > 1 ? {
      data: seriesList.map(s => s.name),
      top: '8%',
      textStyle: { color: '#fff' }
    } : undefined,
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#fff',
        interval: 0,
        rotate: 0,
        fontSize: 12,
        formatter(value) {
          if (value && value.length > 6) {
            return value.substring(0, 6) + '\n' + value.substring(6)
          }
          return value
        }
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      data: names
    },
    yAxis: {
      type: 'value',
      nameTextStyle: {
        color: '#fff'
      },
      axisLabel: {
        color: '#fff',
        formatter: isRateField && fields.length === 1 ? '{value}%' : '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    series: seriesList
  }
}
  