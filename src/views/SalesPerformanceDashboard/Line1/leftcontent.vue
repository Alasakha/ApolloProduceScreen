<template>
    <div class="content w-full h-full p-2 ">
        <h1 class="
            text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 
            font-bold text-[#00eeff] 
            text-center sm:text-left 
            3xl:text-sm 4xl:text-xl
        ">月度接单达成</h1>
        <div class="

            table-container overflow-auto 
            rounded-sm sm:rounded-md md:rounded-lg 
            border border-[#00eeff] 
            shadow-[0_0_10px_rgba(0,238,255,0.2)] sm:shadow-[0_0_15px_rgba(0,238,255,0.25)] md:shadow-[0_0_20px_rgba(0,238,255,0.3)]
            max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-12rem)]
            3xl:max-h-[calc(20vh-2rem)] 4xl:max-h-[calc(20vh-2.5rem)]
            
        ">
            <table class="w-full  text-center border-collapse text-[#00eeff] 3xl:text-[12px] 4xl:text-xs
            2xl:text-[10px] xl:text-[10px] lg:text-[10px] md:text-[10px] sm:text-[10px]">
                <thead>
                    <tr class="border-b border-[#00eeff40] bg-[#001122]">
                        <th 
                            v-for="header in tableHeaders" 
                            :key="header.key"
                            class="
                                px-1 py-1 
                                border-x border-[#00eeff40] text-[#00FFFF] font-normal 

                            "
                        >
                            <!-- XL屏幕显示 -->
                            <span v-if="header.xl !== header.lg" class="hidden xl:inline">{{ header.xl }}</span>
                            <!-- LG屏幕显示 -->
                            <span v-if="header.lg !== header.md" :class="header.xl !== header.lg ? 'hidden lg:inline xl:hidden' : 'hidden lg:inline'">{{ header.lg }}</span>
                            <!-- MD屏幕显示 -->
                            <span v-if="header.md !== header.sm" :class="header.lg !== header.md ? 'hidden md:inline lg:hidden' : 'hidden md:inline'">{{ header.md }}</span>
                            <!-- SM及以下屏幕显示 -->
                            <span :class="header.md !== header.sm ? 'md:hidden' : ''">{{ header.sm }}</span>
                        </th>
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
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ item.pjTotal }}</td>
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
                        <td class="px-4 py-2 border-x border-[#00eeff40] relative group">
                            <input 
                                v-model="item.ysAmtYear" 
                                class="w-full bg-transparent outline-none text-center"
                                @change="updateBudget(item, 'ysAmtYear', ($event.target as HTMLInputElement).value)"
                            >
                            <span class="comparison-icon" v-if="item.ysAmtYearComparison">
                                {{ item.ysAmtYearComparison }}
                            </span>
                        </td>
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
                        <td class="px-4 py-2 border-x border-[#00eeff40] relative group">
                            <input 
                                v-model="item.ysAmtAgain" 
                                class="w-full bg-transparent outline-none text-center"
                                @change="updateBudget(item, 'ysAmtAgain', ($event.target as HTMLInputElement).value)"
                            >
                            <span class="comparison-icon" v-if="item.ysAmtAgainComparison">
                                {{ item.ysAmtAgainComparison }}
                            </span>
                        </td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ item.xdCount }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ item.xdTotal }}</td>
                    </tr>
                    
                    <!-- 合计行 -->
                    <tr class="bg-[rgba(0,238,255,0.15)] font-semibold border-b border-[#00eeff40]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">{{ total.empCategory }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.pjTotal }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysQuantityYear }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysAmtYear }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysQuantityAgain }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.ysAmtAgain }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.xdCount }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ total.xdTotal }}</td>
                    </tr>

                    <!-- 阶段性汇总行 -->
                    <tr v-if="summaryData" class="bg-[rgba(0,238,255,0.1)] font-semibold border-b border-[#00eeff40]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">{{ summaryData.empCategory }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.pjTotal }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysQuantityYear }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysAmtYear }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysQuantityAgain }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ summaryData.ysAmtAgain }}</td>
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

// 表头配置
const tableHeaders = [
  {
    key: 'empCategory',
    xl: '组别',
    lg: '组别',
    md: '组别',
    sm: '组别'
  },
  {
    key: 'pjTotal',
    xl: '配件接单',
    lg: '配件接单',
    md: '配件接单',
    sm: '接单'
  },
  {
    key: 'ysQuantityYear',
    xl: '年度预算数量',
    lg: '年度预算数量',
    md: '年预算量',
    sm: '年量'
  },
  {
    key: 'ysAmtYear',
    xl: '年度预算金额(美元)',
    lg: '年预算金额',
    md: '年金额',
    sm: '年$'
  },
  {
    key: 'ysQuantityAgain',
    xl: '再次预算数量',
    lg: '再次预算数量',
    md: '再预算量',
    sm: '再量'
  },
  {
    key: 'ysAmtAgain',
    xl: '再次预算金额(美元)',
    lg: '再预算金额',
    md: '再金额',
    sm: '再$'
  },
  {
    key: 'xdCount',
    xl: '已下单数量',
    lg: '已下单数量',
    md: '已下单量',
    sm: '下量'
  },
  {
    key: 'xdTotal',
    xl: '已下单金额(美元)',
    lg: '已下单金额',
    md: '下金额',
    sm: '下$'
  }
]

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
  // 数据已经是万元单位，不需要再除以10000
  return Number(value).toFixed(2)
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

  // 处理数字，移除逗号并转换为数字
  const processNumber = (value: string | number) => {
    if (typeof value === 'string') {
      return Number(value.replace(/,/g, '')) || 0;
    }
    return Number(value) || 0;
  };

  // 计算合计
  const sum = {
    empCategory: '合计',
    pjTotal: dataForTotal.reduce((sum, item) => sum + processNumber(item.pjTotal), 0),
    ysQuantityYear: dataForTotal.reduce((sum, item) => sum + processNumber(item.ysQuantityYear), 0),
    ysAmtYear: dataForTotal.reduce((sum, item) => sum + processNumber(item.ysAmtYear), 0),
    ysQuantityAgain: dataForTotal.reduce((sum, item) => sum + processNumber(item.ysQuantityAgain), 0),
    ysAmtAgain: dataForTotal.reduce((sum, item) => sum + processNumber(item.ysAmtAgain), 0),
    xdCount: dataForTotal.reduce((sum, item) => sum + processNumber(item.xdCount), 0),
    xdTotal: dataForTotal.reduce((sum, item) => sum + processNumber(item.xdTotal), 0)
  };

  // 格式化返回结果
  return {
    empCategory: sum.empCategory,
    pjTotal: formatAmount(sum.pjTotal),
    ysQuantityYear: sum.ysQuantityYear.toString(),
    ysAmtYear: formatAmount(sum.ysAmtYear),
    ysQuantityAgain: sum.ysQuantityAgain.toString(),
    ysAmtAgain: formatAmount(sum.ysAmtAgain),
    xdCount: sum.xdCount.toString(),
    xdTotal: formatAmount(sum.xdTotal)
  }
})

// fetchData 函数修改
const fetchData = async () => {
  try {
    const res = await getOrderCompletion({type:0})
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
            ysAmtYear: field === 'ysAmtYear' ? (Number(value) ).toString() : (Number(item.ysAmtYear) ).toString(),
            ysQuantityAgain: field === 'ysQuantityAgain' ? value : item.ysQuantityAgain,
            ysAmtAgain: field === 'ysAmtAgain' ? (Number(value) ).toString() : (Number(item.ysAmtAgain)).toString()
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
  