<template>
  <div class="charts-container">
    <dv-border-box8>
        <div class="charts-content">
        <div class="charts1">
          <dv-border-box10><MonthChart></MonthChart></dv-border-box10>
        </div>
        <div class="charts2">
          <dv-border-box10><MonthResponsityTop></MonthResponsityTop></dv-border-box10>
        </div>
        <div class="charts3">
          <dv-border-box10><TodayChart></TodayChart></dv-border-box10>
        </div>
        <div class="charts4">
          <dv-border-box10><TodayResponsityTop/></dv-border-box10>
        </div>
        
      </div>
    </dv-border-box8>
  </div>
</template>

<script setup>
import MonthChart from './MonthTop.vue';
import MonthResponsityTop from './MonthResponsityTop.vue';
import TodayChart from './TodayTop.vue';
import TodayResponsityTop from './TodayResponsityTop.vue';
</script>

<style scoped>
.charts-container {
  width: 100%;
  height: 55%;
  padding-right: 1vw;
}
.charts-content {
  display: flex;
  gap: 20px;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}
.charts1, .charts2, .charts3,.charts4 {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

</style>
