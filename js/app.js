import { BUSINESS, SOCIAL_LINKS, SIGNATURE, SEASONAL, MENU, FLAVORS, MENU_NOTE, BOOKING_DRINKS } from "./config.js";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const LEAF = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#leaf"/></svg>';

// ── Nav ──────────────────────────────────────────
const nav = $("#nav"), navLinks = $("#navLinks"), navToggle = $("#navToggle");
const setMenu = (open) => {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.body.style.overflow = open ? "hidden" : "";
};
navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ── Components ───────────────────────────────────
const SectionImage = ({ image, w, h, alt }, cls, eager = false) =>
  `<figure class="${cls}"><img src="${image}" width="${w}" height="${h}" alt="${esc(alt || "")}" ${eager ? "" : 'loading="lazy" '}decoding="async"></figure>`;

const Ingredient = ([amt, name, note]) => `
  <li><span class="ing-amt">${esc(amt || "·")}</span>
      <span class="ing-name">${esc(name)}${note ? `<span class="ing-note">${esc(note)}</span>` : ""}</span></li>`;

const FeaturedDrink = (d, flip = false) => `
  <article class="feature${flip ? " flip" : ""}" id="drink-${d.id}" style="--accent:${d.accent}">
    ${SectionImage(d, "feature-media")}
    <div class="feature-copy">
      <p class="feature-kicker">${esc(d.kicker)}</p>
      <h3>${esc(d.name)}</h3>
      <div class="divider">${LEAF}</div>
      <p class="feature-blurb">${esc(d.blurb)}</p>
      <ul class="ingredients">${d.ingredients.map(Ingredient).join("")}</ul>
      <p class="serve"><span>${esc(d.size)}</span><span>${esc(d.serve)}</span></p>
    </div>
  </article>`;

const SeasonalDrink = (d) => `
  <article class="fall-card">
    ${SectionImage({ ...d, alt: `${d.name} in an S+ cup` }, "fall-media")}
    <div class="fall-body">
      <h3>${esc(d.name)}</h3>
      <p class="fall-recipe">${esc(d.recipe)}</p>
      <p class="fall-price">${esc(d.price)}</p>
    </div>
  </article>`;

const price = (p) => (p ? esc(p) : '<span class="na" aria-label="not available">—</span>');
const MenuItem = ([name, a, b]) => `<tr><td>${esc(name)}</td><td class="p">${price(a)}</td><td class="p">${price(b)}</td></tr>`;
const FlatList = (rows) => `<ul class="flat-list">${rows.map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}</ul>`;

const PriceTable = (items, sizes) => `<table class="price-table">
  <thead><tr><th scope="col"><span class="visually-hidden">Drink</span></th>${sizes.map((z) => `<th scope="col">${esc(z)}</th>`).join("")}</tr></thead>
  <tbody>${items.map(MenuItem).join("")}</tbody></table>`;

// One menu category. Long lists split into two side-by-side tables on wide screens.
const MenuCategory = (c) => {
  let body = "";
  if (c.items) {
    if (c.items.length > 6) {
      const half = Math.ceil(c.items.length / 2);
      body += `<div class="split">${PriceTable(c.items.slice(0, half), c.sizes)}${PriceTable(c.items.slice(half), c.sizes)}</div>`;
    } else body += PriceTable(c.items, c.sizes);
  }
  if (c.flat) body += FlatList(c.flat);
  if (c.choices) body += `<div class="choices">
      <p class="choices-head"><span>${esc(c.choices.label)}</span><span>${esc(c.choices.extra)}</span></p>
      <ul class="pill-list">${c.choices.list.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div>`;
  if (c.list) body += `<ul class="pill-list">${c.list.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`;
  if (c.link) body += `<a class="cat-link" href="${c.link.href}">${esc(c.link.text)} →</a>`;
  return `<div class="menu-cat${c.wide ? " wide" : ""}"><h3>${esc(c.name)}${c.extra ? `<span>${esc(c.extra)}</span>` : ""}</h3>${body}</div>`;
};

// ── Signature drinks: two big alternating rows, then a staggered pair ──
const [first, second, ...rest] = SIGNATURE;
$("#signatureList").innerHTML =
  FeaturedDrink(first) + FeaturedDrink(second, true) +
  `<div class="feature-pair">${rest.map((d) => FeaturedDrink(d)).join("")}</div>`;

// ── Fall menu ────────────────────────────────────
$("#fallKicker").textContent = SEASONAL.kicker;
$("#fallTitle").textContent = SEASONAL.title;
$("#fallLine").textContent = SEASONAL.line;
$("#fallGrid").innerHTML = SEASONAL.items.map(SeasonalDrink).join("");

// ── Full menu ────────────────────────────────────
$("#menuNote").innerHTML = `<svg viewBox="0 0 24 24" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M4 6.5l16 11M20 6.5l-16 11M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5"/></svg>${esc(MENU_NOTE)}`;
// Tabs: one category visible at a time keeps the menu short.
const cat = (id) => MENU.find((c) => c.id === id);
const matcha = cat("matcha");
const MENU_TABS = [
  { id: "coffee", label: "Coffee", parts: [cat("coffee")] },
  { id: "espresso", label: "Espresso", parts: [cat("espresso")] },
  { id: "matcha", label: "Matcha", parts: [{ ...matcha, name: "Sizes", choices: null }, { name: matcha.choices.label, extra: matcha.choices.extra, list: matcha.choices.list }] },
  { id: "tea", label: "Tea", parts: [cat("tea")] },
  { id: "specialty", label: "Specialty", parts: [cat("specialty"), cat("signature")] },
  { id: "extras", label: "Milk & Flavors", parts: [cat("milk"), { name: "Flavors", extra: FLAVORS.extra, list: FLAVORS.list }] },
];
const tabsEl = $("#menuTabs"), panelsEl = $("#menuPanels");
tabsEl.innerHTML = MENU_TABS.map((t, i) =>
  `<button type="button" role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.label)}</button>`).join("");
panelsEl.innerHTML = MENU_TABS.map((t, i) =>
  `<div class="menu-panel${t.parts.length > 1 ? " two" : ""}" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}"${i ? " hidden" : ""}>${t.parts.map(MenuCategory).join("")}</div>`).join("");
const tabs = [...tabsEl.querySelectorAll('[role="tab"]')];
const selectTab = (tab, focus = false) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    $("#" + t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
  tab.scrollIntoView({ block: "nearest", inline: "nearest" });
};
tabsEl.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t) selectTab(t); });
tabsEl.addEventListener("keydown", (e) => {
  const i = tabs.indexOf(document.activeElement);
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (i < 0 || !step) return;
  e.preventDefault();
  selectTab(tabs[(i + step + tabs.length) % tabs.length], true);
});

// ── Booking form ─────────────────────────────────
const chip = (type, name, value, label, checked = false) =>
  `<label class="chip"><input type="${type}" id="${name}-${slug(value)}" name="${name}" value="${esc(value)}"${checked ? " checked" : ""}><span>${esc(label)}</span></label>`;

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Graduation", "School / Campus", "Festival", "Private party", "Other"];
$("#eventTypes").innerHTML = EVENT_TYPES.map((t) => chip("radio", "type", t, t)).join("");
$("#drinkChips").innerHTML = BOOKING_DRINKS.map((n) => chip("checkbox", "drinks", n, n)).join("");

const form = $("#bookForm");
const dateInput = form.elements.date;
dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const guests = $("#guests"), guestsOut = $("#guestsOut");
const guestLabel = () => (guests.value >= 500 ? "500+" : guests.value);

function formData() {
  const f = form.elements;
  return {
    name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(),
    type: f.type.value, date: f.date.value, time: f.time.value, hours: f.hours.value,
    guests: guestLabel(), location: f.location.value.trim(),
    drinks: [...form.querySelectorAll('input[name="drinks"]:checked')].map((i) => i.value),
    notes: f.notes.value.trim(),
  };
}

const prettyDate = (d) => d ? new Date(d + "T12:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—";
function updateTicket() {
  const d = formData();
  guestsOut.textContent = d.guests;
  const set = (k, v) => {
    const el = $(`#ticket [data-t="${k}"]`);
    if (el.textContent !== v) { el.textContent = v; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  };
  set("type", d.type || "—");
  set("date", d.date ? prettyDate(d.date) + (d.time ? ` · ${d.time}` : "") : "—");
  set("guests", d.guests);
  $('#ticket [data-t="cups"]').innerHTML = d.drinks.map((x) => `<span>${esc(x)}</span>`).join("");
}
form.addEventListener("input", updateTicket);
form.addEventListener("change", updateTicket);
updateTicket();

function validate() {
  let ok = true;
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  ["name", "phone", "date", "location"].forEach((n) => {
    const el = form.elements[n];
    if (!el.value.trim()) { el.closest(".field").classList.add("invalid"); ok = false; }
  });
  if (!form.elements.type.value) { $("#eventTypes").closest(".field").classList.add("invalid"); ok = false; }
  return ok;
}

function message(d) {
  return `New event booking request — ${BUSINESS.name}\n\n` + [
    `Name: ${d.name}`,
    `Phone: ${d.phone}`,
    d.email && `Email: ${d.email}`,
    `Event: ${d.type}`,
    `Date: ${prettyDate(d.date)}${d.time ? " at " + d.time : ""}`,
    `Hours of service: ${d.hours}`,
    `Guests: ${d.guests}`,
    `Location: ${d.location}`,
    d.drinks.length && `Drinks: ${d.drinks.join(", ")}`,
    d.notes && `Notes: ${d.notes}`,
  ].filter(Boolean).join("\n");
}

const note = $("#formNote");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  note.className = "form-note";
  if (!validate()) {
    note.textContent = "Please fill in the highlighted fields.";
    note.classList.add("err");
    form.querySelector(".invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const d = formData();
  const text = message(d);
  const btn = $("#submitBtn");

  if (BUSINESS.formEndpoint) {
    btn.disabled = true; btn.textContent = "Sending…";
    try {
      const res = await fetch(BUSINESS.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...d, drinks: d.drinks.join(", "), _subject: `Event booking: ${d.type} on ${d.date}`, message: text }),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset(); updateTicket();
      note.textContent = "Request sent. We’ll get back to you shortly.";
      note.classList.add("ok");
    } catch {
      note.textContent = "That didn’t go through. Please try again, or message us on Instagram.";
      note.classList.add("err");
    } finally {
      btn.disabled = false; btn.textContent = "Send booking request";
    }
    return;
  }
  if (BUSINESS.whatsapp) {
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    note.textContent = "Opening WhatsApp. Just hit send.";
    note.classList.add("ok");
    return;
  }
  if (BUSINESS.email) {
    location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Event booking: ${d.type} on ${d.date}`)}&body=${encodeURIComponent(text)}`;
    note.textContent = "Opening your email app. Just hit send.";
    note.classList.add("ok");
    return;
  }
  // Nothing configured yet: copy the request so it can be pasted into a DM.
  let copied = false;
  try { await navigator.clipboard.writeText(text); copied = true; } catch { /* clipboard blocked */ }
  const dm = SOCIAL_LINKS.instagram ? `<a href="${esc(SOCIAL_LINKS.instagram)}" target="_blank" rel="noopener">${esc(BUSINESS.instagramHandle)}</a>` : "us";
  note.innerHTML = copied
    ? `Your request is copied. Paste it in a DM to ${dm} and we’ll confirm.`
    : `Copy your request below and send it in a DM to ${dm}.<textarea readonly rows="8" class="copy-box">${esc(text)}</textarea>`;
  note.classList.add("ok");
  note.querySelector(".copy-box")?.select();
});

// ── Location, socials & footer ───────────────────
// Outline icons, one stroke style (24px grid)
const ICONS = {
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".5"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16"/>',
  tiktok: '<path d="M13.5 4v10.2a3.3 3.3 0 1 1-3.3-3.3"/><path d="M13.5 4c.3 2.3 1.9 3.9 4.5 4.1"/>',
  facebook: '<circle cx="12" cy="12" r="8.5"/><path d="M13.6 8.2h-1.1a2 2 0 0 0-2 2v10.2M8.9 13h4.6"/>',
  email: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  linktree: '<path d="M12 3.5v17M5.5 7.5 12 12l6.5-4.5M6.5 15h11"/>',
};
const SOCIAL_LABELS = { instagram: "Instagram", linkedin: "LinkedIn", tiktok: "TikTok", facebook: "Facebook", email: "Email", linktree: "Linktree" };
const socialHref = (k, v) => (k === "email" ? `mailto:${v}` : v);
const SocialIcons = () => Object.entries(SOCIAL_LINKS)
  .filter(([, v]) => v) // empty = not set up yet, keep hidden
  .map(([k, v]) => `<a class="social-icon" href="${esc(socialHref(k, v))}"${k === "email" ? "" : ' target="_blank" rel="noopener"'} aria-label="${SOCIAL_LABELS[k]}" title="${SOCIAL_LABELS[k]}">
      <svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg></a>`).join("");

$("#addrStreet").textContent = BUSINESS.street + ",";
$("#addrCity").textContent = BUSINESS.cityLine;
$("#addrCountry").textContent = BUSINESS.country;
$("#directionsBtn").href = BUSINESS.directionsUrl;
document.querySelectorAll(".social-row").forEach((el) => (el.innerHTML = SocialIcons()));
if (SOCIAL_LINKS.instagram) $("#igHandle").href = SOCIAL_LINKS.instagram;
$("#igHandle").textContent = BUSINESS.instagramHandle;
$("#footerAddr").textContent = `${BUSINESS.street}, ${BUSINESS.cityLine}`;
$("#year").textContent = new Date().getFullYear();

// ── Active nav link ──────────────────────────────
const links = [...navLinks.querySelectorAll('a[href^="#"]')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

// ── Gentle entry animation for content below the first screen ──
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(".section-head, .feature, .fall-card, .menu-shell, .about > *, .address-block, .book-wrap > *");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("reveal-in");
      e.target.classList.remove("pre");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("pre"); io.observe(el); }
  });
}
