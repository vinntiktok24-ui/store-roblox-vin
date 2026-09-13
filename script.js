const products = {
  1:{name:"Baju Roblox #001",type:"baju",price:10000,icon:"👕",description:"Baju Roblox keren dan siap digunakan. Cocok untuk melengkapi outfit Roblox kamu."},
  2:{name:"Celana Roblox #001",type:"celana",price:10000,icon:"👖",description:"Celana Roblox untuk melengkapi outfit. Detail produk bisa dikonfirmasi dengan admin."},
  3:{name:"Akun Roblox #001",type:"akun",price:50000,icon:"👤",description:"Akun Roblox dengan detail yang dapat kamu tanyakan kepada admin sebelum melakukan pembelian."}
};
let cart=JSON.parse(localStorage.getItem("vinCart")||"[]");
function formatRupiah(number){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(number)}
function saveCart(){localStorage.setItem("vinCart",JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const el=document.getElementById("cartCount");if(el)el.textContent=cart.reduce((sum,item)=>sum+item.qty,0)}
function addCart(id){const p=products[id],existing=cart.find(item=>item.id===id);if(existing)existing.qty++;else cart.push({id,qty:1});saveCart();renderCart();toast(p.name+" ditambahkan ke keranjang!")}
function removeCart(id){cart=cart.filter(item=>item.id!==id);saveCart();renderCart()}
function cartTotal(){return cart.reduce((total,item)=>total+products[item.id].price*item.qty,0)}
function showCart(){renderCart();document.getElementById("cartModal").style.display="block"}
function renderCart(){const box=document.getElementById("cartItems"),total=document.getElementById("cartTotal");if(!cart.length){box.innerHTML='<div class="empty">Keranjang masih kosong.</div>';total.textContent="";return}box.innerHTML=cart.map(item=>{const p=products[item.id];return `<div class="cart-row"><div><b>${p.name}</b><small>${item.qty} × ${formatRupiah(p.price)}</small></div><button class="remove" onclick="removeCart(${item.id})">Hapus</button></div>`}).join("");total.textContent="Total: "+formatRupiah(cartTotal())}
function openProduct(id){const p=products[id];document.getElementById("productDetail").innerHTML=`<div class="detail-image">${p.icon}</div><span class="section-label">${p.type.toUpperCase()} ROBLOX</span><h2>${p.name}</h2><div class="price">${formatRupiah(p.price)}</div><p class="detail-desc">${p.description}</p><button class="modal-action" onclick="addCart(${id});closeModal('productModal')">🛒 Tambah ke Keranjang</button>`;document.getElementById("productModal").style.display="block"}
function openCheckout(){if(!cart.length){toast("Keranjang masih kosong.");return}closeModal("cartModal");document.getElementById("checkoutSummary").innerHTML=`<div class="notice">${cart.map(item=>`${products[item.id].name} × ${item.qty}`).join("<br>")}<br><b>Total: ${formatRupiah(cartTotal())}</b></div>`;document.getElementById("checkoutModal").style.display="block"}
function finishCheckout(){if(!cart.length){toast("Keranjang masih kosong.");return}const name=document.getElementById("buyerName").value.trim(),roblox=document.getElementById("robloxName").value.trim(),payment=document.querySelector('input[name="payment"]:checked');if(!name||!roblox){toast("Isi nama dan username Roblox terlebih dahulu.");return}if(!payment){toast("Pilih metode payment terlebih dahulu.");return}const orderList=cart.map(item=>{const p=products[item.id];return `• ${p.name} x${item.qty} = ${formatRupiah(p.price*item.qty)}`}).join("\n");const message=`Halo Admin VIN STORE 👋\n\nSaya ingin melakukan pembelian.\n\nNama: ${name}\nUsername Roblox: ${roblox}\n\nPesanan:\n${orderList}\n\nTotal: ${formatRupiah(cartTotal())}\nPayment: ${payment.value}\n\nMohon dibantu untuk proses pesanan dan pembayaran.`;
// GANTI NOMOR INI dengan nomor WhatsApp admin, format 628xxxxxxxxxx tanpa + atau spasi.
const adminNumber="6287790180781";
window.open("https://wa.me/"+adminNumber+"?text="+encodeURIComponent(message),"_blank");cart=[];saveCart();closeModal("checkoutModal")}
function closeModal(id){document.getElementById(id).style.display="none"}
function scrollToItems(){document.getElementById("items").scrollIntoView({behavior:"smooth"})}
function filterItems(type,btn){document.querySelectorAll(".categories button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".card").forEach(c=>{c.style.display=(type==="all"||c.dataset.type===type)?"block":"none"})}
function toggleMenu(){const nav=document.querySelector(".nav-links");if(getComputedStyle(nav).display==="none"){nav.style.display="flex";nav.style.position="absolute";nav.style.top="74px";nav.style.left="0";nav.style.right="0";nav.style.padding="18px";nav.style.background="#0b0c12";nav.style.borderBottom="1px solid #252936";nav.style.flexDirection="column";nav.style.gap="15px"}else nav.style.display=""}
function toast(text){let t=document.getElementById("vinToast");if(!t){t=document.createElement("div");t.id="vinToast";Object.assign(t.style,{position:"fixed",bottom:"22px",left:"50%",transform:"translateX(-50%)",background:"#171922",border:"1px solid #343846",color:"#fff",padding:"12px 16px",borderRadius:"11px",fontSize:"11px",fontWeight:"700",zIndex:"100",boxShadow:"0 15px 40px #0008"});document.body.appendChild(t)}t.textContent=text;t.style.opacity="1";clearTimeout(window.vinToastTimer);window.vinToastTimer=setTimeout(()=>t.style.opacity="0",1800)}
window.addEventListener("click",e=>document.querySelectorAll(".modal").forEach(m=>{if(e.target===m)m.style.display="none"}));
window.addEventListener("resize",()=>{if(innerWidth>800){const nav=document.querySelector(".nav-links");nav.style="";}});
updateCartCount();
