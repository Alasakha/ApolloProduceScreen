<template>
    <dv-border-box8 :dur="5">
      <ExceptionTable
        title="当日来料质量异常问题统计"
        dialog-title="当日来料质量异常问题统计详细"
        :loading="inStoreLoading"
        :config="config"
        export-file-name="入库异常处理数据"
        dialog-width="95%"
        @refresh="refreshData"
      />
    </dv-border-box8>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { getAbnormalQualityToday } from '@/api/getnewInjection'
import ExceptionTable from '@/components/WMS/ExceptionTable/index.vue'

const inStoreLoading = ref(false)

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate());
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const queryDate = getYesterday(); // 昨天的日期
// 表格配置
const config = reactive({
  header: ['采购内勤', '供应商','到货单号','品名', '品号','不合格数量','检验日期', '问题点', '判断结果' ,'最终检验合格时间','处理时长','处理结果'],
  data: [],
  rawData: [],
  index: true,
  columnWidth: [50, 150, 150, 170, 150,150,150,150,150,150,150,150],  
  align: ['center','center','center','center','center','center','center','center','center'],
  rowNum: 5,
  headerHeight:25,
  carousel:'page',
  waitTime:6000,
  showTooltip:true,
  headerBGC: '#0d47a1',
  oddRowBGC: '#1565c0',
  evenRowBGC: '#1976d2',
})

function formatDate(dateStr?: string): string {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

const RESULT_MAP = [
  { key: 'accepted_business_qty', label: '允收' },
  { key: 'sp_receipt_business_qty', label: '特采' },
  { key: 'scrap_business_qty', label: '报废' },
  { key: 'return_business_qty', label: '拒收' }
];

// 判断是否是大于 0 且为整数
function isPositiveIntegerString(val: string): boolean {
  const num = parseFloat(val);
  return num > 0 && Number.isInteger(num);
}

// 获取标签
function getResultLabel(item: Record<string, string>): string {
  for (const { key, label } of RESULT_MAP) {
    if (isPositiveIntegerString(item[key])) return label;
  }
  return '--';
}

// 获取对应整数数值
function getResultNumber(item: Record<string, string>): number {
  for (const { key } of RESULT_MAP) {
    if (isPositiveIntegerString(item[key])) return Number(item[key]);
  }
  return 0;
}

// 刷新数据
const refreshData = async () => {
  inStoreLoading.value = true
  try {
    const res = await getAbnormalQualityToday(queryDate)
    const rawData = res?.data || []

    // 分离显示数据和传递数据
    const displayData = rawData.map(item => [
      item.purchaserName || '--',// 采购内勤
      (item.supplierName || '').trim(),// 供应商
      item.doc_no|| '--', // 客户单号
      item.item_description || '--',// 品名
      item.item_code || '--',// 品号
      getResultNumber(item), //不合格数量
      formatDate(item.startTime),// 检验日期
      item.description || '--',// 问题点
      getResultLabel(item),//判断结果
      item.acceptedDate ? item.acceptedDate.slice(0, 16) : '--',// 检验时间
      item.hoursBetweenReturnAndAccept|| '--',// 处理时长
      item.reason || '--' // 处理结果
    ])

    // 将source_id_roid作为额外属性存储
    const dataWithId = rawData.map((item) => ({
      ...item,
      source_id_roid: item.source_id_roid
    }))

    config.data = displayData
    // 将带ID的数据传递给组件
    config.rawData = dataWithId
  } catch (error) {
    console.error('获取异常数据失败', error)
  } finally {
    inStoreLoading.value = false
  }
}

// 获取接口数据并处理
onMounted(refreshData)

</script>