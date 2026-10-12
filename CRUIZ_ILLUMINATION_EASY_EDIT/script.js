/* =========================================================
   CRUIZ ILLUMINATION — simple catalogue and rental cart
   This file is intentionally formatted vertically for editing.
   ========================================================= */

/* STEP 1: Put your WhatsApp number here.
   Sri Lanka example format: 94771234567
   Do not include +, spaces, brackets, or the leading 0.
*/
const WHATSAPP_NUMBER = "94788009446";

/* STEP 2: Edit products here.
   available = number you can rent at the same time.
   outOfStock = true shows the OUT OF STOCK label.
   Set outOfStock back to false to turn the label off.
   image = path to your image, for example "images/number-8.jpg".
   Use image: "" if you want to show the decorative symbol instead.
*/
const PRODUCTS = [
  {
    id: "letter-h",
    name: "LED Letter H",
    category: "Letters",
    pricePerDay: 1500,
    available: 2,
    outOfStock: false,
    symbol: "H",
    image: "",
    description: "Warm-white illuminated letter for birthdays and events.",
    featured: true
  },
  {
    id: "letter-a",
    name: "LED Letter A",
    category: "Letters",
    pricePerDay: 1500,
    available: 2,
    outOfStock: false,
    symbol: "A",
    image: "",
    description: "A glowing letter for names, initials and event displays.",
    featured: true
  },
  {
    id: "number-8",
    name: "LED Number 8",
    category: "Numbers",
    pricePerDay: 1800,
    available: 1,
    outOfStock: false,
    symbol: "8",
    image: "",
    description: "A statement number for birthdays and milestone celebrations.",
    featured: true
  },
  {
    id: "birthday-sign",
    name: "Happy Birthday Sign",
    category: "Signs",
    pricePerDay: 4500,
    available: 1,
    outOfStock: true,
    symbol: "HBD",
    image: "",
    description: "A bright centrepiece for birthday photos and party décor.",
    featured: false
  },
  {
    id: "light-curtain",
    name: "Warm Light Curtain",
    category: "Lighting",
    pricePerDay: 2500,
    available: 3,
    outOfStock: false,
    symbol: "✦",
    image: "",
    description: "Warm decorative lights for a backdrop or photo area.",
    featured: false
  },
  {
    id: "backdrop-frame",
    name: "Backdrop Frame",
    category: "Event Décor",
    pricePerDay: 3500,
    available: 1,
    outOfStock: false,
    symbol: "FRAME",
    image: "",
    description: "A simple frame for event backdrops and styling.",
    featured: false
  },
   {
    id: "party-box",
    name: "Bluetooth Party Box ",
    category: "Sounds",
    pricePerDay: 3500,
    available: 1,
    outOfStock: true,
    symbol: "⚡",
    image: "",
    description: "A sound for party with higher quality speaker.",
    featured: false
  }
];

/* Do not need to edit below here for ordinary product updates. */
const CART_STORAGE_KEY = "cruizIlluminationCartV1";
const DETAILS_STORAGE_KEY = "cruizIlluminationBookingDetailsV1";

let cart = loadJson(CART_STORAGE_KEY, []);
let selectedProductId = null;
let toastTimeout = null;

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");
const emptyMessage = document.querySelector("#empty-message");

const productModal = document.querySelector("#product-modal");
const modalQuantity = document.querySelector("#modal-quantity");
const modalDays = document.querySelector("#modal-days");
const modalFulfilment = document.querySelector("#modal-fulfilment");
const modalTotal = document.querySelector("#modal-total");
const modalFeedback = document.querySelector("#modal-feedback");

const cartDrawer = document.querySelector("#cart-drawer");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const toast = document.querySelector("#toast");

function loadJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function saveBookingDetails() {
  const details = {
    name: document.querySelector("#customer-name").value,
    phone: document.querySelector("#customer-phone").value,
    date: document.querySelector("#event-date").value,
    venue: document.querySelector("#event-venue").value,
    notes: document.querySelector("#event-notes").value,
    fulfilment: document.querySelector("#checkout-fulfilment").value
  };

  localStorage.setItem(
    DETAILS_STORAGE_KEY,
    JSON.stringify(details)
  );
}

function restoreBookingDetails() {
  const details = loadJson(DETAILS_STORAGE_KEY, {});

  document.querySelector("#customer-name").value = details.name || "";
  document.querySelector("#customer-phone").value = details.phone || "";
  document.querySelector("#event-date").value = details.date || "";
  document.querySelector("#event-venue").value = details.venue || "";
  document.querySelector("#event-notes").value = details.notes || "";
  document.querySelector("#checkout-fulfilment").value =
    details.fulfilment || "Pickup";
}

function money(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function isAvailable(product) {
  return Boolean(product) &&
    !product.outOfStock &&
    Number(product.available) > 0;
}

function getCartQuantityForProduct(productId) {
  return cart
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

function getProductRemaining(product) {
  return Math.max(
    0,
    Number(product.available) - getCartQuantityForProduct(product.id)
  );
}

function productImageMarkup(product) {
  if (product.image) {
    return `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`;
  }

  return `<span class="art-symbol">${escapeHtml(product.symbol || "✦")}</span>`;
}

function stockBadgeMarkup(product) {
  if (!isAvailable(product)) {
    return '<span class="stock-badge">Out of stock</span>';
  }

  return `<span class="stock-badge available">${getProductRemaining(product)} available</span>`;
}

function renderCategories() {
  const categories = [...new Set(PRODUCTS.map((product) => product.category))];

  categoryFilter.innerHTML = '<option value="all">All categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function getVisibleProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortMode = sortFilter.value;

  let visibleProducts = PRODUCTS.filter((product) => {
    const searchableText = [
      product.name,
      product.category,
      product.description
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortMode === "price-low") {
    visibleProducts.sort((a, b) => a.pricePerDay - b.pricePerDay);
  }

  if (sortMode === "price-high") {
    visibleProducts.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  if (sortMode === "name") {
    visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortMode === "featured") {
    visibleProducts.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return visibleProducts;
}

function renderProducts() {
  const products = getVisibleProducts();

  productGrid.innerHTML = products.map((product) => {
    const unavailable = !isAvailable(product);
    const buttonLabel = unavailable ? "View details" : "View & rent";

    return `
      <article class="product-card">
        <div class="product-art">
          ${stockBadgeMarkup(product)}
          ${productImageMarkup(product)}
        </div>

        <div class="product-info">
          <div class="product-topline">
            <div>
              <h3 class="product-name">${escapeHtml(product.name)}</h3>
              <p class="product-category">${escapeHtml(product.category)}</p>
            </div>
          </div>

          <p class="product-price">
            ${money(product.pricePerDay)}
            <small>/ day</small>
          </p>

          <div class="card-actions">
            <button
              class="button button-dark"
              type="button"
              data-open-product="${escapeHtml(product.id)}"
            >${buttonLabel}</button>

            <button
              class="button button-light share-button"
              type="button"
              aria-label="Share ${escapeHtml(product.name)}"
              data-share-product="${escapeHtml(product.id)}"
            >↗</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  emptyMessage.hidden = products.length !== 0;
}

function openProduct(productId) {
  const product = getProduct(productId);
  if (!product) return;

  selectedProductId = productId;
  modalFeedback.textContent = "";

  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-title").textContent = product.name;
  document.querySelector("#modal-description").textContent = product.description;
  document.querySelector("#modal-price").textContent =
    `${money(product.pricePerDay)} / day`;
  document.querySelector("#modal-stock").textContent = isAvailable(product)
    ? `${getProductRemaining(product)} available to rent`
    : "Currently out of stock";

  document.querySelector("#modal-art").innerHTML = productImageMarkup(product);
  modalQuantity.value = "1";
  modalQuantity.max = String(getProductRemaining(product));
  modalDays.value = "1";
  updateModalTotal();

  const addButton = document.querySelector("#add-to-cart");
  addButton.disabled = !isAvailable(product);
  addButton.textContent = isAvailable(product) ? "Add to bag" : "Currently unavailable";

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeProduct() {
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("is-open")) {
    document.body.classList.remove("no-scroll");
  }
}

function updateModalTotal() {
  const product = getProduct(selectedProductId);
  if (!product) return;

  const quantity = Math.max(1, Number(modalQuantity.value) || 1);
  const days = Math.max(1, Number(modalDays.value) || 1);

  modalTotal.textContent = money(product.pricePerDay * quantity * days);
}

function addSelectedProductToCart() {
  const product = getProduct(selectedProductId);
  if (!product || !isAvailable(product)) return;

  const quantity = Math.max(1, Number(modalQuantity.value) || 1);
  const days = Math.max(1, Number(modalDays.value) || 1);
  const remaining = getProductRemaining(product);

  if (quantity > remaining) {
    modalFeedback.textContent = `Only ${remaining} unit(s) currently available.`;
    return;
  }

  const fulfilment = modalFulfilment.value;
  const existingItem = cart.find((item) =>
    item.productId === product.id &&
    item.days === days &&
    item.fulfilment === fulfilment
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      quantity,
      days,
      fulfilment
    });
  }

  saveCart();
  renderCart();
  renderProducts();
  closeProduct();
  openCart();
  showToast("Added to your bag.");
}

function cartLineTotal(item) {
  const product = getProduct(item.productId);
  if (!product) return 0;
  return product.pricePerDay * item.quantity * item.days;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + cartLineTotal(item), 0);
}

function renderCart() {
  cart = cart.filter((item) => getProduct(item.productId));
  saveCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(totalQuantity);
  cartTotal.textContent = money(getCartTotal());
  cartEmpty.hidden = cart.length !== 0;

  cartItems.innerHTML = cart.map((item, index) => {
    const product = getProduct(item.productId);

    return `
      <article class="cart-line">
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${money(product.pricePerDay)} / day</p>
          <p>${item.quantity} item(s) · ${item.days} day(s) · ${escapeHtml(item.fulfilment)}</p>
          <div class="cart-line-actions">
            <button type="button" data-cart-minus="${index}" aria-label="Reduce quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-plus="${index}" aria-label="Increase quantity">+</button>
            <button type="button" class="remove-item" data-cart-remove="${index}">Remove</button>
          </div>
        </div>
        <strong>${money(cartLineTotal(item))}</strong>
      </article>
    `;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!productModal.classList.contains("is-open")) {
    document.body.classList.remove("no-scroll");
  }
}

function updateCartQuantity(index, change) {
  const item = cart[index];
  if (!item) return;

  const product = getProduct(item.productId);
  const newQuantity = item.quantity + change;

  if (newQuantity < 1) {
    cart.splice(index, 1);
  } else if (newQuantity > product.available || product.outOfStock) {
    showToast(`Only ${product.available} unit(s) listed as available.`);
  } else {
    item.quantity = newQuantity;
  }

  saveCart();
  renderCart();
  renderProducts();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  renderProducts();
}

function productShareText(product) {
  return [
    product.name,
    `Rental price: ${money(product.pricePerDay)} per day`,
    isAvailable(product) ? "Availability: check with CRUIZ ILLUMINATION" : "Currently out of stock",
    "CRUIZ ILLUMINATION — Every Moment, Brighter."
  ].join("\n");
}

async function shareText(text, title) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: window.location.href });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    showToast("Share text copied. Paste it into your app.");
  } catch (error) {
    window.prompt("Copy this text to share:", text);
  }
}

function shareProduct(productId) {
  const product = getProduct(productId);
  if (!product) return;
  shareText(productShareText(product), product.name);
}

function buildCartSummary() {
  const lines = cart.map((item) => {
    const product = getProduct(item.productId);
    return [
      `• ${product.name}`,
      `  Quantity: ${item.quantity}`,
      `  Rental days: ${item.days}`,
      `  Method: ${item.fulfilment}`,
      `  Subtotal: ${money(cartLineTotal(item))}`
    ].join("\n");
  });

  return [
    "CRUIZ ILLUMINATION — RENTAL REQUEST",
    "",
    ...lines,
    "",
    `Estimated rental total: ${money(getCartTotal())}`,
    "",
    "Please confirm availability, delivery fee and security deposit."
  ].join("\n");
}

function shareCart() {
  if (cart.length === 0) {
    showToast("Add at least one product before sharing your bag.");
    return;
  }

  shareText(buildCartSummary(), "CRUIZ ILLUMINATION rental selection");
}

function proceedViaWhatsApp(event) {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Your bag is empty.");
    return;
  }

  const name = document.querySelector("#customer-name").value.trim();
  const phone = document.querySelector("#customer-phone").value.trim();
  const date = document.querySelector("#event-date").value;
  const venue = document.querySelector("#event-venue").value.trim();
  const notes = document.querySelector("#event-notes").value.trim();
  const fulfilment = document.querySelector("#checkout-fulfilment").value;

  if (!name || !phone || !date || !venue) {
    showToast("Please complete the required booking details.");
    return;
  }

  const message = [
    "Hello CRUIZ ILLUMINATION! I would like to request a rental booking.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Event date: ${date}`,
    `Venue / address: ${venue}`,
    `Preferred collection: ${fulfilment}`,
    "",
    buildCartSummary(),
    "",
    `Extra notes: ${notes || "None"}`,
    "",
    "Please confirm availability, delivery charges, security deposit and booking terms."
  ].join("\n");

  if (WHATSAPP_NUMBER.includes("X")) {
    showToast("First add your WhatsApp number near the top of script.js.");
    return;
  }

  saveBookingDetails();

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Product and cart actions use event delegation. */
document.addEventListener("click", (event) => {
  const openProductButton = event.target.closest("[data-open-product]");
  if (openProductButton) {
    openProduct(openProductButton.dataset.openProduct);
    return;
  }

  const shareProductButton = event.target.closest("[data-share-product]");
  if (shareProductButton) {
    shareProduct(shareProductButton.dataset.shareProduct);
    return;
  }

  const closeModalButton = event.target.closest("[data-close-modal]");
  if (closeModalButton) {
    closeProduct();
    return;
  }

  if (event.target.closest("[data-close-cart]")) {
    closeCart();
    return;
  }

  const minusButton = event.target.closest("[data-cart-minus]");
  if (minusButton) {
    updateCartQuantity(Number(minusButton.dataset.cartMinus), -1);
    return;
  }

  const plusButton = event.target.closest("[data-cart-plus]");
  if (plusButton) {
    updateCartQuantity(Number(plusButton.dataset.cartPlus), 1);
    return;
  }

  const removeButton = event.target.closest("[data-cart-remove]");
  if (removeButton) {
    removeCartItem(Number(removeButton.dataset.cartRemove));
  }
});

document.querySelector("#cart-open").addEventListener("click", openCart);
document.querySelector("#add-to-cart").addEventListener("click", addSelectedProductToCart);
document.querySelector("#share-product").addEventListener("click", () => {
  shareProduct(selectedProductId);
});
document.querySelector("#share-cart").addEventListener("click", shareCart);
document.querySelector("#checkout-form").addEventListener("submit", proceedViaWhatsApp);

modalQuantity.addEventListener("input", updateModalTotal);
modalDays.addEventListener("input", updateModalTotal);
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

[
  "#customer-name",
  "#customer-phone",
  "#event-date",
  "#event-venue",
  "#event-notes",
  "#checkout-fulfilment"
].forEach((selector) => {
  document.querySelector(selector).addEventListener("input", saveBookingDetails);
  document.querySelector(selector).addEventListener("change", saveBookingDetails);
});

renderCategories();
restoreBookingDetails();
renderProducts();
renderCart();
