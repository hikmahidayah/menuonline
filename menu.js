const menuData = [
    {
      id: 1,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan bumbu rahasia dan topping telur, ayam suwir, serta kerupuk.",
      price: 25000,
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Mie Ayam Juara",
      description: "Mie ayam lengkap dengan bakso, pangsit, dan kuah kaldu gurih.",
      price: 22000,
      image: "https://images.unsplash.com/photo-1590080877777-00584b99b690?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Sate Ayam Madura",
      description: "Sate ayam dengan bumbu kacang spesial dan lontong.",
      price: 30000,
      image: "https://images.unsplash.com/photo-1592023214945-3a7ab032d348?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      name: "Gado-Gado Segar",
      description: "Campuran sayur segar dengan bumbu kacang khas dan kerupuk.",
      price: 20000,
      image: "https://images.unsplash.com/photo-1606857521545-a0f5a88a9f7c?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      name: "Es Teh Manis",
      description: "Es teh manis segar dengan aroma melati alami.",
      price: 7000,
      image: "https://images.unsplash.com/photo-1562059390-a761a0847684?auto=format&fit=crop&w=500&q=60"
    }
  ];

  const menuContainer = document.querySelector('.menu');
  const cartList = document.querySelector('.cart-list');
  const totalPriceEl = document.getElementById('totalPrice');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  // Cart data: id -> quantity
  let cart = {};

  function formatPrice(num) {
    return 'Rp' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function renderMenu() {
    menuContainer.innerHTML = '';
    menuData.forEach(item => {
      const itemEl = document.createElement('article');
      itemEl.className = 'menu-item';
      itemEl.setAttribute('tabindex', '0');
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <div class="menu-content">
          <h3 class="menu-title">${item.name}</h3>
          <p class="menu-desc">${item.description}</p>
          <div class="menu-price">${formatPrice(item.price)}</div>
          <div class="quantity-control" aria-label="Kontrol kuantitas ${item.name}">
            <button aria-label="Kurangi ${item.name}" class="qty-minus">−</button>
            <span aria-live="polite" aria-atomic="true" class="qty-number">0</span>
            <button aria-label="Tambah ${item.name}" class="qty-plus">+</button>
          </div>
        </div>
      `;
      // Event listeners for quantity buttons
      itemEl.querySelector('.qty-minus').addEventListener('click', () => {
        updateCart(item.id, (cart[item.id] || 0) - 1);
      });
      itemEl.querySelector('.qty-plus').addEventListener('click', () => {
        updateCart(item.id, (cart[item.id] || 0) + 1);
      });
      menuContainer.appendChild(itemEl);
    });
  }

  function updateCart(itemId, qty) {
    if (qty < 0) qty = 0;
    if (qty === 0) {
      delete cart[itemId];
    } else {
      cart[itemId] = qty;
    }
    updateUI();
  }

  function updateUI() {
    // Update quantities in menu
    menuData.forEach(item => {
      const itemEl = [...menuContainer.children].find(el => {
        return el.querySelector('.menu-title').textContent === item.name;
      });
      if (itemEl) {
        const qtySpan = itemEl.querySelector('.qty-number');
        qtySpan.textContent = cart[item.id] || 0;
      }
    });
    // Update cart list
    cartList.innerHTML = '';
    const cartIds = Object.keys(cart);
    if (cartIds.length === 0) {
      cartList.innerHTML = '<p>Belum ada item di keranjang.</p>';
      placeOrderBtn.disabled = true;
      totalPriceEl.textContent = formatPrice(0);
      return;
    }
    let total = 0;
    cartIds.forEach(id => {
      const menuItem = menuData.find(i => i.id === parseInt(id));
      const qty = cart[id];
      const subTotal = qty * menuItem.price;
      total += subTotal;
      const cartItemEl = document.createElement('div');
      cartItemEl.className = 'cart-item';
      cartItemEl.innerHTML = `
        <span class="cart-item-name">${menuItem.name}</span>
        <span class="cart-item-qty">x${qty}</span>
        <span class="cart-item-price">${formatPrice(subTotal)}</span>
      `;
      cartList.appendChild(cartItemEl);
    });
    totalPriceEl.textContent = formatPrice(total);
    placeOrderBtn.disabled = false;
  }

  function placeOrder() {
    if (Object.keys(cart).length === 0) {
      alert('Keranjang kosong. Silakan pilih menu terlebih dahulu.');
      return;
    }
    let orderSummary = "Terima kasih atas pesanan Anda!\n\nDetail Pesanan:\n";
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const menuItem = menuData.find(i => i.id === parseInt(id));
      const subTotal = qty * menuItem.price;
      total += subTotal;
      orderSummary += `- ${menuItem.name} x${qty} = ${formatPrice(subTotal)}\n`;
    });
    orderSummary += `\nTotal: ${formatPrice(total)}\n\nPesanan Anda akan segera kami proses.`;
    alert(orderSummary);
    // Clear cart after placing order
    cart = {};
    updateUI();
  }

  placeOrderBtn.addEventListener('click', placeOrder);

  renderMenu();
  updateUI();