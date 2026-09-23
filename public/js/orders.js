(function () {
  const listEl = document.getElementById("orders-list");
  const emptyEl = document.getElementById("orders-empty");
  const orders = window.AuraOrders.list();
  if (!orders.length) {
    emptyEl.hidden = false;
    listEl.hidden = true;
    return;
  }
  emptyEl.hidden = true;
  listEl.hidden = false;
  const statusLabel = {
    awaiting_confirmation: "Ожидает подтверждения"
  };
  orders.forEach(function (order) {
    const card = document.createElement("article");
    card.className = "glass p-6 flex flex-col gap-3";
    const title = document.createElement("h2");
    title.className = "text-xl font-semibold";
    title.textContent = order.title || "Заказ";
    const id = document.createElement("p");
    id.className = "meta text-text-3";
    id.textContent = order.id || "";
    const amount = document.createElement("p");
    amount.className = "text-lg font-semibold";
    amount.textContent = (order.amountCrypto || "") + " " + (order.asset || "");
    const status = document.createElement("p");
    status.className = "text-text-2";
    status.textContent = statusLabel[order.status] || "Принят";
    const meta = document.createElement("p");
    meta.className = "text-sm text-text-2";
    const when = order.createdAt ? new Date(order.createdAt) : null;
    const whenText = when && !Number.isNaN(when.getTime())
      ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(when)
      : "";
    meta.textContent = [whenText, order.network, order.contact].filter(Boolean).join(" · ");
    const hash = document.createElement("p");
    hash.className = "text-sm text-text-3 break-all";
    hash.textContent = order.txHash ? "Хеш: " + order.txHash : "";
    card.append(title, id, amount, status, meta, hash);
    listEl.appendChild(card);
  });
})();
