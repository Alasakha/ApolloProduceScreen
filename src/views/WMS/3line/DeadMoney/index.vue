<template>
    <div class="accounting">
        <dv-border-box10>

            <div class="bc h-[22vh]">
                <div class="text-center text-2xl font-bold text-white">呆滞金额</div>
                <div class="text-center text-2xl font-bold text-white h-[2vh]"></div>
                <dv-scroll-board :config="config" class="w-full  p-4 pt-0 mt-4" />
            </div>
        
    </dv-border-box10>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import {getstagnantAmount} from  '@/api/getWMSinfo'
import { eventBus } from '@/utils/eventbus';


const rawData = ref([]);
const config = reactive({
  header: ['仓位', '呆滞金额'],
  data: [], // 初始为空
  index: true,
  columnWidth: [50,100,100],
  align: ['center'],
});


const fetchData = async () => {
  try {
    const res = await getstagnantAmount();
    const transformed = Object.entries(res.data as Record<string, string | number>).map(([key, value]) => [
      key,
      parseFloat(value.toString()).toFixed(2), // 确保 value 转换为字符串
    ]);
    rawData.value = transformed;
    config.data = transformed; // ✅ 关键：赋值给 config.data
  } catch (e) {
    console.log('数据获取失败');
  }
};

onMounted(() => {
  eventBus.on('refreshData', fetchData);
  fetchData();
  


});

onBeforeUnmount(() => {
  // 移除全局事件监听
  eventBus.off('refreshData', fetchData);


});
</script>

<style scoped>
.accounting {
    padding: 0.5vw;
    font-family: Arial, sans-serif;
}
</style>