<template>
    <div class="flex-2 h-[30vh]">
        <dv-border-box13>
            <div class="monthly-budget-container">
                <!-- 标题 -->
                <div class="title">年度爆品上新计划</div>
                
                <!-- 表格容器 -->
                <div class="table-container">
                    <table class="monthly-table">
                        <thead>
                            <tr>
                                <th class="category-header">分类</th>
                                <th v-for="month in months" :key="month" class="month-header">
                                    {{ month }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 月预算目标行 -->
                            <tr class="budget-row">
                                <td class="row-label budget-label">月预算目标</td>
                                <td v-for="(data, index) in budgetData" :key="index" 
                                    class="data-cell budget-cell">
                                    <div v-if="data.items && data.items.length > 0" class="items-container">
                                        <div v-for="(item, itemIndex) in data.items" 
                                             :key="itemIndex" 
                                             class="item-tag budget-tag">
                                            {{ item.name }}
                                        </div>
                                    </div>
                                    <div v-else class="empty-data">0</div>
                                </td>
                            </tr>
                            
                            <!-- 月实际达成行 -->
                            <tr class="actual-row">
                                <td class="row-label actual-label">月实际达成</td>
                                <td v-for="(data, index) in actualData" :key="index" 
                                    class="data-cell actual-cell">
                                    <div v-if="data.items && data.items.length > 0" class="items-container">
                                        <div v-for="(item, itemIndex) in data.items" 
                                             :key="itemIndex" 
                                             class="item-tag actual-tag">
                                            {{ item.name }}
                                        </div>
                                    </div>
                                    <div v-else class="empty-data">0</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- 统计信息 -->
                <div class="stats-container">
                    <div class="stat-item">
                        <div class="stat-label">总预算目标:</div>
                        <div class="stat-value">{{ totalBudgetItems }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">总实际达成:</div>
                        <div class="stat-value">{{ totalActualItems }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">完成率:</div>
                        <div class="stat-value completion-rate">{{ completionRate }}%</div>
                    </div>
                </div>
            </div>
        </dv-border-box13>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 月份数据
const months = ref(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'])

// 预算目标数据
const budgetData = ref([
    { items: [], highlight: false }, // 1月
    { items: [], highlight: false }, // 2月
    { items: [
         { name: '进化者24Pro', highlight: true },
    ], highlight: false }, // 3月
    { items: [
                { name: '飞驰BE33', highlight: true },
                { name: '闪电AGB40-1D', highlight: true },
                { name: '进化者20Pro', highlight: true },
                { name: '战娃16/16', highlight: true }
    ], highlight: false }, // 4月
    { 
        items: [
            { name: '暴风70', highlight: true },
            { name: '漫游者CR500', highlight: true },
            { name: '进化者22Pro', highlight: true }
        ], 
        highlight: false 
    }, // 5月
    { items: [
            { name: '暴风110', highlight: true },
            { name: '风行者', highlight: true },
            { name: 'EV800', highlight: true }
    ], highlight: false }, // 6月
    { 
        items: [
            { name: '暴风125', highlight: true },
            { name: '坦克TK200', highlight: true }
        ], 
        highlight: false 
    }, // 7月
    { 
        items: [], 
        highlight: true 
    }, // 8月 - 橙色背景
    { 
        items: [
            { name: '飞驰竞技版', highlight: true }
        ], 
        highlight: false 
    }, // 9月
    { 
        items: [
           { name: 'DNA12 PRO MAX', highlight: true },
           { name: 'DNA16 PRO MAX', highlight: true },
           { name: '坦克TK125', highlight: true }
        ], 
        highlight: false 
    }, // 10月
    { 
        items: [

        ], 
        highlight: false 
    }, // 11月
    { 
        items: [
            { name: '坦克TK300', highlight: true },
        ], 
        highlight: false 
    } // 12月
])

// 实际达成数据
const actualData = ref([
    { items: [] }, // 1月
    { items: [] }, // 2月
    { items: [] }, // 3月
    { items: [] }, // 4月
    { items: [] }, // 5月
    { items: [] }, // 6月
    { items: [] }, // 7月
    { items: [] }, // 8月
    { items: [] }, // 9月
    { items: [] }, // 10月
    { items: [] }, // 11月
    { items: [] }  // 12月
])

// 计算总预算目标项目数
const totalBudgetItems = computed(() => {
    return budgetData.value.reduce((total, month) => total + month.items.length, 0)
})

// 计算总实际达成项目数
const totalActualItems = computed(() => {
    return actualData.value.reduce((total, month) => total + month.items.length, 0)
})

// 计算完成率
const completionRate = computed(() => {
    if (totalBudgetItems.value === 0) return 0
    return Math.round((totalActualItems.value / totalBudgetItems.value) * 100)
})

// 模拟数据更新
const updateData = () => {
    // 这里可以添加实时数据更新逻辑
    console.log('数据更新中...')
}

onMounted(() => {
    // 组件挂载后的初始化逻辑
    console.log('月度预算表格已加载')
})
</script>

<style scoped>
.monthly-budget-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px;
    background: transparent;
}

.title {
  font-size: 1.6rem;
  color: #00eaff;
  text-align: center;
  flex: none;
}

.table-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.monthly-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.monthly-table thead {
    display: block;
    flex-shrink: 0;
}

.monthly-table tbody {
    display: block;
    flex: 1;
    overflow-y: auto;
}

.monthly-table tr {
    display: flex;
    width: 100%;
}

.monthly-table th,
.monthly-table td {
    border: 1px solid #00eaff;
    padding: 8px 4px;
    text-align: center;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 7vh;
}

/* 表头样式 */
.category-header {
    background: transparent;
    color: #ffffff;
    font-weight: normal;
    font-size: 11px;
    min-width: 60px;
    flex: 0 0 60px;
}

.month-header {
    background: transparent;
    color: #ffffff;
    font-weight: normal;
    font-size: 10px;
    min-width: 40px;
    flex: 0 0 40px;
}

/* 行标签样式 */
.row-label {
    background: transparent;
    color: #ffffff;
    font-weight: normal;
    font-size: 11px;
    min-width: 60px;
    flex: 0 0 60px;
}

/* 数据单元格样式 */
.data-cell {
    background: transparent;
    color: #ffffff;
    min-height: 40px;
    vertical-align: middle;
}

.items-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.item-tag {
    background: #00eaff;
    color: #000000;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 9px;
    font-weight: normal;
    margin: 0;
    white-space: nowrap;
    display: inline-block;
}

.budget-tag {
    background: #00eaff;
    color: #000000;
}

.actual-tag {
    background: #ff6b35;
    color: #ffffff;
}

.empty-data {
    color: #ffffff;
    font-size: 11px;
}

/* 统计信息样式 */
.stats-container {
    display: flex;
    justify-content: space-around;
    padding: 4px 0;
    background: transparent;
    flex-shrink: 0;
}

.stat-item {
    width: 70%;
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    gap: 10px;
    border: 1px solid #00eaff;
    padding: 8px 12px;
    border-radius: 4px;
}

.stat-label {
    font-size: 15px;
    color: #ffffff;
    font-weight: normal;
}

.stat-value {
    font-size: 12px;
    color: #ffffff;
    font-weight: normal;
}

.completion-rate {
    color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .monthly-table {
        font-size: 10px;
    }
    
    .item-tag {
        font-size: 8px;
        padding: 1px 3px;
    }
}
</style>