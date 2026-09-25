/**
 * Публичные настройки магазина.
 * Секретную фразу, приватный ключ и seed сюда писать нельзя — файл отдаётся всем посетителям.
 */
(typeof globalThis !== "undefined" ? globalThis : window).AURA_CONFIG = {
  siteUrl: "",
  supportTelegram: "",
  supportEmail: "",
  legalName: "",
  inn: "",
  city: "",
  payment: {
    asset: "USDT",
    rubPerUnit: 95,
    methods: [
      {
        id: "trc20",
        label: "TRC-20",
        network: "TRC-20",
        asset: "USDT",
        wallet: "TSDPFRPtMKBXfR3k7LRkE5WqQwYnDSXVRg",
        kind: "trc20"
      },
      {
        id: "bsc",
        label: "BSC",
        network: "BSC",
        asset: "USDT",
        wallet: "0xfbddcbb8cc04e5ef34b76b2bf0ff50aefa64de6b",
        kind: "bsc"
      },
      {
        id: "ton",
        label: "TON",
        network: "TON",
        asset: "USDT",
        wallet: "UQCzDVl6bA4ZGRMuVMs4_0Jl9pIc_UpCHYwwbVPluNlTbRdf",
        kind: "ton"
      },
      {
        id: "sol",
        label: "SOL",
        network: "Solana",
        asset: "USDT",
        wallet: "GzRW56R9KG3teC6uHTbx6r62uX8d5bMDdTFiXr1qPn4i",
        kind: "sol"
      }
    ]
  }
};
