/<template>
    <div class="w-screen h-[60vh] pl-[2vw] pr-[2vw] pt-[1vw] flex">
  


         <!-- 设备状态 -->
         <DashboardCard :isShowtilte="false" class="flex-1">
        <template #title>关键参数监控</template>
        <div class="h-[100%]">
          <Category/>
        </div>
      </DashboardCard> 
  
  
   
  
    </div>
  </template>
  
  <script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
import Category from '../Middle/RightContent/Statistic/index.vue'
  </script>