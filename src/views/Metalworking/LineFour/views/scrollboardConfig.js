import { reactive } from 'vue'

const config = reactive({
  header: [
 '采购员', '仓管员', '检验员', '到货日期','客户单号', '供应商编号','供应商名称', '品号', '品名', '规格', '数量'],
  data: [],
  columnWidth: [100],
  index: true,
  align: [],
  rowNum: 6,
  headerHeight: 35,
  headerBGC: '#163a6680',
  oddRowBGC: '#2C7CAF',
  evenRowBGC: '#2A71AF',
  waitTime: 5000,
  carousel: 'page',
  showTooltip: true
})

export default config 