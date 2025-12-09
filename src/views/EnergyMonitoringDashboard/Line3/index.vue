<template>
  <!-- 引入阿里巴巴iconfont -->
  <link rel="stylesheet" href="//at.alicdn.com/t/c/font_8d5l8fz5bvb.css">
  
  <div class="line3-container">
    <div class="header h-[10%]">
      <!-- <div class="title">能耗监控</div> -->
                 <div class="dashboard-title">
            <span class="title-icon">📊</span>
            <h2 class="title-elegant tracking-widest">车间各单位耗电情况</h2>
          </div>
    </div>
    
    <div class="content h-[90%]">
      <div class="energy-grid">
        <!-- 有数据时显示能耗卡片 -->
        <div 
          v-for="(item, index) in energyData" 
          :key="index"
          class="energy-card"
          :class="{ 'exceeded': Number(item.actualPerUnit) > Number(item.standardPerUnit) + 0.5 }"
        >
          <div class="card-header">
            <div class="workshop-info">
              <span class="energy-icon">⚡</span>
              <div class="workshop-name text-xl sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[12px] 4xl:text-xl">{{ item.workshopName }}</div>
            </div>
            <div class="ratio" :class="{ 'exceeded': Number(item.ratio) > 0.5, 'saved': Number(item.ratio) <= 0.5 }">
              {{ Number(item.ratio) > 0 ? '+' : '' }}{{ item.ratio }}
            </div>
          </div>
          

          <div class="card-content 3xl:gap-0">
            <div class="flex items-center">
              <span class="data-icon">🎯</span>
              <span class="text-white  text-xl sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[8px] 4xl:text-xl">标准每台耗电量</span>
              <div class="number-display">
                <span class="number-value" :style="{ fontSize: getFontSize(), color: '#00eeff' }">
                  {{ Number(item.standardPerUnit).toFixed(1) }}
                </span>
                <span class="number-unit" :style="{ fontSize: getFontSize() * 0.7, color: '#00eeff' }">度</span>
              </div>
            </div>
            
            <div class="flex items-center">
              <span class="data-icon">⚡</span>
              <span class="text-white  text-xs sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[8px] 4xl:text-sm">实际每台日耗电量</span>
              <div class="number-display">
                <span class="number-value" :style="{ 
                  fontSize: getFontSize(), 
                  color: Number(item.actualPerUnitDaily) > Number(item.standardPerUnit) + 0.5 ? '#ff0000' : '#00ff00' 
                }">
                  {{ Number(item.actualPerUnitDaily).toFixed(2) }}
                </span>
                <span class="number-unit" :style="{ 
                  fontSize: getFontSize() * 0.7, 
                  color: Number(item.actualPerUnitDaily) > Number(item.standardPerUnit) + 0.5 ? '#ff0000' : '#00ff00' 
                }">度</span>
              </div>
            </div>
            
            <div class="flex items-center">
              <span class="data-icon">🔋</span>
              <span class="text-white  text-xs sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[8px] 4xl:text-sm">实际每台月耗电量</span>
              <div class="number-display">
                <span class="number-value" :style="{ fontSize: getFontSize(), color: '#ffaa00' }">
                  {{ Number(item.actualPerUnit).toFixed(1) }}
                </span>
                <span class="number-unit" :style="{ fontSize: getFontSize() * 0.7, color: '#ffaa00' }">度</span>
              </div>
            </div>
            <div class="flex items-center">
              <span class="data-icon">🔋</span>
              <span class="text-white  text-xs sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[8px] 4xl:text-sm">月度实际耗电量</span>
              <div class="number-display">
                <span class="number-value" :style="{ fontSize: getFontSize(), color: '#ffaa00' }">
                  {{ Number(item.actualTotal).toFixed(1) }}
                </span>
                <span class="number-unit" :style="{ fontSize: getFontSize() * 0.7, color: '#ffaa00' }">度</span>
              </div>
            </div>
            
            <!-- 年度电量数据 -->
            <div class="flex items-center">
              <span class="data-icon">📅</span>
              <span class="text-white  text-xs sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[8px] 4xl:text-sm">年度电量数据</span>
              <div class="number-display">
                <span class="number-value" :style="{ fontSize: getFontSize(), color: '#00eeff' }">
                  {{ item.yearlyElectric }}
                </span>
                <span class="number-unit" :style="{ fontSize: getFontSize() * 0.7, color: '#00eeff' }">度</span>
              </div>
            </div>
            
            <!-- 空压机月度分摊值（仅显示在需要分摊的车间） -->
            <div class="flex items-center" v-if="item.airCompressorAllocation !== undefined">
              <span class="data-icon">💨</span>
              <span class="text-white  text-xs sm:text-sm md:text-base xl:text-xs  2xl:text-[8px] 3xl:text-[8px] 4xl:text-sm">空压机月度分摊值</span>
              <div class="number-display">
                <span class="number-value" :style="{ fontSize: getFontSize(), color: '#ffaa00' }">
                  {{ Number(item.airCompressorAllocation).toFixed(1) }}
                </span>
                <span class="number-unit" :style="{ fontSize: getFontSize() * 0.7, color: '#ffaa00' }">度</span>
              </div>
            </div>
            
            <!-- 添加填写原因按钮 -->
            <div 
              class="reason-section" 
              v-if="Number(item.ratio) > 0.5"
              @click="toggleReasonSection(index)"
            >
              <div class="reason-info" v-show="expandedReasonIndex === index">
                <span class="reason-icon">⚠️</span>
                <span class="reason-label">超过原因：</span>
                <span class="reason-text">{{ item.reason || '暂未填写' }}</span>
              </div>
              <div class="reason-actions" v-show="expandedReasonIndex === index">
                <button 
                  class="reason-btn"
                  @click.stop="openReasonDialog(item)"
                >
                  <span class="btn-icon">✏️</span>
                  填写原因
                </button>
                <button 
                  class="reason-cancel-btn"
                  @click.stop="expandedReasonIndex = null"
                >
                  取消
                </button>
              </div>
              <div class="reason-collapsed" v-show="expandedReasonIndex !== index">
                <span class="reason-icon">⚠️</span>
                <span class="reason-label">超过原因：</span>
                <span class="reason-text">{{ item.reason || '暂未填写' }}</span>
                <span class="reason-hint">点击查看详情</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 没有数据时显示提示 -->
        <div v-if="energyData.length === 0" class="no-data-container">
          <div class="no-data-content">
            <div class="no-data-icon">📊</div>
            <div class="no-data-text">暂无能耗数据</div>
            <div class="no-data-subtext">正在加载中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 填写原因弹窗 -->
  <el-dialog
    v-model="reasonDialogVisible"
    title="填写超过原因"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleReasonDialogClose"
    destroy-on-close
    append-to-body
    class="reason-dialog"
  >
    <div class="reason-dialog-content">
      <div class="dialog-header mb-6">
        <div class="header-icon">📝</div>
        <div class="header-text">
          <h3 class="header-title">填写能耗超过原因</h3>
          <p class="header-subtitle">请详细描述能耗超过标准的原因</p>
        </div>
      </div>
      
      <div class="form-content">
        <!-- 车间信息 -->
        <div class="workshop-info mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="info-row flex items-center justify-between mb-2">
            <span class="info-label text-blue-700 font-medium">车间名称：</span>
            <span class="info-value text-blue-900 font-semibold">{{ selectedWorkshop?.workshopName || '未知' }}</span>
          </div>
          <div class="info-row flex items-center justify-between">
            <span class="info-label text-blue-700 font-medium">超支/节省：</span>
            <span 
              class="info-value font-semibold"
              :class="Number(selectedWorkshop?.ratio) > 0 ? 'text-red-600' : 'text-green-600'"
            >
              {{ Number(selectedWorkshop?.ratio) > 0 ? '+' : '' }}{{ selectedWorkshop?.ratio }}
            </span>
          </div>
        </div>
        
        <!-- 原因输入 -->
        <div class="reason-input-section mb-6">
          <label class="input-label block text-gray-700 font-medium mb-3">超过原因说明 *</label>
          <el-input
            v-model="newReason"
            type="textarea"
            :rows="4"
            placeholder="请详细描述能耗超过标准的原因，例如：设备老化、生产负荷增加、维护不当等..."
            class="w-full"
            :maxlength="500"
            show-word-limit
          />
        </div>
        
        <!-- 提交状态 -->
        <div v-if="feedbackMessage" class="feedback-section mb-4">
          <div 
            class="feedback-message"
            :class="feedbackType === 'success' ? 'success' : 'error'"
          >
            {{ feedbackMessage }}
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeReasonDialog" :disabled="submittingReason">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="submitReason"
          :loading="submittingReason"
          :disabled="!newReason.trim()"
        >
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getRawMaterialMonitoringAdd } from '@/api/getnewInjection'
import type { EnergyData } from '@/types/energy'
import { MACHINE_CODES } from '@/types/energy'

interface Props {
  data: EnergyData[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

// 响应式变量
const reasonDialogVisible = ref(false)
const selectedWorkshop = ref<any>(null)
const newReason = ref('')
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')
const submittingReason = ref(false)
const expandedReasonIndex = ref<number | null>(null) // 记录展开的原因框索引

import { useEnergyStore } from '@/store/energy'

const energyStore = useEnergyStore()


// 计算属性
const energyData = computed(() => {
  console.log('🔍 Line3组件：接收到的原始数据:', props.data)
  
  // 如果没有数据，使用测试数据
  const testData: EnergyData[] = [
    {
      machCode: '无',
      machName: '无',
      workshopName: '无',
      monthDay: '无',
      number: '无',        // 标准接口：标准总电
      numberPower: 0,     // 实际接口：实际总电
      tipNumber: '0.0',
      peakNumber: '0.0',
      flatNumber: '0',
      valleyNumber: '0.0',
      cl: 0,                // 台数
      doneDay: 0,          // 日产量
      reason: '暂无原因'
    }
  ]
  
  const dataToProcess = props.data && props.data.length > 0 ? props.data : testData
  
  if (!dataToProcess || dataToProcess.length === 0) {
    console.log('⚠️ Line3组件：没有接收到数据')
    return []
  }
  
  
  const filteredData = dataToProcess.filter(item => {
    const isElectric = MACHINE_CODES.ELECTRIC.includes(item.machCode)
    const isGas = MACHINE_CODES.GAS.includes(item.machCode)
    const isWater = MACHINE_CODES.WATER.includes(item.machCode)
    
    console.log(`🔍 数据过滤 - ${item.machName}(${item.machCode}):`, {
      isElectric,
      isGas,
      isWater,
      willInclude: isElectric,
      machCodeInArray: MACHINE_CODES.ELECTRIC.includes(item.machCode)
    })
    
    return isElectric
  })
  

  
  const processedData = filteredData.map(item => {

    
    // 从monthlyStandardData中获取标准数据（包含标准用电量和台数）
    const standardItem = energyStore.monthlyStandardData.find(storeItem => storeItem.machCode === item.machCode)
    
    // 从monthlyData中获取实际数据
    const actualItem = energyStore.monthlyData.find(storeItem => storeItem.machCode === item.machCode)
    
    // 从dailyData中获取日实际数据
    const dailyItem = energyStore.dailyData.find(storeItem => storeItem.machCode === item.machCode)
    
    // 标准总电：优先使用标准接口的number，其次使用实际接口的number
    const standardTotal = ((Number(standardItem?.number || item.number) || 0)).toFixed(3)
    
    // 实际总电：优先使用实际接口的numberPower
    const actualTotal = ((actualItem?.numberPower || item.numberPower || 0)).toFixed(1)
    
    // 日实际总电：从日数据获取
    const actualDailyTotal = ((dailyItem?.numberPower || 0)).toFixed(2)
    
    // 台数：优先使用标准接口的cl，其次使用props的cl
    const standardMachineCount = standardItem?.cl || item.cl || 1

    // 实际台数：优先使用实际接口的cl，其次使用props的cl
    const actualMachineCount = actualItem?.cl || item.cl || 1
    
    // 日实际台数：优先使用日数据接口的cl，其次使用props的cl
    const actualDailyMachineCount = dailyItem?.cl || item.cl || 1
    

    
    // 标准每台 = 标准总电 ÷ 台数
    const standardPerUnit = standardMachineCount > 0 ? (Number(standardTotal) / standardMachineCount).toFixed(1) : '0.0'
    // 实际每台（月）= 实际总电 ÷ 台数
    const actualPerUnit = actualMachineCount > 0 ? (Number(actualTotal) / actualMachineCount).toFixed(2) : '0.0'
    // 实际每台（日）= 日实际总电 ÷ 台数
    const actualPerUnitDaily = actualDailyMachineCount > 0 ? (Number(actualDailyTotal) / actualDailyMachineCount).toFixed(2) : '0.00'
    
    // 调试信息：检查每日每台数据计算
    if (item.machCode === '616506210005' || item.machCode === '616506210009') {
      console.log(`🔍 调试每日每台数据 - ${item.machCode}:`, {
        dailyItem: dailyItem,
        actualDailyTotal: actualDailyTotal,
        actualDailyMachineCount: actualDailyMachineCount,
        actualPerUnitDaily: actualPerUnitDaily,
        calculation: `${actualDailyTotal} ÷ ${actualDailyMachineCount} = ${actualPerUnitDaily}`
      })
    }
    
    // 计算差异和比例
    const difference = Number(actualPerUnit) - Number(standardPerUnit)
    const ratio = difference.toFixed(1)
    
    // 从machName中提取车间名称：如果以"气表"结尾，则去掉"气表"
    const getWorkshopName = () => {
      if (!item.machName) {
        return item.machCode || '-'
      }
      // 如果machName以"气表"结尾，去掉"气表"
      if (item.machName.endsWith('气表')) {
        return item.machName.replace('气表', '').trim()
      }
      return item.machName
    }

    // 年度电量数据：从 monthlyStandardData 的 number 字段获取
    const yearlyElectric = standardItem?.number ? Number(standardItem.number).toFixed(1) : '0.0'

    const result = {
      ...item,
      standardTotal,        // 标准总电
      actualTotal,          // 实际总电（月）
      standardPerUnit,      // 标准每台
      actualPerUnit,        // 实际每台（月）
      actualPerUnitDaily,   // 实际每台（日）
      yearlyElectric,       // 年度电量数据
      ratio,
      workshopName: getWorkshopName()
    }
    

    return result
  })
  

  // 按照 MACHINE_CODES.ELECTRIC 中定义的顺序排序
  const sortedData = processedData.sort((a, b) => {
    const indexA = MACHINE_CODES.ELECTRIC.indexOf(a.machCode)
    const indexB = MACHINE_CODES.ELECTRIC.indexOf(b.machCode)
    
    // 如果两个都在数组中，按索引排序
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    
    // 如果只有一个在数组中，在数组中的排在前面
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // 都不在数组中，按原始顺序
    return 0
  })
  
  // 计算空压机月度分摊值
  // 空压机 machCode: '616506210001'
  const airCompressorCode = '616506210001'
  const airCompressor = sortedData.find(item => item.machCode === airCompressorCode)
  
  // 分摊比例配置
  const allocationRatios: Record<string, number> = {
    '616506210007': 0.2,  // 金工一部冲压: 20%
    '616506210003': 0.3,  // 金工一部焊接: 30%
    '616506210010': 0.3,  // 总装一课装配: 30%
    '616506210009': 0.2,  // 总装一课包装: 20%
  }
  
  // 获取空压机的月度实际用电
  let airCompressorMonthlyTotal = 0
  if (airCompressor) {
    const airCompressorActualItem = energyStore.monthlyData.find(storeItem => storeItem.machCode === airCompressorCode)
    airCompressorMonthlyTotal = Number(airCompressorActualItem?.numberPower || airCompressor.numberPower || 0)
  }
  
  // 为需要分摊的车间添加分摊值
  const finalData = sortedData.map(item => {
    // 如果是空压机，不添加分摊值
    if (item.machCode === airCompressorCode) {
      return {
        ...item,
        airCompressorAllocation: undefined
      }
    }
    
    // 如果是需要分摊的车间，计算分摊值
    const ratio = allocationRatios[item.machCode]
    if (ratio !== undefined) {
      const allocationValue = (airCompressorMonthlyTotal * ratio).toFixed(1)
      return {
        ...item,
        airCompressorAllocation: allocationValue
      }
    }
    
    // 其他车间不添加分摊值
    return {
      ...item,
      airCompressorAllocation: undefined
    }
  })
  
  return finalData
})

// 字体大小计算 - 优化版本
const getFontSize = () => {
  const width = window.innerWidth
  if (width >= 4000) return 20
  if (width >= 3000) return 18
  if (width >= 2500) return 16
  if (width >= 2000) return 14
  if (width >= 1500) return 12
  if (width >= 1200) return 10
  return 9
}

// 切换原因区域展开/收起
const toggleReasonSection = (index: number) => {
  if (expandedReasonIndex.value === index) {
    expandedReasonIndex.value = null
  } else {
    expandedReasonIndex.value = index
  }
}

// 打开填写原因弹窗
const openReasonDialog = (workshop: EnergyData) => {
  selectedWorkshop.value = workshop
  newReason.value = workshop.reason || ''
  feedbackMessage.value = ''
  feedbackType.value = 'success'
  reasonDialogVisible.value = true
}

// 关闭填写原因弹窗
const closeReasonDialog = () => {
  reasonDialogVisible.value = false
  selectedWorkshop.value = null
  newReason.value = ''
  feedbackMessage.value = ''
}

// 处理填写原因弹窗的关闭事件
const handleReasonDialogClose = (done: () => void) => {
  if (submittingReason.value) {
    return
  }
  
  if (newReason.value.trim() && newReason.value !== selectedWorkshop.value?.reason) {
    ElMessage.warning('有未保存的更改，请确认是否关闭')
  }
  
  closeReasonDialog()
  done()
}

// 提交原因
const submitReason = async () => {
  if (!selectedWorkshop.value || !newReason.value.trim()) return

  submittingReason.value = true
  try {
    // 调用API接口提交原因
    const res = await getRawMaterialMonitoringAdd(selectedWorkshop.value.workshopName, newReason.value)
    if (res.code === 200) {
      feedbackMessage.value = '提交成功！'
      feedbackType.value = 'success'
      
      // 更新本地数据
      if (selectedWorkshop.value) {
        selectedWorkshop.value.reason = newReason.value
      }
      
      // 延迟关闭弹窗
      setTimeout(() => {
        closeReasonDialog()
      }, 2000)
    } else {
      feedbackMessage.value = '提交失败，请稍后再试。'
      feedbackType.value = 'error'
    }
  } catch (error) {
    feedbackMessage.value = '提交失败，请稍后再试。'
    feedbackType.value = 'error'
    console.error('提交原因失败:', error)
  } finally {
    submittingReason.value = false
  }
}
</script>

<style scoped>
/* 数字显示样式 - 优化版本 */
.number-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  font-weight: 600;
  position: relative;
}

.number-value {
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.number-unit {
  font-weight: 500;
  opacity: 0.9;
  font-size: 0.85em;
}
.line3-container {
  height: 25vh;
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-bottom: 12px; */
}

.title {
  color: #00eeff;
  font-size: 16px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 12px;
  margin-top: 2px;
}



.energy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  height: 100%;
  padding: 0 12px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 238, 255, 0.3) transparent;
}

.energy-grid::-webkit-scrollbar {
  width: 6px;
}

.energy-grid::-webkit-scrollbar-track {
  background: transparent;
}

.energy-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 238, 255, 0.3);
  border-radius: 3px;
}

.energy-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 238, 255, 0.5);
}

.energy-card {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(0, 238, 255, 0.08), rgba(0, 238, 255, 0.12));
  border: 1px solid rgba(0, 238, 255, 0.4);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.energy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 238, 255, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.energy-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 238, 255, 0.25);
  border-color: rgba(0, 238, 255, 0.6);
}

.energy-card:hover::before {
  opacity: 1;
}

.energy-card.exceeded {
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.08), rgba(255, 0, 0, 0.12));
  border-color: rgba(255, 0, 0, 0.4);
}

.energy-card.exceeded::before {
  background: linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.6), transparent);
}

.energy-card.exceeded:hover {
  box-shadow: 0 8px 25px rgba(255, 0, 0, 0.25);
  border-color: rgba(255, 0, 0, 0.6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 12px; */
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.workshop-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.energy-icon {
  font-size: 18px;
  color: #00eeff;
  transition: all 0.3s ease;
  display: inline-block;
  margin-right: 8px;
}

.energy-icon:hover {
  color: #00ff88;
  transform: scale(1.1);
}

.workshop-name {
  color: #00eeff;
  /* font-size: 16px; */
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.ratio {
  color: #00ff00;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;
}

.ratio.exceeded {
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  border-color: rgba(255, 68, 68, 0.3);
}

.ratio.saved {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.3);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
}

.card-content .flex {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.data-icon {
  font-size: 14px;
  color: #00eeff;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: inline-block;
  margin-right: 6px;
}

.data-icon:hover {
  color: #00ff88;
  transform: scale(1.1);
}

.card-content .flex:hover {
  background: rgba(255, 255, 255, 0.05);
  padding-left: 4px;
}

.card-content .text-white {
  color: #ffffff;
  font-weight: 500;
  white-space: nowrap;
  /* font-size: 13px; */
  opacity: 0.9;
  transition: all 0.2s ease;
}

.reason-section {
  margin-top: 2px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.reason-section:hover {
  background: rgba(255, 170, 0, 0.05);
  border-radius: 4px;
}

.reason-info {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 4px 6px;
  background: rgba(255, 170, 0, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 170, 0, 0.2);
  gap: 6px;
}

.reason-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.reason-collapsed {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  background: rgba(255, 170, 0, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(255, 170, 0, 0.15);
  gap: 6px;
  transition: all 0.3s ease;
}

.reason-collapsed:hover {
  background: rgba(255, 170, 0, 0.1);
  border-color: rgba(255, 170, 0, 0.3);
}

.reason-hint {
  color: #ffaa00;
  font-size: 9px;
  opacity: 0.7;
  margin-left: auto;
  font-style: italic;
}

.reason-icon {
  font-size: 12px;
  color: #ffaa00;
  transition: all 0.3s ease;
  display: inline-block;
  margin-right: 4px;
}

.reason-icon:hover {
  color: #ff8800;
  transform: scale(1.1);
}

.reason-label {
  color: #fff;
  font-size: 10px;
  margin-right: 6px;
  font-weight: 500;
}

.reason-text {
  color: #ffaa00;
  font-size: 10px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.reason-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  color: white;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  gap: 4px;
}

.reason-cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 6px 10px;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
}

.reason-cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-icon {
  font-size: 12px;
  transition: all 0.3s ease;
  display: inline-block;
  margin-right: 4px;
}

.reason-btn:hover .btn-icon {
  transform: scale(1.1);
}

.reason-btn:hover {
  background: linear-gradient(135deg, #ff5252, #ff7676);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4);
}

.reason-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}


/* 弹窗样式 */
.reason-dialog :deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
}

.reason-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #2a2a2a, #333);
  border-bottom: 1px solid #444;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.reason-dialog :deep(.el-dialog__title) {
  color: #fbbf24;
  font-size: 20px;
  font-weight: 600;
}

.reason-dialog :deep(.el-dialog__close) {
  color: #999;
  font-size: 18px;
}

.reason-dialog :deep(.el-dialog__close):hover {
  color: #fbbf24;
}

.reason-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: #1a1a1a;
}

.reason-dialog :deep(.el-dialog__footer) {
  background: #1a1a1a;
  border-top: 1px solid #333;
  padding: 16px 24px;
  border-radius: 0 0 12px 12px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 24px;
  color: #fbbf24;
}

.header-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.header-subtitle {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.workshop-info {
  background: rgba(59, 130, 246, 0.1) !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
}

.info-label {
  color: #3b82f6 !important;
  font-weight: 500;
}

.info-value {
  color: #1e40af !important;
  font-weight: 600;
}

.input-label {
  color: #e5e7eb !important;
  font-weight: 500;
}

.feedback-section {
  margin-top: 16px;
}

.feedback-message {
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
}

.feedback-message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.feedback-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 空数据状态样式 */
.no-data-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 238, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
}

.no-data-content {
  text-align: center;
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.no-data-text {
  color: #00eeff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.no-data-subtext {
  color: #666;
  font-size: 12px;
}

:deep(.dv-digital-flop) {
  width: 80px;
  height: 20px;
}

/* 响应式调整数字翻牌器尺寸 */
@media (min-width: 1850px) {
  :deep(.dv-digital-flop) {
    width: 90px;
    height: 22px;
  }
}

@media (min-width: 2500px) {
  :deep(.dv-digital-flop) {
    width: 100px;
    height: 25px;
  }
}

@media (min-width: 3000px) {
  :deep(.dv-digital-flop) {
    width: 110px;
    height: 28px;
  }
}


.dashboard-title {
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 24px;
  color: #00eeff;
  transition: all 0.3s ease;
  display: inline-block;
  margin-right: 8px;
}

.title-icon:hover {
  color: #00ff88;
  transform: scale(1.1);
}

.dashboard-title h2 {
  color: #00eeff;
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0;
}

/* 响应式优化 */
@media (max-width: 1200px) {
  .energy-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
  
  .workshop-name {
    font-size: 1px;
  }
  
  .ratio {
    font-size: 10px;
    padding: 1px 4px;
  }
  
  .card-content .text-white {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .energy-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    padding: 0 8px;
  }
  
  .energy-card {
    padding: 8px;
  }
  
  .workshop-name {
    font-size: 1px;
  }
  
  .ratio {
    font-size: 9px;
  }
  
  .card-content .text-white {
    font-size: 10px;
  }
  
  .reason-btn {
    padding: 4px 8px;
    font-size: 9px;
  }
}

@media (min-width: 2000px) {
  .energy-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .energy-card {
    padding: 16px;
  }
  

  
  .ratio {
    font-size: 14px;
    padding: 3px 8px;
  }
  
  .card-content {
    gap: 8px;
  }
  
  .card-content .text-white {
    font-size: 17px;
  }
}
</style>