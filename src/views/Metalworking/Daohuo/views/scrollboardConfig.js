import { reactive } from 'vue'

const config = reactive({
  header: [
     '采购员', '采购单号', '供应商编号','供应商名称',  '品名', '规格', '数量', '发货日期','发货方式'],
  data: [],
  columnWidth: [],
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