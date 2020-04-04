'use strict';
const fs = require('fs');　// オブジェクトfsはモジュールfsを用いてファイルシステムを扱う
const readline = require('readline'); // オブジェクトrealdlineはモジュールreqadlineを用いてファイルを1行ずつ読み込む
const rs = fs.createReadStream('./popu-pref.csv'); // オブジェクトrsで、popu-pref.csvのデータからストリームを生成する
const rl = readline.createInterface({ 'input':rs,'output': {} }); // オブジェクトrlは、オブジェクトrsで生成されたストリームをオブジェクトrealineにinputする
const prefectureDataMap = new Map(); // 連想配列ptefectureDataMap -> key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => { // オブジェクトrlでlineイベント時に以下の無名関数を呼び出す
    const columns = lineString.split(',');　// 引数linestringで与えられた文字列をカンマで分割し、配列columnsに格納
    const year = parseInt(columns[0]); // 変数yearに配列columnsの0番目の要素を整数値として格納する
    const prefecture = columns[1]; // 変数prefectureに配列columnsの1番目の要素を格納する
    const popu = parseInt(columns[3]); // 変数popuに配列columnsの3番目の要素を整数値として格納する
    if (year === 2010 || year === 2015) { // yearの値が2010又は2015である時
        let value = prefectureDataMap.get(prefecture); // 連想配列prefectureDataMapからkey(prefecture)のオブジェクトをvalueに格納
        if (!value) { // valueがfalsyな値の時
            value = {
                popu10: 0, // popu10プロパティに初期値0を格納
                popu15: 0, // popu15プロパティに初期値0を格納
                change: null // changeプロパティに初期値nullを格納
            };
        }
        if (year === 2010) {
            value.popu10 = popu; // yearの値が2010の時、オブジェクトvalueのプロパティpopu10にpopuの値を格納
        }
        if (year === 2015) {
            value.popu15 = popu; // yearの値が2015の時、オブジェクトvalueのプロパティpopu10にpopuの値を格納
        }
        prefectureDataMap.set(prefecture, value); // 取得したオブジェクトvalueを対応するkey(prefecture)の連想配列に格納
    }
});
rl.on('close', () => { // 全ての行を読み込み終わったら('close’イベント)
    for (let [key, value] of prefectureDataMap) { // 連想配列prefectureDataMapのkeyとvalueの組み合わせを、配列として保存
        value.change = value.popu15 / value.popu10; //オブジェクトvalueのプロパティchangeにプロパティpopu15/プロパティpopu10の値を格納
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => { // 連想配列prefectureDataMapを配列(pair配列)に変換し、sort関数で並び替える
        return pair2[1].change - pair1[1].change; // Pair2とPair1の1番目の要素(valueオブジェクト)のchangeプロパティを比較する
    });
    const rankingStrings = rankingArray.map(([key, value]) => { // map関数を用い、連想配列のkeyとオブジェクトvalueを合体させて文字列に変換
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率: ' + value.change;
    });
    console.log(rankingStrings); // 結果を出力する
});