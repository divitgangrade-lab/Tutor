# Moody & Co. Academy

A static tutoring storefront and family portal for grades 1–8 English, Math, and Science, plus George H. Moody IB application coaching. No build step, no framework, no online payment.

## Run it

```bash
cd Tutor
python3 -m http.server 8000
```

Open <http://localhost:8000>. The site uses hash routing, so every page is a normal static URL after the `#`.

Deploying to GitHub Pages works as-is: all asset paths are relative and there is no server code.

## Demo access

| Area | Username | Password | Secret word |
| --- | --- | --- | --- |
| Family & student portal | `TEST` | `TEST` | — |
| Instructor console | `TEST` | `TEST` | `TEST` |

The instructor console is at `#/instructor` and is also linked from the footer. Family and student share one login; switch views after signing in.

## What is included

**Public site**
- Full-screen neutral storefront with a plan finder.
- Science (sci-fi), Math (Matrix), and English (storybook) rooms, each with its own atmosphere.
- A Moody IB room with a five-plan admissions path and eight-week timeline.
- Eight grade courses per subject, priced from $20 (grade 1) upward.
- Five signature plans per subject, each with a full specification modal.
- Monthly (4-class, 10% off) and semester (8-class, 15% off) bundles with a live calculator.
- Specialty Center with six focused services, including application and essay review.
- Cart drawer, quantity controls, and a three-step meeting request.
- The request opens a pre-filled Gmail draft addressed to the instructor. It states that the family plans to meet and will pay cash in person.
- No card fields, no online payment, no automatic charge.

**Family and student portal**
- Guarded behind the family login.
- Parent view: averages by subject, attendance, open work, recent feedback, cash invoices, and a meeting request shortcut.
- Student view: assignments, submission modal, scores, and instructor feedback.
- The student uses the same family login and switches views.

**Instructor console**
- Requires username, password, and a separate secret word.
- Overview, student roster, assignment creation/editing/deletion, gradebook, and meeting requests.
- Scores are clamped to each assignment's points. Request statuses can be updated.
- Demo reset restores the seeded data and clears sessions.

## Pricing model

Grade courses use this single-class ladder:

| Grade | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Science / English | $20 | $22 | $25 | $30 | $34 | $40 | $45 | $50 |
| Math | $20 | $22 | $25 | $30 | $34 | $40 | $45 | $52 |

Bundles are calculated from the single-class rate:

- Month (4 classes): 10% off, rounded up to the next dollar.
- Semester (8 classes): 15% off, rounded up to the next dollar.
- Discounts are capped at 15%, so no bundle falls below 85% of list value.

Signature plans are fixed-price packages and are not discounted further.

## Where data lives

- Browser `localStorage` key `moodyAcademy.data.v2`: cart, students, assignments, invoices, and meeting requests.
- Browser `sessionStorage` key `moodyAcademy.sessions.v2`: family and instructor sessions, expiring after 45 minutes of inactivity.

This means the demo is per-browser. A meeting request submitted on a visitor's computer is delivered by the Gmail draft, not by a server. The instructor's request list only shows requests made in that same browser. The same applies to grades and submissions: multi-device tutoring needs a real backend.

Use **Reset demo data** in the instructor overview to restore the seeded state.

## Security notes

Implemented in this build:

- All dynamic text is escaped before it reaches `innerHTML`; an XSS payload test against meeting requests passes.
- A Content Security Policy limits scripts, styles, fonts, images, and forms to the site itself.
- Instructor-only mutations are rejected in the store when no instructor session exists, in addition to the UI guard.
- Portals are not rendered without a valid session; the instructor route never renders the console without the secret word.
- Family and instructor login forms lock for 60 seconds after five failed attempts.
- Sessions are stored in `sessionStorage`, not persistent cookies, and expire after 45 minutes idle.
- No secrets are placed in URLs or logs.
- No online payment data is collected at all.

This is still a **client-side demo**, not a production student information system:

- The credentials are in `js/store.js` and are visible to anyone who reads the source. Change them and move authentication to a server before real use.
- `localStorage` is readable by scripts on the same origin. Do not put real student records in this build.
- There is no email API. The Gmail draft requires the visitor to press Send, and the instructor still receives it by email.
- There is no server, so there is no true access control, audit trail, or backup.

See [SECURITY.md](SECURITY.md) for the production checklist.

## Project layout

```text
index.html          app shell and CSP
css/base.css        tokens, themes, typography, buttons, forms
css/components.css  header, footer, overlays, cart, plan cards, tables
css/views.css       home, rooms, IB, specialty, checkout, login, portal, admin
js/security.js      escaping, validation, safe storage, copy/download helpers
js/data.js          catalogue, pricing ladder, plans, services, FAQ
js/store.js         state, cart, auth, students, assignments, requests
js/ui.js            shared shell, modals, cart drawer, canvas atmosphere
js/pages/home.js    storefront and plan finder
js/pages/hubs.js    Science, Math, English, Moody IB
js/pages/specialty.js
js/pages/checkout.js
js/pages/portal.js  family/student login and portal
js/pages/admin.js   instructor console
js/app.js           hash router, delegated actions, form handlers
```

## Verification performed

- `node --check` on every JavaScript file.
- jsdom smoke test from a local HTTP server covering: home, plan finder, all grade cards, plan modal, bundle calculator, cart badge and drawer, three-step checkout, Gmail request creation, family login, parent stats, student assignment submission, instructor secret login, assignment creation, grading, requests, console lock, signed-out portal guard, and instructor mutation guard.
- jsdom security test covering: empty-cart state, Math/English/IB/Specialty routes, cart code resolution, quantity changes, 404 route, escaped XSS payload, student creation, wrong secret rejection, and login lockout.
- Both suites pass with no unexpected runtime errors.

Not performed: a real-browser visual pass across viewport sizes. The CSS is responsive and print-aware, but layout should still be reviewed in Chrome/Safari on desktop and phone before publishing.
