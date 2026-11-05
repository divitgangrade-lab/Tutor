# Security notes

This repository is a **static, client-side demo**. It is suitable for showing the academy, taking a meeting request through a Gmail draft, and demonstrating the portals. It is not yet suitable for storing real student records.

## Threat model

| Risk | Current control | Residual risk |
| --- | --- | --- |
| XSS through names, notes, plans, feedback | Every dynamic value is escaped with `MoodySecurity.esc` before markup; a payload test passes | A future edit that bypasses `esc` could reintroduce XSS |
| Unauthorized grade/assignment changes | Instructor mutations require an instructor session in `store.js`; UI routes are guarded | Client-side checks can be bypassed by a user with devtools |
| Unauthorized portal access | Portal and console views are not rendered without a session; sessions expire after 45 idle minutes | Session state lives in `sessionStorage`, not a server |
| Credential guessing | Five failures lock a login form for 60 seconds | Lockout is in memory and resets on reload |
| Third-party script injection | CSP restricts scripts, styles, fonts, images, and forms to the site | `style-src` requires `'unsafe-inline'` for progress-bar widths |
| Payment data exposure | No payment fields, no processor, no card data collected | Payment is cash in person by design |
| PII leakage | Data stays in the browser and in the Gmail draft the family sends | `localStorage` is readable by same-origin scripts; requests are per-browser |

## Demo credentials are public

`js/store.js` contains `TEST` / `TEST` and the instructor secret `TEST`. That is intentional for testing and **is not security**. Anyone can read the file.

Before using this with real families:

1. Remove the demo credentials from the client.
2. Add server-side authentication with hashed passwords, secure, HTTP-only cookies, CSRF protection, and server-enforced roles.
3. Move students, assignments, grades, invoices, and requests to a database with per-family authorization checks.
4. Send meeting requests through a server-side email provider rather than a Gmail draft.
5. Add rate limiting, audit logging, backups, and a privacy/retention policy on the server.
6. Replace the CSP meta tag with a real HTTP response header, including `frame-ancestors 'none'`.
7. Serve over HTTPS only.

## Reporting

If you find a security issue in this demo, do not include personal data in a public issue. Contact the repository owner directly.
