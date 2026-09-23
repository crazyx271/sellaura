(function (root) {
  const KEY = "aura.orders.v1";

  function list() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function add(order) {
    const next = list();
    next.unshift(order);
    localStorage.setItem(KEY, JSON.stringify(next.slice(0, 50)));
    return order;
  }

  root.AuraOrders = { list: list, add: add };
})(typeof globalThis !== "undefined" ? globalThis : this);
