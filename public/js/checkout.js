(function () {
  const pay = window.AuraPay;
  const chain = window.AuraChain;
  const catalog = window.AURA_CATALOG;
  const config = window.AURA_CONFIG || {};
  const payment = config.payment || {};
  const params = new URLSearchParams(location.search);
  const product = catalog.getProduct(params.get("id"));
  const missing = document.getElementById("checkout-missing");
  const panel = document.getElementById("checkout-panel");

  if (!product) {
    if (missing) missing.hidden = false;
    if (panel) panel.hidden = true;
    return;
  }

  if (missing) missing.hidden = true;
  if (panel) panel.hidden = false;

  const methods = pay.paymentMethods(config);
  const ready = methods.length > 0;
  let qty = 1;
  let method = methods[0] || null;

  const platformEl = document.getElementById("co-platform");
  const cityEl = document.getElementById("co-city");
  const ageEl = document.getElementById("co-age");
  const blurbEl = document.getElementById("co-blurb");
  const trustEl = document.getElementById("co-trust");
  const stockEl = document.getElementById("co-stock");
  const unitEl = document.getElementById("co-unit");
  const totalRubEl = document.getElementById("co-total-rub");
  const totalCryptoEl = document.getElementById("co-total-crypto");
  const assetNodes = document.querySelectorAll("[data-asset]");
  const networkEl = document.getElementById("co-network");
  const rateEl = document.getElementById("co-rate");
  const walletEl = document.getElementById("co-wallet");
  const copyWalletBtn = document.getElementById("copy-wallet");
  const copyAmountBtn = document.getElementById("copy-amount");
  const banner = document.getElementById("pay-off");
  const payBox = document.getElementById("pay-box");
  const methodsEl = document.getElementById("pay-methods");
  const qtyValue = document.getElementById("qty-value");
  const form = document.getElementById("pay-form");
  const errorEl = document.getElementById("form-error");
  const checkEl = document.getElementById("pay-check");
  const successEl = document.getElementById("pay-success");
  const submitBtn = document.getElementById("pay-submit");

  platformEl.textContent = product.platformLabel;
  platformEl.classList.add(product.platform === "tg" ? "text-tg" : "text-max");
  cityEl.textContent = product.city;
  ageEl.textContent = product.ageLabel;
  blurbEl.textContent = product.blurb;
  trustEl.textContent = product.trust + "%";
  if (product.trust >= 90) trustEl.classList.add("text-ok");
  stockEl.textContent = product.stock + " шт.";
  if (product.stock <= 4) stockEl.classList.add("text-warn");
  if (product.stock >= 20) stockEl.classList.add("text-ok");
  unitEl.textContent = pay.formatRub(product.price);

  assetNodes.forEach(function (node) {
    node.textContent = payment.asset || "USDT";
  });
  if (rateEl) {
    rateEl.textContent = "Курс магазина: 1 USDT = " + pay.formatRub(Number(payment.rubPerUnit) || 0) + ". Итог округляется вверх до 0,01.";
  }

  function quote() {
    return pay.quoteCrypto(product.price * qty, payment.rubPerUnit);
  }

  function paintMethod() {
    if (!method) return;
    if (networkEl) networkEl.textContent = method.network;
    if (walletEl) walletEl.textContent = method.wallet;
    methodsEl.querySelectorAll("button").forEach(function (button) {
      const on = button.dataset.method === method.id;
      button.classList.toggle("chip-active", on);
      button.setAttribute("aria-checked", String(on));
    });
  }

  function paintQty() {
    qtyValue.textContent = String(qty);
    totalRubEl.textContent = pay.formatRub(product.price * qty);
    try {
      totalCryptoEl.textContent = pay.formatCrypto(quote());
    } catch (error) {
      totalCryptoEl.textContent = "—";
    }
    document.getElementById("qty-dec").disabled = qty <= 1;
    document.getElementById("qty-inc").disabled = qty >= product.stock;
  }

  methods.forEach(function (item) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.method = item.id;
    button.setAttribute("role", "radio");
    button.textContent = item.label;
    button.addEventListener("click", function () {
      method = item;
      paintMethod();
    });
    methodsEl.appendChild(button);
  });

  document.getElementById("qty-dec").addEventListener("click", function () {
    qty = Math.max(1, qty - 1);
    paintQty();
  });
  document.getElementById("qty-inc").addEventListener("click", function () {
    qty = Math.min(product.stock, qty + 1);
    paintQty();
  });
  paintQty();
  paintMethod();

  if (banner) banner.hidden = ready;
  if (payBox) payBox.hidden = !ready;
  if (submitBtn) submitBtn.disabled = !ready;

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    if (!button) return;
    const previous = button.textContent;
    button.textContent = "Скопировано";
    setTimeout(function () { button.textContent = previous; }, 1600);
  }

  if (copyWalletBtn) {
    copyWalletBtn.addEventListener("click", function () {
      if (!method) return;
      copyText(method.wallet, copyWalletBtn);
    });
  }
  if (copyAmountBtn) {
    copyAmountBtn.addEventListener("click", function () {
      const amount = totalCryptoEl.textContent.replace(/\s/g, "").replace(",", ".");
      copyText(amount, copyAmountBtn);
    });
  }

  function showError(message) {
    errorEl.hidden = !message;
    errorEl.textContent = message || "";
  }

  function usedHashes() {
    return window.AuraOrders.list().map(function (order) { return order.txHash; }).filter(Boolean);
  }

  function showSuccess(order) {
    const found = order.status === "paid_seen";
    form.hidden = true;
    if (checkEl) checkEl.hidden = true;
    successEl.hidden = false;
    document.getElementById("success-id").textContent = order.id;
    document.getElementById("success-status").textContent = found
      ? "Перевод найден в сети " + order.network + ". Доступ отправим на контакт из заказа."
      : "Перевод пока не найден. Если транзакция только что ушла, подождите подтверждения сети и проверьте заказ ещё раз.";
    const proof = pay.proofText(order);
    document.getElementById("success-proof").textContent = proof;
    const copyProof = document.getElementById("copy-proof");
    copyProof.addEventListener("click", function () {
      copyText(proof, copyProof);
    });
    const tgName = String(config.supportTelegram || "").replace(/^@/, "").trim();
    const email = String(config.supportEmail || "").trim();
    const tgLink = document.getElementById("success-tg");
    const mailLink = document.getElementById("success-mail");
    if (tgName && tgLink) {
      tgLink.hidden = false;
      tgLink.href = "https://t.me/" + encodeURIComponent(tgName) + "?text=" + encodeURIComponent(proof);
    }
    if (email && mailLink) {
      mailLink.hidden = false;
      mailLink.href = "mailto:" + email + "?subject=" + encodeURIComponent("Заказ " + order.id) + "&body=" + encodeURIComponent(proof);
    }
    const hint = document.getElementById("success-hint");
    if (!tgName && !email && hint) hint.hidden = false;
    successEl.querySelector("h2").focus();
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!ready || !method) {
      showError("Оплата ещё не подключена.");
      return;
    }
    const contactRaw = document.getElementById("buyer-contact").value;
    if (!pay.isContact(contactRaw)) {
      showError("Укажите Telegram в формате @username или электронную почту.");
      return;
    }
    showError("");
    submitBtn.disabled = true;
    if (checkEl) {
      checkEl.hidden = false;
      checkEl.textContent = "Проверяем входящий USDT в сети " + method.network + ".";
    }
    const amount = quote();
    let found = null;
    try {
      found = await chain.findIncoming(method, amount, usedHashes());
    } catch (error) {
      found = null;
      if (checkEl) {
        checkEl.textContent = "Сеть сейчас не ответила. Заказ сохранён, проверку можно повторить из раздела «Заказы».";
      }
    }
    const order = {
      id: pay.createOrderId(),
      productId: product.id,
      title: product.platformLabel + " · " + product.city + " · " + product.ageLabel,
      qty: qty,
      priceRub: product.price * qty,
      amountCrypto: pay.formatCrypto(amount),
      asset: method.asset,
      network: method.network,
      wallet: method.wallet,
      kind: method.kind,
      contact: pay.normalizeContact(contactRaw),
      txHash: found ? found.txHash : "",
      createdAt: new Date().toISOString(),
      status: found ? "paid_seen" : "checking"
    };
    try {
      window.AuraOrders.add(order);
    } catch (error) {
      showError("Не удалось сохранить заказ в этом браузере. Разрешите локальное хранилище и попробуйте ещё раз.");
      submitBtn.disabled = false;
      return;
    }
    showSuccess(order);
  });
})();
