//formatting
const tPadding = 10;
const lPadding = 10;
const fontSize = 28;

//Defaults
let defaultNum = 1000;
let defaultInputBase = '2';
let defaultOutputBase = '10'
  
let numField; 
let basetypeField; 
let outtypeField;
let filteredInputText;
let convertedNum, labelText;

//Characters allowed by Base-type
let allowedChars = {
  2:['0','1'],
  8:['0','1','2','3','4','5','6','7'],
  10:['0','1','2','3','4','5','6','7','8','9'],
  12:['0','1','2','3','4','5','6','7','8','9','X','E','A','B'],
  16:['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'],
}
//Decimal value of corresponding characters
let charVals = {
  '12': {X:'10', E:'11', A:'10', B:'11'},
  '16': {A:'10', B:'11', C:'12', D:'13', E:'14', F:'15'}
}

//Remove any disallowed characters, punctuation, or spaces from the input string
function filterStr(inputStr, validChars, separator = ".") {
  let strArray = inputStr.split('');
  let filteredArray = strArray.filter((digit) => validChars.indexOf(digit) > -1);
  let outArray = filteredArray.join("");
  return String(outArray);
}

//Convert number to a decimal number
function convertNum_dec(num, base) {
  let power, charac, value, modNum;
  let newValue = 0;
  num = num.toString();
  for (let i = 0; i < num.length; i++) {
    charac = num.charAt(i);
    value = decodeLet(charac, base);
    power = num.length-1-i;
    modNum = base ** power * value;
    newValue += modNum;
  }
  return newValue;
}

function convertNum_base(num, base) {
  let power = Math.floor( Math.log(num) / Math.log(base) );
  let converted, encoded, colval;
  let output = new Array;
  let remain = num;
  for (i = power; i >=0; i--) {
    colval = base ** i;
    converted = Math.floor(remain / colval);
    remain -= colval * converted;
    encoded = encodeNum(converted, base);
    output.push(encoded);
  }
  return output.join("");
}
  
function decodeLet (letter, base) {
  if (charVals[base] === undefined) { 
    return letter; 
  } 
  let value = charVals[base][letter];
  return (value === undefined) ? letter : value
}

//Checks if number is represented by a Char value and returns it
function encodeNum (num, base) {
  let baseChars = charVals[base];
  if (baseChars === undefined) {
    return num;
  } else {
    let character = Object.keys(baseChars).find(key => baseChars[key] == num);
    return (character === undefined) ? num : character;
  }
}

function setup() {
  createCanvas(440, 400);
  
  //Input field for number to convert
  numField = createInput(String(defaultNum));
  numField.size(410);
  numField.style('font-size', `${fontSize}px`);
  numField.position(lPadding, tPadding);
  
  //Selector for the Radix/Base of Input Number
  basetypeField = createRadio('wrap1');
  basetypeField.position(lPadding, tPadding + fontSize + 20);
  //Set Options
  basetypeField.option('2', 'Binary');
  basetypeField.option('8', 'Octal');
  basetypeField.option('10', 'Decimal');
  basetypeField.option('12', 'Dozenal');
  basetypeField.option('16', 'Hexidecimal');
  //Select Default
  basetypeField.selected(defaultInputBase);
  
  //Selector for the radix/base of Output Number
  outtypeField = createRadio('wrap2');
  outtypeField.position(lPadding, tPadding + fontSize + 130);
  //Set Options
  outtypeField.option('2', 'Binary');
  outtypeField.option('8', 'Octal');
  outtypeField.option('10', 'Decimal');
  outtypeField.option('12', 'Dozenal');
  outtypeField.option('16', 'Hexidecimal');
  //Select Default
  outtypeField.selected(defaultOutputBase);
}

function draw() {
  background(220,240,255);
  inBase = basetypeField.value();
  outBase = outtypeField.value();
  filteredInputText = filterStr(numField.value(), allowedChars[inBase]);
  decNum = convertNum_dec(filteredInputText, inBase);
  
  //Convert number to Base, or nothing if output base is Decimal
  if (outtypeField.value() == '10') {
    convertedNum = decNum;
  } else {
    convertedNum = convertNum_base(decNum, outBase);
  }
  
  textSize(fontSize/2);
  labelElem = basetypeField.selected().labels[0].textContent; 
  text(`Filtered ${labelElem} Num`, lPadding, tPadding + fontSize + 75);
  textSize(fontSize);
  text(filteredInputText, lPadding, tPadding + fontSize + 100);
  
  textSize(fontSize/2);
  labelElem = outtypeField.selected().labels[0].textContent; 
  text(`${labelElem} Number`, lPadding, tPadding + fontSize + 175);
  textSize(fontSize);
  text(convertedNum, lPadding, tPadding + fontSize + 200);
    
}
