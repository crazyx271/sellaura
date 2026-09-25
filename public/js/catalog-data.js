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
    {
      id: "tg-msk-2019",
      platform: "tg",
      platformLabel: "Telegram",
      city: "Москва",
      country: "rf",
      countryLabel: "РФ",
      ageLabel: "2019 · 7 лет",
      ageDays: 2555,
      trust: 97,
      stock: 1500,
      price: 2190,
      blurb: "Проверенный аккаунт · РФ"
    },
    {
      id: "max-ala-8m",
      platform: "max",
      platformLabel: "MAX",
      city: "Алматы",
      country: "kz",
      countryLabel: "КЗ",
      ageLabel: "8 мес.",
      ageDays: 240,
      trust: 91,
      stock: 1000,
      price: 1640,
      blurb: "Проверенный аккаунт · КЗ"
    },
    {
      id: "tg-spb-2021",
      platform: "tg",
      platformLabel: "Telegram",
      city: "СПб",
      country: "rf",
      countryLabel: "РФ",
      ageLabel: "2021 · 5 лет",
      ageDays: 1825,
      trust: 94,
      stock: 1500,
      price: 3200,
      blurb: "Проверенный аккаунт · РФ"
    },
    {
      id: "max-msk-2024",
      platform: "max",
      platformLabel: "MAX",
      city: "Москва",
      country: "rf",
      countryLabel: "РФ",
      ageLabel: "2024 · 2 года",
      ageDays: 730,
      trust: 88,
      stock: 1000,
      price: 2780,
      blurb: "Проверенный аккаунт · РФ"
    },
    {
      id: "tg-eu-2020",
      platform: "tg",
      platformLabel: "Telegram",
      city: "EU",
      country: "eu",
      countryLabel: "EU",
      ageLabel: "2020 · 6 лет",
      ageDays: 2190,
      trust: 96,
      stock: 1500,
      price: 4100,
      blurb: "Проверенный аккаунт · EU"
    },
    {
      id: "max-kzn-4m",
      platform: "max",
      platformLabel: "MAX",
      city: "Казань",
      country: "rf",
      countryLabel: "РФ",
      ageLabel: "4 мес.",
      ageDays: 120,
      trust: 84,
      stock: 1000,
      price: 1290,
      blurb: "Проверенный аккаунт · РФ"
    }
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
