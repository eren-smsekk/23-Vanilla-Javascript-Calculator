const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    // Eğer ikinci işlem bekleniyorsa, gelen rakamı direkt olarak ekrana yazarız
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    // İkinci işlem beklenmiyorsa, rakamı mevcut ekrana ekleriz
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  // Eğer ekranda nokta yoksa, noktayı ekleriz
  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    // Eğer zaten bir operatör seçilmişse ve ikinci işlem bekleniyorsa, sadece operatörü güncelleriz
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null) {
    // İlk operand henüz belirlenmemişse, gelen değeri ilk operanda olarak atarız
    calculator.firstOperand = inputValue;
  } else if (operator) {
    // İlk operand ve bir operatör varsa, hesaplama işlemini gerçekleştiririz
    const currentValue = firstOperand || 0;
    const result = performCalculation[operator](currentValue, inputValue);

    if (result === Infinity || result === -Infinity) {
      // Eğer sonuç Infinity veya -Infinity ise, ekrana "Tanımsız" mesajını yazdırırız
      calculator.displayValue = 'Tanımsız';
    } else {
      // Sonuç normal bir değer ise, ekrana yazdırırız ve ilk operanda olarak güncelleriz
      calculator.displayValue = String(result);
      calculator.firstOperand = result;
    }
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

const performCalculation = {
  '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
  '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
  '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
  '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
  '=': (firstOperand, secondOperand) => secondOperand,
};

function resetCalculator() {
  // Hesaplayıcıyı sıfırlar ve ekrana 0 yazar
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function updateDisplay() {
  // Ekrana hesaplayıcının görüntü değerini yazar
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    // Operatör tuşuna basıldığında, ilgili operatörü işler ve ekrana yazdırırız
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    // Ondalık nokta tuşuna basıldığında, noktayı işler ve ekrana yazdırırız
    inputDecimal(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('all-clear')) {
    // Tamamını temizle tuşuna basıldığında, hesaplayıcıyı sıfırlar ve ekrana yazdırırız
    resetCalculator();
    updateDisplay();
    return;
  }

  // Rakam tuşlarına basıldığında, ilgili rakamı işler ve ekrana yazdırırız
  inputDigit(target.value);
  updateDisplay();
});
