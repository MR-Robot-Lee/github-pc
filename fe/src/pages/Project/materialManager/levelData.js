module.exports = [
  { name: '全部', id: 0, child: [{ name: '全部', id: 0 }] },
  {
    name: '采购计划', id: 1, child: [
    { name: '全部', id: 0 },
    { name: '已保存', id: 1 },
    { name: '审批中', id: 2 },
    { name: '待采购', id: 3 },
    { name: '未通过', id: 4 },
    { name: '待点收', id: 5 },
    { name: '待生成费用', id: 6 },
    { name: '已生成费用', id: 7 },
  ]
  },
  {
    name: '招标计划', id: 2, child: [
    { name: '全部', id: 0 },
    { name: '已保存', id: 1 },
    { name: '审批中', id: 2 },
    { name: '待招标', id: 3 },
    { name: '未通过', id: 4 },
    { name: '已发布', id: 5 },
  ]
  }
]