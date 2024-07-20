let balance = 0;
let receiptContent = ''; // Global variable to store the current receipt content

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌜';
}

function showDebitCardFields() {
    document.getElementById('debit-card-fields').classList.remove('hidden');
    document.getElementById('visa-card-fields').classList.add('hidden');
}

function showVisaCardFields() {
    document.getElementById('visa-card-fields').classList.remove('hidden');
    document.getElementById('debit-card-fields').classList.add('hidden');
}

function updateBalance() {
    document.getElementById('balance').innerText = `₱${balance.toFixed(2)}`;
}

function addTransactionToHistory(type, amount) {
    const history = document.getElementById('transaction-history');
    const listItem = document.createElement('li');
    listItem.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} of ₱${amount.toFixed(2)}`;
    history.appendChild(listItem);
}

function showReceipt(message) {
    receiptContent = message; // Store the receipt content for download
    const receipt = document.getElementById('receipt');
    const receiptMessage = document.getElementById('receipt-message');
    receiptMessage.innerText = message;
    
    // Apply dark mode styles if body is in dark mode
    if (document.body.classList.contains('dark-mode')) {
        receipt.classList.add('dark-mode');
    } else {
        receipt.classList.remove('dark-mode');
    }

    receipt.classList.remove('hidden');

    setTimeout(() => {
        closeReceipt();
    }, 5000); // Automatically close after 5 seconds, adjust as needed
}

function closeReceipt() {
    document.getElementById('receipt').classList.add('hidden');
}

function downloadReceipt() {
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipt.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function performTransaction() {
    const amount = parseFloat(document.getElementById('amount').value);
    const transactionType = document.getElementById('transaction-type').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let message = '';
    if (transactionType === 'deposit') {
        balance += amount;
        addTransactionToHistory('deposit', amount);
        message = `Deposit successful! Amount: ₱${amount.toFixed(2)}`;
    } else if (transactionType === 'withdraw') {
        if (amount > balance) {
            alert("Insufficient balance.");
            return;
        }
        balance -= amount;
        addTransactionToHistory('withdraw', amount);
        message = `Withdrawal successful! Amount: ₱${amount.toFixed(2)}`;
    } else if (transactionType === 'debit' || transactionType === 'visa') {
        const cardNumber = document.getElementById(transactionType + '-card-number').value;
        const cardExpiry = document.getElementById(transactionType + '-card-expiry').value;
        const cardCvc = document.getElementById(transactionType + '-card-cvc').value;

        if (!cardNumber || !cardExpiry || !cardCvc) {
            alert("Please enter valid card details.");
            return;
        }
        // Simulate a card transaction
        addTransactionToHistory(transactionType, amount);
        message = `${transactionType.toUpperCase()} card transaction successful! Amount: ₱${amount.toFixed(2)}`;
    }
    
    updateBalance();
    document.getElementById('amount').value = '';
    showReceipt(message);
}
