<template>
    <div class="bottom">
        <dv-border-box12>  
            <div class="table-title">生产异常工单明细</div>
            <ScrollBoard
                ref="scrollBoard"
                :config="config"
                style="width:100%;height:80%"
                
            />
        </dv-border-box12>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getAbnormalUnfinished } from '@/api/getPmcinfo'

const scrollBoard = ref()
const config = reactive({
    header: ['工作中心', '故障类型', '申报时间', '客户单号', '规格', '故障描述', '申请人'],
    data: [],
    index: true,
    columnWidth: [50, 100, 100, 180, 150, 160,200,150 ],
    align: [],
    rowNum: 6,
    headerBGC: '#0d47a1',
    oddRowBGC: '#1565c0',
    evenRowBGC: '#1976d2',
    waitTime: 3000,
    carousel: 'single'
})

const fetchData = async () => {
    const res = await getAbnormalUnfinished()
    if (res.code === 200 && res.data.length > 0) {
    config.data = (res.data || []).map(item => [
        item.md002 ?? '--',
        item.guZhangTypeName ?? '--',
        item.startTime ?? '--',
        item.ta033 ?? '--',
        item.ta034 ?? '--',
        item.startRemark ?? '--',
        item.startPeopleName ?? '--'
    ])
    }else{
        config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']]
    }
}

onMounted(fetchData)
</script>

<style scoped>
.table-title {
    text-align: center;
    color: #00eaff;
    font-size: 1.1vw;
    font-weight: bold;
    margin-bottom: 1vh;
    letter-spacing: 0.1vw;
    text-shadow: 0 0 1vw #003366;
}
</style>



