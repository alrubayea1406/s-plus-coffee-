// ─────────────────────────────────────────────────────────────
//  S+ Coffee — site content
//  Everything the owner may want to change lives in this file:
//  contact info, social links, event packages and the full menu.
// ─────────────────────────────────────────────────────────────

export const BUSINESS = {
  name: "S+ Coffee",
  tagline: "Specialty coffee on wheels",
  city: "", // e.g. "Durham, NC" — shown in the hero and footer when set

  // Booking requests are delivered using the first option that is filled in:
  //   1. formEndpoint — a Formspree / Getform URL (works without opening an app)
  //   2. whatsapp     — international number, digits only, e.g. "19195551234"
  //   3. email        — opens the visitor's mail app with the request pre-filled
  formEndpoint: "",
  whatsapp: "",
  email: "",
  phone: "", // display only, e.g. "(919) 555-1234"

  socials: [
    { label: "Instagram", handle: "@spluscoffee", url: "https://instagram.com/spluscoffee" },
    { label: "Linktree", handle: "linktr.ee/spluscoffee", url: "https://linktr.ee/spluscoffee" },
    // { label: "TikTok", handle: "@spluscoffee", url: "https://tiktok.com/@spluscoffee" },
    // { label: "Snapchat", handle: "spluscoffee", url: "https://snapchat.com/add/spluscoffee" },
  ],
};

export const PACKAGES = [
  {
    id: "gathering",
    name: "Gathering",
    guests: "Up to 50 guests",
    blurb: "Birthdays, graduations, family nights and small parties.",
    perks: ["2 hours of service", "Choose 5 menu drinks", "One barista"],
  },
  {
    id: "corporate",
    name: "Office & Corporate",
    guests: "50 – 150 guests",
    blurb: "Team mornings, launches, conferences and client days.",
    perks: ["3 hours of service", "Full menu", "Custom cup sleeves with your logo"],
    featured: true,
  },
  {
    id: "celebration",
    name: "Weddings & Big Events",
    guests: "150+ guests",
    blurb: "Weddings, engagements, festivals and community events.",
    perks: ["4+ hours of service", "Signature drink named for you", "Two baristas"],
  },
];

// Each drink's `layers` paint the 3D cup, bottom → top.
// h is the share of the cup height (they don't need to add up to 1 — the rest stays empty).
// price: leave as "" to hide it.
const ESPRESSO = "#3b1f12", MILK = "#efe3d0", FOAM = "#fbf6ec", CARAMEL = "#c07a2c";
const ICE = "#d9ecf2";

export const MENU = [
  {
    id: "signature",
    name: "Signatures",
    items: [
      {
        name: "D-1 Coffee",
        desc: "Espresso and cold brew with vanilla and brown sugar, topped with M&M's.",
        price: "", iced: true, tag: "House favorite",
        layers: [{ c: "#5a3018", h: 0.35 }, { c: "#8a5a35", h: 0.3 }, { c: "#d8b98d", h: 0.15 }],
        topping: "candy",
      },
      {
        name: "Spanish Latte",
        desc: "Double espresso over sweetened condensed milk and fresh milk.",
        price: "", iced: true, tag: "Best seller",
        layers: [{ c: "#f4e6c8", h: 0.22 }, { c: MILK, h: 0.38 }, { c: ESPRESSO, h: 0.18 }],
      },
      {
        name: "Banana Latte",
        desc: "Espresso with banana-infused milk — smooth, sweet, a little nostalgic.",
        price: "", iced: true,
        layers: [{ c: "#f1df9a", h: 0.45 }, { c: "#a26c3f", h: 0.3 }],
      },
      {
        name: "Pistachio Latte",
        desc: "House pistachio cream, espresso and milk, finished with crushed pistachio.",
        price: "", iced: true,
        layers: [{ c: "#c9d6a0", h: 0.4 }, { c: "#9a7454", h: 0.3 }, { c: "#e7efd0", h: 0.08 }],
        topping: "crumble",
      },
      {
        name: "Saffron Rose Latte",
        desc: "Saffron and rose syrup with espresso and steamed milk.",
        price: "",
        layers: [{ c: "#c9925b", h: 0.55 }, { c: "#f5d9c4", h: 0.2 }],
      },
    ],
  },
  {
    id: "espresso",
    name: "Espresso Bar",
    items: [
      {
        name: "Espresso",
        desc: "A rich double shot, pulled to order.",
        price: "",
        layers: [{ c: ESPRESSO, h: 0.32 }, { c: "#a0663a", h: 0.06 }],
      },
      {
        name: "Americano",
        desc: "Espresso lengthened with hot water.",
        price: "", iced: true,
        layers: [{ c: "#2d170c", h: 0.72 }, { c: "#7b4a28", h: 0.04 }],
      },
      {
        name: "Cortado",
        desc: "Espresso cut with an equal measure of warm milk.",
        price: "",
        layers: [{ c: "#6b3d22", h: 0.3 }, { c: "#cfa77c", h: 0.18 }],
      },
      {
        name: "Cappuccino",
        desc: "Espresso, steamed milk and a deep cap of foam.",
        price: "",
        layers: [{ c: ESPRESSO, h: 0.2 }, { c: "#c9a27b", h: 0.25 }, { c: FOAM, h: 0.3 }],
      },
      {
        name: "Flat White",
        desc: "Ristretto shots with silky micro-foam.",
        price: "",
        layers: [{ c: "#5a3018", h: 0.25 }, { c: "#d7b58f", h: 0.42 }, { c: FOAM, h: 0.06 }],
      },
      {
        name: "Latte",
        desc: "Espresso with plenty of steamed milk.",
        price: "", iced: true,
        layers: [{ c: ESPRESSO, h: 0.18 }, { c: MILK, h: 0.52 }, { c: FOAM, h: 0.08 }],
      },
      {
        name: "Caramel Macchiato",
        desc: "Vanilla milk, espresso, caramel drizzle.",
        price: "", iced: true,
        layers: [{ c: MILK, h: 0.45 }, { c: "#8a5a35", h: 0.2 }, { c: CARAMEL, h: 0.05 }],
      },
      {
        name: "Mocha",
        desc: "Espresso, dark chocolate and steamed milk.",
        price: "", iced: true,
        layers: [{ c: "#4a2616", h: 0.3 }, { c: "#7c4a2d", h: 0.35 }, { c: FOAM, h: 0.1 }],
      },
    ],
  },
  {
    id: "cold",
    name: "Cold & Blended",
    items: [
      {
        name: "Cold Brew",
        desc: "Steeped for 18 hours. Bold, low acid, over ice.",
        price: "", iced: true,
        layers: [{ c: "#2a150b", h: 0.75 }],
      },
      {
        name: "Vanilla Sweet Cream Cold Brew",
        desc: "Cold brew floated with vanilla sweet cream.",
        price: "", iced: true,
        layers: [{ c: "#2a150b", h: 0.55 }, { c: "#b8916a", h: 0.12 }, { c: "#f6ead6", h: 0.1 }],
      },
      {
        name: "Caramel Frappé",
        desc: "Blended coffee, caramel and milk, whipped cream on top.",
        price: "", iced: true,
        layers: [{ c: "#c39a6d", h: 0.65 }, { c: "#fffaf0", h: 0.15 }],
        topping: "drizzle",
      },
      {
        name: "Matcha Latte",
        desc: "Ceremonial-grade matcha whisked into milk.",
        price: "", iced: true,
        layers: [{ c: MILK, h: 0.35 }, { c: "#8fb069", h: 0.35 }],
      },
    ],
  },
  {
    id: "tea",
    name: "Tea & Traditional",
    items: [
      {
        name: "Arabic Coffee",
        desc: "Lightly roasted with cardamom and saffron, served with dates.",
        price: "",
        layers: [{ c: "#c9a15a", h: 0.5 }],
      },
      {
        name: "Karak Chai",
        desc: "Black tea simmered with milk, cardamom and spice.",
        price: "",
        layers: [{ c: "#b47d4c", h: 0.68 }, { c: "#d9b48a", h: 0.06 }],
      },
      {
        name: "Hot Chocolate",
        desc: "Real chocolate, steamed milk, marshmallows.",
        price: "",
        layers: [{ c: "#4a2616", h: 0.62 }, { c: FOAM, h: 0.1 }],
        topping: "marshmallow",
      },
      {
        name: "Fresh Lemonade",
        desc: "Squeezed to order, with a mint option.",
        price: "", iced: true,
        layers: [{ c: "#f5e98a", h: 0.7 }],
      },
    ],
  },
];

export const EXTRAS = ["Oat milk", "Almond milk", "Extra shot", "Vanilla", "Caramel", "Hazelnut", "Sugar-free syrups"];
