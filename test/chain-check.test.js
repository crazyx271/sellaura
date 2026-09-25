const test = require("node:test");
const assert = require("node:assert/strict");
const chain = require("../public/js/chain-check.js");

const TRON = "TSDPFRPtMKBXfR3k7LRkE5WqQwYnDSXVRg";
const BSC = "0xfbddcbb8cc04e5ef34b76b2bf0ff50aefa64de6b";
const TON = "UQCzDVl6bA4ZGRMuVMs4_0Jl9pIc_UpCHYwwbVPluNlTbRdf";

test("matches an incoming TRC-20 USDT transfer of the quoted amount", () => {
  const expected = chain.unitsOf(15.79, "trc20");
  const found = chain.parseTron({
    data: [
      {
        transaction_id: "a".repeat(64),
        to: TRON,
        value: expected.toString(),
        block_timestamp: 10,
        token_info: { address: chain.USDT.trc20, symbol: "USDT" }
      },
      {
        transaction_id: "b".repeat(64),
        to: TRON,
        value: "1",
        block_timestamp: 20,
        token_info: { address: chain.USDT.trc20, symbol: "USDT" }
      }
    ]
  }, TRON, expected);
  assert.equal(found.length, 1);
  assert.equal(found[0].txHash, "a".repeat(64));
});

test("matches a BSC transfer log to the shop address", () => {
  const expected = chain.unitsOf(10.53, "bsc");
  const topic = "0x" + BSC.slice(2).padStart(64, "0");
  const found = chain.parseBsc([{
    transactionHash: "0x" + "c".repeat(64),
    topics: ["0xdd", "0x" + "1".repeat(64), topic],
    data: "0x" + expected.toString(16),
    blockNumber: "0x10"
  }], BSC, expected);
  assert.equal(found.length, 1);
});

test("matches a TON jetton transfer to the same raw address", () => {
  const expected = chain.unitsOf(10.53, "ton");
  const raw = chain.tonRaw(TON);
  assert.match(raw, /^0:[0-9a-f]{64}$/);
  const found = chain.parseTon({
    events: [{
      event_id: "ton-tx",
      timestamp: 100,
      actions: [{
        type: "JettonTransfer",
        JettonTransfer: {
          amount: expected.toString(),
          recipient: { address: raw },
          jetton: { address: chain.USDT.ton }
        }
      }]
    }]
  }, TON, expected);
  assert.equal(found.length, 1);
  assert.equal(found[0].txHash, "ton-tx");
});

test("matches a Solana USDT transfer into the token account", () => {
  const expected = chain.unitsOf(15.79, "sol");
  const found = chain.parseSol([{
    blockTime: 50,
    transaction: { signatures: ["solhash"] },
    meta: { innerInstructions: [] },
    transactionMessage: null
  }], "token-account", expected);
  const withInstruction = chain.parseSol([{
    blockTime: 50,
    transaction: {
      signatures: ["solhash"],
      message: {
        instructions: [{
          parsed: {
            type: "transferChecked",
            info: {
              destination: "token-account",
              mint: chain.USDT.sol,
              tokenAmount: { amount: expected.toString() }
            }
          }
        }]
      }
    }
  }], "token-account", expected);
  assert.equal(found.length, 0);
  assert.equal(withInstruction[0].txHash, "solhash");
});
