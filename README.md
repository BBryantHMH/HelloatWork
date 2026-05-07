# Hello at Work

A wellness-portal gateway by Hello Mental Health, serving multiple partner
organizations from one front door at **work.hellomentalhealth.com**.

## How it works

A user visits the site and enters their work email. The gateway looks at the
domain after the `@`, finds the matching partner org in `js/auth.js`, and
forwards them to that org's portal.

This is **not** authentication. It's a directory lookup so partner-org staff
land in the right place. Anyone can type any email; there is no password and
no session check. Real auth, if needed later, happens at the hosting layer
(Cloudflare Access, etc.) or inside an individual partner's portal.

## Repo structure

```
/                                  Hello at Work gateway (the front door)
├── index.html                       Public entry — the email form
├── css/
│   └── login.css                    Gateway-only stylesheet (.haw-* prefix)
├── js/
│   └── auth.js                      Domain → portal routing logic
├── README.md                        This file
│
├── talberthouse/                  Talbert House Staff Resource Library
│   ├── index.html                   Their homepage (lands here after login)
│   ├── providers.html               Provider directory
│   ├── resources.html               Curated mental health resources
│   ├── workplace-wellness.html      Wellness program + tools
│   ├── blog.html
│   ├── videos.html
│   ├── podcast.html
│   └── CDB_Provider_Directory.html  Insurance-specific subset
│
└── [next-partner/]                Future partner orgs go in their own folder
```

Each partner-org folder is a **self-contained site** — it owns its styling,
content, and navigation. Pages inside use relative links (`href="resources.html"`)
so the folder is portable. The only thing tying a partner to the gateway is
one line in `js/auth.js` mapping their email domain to their folder.

## Adding a new partner organization

1. **Create a folder** at the repo root, named after the partner. Use lowercase,
   no spaces (e.g., `examplepartner/`).

2. **Build the partner's portal pages** inside that folder. Their `index.html`
   is the page users see right after the gateway forwards them. Internal links
   between the partner's pages should be relative (`href="resources.html"`,
   not `/examplepartner/resources.html`).

3. **Add the partner to the routing map** in `js/auth.js`:

   ```js
   var APPROVED_DOMAINS = {
     'talberthouse.org': 'talberthouse/',
     'examplepartner.org': 'examplepartner/'
   };
   ```

   Domain keys are matched lowercase and exact (no subdomain wildcarding).
   The value is the folder name with a trailing slash; the browser resolves
   it to that folder's `index.html`.

4. **Test** by typing an email from the partner's domain into the gateway.
   You should land on their `index.html`.

## Live URLs

- Gateway: <https://work.hellomentalhealth.com/>
- Talbert House: <https://work.hellomentalhealth.com/talberthouse/>

## Built by

Hello Mental Health · Cincinnati, OH · welcome@hellomentalhealth.com
