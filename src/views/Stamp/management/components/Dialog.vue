<template>
  <el-dialog 
    v-model="visible" 
    :title="props.title"  
    width="90%"
  >
  <el-table 
        :data="paginatedData" 
        v-loading="loading"
        height="calc(70vh - 150px)" 
        style="width: 100%"
      >
        <el-table-column v-for="item in header" :key="item" :label="item" :prop="item" />
      </el-table>

        <!-- 添加分页组件 -->
        <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalItems"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'


const visible = defineModel()
const gridData = ref([])
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = computed(() => gridData.value.length)

// 定义props类型
const props = defineProps<{
  fetchData: () => Promise<any>,
  header: string[],
  title: string  // 添加title属性
}>()

// 处理页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 处理每页条数改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1  // 重置到第一页
}

// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return gridData.value.slice(start, end)
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const data = await props.fetchData()
    gridData.value = data
    console.log(gridData.value)
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听对话框打开时加载数据
watch(visible, (newVal) => {
  if (newVal) {
    loadData()
  }
})
</script>