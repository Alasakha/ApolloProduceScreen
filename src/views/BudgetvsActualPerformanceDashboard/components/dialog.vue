<template>
  <el-dialog v-model="modelValue" title="填写" width="80%">
    <div v-for="group in ['quantity', 'income', 'profit']" :key="group">
      <h3>{{ groupMap[group] }}</h3>
      <table class="w-full border mb-6">
        <thead>
          <tr>
            <th>属性</th>
            <th v-for="month in months" :key="month">{{ month }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowFields" :key="row.field">
            <td>{{ row.label }}</td>
            <td v-for="month in months" :key="month">
              <el-input
                v-model="editTable[group][row.field][month]"
                size="small"
                @change="val => onEdit(group, row.field, month, val)"
              >
                <template #append>%</template>
              </el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-button type="primary" @click="onSave">保存</el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFinanceList, updateFinanceById } from '@/api/getIncomingInfo'
import { ElMessage } from 'element-plus'

const modelValue = defineModel()
const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12']
const groupMap = { quantity: '数量', income: '收入', profit: '利润' }
const rowFields = [
  { field: 'ysChallengeYear', label: '挑战值' },
  { field: 'ysReasonableYear', label: '合理值' },
  { field: 'ysValueMonth', label: '月度预测' }
]

const editTable = ref({
  quantity: {},
  income: {},
  profit: {}
})
const idTable = ref({}) // 记录每个单元格的id

const getFinanceListData = async () => {
  const res = await getFinanceList()
  // 初始化editTable和idTable
  for (const group of ['quantity', 'income', 'profit']) {
    editTable.value[group] = {}
    idTable.value[group] = {}
    for (const row of rowFields) {
      editTable.value[group][row.field] = {}
      idTable.value[group][row.field] = {}
      for (const month of months) {
        const item = res.data.find(d => d.group === group && d.monthDay === month)
        editTable.value[group][row.field][month] = item ? `${item[row.field]}%` : ''
        idTable.value[group][row.field][month] = item ? item.id : ''
      }
    }
  }
}
// 记录所有被编辑的内容
const editList = ref([])

// 编辑时触发
const onEdit = (group, field, month, value) => {
  const id = idTable.value[group][field][month]
  if (!id) return
  // 查找是否已存在
  let exist = editList.value.find(item => item.id === id)
  // 去除百分号并转换为数字
  const numValue = parseFloat(value.replace('%', ''))
  if (exist) {
    exist[field] = numValue
  } else {
    const obj = { id }
    obj[field] = numValue
    editList.value.push(obj)
  }
}

// 保存时
const onSave = async () => {
  for (const item of editList.value) {
    const res = await updateFinanceById(item)
    if (res.code === 200) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('保存失败')
    }
  }
  // 清空editList，刷新数据
  editList.value = []
  await getFinanceListData()
}

onMounted(() => {
  getFinanceListData()
})
</script>