const inputSlider = document.querySelector("[data-lengthSlider]");
const displayLength = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-paswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const geneButtn = document.querySelector(".generatebutton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={}[]|\,.:"><?';
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

// set passwolength
function handleSlider(){
    inputSlider.value = passwordLength;
    displayLength.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)* 100 / (max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    } else if(
             (hasLower || hasUpper)&&
             (hasNumber || hasSymbol) &&
             passwordLength >= 6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Copied";
    }
    catch(e){
        copymsg.innerText = "Failed";
    }
    // to make copy wala span visble
    copymsg.classList.add("active");

    setTimeout(() => {
        copymsg.classList.remove("active");
    },2000)
}

function shufflePassword(array){
  // Fisher yates Method
     for(let i = array.length-1; i > 0; i--){
         const j = Math.floor(Math.random() * (i+1));
         const temp = array[i];
         array[i] = array[j];
         array[j] = temp;
     }
     let str = "";
     array.forEach((el) => (str += el));
     return str;
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
          checkCount++;
    });
    // special case

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

inputSlider.addEventListener('input', (e) => {
     passwordLength = e.target.value;
     handleSlider();
})
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

geneButtn.addEventListener( 'click', () => {
   if(checkCount <=0) return;

   if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
   }
   console.log("Starting the Journey");
   // remove old password
     password = "";

    //  if(uppercaseCheck.checked){
    //     password += generateUppercase();
    //  }
    //  if(lowercaseCheck.checked){
    //     password += generateLowercase();
    //  }
    //  if(numbersCheck.checked){
    //     password += generateRandNumber();
    //  }
    //  if(numbersCheck.checked){
    //     password += generateSymbol();
    //  }

    let funcArr = [];
    if(uppercaseCheck.checked)
      funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
      funcArr.push(generateLowercase);
    if(numbersCheck.checked)
      funcArr.push(generateRandNumber);
    if(symbolsCheck.checked)
      funcArr.push(generateSymbol);
      // cumpolsuroy addition 
      for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
      }
      console.log("compulsory addition done");
      // remaining addition

      for(let i = 0; i < passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
      }
      console.log("remaining addition done");
      // shuffle the password
      password = shufflePassword(Array.from(password));
      console.log("shuffle done");
      // show in UI
      passwordDisplay.value = password;
      console.log("UI done");
      // calcStrength
         calStrength();
});