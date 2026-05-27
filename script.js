let currentCode = "";
let cart = [];

const products = {
  "A1B": { name: "Coke Zero",     price: 2.50 },
  "C2A": { name: "Pepsi",         price: 2.20 },
  "A4B": { name: "Sprite",        price: 2.00 },
  "A1C": { name: "Dr. Pepper",    price: 3.50 },
  "C1A": { name: "Fanta",         price: 2.20 },
  "C1C": { name: "Mountain Dew",  price: 2.20 },
  "C4A": { name: "A & W",         price: 3.99 },
  "A2A": { name: "Coke Original", price: 2.30 },
  "C6A": { name: "Mountain Dew",  price: 2.20 },
  "A5A": { name: "Canada Dry",    price: 4.32 },
};

const stock = {
  "A1B": 7,
  "C2A": 4,
  "A4B": 9,
  "A1C": 3,
  "C1A": 1,
  "C1C": 6,
  "C4A": 2,
  "A2A": 8,
  "C6A": 5,
  "A5A": 10,
};

const allBtns = ["btn1","btn2","btn3","btn4","btns5","btns6","btns7","btns8","btns9","btns10","btns11","btns12"];

function setButtons(disabled) {
  allBtns.forEach(id => {
    document.getElementById(id).disabled = disabled;
  });
}

function renderStock() {
  const panel = document.getElementById("stockPanel");
  if (!panel) return;
  panel.innerHTML = "";
  Object.entries(products).forEach(([code, item]) => {
    const qty = stock[code];
    const low = qty <= 2;
    const row = document.createElement("div");
    row.className = "stock-row";
    row.innerHTML = `
      <span class="stock-name">${item.name} <span class="stock-code">(${code})</span></span>
      <span class="stock-qty ${low ? 'stock-low' : ''}">${qty}</span>
    `;
    panel.appendChild(row);
  });
}

function addInput(value) {
  currentCode += value;
  document.getElementById("display").textContent = "Code: " + currentCode;
  document.getElementById("warning").textContent = "";
  playClickSound(true);
}

function submitCode() {
  if (currentCode === "") {
    document.getElementById("warning").textContent = "Please enter a code.";
    playClickSound(false);
    return;
  }

  const code = currentCode;
  const product = products[code];

  currentCode = "";
  document.getElementById("display").textContent = "Code: _";

  if (!product) {
    document.getElementById("warning").textContent = "Invalid code: " + code;
    playClickSound(false);
    return;
  }

  if (stock[code] <= 0) {
    document.getElementById("warning").textContent = product.name + " is out of stock.";
    playClickSound(false);
    return;
  }

  cart.push(code);
  document.getElementById("warning").textContent = "";
  document.getElementById("output").textContent = "";

  const cartNames = cart.map(c => products[c].name).join(", ");
  document.getElementById("selectedList").textContent = "Cart: " + cartNames;
  playClickSound(true);
}

function dispense() {
  if (cart.length === 0) {
    document.getElementById("warning").textContent = "Cart is empty.";
    playClickSound(false);
    return;
  }

  const total = cart.reduce((sum, code) => sum + products[code].price, 0);
  const itemList = cart.map(code => products[code].name).join(", ");

  document.getElementById("priceDisplay").textContent = "Items: " + itemList;
  document.getElementById("priceDisplay2").textContent = "Total: $" + total.toFixed(2);
  document.getElementById("paymentSection").style.display = "block";
  document.getElementById("amountInput").value = "";
  document.getElementById("warning").textContent = "";
  document.getElementById("display").textContent = "";
  document.getElementById("selectedList").textContent = "";

  setButtons(true);
  playClickSound(true);
}

function pay() {
  const total = cart.reduce((sum, code) => sum + products[code].price, 0);
  const entered = parseFloat(document.getElementById("amountInput").value);

  if (isNaN(entered) || entered <= 0) {
    document.getElementById("warning").textContent = "Please enter a valid amount.";
    return;
  }

  if (entered < total) {
    document.getElementById("warning").textContent =
      "Insufficient. Need at least $" + total.toFixed(2);
    return;
  }

  const change = (entered - total).toFixed(2);
  document.getElementById("warning").textContent = "";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("loadingSection").style.display = "block";

  playSound();

  setTimeout(() => {
    document.getElementById("loadingBar").style.width = "100%";
  }, 100);

  setTimeout(() => {
    cart.forEach(code => {
      if (stock[code] > 0) stock[code]--;
    });
    renderStock();

    const itemList = cart.map(code => products[code].name).join(", ");
    document.getElementById("loadingSection").style.display = "none";
    document.getElementById("loadingBar").style.width = "0%";
    document.getElementById("output").textContent = "Dispensed: " + itemList;
    document.getElementById("output2").textContent = change > 0 ? "Change: $" + change : "Change: $0.00";
    document.getElementById("btns13").style.display = "block";
  }, 2200);
}

function clearInput() {
  currentCode = "";
  cart = [];
  document.getElementById("display").textContent = "Code: _";
  document.getElementById("selectedList").textContent = "Cart: none";
  document.getElementById("output").textContent = "";
  document.getElementById("output2").textContent = "";
  document.getElementById("warning").textContent = "";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("loadingSection").style.display = "none";
  document.getElementById("loadingBar").style.width = "0%";
  document.getElementById("amountInput").value = "";
  document.getElementById("btns13").style.display = "none";
  document.getElementById("priceDisplay").textContent = "";
  document.getElementById("priceDisplay2").textContent = "";

  setButtons(false);
  playClickSound(true);
}

window.addEventListener("DOMContentLoaded", renderStock);

function playSound() {
  const audio = document.getElementById('myAudio');
  audio.play();
}

function playClickSound(valid) {
  if (valid) {
    const clickAudio = document.getElementById('myAudio2');
    clickAudio.currentTime = 0;
    clickAudio.play();
  }
}