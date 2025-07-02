<template>
    <div class="content">
        <dv-border-box8 :dur="5">
      <ExceptionTable
        title="来料质量异常问题统计"
        dialog-title="来料质量异常问题统计详细"
        :loading="inStoreLoading"
        :config="config"
        export-file-name="入库异常处理数据"
        dialog-width="95%"
        @refresh="refreshData"
      />
    </dv-border-box8>
    </div>

</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, onBeforeUnmount, defineEmits } from 'vue'
import { getAbnormalQualityToday } from '@/api/getnewInjection'
import ExceptionTable from '@/components/SCM/ExceptionTable/index.vue'
import { eventBus } from '@/utils/eventbus'
// import StatusCell from '@/components/SCM/DetailDialog/StatusCell.vue'

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
// 原始 header
const fullHeader = [
  '采购内勤', '供应商','到货单号','品名', '品号','规格',
  '不合格数量','检验日期', '问题点', '判断结果' ,'处理时长','完成期限','处理结果',
]

// 轮播图 header（去掉"处理结果"）
const carouselHeader = fullHeader.filter(h => h !== '处理结果')

// 表格配置
const config = reactive({
  header: carouselHeader,
  data: [],
  rawData: [],
  detailData: [], // 添加用于详细信息显示的数据
  index: true,
  columnWidth: [50,100,100,120,90,120,130,100,100,100,100,100,100],
  dialogWidth: [70,100,150,150,180,130,350,100,100,100,100,100,130],
  align: [],
  rowNum: 5,
  headerHeight:25,
  carousel:'page',
  waitTime:6000,
  showTooltip:true,
  headerBGC: '#0d47a1',
  oddRowBGC: '#1565c0',
  evenRowBGC: '#1976d2',
  fullHeader: fullHeader,

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

const emit = defineEmits(['updateGuolvData'])

// 刷新数据
const refreshData = async () => {
  inStoreLoading.value = true
  try {
    const res = await getAbnormalQualityToday(queryDate)
    const rawData = res?.data || []

    // 分离显示数据和传递数据
    const displayData = rawData.map(item => {
      return [
        getStatusInfo(item.completeDate),
        item.purchaserName || '--',// 采购内勤
        (item.supplierName || '').trim(),// 供应商
        item.doc_no|| '--', // 客户单号
        item.item_description || '--',// 品名
        item.item_code || '--',// 品号
        item.item_specification || '--',// 规格型号
        getResultNumber(item), //不合格数量
        formatDate(item.startTime),// 检验日期
        item.description || '--',// 问题点
        getResultLabel(item),//判断结果
        item.hoursBetweenReturnAndAccept|| '--',// 处理时长
        item.completeDate || '--', // 完成期限
        item.reason || '--', // 处理结果
      ];
    })
    console.log(displayData)
    // 轮播图数据（去掉最后一项"处理结果"）
    const displayguolvData = displayData
  .filter(item =>
    (!item[12] || item[12] === '--') || // 处理结果为空
    (!item[13] || item[13] === '--') || // 完成期限为空
    item[0] === '逾期'                  // 状态为逾期
  )
  .map(item => item.slice(1, 13)) // 只取前12项，

    // 将source_id_roid作为额外属性存储
    const dataWithId = rawData.map((item) => ({
      ...item,
      source_id_roid: item.source_id_roid,
      po_arrival_inspection_d_id: item.po_arrival_inspection_d_id
    }))
    config.data = displayguolvData  // 轮播图显示无处理结果的数据
    config.detailData = displayData // 详细信息显示所有数据
    config.rawData = dataWithId
    
    emit('updateGuolvData', displayguolvData)
  } catch (error) {
    console.error('获取异常数据失败', error)
  } finally {
    inStoreLoading.value = false
  }
}

function getStatusInfo(completeDate) {
  if (!completeDate) {
    return '异常';
  }
  const today = new Date();
  const date = new Date(completeDate);

  if (isNaN(date.getTime())) {
    return '异常';
  }

  if (date.getTime() < today.setHours(0, 0, 0, 0)) {
    return '逾期';
  } else {
    return '正常';
  }
}

// 获取接口数据并处理
onMounted(() => {
  refreshData()
  eventBus.on('refreshData', refreshData)
})
onBeforeUnmount(() => {
  eventBus.off('refreshData', refreshData)
})

</script>

<style scoped>
/* 在style部分添加样式 */
</style>