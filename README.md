# JS地下城 3F 計算機
## UI設計稿
在做這個作業前，可以先把計算機上的按鈕做分類，哪些按鈕按下是要幹嘛的，另外就是一些使用上的順序，方不方便，我是開啟windows的計算機看他是怎麼設計的。
## 一、分類
數字 : 0不能出現在小數點前重複出現，不然會出現，像000.1
```js
case calResultStr == '' && buffer == '00' || calResultStr == '0' && buffer == '00': 
//如果下排為空且輸入的數值是00或下排為0且輸入的數值是00，那下排只能出現0
calResultStr = '0';
break;
case calResultStr.indexOf('0') == 0 && isNaN(parseInt(buffer)+1) == false:
//如果下排0在第一個位置且後面輸入的數值為數字，就用後面輸入的數字取代0
calResultStr = buffer;
break;
```
### 2. 運算符號+ − ×÷ : 運算符號，不得重複，像:1×÷2=
isNaN(parseInt(calContentStr.charAt(calContentStr.length-1))+1)

使用charAt去找calContentStr字串的最後一個字元，將這個字元轉換成數字後再+1，判斷它是不是NaN。如果是NaN代表他不是數字不能做算數。
calContentStr.substring(0,calContentStr.length-1)

將calContentStr字串的最後一個字元刪除。
case buffer == '+': //在按下按鈕得到的值是+-x÷的情況下
case buffer == '-':
case buffer == '×':
case buffer == '÷':

```js
calContentStr += calResultStr; //按下加減乘除後，才把結果欄的值丟到運算欄
calResultStr = ''; //然後把結果欄清空

//如果上排calContentStr最後一個字元是'+-×÷'，而且輸入的值也是'+-×÷'，就用輸入的值取代最後一個字元
if(isNaN(parseInt(calContentStr.charAt(calContentStr.length-1))+1) == true){
//如果運算列的最後一個字元不是數字時
calContentStr = calContentStr.substring(0,calContentStr.length-1);
//將最後運算列的最後一個字元刪除
calContentStr += buffer;
//新增案件按下的運算符號
}else{
calContentStr = calContentStr + buffer;
}
break;//完成這個case後，跳出這個switch
```
### 3. 等號 = : eval 得到運算結果

```js
case buffer == '=': //如果按下按鈕得到的值是'='
calContentStr += calResultStr; //把下排的值丟到上排
calContentStr += buffer; //讓運算列加入'='，方便之後判斷用
let calResultContent = calContentStr.replace(/×/ig, "*"); //將this取到的x÷替換成可以運算的符號
calResultContent = calResultContent.replace(/÷/ig, "/");
calResultContent = calResultContent.substring(0,calResultContent.length-1); //進行eval計算前記得把'='拿掉
calResultStr = parseFloat(eval(calResultContent).toFixed(10));//因為JS運算是依循IEEE754的規範，在運算時會轉換成2進制，而浮點數在轉成二進制時會造成無窮迴圈，進而產生運算誤差，JS有對此有.toFixed語法來處理浮點數問題
break;//完成這個case後，跳出這個switch
4. ⌫ : 刪除單一字元
case buffer == '⌫'://如果值是⌫就把上排的值清掉，然後把下排的值退格一個字元
calContentStr = '';
calResultStr = calResultStr.toString();
//因為calResultStr經過eval計算出來是'number'，而下方的substring運用必須為'string'
calResultStr = calResultStr.substring(0,calResultStr.length-1);
break;
5. AC : 清除的功能
case buffer == 'AC': //如果值是AC就把上下排的值都清掉
calContentStr = '';
calResultStr = '';
break;
```
### 6. 點. : 點在一個數值中不能重複出現，不然0.22.33+33=這樣運算會出問題
```js
case calResultStr.indexOf('.') != -1: //如果calResultStr字串內有.
if(buffer == '.'){
calResultStr += '';
}else{
calResultStr += buffer;
}
break;
```
## 二、使用者體驗
在按下等號得到答案後，如何進行之後的運算?

按下數字時，清除全部，開始另一個新的運算。
按下加減乘除時，保留上排數值，繼續做運算。

```js
case calContentStr.charAt(calContentStr.length-1) == '=': //判斷等號'='後面接什麼動作，會觸發什麼情況
if(isNaN(parseInt(buffer)+1) == false){ //如果後面是數字，就直接把全部清空，重新開始另一個算式
calContentStr = '';
calResultStr = '';
calResultStr += buffer;
console.log('aaaa3');
}else if(buffer == "+" || buffer == '-' || buffer == '×' || buffer == '÷'){//如果是加減乘除，就把'='刪除，加上運算符號直接再做運算
calContentStr = calContentStr.substring(0,calContentStr.length-1);
calContentStr += buffer;
calResultStr = '';
}
break;
```

### 2. 數字超過計算機大小時，使文字變小
要注意計算字串長度時，因為計算機的答案是經過eval計算出來的，為'number'，因此要轉為字串我們才能統一計算字串長度大於多少時將字體大小轉換。
一開始我把calResultStr和calContentStr放在同一個switch裡面，但這樣會發生他只執行上面的calResultStr完後就跳出了，calContentStr在下面會執行不到。所以要把兩個內容分開判斷。

```js
let resultCheck = function(){
calResultStr = calResultStr.toString(); //因為eval計算出來是數值，而我們這邊是用字串做運算的
switch(true){
case calResultStr.length > 9 && calResultStr.length <= 27:
  calResult.setAttribute('style','font-size: 20px');
  break;
case calResultStr.length > 27:
  calResult.setAttribute('style','font-size: 12px');
  break;
case calResultStr.length <= 9:
  calResult.setAttribute('style','font-size: 56px');
  break;
}
}
let contentCheck = function(){
switch(true){
case calContentStr.length > 33:
  calContent.setAttribute('style','font-size: 10px');
  break;
case calContentStr.length <= 33:
  calContent.setAttribute('style','font-size: 16px');
  break;
  }
}
```

### 3. 標示出千分位，提升閱讀體驗
這個函式大量用到slice的語法來切分字串。
因為計算機會有小數點的問題，這邊設計小數點以下不標是千分位符號。
因此這個函式分為兩個判斷，一個是有小數點的，一個是沒有小數點的。

```js
function toThousands(number) {
let num = number.toString();
let result = '';
if(num.indexOf('.') != -1){  //如果這個字串有小數點
  //將這個字串分成小數點前的numBeforeDot和包含小數點後的numAfterDot
  let numBeforeDot = num.slice(0,num.indexOf('.')); 
  let numAfterDot = num.slice(num.indexOf('.'),num.length);
while (numBeforeDot.length > 3) { 
  //當num.length > 3時，就一直執行下面的內容，直到num.length <= 3
  result = ',' + numBeforeDot.slice(-3) + result;
  numBeforeDot = numBeforeDot.slice(0, numBeforeDot.length - 3);
}
  result = numBeforeDot + result + numAfterDot;
}else{ //其他的是沒有小數點的字串
  while (num.length > 3) { //當num.length > 3時，就一直執行下面的內容
  result = ',' + num.slice(-3) + result;
  num = num.slice(0, num.length - 3);
}
  result = num + result;
}
  return result;
}
```

## 三、這個關卡學到的技能整理
### 1.switch內case擺放的位置

這個關卡只使用到一個function，所有的運算都寫在裡面了，但function中為了不影響網站效率，使用switch，使用switch時，放置case的前後順序就很重要了，因為只要有一個case符合條件，跑完條件下的內容就會跳出了，如果有要先判斷的就要擺在前面。
### 2. 小數點運算時，浮點數的問題
因為JS運算是依循IEEE754的規範，在運算時會轉換成2進制，而浮點數在轉成二進制時會造成無窮迴圈，進而產生運算誤差，JS有對此有.toFixed語法來處理浮點數問題。
parseFloat(number.toFixed(10))
number.toFixed(10)這邊是把數值四捨五入取到小數點後第10位，然後用parseFloat把小數點後0多的值去掉。
還有另一個更精準的方法: number-precision
### 3. 字串與字串方法
#### length

取得字串長度
```js
var str = '123456';
console.log(str.length);
//result: 6
```

#### indexOf( searchElement, fromIndex)

由'前'往後搜尋字串
searchElement : 搜尋的字串
fromIndex : 搜尋範圍，預設為字串長度(str.length)-1，也就是全部範圍

```js
var demo = 'abc123abc';
console.log(demo.indexOf('abc'));
// 0
```
#### lastIndexOf( searchElement, fromIndex)

由'後'往前搜尋字串
searchElement : 搜尋的字串
fromIndex : 搜尋範圍，預設為字串長度(str.length)-1，也就是全部範圍

```js
var demo = 'abc123abc';
console.log(demo.lastIndexOf('abc'));
// result: 6
console.log(demo.lastIndexOf('abc',5));
// result: 0
console.log(demo.lastIndexOf('abc',7));
// result: 6
```

#### search(Str)

尋找字串， 無相符字串則傳回-1
Str : 尋找的字串
```js
var str="ABC and abc"
console.log(str.search("abc")); //大小必需相符
// result 8
console.log(str.search(/abc/i)); //忽略大小寫
// result 結果 0
console.log(str.search("123"));
// result -1
```

#### match(Str)

查找符合的字串，並回傳字串內容， 無相符字串則傳回null
Str : 尋找的字串

```js
var str="The rain in SPAIN stays mainly in the plain";
// 尋找符合的字串位置(/ain/)
console.log(str.match(/ain/));
 // result: ain
// 重覆尋找符合的字串位置(/***/g)
console.log(str.match(/ain/g));
 // result: ain,ain,ain
// 重覆尋找符合的字串位置(不分大小寫 /***/gi)
console.log(str.match(/ain/gi));
 // result: ain,AIN,ain,ain
console.log(str.match('123'));
 // result: -1
 ```
 
#### charAt(index)

傳回字串內的某個字元
```js
var str = '012345678';
console.log(str.charAt(2));
//2
```

#### fromCharCode()

傳回由UTF-16代表的字元
```js
console.log(String.fromCharCode(65,66,67));
//result: ABC
```

#### substring( indexStart, indexEnd)

indexStart: 開始位置
endStart: 結束位置，實際則取到結束位置的前一個字元
substr(index , strLength)

index: 開始位置
strLength: 取的字串長度
傳回字串中指定區間的字串
```js
var str = '0123456789';
console.log(str.substring(2,5));
// result: 234
console.log(str.substr(2,5));
// result: 23456
```

#### slice( start , end )

start : 從0開始的索引值
end : 結束值，實際取的是結束的前一個值
```js
var str = ['a', 'b', 'c', 'd', 'e'];
var str1 = str.slice(1);
var str2 = str.slice(1, 3);
var str3 = str.slice(-3);
// str  ['a', 'b', 'c', 'd', 'e'];
// str1 ['b', 'c', 'd', 'e'];
// str2 ['b', 'c']; 雖然end值3是指d，但實際上不包含d的值
// str3 ['c', 'd', 'e'];
```

#### replace(searchStr, replaceStr)

searchStr : 字串中要被取代掉的字串
replaceStr : 替換的字串

```js
var str = "hello world";
console.log(str.replace('hello','goodbye'));
//result: "goodbye world";
```

#### concat(stringA,stringB,…,stringX)

組合字串
```js
var strA = "test ";
var strB = "String";
console.log(strA.concat(strB));
// result: test String
```

#### split( )

將字串轉換為陣列
```js
var str = 'Hello sunny';
var strArray = str.split('');
console.log(strArray[0]);
//result: H
```

#### toUpperCase() 
#### toLowerCase()

變更字串大小寫
```js
var str = 'abCD';
console.log(str.toUpperCase());
//result: abcd
console.log(str.toLowerCase());
//result: ABCD
```

