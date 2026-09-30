# 🍔 OmniEats • Global Food Delivery Platform
> **Live GPS Map Tracking • Delivery Instructions Board • Global Culinary Establishments • Multi-Gateway Online Payments**

OmniEats is a full-stack food delivery application built with live GPS map tracking, interactive menus from renowned culinary destinations worldwide, browser geolocation for nearby suggestions, an explicit delivery instructions board for the courier, and a comprehensive online payment gateway.

---

## 🌟 Core Features & Highlights

### 1. 🗺️ Live Tracking with Full Map Preview
- **Interactive High-Resolution Map**: Powered by Leaflet with smooth vector road styling.
- **Dynamic Route Waypoints**: Calculates road path between the restaurant kitchen and customer delivery address.
- **Animated Moving Scooter**: Custom delivery scooter marker with pulsing radar waves updating in real time as the driver navigates traffic.
- **Live Telemetry & Pipeline**:
  - `1. Confirmed` → `2. Kitchen Prep` → `3. On The Way` → `4. Delivered`
  - Real-time countdown for **Estimated Delivery Time (ETA)** and **Distance Remaining (km)**.
  - **Fast-Forward Simulation**: Instant demonstration button (`⏩ Simulate Movement`) to advance the driver along the route.

### 2. 🛵 Delivery Partner Identity & Contact Board
- **Full Driver Details**:
  - **Courier Name** (e.g. *Vikram Malhotra*, *Kenji Sato*, *Marco Rossi*)
  - **Verified Star Rating** (4.94 ★) with 2,000+ completed deliveries
  - **Vehicle Type & License Plate** (e.g. *TVS iQube Electric Scooter • MH-02-CB-4892*)
  - **Courier Contact Phone Number** with direct 1-click **Call Partner** (`tel:...`) link and interactive in-app messaging.

### 3. 🔕 Special Delivery Instructions Board (For the Delivery Man)
- Prominent instruction panel allowing customers to toggle essential delivery preferences:
  - 🔕 **Don't ring the bell** (Baby sleeping / quiet hours)
  - 📵 **Avoid calling** (Send in-app notification on arrival)
  - 🐕 **Pet at home** (Friendly or guarding pet alert)
  - 🚪 **Leave at door / porch** (Contactless delivery)
  - 🏢 **Leave with building guard / reception**
- **Custom Direction Notes**: Text box for gate passcodes, floor numbers, or acoustic instructions (e.g. *"Gate code #4821, 2nd floor on right"*).
- **Driver Acknowledgement Stamp**: Confirms on the live tracking screen that instructions have been dispatched and acknowledged by the courier.

### 4. 🌍 Worldwide Restaurants & Interactive Menus
- Famous dining institutions across culinary capitals:
  1. **Trattoria Da Enzo** (*Rome, Italy* — Carbonara Tradizionale, Cacio e Pepe, Tiramisù)
  2. **Sukiyabashi Master** (*Tokyo, Japan* — Otoro Nigiri, A5 Wagyu Kushiyaki, Tonkotsu Ramen)
  3. **Le Petit Bistro** (*Paris, France* — Duck Confit, French Onion Soup, Crème Brûlée)
  4. **Bukhara Artisanal** (*New Delhi / Mumbai, India* — Dal Bukhara, Murgh Malai, Garlic Naan)
  5. **The Manhattan Grill** (*New York, USA* — Black Truffle Double Smash, Truffle Fries)
  6. **Taquería El Cardenal** (*Mexico City, Mexico* — Tacos al Pastor, Molcajete Guacamole)
  7. **Som Tum Der** (*Bangkok, Thailand* — Pad Thai Boran, Green Curry, Mango Sticky Rice)
  8. **Al Hadheerah Royal Kitchen** (*Dubai, UAE* — Slow-Braised Lamb Ouzi, Truffle Hummus)
- **Verified Contacts**: Every restaurant features a direct phone number (`+39...`, `+81...`, `+91...`, etc.), exact street address, and opening hours.
- **Interactive Menus**: Veg/Non-Veg indicators, high-resolution food photography, ingredient descriptions, and customizable quantity steppers.

### 5. 📍 Live Geolocation & Proximity Recommendations
- **Browser Geolocation**: Asks for live GPS location via `navigator.geolocation`.
- **Haversine Distance Engine**: Automatically computes distance in kilometers (`km`) from your device coordinates to every restaurant worldwide.
- **Dynamic Delivery Estimates**: Adjusts delivery fees and ETA based on physical proximity.
- **City Switcher**: Instantly browse by international culinary capital.

### 6. 💳 Multi-Gateway Online Payments
- **UPI (Unified Payments Interface)**:
  - Instant 1-tap triggers for **Google Pay**, **PhonePe**, **Paytm**, and **BHIM**.
  - Dynamic QR code generation for instant scan-and-pay.
  - Custom VPA verification (`customer@okhdfcbank`).
- **Credit / Debit Cards**:
  - Interactive 3D visual card preview that updates dynamically as you type.
  - Auto-spaced 16-digit formatting, card brand detection (Visa/Mastercard), expiry, and CVV.
- **Netbanking**:
  - HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak Mahindra Bank.
- **Cash on Delivery (COD)**.

---

## 🚀 How to Launch the Food Delivery App

### Option A: One-Click Launcher (Windows)
Double-click [`start.bat`](file:///c:/Users/rampa/Downloads/Full%20Stack%20-22/Food_Delivery_App/start.bat). It starts the server on port 4000 and automatically opens your default browser.

### Option B: Terminal Command
```powershell
cd "c:\Users\rampa\Downloads\Full Stack -22\Food_Delivery_App"
npm start
```
Then visit: 👉 **[http://localhost:4000](http://localhost:4000)**

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/restaurants` | `GET` | Returns restaurants sorted by proximity (`lat`, `lng`, `city`, `cuisine`, `search`) |
| `/api/restaurants/:id` | `GET` | Returns single restaurant details with full menu and contact number |
| `/api/orders` | `POST` | Places new order with payment, delivery address, instructions board, and starts driver telemetry |
| `/api/orders/:id` | `GET` | Fetches live order status, driver location, and remaining ETA |
| `/api/orders/:id/advance` | `POST` | Fast-forwards driver simulation along the GPS route for testing |
