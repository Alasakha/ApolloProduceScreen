<template>
<div class="h-[40vh] bg-red=300 w-full flex gap-4 pl-2 pr-2">
<Accounting class="flex-1"></Accounting>
<Store class="flex-1"></Store>
<DeadMoney class="flex-1"></DeadMoney>
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