<template>
    <div class="left-container w-1/3 h-full ">
        <Title title="左内容">
            <PersonnalSituation 
                :efficiency-api="efficiencyApi"
                :attendance-api="attendanceApi"
                :prod-line="prodLine"
                title="人员情况"
                refresh-event="refreshData"
            />
            <!-- <designSituation /> -->
        </Title>
    </div>
</template>

<style scoped>
.left-container {
    display: flex;
    flex-direction: column;
}
</style>


<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Title from './title.vue'
// import designSituation from '../component/design/onSituation.vue'
import PersonnalSituation from './PersonnalSituation.vue'
import { getEfficiencyToday, getSignInMember } from '@/api/getProduceinfo'

const route = useRoute()
const prodLine = ref(route.query.prodLine as string || '1003')

// 定义 API 函数
const efficiencyApi = async (prodLine: string) => {
    return await getEfficiencyToday(prodLine)
}

const attendanceApi = async (prodLine: string) => {
    return await getSignInMember(prodLine)
}
</script>
