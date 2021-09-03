'use strict';
const fs = require('fs');             //fsというファイルを扱うモジュールを呼び出す
const readline = require('readline'); //readlineというファイルを１行づつ読み込むモジュールを呼び出す
const rs = fs.createReadStream('./popu-pref.csv');　//csvファイルをStream形式で読み込む
const rl = readline.createInterface({ input: rs, output: {} });　//読み込んだファイル1行づつをinputに設定するメソッド
const prefectureDataMap = new Map(); //Mapで新しい連想配列を作る
//rlで1行ずつ読み込まれるといlineイベントが発生したら、コンソールに出力するという無名関数を呼び出す処理
rl.on('line', lineString => {
  const columns = lineString.split(','); //カンマで分割して配列にする（文字列を対象とした関数）の
  const year = parseInt(columns[0]);　　　//pareseIntは文字列を整数値に変換する関数
  const prefecture = columns[1];
  const population = parseInt(columns[3]);
  if (year === 2010 || year == 2015) {
    let value = prefectureDataMap.get(prefecture);　//連想配列のkeyに都道府県を指定
    //その都道府県のデータ処理が初めてであれば（valueが存在しなければ）valueに初期値となるオブジェクトを代入し、2回目以降はそのオブジェクトに追加でデータが格納される
    if (!value) {
      value = {
        population2010: 0,
        population2015: 0,
        change: null　      //人口変化率
      };
    }
    if (year === 2010) {
      value.population2010 = population;
    }
    if (year === 2015) {
      value.population2015 = population;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
//closeイベントは全ての行を読み終わったら呼び出され、ここでは最終的に各都道府県をkeyとしてvalueには2010年と2015年のデータと人口変化率が、同じ配列に格納されて出力される
rl.on('close', () => {
  for (const [key, value] of prefectureDataMap) {　　　//for-of構文に[変数名,変数名]と書くことで、配列の中身を1つずつ変数に分割代入し、ループさせている
    value.change = value.population2015 / value.population2010; //代入されたvalueのchangeプロパティに、15年の人口を10年の人口で割った人口変化率を代入
  }
  //Array.from()で配列のようなもの(Map)から配列に変換し（全てのデータが大きな一つの配列となり、その中に都道府県をkeyとした小さな配列がたくさん入っている）、ループの一つ一つがsortメソッドの引数に入って、人口変化率が高いものが先にくるようにsortされて、その結果をrankingArrayに代入
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change　-　pair2[1].change;
  });
  //配列のkeyとvalueを受け取ってmap関数で見やすく書き換えて変数に代入
  const rankingStrings = rankingArray.map(([key, value], i) => {
    return (
      (i+1) +
      '位　' +
      key +
      ': ' +
      value.population2010 +
      ' => ' +
      value.population2015 +
      ' 変化率：' +
      value.change
    );
  });
console.log(rankingStrings);
});
