<template>
  <div class="line2-container h-[100%]">
    <div class="cards-container">
      <template v-if="allData.length">
        <div v-for="(item, index) in allData" 
             :key="index"
             class="card-wrapper">
          <DataCard
            :catogory="item.processName || '工序'"
            :frame="item.workNo"
            :customer-no="item.productId"
            :model-spec="formatSpec(item.item_specification)"
            :planNum="handleNum(item.plan_qty)"
            :process_list="formatProcessList(item.itemList)"
          />
        </div>
      </template>
      <template v-else>
        <div class="card-wrapper">
          <DataCard v-bind="emptyCardData" />
        </div>
      </template>
    </div>
  </div>
</template>   

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DataCard from '@/components/Stamp/DataCard2.vue'
import { getStampingGeneralData } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'

const route = useRoute();
const prodLine = route.query.prodLine;

const allData = ref([])

const emptyCardData = {
  catogory: '暂无',
  frame: '暂无',
  customerNo: '暂无',
  modelSpec: '暂无',
  planNum: 0,
  process_list: [
    {
      name: '暂无',
      current: 0,
      total: 100,
      isDoing: false,
      mo_routing_d_id: '' // 添加必需的字段
    }
  ]
}

// 格式化进度条数据
const formatProcessList = (itemList) => {
  if (!itemList || !itemList.length) return [];
  
  // 获取父级的总数作为进度条的总量
  const totalNum = Number(itemList[0].plan_qty || itemList[0].num);
  
  return itemList.map(item => ({

    name: item.processName,
    current: Number(item.num || 0), // 确保转换为数字，如果为空则默认0
    total: totalNum,          // 使用父级的总数
    isDoing: item.isDoing === '1',
    mo_routing_d_id: item.mo_routing_d_id // 添加工序ID
    // percentage: Math.round((Number(item.num) / totalNum) * 100) // 计算百分比
  }));
}

const handleNum = (num:number) => {
  return Math.round(num)
}

// // 将数据分成三列
// const firstColumnData = computed(() => {
//   return allData.value.filter((_, index) => index % 3 === 0)
// })

// const secondColumnData = computed(() => {
//   return allData.value.filter((_, index) => index % 3 === 1)
// })

// const thirdColumnData = computed(() => {
//   return allData.value.filter((_, index) => index % 3 === 2)
// })

const fetchData = async () => {
  try {
    const res = await getStampingGeneralData(prodLine)
    if (res.code === 200) {
      allData.value = res.data || []
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    allData.value = []
  }
} 

onMounted(() => {
  fetchData()
})

// 格式化规格文本
const formatSpec = (spec: string) => {
  if (!spec) return '';
  return spec.length > 10 ? spec.slice(0, 10) + '...' : spec;
}
</script>

<style scoped>
.line2-container {
  padding: 0.2rem 0.2rem 0 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 防止外层出现滚动条 */
}

.cards-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;  /* 改为水平方向排列 */
  gap: 1rem;  /* 使用 gap 替代单独设置 margin */
  padding-right: 0.5rem; /* 为滚动条预留空间 */
  overflow-y: auto;  /* 添加垂直滚动条 */
}

.card-wrapper {
  width: calc(33.33% - 0.67rem);
}

/* 美化滚动条样式 */
.cards-container::-webkit-scrollbar {
  width: 6px;
}

.cards-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 238, 255, 0.3);
  border-radius: 3px;
}

.cards-container::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 1400px) {
  .card-wrapper {
    width: calc(50% - 0.5rem);
  }
}

@media (max-width: 900px) {
  .card-wrapper {
    width: 100%;
  }
}
</style> 