import { BUSINESS, PACKAGES, MENU, EXTRAS } from "./config.js";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ── Nav ──────────────────────────────────────────
const nav = $("#nav"), navLinks = $("#navLinks"), navToggle = $("#navToggle");
const setMenu = (open) => {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

// ── 3D truck (falls back gracefully if WebGL is unavailable) ──
let truck = null;
import("./truck.js")
  .then(({ initTruck }) => {
    truck = initTruck($("#truckCanvas"), {
      onFirstInteract: () => ($("#heroHint").style.opacity = 0),
    });
  })
  .catch((err) => {
    console.warn("3D scene unavailable:", err);
    $("#heroHint").remove();
  });

const hero = $(".hero");
const onScroll = () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  const p = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
  truck?.setScroll(p);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (BUSINESS.city) $("#heroEyebrow").textContent = `${BUSINESS.tagline} · ${BUSINESS.city}`;

// ── Marquee ──────────────────────────────────────
const names = MENU.flatMap((c) => c.items.map((i) => i.name));
$("#marquee").innerHTML = [...names, ...names].map((n) => `<span>${esc(n)}</span>`).join("");

// ── Menu ─────────────────────────────────────────
function glassHTML(item) {
  const total = item.layers.reduce((a, l) => a + l.h, 0);
  const fill = Math.min(total, 0.9) / total;
  const layers = item.layers.map((l) => `<i style="height:${(l.h * fill * 100).toFixed(1)}%;background:${l.c}"></i>`).join("");
  const top = 100 - Math.min(total, 0.9) * 100;
  const extra = item.iced
    ? `<span class="straw"></span>` + [0, 1, 2].map((i) => `<span class="ice" style="left:${14 + i * 18}px;top:${top + 4 + (i % 2) * 10}%;transform:rotate(${i * 20 - 10}deg)"></span>`).join("")
    : `<span class="steam"></span><span class="steam"></span><span class="steam"></span>`;
  return `<div class="glass">${extra}<div class="glass-body">${layers}</div></div>`;
}

const tabs = $("#menuTabs"), grid = $("#menuGrid");
const allTab = { id: "all", name: "All" };
[allTab, ...MENU].forEach((c, i) => {
  const b = document.createElement("button");
  b.className = "tab";
  b.role = "tab";
  b.textContent = c.name;
  b.dataset.cat = c.id;
  b.setAttribute("aria-selected", i === 1);
  b.addEventListener("click", () => renderMenu(c.id));
  tabs.append(b);
});

function renderMenu(catId) {
  tabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.cat === catId));
  const cats = catId === "all" ? MENU : MENU.filter((c) => c.id === catId);
  grid.innerHTML = "";
  let n = 0;
  cats.forEach((cat) => cat.items.forEach((item) => {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.style.animationDelay = `${n++ * 0.05}s`;
    card.innerHTML = `
      ${item.tag ? `<span class="badge">${esc(item.tag)}</span>` : ""}
      <div class="card-cup">${glassHTML(item)}</div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.desc)}</p>
      <div class="card-meta"><span class="price">${esc(item.price || "")}</span><span class="spin">${item.iced ? "Hot or iced · " : ""}View in 3D →</span></div>`;
    card.addEventListener("click", () => openDrink(item, cat));
    addTilt(card);
    grid.append(card);
  }));
}
renderMenu(MENU[0].id);
$("#extras").innerHTML = `<b>Make it yours:</b> ${EXTRAS.map(esc).join(" · ")}`;

function addTilt(el) {
  if (matchMedia("(hover: none)").matches) return;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
  });
  el.addEventListener("pointerleave", () => (el.style.transform = ""));
}

// ── Drink modal ──────────────────────────────────
const modal = $("#drinkModal");
let cupViewer = null, currentDrink = null;
async function openDrink(item, cat) {
  currentDrink = item;
  $("#drinkCat").textContent = cat.name;
  $("#drinkName").textContent = item.name;
  $("#drinkDesc").textContent = item.desc;
  $("#drinkPrice").textContent = item.price || "";
  $("#drinkLayers").innerHTML = [item.tag, item.iced ? "Hot or iced" : "Served hot", "Any milk"]
    .filter(Boolean).map((t) => `<li>${esc(t)}</li>`).join("");
  modal.showModal();
  try {
    if (!cupViewer) cupViewer = (await import("./cup.js")).initCup($("#cupCanvas"));
    cupViewer.open(item);
  } catch (err) {
    console.warn("3D cup unavailable:", err);
  }
}
const closeModal = () => modal.close();
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => e.target === modal && closeModal());
modal.addEventListener("close", () => cupViewer?.close());
$("#drinkBook").addEventListener("click", () => {
  const box = [...document.querySelectorAll('#drinkChips input')].find((i) => i.value === currentDrink.name);
  if (box) box.checked = true;
  closeModal();
  updateTicket();
  $("#book").scrollIntoView({ behavior: "smooth" });
});

// ── Packages ─────────────────────────────────────
$("#packages").innerHTML = PACKAGES.map((p) => `
  <article class="package${p.featured ? " featured" : ""}">
    ${p.featured ? `<span class="ribbon">Most booked</span>` : ""}
    <h3>${esc(p.name)}</h3>
    <p class="guests">${esc(p.guests)}</p>
    <p>${esc(p.blurb)}</p>
    <ul>${p.perks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <a class="btn ${p.featured ? "" : "btn-ghost"}" href="#book" data-pkg="${p.id}">Request this</a>
  </article>`).join("");
$("#packages").addEventListener("click", (e) => {
  const a = e.target.closest("[data-pkg]");
  if (!a) return;
  const r = document.querySelector(`#packageChips input[value="${a.dataset.pkg}"]`);
  if (r) r.checked = true;
  updateTicket();
});

// ── Booking form ─────────────────────────────────
const chip = (type, name, value, label, checked = false) =>
  `<label class="chip"><input type="${type}" name="${name}" value="${esc(value)}"${checked ? " checked" : ""}><span>${esc(label)}</span></label>`;

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Graduation", "School / Campus", "Festival", "Private party", "Other"];
$("#eventTypes").innerHTML = EVENT_TYPES.map((t) => chip("radio", "type", t, t)).join("");
$("#packageChips").innerHTML = PACKAGES.map((p) => chip("radio", "package", p.id, p.name)).join("") + chip("radio", "package", "unsure", "Not sure yet", true);
$("#drinkChips").innerHTML = MENU.flatMap((c) => c.items).map((i) => chip("checkbox", "drinks", i.name, i.name)).join("");

const form = $("#bookForm");
const dateInput = form.elements.date;
dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const guests = $("#guests"), guestsOut = $("#guestsOut");
const guestLabel = () => (guests.value >= 500 ? "500+" : guests.value);

function formData() {
  const f = form.elements;
  const pkg = PACKAGES.find((p) => p.id === f.package.value);
  return {
    name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(),
    type: f.type.value, date: f.date.value, time: f.time.value, hours: f.hours.value,
    guests: guestLabel(), location: f.location.value.trim(),
    package: pkg ? pkg.name : "Not sure yet",
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
  set("package", d.package);
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
    `Package: ${d.package}`,
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
      note.textContent = "Request sent! We’ll get back to you shortly ☕";
      note.classList.add("ok");
    } catch {
      note.textContent = "Couldn’t send right now — please try again, or message us on Instagram.";
      note.classList.add("err");
    } finally {
      btn.disabled = false; btn.textContent = "Send booking request";
    }
    return;
  }
  if (BUSINESS.whatsapp) {
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    note.textContent = "Opening WhatsApp — just hit send!";
    note.classList.add("ok");
    return;
  }
  if (BUSINESS.email) {
    location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Event booking: ${d.type} on ${d.date}`)}&body=${encodeURIComponent(text)}`;
    note.textContent = "Opening your email app — just hit send!";
    note.classList.add("ok");
    return;
  }
  // Nothing configured yet: copy the request so it can be pasted into a DM.
  try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
  const ig = BUSINESS.socials.find((s) => s.label === "Instagram");
  note.innerHTML = `Your request is copied — paste it in a DM to ${ig ? `<a href="${ig.url}" target="_blank" rel="noopener">${esc(ig.handle)}</a>` : "us"} and we’ll confirm.`;
  note.classList.add("ok");
});

// ── Socials & footer ─────────────────────────────
const ICONS = {
  Instagram: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  Linktree: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3v18M5 7l7 5 7-5M6 15h12"/></svg>',
  TikTok: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3v11a4 4 0 1 1-4-4M14 3c0 3 2 5 5 5"/></svg>',
  default: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
};
const contacts = [
  ...BUSINESS.socials,
  BUSINESS.phone && { label: "Call or text", handle: BUSINESS.phone, url: `tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}` },
  BUSINESS.email && { label: "Email", handle: BUSINESS.email, url: `mailto:${BUSINESS.email}` },
].filter(Boolean);
$("#socials").innerHTML = contacts.map((s) => `
  <a class="social" href="${esc(s.url)}" target="_blank" rel="noopener">
    <span class="social-icon">${ICONS[s.label] || ICONS.default}</span>
    <span><b>${esc(s.label)}</b><small>${esc(s.handle)}</small></span>
  </a>`).join("");
$("#footerInfo").textContent = [BUSINESS.tagline, BUSINESS.city].filter(Boolean).join(" · ");
$("#year").textContent = new Date().getFullYear();
