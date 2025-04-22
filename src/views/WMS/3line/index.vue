<template>
<div class="h-[30vh] bg-red=300 w-full flex">
    <!-- 账务处理及时率柱状图(取各仓位应出入库单据和实际) -->
    <Accounting class="flex-1"></Accounting>

    <!-- 仓库呆滞物料预警前置15天 -->
    <Store class="flex-3"></Store>
    
    <!-- 呆滞金额按各仓位取值 -->
    <DeadMoney class="flex-0.5"> </DeadMoney>
</div>

</template>



<script setup>
import { ref, computed } from 'vue';
import Accounting from './Accounting/index.vue';
import Store from './Store/index.vue'
import DeadMoney from './DeadMoney/index.vue'
</script>


<style>


</style>