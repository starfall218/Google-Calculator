// This is for the responsiveness of the calculator by the use of event listeners to control what is to be displayed.
const oneTwoThreeBtn = document.querySelector('.one-two-three');
const fX = document.querySelector('.fx');
const rightSide = document.querySelector('.right');
const leftSide = document.querySelector('.left');

let leftSideIsActive = false;

function handleScreenResize() {
  if (window.matchMedia('(max-width: 800px)').matches) {
    if (leftSideIsActive) {
      leftSide.style.display = 'grid';
      rightSide.style.display = 'none';
    } else {
      rightSide.style.display = 'grid';
      leftSide.style.display = 'none';
    }
  } else {
    // Large screen: show both
    leftSide.style.display = 'grid';
    rightSide.style.display = 'grid';
  }
}

function openNewTab() {
  leftSideIsActive = true;
  handleScreenResize();
}

function closeNewTab() {
  leftSideIsActive = false;
  handleScreenResize();
}

fX.addEventListener('click', openNewTab);
oneTwoThreeBtn.addEventListener('click', closeNewTab);
window.addEventListener('resize', handleScreenResize);
handleScreenResize(); 



// To display the text
const numDisplay = document.querySelector('.output-content');
const allNumbers = document.querySelectorAll('[data-name="number"]');
const allOperators = document.querySelectorAll('[data-name="operator"]');

// For sin, log,etc.
const allFunc = document.querySelectorAll('[data-name="function"]');

// For pie and e
const allConstant = document.querySelectorAll('[data-name="constant"]');
const allEqual = document.querySelectorAll('[data-name="equals"]');
const clearBtn = document.querySelector('.clear');
console.log(allEqual);
const historyText = document.querySelector('.history-text');

// This is for tracking and saving previous full equations.
class theCalculator{
  constructor(currDisplay, previousDisplay) {
  this.currDisplay = currDisplay;
  this.previousDisplay = previousDisplay;
  this.clear();
  this.anglemethod = 'Deg';
  };
  chooseTheMode(){
    if(this.anglemethod === 'Deg'){
      this.anglemethod = 'Rad';
    } else{
      this.anglemethod = 'Deg';
    }
  };

  clear () {
    this.currVal = '';
    this.currDisplay.textContent = '';
    this.fullExpression = '';
  };

  addValues(val) {
  if (val === '.' && this.currVal.indexOf('.') !== -1) {
    return;
  }
  this.currVal = this.currVal + val.toString();
  this.fullExpression = this.fullExpression + val.toString();
  this.setToDisplay();
};

theOperation = function (oper) {
  if (oper === '') {
    return;
  }
  this.fullExpression = this.fullExpression + oper;
  this.oper = oper;
  this.currVal = '';
  this.setToDisplay();
};

setToDisplay = function () {
  this.currDisplay.textContent = this.currVal;
  this.previousDisplay.textContent = this.fullExpression;
  console.log(this.currVal);
};

 calculate = function () {
  let result;
  try {
    let expression = this.fullExpression
      .replace(/x/g, '*')
      .replace(/÷/g, '/')
      .replace(/%/g, '/100');

    let changedExpression = this.scienceFunc(expression);
    result = eval(changedExpression);
  } catch (e) {
    result = 'Error';
  }

  let dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  dropdown.textContent = this.fullExpression;
  this.previousDisplay.appendChild(dropdown);

  this.currVal = result.toString();
  this.fullExpression = '';
  this.setToDisplay();
};

 scienceFunc = function (expression) {
  let numbers = this;
  function toRadians(degree) {
    if(numbers.anglemethod === 'Deg'){
      return degree * (Math.PI / 180);
    } else{
      return parseFloat(degree)
    }
  }

  return expression
    .replace(/sin\(([^)]+)\)/g, function (match, p1) {
      return "Math.sin(" + toRadians(p1) + ")";
    })
    .replace(/cos\(([^)]+)\)/g, function (match, p1) {
      return "Math.cos(" + toRadians(p1) + ")";
    })
    .replace(/tan\(([^)]+)\)/g, function (match, p1) {
      return "Math.tan(" + toRadians(p1) + ")";
    })
    .replace(/log\(([^)]+)\)/g, function (match, p1) {
      return "Math.log10(" + p1 + ")";
    })
    .replace(/In\(([^)]+)\)/g, function (match, p1) {
      return "Math.log(" + p1 + ")";
    })
    .replace(/Inv\(([^)]+)\)/g, function (match, p1) {
      return "1/(" + p1 + ")";
    })
    .replace(/Exp\(([^)]+)\)/g, function (match, p1) {
      return "Math.exp(" + p1 + ")";
    })
    .replace(/√\(([^)]+)\)/g, function (match, p1) {
      return "Math.sqrt(" + p1 + ")";
    })
    .replace(/π/g, Math.PI)
    .replace(/e/g, Math.E);
};

applyFunction = function (funcName) {
  if (this.currVal === '') {
    return;
  }
  let wrappedFunction = funcName + '(' + this.currVal + ')';
  this.fullExpression = this.fullExpression + wrappedFunction;
  this.currVal = '';
  this.setToDisplay();
};

 applyConstant = function (constant) {
  let value;
  if (constant === 'π') {
    value = Math.PI.toString();
  } else if (constant === 'e') {
    value = Math.E.toString();
  } else {
    return;
  }

  this.currVal = this.currVal + value;
  this.fullExpression = this.fullExpression + value;
  this.setToDisplay();
};
}

// DOM Events ----------

let calculator = new theCalculator(numDisplay, historyText);

for (let i = 0; i < allNumbers.length; i++) {
  allNumbers[i].addEventListener('click', function () {
    calculator.addValues(this.textContent);
  });
}

for (let i = 0; i < allOperators.length; i++) {
  allOperators[i].addEventListener('click', function () {
    calculator.theOperation(this.textContent);
  });
}

for (let i = 0; i < allEqual.length; i++) {
  allEqual[i].addEventListener('click', function () {
    calculator.calculate();
  });
}

for (let i = 0; i < allFunc.length; i++) {
  allFunc[i].addEventListener('click', function () {
    calculator.applyFunction(this.textContent);
  });
}

for (let i = 0; i < allConstant.length; i++) {
  allConstant[i].addEventListener('click', function () {
    calculator.applyConstant(this.textContent);
  });
}
const modes = document.querySelectorAll('[data-name="mode"]');
modes.forEach(function(mod){
  mod.addEventListener('click',function(){
    calculator.chooseTheMode();
    this.textContent = calculator.anglemethod()
  })
});
document.addEventListener('keydown', function (event) {
  var key = event.key;

  if (!isNaN(key) || key === '.') {
    calculator.addValues(key);
  } else if (['+', '-', '*', '/', '%'].includes(key)) {
    calculator.theOperation(key);
  } else if (key === 'Enter' || key === '=') {
    calculator.calculate();
  } else if (key === 'Backspace') {
    calculator.currVal = calculator.currVal.slice(0, -1);
    calculator.fullExpression = calculator.fullExpression.slice(0, -1);
    calculator.setToDisplay();
  } else if (key === 'c' || key === 'C') {
    calculator.clear();
  }
});
clearBtn.addEventListener('click', function(){
  calculator.clear();
})