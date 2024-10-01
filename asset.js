
        document.addEventListener("DOMContentLoaded", function () {
            // Asset Prices Initialization
            window.assetPrices = {
                "Reliance Industries": { price: 250, buyingPrice: 250, sellingPrice: 260 },
                "Tata Consultancy Services": { price: 300, buyingPrice: 300, sellingPrice: 310 },
                "HDFC Bank": { price: 100, buyingPrice: 100, sellingPrice: 105 },
                "Infosys": { price: 290, buyingPrice: 290, sellingPrice: 295 },
                "ICICI Bank": { price: 100, buyingPrice: 100, sellingPrice: 105 }
            };

            const assetTableBody = document.querySelector("#assetPriceTable tbody");

            function updateAssetPrices() {
                for (const asset in window.assetPrices) {
                    const maxChange = (window.assetPrices[asset].price * 0.05).toFixed(2);
                    const change = (Math.random() * (maxChange * 2) - maxChange).toFixed(2);
                    
                    const newPrice = (parseFloat(window.assetPrices[asset].price) + parseFloat(change)).toFixed(2);
                    window.assetPrices[asset].price = parseFloat(newPrice); // Ensure it's a number


                    // Update buying and selling prices based on the new asset price
                    window.assetPrices[asset].buyingPrice = newPrice; 
                    window.assetPrices[asset].sellingPrice = (parseFloat(newPrice) + 10).toFixed(2); 

                    const row = [...assetTableBody.rows].find(row => row.cells[0].textContent === asset);
                    if (row) {
                        row.cells[1].textContent = `$${window.assetPrices[asset].price}`;
                        row.cells[2].textContent = `${change}%`;
                        row.cells[3].textContent = `$${window.assetPrices[asset].buyingPrice}`;
                        row.cells[4].textContent = `$${window.assetPrices[asset].sellingPrice}`;
                    }
                }
            }

            updateAssetPrices(); // Call this function to populate initial prices
            setInterval(updateAssetPrices, 30000); // Refresh every 30 seconds

            // Transaction Logic
            const modal = document.getElementById("mainModal");
            const closeModal = document.getElementsByClassName("close")[0];
            const fundBtn = document.getElementById("fundBtn");
            const assetBtn = document.getElementById("assetBtn");
            const fundModal = document.getElementById("fundModal");
            const assetModal = document.getElementById("assetModal");
            const addFundsBtn = document.getElementById("addFundsBtn");
            const withdrawFundsBtn = document.getElementById("withdrawFundsBtn");
            const fundBalance = document.getElementById("balanceAmount");
            const assetSelect = document.getElementById("assetSelect");
            const assetQuantity = document.getElementById("assetQuantity");
            const buyAssetBtn = document.getElementById("buyAssetBtn");
            const sellAssetBtn = document.getElementById("sellAssetBtn");
            const notificationsDiv = document.getElementById("notifications");
            const transactionsBody = document.getElementById("transactionsBody"); 
            const investmentBody = document.getElementById("investmentBody"); // Reference to investment table body

            let balance = 0;
            let portfolio = {}; 

            let notifications = []; 

            // Show modals
            fundBtn.addEventListener("click", () => {
                modal.style.display = "block";
                fundModal.style.display = "block";
                assetModal.style.display = "none";
            });

            assetBtn.addEventListener("click", () => {
                modal.style.display = "block";
                assetModal.style.display = "block";
                fundModal.style.display = "none";
            });

            // Close modal
            closeModal.addEventListener("click", () => {
                modal.style.display = "none";
                fundModal.style.display = "none";
                assetModal.style.display = "none";
            });

            // Add funds
            addFundsBtn.addEventListener("click", () => {
                let amount = parseFloat(document.getElementById("fundAmount").value);
                if (!isNaN(amount) && amount > 0) {
                    balance += amount;
                    updateBalance();
                    addNotification(`Added $${amount.toFixed(2)} to your balance.`);
                    document.getElementById("fundAmount").value = ''; 
                } else {
                    alert("Please enter a valid amount.");
                }
            });

            // Withdraw funds
            withdrawFundsBtn.addEventListener("click", () => {
                let amount = parseFloat(document.getElementById("fundAmount").value);
                if (!isNaN(amount) && amount > 0 && amount <= balance) {
                    balance -= amount;
                    updateBalance();
                    addNotification(`Withdrew $${amount.toFixed(2)} from your balance.`);
                    document.getElementById("fundAmount").value = ''; 
                } else {
                    alert("Please enter a valid amount.");
                }
            });

            // Buy asset
            buyAssetBtn.addEventListener("click", () => {
                let asset = assetSelect.value;
                let quantity = parseInt(assetQuantity.value);

                if (asset && !isNaN(quantity) && quantity > 0) {
                    const price = window.assetPrices[asset].buyingPrice;
                    const totalCost = price * quantity;

                    if (totalCost <= balance) {
                        balance -= totalCost;
                        portfolio[asset] = (portfolio[asset] || 0) + quantity;
                        updateBalance();
                        updateTransactionsTable(asset, quantity, price, 'Buy', totalCost);
                        populateInvestmentTable(); 
                        addNotification(`Bought ${quantity} of ${asset} for $${totalCost.toFixed(2)}.`);
                        assetQuantity.value = ''; 
                        assetSelect.value = ''; 
                    } else {
                        alert("Insufficient balance to buy the asset.");
                    }
                } else {
                    alert("Please select an asset and enter a valid quantity.");
                }
            });

            // Sell asset
            sellAssetBtn.addEventListener("click", () => {
                let asset = assetSelect.value;
                let quantity = parseInt(assetQuantity.value);

                if (asset && !isNaN(quantity) && quantity > 0 && portfolio[asset] >= quantity) {
                    const price = window.assetPrices[asset].sellingPrice;
                    const totalRevenue = price * quantity;

                    balance += totalRevenue;
                    portfolio[asset] -= quantity;
                    if (portfolio[asset] === 0) {
                        delete portfolio[asset];
                    }
                    updateBalance();
                    updateTransactionsTable(asset, quantity, price, 'Sell', totalRevenue);
                    populateInvestmentTable(); 
                    addNotification(`Sold ${quantity} of ${asset} for $${totalRevenue.toFixed(2)}.`);
                    assetQuantity.value = ''; 
                    assetSelect.value = ''; 
                } else {
                    alert("You do not have enough assets to sell.");
                }
            });

            function updateBalance() {
                fundBalance.textContent = balance.toFixed(2);
            }

            function addNotification(message) {
                notifications.push(message);
                renderNotifications();
            }

            function renderNotifications() {
                notificationsDiv.innerHTML = '';
                notifications.forEach(notification => {
                    const div = document.createElement('div');
                    div.className = 'notification';
                    div.textContent = notification;
                    notificationsDiv.appendChild(div);
                });
            }

            function updateTransactionsTable(asset, quantity, price, action, total) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${asset}</td>
                    <td>${quantity}</td>
                    <td>$${price}</td>
                    <td>${action}</td>
                    <td>$${total.toFixed(2)}</td>
                `;
                transactionsBody.appendChild(row);
            }
            function populateInvestmentTable(newPrices) { 
                investmentBody.innerHTML = ''; 
                for (const investment in portfolio) {
                    if (!window.assetPrices[investment]) {
                        console.error(`Asset ${investment} not found in assetPrices.`);
                        continue; // Skip this iteration if the investment doesn't exist
                    }
            
                    const quantity = portfolio[investment]; // Quantity of the asset in the portfolio
                    const buyingPrice = parseFloat(window.assetPrices[investment].buyingPrice); // Original buying price
            
                    // Get the latest market price from the newPrices object
                    const currentPrice = parseFloat(newPrices[investment]?.price); // Use optional chaining to prevent errors
                    if (isNaN(currentPrice)) {
                        console.error(`Current price for ${investment} is not valid.`);
                        continue; // Skip this iteration if current price is invalid
                    }
            
                    // Calculate total value based on the original buying price
                    const totalValue = (quantity * buyingPrice).toFixed(2); // Total cost based on buying price
                    
                    // Calculate current value using the new price and quantity of the asset
                    const currentValue = (quantity * currentPrice).toFixed(2); // Current market value
            
                    // Calculate profit/loss based on the current value and total value
                    const profitLoss = (currentValue - totalValue).toFixed(2); // Profit/Loss calculation
            
                    // Create a new row for the investment table
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${investment}</td>
                        <td>${quantity}</td>
                        <td>$${buyingPrice.toFixed(2)}</td> 
                        <td>$${totalValue}</td>
                        <td>$${currentValue}</td>
                        <td>$${profitLoss}</td>
                    `;
                    investmentBody.appendChild(row); // Append the row to the investment table
                }
            }
            
            // Close modal when clicking outside of it
            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                    fundModal.style.display = "none";
                    assetModal.style.display = "none";
                }
            };
        });
   