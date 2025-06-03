<template>
  <div class="line3-container">
    <div class="grid grid-cols-3 gap-4">
      <dv-border-box-12 class="chart-box">
        <div class="box-content">
          <div class="box-title">合格率趋势</div>
          <div class="chart-container">
            <div ref="qualificationTrendRef" class="chart"></div>
          </div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="chart-box">
        <div class="box-content">
          <div class="box-title">今日不良TOP5问题</div>
          <div class="chart-container">
            <div ref="top5IssuesRef" class="chart"></div>
          </div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="chart-box">
        <div class="box-content">
          <div class="box-title">今日不良TOP5责任</div>
          <div class="chart-container">
            <div ref="top5ResponsibilityRef" class="chart"></div>
          </div>
        </div>
      </dv-border-box-12>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { 
  getQualificationRateTrend, 
  getTodayBadIssues, 
  getTodayBadResponsibility,
  type QualificationRateTrend,
  type BadIssue,
  type BadResponsibility
} from '@/api/getStampinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import { useEcharts } from '@/utils/useEcharts'

const route = useRoute()
const prodLine = route.query.prodLine as string

// 图表引用
const qualificationTrendRef = ref(null)
const top5IssuesRef = ref(null)
const top5ResponsibilityRef = ref(null)

// 使用 useEcharts 初始化三个图表
const { initChart: initTrendChart, setOption: setTrendOption } = useEcharts(qualificationTrendRef)
const { initChart: initIssuesChart, setOption: setIssuesOption } = useEcharts(top5IssuesRef)
const { initChart: initResponsibilityChart, setOption: setResponsibilityOption } = useEcharts(top5ResponsibilityRef)

// 数据
const trendData = ref<QualificationRateTrend>({})
const issuesData = ref<BadIssue[]>([])
const responsibilityData = ref<BadResponsibility[]>([])

// 获取趋势图数据
const fetchTrendData = async () => {
  try {
    const res = await getQualificationRateTrend(prodLine)
    if (res.code === 200) {
      trendData.value = res.data
      updateTrendChart()
    }
  } catch (error) {
    console.error('获取合格率趋势数据失败:', error)
  }
}

// 获取不良TOP5问题数据
const fetchIssuesData = async () => {
  try {
    const res = await getTodayBadIssues(prodLine)
    if (res.code === 200) {
      issuesData.value = res.data
      updateIssuesChart()
    }
  } catch (error) {
    console.error('获取不良TOP5问题数据失败:', error)
  }
}

// 获取不良TOP5责任数据
const fetchResponsibilityData = async () => {
  try {
    const res = await getTodayBadResponsibility(prodLine)
    if (res.code === 200) {
      responsibilityData.value = res.data
      updateResponsibilityChart()
    }
  } catch (error) {
    console.error('获取不良TOP5责任数据失败:', error)
  }
}

// 更新趋势图
const updateTrendChart = () => {
  const dates = Object.keys(trendData.value).sort()
  const rates = dates.map(date => {
    const rateStr = trendData.value[date].replace('%', '')
    return parseFloat(rateStr)
  })
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['合格率'],
      textStyle: {
        color: '#fff'
      },
      top: '2%'
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { 
        color: '#fff',
        interval: 0,
        rotate: 45
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: { 
        color: '#fff',
        formatter: '{value}%'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    },
    series: [
      {
        name: '合格率',
        type: 'bar',
        data: rates,
        barWidth: '40%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: 'rgba(0,234,255,0.4)' },
            { offset: 1, color: 'rgba(0,234,255,0.4)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#fff'
        }
      },
      {
        name: '合格率',
        type: 'line',
        data: rates,
        smooth: true,
        lineStyle: { color: '#00eaff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,234,255,0.5)' },
            { offset: 1, color: 'rgba(0,234,255,0.1)' }
          ])
        }
      }
    ]
  }
  
  initTrendChart()
  setTrendOption(option)
}

// 更新TOP5问题图
const updateIssuesChart = () => {
  // 对数据进行降序排序
  const sortedData = [...issuesData.value].sort((a, b) => b.total - a.total)
  
  if (sortedData.length === 0) {
    const option = {
      tooltip: {
        show: false
      },
      grid: {
        top: '5%',
        left: '80%',
        right: '80%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        show: false
      },
      yAxis: {
        type: 'category',
        data: ['暂无不良问题'],
        axisLabel: { 
          color: '#42b983',
          fontSize: 24,
          fontWeight: 'bold',
          margin: 20
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        type: 'bar',
        data: [],
        barWidth: '40%'
      }]
    }
    initIssuesChart()
    setIssuesOption(option)
    return
  }
  
  // 获取前5个问题的数量（包括相同数量的）
  const top5Count = new Set(sortedData.slice(0, 5).map(item => item.total))
  const filteredData = sortedData.filter(item => top5Count.has(item.total))
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '15%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'category',
      data: filteredData.map(item => item.ngName),
      axisLabel: { 
        color: '#fff',
        interval: 0
      }
    },
    series: [{
      type: 'bar',
      data: filteredData.map(item => ({
        value: item.total,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#00eaff' }
          ])
        }
      })),
      barWidth: '40%',
      label: {
        show: true,
        position: 'right',
        formatter: '{c}',
        color: '#fff'
      }
    }]
  }
  
  initIssuesChart()
  setIssuesOption(option)
}

// 更新TOP5责任图
const updateResponsibilityChart = () => {
  // 计算总数用于计算占比
  const total = responsibilityData.value.reduce((sum, item) => sum + item.total, 0)
  if (total === 0) {
    const option = {
      tooltip: {
        show: false
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: [{
          value: 1,
          name: '暂无不良数据',
          itemStyle: {
            color: '#42b983'
          },
          label: {
            show: true,
            position: 'center',
            formatter: '暂无不良数据',
            fontSize: 18,
            color: '#42b983',
            bold: true
          }
        }],
        emphasis: {
          scale: false
        }
      }]
    }
    initResponsibilityChart()
    setResponsibilityOption(option)
  } else {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: params => {
          const percent = ((params.value / total) * 100).toFixed(0)
          return `${params.name}<br/>数量：${params.value}<br/>占比：${percent}%`
        }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: responsibilityData.value.map(item => {
          const percent = ((item.total / total) * 100).toFixed(0)
          return {
            name: item.md002,
            value: item.total,
            label: {
              show: true,
              position: 'outside',
              formatter: params => {
                return [
                  `{name|${params.name}}`,
                  `{value|${params.value}个 ${percent}%}`
                ].join('\n')
              },
              rich: {
                name: {
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold',
                  padding: [0, 0, 0, 0]
                },
                value: {
                  color: '#00eaff',
                  fontSize: 14,
                  padding: [8, 0, 0, 0]
                }
              }
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 20,
              smooth: true,
              lineStyle: {
                width: 2,
                color: '#00eaff'
              }
            }
          }
        }),
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      }]
    }
    
    initResponsibilityChart()
    setResponsibilityOption(option)
  }
}

// 刷新所有数据
const refreshData = () => {
  fetchTrendData()
  fetchIssuesData()
  fetchResponsibilityData()
}

onMounted(() => {
  refreshData()
  // 订阅刷新事件
  eventBus.on('refreshData', refreshData)
})
</script>

<style scoped>
.line3-container {
  padding: 0.5rem;
}

.chart-box {
  height: 35vh;
  padding: 1rem;
}

.box-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.box-title {
  display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    text-align: center;
    font-size: 1vw;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
}

.chart-container {
  flex: 1;
  width: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}
</style> 