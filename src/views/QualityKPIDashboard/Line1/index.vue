<template>
    <div class="grid grid-cols-3 gap-4 h-[15vh] w-full ">
        <DataCard title1="月度客诉目标" title2="月度累计客诉次数" :data1="AllTarge.monthly_customer_complaint_target"
         :data2="{data:Alldata.monthly_customer_complaint,max:AllTarge.monthly_customer_complaint_target}" :belongCount="Alldata.monthly_customer_complaint_belongCount"/>
        <DataCard title1="月度大客户投诉目标" title2="月度累计客诉次数" :data1="AllTarge.monthly_large_customer_complaint_target" 
        :data2="{data:Alldata.monthly_large_customer_complaint,max:AllTarge.monthly_large_customer_complaint_target}" :belongCount="Alldata.monthly_large_customer_complaint_belongCount"/>
        <DataCard title1="月度常规客诉投诉目标" title2="月度累计客诉次数" :data1=" AllTarge.monthly_regular_customer_complaint_target" 
        :data2="{data:Alldata.monthly_regular_customer_complaint,max:AllTarge.monthly_regular_customer_complaint_target}" :belongCount="Alldata.monthly_regular_customer_complaint_belongCount"/>
    </div>
    <div class="grid grid-cols-3 gap-4 h-[15vh] w-full ">
        <DataCard title1="月度跨境投诉目标" title2="月度累计客诉次数" :data1="AllTarge.monthly_cross_border_complaint_target" :data2="{data:Alldata.monthly_cross_border_complaint,max:AllTarge.monthly_cross_border_complaint_target}" :belongCount="Alldata.monthly_cross_border_complaint_belongCount"/>
        <DataCard title1="月度配件投诉目标" title2="月度累计客诉次数" :data1="AllTarge.monthly_domestic_customer_complaint_target" :data2="{data:Alldata.monthly_accessory_complaint,max:AllTarge.monthly_domestic_customer_complaint_target}" :belongCount="Alldata.monthly_accessory_complaint_belongCount"/>
        <DataCard title1="月度国内客户投诉目标" title2="月度累计客诉次数" :data1=" AllTarge.monthly_domestic_customer_complaint" :data2="{data:Alldata.monthly_domestic_customer_complaint,max:AllTarge.monthly_domestic_customer_complaint}" :belongCount="Alldata.monthly_domestic_customer_complaint_belongCount"/>
    </div>




</template>
<script setup lang="ts">
import DataCard from '../components/DataCard.vue'
import { getServiceRequest } from '@/api/getQuiltyinfo'
import { onMounted, ref } from 'vue'

const AllTarge = ref({
    monthly_customer_complaint_target:10,
    monthly_large_customer_complaint_target:1,
    monthly_regular_customer_complaint_target:7,
    monthly_cross_border_complaint_target:3,
    monthly_domestic_customer_complaint_target:1,
    monthly_domestic_customer_complaint:1
})

const Alldata = ref<ServiceRequest>({
    monthly_customer_complaint: null,
    monthly_large_customer_complaint: null,
    monthly_regular_customer_complaint: null,
    monthly_cross_border_complaint: null,
    monthly_accessory_complaint: null,
    monthly_domestic_customer_complaint: null,
    // 每个DataCard的独立归属统计
    monthly_customer_complaint_belongCount: null,
    monthly_large_customer_complaint_belongCount: null,
    monthly_regular_customer_complaint_belongCount: null,
    monthly_cross_border_complaint_belongCount: null,
    monthly_accessory_complaint_belongCount: null,
    monthly_domestic_customer_complaint_belongCount: null
})

interface ServiceRequest {
    // 月度客诉目标
    monthly_customer_complaint: number
    // 月度大客户投诉目标
    monthly_large_customer_complaint: number
    // 月度常规客诉投诉目标
    monthly_regular_customer_complaint: number
    // 月度跨境投诉目标
    monthly_cross_border_complaint: number
    // 月度配件投诉目标
    monthly_accessory_complaint: number
    // 月度国内客户投诉目标
    monthly_domestic_customer_complaint: number
    // 每个DataCard的独立归属统计
    monthly_customer_complaint_belongCount: number
    monthly_large_customer_complaint_belongCount: number
    monthly_regular_customer_complaint_belongCount: number
    monthly_cross_border_complaint_belongCount: number
    monthly_accessory_complaint_belongCount: number
    monthly_domestic_customer_complaint_belongCount: number
}

const fetchData = () => {
        // 月度客诉目标 - 获取数据和归属统计
        getServiceRequest().then(res => {
            Alldata.value.monthly_customer_complaint = res.data.total
            Alldata.value.monthly_customer_complaint_belongCount = res.data.belongCount
            console.log('月度客诉目标:', Alldata.value.monthly_customer_complaint, '归属统计:', Alldata.value.monthly_customer_complaint_belongCount)
        })
        
        // 月度大客户投诉目标 - 获取数据和归属统计
        getServiceRequest('大客户',0,0,'GW').then(res => {
            Alldata.value.monthly_large_customer_complaint = res.data.total
            Alldata.value.monthly_large_customer_complaint_belongCount = res.data.belongCount
            console.log('月度大客户投诉目标:', Alldata.value.monthly_large_customer_complaint, '归属统计:', Alldata.value.monthly_large_customer_complaint_belongCount)
        })
        
        // 月度常规客诉投诉目标 - 获取数据和归属统计
        getServiceRequest('常规客户',0,0,'GW').then(res => {
            Alldata.value.monthly_regular_customer_complaint = res.data.total
            Alldata.value.monthly_regular_customer_complaint_belongCount = res.data.belongCount
            console.log('月度常规客诉投诉目标:', Alldata.value.monthly_regular_customer_complaint, '归属统计:', Alldata.value.monthly_regular_customer_complaint_belongCount)
        })
        
        // 月度跨境投诉目标 - 获取数据和归属统计
        getServiceRequest(null,1,0,null).then(res => {
            Alldata.value.monthly_cross_border_complaint = res.data.total
            Alldata.value.monthly_cross_border_complaint_belongCount = res.data.belongCount
            console.log('月度跨境投诉目标:', Alldata.value.monthly_cross_border_complaint, '归属统计:', Alldata.value.monthly_cross_border_complaint_belongCount)
        })
        
        // 月度配件投诉目标 - 获取数据和归属统计
        getServiceRequest(null,null,1,null).then(res => {
            Alldata.value.monthly_accessory_complaint = res.data.total
            Alldata.value.monthly_accessory_complaint_belongCount = res.data.belongCount
            console.log('月度配件投诉目标:', Alldata.value.monthly_accessory_complaint, '归属统计:', Alldata.value.monthly_accessory_complaint_belongCount)
        })
        
        // 月度国内客户投诉目标 - 获取数据和归属统计
        getServiceRequest(null,0,0,'HZ20000').then(res => {
            Alldata.value.monthly_domestic_customer_complaint = res.data.total
            Alldata.value.monthly_domestic_customer_complaint_belongCount = res.data.belongCount
            console.log('月度国内客户投诉目标:', Alldata.value.monthly_domestic_customer_complaint, '归属统计:', Alldata.value.monthly_domestic_customer_complaint_belongCount)
        })
}

onMounted(() => {
    fetchData()
})
</script>