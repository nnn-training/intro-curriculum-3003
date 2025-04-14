'use strict';
const fs = require('node:fs'); //：モジュール呼び出し
const readline = require('node:readline'); //1行づつ読み込み
const rs = fs.createReadStream('./popu-pref.csv'); //Stream生成
const rl = readline.createInterface({ input: rs });
const prefectureDataMap = new Map(); //key: 都道府県 value: 集計データのオブジェクト


rl.on('line', lineString => {
    const columns = lineString.split(','); //lineStringの文字列を,で分割、配列になおす
    const year = parseInt(columns[0]);  //数値型に変換
    const prefecture = columns[1];
    const popu = parseInt(columns[3]); //配列の0,1,3を変数に保存
    if (year === 2016 || year === 2021) {
      let value =null ;
      if(prefectureDataMap.has(prefecture)){
        value = prefectureDataMap.get(prefecture); //Mapからキーがprefectureの値を取り出し、valueに代入
      }else{
        value ={
          before:0,
          after:0,
          change:null
        };
      }
      if(year===2016){ //連想配列へデータを保存
        value.before =popu;
      }
      if(year===2021){
        value.after =popu;
      }
      prefectureDataMap.set(prefecture,value);
    }
});
rl.on('close', () => { //イベントが終わったら呼び出し
  for (const [key,value]of prefectureDataMap){ //
    value.change=value.after / value.before;
  }
  //連想配列を普通に変換
  const rankingArray =Array.from(prefectureDataMap).sort((pair1,pair2)=>{
    return pair1[1].change-pair2[1].change;
  });
  //文字列に変換
  const rankingStrings = rankingArray.map(([key,value],i) =>{
    return `${i+1}位 ${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
});
