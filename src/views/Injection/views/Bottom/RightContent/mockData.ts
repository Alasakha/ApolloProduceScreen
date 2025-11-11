// Mock数据文件 - 注塑产品质量监控

// 合格检验工单数、合格工单数、合格率统计数据
export const mockQualityStats = {
  qualifiedInspectionOrders: 125,
  qualifiedOrders: 118,
  qualifiedRate: 94.4
}

// 不合格工单明细数据
export const mockDefectiveData = [
  {
    ta002: 'WO20240101001',
    mb002: '注塑件A',
    mb003: '100x50x30mm',
    ta004: 500,
    nums: 15,
    ngReason: '尺寸超差',
    ngResponPeople: '张三'
  },
  {
    ta002: 'WO20240101002',
    mb002: '注塑件B',
    mb003: '80x40x20mm',
    ta004: 300,
    nums: 8,
    ngReason: '表面缺陷',
    ngResponPeople: '李四'
  },
  {
    ta002: 'WO20240101003',
    mb002: '注塑件C',
    mb003: '120x60x40mm',
    ta004: 800,
    nums: 25,
    ngReason: '颜色不均',
    ngResponPeople: '王五'
  },
  {
    ta002: 'WO20240101004',
    mb002: '注塑件D',
    mb003: '90x45x25mm',
    ta004: 400,
    nums: 12,
    ngReason: '缩水',
    ngResponPeople: '赵六'
  },
  {
    ta002: 'WO20240101005',
    mb002: '注塑件E',
    mb003: '110x55x35mm',
    ta004: 600,
    nums: 18,
    ngReason: '毛边',
    ngResponPeople: '孙七'
  }
]

