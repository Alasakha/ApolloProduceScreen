<template>
  <div class="scroll-wrapper">
    <div
      class="scroll-content"
      :style="{ transform: `translateY(-${currentOffset}px)` }"
    >
      <div
        class="page"
        v-for="(page, index) in pagedData"
        :key="index"
        :style="{ height: `${pageHeight}px` }"
      >
        <table class="table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in page" :key="row[uniqueKey]">
              <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  data: Array,
  columns: Array,
  pageSize: { type: Number, default: 10 },
  interval: { type: Number, default: 3000 },
  uniqueKey: { type: String, default: 'id' },
  rowHeight: { type: Number, default: 40 },
})

const pagedData = computed(() => {
  const pages = []
  for (let i = 0; i < props.data.length; i += props.pageSize) {
    pages.push(props.data.slice(i, i + props.pageSize))
  }
  return pages
})

const currentPage = ref(0)
const pageHeight = computed(() => props.pageSize * props.rowHeight)
const currentOffset = computed(() => currentPage.value * pageHeight.value)

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % pagedData.value.length
  }, props.interval)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.scroll-wrapper {
  height: 400px; /* 或动态计算 pageHeight */
  overflow: hidden;
  position: relative;
}
.scroll-content {
  transition: transform 0.5s ease;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background: #444;
  color: white;
}
tbody tr:nth-child(odd) {
  background-color: #f0f0f0;
}
.page {
  overflow: hidden;
}
</style>