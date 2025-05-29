<template>
    <div class="content w-full h-full flex items-center justify-around">
      <!-- 优秀采购员 -->
      <div class="flex flex-col items-center justify-start h-full">
        <div class="text-white text-2xl font-semibold tracking-wide mb-2 drop-shadow">
          当日优秀采购员
        </div>
        <div class="mt-6 text-center text-white text-4xl font-bold w-full h-full flex justify-center items-center">
          <div class="text-5xl animate-bounce-slow mr-4">👍</div>
          {{ top }}
        </div>
      </div>
  
      <!-- 待努力采购员 -->
      <div class="flex flex-col items-center justify-start h-full">
        <div class="text-white text-2xl font-semibold tracking-wide mb-2 drop-shadow">
          当日待加油采购员
        </div>
        <div class="mt-6 text-center text-white text-4xl font-bold w-full h-full flex justify-center items-center">
          <div class="text-5xl animate-bounce-slow mr-4">✊</div>
          {{ Bottom }}
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">

    import { ref, onMounted, onBeforeUnmount} from 'vue';
    import { getExellentPerson } from '@/api/getnewInjection';

    import { eventBus } from '@/utils/eventbus';

  const top = ref('')
  const Bottom = ref('')




   // 请求数据x
   const fetchData = () => {
    getExellentPerson().then(res => {
        top.value = res.data[0].purchaserName
        Bottom.value = res.data[res.data.length-1].purchaserName
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
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-shake-slow {
  animation: shake 1.5s infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 1.8s infinite;
}
</style>