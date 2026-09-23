/**
 * Публичные настройки магазина.
 * Сюда можно вписать только адрес кошелька для приёма оплаты.
 * Секретную фразу, приватный ключ и seed сюда писать нельзя — файл отдаётся всем посетителям.
 *
 * Перед запуском оплаты заполните:
 * - payment.wallet — публичный адрес
 * - payment.asset и payment.network — монета и сеть, они должны совпадать с предупреждением
 * - payment.rubPerUnit — сколько рублей стоит 1 единица монеты (с вашей маржой)
 * - supportTelegram или supportEmail — куда покупатель отправит хеш транзакции
 * - legalName, inn, city — реквизиты для оферты
 * - siteUrl — домен с https, без слэша на конце
 */
window.AURA_CONFIG = {
  siteUrl: "",
  supportTelegram: "",
  supportEmail: "",
  legalName: "",
  inn: "",
  city: "",
  payment: {
    asset: "USDT",
    network: "TRC-20",
    wallet: "",
    rubPerUnit: 95,
    networkWarning: "Отправляйте только USDT в сети TRON (TRC-20). Перевод другой монетой или в другой сети не зачисляется и не возвращается автоматически."
  }
};
