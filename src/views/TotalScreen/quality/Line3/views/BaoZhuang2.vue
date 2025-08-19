<template>
  <div class="w-full h-full flex flex-col">
    
    <dv-border-box8 :dur="5" class="w-full h-full flex">
      <h1 class="text-white text-2xl font-bold mt-4">{{dialogTitle}}</h1>
      <div class="w-full h-full flex flex-col mt-2">
        <h1 class="text-white text-sm font-bold flex justify-center">总装一课</h1>
        
        <!-- 统计卡片 - 第一行 -->
        <div class="stats-container mb-2">
          <div class="stat-card">
            <div class="card-icon">📊</div>
            <div class="stat-value">{{totalCount1}}</div>
            <div class="stat-label">应检数</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅</div>
            <div class="stat-value">{{checkedCount1}}</div>
            <div class="stat-label">已检验</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">📈</div>
            <div class="stat-value">{{progressRate1}}%</div>
            <div class="stat-label">完成率</div>
          </div>
        </div>
        
        <h1 class="text-white text-sm font-bold flex justify-center mt-2">总装二课</h1>
        
        <!-- 统计卡片 - 第二行 -->
        <div class="stats-container mb-2">
          <div class="stat-card">
            <div class="card-icon">📊</div>
            <div class="stat-value">{{totalCount2}}</div>
            <div class="stat-label">应检数</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅</div>
            <div class="stat-value">{{checkedCount2}}</div>
            <div class="stat-label">已检验</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">📈</div>
            <div class="stat-value">{{progressRate2}}%</div>
            <div class="stat-label">完成率</div>
          </div>
        </div>
        
        <!-- <h1 class="text-white text-sm font-bold flex justify-center mt-2">今日其他不良</h1> -->
        
        <!-- 统计卡片 - 第三行 -->
        <!-- <div class="stats-container mb-2">
          <div class="stat-card">
            <div class="card-icon">📊</div>
            <div class="stat-value">{{totalCount3}}</div>
            <div class="stat-label">应检数</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅</div>
            <div class="stat-value">{{checkedCount3}}</div>
            <div class="stat-label">已检验</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">📈</div>
            <div class="stat-value">{{progressRate3}}%</div>
            <div class="stat-label">完成率</div>
          </div>
        </div> -->
        

      </div>

    </dv-border-box8>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

import { getCheckTotalDone } from '@/api/getQuiltyinfo'

const dialogTitle = ref('包装检验超时');


// 响应式数据
const chartData1 = ref([])
const chartLabels1 = ref([])
const chartData2 = ref([])
const chartLabels2 = ref([])

// 统计数据
const totalCount1 = ref(0)
const checkedCount1 = ref(0)
const totalCount2 = ref(0)
const checkedCount2 = ref(0)
// const totalCount3 = ref(0)
// const checkedCount3 = ref(0)

// 计算完成率
const progressRate1 = computed(() => {
  if (totalCount1.value === 0) return 0
  return Math.round((checkedCount1.value / totalCount1.value) * 100)
})

const progressRate2 = computed(() => {
  if (totalCount2.value === 0) return 0
  return Math.round((checkedCount2.value / totalCount2.value) * 100)
})

// const progressRate3 = computed(() => {
//   if (totalCount3.value === 0) return 0
//   return Math.round((checkedCount3.value / totalCount3.value) * 100)
// })





const fetchData = async () => {
  const res = await getCheckTotalDone()
  if(res.code === 200 && Array.isArray(res.data)){
    const target = res.data.find(item => item.workCenterName === '汽油车包装车间')
    if(target){
      chartData1.value = [target.total, target.checkTotal]
      chartLabels1.value = ['应检数', '检验数']
      // 更新统计数据
      totalCount1.value = target.total || 0
      checkedCount1.value = target.checkTotal || 0
    }
    
    const target2 = res.data.find(item => item.workCenterName === '电动包装车间')
    if(target2){
      chartData2.value = [target2.total, target2.checkTotal]
      chartLabels2.value = ['应检数', '检验数']
      // 更新统计数据
      totalCount2.value = target2.total || 0
      checkedCount2.value = target2.checkTotal || 0
    }

    }
  }

// 获取今日其他不良数据
// const fetchData3 = async () => {
//   try {
//     const res = await getCheckTotalDoneJcx()
//     if (res.code === 200 && res.data) {
//       totalCount3.value = Number(res.data.total ?? 0)
//       checkedCount3.value = Number(res.data.checkTotal ?? 0)
//     }
//   } catch (error) {
//     console.error('获取今日其他不良数据失败:', error)
//   }
// }

onMounted(async () => {

  await fetchData()
  // await fetchData3()

})

onBeforeUnmount(() => {

})
</script>

<style scoped>
/* 统计卡片样式 */
.stats-container {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.125rem;
}

.stat-card {
  flex: 1;
  background: linear-gradient(135deg, rgba(35, 167, 220, 0.1) 0%, rgba(35, 167, 220, 0.05) 100%);
  border: 1px solid rgba(35, 167, 220, 0.3);
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(35, 167, 220, 0.1);
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(35, 167, 220, 0.2);
  border-color: rgba(35, 167, 220, 0.5);
}

.card-icon {
  font-size: 1.25rem;
  margin-bottom: 0.125rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #23a7dc;
  margin-bottom: 0.125rem;
}

.stat-label {
  font-size: 0.625rem;
  color: #a0aec0;
  font-weight: 500;
}
</style>