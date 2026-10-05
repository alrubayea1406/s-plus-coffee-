// ─────────────────────────────────────────────────────────────
//  S+ Plus Coffee — site content
//  Everything the owner may want to change lives in this file.
//  Menu, prices and recipes are transcribed from the S+ Instagram
//  posts (main menu, Fall Menu and the four specialty drink posts).
// ─────────────────────────────────────────────────────────────

// Social / contact links. Leave a value empty ("") to hide its icon.
// TODO: fill in the real LinkedIn, TikTok and Facebook URLs and the contact email when available.
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/spluscoffee.nc/",
  linkedin: "", // TODO e.g. "https://www.linkedin.com/company/..."
  tiktok: "https://www.tiktok.com/@spluscoffee.nc",
  facebook: "https://www.facebook.com/share/1EwSntjF1r/",
  email: "spluscoffee2026@gmail.com", // becomes a mailto: link
  linktree: "https://linktr.ee/spluscoffee",
};

export const BUSINESS = {
  name: "S+ Plus Coffee",
  tagline: "Specialty Coffee · Good Vibes",
  street: "1018 W Main St",
  cityLine: "Durham, NC 27701",
  country: "United States",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=1018+W+Main+St,+Durham,+NC+27701",

  // Event booking requests are delivered using the first option that is filled in:
  //   0. web3formsKey — free Web3Forms access key (get one at web3forms.com with the
  //      shop's email; the key is meant to live in front-end code). Emails every request.
  //   1. formEndpoint — a form-to-email service URL (works without opening an app).
  //      Uses FormSubmit (free): the first request sends an "Activate Form" email to
  //      the address below, which must be confirmed once.
  //   2. whatsapp     — international number, digits only, e.g. "19195551234"
  //   3. email        — opens the visitor's mail app with the request pre-filled
  web3formsKey: "", // TODO: paste the Web3Forms access key here
  formEndpoint: "https://formsubmit.co/ajax/spluscoffee2026@gmail.com",
  whatsapp: "",
  email: SOCIAL_LINKS.email,
  phone: "", // display only, e.g. "(919) 555-1234"
  instagramHandle: "@spluscoffee.nc",
};

// ── Signature / specialty drinks (from the S+ drink posts) ──
// `accent` tints small details of each feature; amounts are as posted.
export const SIGNATURE = [
  {
    id: "d1",
    name: "D-1 Coffee",
    kicker: "Where it all began",
    blurb: "Rich, smooth, and a little fun. One of our S+ special drinks.",
    size: "16 oz",
    serve: "Iced or hot",
    accent: "#c99a4b",
    image: "assets/img/d1-coffee.webp", w: 758, h: 1029,
    alt: "D-1 Coffee in an S+ cup topped with M&M's and a small dried-flower bouquet",
    ingredients: [
      ["2 shots", "Espresso", "Rich and bold"],
      ["4 oz", "Cold brew", "Smooth and refreshing"],
      ["1 oz", "Vanilla syrup", "Sweet and aromatic"],
      ["1 oz", "Brown sugar syrup", "Caramel notes"],
      ["", "Ice", "Chilled to perfection"],
      ["", "M&M's topping", "A fun and sweet touch"],
    ],
  },
  {
    id: "orangello",
    name: "Orangello",
    kicker: "Where coffee meets orange",
    blurb: "A bright fusion of espresso and fresh orange. Refreshing, smooth, and perfectly balanced.",
    size: "16 oz",
    serve: "Iced only",
    accent: "#e08a3c",
    image: "assets/img/orangello.webp", w: 757, h: 1056,
    alt: "Iced Orangello layered espresso and orange juice with a dried orange slice and fresh oranges",
    ingredients: [
      ["2 shots", "Espresso", ""],
      ["4 oz", "Fresh orange juice", ""],
      ["0.5 oz", "Orange syrup", ""],
      ["0.5 oz", "Vanilla syrup", ""],
      ["", "Ice", ""],
    ],
  },
  {
    id: "tokyo",
    name: "Tokyo Matcha",
    kicker: "Inspired by Japan. Crafted by S+.",
    blurb: "Smooth, rich, and made for matcha lovers.",
    size: "16 oz",
    serve: "Iced or hot",
    accent: "#9db36a",
    image: "assets/img/tokyo-matcha.webp", w: 757, h: 1044,
    alt: "Tokyo Matcha with coconut cream, cocoa and cardamom pods on top",
    ingredients: [
      ["2–2.5 g", "Premium matcha", "Vibrant and smooth"],
      ["5 oz", "Coconut milk", "Creamy and tropical"],
      ["2 oz", "Oat milk", "Smooth and balanced"],
      ["0.75 oz", "Vanilla syrup", "Sweet and aromatic"],
      ["0.5 oz", "Coconut syrup", "Subtle and fragrant"],
      ["2–3 pods", "Cardamom", "Warm and fragrant"],
    ],
  },
  {
    id: "sabah",
    name: "Sabah Tea",
    kicker: "A little taste of what’s coming",
    blurb: "Bold, smooth, and crafted with intention.",
    size: "16 oz",
    serve: "Iced or hot",
    accent: "#c4733a",
    image: "assets/img/sabah-tea.webp", w: 742, h: 975,
    alt: "Sabah Tea over ice with cinnamon sticks and cardamom pods",
    ingredients: [
      ["8 oz", "Black tea", "Robust and aromatic"],
      ["1–1.5 oz", "Peach syrup", "Sweet and fruity"],
      ["0.5 oz", "Honey syrup", "Smooth and natural"],
      ["2–3 pods", "Cardamom", "Warm and fragrant"],
      ["", "Cinnamon", "A touch of spice"],
      ["", "Ice (optional)", "Enjoy it your way"],
    ],
  },
];

// ── Fall Menu · seasonal drinks (from the S+ Fall Menu post) ──
const fall = (slug) => `assets/img/fall-${slug}.webp`;
export const SEASONAL = {
  title: "Fall Menu",
  kicker: "Seasonal drinks",
  line: "The next chapter of coffee.",
  items: [
    { name: "Pumpkin Spice Latte", recipe: "pumpkin spice + espresso + milk + pumpkin pie spice", price: "$6.25", image: fall("pumpkin-spice-latte"), w: 307, h: 395 },
    { name: "Banana Bread Latte", recipe: "banana + vanilla + espresso + milk + cinnamon", price: "$6.50", image: fall("banana-bread-latte"), w: 308, h: 395 },
    { name: "Coconut Pumpkin Macchiato", recipe: "coconut + pumpkin spice + espresso + milk", price: "$6.75", image: fall("coconut-pumpkin-macchiato"), w: 310, h: 395 },
    { name: "Pumpkin Chai Latte", recipe: "chai + pumpkin spice + milk + pumpkin pie spice", price: "$6.25", image: fall("pumpkin-chai-latte"), w: 310, h: 395 },
    { name: "Pumpkin Spice Matcha", recipe: "matcha + pumpkin spice + milk + pumpkin pie spice", price: "$6.75", image: fall("pumpkin-spice-matcha"), w: 307, h: 421 },
    { name: "Pumpkin Lavender Tiramisu Matcha", recipe: "matcha + pumpkin spice + lavender + tiramisu cream + milk", price: "$6.75", image: fall("pumpkin-lavender-tiramisu-matcha"), w: 308, h: 421 },
    { name: "Pumpkin Cookie Butter Matcha", recipe: "matcha + pumpkin spice + cookie butter + milk + pumpkin pie spice", price: "$6.75", image: fall("pumpkin-cookie-butter-matcha"), w: 310, h: 421 },
    { name: "Pumpkin Cream Cold Brew", recipe: "cold brew + pumpkin spice + cream + pumpkin pie spice", price: "$6.25", image: fall("pumpkin-cream-cold-brew"), w: 310, h: 421 },
  ],
};

// ── Full menu (from the S+ main menu post) ──
// Priced items: [name, 12 oz price, 16 oz price] — null where the menu shows "—".
// `flat` rows are simple [label, value] pairs (size lists, milk options).
export const MENU = [
  {
    id: "coffee",
    name: "Coffee",
    sizes: ["12 oz", "16 oz"],
    items: [
      ["Drip Coffee", "$2.95", "$3.45"],
      ["Turkish Coffee", "$3.95", "$4.50"],
      ["Pour Over", "$5.95", "$6.95"],
      ["Cold Brew", null, "$4.75"],
      ["Iced Coffee", null, "$4.25"],
      ["Protein Cold Brew", null, "$6.25"],
    ],
  },
  {
    id: "espresso",
    name: "Espresso",
    sizes: ["12 oz", "16 oz"],
    items: [
      ["Espresso", "$2.99", null],
      ["Espresso Macchiato", "$3.50", null],
      ["Cortado", "$3.95", null],
      ["Americano", "$3.50", "$4.25"],
      ["Cappuccino", "$4.25", "$4.95"],
      ["Latte", "$4.50", "$5.25"],
      ["Protein Latte", "$5.50", "$6.50"],
      ["Pistachio Latte", "$5.50", "$6.50"],
      ["Flat White", "$4.75", "$5.50"],
      ["S+ Mocha", "$5.25", "$5.95"],
    ],
  },
  {
    id: "matcha",
    name: "Matcha",
    flat: [["12 oz", "$5.50"], ["16 oz", "$6.50"]],
    choices: {
      label: "Choose your flavor",
      extra: "+ $0.75",
      list: ["Protein", "Cherry", "Orange", "Strawberry", "Raspberry", "Banana", "Mango", "Lavender"],
    },
  },
  {
    id: "tea",
    name: "Tea Collection",
    sizes: ["12 oz", "16 oz"],
    items: [
      ["Turkish Tea", "$3.50", "$4.25"],
      ["Arabic Tea", "$3.50", "$4.25"],
      ["Spearmint Tea", "$3.50", "$4.25"],
      ["Ginger Peach", "$3.50", "$4.25"],
      ["Green Tea", "$3.50", "$4.25"],
      ["English Breakfast", "$3.50", "$4.25"],
      ["Earl Grey", "$3.50", "$4.25"],
      ["Triple Berry", "$3.50", "$4.25"],
      ["Chai Latte", "$4.50", "$5.25"],
      ["Karak Chai", "$4.75", "$5.50"],
    ],
  },
  {
    id: "specialty",
    name: "Specialty Drinks",
    sizes: ["12 oz", "16 oz"],
    items: [
      ["Lemonade", null, "$4.25"],
      ["Orange Juice", null, "$4.25"],
      ["Hot Chocolate", "$3.50", "$4.25"],
      ["Milk Steamer", "$3.00", "$3.75"],
    ],
  },
  {
    id: "signature",
    name: "Signature Season Drinks",
    flat: [["12 oz", "$5.50"], ["16 oz", "$6.25"]],
    link: { href: "#signature", text: "See the S+ signature drinks" },
  },
  {
    id: "milk",
    name: "Milk Options",
    flat: [
      ["Whole Milk", "Included"],
      ["Skim Milk", "Included"],
      ["Oat Milk", "+ $0.75"],
      ["Almond Milk", "+ $0.75"],
    ],
  },
];

export const FLAVORS = {
  extra: "+ $0.75",
  list: [
    "Vanilla", "Sugar Free Vanilla", "Strawberry", "Raspberry",
    "Cherry", "Banana", "Caramel", "Hazelnut",
    "Honey", "Simple Syrup", "Orange", "Lavender",
    "Pistachio", "Brown Sugar", "Brown Sugar Cinnamon", "White Mocha",
  ],
};

export const MENU_NOTE = "All iced drinks are an additional $0.25";

// Drinks a guest can ask for in the event booking form.
export const BOOKING_DRINKS = ["D-1 Coffee", "Orangello", "Tokyo Matcha", "Sabah Tea", "Espresso drinks", "Matcha", "Tea", "Fall menu"];
