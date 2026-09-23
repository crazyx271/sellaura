const test = require("node:test");
const assert = require("node:assert/strict");
const pay = require("../public/js/payment.js");

test("rounds crypto up to the next cent", () => {
  assert.equal(pay.quoteCrypto(2190, 95), 23.06);
  assert.equal(pay.quoteCrypto(4380, 95), 46.11);
  assert.equal(pay.quoteCrypto(100, 4), 25);
});

test("rejects a zero rate", () => {
  assert.throws(() => pay.quoteCrypto(100, 0));
});

test("checks wallet, contact and tx hash", () => {
  assert.equal(pay.isWallet("TXYZabcdefghijklmnopqrstuvwxyz123456"), true);
  assert.equal(pay.isWallet("short"), false);
  assert.equal(pay.isWallet("has space and still long enough!!"), false);
  assert.equal(pay.isContact("@aura_user"), true);
  assert.equal(pay.isContact("buyer@example.com"), true);
  assert.equal(pay.isContact("ab"), false);
  assert.equal(pay.isTxHash("a".repeat(64)), true);
  assert.equal(pay.isTxHash("too short"), false);
  assert.equal(pay.normalizeContact("aura_user"), "@aura_user");
});

test("payment stays closed until a real wallet is set", () => {
  assert.equal(pay.paymentReady({ payment: { wallet: "", asset: "USDT", network: "TRC-20", rubPerUnit: 95 } }), false);
  assert.equal(pay.paymentReady({
    payment: {
      wallet: "TXYZabcdefghijklmnopqrstuvwxyz123456",
      asset: "USDT",
      network: "TRC-20",
      rubPerUnit: 95
    }
  }), true);
});

test("builds a proof the seller can match", () => {
  const text = pay.proofText({
    id: "AURA-1",
    title: "Telegram · Москва · 2019 · 7 лет",
    qty: 1,
    amountCrypto: "23,06",
    asset: "USDT",
    network: "TRC-20",
    wallet: "TADDR",
    txHash: "abc",
    contact: "@buyer"
  });
  assert.match(text, /Заказ AURA-1/);
  assert.match(text, /23,06 USDT \(TRC-20\)/);
  assert.match(text, /Хеш: abc/);
});

test("order ids are prefixed", () => {
  assert.match(pay.createOrderId(new Date(0)), /^AURA-0-[A-Z0-9]+$/);
});
