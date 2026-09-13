const products = {
  1: {
    name: "Baju Roblox #001",
    type: "baju",
    price: 10000,
    icon: "👕",
    description: "Baju Roblox keren dan siap digunakan. Cocok untuk melengkapi outfit Roblox kamu."
  },
  2: {
    name: "Celana Roblox #001",
    type: "celana",
    price: 10000,
    icon: "👖",
    description: "Celana Roblox untuk melengkapi outfit. Detail produk bisa dikonfirmasi dengan admin."
  },
  3: {
    name: "Akun Roblox #001",
    type: "akun",
    price: 50000,
    icon: "👤",
    description: "Akun Roblox dengan detail yang dapat kamu tanyakan kepada admin sebelum melakukan pembelian."
  }
};

let cart = JSON.parse(localStorage.getItem("vinCart") || "[]");

function formatRupiah(number){
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function saveCart(){
  localStorage.setItem("vinCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  document.getElementById("cartCount").textContent =
    cart.reduce((sum, item) => sum + item.qty, 0);
}

function addCart(id){
  const product = products[id];
  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.qty++;
  } else {
    cart.push({id:id, qty:1});
  }

  saveCart();
  alert(product.name + " ditambahkan ke keranjang!");
}

function removeCart(id){
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function cartTotal(){
  return cart.reduce((total, item) => {
    return total + products[item.id].price * item.qty;
  }, 0);
}

function showCart(){
  renderCart();
  document.getElementById("cartModal").style.display = "block";
}

function renderCart(){
  const box = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");

  if(cart.length === 0){
    box.innerHTML = '<div class="empty">Keranjang masih kosong.</div>';
    total.textContent = "";
    return;
  }

  box.innerHTML = cart.map(item => {
    const p = products[item.id];
    return `
      <div class="cart-row">
        <div>
          <b>${p.name}</b>
          <small>${item.qty} × ${formatRupiah(p.price)}</small>
        </div>
        <button class="remove" onclick="removeCart(${item.id})">Hapus</button>
      </div>
    `;
  }).join("");

  total.textContent = "Total: " + formatRupiah(cartTotal());
}

function openProduct(id){
  const p = products[id];

  document.getElementById("productDetail").innerHTML = `
    <div class="detail-image">${p.icon}</div>
    <h2>${p.name}</h2>
    <div class="price">${formatRupiah(p.price)}</div>
    <p class="detail-desc">${p.description}</p>
    <button class="modal-action" onclick="addCart(${id}); closeModal('productModal');">
      🛒 Tambah ke Keranjang
    </button>
  `;

  document.getElementById("productModal").style.display = "block";
}

function openCheckout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong.");
    return;
  }

  closeModal("cartModal");

  document.getElementById("checkoutSummary").innerHTML = `
    <div class="notice">
      ${cart.map(item => `${products[item.id].name} × ${item.qty}`).join("<br>")}
      <br><b>Total: ${formatRupiah(cartTotal())}</b>
    </div>
  `;

  document.getElementById("checkoutModal").style.display = "block";
}

function finishCheckout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong.");
    return;
  }

  const name = document.getElementById("buyerName").value.trim();
  const roblox = document.getElementById("robloxName").value.trim();
  const payment = document.querySelector('input[name="payment"]:checked');

  if(!name || !roblox){
    alert("Isi nama dan username Roblox terlebih dahulu.");
    return;
  }

  if(!payment){
    alert("Pilih metode payment terlebih dahulu.");
    return;
  }

  const orderList = cart.map(item => {
    const p = products[item.id];
    return `• ${p.name} x${item.qty} = ${formatRupiah(p.price * item.qty)}`;
  }).join("\n");

  const message =
`Halo Admin VIN STORE 👋

Saya ingin melakukan pembelian.

Nama: ${name}
Username Roblox: ${roblox}

Pesanan:
${orderList}

Total: ${formatRupiah(cartTotal())}
Payment: ${payment.value}

Mohon dibantu untuk proses pesanan dan pembayaran.`;

  // GANTI NOMOR INI DENGAN NOMOR WHATSAPP ADMIN.
  // Format: 6287790180781, tanpa tanda + dan tanpa spasi.
  const adminNumber = "6282130585927";

  const whatsappUrl =
    "https://wa.me/" + adminNumber + "?text=" + encodeURIComponent(message);

  window.open(whatsappUrl, "_blank");

  cart = [];
  saveCart();
  closeModal("checkoutModal");
}

function closeModal(id){
  document.getElementById(id).style.display = "none";
}

function scrollToItems(){
  document.getElementById("items").scrollIntoView({behavior:"smooth"});
}

function filterItems(type, btn){
  document.querySelectorAll(".categories button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  document.querySelectorAll(".card").forEach(c => {
    c.style.display =
      (type === "all" || c.dataset.type === type) ? "block" : "none";
  });
}

window.addEventListener("click", function(event){
  document.querySelectorAll(".modal").forEach(modal => {
    if(event.target === modal){
      modal.style.display = "none";
    }
  });
});

updateCartCount();
