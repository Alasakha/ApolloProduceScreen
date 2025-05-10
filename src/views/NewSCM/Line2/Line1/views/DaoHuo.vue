<!-- <template>
    <div class="content w-full h-full flex items-center justify-center">
      <dv-border-box8 :dur="5" class="w-[500px] h-[300px] rounded-2xl shadow-md">
        <div class="flex flex-col items-center justify-start h-full">
          <GlobalTitle title="当日优秀采购员" size="xl" />

          <div class="mt-6 text-center text-white text-4xl font-bold w-full h-full flex justify-center items-center">
            <div class="text-6xl">🏆</div> {{top}} 
          </div>
        </div>
      </dv-border-box8>
    </div>
  </template>
  

  <script setup lang="ts">

    import { ref, onMounted, onBeforeUnmount} from 'vue';
    import { getExellentPerson } from '@/api/getnewInjection';

    import { eventBus } from '@/utils/eventbus';

  const top = ref('')
  




   // 请求数据x
   const fetchData = () => {
    getExellentPerson().then(res => {
        top.value = res.data[0].purchaserName
      }).catch(() => {

      });
    };
   
    
    onMounted(() => {
      fetchData(); // 组件挂载时先请求一次
      eventBus.on("refreshData", fetchData); // 监听全局刷新事件
    });
    
    onBeforeUnmount(() => {
      eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    });
  </script>


  <style scoped>
 
  </style>
  
 -->
 <template>
    <div class="content w-full h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题 -->
            <GlobalTitle title="到货不及时各采购员占比" size="xl"/>
  
  
  <!-- 图表容器 -->
  <div class="chartsbox w-full h-[15vh] mt-4">
    <div ref="Indicators1" class="w-full h-full"></div>
   </div>  
  </dv-border-box8>
  
    </div>
    
    </template>
    
    
    <script setup>
    import BigScreenTitle from '@/components/title.vue'
    import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
    import { getDeliveryRat } from '@/api/getnewInjection';
    import { useRoute } from 'vue-router';
    import { eventBus } from '@/utils/eventbus';
    import { formatPieChartData } from '@/utils/map';
    import * as echarts from 'echarts';
    import { createChartOption } from './leftcharts';
    
    const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
  };
  
  const queryDate = getYesterday(); // 昨天的日期
    // Loading 和 数据为空的状态
    const isLoading = ref(true);
    const isDataEmpty = ref(false);
    const Indicators1 = ref(null);
    
    
    // 渲染图表的函数
    const drawMonthlyIndicators = (formattedData) => {
      nextTick(() => {
        const Indicators1Element = echarts.init(Indicators1.value);
        const option = createChartOption( formattedData ); // 先用写死的，不传 formattedData
        Indicators1Element.setOption(option);
      });
    };
    
    // 处理数据
    const processData = (data) => {
    
     const formattedData = formatPieChartData(data, 'purchaserName','bjsNum');
     const processedData = formattedData
  .filter(item => item.value !== 0) // 过滤掉 value 为 0 的项
  .sort((a, b) => b.value - a.value) // 按 value 降序排序
      if (processedData.length == 0) {
        isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
      } else {
        isDataEmpty.value = false;
        drawMonthlyIndicators(processedData);  // 直接渲染图表
      }
    };
    
    // 请求数据
    const fetchData = () => {
        getDeliveryRat(queryDate).then(res => {
        isLoading.value = false;   // 加载完成，关闭 loading 状态
        processData(res.data);  // 处理数据并渲染图表
      }).catch(() => {
        isLoading.value = false;
        isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
      });
    };
    
    onMounted(() => {
      fetchData(); // 组件挂载时先请求一次
      eventBus.on("refreshData", fetchData); // 监听全局刷新事件
    });
    
    onBeforeUnmount(() => {
      eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    });
    </script>
    
    
    
    
    <style scoped>
    
    </style>
  
  
  