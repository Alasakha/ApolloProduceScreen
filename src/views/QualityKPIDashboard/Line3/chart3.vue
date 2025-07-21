<template>
  <div class="w-full h-full flex ">
      <dv-border-box13>
          <div ref="chartRef1" class="w-full h-full"></div>
      </dv-border-box13>
  </div>

          <!-- 添加详细信息对话框 -->
          <el-dialog
        v-model="dialogVisible"
        title="故障详细信息"
        width="70%"
        class="custom-dialog"
    >
        <el-table :data="detailData" style="width: 100%" v-loading="loading">
            <el-table-column prop="breakdown_name" label="故障类型" />
            <el-table-column prop="breakdown_name2" label="故障子类型" />
            <el-table-column prop="udf021" label="故障原因" />
            <el-table-column prop="udf022" label="解决方案" />
            <el-table-column prop="udf023" label="处理方式" />
            <el-table-column prop="approvedate" label="审批日期" />
            <el-table-column prop="user_name" label="处理人" />
            <el-table-column prop="item_description" label="产品描述" />
            <el-table-column prop="item_specification" label="产品规格" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="unit_name" label="单位" />
            <el-table-column prop="doc_no" label="单据编号" />
            <el-table-column prop="khdh" label="客户代号" />
        </el-table>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { createOption } from './chart'
import { getAfterServiceCustomerPie,getAfterService } from '@/api/getQuiltyinfo'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const detailData = ref([])
const loading = ref(false)
const chartRef1 = ref(null)
const chart1 = useEcharts(chartRef1)
const { initChart, setOption, onClick } = useEcharts(chartRef1)
let cleanup = null

// 图表点击事件处理
const handleChartClick = (params) => {
    console.log('Chart clicked:', params)
    if (params.data && params.data.customer_code) {
        fetchDetailData(params.data.customer_code)
    }
}
// 修改数据结构
const chartData = ref([])
const chartLabels = ref('客户投诉占比')


// 获取详细数据
const fetchDetailData = async (customer_code) => {
    loading.value = true
    try {
        const res = await getAfterService(null,customer_code,null)
        if (res.code === 200 && Array.isArray(res.data)) {
            detailData.value = res.data
            dialogVisible.value = true
        }
    } catch (error) {
        console.error('获取详细数据失败:', error)
        ElMessage.error('获取详细数据失败')
    } finally {
        loading.value = false
    }
}

// 添加获取数据的方法
const fetchData = async () => {
  try {
      const res = await getAfterServiceCustomerPie()
      if (res.code === 200 && Array.isArray(res.data)) {
          // 转换数据格式，处理customer_code为空的情况
          chartData.value = res.data
              .filter(item => item.customer_code) // 过滤掉没有customer_code的数据
              .map(item => ({
                  value: item.total,
                  name: item.customer_code || '未知客户',  // 如果customer_code为null，显示为"未知客户"
                  itemStyle: {
                      // 为每个客户设置不同的颜色
                      color: getRandomColor()  // 可以根据需要设置固定的颜色映射
                  },
                  customer_code:item.customer_code
              }))
              .sort((a, b) => b.value - a.value) // 按数量从大到小排序
      }
  } catch (error) {
      console.error('获取数据失败:', error)
  }
}

// 生成随机颜色的函数（或者您可以使用固定的颜色数组）
const getRandomColor = () => {
  const colors = [
      '#00ffff',
      '#00B4D8',
      '#0077B6',
      '#023E8A',
      '#03045E',
      '#CAF0F8',
      '#48CAE4'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}


const drawChart = () => {
    const option1 = createOption(
        chartLabels.value,
        chartData.value
    )
    nextTick(async () => {
        await initChart()
        setOption(option1)
        onClick(handleChartClick)  // 使用解构出来的onClick方法
    })
}


watch([chartData, chartLabels], () => {
  drawChart()
}, { deep: true })

onMounted(async () => {
  await chart1.initChart()
  await fetchData()
  drawChart()
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>

<style scoped>
.dv-border-box13 {
  width: 100%;
  height: 100%;
}
</style>
