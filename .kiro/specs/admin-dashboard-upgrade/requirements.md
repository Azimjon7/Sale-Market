# Requirements Document

## Introduction

This feature upgrades the admin dashboard UI/UX for the Sale Market marketplace project. The goal is to transform `admin.html` from a functional-but-plain interface into a premium, professional seller panel inspired by Uzum Seller and Yandex Market seller dashboards — while preserving every piece of existing functionality (login, logout, sidebar navigation, product management, order management, toast notifications, and the order detail modal/drawer). All visible UI text must remain in Uzbek.

The upgrade targets `admin.html`, `css/admin-upgrade.css`, and `css/admin-mobile.css`. No public pages are touched. No backend logic is changed.

---

## Glossary

- **Admin_Shell**: The root two-column grid layout (`admin-shell`) containing the sidebar and main content area.
- **Sidebar**: The left navigation panel (`.sidebar`) containing the brand logo, admin profile card, and menu buttons.
- **Topbar**: The sticky top header bar (`.topbar`) inside the main area, containing the page title, global search, notification icon, and avatar.
- **Stats_Grid**: The six-card statistics row (`.stats-grid`) showing key KPI numbers on the dashboard.
- **Stat_Card**: An individual KPI card (`.stat-card`) within the stats grid.
- **Analytics_Grid**: The three-column analytics section (`.analytics-grid`) containing the weekly chart, top products, and top categories.
- **Weekly_Chart**: The bar chart (`.weekly-chart`) inside the analytics grid showing 7-day revenue.
- **Insight_Row**: A single row (`.insight-row`) in the top-products or top-categories lists.
- **Dashboard_Recent**: The recent orders list (`.dashboard-recent`) at the bottom of the dashboard section.
- **Recent_Row**: A single order row (`.recent-row`) within the dashboard recent list.
- **Panel**: A white/glass content card (`.panel`) wrapping each admin section.
- **Order_Item**: A single order card (`.order-item`) within the orders section list.
- **Order_Grid**: The info-field grid (`.order-grid`) inside each order card.
- **Status_Badge**: A colored pill label (`.status-badge`) indicating order status.
- **Status_Control**: The row (`.status-control`) containing the status dropdown and save/delete buttons.
- **Product_Card**: A horizontal list row (`.product-card`) in the products section.
- **Upload_Box**: The dashed drag-and-drop file upload area (`.upload-box`).
- **Toast**: The small fixed top-right notification popup (`#toast`, `.toast`).
- **Brand_Mark**: The logo badge (`.brand-mark`) in the sidebar brand area.
- **Admin_Profile_Card**: The admin user info card (`.admin-profile-card`) below the brand in the sidebar.
- **Menu_Button**: A sidebar navigation button (`.menu button`).
- **ODM_Drawer**: The order detail modal/drawer (`#orderDetailOverlay`, `.odm-drawer`).

---

## Requirements

### Requirement 1: Design Token Foundation

**User Story:** As an admin, I want the entire dashboard to use a consistent premium color palette and spacing system, so that every section looks cohesive and professional.

#### Acceptance Criteria

1. THE Admin_Shell SHALL use a soft radial-glow gradient background with base color `#f5f7fb`, purple radial glow at top-left using `rgba(124, 58, 237, 0.12)`, and yellow radial glow at top-right using `rgba(255, 212, 0, 0.14)`.
2. THE Admin_Shell SHALL define the primary accent color as `#6d28d9` (purple) and the secondary accent as `#ffd400` (yellow).
3. THE Admin_Shell SHALL use `#0f172a` as the dark navy text color and `#64748b` as the muted text color.
4. THE Admin_Shell SHALL use green `#16a34a` for success states, red `#dc2626` for danger/delete states, and blue `#2563eb` for in-progress states.
5. THE Admin_Shell SHALL use border-radius values of 16px–24px for cards and panels, and 10px–14px for inputs and buttons.
6. THE Admin_Shell SHALL load the Inter font family as the primary typeface.

---

### Requirement 2: Sidebar — Premium Navigation

**User Story:** As an admin, I want a premium sidebar that feels like a professional marketplace seller panel, so that navigation is clear, fast, and visually impressive.

#### Acceptance Criteria

1. THE Sidebar SHALL have a fixed width of 268px on desktop (≥ 980px) and be sticky with `height: 100vh` so it does not scroll away.
2. THE Sidebar SHALL have a white glass background `rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(22px)` and a right-side box shadow.
3. THE Brand_Mark area (`.brand`) SHALL use a dark navy-to-indigo gradient background (`#0f172a` → `#1e1b4b` → `#312e81`), display the "SM" badge in yellow, the store name "Sale Market" in white at 20px, and the subtitle "Sotuvchi kabineti" in semi-transparent white.
4. THE Admin_Profile_Card SHALL display in a two-column grid (44px avatar column + flexible info column), show "Admin" as the name and a green "Faol" online indicator, and display today's sales figure (`#sidebarTodaySales`) at the bottom.
5. WHEN a Menu_Button is in its default state, THE Sidebar SHALL render it with transparent background, `#475569` text color, and a subtle purple icon badge using `rgba(109, 40, 217, 0.07)` background.
6. WHEN a Menu_Button is hovered, THE Sidebar SHALL apply a purple-tinted background `rgba(109, 40, 217, 0.06)` and slide the button 4px to the right via `translateX(4px)`.
7. WHEN a Menu_Button is in the active state, THE Sidebar SHALL apply a purple gradient background (`#6d28d9` → `#7c3aed` → `#a855f7`), white text, and a yellow icon badge, with a purple drop shadow.
8. THE Sidebar SHALL display all menu items in Uzbek: Boshqaruv paneli, Mahsulot qo'shish, Mahsulotlar, Buyurtmalar, Kategoriyalar, Promokodlar, Sharhlar, Sozlamalar, Saytga qaytish, Chiqish.
9. WHEN the viewport width is below 980px, THE Sidebar SHALL collapse to a horizontal top bar with a maximum height of 64px and expand to reveal the full menu when toggled, using a smooth `max-height` transition of 0.32s.
10. IF the sidebar is in mobile collapsed mode and the toggle button is tapped, THEN THE Sidebar SHALL expand to show all menu items in a 2-column grid layout.

---

### Requirement 3: Topbar — Sticky Premium Header

**User Story:** As an admin, I want a sticky top header that is clean, glass-like, and includes search and quick-action buttons, so that I can navigate and find content without scrolling back to the top.

#### Acceptance Criteria

1. THE Topbar SHALL be `position: sticky` at `top: 16px` with `z-index: 8`, a white glass background `rgba(255, 255, 255, 0.85)`, border-radius of 22px, and a soft box-shadow.
2. THE Topbar SHALL display the current page title (`#pageTitle`) at `clamp(26px, 2.5vw, 32px)` in dark navy color and the page description (`#pageDesc`) in muted gray at 14px.
3. THE Topbar SHALL include a global search bar (`.admin-global-search`) that is 46px tall, up to 380px wide, with a purple search icon and a placeholder reading "Mahsulot yoki buyurtma qidirish...".
4. WHEN the global search bar receives focus, THE Topbar SHALL apply a purple border `rgba(109, 40, 217, 0.4)` and a soft purple outer glow.
5. THE Topbar SHALL include a notification icon button and an admin avatar badge, both 46px in height and styled with rounded corners.
6. WHEN the viewport width is below 900px, THE Topbar SHALL become full-width, lose its border-radius, and stack the search bar below the title block.

---

### Requirement 4: Dashboard Stat Cards

**User Story:** As an admin, I want six visually distinct KPI cards that clearly show my key metrics, so that I can understand the business status at a glance.

#### Acceptance Criteria

1. THE Stats_Grid SHALL display six Stat_Cards in a single row on desktop (≥ 1280px) using `repeat(6, minmax(0, 1fr))` column layout with 14px gap.
2. WHEN the viewport is between 900px and 1280px, THE Stats_Grid SHALL reflow to 3 columns.
3. WHEN the viewport is below 900px, THE Stats_Grid SHALL use 2 columns.
4. EACH Stat_Card SHALL have a minimum height of 156px, 20px padding, rounded corners of 20px, a white background `rgba(255, 255, 255, 0.95)`, and a subtle border `rgba(148, 163, 184, 0.14)`.
5. EACH Stat_Card SHALL contain a colored icon circle (`.stat-icon`) of 44×44px with a rounded-square shape (14px radius) and a gradient background unique to each card position.
6. WHEN a Stat_Card is hovered, THE Stat_Card SHALL lift 4px via `translateY(-4px)`, increase shadow to `0 20px 48px rgba(15, 23, 42, 0.1)`, and subtly highlight its border with a purple tint.
7. THE Stats_Grid SHALL display the six cards with labels (in Uzbek): Jami mahsulotlar, Jami buyurtmalar, Bugungi buyurtmalar, Umumiy tushum, Yetkazilgan buyurtmalar, Bekor qilingan buyurtmalar.
8. EACH Stat_Card SHALL show a value (`<strong>`) at 26px font-size and a label (`<span>`) at 13px muted color.

---

### Requirement 5: Analytics Section

**User Story:** As an admin, I want a professional analytics section with a weekly bar chart, top products, and top categories, so that I can track performance trends visually.

#### Acceptance Criteria

1. THE Analytics_Grid SHALL use a 3-column layout on desktop: a wide chart column (`minmax(0, 1.4fr)`) and two equal insight columns (`minmax(260px, 0.7fr)` each).
2. WHEN the viewport is below 1280px, THE Analytics_Grid SHALL reflow to 2 columns with the chart spanning the full width.
3. WHEN the viewport is below 900px, THE Analytics_Grid SHALL stack to 1 column.
4. THE Weekly_Chart SHALL render 7 vertical bars, one per day, using a purple gradient fill (`#6d28d9` → `#a78bfa` → `#c4b5fd`) with a bar width of up to 36px and rounded tops.
5. WHEN a weekly bar is hovered, THE Weekly_Chart SHALL deepen the purple gradient and increase the shadow to `0 12px 28px rgba(109, 40, 217, 0.32)`.
6. THE Analytics_Grid SHALL display a weekly total badge (`.analytics-total`) as a purple-tinted pill showing the sum formatted in so'm.
7. EACH Insight_Row SHALL display in a 3-column micro-grid (32px icon, flexible label, right-aligned value) with a subtle background `rgba(248, 250, 252, 0.9)` and border-radius of 14px.
8. WHEN an Insight_Row is hovered, THE Insight_Row SHALL shift 3px to the right and apply a purple-tinted background `rgba(243, 232, 255, 0.5)`.

---

### Requirement 6: Recent Orders List (Dashboard)

**User Story:** As an admin, I want the recent orders section on the dashboard to show compact, scannable rows with hover effects, so that I can quickly check the latest activity.

#### Acceptance Criteria

1. THE Dashboard_Recent SHALL render as a standalone glass card below the analytics grid, with 22px padding, 20px border-radius, and the same white-glass style as analytics cards.
2. EACH Recent_Row SHALL display in a two-column grid (flexible content + action button), have 14px padding, 16px border-radius, a white background `rgba(255, 255, 255, 0.9)`, and a subtle border.
3. WHEN a Recent_Row is hovered, THE Recent_Row SHALL shift 3px to the right, apply a white background, and add a soft box-shadow.
4. THE Recent_Row SHALL show the customer name, order total formatted as so'm, the order date, and a status badge pill.

---

### Requirement 7: Orders Section — Professional Order Cards

**User Story:** As an admin, I want each order card to present all order information clearly in a compact grid, with easy-to-use status controls, so that I can process orders efficiently.

#### Acceptance Criteria

1. EACH Order_Item SHALL use 20px padding, 20px border-radius, a white glass background `rgba(255, 255, 255, 0.92)`, and a subtle shadow.
2. WHEN an Order_Item is hovered, THE Order_Item SHALL lift 2px via `translateY(-2px)` and deepen its shadow.
3. THE Order_Grid inside each Order_Item SHALL use 6 columns on desktop, 3 on tablet (≤ 1280px), and 2 on mobile (≤ 900px).
4. EACH Order field cell (`.order-field`) SHALL have a light `rgba(248, 250, 252, 0.9)` background, 12px padding, 14px border-radius, an uppercase muted label at 11px, and a value at 14px.
5. THE Status_Badge SHALL be a pill shape (999px radius) with gradient background specific to each status: Yangi (yellow gradient), Tasdiqlandi (blue gradient), Yuborildi (purple gradient), Yetkazildi (green gradient), Bekor qilindi (red gradient).
6. THE Status_Control row SHALL contain a status dropdown (minimum 230px wide) and a "Holatni saqlash" button styled in purple (`btn-primary`) and an "O'chirish" button styled in red (`btn-danger`).
7. THE payment screenshot image (`.payment-shot img`) SHALL have a maximum width of 220px and SHALL NOT expand to full card width.
8. WHEN a status is saved, THE Admin_Shell SHALL display a Toast notification reading "Buyurtma statusi yangilandi".
9. WHEN an order is deleted, THE Admin_Shell SHALL display a Toast notification reading "Buyurtma o'chirildi".

---

### Requirement 8: Product Add Form

**User Story:** As an admin, I want the product add/edit form to have well-spaced inputs, a premium upload area, and a clear submit button, so that adding products feels smooth and professional.

#### Acceptance Criteria

1. THE product form inputs and selects SHALL have a minimum height of 46px, 14px padding, 14px border-radius, and a white background `rgba(255, 255, 255, 0.95)`.
2. WHEN a form input is focused, THE input SHALL show a purple border `rgba(109, 40, 217, 0.5)` and a soft outer glow `0 0 0 4px rgba(109, 40, 217, 0.08)`.
3. THE Upload_Box SHALL be at least 136px tall, use a dashed purple border `rgba(109, 40, 217, 0.3)`, and have a subtle purple-tinted background.
4. WHEN the Upload_Box is hovered or has a file dragged over it, THE Upload_Box SHALL darken the border to `var(--adm-purple)`, increase the background tint, and apply a 2px lift.
5. THE save button (`.btn-primary`) on the product form SHALL use the purple gradient, be at least 44px tall, and show the label "Saqlash".
6. WHEN a product is saved successfully, THE Admin_Shell SHALL display a Toast notification reading "Mahsulot muvaffaqiyatli qo'shildi".

---

### Requirement 9: Products List

**User Story:** As an admin, I want the products list to show compact horizontal rows with a thumbnail, ellipsis-clipped names, price, and action buttons, so that I can scan and manage products quickly.

#### Acceptance Criteria

1. THE Product_Card SHALL render as a horizontal row using a 100px-wide thumbnail on the left and a flexible content area on the right, with 20px border-radius and a white glass background.
2. THE product thumbnail image SHALL be 100×96px, have 16px border-radius, and use `object-fit: cover`.
3. THE product name inside the Product_Card SHALL be limited to 1 line (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) at 15px font-size.
4. THE product price SHALL display at 16px bold in dark navy, with the old price below it in muted gray at 12px with a strikethrough.
5. THE Product_Card SHALL contain an edit button (`.btn-secondary`, purple tint) and a delete button (`.btn-danger`, red) aligned to the right.
6. WHEN a Product_Card is hovered, THE Product_Card SHALL lift 3px, deepen its shadow, and apply a purple-tinted border.
7. WHEN the viewport is below 900px, THE Product_Card SHALL reduce the thumbnail to 70×80px and stack action buttons vertically.

---

### Requirement 10: Toast Notifications

**User Story:** As an admin, I want small, compact toast notifications in the top-right corner that auto-dismiss, so that I get feedback on my actions without the UI being blocked by a full-width banner.

#### Acceptance Criteria

1. THE Toast SHALL appear at `position: fixed; top: 24px; right: 24px` with a maximum width of `min(360px, calc(100vw - 48px))`.
2. THE Toast SHALL have 14px padding, 14px border-radius, a green background `#16a34a` for success, and a red background `#dc2626` for errors.
3. THE Toast SHALL appear with a slide-in animation from the right over 0.3s.
4. THE Toast SHALL auto-dismiss after 3 seconds.
5. THE Toast SHALL NEVER render as a full-height or full-width colored block; height SHALL be determined by content only.
6. WHEN the viewport is below 768px, THE Toast SHALL anchor to the bottom of the screen instead of the top-right, with 12px margins on left and right.

---

### Requirement 11: Categories, Promo Codes, Reviews, Settings

**User Story:** As an admin, I want the categories, promo codes, reviews, and settings sections to use the same premium card style as the rest of the dashboard, so that the entire panel feels consistent.

#### Acceptance Criteria

1. EACH section panel (categories, promo codes, reviews, settings) SHALL use the `.panel` glass card style with white-glass background, 22px–28px padding, 22px border-radius, and a soft shadow.
2. THE category and promo code add-row (`.category-tools`) SHALL use a two-column grid (flexible input + fixed button) with 12px gap.
3. EACH Category_Row (`.category-row`) SHALL have 16px padding, 18px border-radius, a white-glass background, and hover lift+shadow effect with a 3px rightward translate.
4. THE settings section SHALL use a two-column grid (`.settings-grid`) for the input fields on desktop and collapse to one column below 480px.
5. WHEN a settings save action completes, THE Admin_Shell SHALL display the text "Sozlamalar saqlandi" via the Toast notification or a local message element.

---

### Requirement 12: Mobile Responsive Layout

**User Story:** As an admin, I want the dashboard to work perfectly on a 360px Android phone, 390px iPhone, 768px tablet, and 1440px desktop, so that I can manage the store from any device.

#### Acceptance Criteria

1. WHEN the viewport is 360px–480px, THE Stats_Grid SHALL display in 2 columns with 6px gap and each Stat_Card having a minimum height of 72px.
2. WHEN the viewport is 360px–480px, THE main content area SHALL use 10px horizontal padding and 10px–24px vertical padding.
3. WHEN the viewport is 360px–480px, THE Topbar title (`#pageTitle`) SHALL render at 16px and the description (`#pageDesc`) SHALL be hidden to save vertical space.
4. WHEN the viewport is 360px–480px, THE Order_Grid SHALL collapse to 2 columns and Order_Items shall use 10px padding.
5. WHEN the viewport is 768px (tablet), THE Stats_Grid SHALL display 2–3 columns, the Analytics_Grid SHALL stack, and the Sidebar SHALL render as a collapsible top bar.
6. WHEN the viewport is 1440px (desktop), THE Admin_Shell SHALL constrain panel and topbar max-width to 1440px and use 28px–36px horizontal padding in the main area.
7. THE Admin_Shell SHALL NOT produce any horizontal scrollbar at any tested viewport width (360px, 390px, 768px, 1440px).
8. IF a form input on mobile has font-size below 16px, THEN THE input SHALL be overridden to at least 14px to prevent iOS auto-zoom.

---

### Requirement 13: Non-Regression — Existing Functionality Must Not Break

**User Story:** As an admin, I want all existing functionality to continue working exactly as before after the visual upgrade, so that the upgrade does not cause any regressions.

#### Acceptance Criteria

1. WHEN the admin submits the login form with username "admin" and password "12345678", THE Admin_Shell SHALL hide the login overlay and display the main dashboard section.
2. WHEN the admin submits the login form with incorrect credentials, THE Admin_Shell SHALL display an error message and SHALL NOT advance past the login screen.
3. WHEN the `logout()` function is called, THE Admin_Shell SHALL clear the authenticated session and display the login overlay, hiding all dashboard content.
4. WHEN `showSection(sectionId)` is called with any of the values — dashboard, add, products, orders, categories, promocodes, reviews, settings — THE Admin_Shell SHALL display only the matching section panel and hide all others, with no JavaScript console errors thrown.
5. WHEN the admin submits the add-product form with valid data, THE `addProduct()` function SHALL persist the product entry and THE Admin_Shell SHALL display a Toast reading "Mahsulot muvaffaqiyatli qo'shildi".
6. WHEN `renderProducts()` is called, THE Admin_Shell SHALL display one Product_Card per product entry, each containing an edit control and a delete control.
7. WHEN the admin selects a new status from the order status dropdown and clicks "Holatni saqlash", THE Admin_Shell SHALL persist the updated status and display a Toast reading "Buyurtma statusi yangilandi".
8. WHEN the admin clicks "O'chirish" on an Order_Item, THE Admin_Shell SHALL remove that order from the list and display a Toast reading "Buyurtma o'chirildi".
9. WHEN the admin clicks a Recent_Row or an order detail button, THE ODM_Drawer SHALL become visible with the correct order's details; WHEN the admin clicks the overlay or the close button, THE ODM_Drawer SHALL become hidden.
10. WHEN `loadDashboard()` is called, THE Admin_Shell SHALL populate `#statProducts`, `#statOrders`, `#statTodayOrders`, `#statRevenue`, `#statDeliveredOrders`, and `#statCancelledOrders` with computed values derived from the current data.
11. WHEN the Toast system displays a success notification, THE Toast SHALL use a green background; WHEN it displays an error notification, THE Toast SHALL use a red background; in both cases THE Toast SHALL auto-dismiss after 3 seconds.
