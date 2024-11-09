'use strict';
const fs = require('node:fs');
const { before, after } = require('node:test');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// ************ ↓オリジナル部分↓ *************** //

// コマンドライン引数を解析
const args = process.argv.slice(2); // 引数をargsという配列に格納
let isAscending = true; // 初期値を昇順とする
let targetPrefecture = null;

for (const arg of args) {
  if (arg === '昇順') {
    isAscending = true;
  } else if (arg === '降順') {
    isAscending = false;
  } else {
    targetPrefecture = arg; // 昇順でも降順でもない時、単語をargに格納
  }
}

function practice() {

// ************ ↑オリジナル部分↑ *************** //

rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
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
    value.change = 1 - value.after / value.before;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value], index) => {
    return `第${index + 1}位: ${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});

// ************ ↓オリジナル部分↓ *************** //

}

function myCode() {
  rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0], 10);
    const prefecture = columns[1];
    const popu = parseInt(columns[3], 10);
    if (year === 2016 || year === 2021) {
      const value = prefectureDataMap.get(prefecture) || { before: 0, after: 0, change: null };
      value[year === 2016 ? 'before' : 'after'] = parseInt(popu, 10);
      prefectureDataMap.set(prefecture, value);
    }
  });
  rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
      value.change = 1 - value.after / value.before;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], index) => {
      return `第${index + 1}位: ${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
    });
    console.log(rankingStrings);
  });
}

function main() {
  return args.length === 0 ? practice() : myCode();
}

main();


// ************ ↑オリジナル部分↑ *************** //