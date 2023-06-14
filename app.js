'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs });

const prefDataMap = new Map();

rl.on('line', lineString => {
    
    const columns = lineString.split(",")
    const year = columns[0]
    const pref = columns[1]
    const pop = parseInt(columns[3])

    let popObj;

    if(year==2016 || year == 2021){

        if(prefDataMap.has(pref)){
            popObj = prefDataMap.get(pref)
        }
        else{
            popObj = {
                "2016年":0,
                "2021年":0,
                change:null
            }
        }
        
        const index = `${year}年`
        console.log(index)
        if(popObj[index] ===0){
            popObj[index] = pop
        }

        prefDataMap.set(pref,popObj)
    }
});

rl.on('close', () => {

    for(const [key,value] of prefDataMap){
        value.change = value["2021年"]/value["2016年"]
    }
    const rankingArray = Array.from(prefDataMap).sort((pair1,pair2)=>{
        return pair1[1].change - pair2[1].change
    })

    const rankingStrings = rankingArray.map(([key,value])=>{
        return `${key}：${value["2016年"]}=>${value["2021年"]}　変化率：${value.change}`
    })

    console.log(rankingStrings);
  });