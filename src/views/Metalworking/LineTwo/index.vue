<template>
    <div class="metalworking h-[30vh] p-4">
        <dv-border-box-10 >
        <div class="production-data text-white w-full h-full  flex justify-center flex-col">

        <div class="row flex justify-around items-centers  " >
        <DataCard  
          title="本月已完成数" 
          :value="MonthlyData?.done ??  '无数据'" 
          /> 
          <DataCard  
          title="本月已完成数" 
          :value="MonthlyData?.done ??  '无数据'" 
        /> 
          <DataCard  title="本月待生产数" 
          :value="MonthlyData?.incomplete ??  '无数据'" 
          />
        </div>
        <div class="row flex justify-around items-centers" >
          <DataCard title="今日总排产" :value="TodayData?.pcTotal ?? '无数据'" /> 
          <DataCard title="今日已完成"  :value=" TodayData?.done ?? '无数据'" />
          <DataCard title="今日待生产" :value="TodayData?.unProduce ??  '无数据'" />
          <DataCard title="今日产量达成率" :value="TodayData?.rate ??  '无数据'"/>
        </div>
      </div>
    </dv-border-box-10>
    </div>
    
</template>

<script setup>
// Add your script logic here
import DataCard from '@/components/DataCard.vue';
</script>

<style scoped>
.metalworking {
    /* Add your styles here */
}
</style>x