<template>
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
  
