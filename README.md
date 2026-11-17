# Gatherkit — a free online RSVP tool

Gatherkit is an open-source RSVP tool for weddings, birthdays, baby showers, and every other celebration. Guests get a personal link, reply yes / no / maybe, and the host sees who is coming. The same app sends invitations, checks guests in with a QR code, publishes a celebration website, and lists local vendors from Google.

The app you see in the screenshots is branded **CelebrateSmartly**. Gatherkit is the name of this open-source project. It is a working prototype, built and used over two months.

![Free online RSVP tool home page with event planning, guest management, and local vendor discovery](docs/images/rsvp-tool-home.jpg)

## Why people look for an RSVP tool

Hosts search for a free online RSVP, a wedding RSVP page, a birthday RSVP, or an RSVP tracker because spreadsheets and group chats lose replies. Gatherkit is that tool, plus the rest of the plan in one place:

- A page the guest can answer on a phone
- A tracker the host can trust
- A guest list that is not a spreadsheet
- A QR code for the door
- A public celebration page
- Vendors near the venue, loaded from Google

## Features

### Free online RSVP

Each guest gets a link. They open it, see the event, and answer:

- Yes, I'll attend
- Can't attend
- Maybe
- A short note to the host

The form closes after the event date. One event can have sub-events, so a wedding can collect a separate RSVP for the ceremony, the reception, and the brunch.

### RSVP tracker

The host dashboard shows who replied, who has not, and the headcount. Invitation history can be exported to CSV. This is the RSVP tracker people expect when they search for one: one list, current answers, no chasing texts.

### Guest lists and email invitations

- Create guest lists and attach them to an event
- Add guests with name and email
- Send the invitation by email
- Each invitation has its own link and token
- Guests can verify an invitation before they reply

### QR code RSVP and check-in

Invitations can carry a QR code. At the door, the host scans it and confirms the guest. Useful for weddings and any party where you want to know who actually arrived, not only who clicked "yes".

### Celebration website

A visual editor (GrapesJS) builds a public page for the event. Share one link for the story, the schedule, and the RSVP, instead of a PDF and a group chat.

### Local vendor listing, loaded from Google

Search by zip code, category, and radius (10, 25, 50, or 100 miles). Results come from the Google Places API: name, address, phone, website, rating, review count, photos, and directions.

Repeat searches are cached and refreshed about every 30 days, so the list stays fast and does not call Google for the same zip code every time. Hosts can open a vendor, save favorites, and look back at recent searches.

![Local event vendor search by zip code, category, and radius](docs/images/local-vendor-search.jpg)

### Home page and event types

The home page is the front door: plan an event, find a vendor, or start free. Browse Events covers the occasions people actually plan:

- Weddings
- Birthday parties
- Baby showers
- Anniversaries
- Graduation celebrations
- Corporate events
- Holiday parties
- House parties

![Browse events page for weddings, birthdays, baby showers, and other celebrations](docs/images/browse-events.jpg)

### Wedding tools

Two free tools sit next to the RSVP flow:

- **Wedding speech writer** — best man, maid of honor, parents, and the wedding party. Pick a tone (heartfelt, funny, traditional, a poem) and get a draft you can copy or download.
- **Personalized vows** — names, how you met, what you love about them, and a tone. Copy or download the draft.

Both tools are in the prototype. They draft from the form today. Connecting them to your own OpenAI key is the next step, and the theme generator already calls OpenAI from a Supabase function.

### Also included

- Accounts and an organizer dashboard
- AI event themes
- Blog, about, contact, FAQ, and help pages
- A free plan while the product is in beta

## Who it is for

- A couple that wants a free wedding RSVP page, not another paid guest app
- A host planning a birthday, baby shower, or house party
- Anyone who searched "is there an RSVP app" and wanted the guest list, the replies, and the check-in together
- Developers who want to self-host an RSVP tool instead of renting one

## How a guest RSVPs

1. The host creates the event and adds the guest list.
2. Gatherkit emails a personal RSVP link (and can include a QR code).
3. The guest answers yes, no, or maybe.
4. The host watches the RSVP tracker and scans QR codes at the door.

## Stack

- Vite, React, TypeScript
- Tailwind CSS and shadcn/ui
- Supabase for auth, database, and edge functions
- Google Places for vendor search
- Brevo for invitation email
- GrapesJS for the celebration page

## What is in the database backup

`supabase/schema.sql` is safe to publish. It was checked after the dump.

It contains the public tables, functions, triggers, and row-level security. It does not contain a single saved row. There are no accounts, guest names, guest emails, RSVP replies, invitation tokens, vendor records, or API keys. The word `INSERT` appears only inside functions that run later, when a new person signs up on their own database.

`supabase/migrations` is the same empty structure plus starter rows that are not personal: event categories, membership tiers, a few sample states, FAQs, and website templates. Do not replace either file with `supabase db dump --data-only`. That command would copy your guests.

## Set it up

You need Node.js 20 or newer, npm, and Docker Desktop. Docker is what runs the local database. You do not need the original CelebrateSmartly project, and you do not import anyone's guests.

### 1. Clone and install

```sh
git clone https://github.com/sandeep-singh-ai/CelebrateSmartly.git
cd CelebrateSmartly
cp .env.example .env
npm install
```

### 2. Start a local database

```sh
npx supabase start
```

The first run downloads the Supabase containers. When it finishes, it prints an API URL and an anon key. Copy those into `.env`:

```sh
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=the_anon_key_from_supabase_start
VITE_APP_URL=http://localhost:8080
```

If the banner scrolled away:

```sh
npx supabase status
```

This applies `supabase/migrations`. Those files add starter categories, FAQs, and templates. They do not add users. Two files are dated earlier than the tables they change, so a new database can stop while creating `invitation_tracking` or `event_categories`. If `npx supabase start` stops there, load the structure backup into the local database:

```sh
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/schema.sql
```

That file creates empty tables. The first account you make in the app is the first user. No guests are imported.

### 3. Start the app

```sh
npm run dev
```

Open http://localhost:8080. Choose **Get Started**, create an account, and confirm the email from the local inbox at http://localhost:54324. That account exists only in your Docker database.

### 4. Optional services

The RSVP pages, guest lists, and dashboard work with only the steps above. These services add email, vendor search, and theme generation. Put the keys in `.env` for the browser, and set the same secrets for the edge functions. Never commit the filled-in files.

| Feature | Browser `.env` | Function secret |
| --- | --- | --- |
| Invitation email | `VITE_BREVO_API_KEY` | `BREVO_API_KEY` |
| Vendor search from Google | `VITE_GOOGLE_PLACES_API_KEY` | `GOOGLE_PLACES_API_KEY` |
| AI event themes | | `OPENAI_API_KEY` |

Serve the functions locally after you export the secrets:

```sh
npx supabase functions serve --env-file .env
```

On a hosted Supabase project, set the secrets in the dashboard under Edge Functions, then deploy the folders in `supabase/functions`.

### 5. Use your own hosted Supabase project instead of Docker

Create a project at https://supabase.com/dashboard. Open the SQL Editor, paste `supabase/schema.sql`, and run it. In Project Settings → API, copy the project URL and the anon key into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Then run `npm run dev`.

Use a new project. Do not point `.env` at a database that already has real guests.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app at http://localhost:8080 |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npx supabase start` | Start the local database |
| `npx supabase status` | Show the local URL and anon key |
| `npx supabase stop` | Stop the local database |

## Status

Working prototype. The RSVP flow, guest lists, QR check-in, celebration pages, and Google vendor search are in the app. Wedding speech and vows writers draft from the form and are ready for a real model key.

## Contribute

Changes land on `master` only through a pull request. Do not push commits straight to `master`.

1. Fork https://github.com/sandeep-singh-ai/CelebrateSmartly and clone your fork.
2. Create a branch from `master`:

```sh
git checkout master
git pull
git checkout -b fix-rsvp-email
```

3. Make the change. Run `npm run lint` and `npm run build` before you open the request.
4. Push the branch to your fork and open a pull request into `sandeep-singh-ai/CelebrateSmartly`, base branch `master`.
5. Describe what changed and how you tested it. Wait for the pull request to be merged. A green "Merge" on the pull request is what updates `master`.

The repository owner turns this into a hard rule under **Settings → Branches → Add branch ruleset** (or **Add classic branch protection rule**) for `master`:

- Require a pull request before merging
- Do not allow bypassing the rule
- Block force pushes

Until that rule is on, GitHub will still accept a direct push. The pull request is the required path either way.

## Before you publish this repo

- Keep `.env` private. Real keys stay on your machine and on the host.
- Do not commit a database dump that includes guests, RSVPs, or auth users.
- Rotate any key that has lived in a file, a chat, or a screenshot.

## License

[MIT](LICENSE). You can use, change, and share this project. Include the copyright notice when you do.
