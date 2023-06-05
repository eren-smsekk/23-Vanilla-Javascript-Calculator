const display = document.querySelector(".calculator-screen"); // HTML'de "calculator-screen" sınıfına sahip bir elementi seçer ve "display" adında bir değişkene atar
const keys = document.querySelector(".calculator-keys"); // HTML'de "calculator-keys" sınıfına sahip bir elementi seçer ve "keys" adında bir değişkene atar

let displayValue = "0"; // Hesap makinesinin görüntülenen değerini tutmak için "displayValue" adında bir değişken tanımlar ve başlangıçta "0" olarak ayarlar
let firstValue = null; // İlk değeri tutmak için "firstValue" adında bir değişken tanımlar ve başlangıçta "null" olarak ayarlar
let operator = null; // İşlem operatörünü tutmak için "operator" adında bir değişken tanımlar ve başlangıçta "null" olarak ayarlar
let waitingForSecondValue = false; // İkinci değeri bekleyip beklemediğimizi tutmak için "waitingForSecondValue" adında bir değişken tanımlar ve başlangıçta "false" olarak ayarlar

updateDisplay(); // Sayfa yüklendiğinde "updateDisplay" fonksiyonunu çağırarak görüntüyü günceller

function updateDisplay() {
    display.value = displayValue; // Hesap makinesinin görüntülenen değerini HTML elementinin değerine atar
}

keys.addEventListener('click', function(e) { // Tuşlara tıklandığında gerçekleşecek olayları dinler
    const element = e.target; // Tıklanan elementi seçer ve "element" adında bir değişkene atar
    if(!element.matches('button')) return; // Tıklanan element bir buton değilse, fonksiyondan çıkar

    if(element.classList.contains('operator')) { // Tıklanan element bir işlem operatörü butonuysa
        handleOperator(element.value); // "handleOperator" fonksiyonunu tıklanan operatörün değeriyle çağırarak işlemi yönetir
        updateDisplay(); // Görüntüyü günceller
        return;
    }
    
    if(element.classList.contains('all-clear')) { // Tıklanan element "all-clear" sınıfına sahip bir butonsa (Temizleme butonu)
        clear(); // Hesap makinesini temizlemek için "clear" fonksiyonunu çağırır
        updateDisplay(); // Görüntüyü günceller
        return;
    }

    if(element.classList.contains('decimal')) { // Tıklanan element "decimal" sınıfına sahip bir butonsa (Ondalık butonu)
        inputDecimal(element.value); // Ondalık değeri eklemek için "inputDecimal" fonksiyonunu çağırır
        updateDisplay(); // Görüntüyü günceller
        return;
    }

    inputNumber(element.value); // Tıklanan element bir sayı butonuysa, sayı değerini "inputNumber" fonksiyonuna gönderir
})

function inputDecimal() {
    if(!displayValue.includes('.')) { // Görüntülenen değerde "." karakteri bulunmuyorsa
        displayValue += '.'; // "." karakterini görüntülenen değere ekler
    }
}

function clear() {
    displayValue = '0'; // Görüntülenen değeri "0" olarak ayarlar
}

function handleOperator(nextOperator) {
    const value = parseFloat(displayValue); // Görüntülenen değeri ondalıklı sayıya dönüştürür ve "value" değişkenine atar

    if(operator && waitingForSecondValue) { // İşlem operatörü ve ikinci değeri bekliyorsak
        operator = nextOperator; // İşlem operatörünü günceller
        return;
    }

    if(firstValue === null) { // İlk değer henüz atanmamışsa
        firstValue = value; // İlk değeri atanmamış olan sayıya eşitler
    } else if(operator) { // İlk değer atanmışsa ve bir işlem operatörü varsa
        const result = calculate(firstValue, value, operator); // İlk değer, ikinci değer ve işlem operatörüyle birlikte "calculate" fonksiyonunu çağırarak hesaplama yapar
        if(result === Infinity || result === -Infinity || isNaN(result)) { // Hesaplama sonucu Infinity, -Infinity veya NaN (Tanımsız) ise kontrol eder
            displayValue = 'Tanımsız'; // Görüntülenen değeri "Tanımsız" olarak günceller
            firstValue = null; // İlk değeri sıfırlar
            waitingForSecondValue = false; // İkinci değeri beklememe durumunu sıfırlar
            operator = null; // İşlem operatörünü sıfırlar
            return;
        } else {
            displayValue = String(result); // Hesaplama sonucunu görüntülenen değere dönüştürür
            firstValue = result; // İlk değeri günceller
        }
    }

    waitingForSecondValue = true; // İkinci değeri beklemeye başlar
    operator = nextOperator; // İşlem operatörünü günceller
}

function calculate(first, second, operator) {
    if(operator === '+') { // İşlem operatörü toplama ise
        return first + second; // İki değeri toplar ve sonucu döndürür
    } else if(operator === '-') { // İşlem operatörü çıkarma ise
        return first - second; // İki değeri çıkarır ve sonucu döndürür
    } else if(operator === '*') { // İşlem operatörü çarpma ise
        return first * second; // İki değeri çarpar ve sonucu döndürür
    } else if(operator === '/') { // İşlem operatörü bölme ise
        return first / second; // İki değeri böler ve sonucu döndürür
    }

    return second; // İşlem operatörü belirtilmemişse, ikinci değeri döndürür
}

function inputNumber(num) {
    if(waitingForSecondValue) { // İkinci değeri bekliyorsak
        displayValue = num; // Görüntülenen değeri tıklanan sayıya ayarlar
        waitingForSecondValue = false; // İkinci değeri beklemeyi sonlandırır
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num; // Görüntülenen değeri tıklanan sayıya ekler veya mevcut değere eklenen sayıyı ekler
    }
    updateDisplay(); // Görüntüyü günceller
}
