document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productListTableBody = document.querySelector('#productListTable tbody');
    const productCardsContainer = document.getElementById('productCardsContainer');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyJsonButton = document.getElementById('copyJson');

    let products = []; // Array to store product objects

    // Function to render products in the admin table view
    function renderAdminTable() {
        productListTableBody.innerHTML = ''; // Clear existing rows
        if (products.length === 0) {
            productListTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: #777;">No products added yet.</td></tr>';
            return;
        }

        products.forEach(product => {
            const row = productListTableBody.insertRow();
            row.insertCell().textContent = product.id || 'N/A';
            row.insertCell().textContent = product.category;
            row.insertCell().textContent = product.item;
            row.insertCell().textContent = product.brand;
            row.insertCell().textContent = product.quantity_unit;
            row.insertCell().textContent = product.price_inr !== undefined && product.price_inr !== null ? parseFloat(product.price_inr).toFixed(2) : 'N/A';
            row.insertCell().textContent = product.currency;
            row.insertCell().textContent = product.image_url || 'N/A';
            row.insertCell().textContent = product.description || 'N/A';
            row.insertCell().textContent = product.notes || 'N/A';
            row.insertCell().textContent = product.stock_quantity !== undefined && product.stock_quantity !== null ? product.stock_quantity : 'N/A';
        });
    }

    // Function to render products in the e-commerce card view
    function renderProductCards() {
        productCardsContainer.innerHTML = ''; // Clear existing cards
        if (products.length === 0) {
            productCardsContainer.innerHTML = '<p style="text-align: center; color: #777; width: 100%;">No products available in the catalog.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            // Default image if none provided
            const imageUrl = product.image_url && product.image_url.startsWith('http') ? product.image_url : 'https://via.placeholder.com/240x180?text=No+Image';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${product.item || 'Product Image'}">
                <div class="product-card-info">
                    <h3>${product.item || 'N/A'}</h3>
                    <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
                    <p><strong>Qty:</strong> ${product.quantity_unit || 'N/A'}</p>
                    <p class="price">₹${product.price_inr !== undefined && product.price_inr !== null ? parseFloat(product.price_inr).toFixed(2) : '0.00'} <span>(${product.currency || 'INR'})</span></p>
                    </div>
            `;
            productCardsContainer.appendChild(card);
        });
    }

    // Combined rendering function
    function renderAllDisplays() {
        renderAdminTable();
        renderProductCards();
        updateJsonOutput(); // Keep for admin's JSON review
    }

    
    // Function to fetch products from the backend
    async function fetchProducts() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/'); // <--- This is the line to check
            if (!response.ok) {
                const errorText = await response.text(); // Get raw error response
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }
            products = await response.json();
            renderAllDisplays(); // Render both views after fetching
        } catch (error) {
            console.error('Error fetching products:', error);
            productListTableBody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: red;">Error loading products. Please check the backend server and console.</td></tr>';
            productCardsContainer.innerHTML = '<p style="text-align: center; color: red; width: 100%;">Could not load products. Please check the backend server.</p>';
        }
    }

    // Function to update the JSON output area
    function updateJsonOutput() {
        jsonOutput.textContent = JSON.stringify(products, null, 2);
    }

    // Handle form submission to send data to backend
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Client-side ID generation (for simplicity in this example)
        // In a real application, the backend should generate unique IDs (e.g., UUIDs)
        const newId = `prod_${Date.now()}`;

        const newProduct = {
            id: newId,
            category: document.getElementById('category').value,
            item: document.getElementById('itemName').value,
            brand: document.getElementById('brand').value,
            quantity_unit: document.getElementById('quantityUnit').value, // Corrected ID
            price_inr: parseFloat(document.getElementById('price').value || 0),
            currency: document.getElementById('currency').value,
            image_url: document.getElementById('imageUrl').value || undefined,
            description: document.getElementById('description').value || undefined,
            notes: document.getElementById('notes').value || undefined,
            stock_quantity: parseInt(document.getElementById('stockQuantity').value || 0)
        };

        // Basic client-side validation
        if (!newProduct.category) {
            alert('Please select a product category.');
            return;
        }
        if (!newProduct.item.trim()) {
            alert('Product item name is required.');
            return;
        }
        if (newProduct.price_inr <= 0) {
            alert('Price must be a positive number.');
            return;
        }
        if (!newProduct.image_url || !newProduct.image_url.startsWith('http')) {
            alert('A valid Image URL starting with http/https is required.');
            return;
        }
        if (newProduct.stock_quantity < 0) {
            alert('Stock quantity cannot be negative.');
            return;
        }


        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                alert('Product added successfully!');
                await fetchProducts(); // Re-fetch all products to update both displays
                productForm.reset();
                document.getElementById('currency').value = 'INR'; // Reset readonly field
                document.getElementById('category').value = ''; // Reset dropdown to default
            } else {
                const errorData = await response.json(); // Attempt to parse error message from backend
                console.error('Failed to add product:', errorData);
                alert('Failed to add product: ' + (errorData.message || 'Unknown error occurred.'));
            }
        } catch (error) {
            console.error('Error sending product data:', error);
            alert('An error occurred while adding the product. Please check your network and backend server. See console for details.');
        }
    });

    // Copy JSON to clipboard
    copyJsonButton.addEventListener('click', () => {
        const textToCopy = jsonOutput.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('JSON copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy JSON: ', err);
                alert('Failed to copy JSON. Your browser might not support direct clipboard access, please copy manually.');
            });
    });

    // Initial fetch of products when the page loads
    fetchProducts();
});