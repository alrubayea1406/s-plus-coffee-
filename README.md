# S+ Plus Coffee — website

One-page site for S+ Plus Coffee, the coffee trailer at 1018 W Main St, Durham, NC:
the real trailer, the S+ signature drinks, the Fall Menu, the full menu with prices,
location, and an event booking form.

Plain HTML/CSS/JS — no build step, no framework.

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
| Address, directions link, phone, email | `BUSINESS` |
| Where booking requests go | `BUSINESS.formEndpoint` → `whatsapp` → `email` (first one filled in wins) |
| Social links | `BUSINESS.socials` |
| Signature drinks (photo, recipe, size) | `SIGNATURE` |
| Seasonal menu | `SEASONAL` |
| Full menu and prices | `MENU`, `FLAVORS`, `MENU_NOTE` |

Photos are in `assets/img/` (WebP, cropped from the S+ Instagram posts).

### Receiving booking requests

Pick one:

- **WhatsApp** — set `whatsapp: "19195551234"` (country code + number, digits only).
- **Email inbox, no app needed** — create a free form at [formspree.io](https://formspree.io), then set `formEndpoint`.
- **Email app** — set `email: "you@example.com"`.

If none are set, the form copies the request so the visitor can DM it on Instagram.

## Publish it (free)

GitHub Pages: repo **Settings → Pages → Deploy from a branch →** pick the branch and `/ (root)`.
Netlify / Cloudflare Pages / Vercel also work — point them at this folder, no build command.
