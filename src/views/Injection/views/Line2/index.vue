/<template>
    <div class="w-screen h-[60vh] pl-[2vw] pr-[2vw] pt-[0.5vw] flex flex-col">
  
      <LeftContent/>

         <!-- 设备状态 -->
         <div class="flex-1 min-h-0">
          <Category/>
        </div>
  
  
   
  
    </div>
  </template>
  
  <script setup lang="ts">
  import LeftContent from './LeftContent.vue';
import Category from '../Middle/RightContent/Statistic/index.vue'
  </script>