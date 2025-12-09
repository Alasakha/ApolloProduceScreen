<template>
  <div class="line2-container w-full flex items-center px-4">
    <!-- 左侧：人员信息 -->
    <div class="left-section flex-1 h-full">
      <PersonnelInfo />
    </div>

    <!-- 中间：月度计划信息 -->
    <div class="middle-section flex-1 h-full">
      <MonthlyPlanInfo />
    </div>

    <!-- 右侧：设备信息 -->
    <div class="right-section flex-1 h-full">
      <EquipmentInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonnelInfo from './components/PersonnelInfo.vue'
import MonthlyPlanInfo from './components/MonthlyPlanInfo.vue'
import EquipmentInfo from './components/EquipmentInfo.vue'
</script>

<style scoped>
.line2-container {
  height: 6vh;
  min-height: 50px;
  gap: 1vw;
}
</style>

