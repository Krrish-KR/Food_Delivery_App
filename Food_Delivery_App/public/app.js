// app.js - OmniEats Interactive Client, Live Map Telemetry & Orders Engine

const state = {
  userLocation: {
    lat: 30.7710,
    lng: 76.5760,
    cityName: 'Chandigarh University (CU), Kharar',
    exactAddress: 'Chandigarh University Campus, NH-05, Gharuan',
    landmark: 'Opposite Gate No. 2 & Student Plaza',
    postcode: '140413'
  },
  restaurants: [],
  selectedCuisine: 'All',
  selectedCity: 'Chandigarh University',
  searchQuery: '',
  activeRestaurant: null,
  cart: {}, // { [itemId]: { item, quantity, restaurant } }
  deliveryInstructions: {
    dontRingBell: false,
    avoidCalling: false,
    petAtHome: false,
    leaveAtDoor: false,
    leaveWithGuard: false,
    customNote: ''
  },
  paymentMethod: 'UPI',
  activeOrder: null,
  mapInstance: null,
  driverMarker: null,
  restaurantMarker: null,
  customerMarker: null,
  routePolyline: null,
  trackingInterval: null
};

// -------------------------------------------------------------
// Audio Feedback (Web Audio API Haptics)
// -------------------------------------------------------------
let audioCtx = null;
function playSound(type = 'success') {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'success') {
      // Order placed / delivery bell chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'tap') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {}
}

function showNotification(msg) {
  let toast = document.getElementById('omni-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'omni-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-surface-card border border-brand-500/40 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-10 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4 text-brand-500"></i> <span>${msg}</span>`;
  lucide.createIcons();
  toast.classList.remove('translate-y-10', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 4000);
}

// -------------------------------------------------------------
// Application Initialization
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // Sync initial address fields
  syncAddressFieldsWithState();

  await loadRestaurants();
  lucide.createIcons();
  
  // Explicitly request browser location permission on load
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => handleLocationSuccess(pos, false),
      () => {
        console.log('Location permission deferred or running localhost fallback');
        fallbackToCampusOrIp(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }
});

// -------------------------------------------------------------
// Geolocation & Reverse-Geocoding Handling
// -------------------------------------------------------------
async function requestUserLocation(interactive = true) {
  playSound('tap');
  const navLabel = document.getElementById('nav-location-label');
  const navMobile = document.getElementById('nav-location-mobile');
  const btnLabel = document.getElementById('live-gps-btn-text');
  const cartBtnLabel = document.getElementById('cart-gps-btn-label');

  if (navLabel) navLabel.textContent = '📍 Requesting Browser GPS Permission...';
  if (navMobile) navMobile.textContent = '📍 Asking GPS...';
  if (btnLabel) btnLabel.textContent = 'Locating...';
  if (cartBtnLabel) cartBtnLabel.textContent = 'Locating...';

  if (!('geolocation' in navigator)) {
    alert('Geolocation is not supported by your browser. Defaulting to Chandigarh University & Kharar!');
    fallbackToCampusOrIp(interactive);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      await handleLocationSuccess(pos, interactive);
    },
    async (err) => {
      console.warn('Geolocation permission denied or timed out:', err.message);
      await fallbackToCampusOrIp(interactive);
    },
    { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
  );
}

function detectExactUserAddress() {
  requestUserLocation(true);
}

async function handleLocationSuccess(pos, notify = true) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  let exactAddress = 'Detected GPS Location';
  let landmark = 'Near Current Coordinates';
  let cityName = 'Live GPS Area';
  let postcode = '';

  // Query our backend reverse-geocoding endpoint
  try {
    const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
    const data = await res.json();
    if (data.success && data.address) {
      const a = data.address;
      exactAddress = a.street;
      landmark = a.landmark;
      cityName = a.city;
      postcode = a.postcode || '';
    }
  } catch (e) {
    console.warn('Reverse geocoding fetch error:', e);
  }

  state.userLocation = {
    lat,
    lng,
    cityName,
    exactAddress,
    landmark,
    postcode
  };

  syncAddressFieldsWithState();

  const btnLabel = document.getElementById('live-gps-btn-text');
  if (btnLabel) btnLabel.textContent = 'GPS Active ✓';

  const cartBtnLabel = document.getElementById('cart-gps-btn-label');
  if (cartBtnLabel) cartBtnLabel.textContent = 'GPS Synced ✓';

  // Update catalog banner
  const bannerTitle = document.getElementById('gps-banner-title');
  const bannerSubtitle = document.getElementById('gps-banner-subtitle');
  const badgeStatus = document.getElementById('gps-badge-status');
  const addressSnippet = document.getElementById('gps-address-snippet');
  if (bannerTitle) bannerTitle.textContent = 'Live Device GPS Active';
  if (badgeStatus) {
    badgeStatus.textContent = '✓ GPS Verified';
    badgeStatus.className = 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  }
  if (addressSnippet) addressSnippet.textContent = `${exactAddress}, ${landmark} (${cityName})`;
  if (bannerSubtitle) bannerSubtitle.innerHTML = `Delivery address auto-synced: <strong class="text-brand-400">${exactAddress}</strong>. Live distance calculated to Kharar & CU kitchens.`;

  // Reload restaurants sorted by exact distance
  await loadRestaurants();

  if (notify) {
    playSound('success');
    showNotification(`📍 Live GPS Detected: ${exactAddress}, ${cityName}`);
  }
}

async function fallbackToCampusOrIp(interactive = false) {
  let lat = 30.7710;
  let lng = 76.5760;
  let cityName = 'Chandigarh University (CU), Kharar';
  let exactAddress = 'Chandigarh University Campus, NH-05, Gharuan';
  let landmark = 'Opposite Gate No. 2 & Student Plaza';
  let postcode = '140413';

  // Try IP geolocation if available
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.latitude && ipData.longitude) {
        lat = ipData.latitude;
        lng = ipData.longitude;
        cityName = `${ipData.city || 'Kharar'}, ${ipData.region || 'Punjab'}`;
        exactAddress = `${ipData.city || 'Kharar / CU Campus Area'}`;
        landmark = `Pincode: ${ipData.postal || '140413'}`;
        postcode = ipData.postal || '';
      }
    }
  } catch (e) {
    console.log('IP fallback using CU Kharar defaults');
  }

  state.userLocation = {
    lat,
    lng,
    cityName,
    exactAddress,
    landmark,
    postcode
  };

  syncAddressFieldsWithState();

  const btnLabel = document.getElementById('live-gps-btn-text');
  if (btnLabel) btnLabel.textContent = 'Detect Live GPS';
  const cartBtnLabel = document.getElementById('cart-gps-btn-label');
  if (cartBtnLabel) cartBtnLabel.textContent = 'Detect Exact GPS';

  await loadRestaurants();

  if (interactive) {
    showNotification(`📍 Location set to: ${cityName}`);
  }
}

function syncAddressFieldsWithState() {
  if (!state.userLocation) return;

  const loc = state.userLocation;
  const navText = `📍 ${loc.exactAddress || loc.cityName}`;
  const navLabel = document.getElementById('nav-location-label');
  const navMobile = document.getElementById('nav-location-mobile');
  if (navLabel) navLabel.textContent = navText;
  if (navMobile) navMobile.textContent = navText;

  const streetInput = document.getElementById('cart-input-street');
  const landmarkInput = document.getElementById('cart-input-landmark');
  const cartStatusText = document.getElementById('cart-address-status-text');

  if (streetInput) streetInput.value = loc.exactAddress || '';
  if (landmarkInput) landmarkInput.value = loc.landmark || '';
  if (cartStatusText) cartStatusText.textContent = `Live GPS: ${loc.exactAddress}, ${loc.landmark}`;
}

function selectCampusArea(areaKey) {
  playSound('tap');
  const citySelect = document.getElementById('nav-city-select');

  if (areaKey === 'cu-campus') {
    state.userLocation = {
      lat: 30.7715,
      lng: 76.5765,
      cityName: 'Chandigarh University (CU)',
      exactAddress: 'Chandigarh University, NH-05, Gharuan',
      landmark: 'Near Gate No. 2 & Student Plaza',
      postcode: '140413'
    };
    state.selectedCity = 'Chandigarh University';
    if (citySelect) citySelect.value = 'Chandigarh University';
  } else if (areaKey === 'kharar-sunny') {
    state.userLocation = {
      lat: 30.7480,
      lng: 76.6450,
      cityName: 'Kharar',
      exactAddress: 'Sunny Enclave, Sector 125, Kharar Highway',
      landmark: 'Near Kharar Bus Stand & Sunny Business Park',
      postcode: '140301'
    };
    state.selectedCity = 'Kharar';
    if (citySelect) citySelect.value = 'Kharar';
  } else if (areaKey === 'vr-punjab') {
    state.userLocation = {
      lat: 30.7250,
      lng: 76.6980,
      cityName: 'Mohali / Kharar Highway',
      exactAddress: 'VR Punjab Mall, Sector 118, Kharar-Mohali Highway',
      landmark: 'Opposite VR Punjab Main Food Court Entrance',
      postcode: '140307'
    };
    state.selectedCity = 'Mohali';
    if (citySelect) citySelect.value = 'Mohali';
  } else {
    state.selectedCity = 'All';
    if (citySelect) citySelect.value = 'All';
  }

  syncAddressFieldsWithState();
  loadRestaurants();
  playSound('success');
  showNotification(`📍 Area selected: ${state.userLocation.exactAddress}`);
}

function setPresetAddress(presetKey) {
  playSound('tap');
  const streetInput = document.getElementById('cart-input-street');
  const landmarkInput = document.getElementById('cart-input-landmark');
  const cartStatusText = document.getElementById('cart-address-status-text');

  if (presetKey === 'cu-gate2') {
    state.userLocation = {
      lat: 30.7715,
      lng: 76.5765,
      cityName: 'Chandigarh University (CU)',
      exactAddress: 'Chandigarh University, Opposite Gate No. 2, Gharuan, Mohali 140413',
      landmark: 'Near Student Plaza & Food Street'
    };
    if (cartStatusText) cartStatusText.textContent = 'Preset: CU Gate 2 & Student Plaza';
  } else if (presetKey === 'cu-hostel') {
    state.userLocation = {
      lat: 30.7690,
      lng: 76.5740,
      cityName: 'Chandigarh University (CU)',
      exactAddress: 'Chandigarh University, NC Hostel Block 3, Room Delivery Point',
      landmark: 'Near Sports Complex & Gate 1, Gharuan 140413'
    };
    if (cartStatusText) cartStatusText.textContent = 'Preset: CU Hostels & NC Block';
  } else if (presetKey === 'kharar-sunny') {
    state.userLocation = {
      lat: 30.7480,
      lng: 76.6450,
      cityName: 'Kharar',
      exactAddress: 'House / Flat, Sunny Enclave, Sector 125, Kharar, Mohali, Punjab 140301',
      landmark: 'Near Sunny Business Park / Main Kharar Road'
    };
    if (cartStatusText) cartStatusText.textContent = 'Preset: Kharar Sunny Enclave';
  } else if (presetKey === 'vr-punjab') {
    state.userLocation = {
      lat: 30.7250,
      lng: 76.6980,
      cityName: 'Mohali / Kharar',
      exactAddress: 'VR Punjab Mall Complex, Sector 118, Kharar-Mohali Highway 140307',
      landmark: 'Opposite VR Punjab Main Food Court Entrance'
    };
    if (cartStatusText) cartStatusText.textContent = 'Preset: VR Punjab Mall Area';
  }

  if (streetInput) streetInput.value = state.userLocation.exactAddress;
  if (landmarkInput) landmarkInput.value = state.userLocation.landmark;

  syncAddressFieldsWithState();
  showNotification(`📍 Delivery address preset applied!`);
}

function handleCityChange(city) {
  state.selectedCity = city;
  loadRestaurants();
}

// -------------------------------------------------------------
// Restaurant Loading & Rendering
// -------------------------------------------------------------
async function loadRestaurants() {
  try {
    let url = '/api/restaurants?';
    if (state.userLocation) {
      url += `lat=${state.userLocation.lat}&lng=${state.userLocation.lng}&`;
    }
    if (state.selectedCity && state.selectedCity !== 'All') {
      url += `city=${encodeURIComponent(state.selectedCity)}&`;
    }
    if (state.selectedCuisine && state.selectedCuisine !== 'All') {
      url += `cuisine=${encodeURIComponent(state.selectedCuisine)}&`;
    }
    if (state.searchQuery) {
      url += `search=${encodeURIComponent(state.searchQuery)}&`;
    }

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      state.restaurants = data.data;
      renderRestaurantsGrid();
    }
  } catch (err) {
    console.error('Failed to load restaurants:', err);
  }
}

function renderRestaurantsGrid() {
  const container = document.getElementById('restaurants-grid');
  document.getElementById('restaurants-count-label').textContent = 
    `Displaying ${state.restaurants.length} authentic kitchens ${state.selectedCity !== 'All' ? `in ${state.selectedCity}` : 'worldwide'}`;

  if (state.restaurants.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-12 text-center bg-surface-card rounded-3xl border border-white/10 space-y-3">
        <i data-lucide="utensils-crossed" class="w-10 h-10 text-slate-500 mx-auto"></i>
        <h3 class="text-base font-bold text-white">No matching culinary establishments found</h3>
        <p class="text-xs text-slate-400">Try clearing your filters or selecting another world city.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = state.restaurants.map(r => {
    const distText = r.distanceKm !== null ? `${r.distanceKm} km away` : 'Global Delivery';
    return `
      <div class="bg-surface-card rounded-3xl border border-white/10 overflow-hidden hover:border-brand-500/40 transition-all flex flex-col justify-between group shadow-lg">
        
        <!-- Image & Tags -->
        <div class="relative h-48 w-full overflow-hidden">
          <img src="${r.heroImage}" alt="${r.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-black/40"></div>
          
          <!-- Distance pill -->
          <div class="absolute top-3 left-3">
            <span class="badge-pill bg-black/70 backdrop-blur-md text-emerald-400 border border-white/10 flex items-center gap-1 font-mono">
              <i data-lucide="map-pin" class="w-3 h-3"></i> ${distText}
            </span>
          </div>

          <!-- Rating -->
          <div class="absolute top-3 right-3">
            <span class="badge-pill bg-amber-500 text-slate-950 font-bold flex items-center gap-1 shadow-md">
              <i data-lucide="star" class="w-3 h-3 fill-slate-950"></i> ${r.rating}
            </span>
          </div>

          <!-- City & Country Bottom Overlay -->
          <div class="absolute bottom-3 left-3 text-white">
            <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-400 block">${r.city}, ${r.country}</span>
          </div>
        </div>

        <!-- Details -->
        <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div class="space-y-1.5">
            <h3 class="text-lg font-bold text-white group-hover:text-brand-500 transition-colors">${r.name}</h3>
            <p class="text-xs text-slate-300 font-medium">${r.cuisine} • ${r.priceRange}</p>
            <p class="text-[11px] text-slate-400 line-clamp-1">${r.address}</p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5">
            ${(r.tags || []).slice(0, 3).map(t => `
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-raised border border-white/5 text-slate-300">
                ${t}
              </span>
            `).join('')}
          </div>

          <!-- Contact & Action Footer -->
          <div class="pt-3 border-t border-white/5 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span class="flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3 text-brand-500"></i> ${r.calculatedDeliveryMin || r.deliveryTimeMin} mins
              </span>
              <a href="tel:${r.phone}" class="hover:text-emerald-400 flex items-center gap-1 text-[11px]">
                <i data-lucide="phone" class="w-3 h-3 text-emerald-400"></i> ${r.phone}
              </a>
            </div>

            <button onclick="openRestaurantMenu('${r.id}')" class="w-full py-2.5 px-4 rounded-xl bg-surface-raised hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-between transition-all group-hover:shadow-md">
              <span>View Artisanal Menu</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function selectCuisine(cuisine) {
  playSound('tap');
  state.selectedCuisine = cuisine;
  document.querySelectorAll('.cuisine-pill').forEach(btn => {
    if (btn.textContent.includes(cuisine) || (cuisine === 'All' && btn.textContent.includes('All'))) {
      btn.classList.add('bg-brand-500', 'text-white');
      btn.classList.remove('bg-surface-card', 'text-slate-300');
    } else {
      btn.classList.remove('bg-brand-500', 'text-white');
      btn.classList.add('bg-surface-card', 'text-slate-300');
    }
  });
  loadRestaurants();
}

function handleSearch(val) {
  state.searchQuery = val.trim();
  loadRestaurants();
}

// -------------------------------------------------------------
// Interactive Menu & Cart Management
// -------------------------------------------------------------
function openRestaurantMenu(id) {
  playSound('tap');
  const rest = state.restaurants.find(r => r.id === id);
  if (!rest) return;

  state.activeRestaurant = rest;

  // Switch view
  document.getElementById('view-catalog').classList.add('hidden');
  document.getElementById('view-tracking').classList.add('hidden');
  document.getElementById('view-menu').classList.remove('hidden');

  // Render Hero
  const heroCard = document.getElementById('restaurant-hero-card');
  heroCard.innerHTML = `
    <div class="relative h-64 sm:h-80 w-full overflow-hidden">
      <img src="${rest.heroImage}" alt="${rest.name}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/60 to-black/40"></div>
      
      <div class="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div class="space-y-2 max-w-2xl">
          <div class="flex items-center gap-2">
            <span class="badge-pill bg-brand-500 text-white font-bold">${rest.cuisine}</span>
            <span class="badge-pill bg-black/60 text-slate-200 border border-white/10 font-mono">${rest.city}, ${rest.country}</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-white">${rest.name}</h2>
          <p class="text-xs sm:text-sm text-slate-300">${rest.address}</p>
        </div>

        <!-- Phone contact & Rating Box -->
        <div class="bg-surface-dark/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
          <div class="text-center">
            <span class="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i> ${rest.rating}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">${rest.reviewsCount}+ ratings</span>
          </div>
          <div class="h-8 w-[1px] bg-white/10"></div>
          <div>
            <span class="text-[10px] font-mono uppercase text-slate-400 block">Phone Order Line</span>
            <a href="tel:${rest.phone}" class="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              <i data-lucide="phone" class="w-3.5 h-3.5"></i> ${rest.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render Categories Bar & Items
  renderMenuSections(rest);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}

function renderMenuSections(rest) {
  // Extract unique categories
  const categories = [...new Set(rest.menu.map(m => m.category))];
  const catBar = document.getElementById('menu-categories-bar');
  catBar.innerHTML = categories.map((cat, idx) => `
    <button onclick="filterMenuCategory('${cat}')" class="menu-cat-btn ${idx === 0 ? 'bg-brand-500 text-white' : 'bg-surface-card text-slate-300'} px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all">
      ${cat}
    </button>
  `).join('');

  renderMenuItems(rest.menu);
}

function filterMenuCategory(category) {
  playSound('tap');
  document.querySelectorAll('.menu-cat-btn').forEach(btn => {
    if (btn.textContent.trim() === category) {
      btn.classList.add('bg-brand-500', 'text-white');
      btn.classList.remove('bg-surface-card', 'text-slate-300');
    } else {
      btn.classList.remove('bg-brand-500', 'text-white');
      btn.classList.add('bg-surface-card', 'text-slate-300');
    }
  });

  const filtered = state.activeRestaurant.menu.filter(m => m.category === category);
  renderMenuItems(filtered);
}

function renderMenuItems(items) {
  const container = document.getElementById('menu-items-grid');
  container.innerHTML = items.map(it => {
    const inCart = state.cart[it.id];
    const qty = inCart ? inCart.quantity : 0;

    return `
      <div class="bg-surface-card p-5 rounded-3xl border border-white/10 flex items-start justify-between gap-4 hover:border-white/20 transition-all">
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full border ${it.isVeg ? 'border-emerald-500 bg-emerald-500/20' : 'border-rose-500 bg-rose-500/20'} flex items-center justify-center">
              <span class="w-1.5 h-1.5 rounded-full ${it.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
            </span>
            <span class="badge-pill bg-surface-raised text-slate-300">${it.badge || 'Popular'}</span>
            <span class="text-xs font-mono text-amber-400 flex items-center gap-0.5">
              <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i> ${it.rating}
            </span>
          </div>

          <h4 class="text-base font-bold text-white">${it.name}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">${it.description}</p>
          <div class="text-sm font-black font-mono text-white pt-1">₹${it.price}</div>
        </div>

        <div class="flex flex-col items-center gap-2 shrink-0">
          <div class="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
            <img src="${it.image}" alt="${it.name}" class="w-full h-full object-cover">
          </div>

          ${
            qty === 0
              ? `<button onclick="addToCart('${it.id}')" class="py-1.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add
                </button>`
              : `<div class="flex items-center gap-2 bg-surface-raised border border-white/10 rounded-xl px-2 py-1 text-xs">
                  <button onclick="updateCartQty('${it.id}', -1)" class="w-5 h-5 flex items-center justify-center font-bold text-slate-300 hover:text-white">-</button>
                  <span class="font-mono font-bold text-white px-1">${qty}</span>
                  <button onclick="updateCartQty('${it.id}', 1)" class="w-5 h-5 flex items-center justify-center font-bold text-slate-300 hover:text-white">+</button>
                </div>`
          }
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function addToCart(itemId) {
  playSound('tap');
  const rest = state.activeRestaurant;
  if (!rest) return;

  const item = rest.menu.find(m => m.id === itemId);
  if (!item) return;

  // Clear cart if switching restaurants
  const existingRestId = Object.values(state.cart)[0]?.restaurant?.id;
  if (existingRestId && existingRestId !== rest.id) {
    if (confirm('Your cart contains items from another restaurant. Would you like to clear it and start fresh with this order?')) {
      state.cart = {};
    } else {
      return;
    }
  }

  state.cart[itemId] = {
    item,
    quantity: 1,
    restaurant: rest
  };

  updateCartUI();
  renderMenuItems(rest.menu);
}

function updateCartQty(itemId, delta) {
  playSound('tap');
  if (!state.cart[itemId]) return;

  state.cart[itemId].quantity += delta;
  if (state.cart[itemId].quantity <= 0) {
    delete state.cart[itemId];
  }

  updateCartUI();
  if (state.activeRestaurant) {
    renderMenuItems(state.activeRestaurant.menu);
  }
}

function updateCartUI() {
  const items = Object.values(state.cart);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsTotal = items.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

  document.getElementById('nav-cart-badge').textContent = totalCount;
  document.getElementById('nav-cart-total').textContent = `₹${itemsTotal}`;

  // Drawer items
  const container = document.getElementById('cart-items-container');
  if (items.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 space-y-2">
        <i data-lucide="shopping-bag" class="w-8 h-8 text-slate-500 mx-auto"></i>
        <p class="text-xs">Your basket is currently empty.</p>
      </div>
    `;
  } else {
    container.innerHTML = items.map(({ item, quantity }) => `
      <div class="flex items-center justify-between p-3 rounded-2xl bg-surface-dark border border-white/5">
        <div class="space-y-0.5 truncate pr-2">
          <div class="text-xs font-bold text-white truncate">${item.name}</div>
          <div class="text-[11px] font-mono text-slate-400">₹${item.price} each</div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="flex items-center gap-2 bg-surface-card border border-white/10 rounded-lg px-2 py-0.5 text-xs font-mono">
            <button onclick="updateCartQty('${item.id}', -1)" class="text-slate-400 hover:text-white">-</button>
            <span class="font-bold text-white">${quantity}</span>
            <button onclick="updateCartQty('${item.id}', 1)" class="text-slate-400 hover:text-white">+</button>
          </div>
          <span class="text-xs font-bold font-mono text-white">₹${item.price * quantity}</span>
        </div>
      </div>
    `).join('');
  }

  const deliveryFee = items.length > 0 ? (items[0].restaurant.deliveryFee || 49) : 0;
  const platformFee = items.length > 0 ? 15 : 0;
  const taxes = Math.round(itemsTotal * 0.05);
  const grandTotal = itemsTotal > 0 ? (itemsTotal + deliveryFee + platformFee + taxes) : 0;

  document.getElementById('bill-items-total').textContent = `₹${itemsTotal}`;
  document.getElementById('bill-delivery-fee').textContent = `₹${deliveryFee}`;
  document.getElementById('bill-taxes').textContent = `₹${taxes}`;
  document.getElementById('bill-grand-total').textContent = `₹${grandTotal}`;
  document.getElementById('btn-pay-amount').textContent = `₹${grandTotal} →`;
  document.getElementById('modal-pay-total').textContent = `₹${grandTotal}`;

  lucide.createIcons();
}

function toggleCartDrawer() {
  playSound('tap');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');

  if (drawer.classList.contains('translate-x-full')) {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// Delivery Instructions Board Controller (User Requirement!)
// -------------------------------------------------------------
function toggleInstruction(key) {
  playSound('tap');
  state.deliveryInstructions[key] = !state.deliveryInstructions[key];
  const chip = document.getElementById(`chip-${key}`);

  if (state.deliveryInstructions[key]) {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
}

// -------------------------------------------------------------
// Online Payment Gateway Modal (UPI, Cards, Netbanking)
// -------------------------------------------------------------
function openPaymentModal() {
  if (Object.keys(state.cart).length === 0) {
    alert('Please add items to your cart before proceeding to payment!');
    return;
  }
  playSound('tap');
  state.deliveryInstructions.customNote = document.getElementById('cart-custom-note').value.trim();
  document.getElementById('payment-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('hidden');
}

function setPaymentTab(tab) {
  playSound('tap');
  state.paymentMethod = tab.toUpperCase();
  ['upi', 'card', 'netbanking', 'cod'].forEach(t => {
    document.getElementById(`pane-pay-${t}`).classList.add('hidden');
    document.getElementById(`tab-pay-${t}`).classList.remove('bg-surface-raised', 'text-white');
    document.getElementById(`tab-pay-${t}`).classList.add('text-slate-400');
  });

  document.getElementById(`pane-pay-${tab}`).classList.remove('hidden');
  document.getElementById(`tab-pay-${tab}`).classList.add('bg-surface-raised', 'text-white');
  document.getElementById(`tab-pay-${tab}`).classList.remove('text-slate-400');
  lucide.createIcons();
}

function selectUpiApp(appName) {
  playSound('tap');
  document.getElementById('upi-vpa-input').value = `customer@${appName.toLowerCase().replace(' ', '')}`;
}

function formatCardNumber(input) {
  let v = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  let matches = v.match(/\d{4,16}/g);
  let match = matches && matches[0] || '';
  let parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    input.value = parts.join(' ');
  } else {
    input.value = v;
  }
  document.getElementById('preview-card-number').textContent = input.value || '•••• •••• •••• 4892';
}

async function confirmOrderPayment() {
  const items = Object.values(state.cart);
  if (!items.length) return;

  const btn = document.getElementById('btn-confirm-payment');
  btn.disabled = true;
  document.getElementById('btn-confirm-payment-label').textContent = 'Processing Secure Payment...';

  const restaurant = items[0].restaurant;
  const payload = {
    restaurantId: restaurant.id,
    items: items.map(i => ({
      id: i.item.id,
      name: i.item.name,
      price: i.item.price,
      quantity: i.quantity
    })),
    deliveryAddress: {
      street: document.getElementById('cart-input-street').value || (state.userLocation?.exactAddress || "Chandigarh University Campus, Gharuan"),
      landmark: document.getElementById('cart-input-landmark').value || (state.userLocation?.landmark || "Gate No. 2, Student Plaza"),
      city: state.userLocation?.cityName || restaurant.city
    },
    deliveryInstructions: state.deliveryInstructions,
    paymentMethod: state.paymentMethod,
    userLocation: state.userLocation
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success && data.order) {
      playSound('success');
      state.activeOrder = data.order;
      state.cart = {};
      updateCartUI();
      closePaymentModal();
      toggleCartDrawer();

      // Show active order tracking
      showLiveTracking();
    }
  } catch (err) {
    console.error('Failed to place order:', err);
    alert('Payment processing failed. Please try again.');
  } finally {
    btn.disabled = false;
    document.getElementById('btn-confirm-payment-label').textContent = 'Confirm & Pay Securely';
  }
}

// -------------------------------------------------------------
// Live GPS Map Preview & Order Tracking (Core User Requirement!)
// -------------------------------------------------------------
function showLiveTracking() {
  if (!state.activeOrder) return;
  playSound('tap');

  document.getElementById('view-catalog').classList.add('hidden');
  document.getElementById('view-menu').classList.add('hidden');
  document.getElementById('view-tracking').classList.remove('hidden');
  document.getElementById('active-order-pill').classList.remove('hidden');
  document.getElementById('active-order-pill').classList.add('flex');

  updateTrackingViewDetails(state.activeOrder);
  initLiveMap(state.activeOrder);
  startLiveTelemetryPolling();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCatalog() {
  playSound('tap');
  document.getElementById('view-catalog').classList.remove('hidden');
  document.getElementById('view-menu').classList.add('hidden');
  document.getElementById('view-tracking').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTrackingViewDetails(order) {
  document.getElementById('track-order-id').textContent = order.id;

  // Heading & Subheading based on status
  const heading = document.getElementById('track-status-heading');
  const subheading = document.getElementById('track-status-subheading');

  if (order.status === 'DELIVERED') {
    heading.textContent = '🎉 Order Delivered! Enjoy Your Artisanal Meal';
    subheading.textContent = 'Driver arrived at your door. Thank you for ordering!';
    document.getElementById('pipe-step-4').classList.remove('opacity-50');
    document.getElementById('pipe-step-4').className = 'p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400';
  } else if (order.status === 'DRIVER_ON_WAY') {
    heading.textContent = '🛵 Delivery Partner is En Route to Your Address';
    subheading.textContent = `Estimated delivery in ${order.telemetry.remainingMinutes} mins • GPS updating`;
  } else {
    heading.textContent = '🍳 Kitchen is Handcrafting Your Order';
    subheading.textContent = 'Fresh ingredients being prepared. Courier assigned and ready.';
  }

  document.getElementById('track-eta-pill').textContent = `ETA: ${order.telemetry.remainingMinutes} mins`;
  document.getElementById('track-dist-remaining').textContent = `Distance Remaining: ${order.telemetry.distanceKm} km`;

  // Delivery Partner Details (User Requirement!)
  document.getElementById('driver-name-display').textContent = order.driver.name;
  document.getElementById('driver-phone-display').textContent = order.driver.phone;
  document.getElementById('driver-rating-display').textContent = order.driver.rating;
  document.getElementById('driver-trips-display').textContent = `${order.driver.deliveriesCount} deliveries`;
  document.getElementById('driver-vehicle-display').textContent = `${order.driver.vehicleType} • ${order.driver.vehiclePlate}`;
  document.getElementById('driver-avatar-img').src = order.driver.avatar;
  document.getElementById('driver-call-btn').href = `tel:${order.driver.phone}`;

  // Delivery Instructions Board Render (User Requirement!)
  const instructionsBox = document.getElementById('tracking-instructions-board');
  const inst = order.deliveryInstructions || {};
  const activeInstructions = [];

  if (inst.dontRingBell) activeInstructions.push('🔕 Do not ring the bell (Baby sleeping)');
  if (inst.avoidCalling) activeInstructions.push('📵 Avoid calling (Message on arrival)');
  if (inst.petAtHome) activeInstructions.push('🐕 Pet at home (Beware of friendly dog)');
  if (inst.leaveAtDoor) activeInstructions.push('🚪 Leave at door / front porch');
  if (inst.leaveWithGuard) activeInstructions.push('🏢 Leave with building security guard');

  let html = activeInstructions.map(text => `
    <div class="flex items-center gap-2 p-2.5 rounded-xl bg-surface-dark border border-white/5 text-xs text-amber-300 font-medium">
      <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>
      <span>${text}</span>
    </div>
  `).join('');

  if (inst.customNote) {
    html += `
      <div class="p-2.5 rounded-xl bg-surface-dark border border-white/5 text-xs text-slate-300 space-y-0.5">
        <span class="text-[10px] font-mono uppercase text-slate-500 block">Custom Direction Note:</span>
        <p class="italic font-mono">"${inst.customNote}"</p>
      </div>
    `;
  }

  if (activeInstructions.length === 0 && !inst.customNote) {
    html = `<p class="text-xs text-slate-500 italic">No special delivery instructions provided for this order.</p>`;
  }

  instructionsBox.innerHTML = html;

  // Address
  document.getElementById('track-address-street').textContent = order.deliveryAddress.street;
  document.getElementById('track-address-landmark').textContent = `Landmark: ${order.deliveryAddress.landmark}`;

  lucide.createIcons();
}

function initLiveMap(order) {
  const mapDiv = document.getElementById('live-map-container');
  if (!mapDiv) return;

  const rPos = [order.restaurant.lat, order.restaurant.lng];
  const cPos = [order.deliveryAddress.lat, order.deliveryAddress.lng];
  const dPos = order.telemetry.currentPos || rPos;

  if (state.mapInstance) {
    state.mapInstance.remove();
    state.mapInstance = null;
  }

  // Initialize Leaflet Map
  state.mapInstance = L.map('live-map-container', {
    zoomControl: true,
    attributionControl: false
  }).setView(dPos, 14);

  // High-Resolution Styled Map Tiles (CartoDB Dark Matter / OpenStreetMap Roads)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(state.mapInstance);

  // 1. Restaurant Marker
  const restIcon = L.divIcon({
    className: 'custom-rest-icon',
    html: `<div class="restaurant-marker-icon"><i data-lucide="utensils" style="width:18px;height:18px;"></i></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  state.restaurantMarker = L.marker(rPos, { icon: restIcon })
    .addTo(state.mapInstance)
    .bindPopup(`<b>${order.restaurant.name}</b><br>Kitchen Hub`);

  // 2. Customer Home Marker
  const homeIcon = L.divIcon({
    className: 'custom-home-icon',
    html: `<div class="customer-home-icon"><i data-lucide="home" style="width:18px;height:18px;"></i></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  state.customerMarker = L.marker(cPos, { icon: homeIcon })
    .addTo(state.mapInstance)
    .bindPopup(`<b>Your Delivery Location</b><br>${order.deliveryAddress.street}`);

  // 3. Driver Moving Vehicle Marker (Scooter with Pulse Ring)
  const driverIcon = L.divIcon({
    className: 'custom-scooter-icon',
    html: `
      <div class="driver-scooter-marker">
        <div class="pulse-ring"></div>
        <div class="driver-scooter-icon">
          <i data-lucide="bike" style="width:20px;height:20px;"></i>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
  state.driverMarker = L.marker(dPos, { icon: driverIcon })
    .addTo(state.mapInstance)
    .bindPopup(`<b>${order.driver.name}</b><br>${order.driver.vehicleType}`);

  // 4. Route Polyline
  state.routePolyline = L.polyline(order.telemetry.waypoints, {
    color: '#ff4757',
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8',
    lineCap: 'round'
  }).addTo(state.mapInstance);

  // Fit bounds to show both restaurant and customer comfortably
  const bounds = L.latLngBounds([rPos, cPos]);
  state.mapInstance.fitBounds(bounds, { padding: [60, 60] });
  lucide.createIcons();
}

function updateMapDriverMarker(currentPos) {
  if (state.driverMarker && currentPos) {
    state.driverMarker.setLatLng(currentPos);
  }
}

function startLiveTelemetryPolling() {
  clearInterval(state.trackingInterval);
  state.trackingInterval = setInterval(async () => {
    if (!state.activeOrder || state.activeOrder.status === 'DELIVERED') {
      clearInterval(state.trackingInterval);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${state.activeOrder.id}`);
      const data = await res.json();
      if (data.success && data.order) {
        state.activeOrder = data.order;
        updateTrackingViewDetails(data.order);
        updateMapDriverMarker(data.order.telemetry.currentPos);
      }
    } catch (e) {
      console.warn('Telemetry poll error:', e);
    }
  }, 4000);
}

// Fast-forward / Advance driver position on map for immediate demonstration
async function advanceDriverSimulation() {
  if (!state.activeOrder) return;
  playSound('tap');

  try {
    const res = await fetch(`/api/orders/${state.activeOrder.id}/advance`, { method: 'POST' });
    const data = await res.json();
    if (data.success && data.order) {
      state.activeOrder = data.order;
      updateTrackingViewDetails(data.order);
      updateMapDriverMarker(data.order.telemetry.currentPos);
      playSound('success');
    }
  } catch (err) {
    console.error('Simulation advance failed:', err);
  }
}

function promptDriverMessage() {
  const msg = prompt('Enter a message or direction for your delivery partner:');
  if (msg) {
    playSound('success');
    alert(`Message transmitted to ${state.activeOrder.driver.name}: "${msg}"`);
  }
}
