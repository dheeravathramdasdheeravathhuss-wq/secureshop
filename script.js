
"use strict";

const STORAGE = {
  products: "secureshop_products_v1",
  users: "secureshop_users_v1",
  session: "secureshop_session_v1",
  cart: "secureshop_cart_v1",
  orders: "secureshop_orders_v1"
};

const defaultProducts = [
  {
    id: "p1",
    name: "Wireless Headphones",
    price: 1999,
    category: "Electronics",
    emoji: "🎧",
    description: "Comfortable headphones for everyday listening."
  },
  {
    id: "p2",
    name: "Smart Watch",
    price: 2499,
    category: "Electronics",
    emoji: "⌚",
    description: "A stylish watch for your daily activities."
  },
  {
    id: "p3",
    name: "Running Shoes",
    price: 1799,
    category: "Fashion",
    emoji: "👟",
    description: "Lightweight shoes for walking and running."
  },
  {
    id: "p4",
    name: "Travel Backpack",
    price: 1299,
    category: "Accessories",
    emoji: "🎒",
    description: "A practical backpack for travel and college."
  },
  {
    id: "p5",
    name: "Desk Lamp",
    price: 799,
    category: "Home",
    emoji: "💡",
    description: "A simple lamp for your study desk."
  },
  {
    id: "p6",
    name: "Coffee Mug",
    price: 299,
    category: "Home",
    emoji: "☕",
    description: "A reusable mug for your favourite drink."
  },
  {
    id: "p7",
    name: "Sunglasses",
    price: 599,
    category: "Accessories",
    emoji: "🕶️",
    description: "Everyday sunglasses with a modern style."
  },
  {
    id: "p8",
    name: "Cotton T-Shirt",
    price: 499,
    category: "Fashion",
    emoji: "👕",
    description: "A comfortable shirt for everyday use."
  }
];

const $ = (selector) => document.querySelector(selector);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function makeId(prefix) {
  return prefix + "-" + Date.now().toString(36) +
    "-" + Math.random().toString(36).slice(2, 8);
}

function seedData() {
  if (!localStorage.getItem(STORAGE.products)) {
    writeJSON(STORAGE.products, defaultProducts);
  }

  if (!localStorage.getItem(STORAGE.users)) {
    writeJSON(STORAGE.users, [
      {
        id: "demo-admin",
        name: "Demo Admin",
        email: "admin@secureshop.demo",
        password: "AdminDemo123!",
        role: "admin"
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE.cart)) {
    writeJSON(STORAGE.cart, []);
  }

  if (!localStorage.getItem(STORAGE.orders)) {
    writeJSON(STORAGE.orders, []);
  }
}

function getProducts() {
  return readJSON(STORAGE.products, defaultProducts);
}

function getUsers() {
  return readJSON(STORAGE.users, []);
}

function getCart() {
  return readJSON(STORAGE.cart, []);
}

function getOrders() {
  return readJSON(STORAGE.orders, []);
}

function currentUser() {
  const session = readJSON(STORAGE.session, null);

  if (!session || !session.userId) {
    return null;
  }

  return getUsers().find((user) => user.id === session.userId) || null;
}

function isAdmin() {
  const user = currentUser();
  return Boolean(user && user.role === "admin");
}

function showPage(pageName) {
  const allowedPages = [
    "home", "products", "cart", "orders", "profile", "admin"
  ];

  if (!allowedPages.includes(pageName)) {
    pageName = "home";
  }

  if (pageName === "admin" && !isAdmin()) {
    pageName = "home";
    alert("Please log in using the demo admin account to view this demo page.");
  }

  document.querySelectorAll(".page").forEach((page) => {
    page.hidden = page.id !== pageName + "Page";
  });

  if (pageName === "products") renderProducts();
  if (pageName === "cart") renderCart();
  if (pageName === "orders") renderOrders();
  if (pageName === "profile") renderProfile();
  if (pageName === "admin") renderAdmin();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-image" aria-hidden="true">
        ${escapeHTML(product.emoji || "📦")}
      </div>
      <p class="eyebrow">${escapeHTML(product.category)}</p>
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.description || "")}</p>
      <div class="price">${money(Number(product.price) || 0)}</div>
      <button class="primary" data-add-cart="${escapeHTML(product.id)}">
        Add to cart
      </button>
    </article>
  `;
}

function renderProducts() {
  const query = ($("#searchInput").value || "").trim().toLowerCase();
  const category = $("#categoryFilter").value;

  const filtered = getProducts().filter((product) => {
    const matchesQuery = [
      product.name,
      product.description,
      product.category
    ].join(" ").toLowerCase().includes(query);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesQuery && matchesCategory;
  });

  $("#productsGrid").innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : '<div class="empty">No matching products found.</div>';

  $("#productMessage").textContent =
    `${filtered.length} product(s) found.`;
}

function renderFeatured() {
  $("#featuredProducts").innerHTML =
    getProducts().slice(0, 4).map(productCard).join("");
}

function updateCartCount() {
  const count = getCart().reduce(
    (total, item) => total + item.quantity, 0
  );
  $("#cartCount").textContent = count;
}

function addToCart(productId) {
  const product = getProducts().find((item) => item.id === productId);

  if (!product) {
    alert("This product is no longer available.");
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, 99);
  } else {
    cart.push({ productId, quantity: 1 });
  }

  writeJSON(STORAGE.cart, cart);
  updateCartCount();
}

function cartDetails() {
  const products = getProducts();

  return getCart().map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) return null;

    const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1));

    return {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      subtotal: Number(product.price) * quantity
    };
  }).filter(Boolean);
}

function renderCart() {
  const items = cartDetails();

  if (!items.length) {
    $("#cartItems").innerHTML =
      '<div class="empty">Your cart is empty. Browse products to get started.</div>';
    $("#cartTotal").textContent = money(0);
    $("#checkoutButton").disabled = true;
    return;
  }

  $("#cartItems").innerHTML = items.map((item) => `
    <div class="cart-row">
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <p>${money(item.price)} each</p>
      </div>
      <label>
        Quantity
        <input type="number" min="1" max="99"
          value="${item.quantity}"
          data-quantity="${escapeHTML(item.productId)}">
      </label>
      <strong>${money(item.subtotal)}</strong>
      <button data-remove-cart="${escapeHTML(item.productId)}">Remove</button>
    </div>
  `).join("");

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  $("#cartTotal").textContent = money(total);
  $("#checkoutButton").disabled = false;
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((entry) => entry.productId === productId);

  if (!item) return;

  const parsed = Number(quantity);

  if (!Number.isInteger(parsed) || parsed < 1) {
    item.quantity = 1;
  } else {
    item.quantity = Math.min(parsed, 99);
  }

  writeJSON(STORAGE.cart, cart);
  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  const updated = getCart().filter(
    (item) => item.productId !== productId
  );

  writeJSON(STORAGE.cart, updated);
  updateCartCount();
  renderCart();
}

function checkout() {
  const user = currentUser();

  if (!user) {
    alert("Please log in before placing a demo order.");
    openAuth("login");
    return;
  }

  const items = cartDetails();

  if (!items.length) {
    alert("Your cart is empty.");
    return;
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const order = {
    id: makeId("ORDER"),
    userId: user.id,
    createdAt: new Date().toISOString(),
    status: "Demo order placed",
    items,
    total
  };

  const orders = getOrders();
  orders.unshift(order);
  writeJSON(STORAGE.orders, orders);
  writeJSON(STORAGE.cart, []);

  updateCartCount();
  renderCart();

  alert("Demo order placed successfully. No real payment was taken.");
  showPage("orders");
}

function renderOrders() {
  const user = currentUser();

  if (!user) {
    $("#ordersList").innerHTML =
      '<div class="empty">Please log in to view your demo orders.</div>';
    return;
  }

  const orders = getOrders().filter((order) => order.userId === user.id);

  if (!orders.length) {
    $("#ordersList").innerHTML =
      '<div class="empty">You have not placed any orders yet.</div>';
    return;
  }

  $("#ordersList").innerHTML = orders.map((order) => `
    <article class="order-card">
      <h3>${escapeHTML(order.id)}</h3>
      <p>${escapeHTML(new Date(order.createdAt).toLocaleString())}</p>
      <p><span class="status">${escapeHTML(order.status)}</span></p>
      <ul>
        ${order.items.map((item) => `
          <li>${escapeHTML(item.name)} × ${item.quantity}
          — ${money(item.subtotal)}</li>
        `).join("")}
      </ul>
      <strong>Total: ${money(order.total)}</strong>
    </article>
  `).join("");
}

function renderProfile() {
  const user = currentUser();

  $("#profileName").textContent = user ? user.name : "Guest";
  $("#profileEmail").textContent = user ? user.email : "Not logged in";
  $("#profileAuthButton").textContent = user ? "Account is active" : "Login or register";
  $("#profileAuthButton").disabled = Boolean(user);
}

function renderAdmin() {
  if (!isAdmin()) return;

  $("#adminProducts").innerHTML = `
    <h2>Current products</h2>
    <div class="panel">
      ${getProducts().map((product) => `
        <div class="cart-row">
          <div>
            <strong>${escapeHTML(product.name)}</strong>
            <p>${money(product.price)} · ${escapeHTML(product.category)}</p>
          </div>
          <button data-delete-product="${escapeHTML(product.id)}">
            Delete
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function addProduct(event) {
  event.preventDefault();

  if (!isAdmin()) {
    alert("Admin access is required.");
    return;
  }

  const name = $("#productName").value.trim();
  const price = Number($("#productPrice").value);
  const category = $("#productCategory").value;
  const emoji = $("#productEmoji").value.trim() || "📦";
  const description = $("#productDescription").value.trim();

  if (!name || !Number.isFinite(price) || price <= 0) {
    alert("Enter a valid product name and price.");
    return;
  }

  const products = getProducts();

  products.push({
    id: makeId("PRODUCT"),
    name,
    price,
    category,
    emoji,
    description
  });

  writeJSON(STORAGE.products, products);
  $("#productForm").reset();
  renderAdmin();
  renderFeatured();
  renderProducts();
}

function deleteProduct(productId) {
  if (!isAdmin()) {
    alert("Admin access is required.");
    return;
  }

  if (!confirm("Delete this product?")) return;

  writeJSON(
    STORAGE.products,
    getProducts().filter((product) => product.id !== productId)
  );

  writeJSON(
    STORAGE.cart,
    getCart().filter((item) => item.productId !== productId)
  );

  renderAdmin();
  renderFeatured();
  renderProducts();
  updateCartCount();
}

let authMode = "login";

function openAuth(mode = "login") {
  authMode = mode;
  $("#authMessage").textContent = "";
  $("#authForm").reset();
  updateAuthMode();
  $("#authModal").hidden = false;
  $("#authEmail").focus();
}

function closeAuth() {
  $("#authModal").hidden = true;
}

function updateAuthMode() {
  const registering = authMode === "register";

  $("#authTitle").textContent = registering ? "Create your account" : "Welcome back";
  $("#authSubmit").textContent = registering ? "Register" : "Login";
  $("#nameLabel").hidden = !registering;
  $("#authName").required = registering;
  $("#authName").autocomplete = "name";
  $("#authPassword").autocomplete = registering ? "new-password" : "current-password";
  $("#loginTab").classList.toggle("active", !registering);
  $("#registerTab").classList.toggle("active", registering);
}

function handleAuth(event) {
  event.preventDefault();

  const email = $("#authEmail").value.trim().toLowerCase();
  const password = $("#authPassword").value;
  const name = $("#authName").value.trim();

  if (!email || !password) {
    $("#authMessage").textContent = "Enter your email and password.";
    return;
  }

  const users = getUsers();

  if (authMode === "register") {
    if (name.length < 2) {
      $("#authMessage").textContent = "Enter a name with at least 2 characters.";
      return;
    }

    if (password.length < 8) {
      $("#authMessage").textContent = "Password must be at least 8 characters.";
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === email)) {
      $("#authMessage").textContent = "An account with this email already exists.";
      return;
    }

    const user = {
      id: makeId("USER"),
      name,
      email,
      password,
      role: "customer"
    };

    users.push(user);
    writeJSON(STORAGE.users, users);
    writeJSON(STORAGE.session, { userId: user.id });
    closeAuth();
    updateHeader();
    alert("Demo account created. Do not use a real password in this prototype.");
    return;
  }

  const user = users.find((entry) =>
    entry.email.toLowerCase() === email && entry.password === password
  );

  if (!user) {
    $("#authMessage").textContent = "Invalid email or password.";
    return;
  }

  writeJSON(STORAGE.session, { userId: user.id });
  closeAuth();
  updateHeader();
}

function logout() {
  localStorage.removeItem(STORAGE.session);
  updateHeader();
  showPage("home");
}

function updateHeader() {
  const user = currentUser();

  $("#authButton").hidden = Boolean(user);
  $("#logoutButton").hidden = !user;
  $("#adminNav").hidden = !isAdmin();

  updateCartCount();
  renderFeatured();
  renderProfile();
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#categoryFilter").value = "all";
  showPage("products");
  renderProducts();
});

$("#searchInput").addEventListener("input", () => {
  if (!$("#productsPage").hidden) renderProducts();
});

$("#categoryFilter").addEventListener("change", renderProducts);

document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    showPage(pageButton.dataset.page);
    return;
  }

  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) {
    addToCart(addButton.dataset.addCart);
    return;
  }

  const removeButton = event.target.closest("[data-remove-cart]");
  if (removeButton) {
    removeFromCart(removeButton.dataset.removeCart);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    deleteProduct(deleteButton.dataset.deleteProduct);
    return;
  }

  if (event.target.closest("[data-close-modal]")) {
    closeAuth();
  }
});

document.addEventListener("change", (event) => {
  const quantityInput = event.target.closest("[data-quantity]");

  if (quantityInput) {
    updateQuantity(quantityInput.dataset.quantity, quantityInput.value);
  }
});

$("#cartButton").addEventListener("click", () => showPage("cart"));
$("#authButton").addEventListener("click", () => openAuth("login"));
$("#logoutButton").addEventListener("click", logout);
$("#closeAuth").addEventListener("click", closeAuth);
$("#loginTab").addEventListener("click", () => {
  authMode = "login";
  updateAuthMode();
  $("#authMessage").textContent = "";
});
$("#registerTab").addEventListener("click", () => {
  authMode = "register";
  updateAuthMode();
  $("#authMessage").textContent = "";
});
$("#authForm").addEventListener("submit", handleAuth);
$("#checkoutButton").addEventListener("click", checkout);
$("#productForm").addEventListener("submit", addProduct);
$("#profileAuthButton").addEventListener("click", () => openAuth("login"));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAuth();
});

seedData();
updateHeader();
showPage("home");