'use strict';
//node.jsのモジュール(まとまった機能部品のこと)呼び出し
const fs = require('fs');
const readline = require('readline');
//csvに対してstreamを設定
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input: rs, output: {} });
const prefectureDataMap = new Map();    // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    const columns = lineString.split(',');  //lineStringはlineイベントが発生したときに帰ってくる引数
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value ={
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', ()=>{
    for(const [key, value] of prefectureDataMap){
        value.change = value.popu15/value.popu10;
    }
    //Array.fromで連想配列を配列に変換。さらに、sortで並び変える（無名関数で並び替えのルールを指定。pair2がpair1より大きい場合はpair2がpair1より前にくる）
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return(
            (i + 1) +
            '位:' +
            key +
            ':' +
            value.popu10 +
            '=>' +
            value.popu15 +
            '変化率' +
            value.change
        );
    });
    console.log(rankingStrings);
});