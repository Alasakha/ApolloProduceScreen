<template>
    <div class="abnormal-container w-full h-full">
        <div class="abnormal-title">
            <h3>异常信息</h3>
        </div>
        
        <div class="wrapper flex flex-col h-full">
            <!-- 如果没有数据，显示暂无数据 -->
            <div v-if="!isLoading && isDataEmpty" class="empty-container">
                暂无数据
            </div>
            
            <!-- 数据加载完成且非空时显示图表 -->
            <div class="tablebox w-full h-full">
                <!-- 如果正在加载，显示 loading -->
                <dv-loading v-if="isLoading" class="text-white">Loading...</dv-loading>
                
                <ScrollBoard v-if="!isLoading && !isDataEmpty" :config="config" @click="clickHandler" />
            </div>
        </div>
        
        <!-- 弹窗部分 -->
        <el-dialog v-model="dialogVisible" title="详细信息" width="50%">
            <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
                <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick ,onBeforeUnmount,reactive} from 'vue';
import * as echarts from 'echarts';
import { getWarningNextDay } from '@/api/getStampWeldinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import ScrollBoard from '@/components/datav/ScrollBoard.vue'
const dialogVisible = ref(false);//弹窗控制
const selectedItem = ref({});
const route = useRoute();
const prodLine = route.query.prodLine;
const monthlyIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const categories = ref([]); // X 轴数据
const values = ref([]); // Y 轴数据
let chartInstance = null;
const config = reactive({
    header: ['排产时间',
  '客户单号',
  // '供应商代号',
  '品号',
  '品名',
  // '采购员',
  '欠料数量',],
    data: [
      ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']
    ],
    index: true,
    columnWidth: [50],
    align: [],
    rowNum:7,
    // showTooltip: true,
    showTooltip: true,
  })
  
    const getNextDay = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // 将日期增加一天
  
    // const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 获取月份，月份从0开始，因此加1
    const day = String(today.getDate()).padStart(2, '0'); // 获取日期，确保日期格式为两位数
  
    return `${month}-${day}`; // 格式化为 yyyy-MM-dd 格式
  };

  const nextday = getNextDay();

  const fetchData = () => {
    const param = prodLine === 'CY' ? '1003' : undefined; // 或其他默认值
getWarningNextDay(param).then(res => {
  isLoading.value = false;
  if (res.data.length !== 0) {
    const list = res.data;
    config.data = list.map(item => [
      nextday,
      item.customerOrderNo,
      // item.supplierCode,
      item.itemNo,
      item.itemName,
      // item.purchaserName,
      Math.round(Number(item.purchaseQuantity))
    ]);
    console.log('config.data:', config.data)
  }
});
  }
  
  // 在组件挂载时启动定时获取数据
  onMounted(() => {
    fetchData(); // 组件挂载时先请求一次
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
    // 清理定时器，避免组件卸载后定时器继续执行
    onBeforeUnmount(() => {
      eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    });
  
  
    const clickHandler = (row) => {
    selectedItem.value = row.row; // 直接保存整行
    dialogVisible.value = true;
  };
  </script>
  
  
  <style scoped>
  .abnormal-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
}

.abnormal-title {
    background: linear-gradient(135deg, #87CEEB, #98D8E8);
    padding: 8px;
    border-radius: 6px 6px 0 0;
    flex-shrink: 0;
}

.abnormal-title h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wrapper {
    flex: 1;
    min-height: 0;
    padding: 8px;
    box-sizing: border-box;
}

.tablebox {
    flex: 1;
    min-height: 0;
}

.empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #909399;
    font-size: 14px;
}

</style>
   