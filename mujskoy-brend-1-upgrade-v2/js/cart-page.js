(async function () {
  const root = document.getElementById('cart-root');
  if (!root) return;
  if (!window.MBHelpers) {
    const s = document.createElement("script");
    s.src = "js/helpers.js";
    document.body.appendChild(s);
    await new Promise((r) => (s.onload = r));
  }
  const cart = MBStore.getCart();
  if (!cart.length) {
    root.innerHTML = `
      <div class="market-empty-state">
        <div class="market-empty-icon"><i class="fa fa-shopping-bag"></i></div>
        <h3>Savat hozircha bo'sh</h3>
        <p>Yoqtirgan mahsulotingizni katalogdan tanlang va savatga qo'shing.</p>
        <a href="shop.html" class="market-btn"><i class="fa fa-th-large"></i> Katalogga o'tish</a>
      </div>`;
    return;
  }
  const products = await MBHelpers.loadProducts({ forceRefresh: true });
  const enriched = cart.map((item, index) => ({
    ...item,
    index,
    product: products.find((p) => String(p.id) === String(item.productId)) || item.product || {},
  }));
  const total = enriched.reduce((sum, item) => sum + (Number(item.product.price) || 0) * item.qty, 0);
  const delivery = total > 300000 ? 0 : 25000;
  const grandTotal = total + delivery;
  root.innerHTML = `
    <div class="market-cart-layout">
      <div class="market-cart-list">
        <div class="market-cart-head">
          <div><h3>Savatdagi mahsulotlar</h3><p>${enriched.length} xil mahsulot tanlandi</p></div>
          <a href="shop.html" class="market-mini-link"><i class="fa fa-plus"></i> Yana mahsulot qo'shish</a>
        </div>
        ${enriched.map(item => {
          const img = item.product.image || (item.product.images && item.product.images[0]) || 'img/placeholders/product.svg';
          const price = Number(item.product.price || 0);
          return `
          <div class="market-cart-card">
            <div class="market-cart-img"><img src="${img}" alt=""></div>
            <div class="market-cart-info">
              <div class="market-cart-title-row">
                <div><h4>${item.product.name || 'Mahsulot'}</h4><p>${item.size || "O'lcham tanlanmagan"} / ${item.color || 'Rang tanlanmagan'}</p></div>
                <div class="market-cart-price"><strong>${price.toLocaleString('uz-UZ')} so'm</strong><span>Jami: ${(price * item.qty).toLocaleString('uz-UZ')} so'm</span></div>
              </div>
              <div class="market-cart-controls">
                <label>Miqdor</label>
                <button type="button" class="cart-qty-btn" data-index="${item.index}" data-delta="-1">-</button>
                <input type="number" min="1" value="${item.qty}" data-index="${item.index}" class="cart-qty-input">
                <button type="button" class="cart-qty-btn" data-index="${item.index}" data-delta="1">+</button>
                <a href="#" class="market-remove cart-remove" data-index="${item.index}"><i class="fa fa-trash"></i> O'chirish</a>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <aside class="market-order-summary">
        <div class="summary-badge"><i class="fa fa-shield"></i> Xavfsiz buyurtma</div>
        <h3>Buyurtma xulosasi</h3>
        <div class="summary-line"><span>Mahsulotlar</span><strong>${total.toLocaleString('uz-UZ')} so'm</strong></div>
        <div class="summary-line"><span>Yetkazib berish</span><strong>${delivery ? delivery.toLocaleString('uz-UZ') + " so'm" : "Bepul"}</strong></div>
        <div class="summary-divider"></div>
        <div class="summary-total"><span>Umumiy summa</span><strong>${grandTotal.toLocaleString('uz-UZ')} so'm</strong></div>
        <a href="checkout.html" class="market-btn market-btn--full"><i class="fa fa-credit-card"></i> Buyurtmaga o'tish</a>
        <p class="summary-note">300 000 so'mdan yuqori xaridlar uchun yetkazish bepul.</p>
      </aside>
    </div>`;

  document.querySelectorAll('.cart-qty-input').forEach(input => input.addEventListener('change', function () {
    MBStore.updateQty(Number(this.dataset.index), Number(this.value));
    location.reload();
  }));
  document.querySelectorAll('.cart-qty-btn').forEach(btn => btn.addEventListener('click', function () {
    const index = Number(this.dataset.index);
    const delta = Number(this.dataset.delta);
    const item = MBStore.getCart()[index];
    if (!item) return;
    MBStore.updateQty(index, Math.max(1, Number(item.qty || 1) + delta));
    location.reload();
  }));
  document.querySelectorAll('.cart-remove').forEach(link => link.addEventListener('click', function (e) {
    e.preventDefault();
    MBStore.removeFromCart(Number(this.dataset.index));
    location.reload();
  }));
})();
