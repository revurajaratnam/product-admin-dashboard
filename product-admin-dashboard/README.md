# Product Admin Dashboard

A production-style admin dashboard for managing a product catalog, built on
the public [DummyJSON](https://dummyjson.com) API. Built with the Next.js
App Router, plain React state (no React Query/SWR), and a hand-rolled
pagination/search/filter/sort layer as required by the assignment brief.

## Features

- Login against DummyJSON (`emilys` / `emilyspass`) with validation, loading
  state, error handling, and duplicate-submit protection.
- Route protection via `src/middleware.js` — unauthenticated users are
  redirected to `/login` (with a `from` param to return them afterwards);
  authenticated users are bounced off `/login`.
- Logout that clears local/session state and redirects to `/login`.
- Product list with a responsive table (desktop) / card list (mobile),
  showing image, title, category, price, rating, and stock.
- Hand-written pagination (`skip`/`limit` math), with page-size selector
  (10/20/50), page numbers, Previous/Next, and a "Showing X–Y of Z" summary.
- Debounced search (`useDebounce`) with **request cancellation** via
  `AbortController` so a slow, stale request can never overwrite a newer
  one — verified against DummyJSON's `&delay=2000` param.
- Category filter, with a documented strategy for the search+category
  limitation (see below).
- Sortable columns (Title / Price / Rating, asc/desc).
- Full URL state: `page`, `limit`, `search`, `category`, `sort`, `order` are
  all reflected in the URL, are safe to refresh/share, and are validated by
  `src/lib/queryParams.js` so malformed values never crash the app.
- Product details page with image gallery and reviews.
- Add / Edit product forms with field-level validation and duplicate-submit
  protection.
- Delete with a confirmation modal.
- A client-side "session overlay" (`src/lib/overlay.js`) that makes
  add/edit/delete look and feel persistent for the rest of the session, to
  work around DummyJSON not actually storing writes (see below).
- Loading, empty, and error states (with Retry) everywhere data is fetched.
- Toast notifications for success/failure of key actions.
- Responsive layout (sidebar + header shell, table → cards on mobile, no
  horizontal overflow).

## Tech Stack

Next.js (App Router) · React · Tailwind CSS · Axios · DummyJSON

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Then open http://localhost:3000 — you'll be redirected to `/login`.

## Build

```bash
npm run build
npm run start
```

## Environment Variables

None required. The DummyJSON base URL is hardcoded in `src/lib/axios.js`
since it's a public, keyless API.

## Demo Login

```
username: emilys
password: emilyspass
```

## API

https://dummyjson.com — `/auth/login`, `/products`, `/products/search`,
`/products/category/:slug`, `/products/categories`, `/products/:id`,
`/products/add`, `/products/:id` (PUT/DELETE). Reviews are read from the
`reviews` array already embedded on each product object.

## Architecture

```
src/
  app/            Next.js App Router pages (login, products list/detail/new/edit)
  components/      layout | auth | products | common — UI only, no Axios calls
  lib/             axios instance, auth storage, validation, URL-param parsing,
                    the CRUD "overlay", misc utils
  services/        authService.js, productService.js — the only files that
                    call the shared Axios instance
  hooks/           useAuth, useProducts, useDebounce
  middleware.js    route protection
```

Data flow is strictly: **UI → hook → service → Axios instance → DummyJSON**.
No component imports Axios directly.

## Authentication

`authService.login()` calls `POST /auth/login` and returns DummyJSON's
token + user profile. `useAuth` stores that via `lib/auth.js` in **both**
`localStorage` (read by the Axios request interceptor to attach
`Authorization: Bearer <token>` to every request) and a cookie (read by
`middleware.js`, which runs on the edge and has no access to
`localStorage`). A 401 response globally clears auth via the Axios response
interceptor. Duplicate login clicks are ignored with a `useRef` submission
guard while a request is in flight.

## Pagination

DummyJSON paginates with `limit`/`skip`. We compute
`skip = (page - 1) * limit` in `useProducts`, and after each response
compute `totalPages = Math.ceil(total / limit)`. If the URL's `page` is out
of range once the real total is known (e.g. `?page=999999`), it's clamped
back into range and the URL is corrected.

## Search

`ProductSearch` keeps local input state for instant typing, and only pushes
a debounced value (400ms, `useDebounce`) up to the URL/query. `useProducts`
aborts the previous in-flight request (`AbortController`) whenever a new
one starts, and additionally tags every request with an incrementing id so
a response that somehow resolves after being aborted can never overwrite
newer state. Verified against DummyJSON's `&delay=2000` test parameter.

## Search + Category Limitation

DummyJSON's `/products/search` endpoint cannot be combined with the
`/products/category/:slug` endpoint — they're mutually exclusive routes.
**Chosen strategy:** when a search term is active, we hit `/products/search`
and, if a category is *also* selected, filter those search results
client-side by `category`. The category `<Select>` stays enabled and shows
a small note ("Applied on top of your search results") so the behavior is
visible rather than silently wrong. When there's no active search, the
category filter uses the real `/products/category/:slug` endpoint (server
paginated, as usual).

## CRUD Limitation

DummyJSON's add/update/delete endpoints respond as if the write succeeded
but **do not persist it** — the next `GET` behaves as though nothing
happened. `src/lib/overlay.js` keeps a small `sessionStorage`-backed layer
of `{ added, edited, deleted }` that's applied on top of every list/detail
response for the rest of the browser session: added products are prepended
to page 1, edits are merged onto matching items, and deleted ids are
filtered out everywhere. This is explicitly a workaround for the demo API,
not a real persistence layer — refreshing the tab keeps it (sessionStorage),
but a new session starts clean.

## URL State

`page`, `limit`, `search`, `category`, `sort`, `order` all live in the URL
and are the single source of truth for `/products`. `lib/queryParams.js`
parses and validates every value (invalid page/limit/sort/order values fall
back to safe defaults instead of crashing), so the page is safe to refresh
or share.

## Error Handling

`src/lib/axios.js` centralizes error handling in a response interceptor:
network errors, 401 (clears auth), 400, and 404 are normalized into a
consistent `{ status, message }` shape so components never touch raw Axios
errors. Cancelled requests are tagged `isCancel` and silently ignored
instead of surfacing as errors.

## AI Usage

This project was scaffolded end-to-end with Claude, based on a detailed
written specification. Claude generated the project structure, all
components/hooks/services, the URL-state and search-cancellation logic, and
this README. The author is expected to be able to explain every file — see
"Assignment Notes" below for the specific technical decisions worth being
able to talk through in an interview.

---

# Assignment Notes

1. **Design/implementation choices** — Kept UI state (form inputs, modal
   open/close) in components, but made `/products`' filter/sort/page state
   live entirely in the URL via `next/navigation`'s `useSearchParams` +
   `router.replace`. That makes the page bookmarkable/shareable and gives
   "state on refresh" for free, at the cost of a slightly more involved
   `updateQuery` helper than local `useState` would need.

2. **One significant problem encountered** — DummyJSON's search endpoint
   and category endpoint are separate routes with no way to combine them
   server-side, which conflicts with the assignment wanting both filters
   available together.

3. **How it was fixed** — Search takes precedence and hits
   `/products/search`; if a category is also selected, it's applied as a
   client-side `.filter()` on top of the (already paginated) search
   results, with a small UI note so the tradeoff (filtering only within the
   current search page, not the whole catalog) is visible rather than
   hidden.

4. **Where AI helped** — Generating the full file scaffold from the spec,
   the `AbortController` + request-id race-condition guard in
   `useProducts`, and the URL query-param validation/clamping logic.

5. **DummyJSON limitations** — Auth is stateless (no real session revoke);
   add/edit/delete don't persist past the current response. Handled with
   the `sessionStorage` overlay described above, documented here rather
   than silently pretended away.

6. **Search/category decision** — See "Search + Category Limitation" above.

7. **Race-condition solution** — Every fetch in `useProducts` aborts the
   previous request via `AbortController` *and* is tagged with an
   incrementing `requestId`; a response is only applied to state if its id
   still matches the latest request when it resolves. Tested manually by
   appending `&delay=2000` to slow requests down while typing quickly.
