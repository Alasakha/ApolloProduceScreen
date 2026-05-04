<template>
  <div class="combined-trend">
  <div ref="chartRef" class="combined-chart" :style="{ height: compactHeight }"></div>
    <div v-if="showIssues" class="overlay" @click="closeIssues">
      <div class="issues-dialog" @click.stop>
        
        <h3>{{ selectedWorkshop }} - {{ selectedMonth }} - Top 问题</h3>
        <div v-if="loading">加载中...</div>
        <div v-else>
          <!-- A类问题 -->
          <div class="issue-section">
            <div class="issue-section-title">A类</div>
            <div v-if="issuesA.length">
              <div v-for="(it, idx) in issuesA.slice(0,3)" :key="'a'+idx" class="issue-item">
                <div class="issue-name">{{ it.ngName }}</div>
                <div class="issue-type">{{ it.ngNatureType }}</div>
                <div class="issue-ratio">{{ (it.ratio*100).toFixed(1) }}%</div>
                <div class="issue-total">({{ it.total }})</div>
              </div>
            </div>
            <div v-else class="no-data">无数据</div>
          </div>
          <!-- 常规类问题 -->
          <div class="issue-section">
            <div class="issue-section-title">常规类</div>
            <div v-if="issuesRegular.length">
              <div v-for="(it, idx) in issuesRegular.slice(0,3)" :key="'r'+idx" class="issue-item">
                <div class="issue-name">{{ it.ngName }}</div>
                <div class="issue-type">{{ it.ngNatureType }}</div>
                <div class="issue-ratio">{{ (it.ratio*100).toFixed(1) }}%</div>
                <div class="issue-total">({{ it.total }})</div>
              </div>
            </div>
            <div v-else class="no-data">无数据</div>
          </div>
        </div>
        <div class="dialog-actions">
          <button @click="closeIssues">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed, defineProps, defineEmits } from 'vue'
import * as echarts from 'echarts'
import { useManufacturingStore } from '@/stores/manufacturing'

const emit = defineEmits(['workshop-click'])

const chartRef = ref(null)
let chartInstance = null
const mstore = useManufacturingStore()

const props = defineProps({
  mode: { type: String, default: 'normal' }, // 'normal' or 'A'
  title: { type: String, default: '' },
  // optional: only render data for a single workshop (e.g. '金工一部')
  workshop: { type: String, default: '' },
  // compact mode reduces chart height for tight layouts
  compact: { type: Boolean, default: false }
})

// base workshop names; keys in store are like "金工一部常规类实际" or "金工一部A类实际"
const baseWorkshops = ['金工一部', '金工二部', '总装一课', '总装二课']

let workshops = baseWorkshops.map(name => {
  const actualKey = props.mode === 'A' ? `${name}A类实际` : `${name}常规类实际`
  const targetKey = props.mode === 'A' ? `${name}A类目标` : `${name}常规类目标`
  return { name, actualKey, targetKey }
})
// if a specific workshop prop is provided, filter to that one
if (props.workshop) {
  workshops = workshops.filter(w => w.name === props.workshop)
}

const titleText = computed(() => {
  return props.title || (props.mode === 'A' ? 'A类车间月度对比' : '常规类车间月度对比')
})

const showIssues = ref(false)
const issuesA = ref([])
const issuesRegular = ref([])
const selectedMonth = ref('')
const selectedWorkshop = ref('')
const loading = ref(false)
const compactHeight = computed(() => props.compact ? '140px' : '100%')

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
    // 获取点击的车间名称
    const workshopName = params.seriesName.replace(' 实际', '').replace(' 目标', '')
    // 直接从 store 获取数据（页面加载时已请求）
    fetchIssuesFromStore(workshopName)
    selectedMonth.value = month
    selectedWorkshop.value = workshopName
    showIssues.value = true
  })
}

// 从 store 获取车间 Top 问题数据（页面加载时已请求）
function fetchIssuesFromStore(workshopName) {
  const workshopData = mstore.topIssueWorkshopData.find(item => item.workCenter === workshopName)
  if (workshopData) {
    issuesA.value = workshopData['A类'] || []
    issuesRegular.value = workshopData['常规类'] || []
  } else {
    issuesA.value = []
    issuesRegular.value = []
  }
}

// 废弃：点击时不再请求，改为从 store 获取
// async function fetchIssues(startDay, endDay, workshopName) {
//   loading.value = true
//   try {
//     const res = await getTopIssueWorkshop(startDay, endDay)
//     if (res && res.data && res.data.code === 200 && res.data.data) {
//       const workshopData = res.data.data.find(item => item.workCenter === workshopName)
//       if (workshopData) {
//         issuesA.value = workshopData['A类'] || []
//         issuesRegular.value = workshopData['常规类'] || []
//       } else {
//         issuesA.value = []
//         issuesRegular.value = []
//       }
//     } else {
//       issuesA.value = []
//       issuesRegular.value = []
//     }
//   } catch(e) { 
//     issuesA.value = []
//     issuesRegular.value = []
//   }
//   finally { loading.value = false }
// }

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

function closeIssues(){ 
  showIssues.value = false
  issuesA.value = []
  issuesRegular.value = []
  selectedMonth.value = ''
  selectedWorkshop.value = ''
}
</script>

<style scoped>
.combined-trend { height:100%; display:flex; flex-direction:column;  width: 100%;}
.combined-title{ color:#00d4ff; font-weight:600; text-align:center; padding-bottom:6px ;width: 100%; }
.combined-chart{ flex:1; min-height:0 }
.overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000 }
.issues-dialog{ background:rgba(0,20,40,0.98); padding:12px; border-radius:6px; width:500px; color:#fff; max-height:80vh; overflow-y:auto }
.issue-section{ margin-bottom:12px; padding-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.1) }
.issue-section:last-child{ border-bottom:none; margin-bottom:0 }
.issue-section-title{ color:#00d4ff; font-weight:bold; font-size:14px; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid rgba(0,212,255,0.3) }
.issue-item{ display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,0.04) }
.issue-name{ color:#8cc8ff; flex:1 }
.issue-type{ color:#ffaa00; width:80px; text-align:center }
.issue-ratio{ color:#fff; width:60px; text-align:right }
.issue-total{ color:#aaa; width:48px; text-align:right }
.no-data{ color:#666; text-align:center; padding:8px 0 }
.dialog-actions{ text-align:right; margin-top:12px }
.dialog-actions button{ background:#0a7; border-radius:4px; padding:6px 10px; color:#003 }
</style>


