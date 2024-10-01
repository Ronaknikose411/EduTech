// asset.js
document.addEventListener("DOMContentLoaded", function () {
    window.assetPrices = { // Make assetPrices globally accessible
        "Reliance Industries": { price: 250, buyingPrice: 250, sellingPrice: 260 },
        "Tata Consultancy Services": { price: 300, buyingPrice: 300, sellingPrice: 310 },
        "HDFC Bank": { price: 100, buyingPrice: 100, sellingPrice: 105 },
        "Infosys": { price: 290, buyingPrice: 290, sellingPrice: 295 },
        "ICICI Bank": { price: 100, buyingPrice: 100, sellingPrice: 105 }
    };

    const assetTableBody = document.querySelector("#assetPriceTable tbody");

    function updateAssetPrices() {
        for (const asset in window.assetPrices) { // Access using window.assetPrices
            const maxChange = (window.assetPrices[asset].price * 0.05).toFixed(2);
            const change = (Math.random() * (maxChange * 2) - maxChange).toFixed(2);
            
            const newPrice = (parseFloat(window.assetPrices[asset].price) + parseFloat(change)).toFixed(2);
            window.assetPrices[asset].price = newPrice;

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
});
