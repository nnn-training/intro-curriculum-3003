"use strict";
const fs = require("fs");
const readline = require("readline");
const rs = fs.createReadStream("./popu-pref.csv");
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on("line", (lineString) => {
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null,
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on("close", () => {
  for (const [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  // ソート(昇順)
  const rankingArray2 = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return (pair2[1].change - pair1[1].change) * -1;
  });
  const rankingStrings2 = rankingArray2.map(([k, v], i) => {
    // 出力(昇順))
    return `${i + 1}位:${k}: ${v.popu10} => ${v.popu15} 変化率:${v.change}`;
  });
  console.log(rankingStrings2);
});
