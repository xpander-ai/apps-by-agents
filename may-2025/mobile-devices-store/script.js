const products = [
  { id: 1, name: "iPhone 14", price: 799.00, image: "https://via.placeholder.com/200?text=iPhone+14" },
  { id: 2, name: "iPhone 14 Pro", price: 999.00, image: "https://via.placeholder.com/200?text=iPhone+14+Pro" },
  { id: 3, name: "Samsung Galaxy S23", price: 799.00, image: "https://via.placeholder.com/200?text=Galaxy+S23" },
  { id: 4, name: "Google Pixel 7", price: 599.00, image: "https://via.placeholder.com/200?text=Pixel+7" },
  { id: 5, name: "OnePlus 11", price: 699.00, image: "https://via.placeholder.com/200?text=OnePlus+11" }
];

const storeGrid = document.getElementById("store-grid");
const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartCount = document.getElementById("cart-count");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItemsList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      updateCartUI();
    });
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
    total += item.price;
  });
  cartTotal.textContent = total.toFixed(2);
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  updateCartUI();
}

function renderProducts() {
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button>Add to Cart</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(product));
    storeGrid.appendChild(card);
  });
}

cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("hidden");
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartUI();
});

renderProducts();
updateCartUI();