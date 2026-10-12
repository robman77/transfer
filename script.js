// Simulated bank transfer with a 2-second "network" delay.

let balance = 1000;

const form = document.getElementById("transfer-form");
const amountInput = document.getElementById("amount");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");
const balanceEl = document.getElementById("balance");
const statusEl = document.getElementById("status");

function formatMoney(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

async function transferFunds(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount > balance) {
        reject(
          new Error(
            `Insufficient funds: tried to transfer ${formatMoney(amount)}, balance is ${formatMoney(balance)}.`
          )
        );
        return;
      }
      balance -= amount;
      resolve(
        `Success: transferred ${formatMoney(amount)}. New balance: ${formatMoney(balance)}.`
      );
    }, 2000);
  });
}

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
  btnText.textContent = isLoading ? "Processing..." : "Transfer";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    showStatus("Enter an amount greater than zero.", "error");
    return;
  }

  statusEl.textContent = "";
  statusEl.className = "status";
  setLoading(true);

  try {
    const message = await transferFunds(amount);
    balanceEl.textContent = formatMoney(balance);
    showStatus(message, "success");
    form.reset();
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    setLoading(false);
  }
});