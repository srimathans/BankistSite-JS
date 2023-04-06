'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/////////////////////////////////////////////////

const createUserName = function (accountsArray) {
  accountsArray.forEach(function (accObject, i) {
    accObject.userName = accObject.owner.toLowerCase()
    .split(' ')
    .map(function (cur) {
      return cur.charAt(0)      
    })
    .join('');
  });

};
createUserName(accounts);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  
  const presentAccount = accounts.find(function (cur) {
    if (inputLoginUsername.value === cur.userName && Number(inputLoginPin.value) === cur.pin)       
    return cur;
  });
  
  
  labelWelcome.textContent = `Welcome back, ${presentAccount?.owner.split(' ')[0]}`;
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  containerApp.style.opacity = 100;
  let html;
  containerMovements.textContent = '';

  // display movements
  const displayMovements = function (preAcc) {
  preAcc.movements.forEach(function (cur, i) {  
  if (cur > 0)
  {  html = `<div class="movements__row">
             <div class="movements__type movements__type--deposit">${i+1} deposit</div>
             <div class="movements__value">${cur}€</div>
             </div>`
  }
  else 
  {  html = `<div class="movements__row">
             <div class="movements__type movements__type--withdrawal">${i+1} withdrawal</div>
             <div class="movements__value">${cur}€</div>
             </div>`
  }       
  containerMovements.insertAdjacentHTML('afterbegin', html);     
  });
  }
  displayMovements(presentAccount);

  // display balance
  const displayBalance = function (preAcc) {
  preAcc.currentBalance = preAcc.movements.reduce(function (balance, cur) {
    return balance + cur;
  }, 0);
  labelBalance.textContent = preAcc.currentBalance + '€';
}
displayBalance(presentAccount);

// summary
const displaySummary = function (preAcc) {
  const summary = function (arr, k) {
  let summa = arr.filter(function (cur) {
    if(k===0) return cur > 0;
    if(k===1) return cur < 0;
  })
  .reduce(function (sum, cur){
    return sum+cur;
  },0);
  return summa;
};
labelSumIn.textContent = summary(preAcc.movements, 0);
labelSumOut.textContent = summary(preAcc.movements, 1);
}
displaySummary(presentAccount);

// request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  
if(inputLoanAmount.value <= presentAccount.currentBalance * 10){
  presentAccount.movements.push(Number(inputLoanAmount.value));
  displayMovements(presentAccount);
  displaySummary(presentAccount);
  displayBalance(presentAccount);
}

inputLoanAmount.value = '';

});

// transfer amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  
  accounts.forEach(function (cur) {
    let transferTo = inputTransferTo.value;
    if(transferTo === cur.userName && transferTo !== presentAccount.userName && inputTransferAmount.value <= presentAccount.currentBalance) {
      presentAccount.movements.push(-(Number(inputTransferAmount.value)));
      const transferToObject = accounts.find(cur => cur.userName === transferTo);
      transferToObject.movements.push(Number(inputTransferAmount.value));
      displayMovements(presentAccount);
      displaySummary(presentAccount);
      displayBalance(presentAccount);     
    }

  });
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if(inputCloseUsername.value === presentAccount.userName && Number(inputClosePin.value) === presentAccount.pin) {
    const index = accounts.findIndex(cur => inputCloseUsername.value === cur.userName);
    accounts.splice(index, 1);
    labelWelcome.textContent = 'Login to get started';
    containerApp.style.opacity = 0;
  }  
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});
  

});

labelBalance.addEventListener('click', function (){
[...document.querySelectorAll('.movements__row')].forEach(function (row) {
  console.log(row);
});
});