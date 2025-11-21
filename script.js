/* ==========================================================
 * SHOPHUB JAVASCRIPT LOGIC
 * ========================================================== */

/* ========== MOCK CATALOGUE ========== 
   Uses placeholder URLs from Picsum for guaranteed image display.
   To use your own images, replace the 'img' values with relative paths 
   (e.g., "images/my-product.jpg") or absolute URLs. 
*/
const products = [
  {id:1,title:"Wireless Noise-Cancelling Headphones",price:79.99,cat:"electronics",img:"https://picsum.photos/id/238/300/300",rating:4.5,desc:"Premium sound, 30-hour battery, comfortable fit."},
  {id:2,title:"Smart Watch Fitness Tracker",price:49.99,cat:"electronics",img:"https://picsum.photos/id/111/300/300",rating:4.3,desc:"Heart-rate, SpO2, sleep & workout tracking."},
  {id:3,title:"Men's Cotton Crew T-Shirt (Pack of 3)",price:24.99,cat:"fashion",img:"https://picsum.photos/id/237/300/300",rating:4.6,desc:"100% combed cotton, breathable, pre-shrunk."},
  {id:4,title:"Stainless-Steel Water Bottle 1L",price:18.99,cat:"home",img:"https://picsum.photos/id/240/300/300",rating:4.7,desc:"Double-wall vacuum insulated, leak-proof."},
  {id:5,title:"4K Webcam with Microphone",price:99.99,cat:"electronics",img:"https://picsum.photos/id/249/300/300",rating:4.4,desc:"Auto-focus, noise-reduction mics, plug & play."},
  {id:6,title:"Yoga Mat Non-Slip 8 mm",price:29.99,cat:"home",img:"https://picsum.photos/id/250/300/300",rating:4.8,desc:"Extra thick, eco-friendly TPE material."},
  {id:7,title:"Denim Jacket Women",price:45.00,cat:"fashion",img:"https://picsum.photos/id/257/300/300",rating:4.5,desc:"Classic trucker style, 98% cotton."},
  {id:8,title:"Mechanical Gaming Keyboard RGB",price:69.99,cat:"electronics",img:"https://picsum.photos/id/258/300/300",rating:4.6,desc:"Hot-swappable switches, per-key RGB."},
  {id:9,title:"Premium Leather Wallet",price:35.50,cat:"fashion",img:"https://picsum.photos/id/260/300/300",rating:4.2,desc:"Slim profile with RFID blocking technology."},
  {id:10,title:"Aromatherapy Diffuser",price:39.99,cat:"home",img:"https://picsum.photos/id/261/300/300",rating:4.5,desc:"Ultrasonic operation with color-changing light."}
];

/* ========== ROUTER (SPA Navigation) ========== */
const pages = document.querySelectorAll('.page');
function showPage(id){
  // Hide all pages
  pages.forEach(p=>p.classList.remove('active'));
  // Show the requested page
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  
  // Conditionally render content when navigating to the products or deals page
  if(id==='products') renderProducts(products);
  if(id==='deals') renderDeals();
}

/* ========== RENDER HELPERS (Creates HTML) ========== */

/**
 * Generates the HTML string for a single product card.
 * @param {Object} p - A product object.
 */
function cardHTML(p){
  return `
    <div class="card" onclick="showDetail(${p.id})">
      <img src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="stars">${'★'.repeat(Math.floor(p.rating))} (${p.rating})</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <button onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`;
}

/**
 * Renders a list of products into the main products grid.
 * @param {Array} list - Array of product objects to render.
 */
function renderProducts(list){
  document.getElementById('productsGrid').innerHTML = list.map(cardHTML).join('');
}

/**
 * Renders the top 4 products into the trending grid on the home page.
 */
function renderTrending(){
  document.getElementById('trendingGrid').innerHTML = products.slice(0,4).map(cardHTML).join('');
}

/**
 * Renders products with a price under $40 into the deals grid.
 */
function renderDeals(){
  document.getElementById('dealsGrid').innerHTML = products.filter(p=>p.price<40).map(cardHTML).join('');
}

/* ========== FILTER LOGIC ========== */

/**
 * Filters the product list based on selected category checkboxes.
 * @param {string} cat - The category that triggered the filter change (not directly used, but helps).
 */
function filterCat(cat){
  // Get all checked filter values (e.g., ['electronics', 'fashion'])
  const checked = [...document.querySelectorAll('.filters input:checked')].map(i=>i.value);
  
  // Filter the main product list
  const filtered = checked.length 
    ? products.filter(p=>checked.includes(p.cat)) 
    : products; // If no boxes are checked, show all products
    
  renderProducts(filtered);
}

/* ========== PRODUCT DETAIL PAGE ========== */
function showDetail(id){
  const p = products.find(x=>x.id===id);
  document.getElementById('detailBox').innerHTML = `
    <div class="detail-img">
      <img src="${p.img}" alt="${p.title}">
    </div>
    <div class="detail-info">
      <h1>${p.title}</h1>
      <div class="stars">${'★'.repeat(Math.floor(p.rating))} (${p.rating})</div>
      <div class="price">$${p.price.toFixed(2)}</div>
      <p>${p.desc}</p>
      <button class="cta" onclick="addToCart(${p.id})">Add to Cart</button>
      <button onclick="showPage('products')" style="margin-top:.5rem;background:#777;">← Back to list</button>
    </div>`;
  showPage('detail');
}

/* ========== CART LOGIC ========== */
let cart = [];

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const exist = cart.find(x=>x.id===id);
  exist ? exist.qty++ : cart.push({...p,qty:1});
  updateCartUI();
  toggleCart(true); // Open cart automatically
}

function removeFromCart(id){
  cart = cart.filter(x=>x.id!==id);
  updateCartUI();
}

function updateCartUI(){
  const badge = document.getElementById('cartBadge');
  const list  = document.getElementById('cartList');
  const total = document.getElementById('cartTotal');
  
  // Update badge count
  badge.textContent = cart.reduce((s,i)=>s+i.qty,0);
  
  // Render cart list items
  list.innerHTML = cart.map(item=>`
    <div class="cart-item">
      <img src="${item.img}" alt="">
      <div>
        <div>${item.title}</div>
        <div>$${item.price.toFixed(2)} × ${item.qty}</div>
        <button onclick="removeFromCart(${item.id})" style="font-size:.7rem;background:#d11;color:#fff;">Remove</button>
      </div>
    </div>`).join('');
    
  // Update total price
  total.textContent = cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
}

/**
 * Toggles the visibility of the cart slide-out drawer.
 * @param {boolean} force - Optional parameter to force the cart open (true) or closed (false).
 */
function toggleCart(force){
  document.getElementById('cart').classList.toggle('open',force);
}

/* ========== SEARCH LOGIC ========== */
function searchProducts(){
  const q = document.getElementById('searchInput').value.toLowerCase();
  const res = products.filter(p=>p.title.toLowerCase().includes(q));
  renderProducts(res);
  showPage('products'); // Switch to product list to show results
}

/* ========== INITIALIZATION (RUNS ON PAGE LOAD) ========== */
document.addEventListener('DOMContentLoaded',()=>{
  // Render initial content for the Home and Deals pages
  renderTrending();
  renderDeals();
  // IMPORTANT: Render ALL products into the #productsGrid so it's ready when navigated to
  renderProducts(products); 
  
  // Set the current year in the footer
  document.getElementById('year').textContent = new Date().getFullYear();
});