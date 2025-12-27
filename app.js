// Saree Ghar - app.js

const PHONE_WA = "919850937088"; 

// --- GENERATE PRODUCTS BASED ON YOUR COUNTS ---
const sareeData = [
  // 1. Designer (5 Sarees)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `designer-${i + 1}`,
    cat: "designer",
    name: `Designer Saree ${i + 1}`,
    price: 2200 + (i * 200),
    img: `images/sarees/designer-${i + 1}.jpeg`,
    desc: "Elegant Designer saree, perfect for parties and modern occasions."
  })),

  // 2. Paithani (8 Sarees)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `paithani-${i + 1}`,
    cat: "paithani",
    name: `Royal Paithani ${i + 1}`,
    price: 12000 + (i * 500),
    img: `images/sarees/paithani-${i + 1}.jpeg`,
    desc: "Authentic hand-woven Paithani with traditional peacock border."
  })),

  // 3. Kaathpadar (6 Sarees)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `kaathpadar-${i + 1}`,
    cat: "kaathpadar",
    name: `Kaathpadar Silk ${i + 1}`,
    price: 3500 + (i * 250),
    img: `images/sarees/kaathpadar-${i + 1}.jpeg`,
    desc: "Traditional Maharashtrian Kaathpadar saree with rich border work."
  })),

  // 4. Synthetic (7 Sarees)
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `synthetic-${i + 1}`,
    cat: "synthetic",
    name: `Synthetic Daily Wear ${i + 1}`,
    price: 850 + (i * 50),
    img: `images/sarees/synthetic-${i + 1}.jpeg`,
    desc: "Lightweight synthetic saree, easy to wash and wear daily."
  })),

  // 5. Cotton (8 Sarees)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `cotton-${i + 1}`,
    cat: "cotton",
    name: `Pure Cotton ${i + 1}`,
    price: 1200 + (i * 100),
    img: `images/sarees/cotton-${i + 1}.jpeg`,
    desc: "Breathable pure cotton saree, very comfortable for all day use."
  })),
];

// --- APP LOGIC ---
const grid = document.getElementById("sareeGrid");
const modal = document.getElementById("sareeModal");
const waLink = document.getElementById("waLink");
const addToCartBtn = document.getElementById("addToCartBtn");
const cartBody = document.getElementById("cartBody");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

let currentProduct = null;
let cart = JSON.parse(localStorage.getItem("sareeCart")) || [];

// Render Grid
function renderSarees(list) {
  grid.innerHTML = "";
  list.forEach((s) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${s.img}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Image+Not+Found'">
      <div class="product-info">
        <div class="product-cat">${s.cat.toUpperCase()}</div>
        <div class="product-name">${s.name}</div>
        <div class="product-price">₹${s.price.toLocaleString()}</div>
      </div>
    `;
    card.onclick = () => openModal(s);
    grid.appendChild(card);
  });
}

// Filters
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    renderSarees(cat === "all" ? sareeData : sareeData.filter((s) => s.cat === cat));
  });
});

// Modal Logic
function openModal(s) {
  currentProduct = s;
  document.getElementById("mImg").src = s.img;
  document.getElementById("mTitle").innerText = s.name;
  document.getElementById("mCat").innerText = s.cat.toUpperCase();
  document.getElementById("mPrice").innerText = `₹${s.price.toLocaleString()}`;
  document.getElementById("mDesc").innerText = s.desc;

  // WhatsApp Buy Link
  const msg = encodeURIComponent(`Hello Saree Ghar, I want to buy: ${s.name} (₹${s.price}). Available?`);
  waLink.href = `https://wa.me/${PHONE_WA}?text=${msg}`;

  updateCartUI();
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = (e) => { if (e.target === modal) closeModal(); };

// Cart Logic
addToCartBtn.onclick = () => {
  cart.push(currentProduct);
  localStorage.setItem("sareeCart", JSON.stringify(cart));
  updateCartUI();
  alert("Added to cart!");
};

function updateCartUI() {
  if (cart.length === 0) {
    cartBody.innerText = "Your cart is empty.";
  } else {
    cartBody.innerHTML = cart.map((i, idx) => `<div>${idx + 1}. ${i.name} - ₹${i.price}</div>`).join("");
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    cartBody.innerHTML += `<div style="margin-top:5px; font-weight:bold; border-top:1px solid #ccc; padding-top:5px;">Total: ₹${total.toLocaleString()}</div>`;
  }
}

checkoutBtn.onclick = () => {
  if (cart.length === 0) return alert("Cart is empty!");
  const itemsList = cart.map((i, idx) => `${idx + 1}. ${i.name} (₹${i.price})`).join("\n");
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const msg = encodeURIComponent(`Hello Saree Ghar, I want to order:\n\n${itemsList}\n\n*Total: ₹${total}*\n\nPlease confirm order.`);
  window.open(`https://wa.me/${PHONE_WA}?text=${msg}`, "_blank");
};

clearCartBtn.onclick = () => {
  cart = [];
  localStorage.setItem("sareeCart", JSON.stringify(cart));
  updateCartUI();
};

// Start
renderSarees(sareeData);
updateCartUI();