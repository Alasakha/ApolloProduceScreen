<template>
  <div class="combined-trend">
  <div class="combined-title">{{ titleText }}（点击柱子查看 top3 问题）</div>
    <div ref="chartRef" class="combined-chart"></div>

    <div v-if="showIssues" class="overlay" @click="closeIssues">
      <div class="issues-dialog" @click.stop>
        <h3>{{ selectedMonth }} - Top 顶部不良</h3>
        <div v-if="loading">加载中...</div>
        <div v-else>
          <div v-if="issues.length">
            <div v-for="(it, idx) in issues.slice(0,3)" :key="idx" class="issue-item">
              <div class="issue-name">{{ it.ngName }}</div>
              <div class="issue-ratio">{{ (it.ratio*100).toFixed(1) }}%</div>
              <div class="issue-total">({{ it.total }})</div>
            </div>
          </div>
          <div v-else>无数据</div>
        </div>
        <div class="dialog-actions">
          <button @click="closeIssues">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed, defineProps } from 'vue'
import * as echarts from 'echarts'
import { useManufacturingStore } from '@/stores/manufacturing'
import { getPaintingProblem } from '@/api/produceperformance'

const chartRef = ref(null)
let chartInstance = null
const mstore = useManufacturingStore()

const props = defineProps({
  mode: { type: String, default: 'normal' }, // 'normal' or 'A'
  title: { type: String, default: '' }
})

// base workshop names; keys in store are like "金工一部常规类实际" or "金工一部A类实际"
const baseWorkshops = ['金工一部', '金工二部', '总装一课', '总装二课']

const workshops = baseWorkshops.map(name => {
  const actualKey = props.mode === 'A' ? `${name}A类实际` : `${name}常规类实际`
  const targetKey = props.mode === 'A' ? `${name}A类目标` : `${name}常规类目标`
  return { name, actualKey, targetKey }
})

const titleText = computed(() => {
  return props.title || (props.mode === 'A' ? 'A类车间月度对比' : '常规类车间月度对比')
})

const showIssues = ref(false)
const issues = ref([])
const selectedMonth = ref('')
const loading = ref(false)

function buildSeriesAndCategories() {
  const raw = mstore.raw || {}
  // raw can be either:
  // 1) time-series object: { "2025-12": { "金工一部常规类实际": 0.95, ... }, "2025-11": { ... } }
  // 2) snapshot object: { "金工一部常规类实际": 0.95, ... }
  const rawKeys = Object.keys(raw || {})
  const looksLikeMonths = rawKeys.length && rawKeys.every(k => /^\d{4}-\d{2}$/.test(k))

  let months = []
  let categories = []
  if (looksLikeMonths) {
    months = rawKeys.sort()
    categories = months
  } else {
    // snapshot: use a single category label (prefer store-provided month if available)
    const snapshotLabel = raw.monthLabel || new Date().toISOString().slice(0,7)
    months = [snapshotLabel]
    categories = [snapshotLabel]
  }

  const series = workshops.map(w => {
    const data = months.map(m => {
      let v
      if (looksLikeMonths) {
        v = raw[m] && raw[m][w.actualKey]
      } else {
        v = raw[w.actualKey]
      }
      // fallback: try A类 key if 常规类 key not present
      if ((v === null || v === undefined) && w.actualKey.includes('常规类')) {
        const altKey = w.actualKey.replace('常规类', 'A类')
        v = looksLikeMonths ? (raw[m] && raw[m][altKey]) : raw[altKey]
      }
      return v != null ? Number((v * 100).toFixed(1)) : null
    })
    // compute representative target (with fallback)
    let t
    if (looksLikeMonths) {
      t = months.map(m => raw[m] && raw[m][w.targetKey]).find(v => v != null)
    } else {
      t = raw[w.targetKey]
    }
    if ((t === null || t === undefined) && w.targetKey.includes('常规类')) {
      const altTKey = w.targetKey.replace('常规类', 'A类')
      t = looksLikeMonths ? months.map(m => raw[m] && raw[m][altTKey]).find(v => v != null) : raw[altTKey]
    }
    return { name: w.name, data, target: t != null ? Number((t*100).toFixed(1)) : null }
  })
  console.debug('[WorkshopCombined] buildSeriesAndCategories', { looksLikeMonths, months, raw })
  return { categories, series, months }
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  chartInstance.on('click', async params => {
    const idx = params.dataIndex
    const { months } = buildSeriesAndCategories()
    const month = months[idx]
    if (!month) return
    const startDay = `${month}-01`
    // calculate endDay similar to before
    const [y,mon] = month.split('-').map(Number)
    const now = new Date()
    const endDay = (y===now.getFullYear() && mon===now.getMonth()+1) ? `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` : `${y}-${String(mon).padStart(2,'0')}-${String(new Date(y,mon,0).getDate()).padStart(2,'0')}`
    await fetchIssues(startDay, endDay)
    selectedMonth.value = month
    showIssues.value = true
  })
}

async function fetchIssues(startDay,endDay) {
  loading.value = true
  try {
    const res = await getPaintingProblem(startDay,endDay)
    if (res && res.code === 200 && res.data) {
      // merge a and b
      issues.value = [...(res.data.a||[]), ...(res.data.b||[])].sort((a,b)=>b.total-a.total)
    } else issues.value = []
  } catch(e) { issues.value = [] }
  finally { loading.value = false }
}

function updateChart() {
  if (!chartInstance) return
  const { categories, series } = buildSeriesAndCategories()
  // Build double-bar series: for each workshop create two series (实际 and 目标)
  // palette without strong red
  const colors = ['#00d4ff', '#23c48b', '#ffaa00', '#6f9cff']
  const newSeries = []
  series.forEach((s, idx) => {
    const actualSeries = {
      name: `${s.name} 实际`,
      type: 'bar',
      data: s.data.map(v => v != null ? v : null),
      barGap: '50%',
      barCategoryGap: '40%',
      itemStyle: { color: colors[idx % colors.length] },
      label: { show: true, position: 'top', formatter: '{c}%' }
    }
    const targetSeries = {
      name: `${s.name} 目标`,
      type: 'bar',
      data: s.data.map(() => (s.target != null ? s.target : null)),
      barGap: '0%',
      barCategoryGap: '40%',
      itemStyle: { color: '#ffffff33', borderColor: colors[idx % colors.length], borderWidth: 1 },
      emphasis: { itemStyle: { color: colors[idx % colors.length], opacity: 0.6 } },
      label: { show: true, position: 'top', formatter: (params) => `目标 ${params.value != null ? params.value + '%' : '--'}` }
    }
    newSeries.push(targetSeries)
    newSeries.push(actualSeries)
  })

  const option = {
    legend: { data: newSeries.map(s=>s.name), textStyle:{color:'#8cc8ff'}, top:6 },
    grid: { left:'6%', right:'6%', top:'18%', bottom:'8%', containLabel:true },
    xAxis: { type:'category', data: categories, axisLabel:{color:'#8cc8ff',fontSize:10} },
    yAxis: { type:'value', axisLabel:{formatter:'{value}%', color:'#8cc8ff'} },
    tooltip: { trigger:'axis', axisPointer:{type:'shadow'}, formatter: (params) => {
      const name = params[0]?.name||''
      return `${name}<br/>${params.map(p=>`${p.marker} ${p.seriesName}: ${p.value != null ? p.value + '%' : '--'}`).join('<br/>')}`
    }},
    series: newSeries
  }
  chartInstance.setOption(option)
}

onMounted(async ()=>{ await nextTick(); initChart() })
watch(()=>mstore.raw, ()=>updateChart(), { deep:true })

function closeIssues(){ showIssues.value=false; issues.value=[]; selectedMonth.value='' }
</script>

<style scoped>
.combined-trend { height:100%; display:flex; flex-direction:column; }
.combined-title{ color:#00d4ff; font-weight:600; text-align:center; padding-bottom:6px }
.combined-chart{ flex:1; min-height:0 }
.overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000 }
.issues-dialog{ background:rgba(0,20,40,0.98); padding:12px; border-radius:6px; width:420px; color:#fff }
.issue-item{ display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,0.04) }
.issue-name{ color:#8cc8ff; flex:1 }
.issue-ratio{ color:#fff; width:60px; text-align:right }
.issue-total{ color:#aaa; width:48px; text-align:right }
.dialog-actions{ text-align:right; margin-top:8px }
.dialog-actions button{ background:#0a7; border-radius:4px; padding:6px 10px; color:#003 }
</style>


