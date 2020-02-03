//設置DOM元素
let board = document.querySelectorAll('.js-board p');
let calContent = document.querySelector('.js-calContent');
let calResult = document.querySelector('.js-calResult');

//設置計算機上下排的變數
let calResultStr = '';
let calContentStr = '';

//如果數字過多就把字體縮小
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

//轉換成千分位
function toThousands(number) {
    let num = number.toString();
    let result = '';
    if(num.indexOf('.') != -1){
        let numBeforeDot = num.slice(0,num.indexOf('.'));
        let numAfterDot = num.slice(num.indexOf('.'),num.length);
        while (numBeforeDot.length > 3) { //當num.length > 3時，就一直執行下面的內容
            result = ',' + numBeforeDot.slice(-3) + result;
            numBeforeDot = numBeforeDot.slice(0, numBeforeDot.length - 3);
        }
        result = numBeforeDot + result + numAfterDot;
    }else{
        while (num.length > 3) { //當num.length > 3時，就一直執行下面的內容
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3); 
        } 
        result = num + result; 
    }
    return result;
}

//計算機主要函式
let tap = function(){
    let buffer = this.textContent; //取計算機上的值
    switch(true){
        case buffer == 'AC': //如果值是AC就把上下排的值都清掉
            calContentStr = '';
            calResultStr = '';
            break;
        case buffer == '⌫'://如果值是⌫就把上排的值清掉，然後把下排的值退格一個字元
            calContentStr = '';
            calResultStr = calResultStr.toString();//因為calResultStr經過eval計算出來是'number'，而下方的substring運用必須為'string'
            calResultStr = calResultStr.substring(0,calResultStr.length-1);
            break;   
        case calContentStr.charAt(calContentStr.length-1) == '=': //判斷等號'='後面接什麼動作，會觸發什麼情況
            if(isNaN(parseInt(buffer)+1) == false){ //如果後面是數字，就直接把全部清空，重新開始另一個算式
                calContentStr = '';
                calResultStr = '';
                if(buffer == '00'){
                    calResultStr = '0';
                }else{
                    calResultStr += buffer;
                }
            }else if(buffer == "+" || buffer == '-' || buffer == '×' || buffer == '÷'){//如果是加減乘除，就把'='刪除，加上運算符號直接再做運算
                calContentStr = calContentStr.substring(0,calContentStr.length-1);
                calContentStr = calResultStr+buffer;
                calResultStr = '';
            }
            break;
        case buffer == '+': //如果值是加減乘除符號
        case buffer == '-': 
        case buffer == '×':
        case buffer == '÷':
            calContentStr += calResultStr; //按加減乘除後，才把結果欄的值丟到運算欄
            calResultStr = '0'; //然後把結果欄變零
            //如果上排calContentStr最後一個字元是'+-×÷'，而且輸入的值也是'+-×÷'，就用輸入的值取代最後一個字元
            if(isNaN(parseInt(calContentStr.charAt(calContentStr.length-1))+1) == true){ 
                calContentStr = calContentStr.substring(0,calContentStr.length-1);                                             
                calContentStr += buffer;
            }else{
                calContentStr = calContentStr + buffer;
            }
            break;
        case buffer == '='://如果值是'='
            calContentStr += calResultStr; //把下排的值丟到上排
            calContentStr += buffer; //讓運算列加入'='，方便之後判斷用
            let calResultContent = calContentStr.replace(/×/ig, "*"); //將this取到的x÷替換成可以運算的符號
            calResultContent = calResultContent.replace(/÷/ig, "/");
            calResultContent = calResultContent.substring(0,calResultContent.length-1); //進行eval計算前記得把'='拿掉
            calResultStr = parseFloat(eval(calResultContent).toFixed(10));//因為JS運算是依循IEEE754的規範，在運算時會轉換成2進制，而浮點數在轉成二進制時會造成無窮迴圈，進而產生運算誤差，JS有對此有.toFixed語法來處理浮點數問題
            break;
        case calResultStr == '' && buffer == '.': //如果在什麼都沒有的情況下輸入.,就會變成0.
            calResultStr = '0.';
            break;    
        case calResultStr.indexOf('.') != -1:
            if(buffer == '.'){ //如果數值內已經有點.了，那這個數值就不能再輸入.，輸入都會變成空值
                calResultStr += '';
            }else{
                calResultStr += buffer;
            }
            break;
        case calResultStr == '' && buffer == '00' || calResultStr == '0' && buffer == '00': //如果下排為空且輸入的數值是00或下排為0且輸入的數值是00，那下排只能出現0
            calResultStr = '0';
            break;
        case calResultStr.indexOf('0') == 0 && isNaN(parseInt(buffer)+1) == false://如果下排0在第一個位置且後面輸入的數值為數字，就用後面輸入的數字取代0
            calResultStr = buffer; 
            break;
        default:
            calResultStr += buffer;
    }
    
    //呼叫千分位函式
    let calResultStrToThousands = toThousands(calResultStr);

    //顯示結果
    calContent.textContent = calContentStr; //顯示上排數字
    calResult.textContent = calResultStrToThousands;//顯示下排數字

    //呼叫文字變小函數
    resultCheck();
    contentCheck();
}


//監聽機算機按鈕
for( let i = 0 ; i < 19 ; i++ ){
    board[i].addEventListener('click',tap,false);
}
