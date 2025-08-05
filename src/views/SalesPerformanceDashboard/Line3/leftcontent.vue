<template>
    <div class="content w-full h-full p-4">
        <h1 class="text-2xl font-bold text-[#00eeff]">爆品接单达成</h1>
        <div class="table-container overflow-auto rounded-lg border border-[#00eeff] shadow-[0_0_20px_rgba(0,238,255,0.3)]">
            <table class="w-full text-sm text-center border-collapse text-[#00eeff]">
                <thead>
                    <tr class="border-b border-[#00eeff40] bg-[#001122]">
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">组别</th>
                        <!-- <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">配件接单(美元)</th> -->
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">年度预算数量</th>
                        <!-- <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">年度预算金额(万)</th> -->
                        <!-- <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">再次预算数量</th> -->
                        <!-- <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">再次预算金额(万)</th> -->
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">已下单数量</th>
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">已下单金额(美元)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 常规数据行 -->
                    <tr v-for="(item, idx) in regularData" :key="idx" :class="[
                        'transition-all duration-300 border-b border-[#00eeff40]',
                        idx % 2 === 0 ? 'bg-[rgba(0,245,255,0.4)]' : 'bg-[rgba(0,238,255,0.1)]',
                        'hover:bg-[rgba(0,238,255,0.2)]'
                    ]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">{{ item.empCategory }}</td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ item.pjTotal }}</td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40] relative group">
                            <input 
                                v-model="item.ysQuantityYear" 
                                class="w-full bg-transparent outline-none text-center"
                                @change="updateBudget(item, 'ysQuantityYear', ($event.target as HTMLInputElement).value)"
                            >
                            <span class="comparison-icon" v-if="item.ysQuantityYearComparison">
                                {{ item.ysQuantityYearComparison }}
                            </span>
                        </td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40] relative group">
                            <input 
                                v-model="item.ysAmtYear" 
                                class="w-full bg-transparent outline-none text-center"
                                @change="updateBudget(item, 'ysAmtYear', ($event.target as HTMLInputElement).value)"
                            >
                            <span class="comparison-icon" v-if="item.ysAmtYearComparison">
                                {{ item.ysAmtYearComparison }}
                            </span>
                        </td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40] relative group">
                            <input 
                                v-model="item.ysQuantityAgain" 
                                class="w-full bg-transparent outline-none text-center"
                                @change="updateBudget(item, 'ysQuantityAgain', ($event.target as HTMLInputElement).value)"
                            >
                            <span class="comparison-icon" v-if="item.ysQuantityAgainComparison">
                                {{ item.ysQuantityAgainComparison }}
                            </span>
                        </td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40] relative group">
                            <input 
                                v-model="item.ysAmtAgain" 
                                class="w-full bg-transparent outline-none text-center"
                                @change="updateBudget(item, 'ysAmtAgain', ($event.target as HTMLInputElement).value)"
                            >
                            <span class="comparison-icon" v-if="item.ysAmtAgainComparison">
                                {{ item.ysAmtAgainComparison }}
                            </span>
                        </td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ item.xdCount }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ item.xdTotal }}</td>
                    </tr>
                    
                    <!-- 合计行 -->
                    <tr class="bg-[rgba(0,238,255,0.15)] font-semibold border-b border-[#00eeff40]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">{{ total.empCategory }}</td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.pjTotal }}</td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysQuantityYear }}</td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysAmtYear }}</td> -->
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysQuantityAgain }}</td> -->
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysAmtAgain }}</td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.xdCount }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.xdTotal }}</td>
                    </tr>

                    <!-- 阶段性汇总行 -->
                    <tr v-if="summaryData" class="bg-[rgba(0,238,255,0.1)] font-semibold border-b border-[#00eeff40]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">{{ summaryData.empCategory }}</td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.pjTotal }}</td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysQuantityYear }}</td>
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysAmtYear }}</td> -->
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysQuantityAgain }}</td> -->
                        <!-- <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysAmtAgain }}</td> -->
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.xdCount }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.xdTotal }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.table-container {
    position: relative;
    background: linear-gradient(180deg, rgba(0,19,47,0.95) 0%, rgba(0,19,47,0.85) 100%);
    box-shadow: 
        0 0 20px rgba(0,238,255,0.3),
        inset 0 0 20px rgba(0,238,255,0.1);
}

/* 移除 glow-effect div，改用背景渐变 */
/* .table-container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at 50% 50%,
        rgba(0, 238, 255, 0.15) 0%,
        rgba(16, 42, 82, 0.65) 95%
    );
    pointer-events: none;
} */

/* 表格行样式 */
tbody tr:nth-child(odd) {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.95) 0%,
        rgba(0, 238, 255, 0.05) 30%,
    );
}

tbody tr:nth-child(even) {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.95) 0%,
        rgba(0, 238, 255, 0.05) 30%,
        rgba(0, 238, 255, 0.05) 70%,
        rgba(0, 19, 47, 0.55) 100%
    );
}

/* 其他样式保持不变 */
th {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    text-shadow: 0 0 10px rgba(0,225,255,0.5);
    font-size: 0.9rem;
    background: linear-gradient(180deg, #001122 0%, #001a33 100%);
}

td {
    color: #00eeff;
    text-shadow: none;
}

tr:hover {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.8) 0%,
        rgba(0, 238, 255, 0.2) 30%,
        rgba(0, 238, 255, 0.2) 70%,
        rgba(0, 19, 47, 0.8) 100%
    ) !important;
}

tbody tr:last-child::before {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.95) 0%,
        rgba(0, 238, 255, 0.15) 30%,
        rgba(0, 238, 255, 0.15) 70%,
        rgba(0, 19, 47, 0.5) 100%
    );
    opacity: 1;
}

/* 添加新样式 */
.comparison-icon {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
}

.comparison-icon:contains('↑') {
    color: #67C23A;
}

.comparison-icon:contains('↓') {
    color: #F56C6C;
}

.comparison-icon:contains('=') {
    color: #E6A23C;
}

input {
    border: none;
    border-bottom: 1px solid transparent;
}

input:focus {
    border-bottom: 1px solid #00eeff;
}

.group:hover input {
    border-bottom: 1px solid rgba(0, 238, 255, 0.3);
}

/* 添加输入框样式 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}
</style>
  
  <script setup lang="ts">
import { getOrderCompletion } from '@/api/getIncomingInfo'
import { ref, computed, onMounted } from 'vue'
import { updateSalesPerformanceYs } from '@/api/getIncomingInfo'
import { ElMessage } from 'element-plus'
const GROUP_ID_MAP = {
  'champion组': '17AAF27C-9EF5-42EB-A18B-CC7F83B13C65',
  '王炸组': 'B0F95FD1-DF2D-473B-9580-62D6061A5CAF',
  '遥遥领先组': 'E61892EB-E6F1-422A-9E70-970108232145'
}

interface TableItem {
    empCategory: string;
    pjTotal: string;
    ysQuantityYear: string;
    ysAmtYear: string;
    ysQuantityAgain: string;
    ysAmtAgain: string;
    xdCount: string;
    xdTotal: string;
    id: string;
    // 添加比较属性
    ysQuantityYearComparison?: string;
    ysAmtYearComparison?: string;
    ysQuantityAgainComparison?: string;
    ysAmtAgainComparison?: string;
    isSummary?: boolean; // 新增属性，用于标识是否为阶段性汇总行
}

const tableData = ref<TableItem[]>([])

// 修改数据展示的计算属性
const regularData = computed(() => {
  return tableData.value.filter(item => item.empCategory !== '阶段性汇总');
});

const summaryData = computed(() => {
  return tableData.value.find(item => item.empCategory === '阶段性汇总');
});

// 格式化金额，保留2位小数，转换为万元
const formatAmount = (value: string | number): string => {
  if (!value) return '0.00'
  return (Number(value) ).toFixed(2)
}

// 格式化数量，保持原样
const formatQuantity = (value: string | number): string => {
  if (!value) return '0'
  return value.toString()
}

// 修改 total 计算属性
const total = computed(() => {
  // 只计算非阶段性汇总的数据
  const dataForTotal = tableData.value.filter(item => item.empCategory !== '阶段性汇总');

  if (!dataForTotal.length) return {
    empCategory: '合计',
    pjTotal: '0.00',
    ysQuantityYear: '0',
    ysAmtYear: '0.00',
    ysQuantityAgain: '0',
    ysAmtAgain: '0.00',
    xdCount: '0',
    xdTotal: '0.00'
  }

  return {
    empCategory: '合计',
    pjTotal: formatAmount(dataForTotal.reduce((sum, item) => sum + Number(item.pjTotal || 0), 0)),
    ysQuantityYear: dataForTotal.reduce((sum, item) => sum + Number(item.ysQuantityYear || 0), 0).toString(),
    ysAmtYear: formatAmount(dataForTotal.reduce((sum, item) => sum + Number(item.ysAmtYear || 0), 0)),
    ysQuantityAgain: dataForTotal.reduce((sum, item) => sum + Number(item.ysQuantityAgain || 0), 0).toString(),
    ysAmtAgain: formatAmount(dataForTotal.reduce((sum, item) => sum + Number(item.ysAmtAgain || 0), 0)),
    xdCount: dataForTotal.reduce((sum, item) => sum + Number(item.xdCount || 0), 0).toString(),
    xdTotal: formatAmount(dataForTotal.reduce((sum, item) => sum + Number(item.xdTotal || 0), 0))
  }
})

// fetchData 函数修改
const fetchData = async () => {
  try {
    const res = await getOrderCompletion({type:1})
    if (res.code === 200 && Array.isArray(res.data)) {
      tableData.value = res.data.map(item => ({
        empCategory: item.empCategory,
        pjTotal: formatAmount(item.pjTotal),
        ysQuantityYear: formatQuantity(item.ysQuantityYear),
        ysAmtYear: formatAmount(item.ysAmtYear),
        ysQuantityAgain: formatQuantity(item.ysQuantityAgain),
        ysAmtAgain: formatAmount(item.ysAmtAgain),
        xdCount: formatQuantity(item.xdCount),
        xdTotal: formatAmount(item.xdTotal),
        id: item.id
      } as TableItem));
      
      // 添加这行，向父组件发送数据
      emit('data-updated', tableData.value)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 更新预算数据
const updateBudget = async (item: TableItem, field: string, value: string) => {
    const id = GROUP_ID_MAP[item.empCategory]
    if (!id) {
        console.error('未找到对应的ID')
        return
    }

    try {
        const params = {
            id,
            ysQuantityYear: field === 'ysQuantityYear' ? value : item.ysQuantityYear,
            ysAmtYear: field === 'ysAmtYear' ? (Number(value) ).toString() : (Number(item.ysAmtYear) * 10000).toString(),
            ysQuantityAgain: field === 'ysQuantityAgain' ? value : item.ysQuantityAgain,
            ysAmtAgain: field === 'ysAmtAgain' ? (Number(value) ).toString() : (Number(item.ysAmtAgain) * 10000).toString()
        }

        const res = await updateSalesPerformanceYs(params)
        if (res.code === 200) {
            ElMessage.success('更新成功')
            compareValues(item)  // 更新后重新计算比较值
        } else {
            ElMessage.error('更新失败')
        }
    } catch (error) {
        console.error('更新失败:', error)
        ElMessage.error('更新失败')
    }
}

// 比较函数
const compareValues = (item: TableItem) => {
    // 比较年度预算金额
    const amtYear = Number(item.ysAmtYear);
    const actualAmt = Number(item.xdTotal);
    item.ysAmtYearComparison = amtYear > actualAmt ? '↓' : 
                               amtYear < actualAmt ? '↑' : '=';
}

onMounted(() => {
  fetchData()
})

// 定义emit
const emit = defineEmits(['data-updated'])
</script>
  