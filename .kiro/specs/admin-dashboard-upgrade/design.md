# Design Document — Admin Dashboard Upgrade

## Overview

This document describes the technical design for upgrading the Sale Market admin dashboard
(`admin.html`, `css/admin-upgrade.css`, `css/admin-mobile.css`, `js/admin-upgrade.js`) from its
current functional-but-plain state to a premium, professional seller panel.

The upgrade is purely presentational: no backend API contracts change, no new data models are
introduced, and all 13 business-logic functions already present in `admin.html`'s inline script
(`showNotice`, `showSection`, `loadDashboard`, `renderProducts`, `addProduct`, `logout`, etc.) are
preserved without modification. The design achieves the goals of Requirements 1–13 through layered
CSS overrides that sit on top of the existing base styles, plus small, well-contained JavaScript
extensions in `js/admin-upgrade.js`.

### Design Approach

The existing HTML already has three CSS layers:

1. **Base styles** — an inline `<style>` block at the top of `admin.html` (canonical structure,
   layout primitives, fallback tokens).
2. **Pro override block** — a second inline `<style id="market-admin-pro">` that already overrides
   many layout values with `!important`.
3. **External files** — `css/admin-upgrade.css` and `css/admin-mobile.css`, loaded at the bottom
   of `<head>`.

The upgrade focuses almost entirely on layers 2 and 3, plus `js/admin-upgrade.js`. The external CSS
files are given the final word because they are loaded last and use `!important` extensively. This
separation keeps all premium styling outside the HTML file, making future maintenance easier.

---

## Architecture

```
admin.html
├── <style>                    ← base layout tokens (DO NOT EDIT — minimal changes only)
├── <style id="market-admin-pro"> ← intermediate overrides (minor tweaks if required)
├── <link> css/admin-upgrade.css  ← PRIMARY premium styles (this file drives the upgrade)
├── <link> css/admin-mobile.css   ← responsive overrides for ≤ 900px / ≤ 480px
│
├── Inline <script>             ← ALL business logic (login, CRUD, toast, section nav)
│                                  Must not be modified by the upgrade
└── <script src="js/admin-upgrade.js"> ← upgrade helpers (search, animation hooks,
                                           sidebar toggle, settings persistence)
```

### Key Constraint

Because `admin-upgrade.css` is loaded after both inline style blocks, it wins specificity at equal
weight via `!important`. This means any token value defined in `:root` inside the CSS file will
shadow the inline `:root` values. The design deliberately uses CSS custom properties so that tokens
cascade correctly and a single change in one place propagates everywhere.

---

## Components and Interfaces

### 2.1 CSS Custom Properties — Design Token Foundation

All tokens are declared in `:root` inside `css/admin-upgrade.css`. The inline `:root` blocks in
`admin.html` define fallbacks that are overridden at load time.

**Token map (final resolved values):**

| Token | Value | Usage |
|---|---|---|
| `--adm-bg` | radial gradient on `#f5f7fb` | `body.market-body` background |
| `--adm-card` | `rgba(255,255,255,0.90)` | Panel/card backgrounds |
| `--adm-line` | `rgba(148,163,184,0.18)` | Borders throughout |
| `--adm-text` | `#0f172a` | Primary text |
| `--adm-muted` | `#64748b` | Secondary/caption text |
| `--adm-purple` | `#6d28d9` | Primary accent — buttons, active states |
| `--adm-purple-2` | `#7c3aed` | Gradient stop for active buttons |
| `--adm-yellow` | `#ffd400` | Secondary accent — icon badges, brand mark |
| `--adm-blue` | `#2563eb` | "Tasdiqlandi" status, in-progress |
| `--adm-green` | `#16a34a` | Success, "Yetkazildi" status, online indicator |
| `--adm-red` | `#dc2626` | Danger, delete, "Bekor qilindi" status |
| `--adm-shadow` | `0 24px 64px rgba(15,23,42,0.09)` | Panel depth shadow |
| `--adm-soft-shadow` | `0 12px 36px rgba(15,23,42,0.06)` | Card hover shadow |
| `--adm-radius` | `22px` | Panels, topbar |
| `--adm-radius-sm` | `16px` | Cards, inner components |
| `--adm-transition` | `0.28s cubic-bezier(0.4,0,0.2,1)` | All transitions |

**Typography:** `Inter, "Segoe UI", Arial, sans-serif` — set on `body.market-body` in
`admin-upgrade.css`. The `Inter` font is pulled from the existing `<head>` Google Fonts import
already in `admin.html`.

**Border radii convention:**
- 22px — major panels (`.panel`), topbar, login card
- 20px — stat cards, order items, product cards, category rows
- 16px — inner analytics cards, sidebar brand block
- 14px — inputs, buttons, insight rows, order fields
- 999px — status badges, pill labels

---

### 2.2 HTML Structure — Required Changes in admin.html

The existing HTML structure is largely correct. The following additions and modifications are needed:

#### 2.2.1 `<body>` class

Ensure `<body>` has `class="market-body"` so `admin-upgrade.css` body scoping rules activate.
**Status:** Already present.

#### 2.2.2 Sidebar — `.sidebar`

Current sidebar HTML structure (simplified):

```html
<div class="sidebar">
  <div class="brand"> ... </div>
  <div class="admin-profile-card"> ... </div>
  <nav class="menu"> ... </nav>
</div>
```

Required additions:
- Add `id="adminSidebar"` to `.sidebar` for the JS toggle.
- Inside `.brand`, add a `<div class="brand-mark">SM</div>` badge element and a text block:
  ```html
  <div class="brand">
    <div class="brand-mark">SM</div>
    <div>
      <h2>Sale Market</h2>
      <p>Sotuvchi kabineti</p>
    </div>
  </div>
  ```
  The `brand::after` pseudo-element in `admin-mobile.css` renders the hamburger/close icon
  automatically — no extra HTML needed.

- The `.admin-profile-card` must use a two-column grid with a `.admin-avatar` cell (44×44px) and
  `.admin-profile-main` cell. The bottom `#sidebarTodaySales` span lives inside
  `.admin-profile-sales`. **Status: Already present.**

- Each `.menu button` requires a `<span>` for the icon badge (emoji or text icon), followed by the
  label text:
  ```html
  <button id="menuDashboard" class="active" onclick="showSection('dashboard')">
    <span>📊</span> Boshqaruv paneli
  </button>
  ```
  All 10 menu items must follow this pattern.

#### 2.2.3 Topbar — `.topbar`

Required structure:
```html
<div class="topbar">
  <div class="admin-title-block">
    <h1 id="pageTitle">Boshqaruv paneli</h1>
    <p id="pageDesc">Bugungi holat, tushum va buyurtmalar nazorati.</p>
  </div>
  <div class="admin-top-actions">
    <label class="admin-global-search" for="adminGlobalSearch">
      <span>⌕</span>
      <input id="adminGlobalSearch" type="search"
             placeholder="Mahsulot yoki buyurtma qidirish..." />
    </label>
    <button class="admin-icon-btn" type="button" aria-label="Bildirishnomalar">🔔</button>
    <div class="admin-mini-avatar">A</div>
  </div>
</div>
```

**Status:** Already present in current `admin.html`. No changes required.

#### 2.2.4 Stats Grid — `.stats-grid`

Six cards, each containing:
```html
<div class="stat-card">
  <div class="stat-icon">📦</div>
  <span>Jami mahsulotlar</span>
  <strong id="statProducts">0</strong>
  <small>Faol katalog</small>
</div>
```

The `.stat-icon` div with nth-child coloring is the key addition. The `<small>` badge is optional
but adds polish. **Status: Already present with minor additions needed for `.stat-icon`.**

#### 2.2.5 Analytics Grid — `.analytics-grid`

Structure:
```html
<div class="analytics-grid">
  <!-- Wide chart column -->
  <div class="analytics-card analytics-card--wide">
    <div class="section-heading-row">
      <h4>Haftalik savdo</h4>
      <span class="analytics-total" id="weeklyTotal">0 so'm</span>
    </div>
    <div class="weekly-chart" id="weeklyChart">
      <!-- 7× .weekly-bar injected by JS -->
    </div>
  </div>

  <!-- Top products column -->
  <div class="analytics-card">
    <h4>Top mahsulotlar</h4>
    <div class="insight-list" id="topProductsList"></div>
  </div>

  <!-- Top categories column -->
  <div class="analytics-card">
    <h4>Top kategoriyalar</h4>
    <div class="insight-list" id="topCategoriesList"></div>
  </div>
</div>
```

Each `.weekly-bar` rendered by JS:
```html
<div class="weekly-bar">
  <span style="height: 120px"></span>  <!-- bar fill, height computed from max value -->
  <small>Dush</small>
</div>
```

Each `.insight-row` rendered by JS:
```html
<div class="insight-row">
  <span>1</span>
  <strong>Mahsulot nomi</strong>
  <b>24 dona</b>
</div>
```

**Status:** These elements need to be added/verified in `admin.html`.

#### 2.2.6 Order Detail Modal — `.odm-*`

The ODM drawer is already present. Required classes for mobile full-sheet behavior are driven by
`admin-mobile.css` — no HTML changes needed beyond confirming `.odm-overlay`, `.odm-drawer`,
`.odm-header`, `.odm-body`, `.odm-grid`, `.odm-field`, `.odm-actions`, `.odm-status-row`,
`.odm-btn-row` are all present.

---

### 2.3 JavaScript Interface — admin-upgrade.js

`js/admin-upgrade.js` is a self-contained IIFE that attaches to existing globals after DOM ready.
It must not shadow any inline function names. The module exposes or augments:

#### 2.3.1 `bindGlobalSearch()` — already implemented

Binds `#adminGlobalSearch` to `productSearch` filtering and order text search. On Enter, switches
to the products section. **No changes needed.**

#### 2.3.2 `enhanceSectionSwitching()` — already implemented

Wraps the global `window.showSection` to re-trigger `adminFadeUp` animation on each navigation.
Uses `requestAnimationFrame` to remove and re-add the `admin-section-active` class. **No changes
needed.**

#### 2.3.3 Mobile Sidebar Toggle — to be added

The mobile collapse behavior is CSS-driven (`max-height` transition on `.sidebar`), but the
`sidebar--open` class must be toggled by JavaScript when the user taps the brand row.

```javascript
function bindSidebarToggle() {
  const sidebar = document.getElementById('adminSidebar');
  if (!sidebar) return;

  const brand = sidebar.querySelector('.brand');
  if (!brand) return;

  brand.addEventListener('click', function () {
    sidebar.classList.toggle('sidebar--open');
  });

  // Collapse when a menu item is tapped on mobile
  sidebar.querySelectorAll('.menu button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.innerWidth < 900) {
        sidebar.classList.remove('sidebar--open');
      }
    });
  });
}
```

This function must be called inside the `ready()` callback.

#### 2.3.4 `renderWeeklySales(orders)` — augment existing hook

`loadDashboard()` already calls `renderWeeklySales(orders)`. The function must:
1. Group orders by day-of-week (Mon–Sun, last 7 calendar days).
2. Compute the max daily revenue for proportional bar heights.
3. Clear and re-populate `#weeklyChart` with 7 `.weekly-bar` divs.
4. Update `#weeklyTotal` with the formatted weekly sum.

Proportional height formula: `barHeightPx = Math.max(14, (dayRevenue / maxRevenue) * 148)`.

```javascript
function renderWeeklySales(orders) {
  const chart = document.getElementById('weeklyChart');
  const totalEl = document.getElementById('weeklyTotal');
  if (!chart) return;

  const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Sha'];
  const now = new Date();
  const buckets = Array.from({ length: 7 }, function (_, i) {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { label: days[d.getDay()], date: d.toDateString(), revenue: 0 };
  });

  orders.forEach(function (order) {
    const key = new Date(order.createdAt || order.date || 0).toDateString();
    const bucket = buckets.find(function (b) { return b.date === key; });
    if (bucket) {
      bucket.revenue += Number(order.total || 0);
    }
  });

  const maxRev = Math.max(...buckets.map(function (b) { return b.revenue; }), 1);
  const weekTotal = buckets.reduce(function (s, b) { return s + b.revenue; }, 0);

  chart.innerHTML = buckets.map(function (b) {
    const h = Math.max(14, Math.round((b.revenue / maxRev) * 148));
    return '<div class="weekly-bar">' +
      '<span style="height:' + h + 'px" aria-label="' + b.label + ': ' +
      b.revenue.toLocaleString('uz-UZ') + ' so\'m"></span>' +
      '<small>' + b.label + '</small>' +
      '</div>';
  }).join('');

  if (totalEl) {
    totalEl.textContent = weekTotal.toLocaleString('uz-UZ') + ' so\'m';
  }
}
window.renderWeeklySales = renderWeeklySales;
```

#### 2.3.5 `bindNotificationButton()` — already implemented

Shows "Yangi bildirishnoma yo'q" toast on click. **No changes needed.**

#### 2.3.6 `loadAdminSettings()` / `saveAdminSettings()` — already implemented

Persist store settings to `localStorage`. **No changes needed.**

---

## Data Models

No new data models are introduced. The upgrade reads the same JSON structures already consumed by
the inline admin script:

**Product** (from `data/products.json` / `localStorage`):
```
{ id, name, price, oldPrice, stock, category, subcategory, badge, shipping, sizes, colors,
  description, fullDescription, images[] }
```

**Order** (from `data/orders.json` / `localStorage`):
```
{ id, fullName, phone, address, total, items[], status, createdAt, paymentShot }
```

**Category** (from `data/categories.json` / `localStorage`):
```
{ id, name }
```

**Promo Code** (from `data/promocodes.json` / `localStorage`):
```
{ id, code, discount, type, minOrder, usedCount }
```

**Review** (from `data/reviews.json` / `localStorage`):
```
{ id, productId, author, rating, text, date }
```

**Admin Settings** (localStorage key `mujskoy_admin_settings`):
```
{ storeName, phone, deliveryPrice, minOrder }
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a
system — essentially, a formal statement about what the system should do. Properties serve as the
bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: Section mutual exclusion

*For any* section identifier in the valid set
`{dashboard, add, products, orders, categories, promocodes, reviews, settings}`, after
`showSection(id)` is called, exactly one section panel should be visible (i.e., lack the `hidden`
class) and all other seven panels should be hidden.

**Validates: Requirements 13.4**

---

### Property 2: renderProducts card count

*For any* array of N product objects (N ≥ 0), calling `renderProducts()` with that dataset
populated in localStorage should produce exactly N `.product-card` elements inside `#productsList`.

**Validates: Requirements 13.6**

---

### Property 3: loadDashboard stat completeness

*For any* combination of orders and products arrays, calling `loadDashboard()` should populate all
six stat elements (`#statProducts`, `#statOrders`, `#statTodayOrders`, `#statRevenue`,
`#statDeliveredOrders`, `#statCancelledOrders`) with numeric values that correctly reflect the
input data (product count, total order count, today's order count, total revenue, delivered count,
cancelled count).

**Validates: Requirements 13.10, 4.7**

---

### Property 4: Toast type-to-color mapping

*For any* call to `showNotice(text, type)` where `type` is `"success"` or `"error"`, the `#toast`
element should have class `"toast"` (no `toast--error`) when type is `"success"`, and class
`"toast toast--error"` when type is `"error"`. This must hold regardless of what the text content
is.

**Validates: Requirements 10.2, 13.11**

---

### Property 5: Toast auto-dismiss

*For any* valid `(text, type)` pair passed to `showNotice`, the `#toast` element should receive
the `"hidden"` class within 3100 milliseconds of the call, dismissing the notification
automatically.

**Validates: Requirements 10.4, 13.11**

---

### Property 6: Status badge class matches status string

*For any* order status string in the canonical set
`{yangi, tasdiqlandi, yuborildi, yetkazildi, bekor-qilindi}`, the rendered `.status-badge` element
should carry exactly the corresponding CSS class (`status-yangi`, `status-tasdiqlandi`,
`status-yuborildi`, `status-yetkazildi`, `status-bekor-qilindi`).

**Validates: Requirements 7.5**

---

### Property 7: Recent row render completeness

*For any* order object with defined `fullName`, `total`, `createdAt`/`date`, and `status` fields,
the corresponding `.recent-row` element rendered by `loadDashboard()` should contain each of those
four values in its inner text.

**Validates: Requirements 6.4**

---

### Property 8: Weekly total badge equals sum of daily revenues

*For any* array of order objects, the text content of `#weeklyTotal` after `renderWeeklySales()`
is called should be the formatted sum of `total` values for orders whose `createdAt`/`date` falls
within the last 7 calendar days.

**Validates: Requirements 5.6**

---

### Property 9: No horizontal overflow at any tested viewport

*For any* viewport width in the set `{360, 390, 480, 768, 980, 1280, 1440}` pixels, after the
admin shell is rendered, `document.body.scrollWidth` should be ≤ `window.innerWidth` (no
horizontal scrollbar produced).

**Validates: Requirements 12.7**

---

## Error Handling

### Login Errors

- If credentials do not match `ADMIN_USERNAME`/`ADMIN_PASSWORD` and the API is unavailable, the
  inline script displays the error message in `#loginMessage`. The upgrade does not touch this
  path.
- The `showNotice` function is never called on login failure — the inline login error display is
  used instead.

### API/localStorage Errors

- All `async` functions in the inline script are wrapped in `try/catch`. On error, they call
  `showNotice(message, "error")` which triggers the red toast.
- `admin-upgrade.js` uses `try/catch` in `readSettings()` to handle corrupted JSON gracefully,
  falling back to an empty object.

### Toast Edge Cases

- Multiple rapid `showNotice` calls: each call runs `clearTimeout(noticeTimer)` before setting a
  new timeout, so only the last message's 3-second countdown is active. The previous message is
  visually replaced immediately.
- If `#toast` is `null` (DOM not ready), `showNotice` will throw. The `ready()` wrapper in
  `admin-upgrade.js` ensures `bindGlobalSearch` etc. run after DOM is ready, but `showNotice` is
  defined inline and called inline — this is safe.

### Sidebar Toggle on Resize

- If the browser is resized from mobile to desktop while the sidebar is in `sidebar--open` state,
  the `max-height: 540px` from `.sidebar.sidebar--open` is irrelevant because the `max-height`
  rule only applies inside the `@media (max-width: 900px)` block. On desktop the sidebar reverts
  to `position: sticky; height: 100vh` naturally.

### Image Loading

- Product images use `onerror` or a `normalizeImage()` fallback to `img/placeholders/product.svg`
  — already implemented. The upgrade does not change image handling.

---

## Testing Strategy

### Dual Testing Approach

Unit/integration tests verify specific examples, edge cases, and error conditions. Property-based
tests verify universal behavioral properties across many generated inputs. Both layers are
necessary for comprehensive coverage.

The feature is primarily a CSS/UI upgrade, but the JavaScript layer (stat computation,
`renderProducts`, `showSection`, toast lifecycle, weekly chart rendering) contains pure or
near-pure functions that are well-suited to property-based testing.

### Property-Based Testing

**Library:** [fast-check](https://github.com/dubzzz/fast-check) (JavaScript/TypeScript PBT
library). Install with:

```
npm install --save-dev fast-check
```

Run with:

```
npx jest --testPathPattern=admin --passWithNoTests
```
or
```
npx vitest run src/__tests__/admin
```

Each property test must run a **minimum of 100 iterations** and be tagged with:

```
// Feature: admin-dashboard-upgrade, Property N: <property text>
```

**Property 1 implementation sketch — Section mutual exclusion:**
```javascript
// Feature: admin-dashboard-upgrade, Property 1: showSection mutual exclusion
import * as fc from 'fast-check';
const SECTIONS = ['dashboard','add','products','orders','categories','promocodes','reviews','settings'];

test('showSection hides all other sections', () => {
  fc.assert(fc.property(
    fc.constantFrom(...SECTIONS),
    (sectionId) => {
      setupMockDOM(); // inject section divs into jsdom
      window.showSection(sectionId);
      const visible = SECTIONS.filter(id => !document.getElementById('section' + capitalize(id)).classList.contains('hidden'));
      return visible.length === 1 && visible[0] === sectionId;
    }
  ), { numRuns: 100 });
});
```

**Property 2 implementation sketch — renderProducts card count:**
```javascript
// Feature: admin-dashboard-upgrade, Property 2: renderProducts card count
test('renderProducts produces N cards for N products', () => {
  fc.assert(fc.property(
    fc.array(fc.record({ id: fc.uuid(), name: fc.string({ minLength: 1 }), price: fc.nat(), images: fc.constant([]) })),
    (products) => {
      localStorage.setItem('mb_products', JSON.stringify(products));
      renderProducts();
      const cards = document.querySelectorAll('#productsList .product-card');
      return cards.length === products.length;
    }
  ), { numRuns: 100 });
});
```

**Property 4 implementation sketch — Toast color mapping:**
```javascript
// Feature: admin-dashboard-upgrade, Property 4: toast type-to-color mapping
test('showNotice sets correct class for any (text, type) pair', () => {
  fc.assert(fc.property(
    fc.string(),
    fc.constantFrom('success', 'error'),
    (text, type) => {
      showNotice(text, type);
      const toast = document.getElementById('toast');
      if (type === 'success') return !toast.classList.contains('toast--error');
      return toast.classList.contains('toast--error');
    }
  ), { numRuns: 100 });
});
```

**Property 8 implementation sketch — Weekly total:**
```javascript
// Feature: admin-dashboard-upgrade, Property 8: weekly total badge equals sum
test('renderWeeklySales weeklyTotal equals sum of last-7-day totals', () => {
  fc.assert(fc.property(
    fc.array(fc.record({ total: fc.nat({ max: 10_000_000 }), createdAt: fc.date() })),
    (orders) => {
      renderWeeklySales(orders);
      const now = new Date();
      const cutoff = new Date(now); cutoff.setDate(now.getDate() - 6);
      const expected = orders
        .filter(o => new Date(o.createdAt) >= cutoff)
        .reduce((s, o) => s + o.total, 0);
      const displayed = document.getElementById('weeklyTotal').textContent;
      return displayed.includes(expected.toLocaleString('uz-UZ'));
    }
  ), { numRuns: 100 });
});
```

### Unit / Example-Based Tests

| Test | Type | What it verifies |
|---|---|---|
| Login with valid credentials shows admin shell | EXAMPLE | Req 13.1 |
| Login with wrong credentials shows error message | EXAMPLE | Req 13.2 |
| `logout()` hides admin shell, shows login | EXAMPLE | Req 13.3 |
| Saving order status shows "Buyurtma statusi yangilandi" toast | EXAMPLE | Req 13.7 |
| Deleting an order shows "Buyurtma o'chirildi" toast | EXAMPLE | Req 13.8 |
| ODM drawer opens and closes | EXAMPLE | Req 13.9 |
| Input focus shows purple border | EXAMPLE | Req 3.4, 8.2 |
| Sidebar toggle adds `sidebar--open` class on tap | EXAMPLE | Req 2.9, 2.10 |
| Settings save shows "Sozlamalar saqlandi" | EXAMPLE | Req 11.5, 13.5 |
| `addProduct()` with valid data triggers success toast | EXAMPLE | Req 13.5 |

### Smoke / Snapshot Tests

These verify static CSS/configuration facts. They can be implemented as simple assertions against
the loaded stylesheet text or computed styles in a headless browser (e.g., Playwright):

| Check | Requirement |
|---|---|
| `--adm-purple` resolves to `#6d28d9` | Req 1.2 |
| `--adm-yellow` resolves to `#ffd400` | Req 1.2 |
| `body.market-body` has Inter font-family | Req 1.6 |
| `.stat-card` min-height ≥ 156px on desktop | Req 4.4 |
| `.toast` max-width is `min(360px, calc(100vw - 48px))` | Req 10.1 |
| `.sidebar` width is 268px on desktop | Req 2.1 |
| Inputs have `font-size` ≥ 14px on mobile | Req 12.8 |
| No horizontal scrollbar at 360px viewport | Req 12.7 (also covered by Property 9) |

### Responsive Testing Matrix

Manual/Playwright visual checks at each breakpoint:

| Viewport | Stats grid | Sidebar | Topbar | Order grid |
|---|---|---|---|---|
| 360px | 2 col | top bar collapsed | full-width, no border-radius | 2 col |
| 390px | 2 col | top bar collapsed | full-width | 2 col |
| 768px | 2–3 col | top bar collapsed | full-width | 2–3 col |
| 980px | 3 col | sticky left 268px | floating glass pill | 3 col |
| 1280px | 3 col | sticky left 268px | floating glass pill | 3 col |
| 1440px | 6 col | sticky left 268px | floating glass pill, max 1440px | 6 col |

---

## Responsive Breakpoint Strategy

The breakpoint cascade in `admin-upgrade.css` and `admin-mobile.css`:

```
1440px (max-width: none)
  └── 6-col stats, 3-col analytics, panel max-width 1440px, 28–36px padding

@media (max-width: 1280px)
  └── 3-col stats, 2-col analytics (chart full-width), 3-col order grid

@media (max-width: 980px)
  └── admin-shell → display:block (single column flow)
      sidebar → relative, width:auto, max-height:64px (collapsed bar)
      topbar → z-index:50, full-width, no border-radius
      menu → 2-col grid

@media (max-width: 900px)
  └── 2-col stats, analytics stacked, product card thumbnail 70px
      main padding: 12px
      topbar title: 18px, subtitle hidden

@media (max-width: 768px)
  └── toast → bottom anchor (bottom:16px, left:12px, right:12px)
      settings-grid → 1×1 col
      ODM drawer → full-height sheet from bottom

@media (max-width: 480px)
  └── stat-card min-height:72px, main padding:10px
      topbar title:16px
      product card thumbnail: 60px
      status-control → column layout

@media (max-width: 390px) / (max-width: 360px)
  └── Handled by the 480px block — no additional breakpoint needed;
      360px is the floor. The 2-col stats grid at 10px gap remains correct
      at 360px as each card is min 160px wide.
```

**Overflow guard** — applied at `@media (max-width: 1024px)` in `admin-mobile.css`:
```css
.admin-shell { max-width: 100vw !important; overflow-x: hidden !important; }
body.market-body { overflow-x: hidden !important; }
```

---

## Component-Level Design Reference

### Sidebar (`.sidebar`)

```
┌──────────────────────────────┐
│ [SM]  Sale Market            │  ← .brand (dark navy gradient)
│       Sotuvchi kabineti      │
├──────────────────────────────┤
│ [A]  Admin          ● Faol   │  ← .admin-profile-card
│       Bugungi savdo: X so'm  │
├──────────────────────────────┤
│ [📊] Boshqaruv paneli        │  ← .menu button.active (purple gradient)
│ [+]  Mahsulot qo'shish       │
│ [☰]  Mahsulotlar             │
│ [📋] Buyurtmalar             │
│ [🏷] Kategoriyalar           │
│ [🎫] Promokodlar             │
│ [⭐] Sharhlar                │
│ [⚙]  Sozlamalar              │
│ [←]  Saytga qaytish          │
│ [↩]  Chiqish                 │
└──────────────────────────────┘
```

### Topbar (`.topbar`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Boshqaruv paneli                  [⌕ Mahsulot yoki buyurtma qidirish…] [🔔] [A] │
│  Bugungi holat, tushum va buyurtmalar nazorati.                                  │
└─────────────────────────────────────────────────────────────────────────┘
sticky top:16px, border-radius:22px, glass blur
```

### Stat Cards (`.stats-grid` 6 columns)

```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ [📦]   │ │ [📋]   │ │ [📅]   │ │ [💰]   │ │ [✓]    │ │ [✗]    │
│Jami    │ │Jami    │ │Bugungi │ │Umumiy  │ │Yetka-  │ │Bekor   │
│mahsulot│ │buyurt. │ │buyurt. │ │tushum  │ │zildi   │ │qilindi │
│  124   │ │  38    │ │  5     │ │8.4 mln │ │  31    │ │  2     │
│Faol    │ │        │ │        │ │        │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

### Analytics Grid (`.analytics-grid`)

```
┌──────────────────────────────────────┬─────────────────┬─────────────────┐
│  Haftalik savdo       [1,240,000 so'm]│  Top mahsulotlar│ Top kategoriyalar│
│  ▐▐ ▐▐▐ █ ▐▐▐ ▐▐ ▐▐▐ █              │  1. Mahsulot A  │  1. Kategoriya X │
│  Dush Sesh Chor Pay Jum Sha Yak      │  2. Mahsulot B  │  2. Kategoriya Y │
└──────────────────────────────────────┴─────────────────┴─────────────────┘
```

### Order Card (`.order-item`)

```
┌─────────────────────────────────────────────────────────┐
│  BUYURTMA #                            [● Yangi]        │
│  Abdullayev Jasur                                       │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│ TELEFON  │ MANZIL   │ JAMI     │ TO'LOV   │ VAQT       │
│ +998 …   │ Toshkent │ 245,000  │ Naqd     │ 12.05.2025 │
├──────────┴──────────┴──────────┴──────────┴────────────┤
│  Mahsulot 1 × 2, Mahsulot 2 × 1                        │
│  [To'lov skrini]                                        │
├─────────────────────────────────────────────────────────┤
│  [Holat dropdown ▼]  [Holatni saqlash]  [O'chirish]    │
└─────────────────────────────────────────────────────────┘
```
