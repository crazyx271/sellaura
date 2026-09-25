(function () {
  const config = window.AURA_CONFIG || {};
  const box = document.getElementById("seller-details");
  if (!box) return;
  const lines = [];
  if (config.legalName) lines.push(String(config.legalName));
  if (config.inn) lines.push("ИНН " + String(config.inn));
  if (config.city) lines.push(String(config.city));
  if (config.supportEmail) lines.push(String(config.supportEmail));
  if (config.supportTelegram) {
    const name = String(config.supportTelegram).replace(/^@/, "");
    lines.push("Telegram @" + name);
  }
  box.textContent = lines.length
    ? lines.join(" · ")
    : "Реквизиты продавца и контакт поддержки публикуются на этой странице до начала приёма платежей.";
})();
