<template>
    <div class="abnormal-analysis">
        <dv-border-box12>
            <div class="title h-[15%]">生产异常分析</div>
            <div class="flex h-[85%]">
                    <div class="subtitle">分类占比</div>
                <div ref="categoryChart" class="pie-chart"></div>
                <div class="subtitle">责任部门占比</div>
                <div ref="deptChart" class="pie-chart"></div>
            </div>

        </dv-border-box12>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getAbnormalDept, getAbnormalCategory } from '@/api/getPmcinfo' // 假设接口路径

const categoryChart = ref()
const deptChart = ref()
const categoryData = ref([])
const deptData = ref([])

const renderPie = (el, data, nameKey, valueKey) => {
  if (!el) return
  const chart = echarts.init(el)
  const option = {
    tooltip: { trigger: 'item' },
    // legend: {
    //   bottom: 0,
    //   textStyle: { color: '#fff', fontSize: 14 }
    // },
    series: [
      {
        
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          color: '#fff',
          fontSize: 16,
          formatter: '{b}\n{c} ({d}%)'
        },
        labelLine: { show: true, length: 20, length2: 10 },
        data: data.map(item => ({
          name: item[nameKey],
          value: item[valueKey]
        }))
      }
    ]
  }
  chart.setOption(option)
}

const fetchData = async () => {
  // 获取分类占比
  const categoryRes = await getAbnormalCategory()
  categoryData.value = categoryRes.data || []
  // 获取责任部门占比
  const deptRes = await getAbnormalDept()
  deptData.value = deptRes.data || []
  await nextTick()
  renderPie(categoryChart.value, categoryData.value, 'guZhangTypeName', 'total')
  renderPie(deptChart.value, deptData.value, 'dutyDeptName', 'total')
}

onMounted(fetchData)
</script>

<style scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 1vw;
  font-weight: bold;
  color: #fff;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
  border-bottom: 0.3vh solid #00bfff;
  margin-bottom: 1vh;
}
.subtitle {
  color: #00eaff;
  font-size: 1vw;
  font-weight: bold;
  margin: 1vh 0 0.5vh 2vw;
  letter-spacing: 0.1vw;
}
.pie-chart {
  width: 90%;
  height: 95%;
  background: rgba(0,32,64,0.15);
  border-radius: 1vw;
}
</style>