// homepage.js
document.addEventListener('DOMContentLoaded', () => {
    const productCardsContainer = document.getElementById('productCardsContainer');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    const API_PRODUCTS_URL = 'http://127.0.0.1:8000/api/products/'; // Your Django API endpoint

    async function fetchAndDisplayProducts() {
        loadingMessage.style.display = 'block'; // Show loading message
        errorMessage.style.display = 'none';    // Hide any previous error
        productCardsContainer.innerHTML = '';   // Clear previous products

        try {
            const response = await fetch(API_PRODUCTS_URL);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); // Try to parse JSON, fall back to empty object
                throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
            }

            const products = await response.json();

            if (products.length === 0) {
                productCardsContainer.innerHTML = '<p style="text-align: center; color: #777; width: 100%;">No products available yet. Check back soon!</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');

                // Default image if none provided or invalid URL
                const imageUrl = product.image_url && product.image_url.startsWith('http') ? product.image_url : 'https://via.placeholder.com/240x180?text=No+Image';

                // Ensure price_inr is parsed as a float before toFixed
                const displayPrice = parseFloat(product.price_inr).toFixed(2);

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${product.item || 'Product Image'}">
                    <div class="product-card-info">
                        <h3>${product.item || 'N/A'}</h3>
                        <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
                        <p><strong>Qty:</strong> ${product.quantity_unit || 'N/A'}</p>
                        <p class="price">₹${displayPrice} <span>(${product.currency || 'INR'})</span></p>
                    </div>
                `;
                productCardsContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Error fetching products for homepage:', error);
            errorMessage.textContent = `Error loading products: ${error.message}. Please check the backend server and console.`;
            errorMessage.style.display = 'block';
            productCardsContainer.innerHTML = ''; // Clear cards on error
        } finally {
            loadingMessage.style.display = 'none'; // Hide loading message
        }
    }

    // Call the function when the page loads
    fetchAndDisplayProducts();
});