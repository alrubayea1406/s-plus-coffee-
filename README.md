# S+ Coffee — website

A one-page site for the S+ Coffee truck: an interactive 3D truck, the full menu with a 3D drink viewer, and an event booking form.

No build step — it's plain HTML/CSS/JS with [three.js](https://threejs.org) bundled in `vendor/`.

## Run it locally

```sh
python3 -m http.server 8080
# then open http://localhost:8080
```

(Opening `index.html` directly from disk won't work because browsers block ES modules on `file://`.)

## Edit the content

Everything lives in **`js/config.js`**:

| What | Where |
| --- | --- |
| City, phone, email | `BUSINESS` |
| Where booking requests go | `BUSINESS.formEndpoint` → `whatsapp` → `email` (first one filled in wins) |
| Social links | `BUSINESS.socials` |
| Menu, prices, drink colors | `MENU` (`price: ""` hides the price; `layers` paint the 3D cup) |

### Receiving booking requests

Pick one:

- **WhatsApp** — set `whatsapp: "19195551234"` (country code + number, digits only). The form opens WhatsApp with the request typed out.
- **Email inbox, no app needed** — create a free form at [formspree.io](https://formspree.io), then set `formEndpoint: "https://formspree.io/f/xxxxxxx"`.
- **Email app** — set `email: "you@example.com"`.

If none are set, the form copies the request to the visitor's clipboard and asks them to DM it on Instagram.

## Publish it (free)

GitHub Pages: repo **Settings → Pages → Deploy from a branch →** pick the branch and `/ (root)`. The site will be at `https://<user>.github.io/s-plus-coffee-/`.

Netlify / Cloudflare Pages / Vercel also work — just point them at this folder, no build command.
