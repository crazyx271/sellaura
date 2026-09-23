(function () {
  const pay = window.AuraPay;
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

  const ready = pay.paymentReady(config);
  let qty = 1;

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
  const warningEl = document.getElementById("co-warning");
  const walletEl = document.getElementById("co-wallet");
  const copyWalletBtn = document.getElementById("copy-wallet");
  const copyAmountBtn = document.getElementById("copy-amount");
  const banner = document.getElementById("pay-off");
  const payBox = document.getElementById("pay-box");
  const qtyValue = document.getElementById("qty-value");
  const form = document.getElementById("pay-form");
  const errorEl = document.getElementById("form-error");
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
  if (networkEl) networkEl.textContent = payment.network || "";
  if (rateEl) {
    rateEl.textContent = "Курс магазина: 1 " + (payment.asset || "USDT") + " = " + pay.formatRub(Number(payment.rubPerUnit) || 0) + ". Итог округляется вверх до 0,01.";
  }
  if (warningEl) warningEl.textContent = payment.networkWarning || "";

  function quote() {
    return pay.quoteCrypto(product.price * qty, payment.rubPerUnit);
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

  document.getElementById("qty-dec").addEventListener("click", function () {
    qty = Math.max(1, qty - 1);
    paintQty();
  });
  document.getElementById("qty-inc").addEventListener("click", function () {
    qty = Math.min(product.stock, qty + 1);
    paintQty();
  });
  paintQty();

  if (banner) banner.hidden = ready;
  if (payBox) payBox.hidden = !ready;
  if (submitBtn) submitBtn.disabled = !ready;

  if (ready && walletEl) walletEl.textContent = String(payment.wallet).trim();

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
      if (!ready) return;
      copyText(String(payment.wallet).trim(), copyWalletBtn);
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!ready) {
      showError("Оплата ещё не подключена.");
      return;
    }
    const contactRaw = document.getElementById("buyer-contact").value;
    const txRaw = document.getElementById("tx-hash").value.trim();
    if (!pay.isContact(contactRaw)) {
      showError("Укажите Telegram в формате @username или электронную почту.");
      return;
    }
    if (!pay.isTxHash(txRaw)) {
      showError("Хеш транзакции — это 32–128 латинских букв и цифр из кошелька, без пробелов.");
      return;
    }
    showError("");
    const amount = quote();
    const order = {
      id: pay.createOrderId(),
      productId: product.id,
      title: product.platformLabel + " · " + product.city + " · " + product.ageLabel,
      qty: qty,
      priceRub: product.price * qty,
      amountCrypto: pay.formatCrypto(amount),
      asset: payment.asset,
      network: payment.network,
      wallet: String(payment.wallet).trim(),
      contact: pay.normalizeContact(contactRaw),
      txHash: txRaw,
      createdAt: new Date().toISOString(),
      status: "awaiting_confirmation"
    };
    try {
      window.AuraOrders.add(order);
    } catch (error) {
      showError("Не удалось сохранить заказ в этом браузере. Разрешите локальное хранилище и попробуйте ещё раз.");
      return;
    }
    const proof = pay.proofText(order);
    form.hidden = true;
    successEl.hidden = false;
    document.getElementById("success-id").textContent = order.id;
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
    if (!tgName && !email && hint) {
      hint.hidden = false;
    }
    successEl.querySelector("h2").focus();
  });
})();
