'use strict';
const fs = require('node:fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);//年(2016 or 2021)
  const prefecture = columns[1];//県
  const popu = parseInt(columns[3]);//人口
  if (year === 2016 || year === 2021) {
    let value = null;
    if (prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        before: 0,
        after: 0,
        change: null
      };
    }
    if (year === 2016) {
      value.before = popu;
    }
    if (year === 2021) {
      value.after = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for (const [key, value] of prefectureDataMap) {
    value.change = value.after / value.before;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return  pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value], i) => {
    //before = 2016   after = 2021
    return `${i + 1}位 ${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});