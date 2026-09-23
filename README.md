# 🏨 Mero-Booking | Multi-Tenant Cloud Hotel PMS & Hospitality SaaS

![React](https://img.shields.io/badge/React_19-20232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![SaaS Multi-Tenant](https://img.shields.io/badge/Architecture-Multi--Tenant_SaaS-emerald?style=for-the-badge)

**Mero-Booking** is a modern, full-featured **Cloud Property Management System (PMS) and Hospitality SaaS Platform**. Designed for independent boutique hotels, luxury resorts, and multi-property hospitality chains, it combines an omnichannel **Central Reservation System (CRS)**, an interactive **14-Day Visual Tape Chart**, a **2-Way OTA Channel Manager**, a **Housekeeping Dispatch Kanban Board**, and a direct **Guest Booking Engine** with automated SaaS subscription billing.

---

## 🌟 What the System Does & Key Features

### 🏢 1. Multi-Tenant Architecture & Portfolio Hub
- **Multi-Property Switcher:** Instantly switch operational context between different properties (*Grand Royal Palace & Spa*, *Annapurna Lakeside Eco-Resort*, *Himalayan Horizon Boutique*) or aggregate into a Global SaaS Portfolio view.
- **Onboard New Hotels Wizard:** Create and provision new hotel tenants in seconds with localized currency (`USD`, `NPR`, `EUR`, `GBP`), tax rates, check-in/out policies, room unit allocations, and subscription tiers.
- **Tenant Data Isolation:** Complete data separation per hotel property for rooms, reservations, folios, tasks, channels, and staff.

### 🎭 2. Live SaaS Persona & Role Switcher (Top Bar)
- Embedded directly into the SaaS top bar to test different operational perspectives with zero friction:
  - **Platform Super Admin:** SaaS platform owner with access to all properties, MRR/ARR metrics, billing, and tenant management.
  - **Hotel Admin (General Manager):** Full executive control over property inventory, pricing, channels, and staff.
  - **Front Desk Agent:** Focused on day-to-day arrivals, departures, tape chart allocations, and guest folio billings.
  - **Housekeeping Lead:** Dedicated access to room turnover boards and sanitation dispatch.
  - **Guest:** Traveler perspective for browsing suites and managing personal reservations.

### 📅 3. Interactive 14-Day Visual Tape Chart (Room Rack)
- **Room vs. Date Timeline Grid:** Visual timeline displaying all room units across a sliding 14-day window.
- **Reservation Blocks:** Color-coded reservation blocks (`Checked-In`, `Confirmed`, `Pending`) showing guest name, nights, and stay boundaries.
- **Interactive Slots:**
  - Click any existing reservation block to open the **Itemized Guest Folio & Check-In/Out modal**.
  - Click any empty date cell on a room unit to open a **Quick Reservation modal** pre-populated with that room and date.
- **Live Housekeeping Status Dots:** Each room row displays real-time room hygiene condition (*Clean*, *Inspected*, *Dirty*, *In-Progress*).

### 🛎️ 4. Central Reservation System (CRS) & Guest Folio POS
- **Omnichannel Reservations Feed:** Search by guest name, booking reference ID, or email, with filters by status and channel.
- **Front Desk Quick Actions:** 1-click **Check-In Guest** and **Complete Check-Out**.
- **Itemized Folio Billing:** Real-time billing folio tracking room rent and department charges (*Restaurant & Bar*, *Spa & Wellness*, *Minibar*, *Laundry Service*, *Airport Chauffeur*).
- **Post Department Charges:** Staff can add custom incidental charges directly to any guest's room folio.
- **Printable Statements:** Print or export professional guest folio receipts with simulated verification QR codes.

### 🔄 5. 2-Way OTA Channel Manager
- **Connected Distribution OTAs:** Real-time channel connections for **Booking.com**, **Airbnb**, **Expedia Partner Central**, and **Agoda YCS Hub**.
- **Dynamic Channel Markups:** Configure individual channel price markups (e.g., +12% on Booking.com, +15% on Airbnb) to protect net profit margins against OTA commissions.
- **2-Way Feed Synchronization:** Trigger individual channel syncs or run a bulk "Sync All Channels Now" operation.
- **Rate Parity Monitor:** Verifies rate consistency between direct website pricing and external channel listings.

### 🧹 6. Housekeeping Dispatch Kanban Board
- **5-Stage Cleanliness Pipeline:**
  1. `Dirty (Turnover Required)` $\rightarrow$
  2. `Cleaning In-Progress` $\rightarrow$
  3. `Clean (Ready for Inspection)` $\rightarrow$
  4. `Inspected (Front Desk Ready)` $\rightarrow$
  5. `Maintenance / Out of Order`
- **Cleaner Dispatch:** Assign duty staff to specific rooms, flag high-priority turnover requests, and filter rooms by floor.

### 💳 7. SaaS Subscription, Tier Quotas & Billing
- **Subscription Tiers:**
  - **Starter ($49/mo):** Up to 20 rooms, tape chart, direct booking engine, and housekeeping board.
  - **Growth ($149/mo):** Up to 50 rooms, 2-way OTA channel manager, folio POS, and AI concierge.
  - **Enterprise ($349/mo):** Up to 200 rooms, central multi-property CRS, REST API/webhooks, and priority SLA.
- **Billing Cycle Toggle:** Switch between Monthly and Annual billing (with an automatic 20% annual discount).
- **Real-Time Quota Utilization Meters:**
  - Active room units used vs. plan ceiling.
  - Staff user seats utilized vs. quota.
  - Monthly OTA sync API calls monitored.
- **Subscription Tax Invoices:** Historical billing statements with printable receipts.

### 📊 8. Hospitality KPIs & Executive Analytics
- **Core Performance Metrics:** Real-time calculated **Occupancy Rate (%)**, **RevPAR (Revenue Per Available Room)**, **ADR (Average Daily Rate)**, and **Today's Front Desk Traffic (Arrivals & Departures)**.
- **Weekly Trend Charts:** Visual area curves charting dynamic weekly revenues and occupancy.
- **Channel Breakdown:** Pie chart illustrating channel distribution (Direct Bookings vs. Booking.com vs. Airbnb vs. Expedia).
- **SaaS Platform Metrics (Super Admin):** Consolidated **Platform MRR**, **ARR**, **Active Hotels**, and **Churn Rate**.

### 🌐 9. Direct Guest Booking Engine & AI Concierge
- **Cinematic Guest Portal:** High-definition hero carousel, room catalog, amenity filters, and availability calendar.
- **Guest Folio & Booking Receipts:** Guests can view stay history, download official statements, and submit reviews.
- **AI Guest Concierge:** Powered by Google Gemini SDK, delivering instant personalized answers about amenities, policies, and local recommendations.
- **Multiple Payment Methods:** Support for Credit/Debit Cards, Cash on Arrival, and digital wallets (eSewa & Khalti).

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Area | Super Admin | Hotel Admin (GM) | Front Desk | Housekeeping | Guest |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Global Multi-Property Hub** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **SaaS Billing & Plan Upgrade** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **KPI Dashboard & RevPAR** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Tape Chart (Room Rack)** | ✅ | ✅ | ✅ | View Only | ❌ |
| **Central CRS Bookings & Folio** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **OTA Channel Manager** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Housekeeping Kanban Dispatch** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Staff & User Roles Directory** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Property & Tax Settings** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Direct Guest Booking Engine** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Technology Stack

- **Frontend Core:** React 19, TypeScript (Strict Mode), Vite
- **Styling & UI:** Tailwind CSS, Lucide Icons, Custom Glassmorphic Dark & Light Themes
- **Data Visualizations:** Recharts (Area Charts, Pie Charts, Meter Gauges)
- **Routing:** React Router DOM v7
- **AI Engine:** Google GenAI SDK (`@google/genai` / Gemini 3 Flash)
- **Multi-Tenant State:** React Context (`TenantContext`, `AuthContext`, `ToastContext`)
- **Persistence Layer:** Structured Multi-Tenant LocalStorage Data Engine (`mockDb.ts`)

---

## 🚀 Quick Navigation & How to Test

1. **Access the Application:** Open the app preview in your browser.
2. **Explore the SaaS Top Bar:** Notice the property selector and the **"Switch Persona"** pill on top right.
3. **Switch to Super Admin:** Open `/admin` to view portfolio-wide KPIs, platform MRR, and multi-hotel controls.
4. **Open the Tape Chart:** Navigate to `/admin/tape-chart` to view the 14-day room timeline. Click on an existing booking to inspect the guest folio, or click an empty date slot to create an instant reservation.
5. **Test OTA Channel Sync:** Go to `/admin/channels` to toggle OTAs, adjust markups, and trigger channel synchronizations.
6. **Test Housekeeping Dispatch:** Go to `/admin/housekeeping` to advance room cleaning status through Kanban stages.
7. **Test Plan Upgrades:** Go to `/admin/billing` and click **"Change / Upgrade Plan"** to test tier activations with annual/monthly discount calculations.
8. **Test Direct Guest Booking:** Click **"Booking Page"** or go to `/` to test the public traveler reservation experience.
