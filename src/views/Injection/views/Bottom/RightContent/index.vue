<!-- <template>
  <div class='pl-5 pt-1'>
<div class="flex justify-center items-center text-lg text-white font-bold">
  <p class="tracking-widest text-xl">历史不良信息看板</p>
</div>
    
    <ScrollBoard :config="config" style="width:97%;height:19vh;" />
  </div> 
</template>
<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getabnormalInfo } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';

// 初始化 配置对象
const config = reactive({
  header: ['工单单号','不良原因','责任部门', '责任人','时间', '品名','品号','规格'],
  data: [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']],
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [],
  headerHeight: 20,
  showTooltip: true
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getabnormalInfo(); // 获取接口数据
    if (res && res.data && res.data.length > 0) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.ta002 || '暂无数据',
        item.ngName || '暂无数据',
        item.admin_UNIT_NAME || '暂无数据',
        item.ngResponPeople || '暂无数据',
        item.createDate ? item.createDate.slice(0,16) : '暂无数据',
        item.mb002 || '暂无数据',
        item.ta006 || '暂无数据',
        item.mb003 || '暂无数据'
      ]);
    } else {
      config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
  }
}
// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});


  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
:deep(.ScrollBoard .header) {
  background: rgba(79,142,247,0.3);
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.6vw;
}

</style> -->

<template>
  
  <div class='pl-5 pt-1'>
<div class="flex justify-center items-center text-lg text-white font-bold">
  <p class="tracking-widest text-xl ">工单异常</p>
</div>
    
    <ScrollBoard :config="config" style="width:47vw;height:19vh;" @click='clickHandler'/>
  </div>

  <!-- 弹窗部分 -->
<el-dialog v-model="dialogVisible" title="详细信息" width="50%">
  <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
    <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
  </div>
</el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, nextTick ,onBeforeUnmount,reactive} from 'vue';
import ScrollBoard from '@/components/datav/ScrollBoard.vue'
import * as echarts from 'echarts';
import { fetchClosingRateData } from './fetchMesData';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';

const dialogVisible = ref(false);//弹窗控制
const selectedItem = ref({});
const route = useRoute();
const prodLine = 'zhusu'
const monthlyIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const categories = ref([]); // X 轴数据
const values = ref([]); // Y 轴数据
let chartInstance = null;
const scrollBoardRef = ref(null);
const config = reactive({
  header: ['状态', '客户单号', '工单号','车型名称','工单数量','应完成时间','欠数','处理时长'],
  data: [
    ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']
  ],
  index: true,
columnWidth: [50],
  align: [],
  rowNum:5,
    // showTooltip: true,
    showTooltip: true,
})


const fetchData = () => {
  fetchClosingRateData(prodLine)
    .then((res) => {
      if (res && res.length > 0) {
        config.data = res.map(item => [
          '未完工',
          item.number ?? '无',
          item.workNo ?? '无',
          item.specifications ?? '无',
          Number(item.productionQuantity) ?? '无',
          item.dateTime  ?? '无',
          Number(item.productionQuantity)-Number(item.inboundQuantity),
          item.daysBetween+'天' ??'无'
        ])
        isDataEmpty.value = false;
      } 
    })
    .catch((error) => {
      console.error('Error fetching data:', error);  // 错误回调
      isDataEmpty.value = true; // 如果发生错误，显示暂无数据
    })
    .finally(() => {
      isLoading.value = false;  // 无论成功失败，都结束加载
    });
};

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


h2 {
  top: 0.5vh;
  left: 1vw;
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
  color:white
}



</style>
 