<template>
<div class="h-[40vh] bg-red=300 w-full flex">
<Accounting class="basis-[30%]"></Accounting>
<Store class="basis-[55%]"></Store>
<DeadMoney class="basis-[25%]"></DeadMoney>
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