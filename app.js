// hekey storefront — catalogue, filters, product drawer and bag.

const PRODUCTS = [
  { id: "hd01", name: "Heavy Hoodie 01", color: "Washed Black", cat: "tops", type: "Hoodie", price: 140, img: "p-hoodie.jpg", tag: "New",
    desc: "480 GSM brushed loopback cotton. Dropped shoulders, double-layer hood, deep kangaroo pocket. Garment-dyed and washed for a lived-in black.",
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [] },
  { id: "ts01", name: "Boxy Tee 01", color: "Bone", cat: "tops", type: "T-Shirt", price: 55, img: "p-tee.jpg",
    desc: "280 GSM jersey with a thick 3 cm ribbed collar. Cropped boxy body, sleeves cut long. Pre-shrunk so it keeps the shape you bought.",
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: ["XS"] },
  { id: "cg01", name: "Wide Cargo 01", color: "Stone", cat: "bottoms", type: "Trousers", price: 150, img: "p-cargo.jpg", tag: "New",
    desc: "Cotton twill cargo with a very wide leg. Bellows pockets, drawcord hem to stack or let fall. Mid rise, relaxed through the seat.",
    sizes: ["28", "30", "32", "34", "36"], soldOut: [] },
  { id: "dj01", name: "Trucker Jacket 01", color: "Faded Black", cat: "outerwear", type: "Denim Jacket", price: 210, img: "p-denim.jpg",
    desc: "14 oz rigid denim, cropped and boxy. Stone-washed to a soft faded black, nickel shank buttons, chest flap pockets.",
    sizes: ["S", "M", "L", "XL"], soldOut: ["S"] },
  { id: "zh01", name: "Zip Hoodie 01", color: "Heather Grey", cat: "tops", type: "Zip Hoodie", price: 155, img: "p-zip.jpg",
    desc: "The same 480 GSM fleece as Hoodie 01 with a two-way metal zip. Oversized, drop shoulder, ribbed cuffs and hem.",
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [] },
  { id: "tp01", name: "Track Pant 01", color: "Black", cat: "bottoms", type: "Track Pants", price: 120, img: "p-track.jpg", tag: "New",
    desc: "Matte nylon shell with a brushed lining. Elastic waist with drawcord, white piping down the side seam, wide straight leg.",
    sizes: ["XS", "S", "M", "L", "XL"], soldOut: [] },
  { id: "bn01", name: "Rib Beanie 01", color: "Charcoal", cat: "accessories", type: "Beanie", price: 45, img: "p-beanie.jpg",
    desc: "Merino-blend fisherman rib with a deep turn-up. Soft enough to wear straight on the head.",
    sizes: ["One size"], soldOut: [] },
  { id: "tt01", name: "Canvas Tote 01", color: "Natural", cat: "accessories", type: "Tote", price: 40, img: "p-tote.jpg",
    desc: "16 oz undyed cotton canvas with long shoulder straps and a gusseted base. Fits a laptop and a hoodie.",
    sizes: ["One size"], soldOut: [] },
];

const CATS = { all: "All", tops: "Tops", bottoms: "Bottoms", outerwear: "Outerwear", accessories: "Accessories" };
const FREE_SHIP = 150;
const SHIP_COST = 9;
const chf = (n) => `CHF ${n}`;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Grid ----------
const grid = $("#grid");

function renderGrid(filter = "all") {
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
  grid.innerHTML = list.map((p, i) => `
    <li class="cell" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.name}, ${p.color}, ${chf(p.price)}" style="animation-delay:${i * 50}ms">
      <div class="cell__cap label"><span>${p.type}</span>${p.tag ? `<span class="cell__tag">${p.tag}</span>` : ""}</div>
      <div class="cell__img"><img src="assets/img/${p.img}" alt="${p.name} in ${p.color}" loading="lazy"></div>
      <div class="cell__meta label"><span class="cell__name">${p.name} — ${p.color}</span><span class="mono">${chf(p.price)}</span></div>
    </li>`).join("");
  $("#shopTitle").textContent = CATS[filter];
  $("#shopCount").textContent = `(${String(list.length).padStart(2, "0")})`;
  $$(".filter").forEach((b) => b.classList.toggle("is-active", b.dataset.filter === filter));
  $$(".nav__link[data-filter]").forEach((a) => a.classList.toggle("is-active", filter !== "all" && a.dataset.filter === filter));
}

grid.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (cell) openProduct(cell.dataset.id);
});
grid.addEventListener("keydown", (e) => {
  const cell = e.target.closest(".cell");
  if (cell && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProduct(cell.dataset.id); }
});

// Any element with data-filter (nav, hero, footer, filter tabs) filters the grid.
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-filter]");
  if (!el) return;
  renderGrid(el.dataset.filter);
  closeMenu();
  if (el.classList.contains("filter")) return;
  e.preventDefault();
  $("#shop").scrollIntoView({ behavior: "smooth" });
});

// ---------- Drawers ----------
const scrim = $("#scrim");
let openDrawer = null;

function showDrawer(el) {
  if (openDrawer && openDrawer !== el) hideDrawer(openDrawer, true);
  scrim.hidden = false;
  requestAnimationFrame(() => scrim.classList.add("is-open"));
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  openDrawer = el;
  $(".drawer__close", el).focus({ preventScroll: true });
}
function hideDrawer(el = openDrawer, swapping = false) {
  if (!el) return;
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  openDrawer = null;
  if (swapping) return;
  scrim.classList.remove("is-open");
  document.body.classList.remove("locked");
  setTimeout(() => { if (!openDrawer) scrim.hidden = true; }, 350);
}
scrim.addEventListener("click", () => hideDrawer());
$$("[data-close]").forEach((b) => b.addEventListener("click", () => hideDrawer()));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { hideDrawer(); closeMenu(); } });

// ---------- Product ----------
let current = null;
let chosenSize = null;

function openProduct(id) {
  current = PRODUCTS.find((p) => p.id === id);
  chosenSize = current.sizes.length === 1 ? current.sizes[0] : null;
  $("#pImg").src = `assets/img/${current.img}`;
  $("#pImg").alt = `${current.name} in ${current.color}`;
  $("#pCat").textContent = `${current.type} — ${current.color}`;
  $("#pName").textContent = current.name;
  $("#pPrice").textContent = chf(current.price);
  $("#addPrice").textContent = chf(current.price);
  $("#pDesc").textContent = current.desc;
  $("#addNote").textContent = "";
  $("#pSizes").innerHTML = current.sizes.map((s) => {
    const out = current.soldOut.includes(s);
    return `<button class="size${s === chosenSize ? " is-active" : ""}" role="radio" aria-checked="${s === chosenSize}" data-size="${s}" ${out ? "disabled title=\"Sold out\"" : ""}>${s}</button>`;
  }).join("");
  $("#product").scrollTop = 0;
  showDrawer($("#product"));
}

$("#pSizes").addEventListener("click", (e) => {
  const b = e.target.closest(".size");
  if (!b || b.disabled) return;
  chosenSize = b.dataset.size;
  $$(".size").forEach((x) => { const on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-checked", on); });
  $("#addNote").textContent = "";
});

$("#addBtn").addEventListener("click", () => {
  if (!chosenSize) { $("#addNote").textContent = "Choose a size first."; return; }
  addToBag(current.id, chosenSize);
  hideDrawer($("#product"), true);
  renderBag();
  showDrawer($("#bag"));
});

// ---------- Bag ----------
const BAG_KEY = "hekey-bag";
let bag = [];
try { bag = JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch { bag = []; }
const saveBag = () => { try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch {} };

function addToBag(id, size) {
  const line = bag.find((l) => l.id === id && l.size === size);
  if (line) line.qty += 1; else bag.push({ id, size, qty: 1 });
  saveBag();
}

function renderBag() {
  const lines = bag.map((l) => ({ ...l, p: PRODUCTS.find((p) => p.id === l.id) })).filter((l) => l.p);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.p.price, 0);
  $("#bagCount").textContent = count;
  $("#bagCount2").textContent = count;
  $("#bagEmpty").hidden = count > 0;
  $(".bag__foot").hidden = count === 0;
  $("#bagTotal").textContent = chf(total);
  $("#bagShip").textContent = total >= FREE_SHIP ? "Free" : `${chf(SHIP_COST)} — free over ${chf(FREE_SHIP)}`;
  $("#checkoutNote").textContent = "";
  $("#bagItems").innerHTML = lines.map((l, i) => `
    <li class="bag__item">
      <img src="assets/img/${l.p.img}" alt="">
      <div class="bag__item-info">
        <p class="label">${l.p.name}</p>
        <p class="label muted">${l.p.color} / ${l.size}</p>
        <p class="label mono">${chf(l.p.price * l.qty)}</p>
        <div class="bag__qty label">
          <button data-i="${i}" data-d="-1" aria-label="Decrease quantity">−</button>
          <span class="mono">${l.qty}</span>
          <button data-i="${i}" data-d="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="label bag__remove" data-i="${i}" data-d="x">Remove</button>
    </li>`).join("");
}

$("#bagItems").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-i]");
  if (!b) return;
  const i = +b.dataset.i;
  if (b.dataset.d === "x") bag.splice(i, 1);
  else { bag[i].qty += +b.dataset.d; if (bag[i].qty < 1) bag.splice(i, 1); }
  saveBag();
  renderBag();
});

$("#bagBtn").addEventListener("click", () => { renderBag(); showDrawer($("#bag")); });
$("#checkoutBtn").addEventListener("click", () => {
  $("#checkoutNote").textContent = "Checkout opens with Drop 01 — we'll email you when it's live.";
});

// ---------- Nav ----------
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = $("#menuBtn");
const menu = $("#mobileMenu");
function closeMenu() { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.textContent = "Menu"; }
menuBtn.addEventListener("click", () => {
  const open = menu.hidden;
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "Close" : "Menu";
});
$$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));

// ---------- Newsletter ----------
$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#newsMsg").textContent = "You're on the list. We'll write once, the day Drop 02 opens.";
  e.target.reset();
});

$("#year").textContent = new Date().getFullYear();
renderGrid();
renderBag();
