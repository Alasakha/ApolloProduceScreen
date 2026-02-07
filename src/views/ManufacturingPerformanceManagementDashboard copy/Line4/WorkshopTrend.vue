<template>
  <div class="workshop-trend">
    <div class="trend-title">{{ title }}</div>
    <div ref="chartRef" class="trend-chart"></div>

    <!-- 问题详情弹窗 -->
    <div v-if="showIssues" class="overlay" @click="closeIssues">
      <div class="issues-dialog" @click.stop>
        <h3>{{ title }} - {{ selectedMonth }}</h3>
        <div v-if="loading">加载中...</div>
        <div v-else>
          <div v-if="issues && issues.length > 0">
            <div class="issue-item" v-for="(it, idx) in issues.slice(0,3)" :key="idx">
              <div class="issue-name">{{ it.ngName }}</div>
              <div class="issue-ratio">{{ (it.ratio*100).toFixed(1) }}%</div>
              <div class="issue-total">({{ it.total }})</div>
            </div>
          </div>
          <div v-else>无问题数据</div>
        </div>
        <div class="dialog-actions">
          <button @click="closeIssues">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useManufacturingStore } from '@/stores/manufacturing'
import { getPaintingProblem } from '@/api/produceperformance'

const props = defineProps({
  title: { type: String, required: true },
  targetKey: { type: String, required: true },
  actualKey: { type: String, required: true }
})

const manufacturingStore = useManufacturingStore()
const chartRef = ref(null)
let chartInstance = null
const showIssues = ref(false)
const issues = ref([])
const selectedMonth = ref('')
const loading = ref(false)

function buildData() {
  const raw = manufacturingStore.raw || {}
  const months = Object.keys(raw).sort()
  const categories = months
  const actuals = months.map(m => {
    const v = raw[m] && raw[m][props.actualKey]
    return v != null ? Number((v * 100).toFixed(1)) : null
  })
  return { categories, actuals, months }
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  chartInstance.on('click', async (params) => {
    const idx = params.dataIndex
    const { months } = buildData()
    const month = months[idx]
    if (!month) return
    // compute month start and end (use month-01 to today or month end)
    const startDay = `${month}-01`
    // endDay use today's date if month is current, else last day of month
    const endDay = (() => {
      const [y, mon] = month.split('-').map(Number)
      const now = new Date()
      if (y === now.getFullYear() && mon === now.getMonth()+1) {
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
      }
      // last day of month
      const last = new Date(y, mon, 0).getDate()
      return `${y}-${String(mon).padStart(2,'0')}-${String(last).padStart(2,'0')}`
    })()
    await fetchIssues(startDay, endDay)
    selectedMonth.value = month
    showIssues.value = true
  })
}

async function fetchIssues(startDay, endDay) {
  loading.value = true
  try {
    const res = await getPaintingProblem(startDay, endDay)
    if (res && res.code === 200 && res.data) {
      // combine A and B arrays
      const all = [...(res.data.a||[]), ...(res.data.b||[])]
      issues.value = all.sort((x,y) => y.total - x.total)
    } else {
      issues.value = []
    }
  } catch (e) {
    issues.value = []
  } finally {
    loading.value = false
  }
}

function updateChart() {
  if (!chartInstance) return
  const { categories, actuals } = buildData()
  const option = {
    grid: { left: '6%', right: '6%', top: '12%', bottom: '8%', containLabel: true },
    xAxis: { type: 'category', data: categories, axisLabel: { color: '#8cc8ff', fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color:'#8cc8ff' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}<br/>实际: ${p[0].value}%` },
    series: [{ type: 'bar', data: actuals.map(v => v!=null?v:0), itemStyle: { color: '#00d4ff' }, barWidth: '60%' }]
  }
  // add markLine from props.targetKey (take first non-null)
  const raw = manufacturingStore.raw || {}
  const months = Object.keys(raw).sort()
  const targetVal = months.map(m => raw[m] && raw[m][props.targetKey]).find(v => v != null)
  if (targetVal != null) {
    option.series[0].markLine = {
      silent: true,
      symbol: ['none','none'],
      data: [{ yAxis: Number((targetVal*100).toFixed(1)) }],
      label: { formatter: `目标 ${(targetVal*100).toFixed(1)}%`, color:'#fff' },
      lineStyle: { type:'dashed', color:'#ffea00', width:2 }
    }
  }
  chartInstance.setOption(option)
}

onMounted(async () => {
  await nextTick()
  initChart()
})

watch(() => manufacturingStore.raw, () => {
  updateChart()
}, { deep:true })

function closeIssues(){ showIssues.value = false; issues.value = []; selectedMonth.value = '' }

</script>

<style scoped>
.workshop-trend { height: 100%; display:flex; flex-direction:column; }
.trend-title { color:#00d4ff; font-weight:600; text-align:center; padding-bottom:6px; font-size:12px }
.trend-chart { flex:1; min-height:0 }
.overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000 }
.issues-dialog { background:rgba(0,20,40,0.98); padding:12px; border-radius:6px; width:360px; color:#fff }
.issue-item { display:flex; justify-content:space-between; gap:8px; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,0.04) }
.issue-name { color:#8cc8ff; flex:1 }
.issue-ratio { color:#fff; width:60px; text-align:right }
.issue-total { color:#aaa; width:48px; text-align:right }
.dialog-actions { text-align:right; margin-top:8px }
.dialog-actions button { background:#0a7; border-radius:4px; padding:6px 10px; color:#003 }
</style>



