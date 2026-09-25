(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.AURA_CATALOG = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const AGE_MIN = { "30d": 30, "1y": 365, "3y": 1095 };

  const products = [
    { id: "tg-msk-2019", platform: "tg", platformLabel: "Telegram", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2019 · 7 лет", ageDays: 2555, trust: 97, stock: 200, price: 4100, blurb: "Проверенный аккаунт · Москва" },
    { id: "tg-msk-2020", platform: "tg", platformLabel: "Telegram", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2020 · 6 лет", ageDays: 2190, trust: 96, stock: 250, price: 3600, blurb: "Проверенный аккаунт · Москва" },
    { id: "tg-msk-2021", platform: "tg", platformLabel: "Telegram", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2021 · 5 лет", ageDays: 1825, trust: 94, stock: 300, price: 3200, blurb: "Проверенный аккаунт · Москва" },
    { id: "tg-msk-2022", platform: "tg", platformLabel: "Telegram", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2022 · 4 года", ageDays: 1460, trust: 92, stock: 350, price: 2700, blurb: "Проверенный аккаунт · Москва" },
    { id: "tg-msk-2023", platform: "tg", platformLabel: "Telegram", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2023 · 3 года", ageDays: 1095, trust: 90, stock: 400, price: 2190, blurb: "Проверенный аккаунт · Москва" },
    { id: "max-msk-4m", platform: "max", platformLabel: "MAX", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "4 мес.", ageDays: 120, trust: 84, stock: 250, price: 1290, blurb: "Проверенный аккаунт · Москва" },
    { id: "max-msk-8m", platform: "max", platformLabel: "MAX", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "8 мес.", ageDays: 240, trust: 91, stock: 250, price: 1640, blurb: "Проверенный аккаунт · Москва" },
    { id: "max-msk-2y", platform: "max", platformLabel: "MAX", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2024 · 2 года", ageDays: 730, trust: 88, stock: 250, price: 2190, blurb: "Проверенный аккаунт · Москва" },
    { id: "max-msk-3y", platform: "max", platformLabel: "MAX", city: "Москва", country: "rf", countryLabel: "РФ", ageLabel: "2023 · 3 года", ageDays: 1095, trust: 93, stock: 250, price: 2780, blurb: "Проверенный аккаунт · Москва" }
  ];

  function getProduct(id) {
    return products.find(function (item) { return item.id === id; }) || null;
  }

  function matches(product, filters) {
    const platform = (filters && filters.platform) || "all";
    const country = (filters && filters.country) || "";
    const age = (filters && filters.age) || "";
    if (platform !== "all" && product.platform !== platform) return false;
    if (country && product.country !== country) return false;
    if (age) {
      const min = AGE_MIN[age];
      if (!min || product.ageDays < min) return false;
    }
    return true;
  }

  return {
    products: products,
    ageMin: AGE_MIN,
    getProduct: getProduct,
    matches: matches
  };
});
