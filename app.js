'use strict';
const fs =require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl =readline.createInterface({ input: rs, output: {} });

//データを組み替えるためのmapデータ
const prefectureDataMap = new Map();

rl.on('line', lineString => {
    //▼ファイルを行単位で処理するコード

    //列別のデータに分割
    const colums = lineString.split(',');
    const year = parseInt(colums[0]); //年
    const prefecture = colums[1]; //都道府県
    const popu = parseInt(colums[3]); //人口
    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture,value);
    }
});
rl.on('close', () => {
    for (const [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], rank) => {
        return `${rank+1}位 ${key}:${value.popu10}=>${value.popu15} 変化率:${value.change} `
    });
    console.log(rankingStrings);
});
