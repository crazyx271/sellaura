(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.AuraPay = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function quoteCrypto(rubAmount, rubPerUnit) {
    const rub = Number(rubAmount);
    const rate = Number(rubPerUnit);
    if (!Number.isFinite(rub) || rub <= 0) {
      throw new Error("Сумма в рублях должна быть больше нуля");
    }
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Курс должен быть больше нуля");
    }
    return Math.ceil((rub / rate) * 100) / 100;
  }

  function formatRub(amount) {
    return new Intl.NumberFormat("ru-RU").format(amount) + "\u00A0₽";
  }

  function formatCrypto(amount) {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function createOrderId(date) {
    const d = date || new Date();
    const stamp = d.getTime().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "AURA-" + stamp + "-" + rand;
  }

  function isWallet(value) {
    const v = String(value || "").trim();
    if (v.length < 20 || v.length > 128) return false;
    if (/\s/.test(v)) return false;
    return /^[A-Za-z0-9:_+\/=.-]+$/.test(v);
  }

  function isContact(value) {
    const v = String(value || "").trim();
    if (/^@?[a-zA-Z][a-zA-Z0-9_]{3,31}$/.test(v)) return true;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
    return false;
  }

  function isTxHash(value) {
    const v = String(value || "").trim();
    return /^[A-Za-z0-9]{32,128}$/.test(v);
  }

  function normalizeContact(value) {
    const v = String(value || "").trim();
    if (v.includes("@") && v.includes(".")) return v;
    return v.startsWith("@") ? v : "@" + v;
  }

  function paymentReady(config) {
    const payment = (config && config.payment) || {};
    return Boolean(
      isWallet(payment.wallet) &&
      Number(payment.rubPerUnit) > 0 &&
      String(payment.asset || "").trim() &&
      String(payment.network || "").trim()
    );
  }

  function proofText(order) {
    return [
      "Заказ " + order.id,
      "Товар: " + order.title,
      "Количество: " + order.qty,
      "Сумма: " + order.amountCrypto + " " + order.asset + " (" + order.network + ")",
      "Адрес: " + order.wallet,
      "Хеш: " + order.txHash,
      "Контакт: " + order.contact
    ].join("\n");
  }

  return {
    quoteCrypto: quoteCrypto,
    formatRub: formatRub,
    formatCrypto: formatCrypto,
    createOrderId: createOrderId,
    isWallet: isWallet,
    isContact: isContact,
    isTxHash: isTxHash,
    normalizeContact: normalizeContact,
    paymentReady: paymentReady,
    proofText: proofText
  };
});
