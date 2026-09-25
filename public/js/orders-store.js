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

  function save(next) {
    localStorage.setItem(KEY, JSON.stringify(next.slice(0, 50)));
  }

  function add(order) {
    const next = list();
    next.unshift(order);
    save(next);
    return order;
  }

  function update(id, patch) {
    const next = list();
    const index = next.findIndex(function (order) { return order.id === id; });
    if (index === -1) return null;
    next[index] = Object.assign({}, next[index], patch);
    save(next);
    return next[index];
  }

  root.AuraOrders = { list: list, add: add, update: update };
})(typeof globalThis !== "undefined" ? globalThis : this);
