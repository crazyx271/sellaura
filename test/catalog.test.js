const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const catalog = require("../public/js/catalog-data.js");

test("catalog matches filters", () => {
  const { products, matches } = catalog;
  const stock = (platform) => products.filter((item) => item.platform === platform).reduce((sum, item) => sum + item.stock, 0);
  assert.equal(stock("tg"), 1500);
  assert.equal(stock("max"), 1000);
  assert.equal(products.every((item) => item.city === "Москва"), true);
  assert.equal(products.filter((item) => matches(item, { platform: "tg" })).length, 5);
  assert.equal(products.filter((item) => matches(item, { platform: "max" })).length, 4);
  assert.equal(products.filter((item) => matches(item, { country: "uz" })).length, 0);
  assert.equal(products.filter((item) => matches(item, { country: "rf" })).length, 9);
  const young = products.find((item) => item.id === "max-msk-4m");
  assert.equal(matches(young, { age: "30d" }), true);
  assert.equal(matches(young, { age: "1y" }), false);
});

test("homepage cards stay in sync with the catalog", () => {
  const html = fs.readFileSync("public/index.html", "utf8");
  const tags = html.match(/<article\b[^>]*data-product[^>]*>/g) || [];
  assert.equal(tags.length, catalog.products.length);
  const byId = new Map(catalog.products.map((item) => [item.id, item]));
  for (const tag of tags) {
    const id = attr(tag, "data-id");
    const product = byId.get(id);
    assert.ok(product, id);
    assert.equal(attr(tag, "data-platform"), product.platform);
    assert.equal(attr(tag, "data-country"), product.country);
    assert.equal(attr(tag, "data-age-days"), String(product.ageDays));
    assert.equal(attr(tag, "data-price"), String(product.price));
    assert.equal(attr(tag, "data-stock"), String(product.stock));
    const card = html.slice(html.indexOf(tag), html.indexOf("</article>", html.indexOf(tag)));
    assert.ok(card.includes(product.city));
    assert.ok(card.includes(product.ageLabel));
  }
});

test("manifest opens the site root", () => {
  const manifest = JSON.parse(fs.readFileSync("public/site.webmanifest", "utf8"));
  assert.equal(manifest.start_url, "/");
});

test("public pages have no dead hash links or the Tailwind CDN", () => {
  const files = [
    "public/index.html",
    "public/checkout.html",
    "public/oferta.html",
    "public/privacy.html",
    "public/support.html",
    "public/orders.html",
    "public/404.html"
  ];
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    assert.equal(html.includes("cdn.tailwindcss.com"), false, file);
    assert.equal(html.includes('href="#"'), false, file);
    assert.equal(html.includes("index.html"), false, file);
    assert.equal(html.includes("assets/logo.svg"), true, file);
  }
});

function attr(tag, name) {
  const match = tag.match(new RegExp(name + '="([^"]*)"'));
  return match ? match[1] : "";
}
