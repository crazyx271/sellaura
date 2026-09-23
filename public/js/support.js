(function () {
  const config = window.AURA_CONFIG || {};
  const tgName = String(config.supportTelegram || "").replace(/^@/, "").trim();
  const email = String(config.supportEmail || "").trim();
  const tgLink = document.getElementById("support-tg");
  const mailLink = document.getElementById("support-mail");
  const form = document.getElementById("support-form");
  const errorEl = document.getElementById("support-error");
  const doneEl = document.getElementById("support-done");

  if (tgName && tgLink) {
    tgLink.hidden = false;
    tgLink.href = "https://t.me/" + encodeURIComponent(tgName);
  }
  if (email && mailLink) {
    mailLink.hidden = false;
    mailLink.href = "mailto:" + email;
  }

  function messageText() {
    const contact = document.getElementById("support-contact").value.trim();
    const text = document.getElementById("support-text").value.trim();
    return "Обращение в AURA\nКонтакт: " + contact + "\n\n" + text;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const contact = document.getElementById("support-contact").value.trim();
    const text = document.getElementById("support-text").value.trim();
    if (contact.length < 3 || text.length < 5) {
      errorEl.hidden = false;
      errorEl.textContent = "Напишите, как с вами связаться, и коротко опишите вопрос.";
      return;
    }
    errorEl.hidden = true;
    const body = messageText();
    try {
      await navigator.clipboard.writeText(body);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = body;
      area.style.position = "fixed";
      area.style.left = "-999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    doneEl.hidden = false;
    const openTg = document.getElementById("support-open-tg");
    const openMail = document.getElementById("support-open-mail");
    if (tgName && openTg) {
      openTg.hidden = false;
      openTg.href = "https://t.me/" + encodeURIComponent(tgName) + "?text=" + encodeURIComponent(body);
    }
    if (email && openMail) {
      openMail.hidden = false;
      openMail.href = "mailto:" + email + "?subject=" + encodeURIComponent("Поддержка AURA") + "&body=" + encodeURIComponent(body);
    }
    const fallback = document.getElementById("support-fallback");
    if (fallback) fallback.hidden = Boolean(tgName || email);
  });
})();
