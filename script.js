const display = document.querySelector(".calculator-screen");
const keys = document.querySelector(".calculator-keys");

let displayValue = "0"; // Hesap makinesinin ekrandaki değeri
let firstValue = null; // İlk değer
let operator = null; // İşlem operatörü
let waitingForSecondValue = false; // İkinci değerin beklenip beklenmediği

updateDisplay();

function updateDisplay() {
    display.value = displayValue; // Ekrana displayValue değerini yazar
}

keys.addEventListener('click', function(e) {
    const element = e.target;
    if(!element.matches('button')) return;

    if(element.classList.contains('operator')) {
        handleOperator(element.value); // İşlem operatörünü işler
        updateDisplay();
        return;
    }
    
    if(element.classList.contains('all-clear')) {
        clear(); // Tüm değerleri temizler
        updateDisplay();
        return;
    }

    if(element.classList.contains('decimal')) {
        inputDecimal(element.value); // Ondalık noktayı işler
        updateDisplay();
        return;
    }

    inputNumber(element.value); // Rakamı işler
})

function inputDecimal() {
    if(!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function clear() {
    displayValue = '0'; // displayValue değerini sıfırlar
}

function handleOperator(nextOperator) {
    const value = parseFloat(displayValue);

    if(operator && waitingForSecondValue) {
        operator = nextOperator; // İkinci değeri bekliyorsak sadece operatörü günceller
        return;
    }

    if(firstValue === 'null') {
        firstValue = value; // İlk değeri atar
    } else if(operator) {
        const result = calculate(firstValue, value, operator); // İşlemi gerçekleştirir
        displayValue = `${parseFloat(result.toFixed(7))}`; // Sonucu ekrana yazar
        firstValue = result; // İlk değeri günceller
    }

    waitingForSecondValue = true; // İkinci değeri beklemeye başlar
    operator = nextOperator; // Operatörü günceller
}

function calculate(first, second, operator) {
    if(operator === '+') {
        return first + second; // Toplama işlemi
    } else if(operator === '-') {
        return first - second; // Çıkarma işlemi
    } else if(operator === '*') {
        return first * second; // Çarpma işlemi
    } else if(operator === '/') {
        return first / second; // Bölme işlemi
    }

    return second; // Eğer operatör yoksa ikinci değeri döndürür
}

function inputNumber(num) {
    if(waitingForSecondValue) {
        displayValue = num; // İkinci değeri bekliyorsak direkt olarak rakamı ekrana yazar
        waitingForSecondValue = false;
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num; // İkinci değeri beklemiyorsak rakamı mevcut değere ekler
    }
    updateDisplay();
}
