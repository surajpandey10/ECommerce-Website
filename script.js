// Initialize an empty cart
let cart = [];

// Function to update the cart display
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const gpayButton = document.getElementById("gpay-button");

    // Clear the cart display
    cartItems.innerHTML = "";

    // Calculate total price and display cart items
    let totalPrice = 0;
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <p>${item.hindi} | ${item.name} - ₹${item.price}/${item.unit} x ${item.quantity} = ₹${item.price * item.quantity}</p>
            <button onclick="removeFromCart(${index})" style="background-color:red; color:white; padding:3px 8px; border:none; border-radius:5px; margin-left:10px;">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    // Update total price
    totalPriceEl.textContent = totalPrice;

    // Show/hide the payment button
    if (totalPrice > 0) {
        gpayButton.style.display = "block";
    } else {
        gpayButton.style.display = "none";
    }
}

// Function to add a product to the cart
function addToCart(index) {
    const productElement = document.querySelectorAll(".product")[index];
    const productName = productElement.getAttribute("data-name");
    const productPrice = parseFloat(productElement.getAttribute("data-price"));
    const productHindi = productElement.querySelector("h3").innerText.split("|")[0].trim(); // Extract Hindi name
    const productUnit = productElement.querySelector("h3").innerText.split("/")[1].trim(); // Extract unit

    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity++; // Increase quantity if product already exists
    } else {
        cart.push({ 
            name: productName, 
            hindi: productHindi, 
            price: productPrice, 
            unit: productUnit, 
            quantity: 1 
        }); // Add new product to cart
    }

    // Show the payment button for this product
    const paymentButton = productElement.querySelector(".payment-button");
    paymentButton.style.display = "block";

    updateCart(); // Refresh the cart display
}

// Function to remove a product from the cart
function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--; // Decrease quantity if more than 1
    } else {
        cart.splice(index, 1); // Remove item completely if only 1 left
    }
    updateCart(); // Refresh the cart display
}

// Function to handle Google Pay payment
function payWithGooglePay() {
    const totalPrice = document.getElementById("total-price").textContent;
    if (totalPrice === "0") {
        alert("Cart is empty! Please add items before paying.");
        return;
    }

    const upiId = "surajpandey9174-1@okhdfcbank"; // Replace with your UPI ID
    const merchantName = "Ankit Dairy"; // Replace with your business name
    const transactionNote = `Payment for Ankit Dairy (Order ID: ${Date.now()})`;

    // Construct the UPI payment link
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    // Try to open the UPI payment link
    window.location.href = upiUrl;

    // Fallback: Check if the UPI app opened successfully
    setTimeout(() => {
        if (!document.hidden) {
            // If the UPI app did not open, show a fallback message
            alert("No UPI app found. Please install a UPI app like Google Pay, PhonePe, or Paytm to proceed with the payment.");
        }
    }, 1000);
}

// Add event listener to the payment button
document.addEventListener("DOMContentLoaded", function () {
    const gpayButton = document.getElementById("gpay-button");
    gpayButton.addEventListener("click", payWithGooglePay);
});
document.addEventListener("DOMContentLoaded", function () {
    const paymentOptions = document.querySelectorAll(".payment-option");
    const addBankAccountSection = document.getElementById("add-bank-account");

    paymentOptions.forEach(option => {
        option.addEventListener("click", function () {
            addBankAccountSection.style.display = "block"; // Show the section
        });
    });
});
