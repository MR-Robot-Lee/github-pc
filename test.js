const transObj = function(tableData, keys) {
  let hashTable = {}, res = []
  for (let i=0; i < tableData.length; i++) {
    let arr = res, cur = hashTable
    for (let j = 0; j < keys.length; j++) {
      let key = keys[j], field = tableData[i][key]
      if (!cur[field]) {
        let pusher = {
          value: field
        }, tmp = []
        if (j !== (keys.length - 1)) {
          tmp = []
          pusher.children = tmp
        }
        cur[field] = {pos: arr.push(pusher) - 1}
        cur = cur[field]
        arr = tmp
      } else {
        cur = cur[field]
        arr = arr[cur.pos].children
      }
    }
  }
  return res
}

const data = [
  {
    province: '浙江',
    city: '杭州',
    name: '西湖'
  },
  {
    province: '浙江',
    city: '杭州',
    name: '西施'
  },
  {
    province: '西川',
    city: '成都',
    name: '方所',
  },
  {
    province: '浙江',
    city: '杭州',
    name: '西湖'
  }
]

p = console.log
const res = transObj(data, ['province', 'city', 'name'])

//console.dir(res)