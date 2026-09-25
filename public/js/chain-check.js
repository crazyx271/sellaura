(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.AuraChain = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const USDT = {
    trc20: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    bsc: "0x55d398326f99059ff775485246999027b3197955",
    ton: "0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe",
    sol: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
  };
  const DECIMALS = { trc20: 6, bsc: 18, ton: 6, sol: 6 };
  const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  function unitsOf(amount, kind) {
    const places = DECIMALS[kind];
    const text = Number(amount).toFixed(2);
    const parts = text.split(".");
    const frac = (parts[1] + "0".repeat(places)).slice(0, places);
    return BigInt(parts[0] + frac);
  }

  function sameAmount(value, expected) {
    try {
      return BigInt(value) === BigInt(expected);
    } catch (error) {
      return false;
    }
  }

  function tonRaw(address) {
    const text = String(address || "").trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = text + "===".slice((text.length + 3) % 4);
    const bytes = typeof Buffer !== "undefined"
      ? Buffer.from(pad, "base64")
      : Uint8Array.from(atob(pad), function (char) { return char.charCodeAt(0); });
    if (bytes.length < 34) return "";
    const hash = Array.prototype.slice.call(bytes, 2, 34);
    return "0:" + hash.map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }

  function pickFresh(list, used) {
    const free = list.filter(function (item) {
      return used.indexOf(item.txHash) === -1;
    });
    free.sort(function (a, b) { return b.time - a.time; });
    return free[0] || null;
  }

  function parseTron(body, wallet, expected) {
    const rows = (body && body.data) || [];
    return rows.filter(function (row) {
      return String(row.to || "") === wallet &&
        row.token_info &&
        row.token_info.address === USDT.trc20 &&
        sameAmount(row.value, expected);
    }).map(function (row) {
      return { txHash: row.transaction_id, time: Number(row.block_timestamp) || 0 };
    });
  }

  function parseBsc(logs, wallet, expected) {
    const target = "0x" + wallet.toLowerCase().replace(/^0x/, "").padStart(64, "0");
    return (logs || []).filter(function (log) {
      const topics = log.topics || [];
      return String(topics[2] || "").toLowerCase() === target && sameAmount(log.data, expected);
    }).map(function (log) {
      return { txHash: log.transactionHash, time: Number(log.blockNumber) || 0 };
    });
  }

  function parseTon(body, wallet, expected) {
    const mine = tonRaw(wallet);
    const events = (body && body.events) || [];
    const found = [];
    events.forEach(function (event) {
      (event.actions || []).forEach(function (action) {
        if (action.type !== "JettonTransfer" || !action.JettonTransfer) return;
        const transfer = action.JettonTransfer;
        const jetton = transfer.jetton || {};
        const recipient = (transfer.recipient && transfer.recipient.address) || "";
        const master = String(jetton.address || "");
        if (recipient !== mine && tonRaw(recipient) !== mine) return;
        if (master !== USDT.ton && tonRaw(master) !== USDT.ton) return;
        if (!sameAmount(transfer.amount, expected)) return;
        found.push({
          txHash: event.event_id || (event.base_transactions && event.base_transactions[0]) || "",
          time: Number(event.timestamp || 0) * 1000
        });
      });
    });
    return found;
  }

  function parseSol(transactions, tokenAccount, expected) {
    const found = [];
    (transactions || []).forEach(function (tx) {
      const hash = tx.transaction && tx.transaction.signatures ? tx.transaction.signatures[0] : "";
      const instructions = [];
      const message = tx.transaction && tx.transaction.message;
      (message && message.instructions || []).forEach(function (item) { instructions.push(item); });
      ((tx.meta && tx.meta.innerInstructions) || []).forEach(function (inner) {
        (inner.instructions || []).forEach(function (item) { instructions.push(item); });
      });
      instructions.forEach(function (item) {
        const info = item.parsed && item.parsed.info;
        const type = item.parsed && item.parsed.type;
        if (!info || (type !== "transfer" && type !== "transferChecked")) return;
        if (info.destination !== tokenAccount) return;
        if (info.mint && info.mint !== USDT.sol) return;
        const amount = (info.tokenAmount && info.tokenAmount.amount) || info.amount;
        if (!sameAmount(amount, expected)) return;
        found.push({ txHash: hash, time: Number(tx.blockTime || 0) * 1000 });
      });
    });
    return found;
  }

  async function fetchJson(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Сеть ответила " + response.status);
    return response.json();
  }

  async function findIncoming(method, amount, used, fetchImpl) {
    const request = fetchImpl || fetchJson;
    const expected = unitsOf(amount, method.kind);
    const wallet = String(method.wallet).trim();
    let matches = [];
    if (method.kind === "trc20") {
      const url = "https://api.trongrid.io/v1/accounts/" + wallet +
        "/transactions/trc20?limit=30&only_to=true&contract_address=" + USDT.trc20;
      matches = parseTron(await request(url), wallet, expected);
    } else if (method.kind === "bsc") {
      const head = await request("https://1rpc.io/bnb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] })
      });
      const latest = parseInt(head.result, 16);
      const topic = "0x" + wallet.toLowerCase().replace(/^0x/, "").padStart(64, "0");
      const logs = await request("https://1rpc.io/bnb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getLogs",
          params: [{
            address: USDT.bsc,
            fromBlock: "0x" + Math.max(0, latest - 2000).toString(16),
            toBlock: "0x" + latest.toString(16),
            topics: [TRANSFER_TOPIC, null, topic]
          }]
        })
      });
      matches = parseBsc(logs.result || [], wallet, expected);
    } else if (method.kind === "ton") {
      const url = "https://tonapi.io/v2/accounts/" + encodeURIComponent(wallet) + "/events?limit=30";
      matches = parseTon(await request(url), wallet, expected);
    } else if (method.kind === "sol") {
      const owner = await request("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [wallet, { mint: USDT.sol }, { encoding: "jsonParsed" }]
        })
      });
      const accounts = ((owner.result && owner.result.value) || []).map(function (item) { return item.pubkey; });
      const transactions = [];
      for (let i = 0; i < accounts.length; i += 1) {
        const signatures = await request("https://api.mainnet-beta.solana.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getSignaturesForAddress",
            params: [accounts[i], { limit: 15 }]
          })
        });
        const rows = signatures.result || [];
        for (let j = 0; j < rows.length; j += 1) {
          const tx = await request("https://api.mainnet-beta.solana.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getTransaction",
              params: [rows[j].signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }]
            })
          });
          if (tx.result) transactions.push(tx.result);
        }
        matches = matches.concat(parseSol(transactions, accounts[i], expected));
      }
    } else {
      throw new Error("Эта сеть не проверяется автоматически");
    }
    return pickFresh(matches, used || []);
  }

  return {
    USDT: USDT,
    DECIMALS: DECIMALS,
    unitsOf: unitsOf,
    tonRaw: tonRaw,
    parseTron: parseTron,
    parseBsc: parseBsc,
    parseTon: parseTon,
    parseSol: parseSol,
    findIncoming: findIncoming
  };
});
