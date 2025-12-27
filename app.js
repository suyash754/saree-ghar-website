// Saree Ghar - app.js (UPDATED for images at the root level)

// Your WhatsApp number with country code (no +)
const PHONE_WA = "919850937088";

// Your complete product list with correct image paths
const sareeData = [
    // --- Designer (5 sarees) ---
    ...Array.from({ length: 5 }, (_, i) => ({
        id: `designer-${i + 1}`,
        cat: "designer",
        name: `Designer Saree ${i + 1}`,
        price: 2200 + i * 200,
        img: `designer-${i + 1}.jpeg`, // REMOVED folder path
        desc: "A modern designer saree with unique patterns, perfect for parties and special occasions."
    })),

    // --- Paithani (8 sarees) ---
    ...Array.from({ length: 8 }, (_, i) => ({
        id: `paithani-${i + 1}`,
        cat: "paithani",
        name: `Traditional Paithani ${i + 1}`,
        price: 12000 + i * 500,
        img: `paithani-${i + 1}.jpeg`, // REMOVED folder path
        desc: "Authentic Paithani saree with rich zari work, representing the classic heritage of Maharashtra."
    })),

    // --- Kaathpadar (6 sarees) ---
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `kaathpadar-${i + 1}`,
        cat: "kaathpadar",
        name: `Kaathpadar Silk ${i + 1}`,
        price: 3500 + i * 250,
        img: `kaathpadar-${i + 1}.jpeg`, // REMOVED folder path
        desc: "An elegant Kaathpadar saree known for its distinctive and beautiful border."
    })),
    
    // --- Synthetic (No images, so we'll skip adding this to the data for now) ---
    // If you add synthetic-1.jpeg, etc., you can uncomment this section.
    /*
    ...Array.from({ length: 7 }, (_, i) => ({
        id: `synthetic-${i + 1}`,
        cat: "synthetic",
        name: `Synthetic Saree ${i + 1}`,
        price: 900 + i * 100,
        img: `synthetic-${i + 1}.jpeg`, // REMOVED folder path
        desc: "A lightweight and easy-to-manage synthetic saree, great for daily wear."
    })),
    */

    // --- Cotton (8 sarees) ---
    ...Array.from({ length: 8 }, (_, i) => ({
        id: `cotton-${i + 1}`,
        cat: "cotton",
        name: `Pure Cotton Saree ${i + 1}`,
        price: 1100 + i * 120,
        img: `cotton-${i + 1}.jpeg`, // REMOVED folder path
        desc: "A comfortable and breathable pure cotton saree, perfect for the Indian climate."
    })),
];

// ------- Get HTML Elements -------
const grid = document.getElementById("sareeGrid");
const modal = document.getElementById("sareeModal");
const waLink = document.getElementById("waLink");
const addToCartBtn = document.getElementById("addToCartBtn");
const cartMiniBody = document.getElementById("cartMiniBody");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const contactForm = document.getElementById("contactForm");

let currentProduct = null;
const CART_KEY = "sareeGharCart";
let cart = loadCart();

// ------- Main Functions -------

function renderSarees(list) {
    grid.innerHTML = "";
    list.forEach((saree) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${saree.img}" alt="${escapeHtml(saree.name)}" loading="lazy">
            <div class="product-info">
                <div class="product-cat">${escapeHtml(saree.cat)}</div>
                <div class="product-name">${escapeHtml(saree.name)}</div>
                <div class="product-price">₹${formatINR(saree.price)}</div>
            </div>
        `;
        card.addEventListener("click", () => openModal(saree));
        grid.appendChild(card);
    });
}

function openModal(product) {
    currentProduct = product;
    document.getElementById("mImg").src = product.img;
    document.getElementById("mTitle").innerText = product.name;
    document.getElementById("mCat").innerText = product.cat.toUpperCase();
    document.getElementById("mPrice").innerText = `₹${formatINR(product.price)}`;
    document.getElementById("mDesc").innerText = product.desc;

    const msg = encodeURIComponent(`Hello Saree Ghar, I want to buy:\n${product.name}\nPrice: ₹${formatINR(product.price)}\nPlease confirm availability.`);
    waLink.href = `https://wa.me/${PHONE_WA}?text=${msg}`;

    updateMiniCartUI();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
    currentProduct = null;
}

window.closeModal = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

// ------- Cart Functions -------

addToCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;
    cart.push({ id: currentProduct.id, name: currentProduct.name, price: currentProduct.price });
    saveCart();
    updateMiniCartUI();
    alert(`"${currentProduct.name}" added to cart!`);
});

checkoutBtn.addEventListener("click", () => {
    if (!cart.length) return alert("Your cart is empty.");
    
    const lines = cart.map((item, idx) => `${idx + 1}. ${item.name} (₹${formatINR(item.price)})`);
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    const msg = encodeURIComponent(`Hello Saree Ghar, I'd like to place an order for:\n\n${lines.join("\n")}\n\n*Total: ₹${formatINR(total)}*\n\nPlease confirm my order.`);
    
    window.open(`https://wa.me/${PHONE_WA}?text=${msg}`, "_blank", "noopener");
});

clearCartBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        saveCart();
        updateMiniCartUI();
    }
});

function updateMiniCartUI() {
    if (!cart.length) {
        cartMiniBody.innerText = "Your cart is empty.";
        return;
    }
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    const text = cart.map((i, idx) => `${idx + 1}. ${i.name} — ₹${formatINR(i.price)}`).join("\n");
    cartMiniBody.innerText = `${text}\n\nTotal: ₹${formatINR(total)}`;
}

function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function loadCart() { try { const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }

// ------- Helper & Init Functions -------

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! We will get in touch with you soon.");
    contactForm.reset();
});

document.querySelectorAll('nav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        const offset = document.querySelector("header").offsetHeight + 10;
        window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    });
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.cat;
        if (cat === "all") renderSarees(sareeData);
        else renderSarees(sareeData.filter((x) => x.cat === cat));
    });
});

function formatINR(n) { return Number(n).toLocaleString("en-IN"); }
function escapeHtml(str) { return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])); }

// Initial Load
renderSarees(sareeData);
updateMiniCartUI();
