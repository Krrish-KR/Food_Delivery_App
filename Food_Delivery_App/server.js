// server.js - OmniEats Food Delivery API & Live Telemetry Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const store = require('./data/store');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
// Restaurant Endpoints
// -------------------------------------------------------------

// List restaurants with live distance calculation & geolocation sorting
app.get('/api/restaurants', (req, res) => {
  const { lat, lng, city, cuisine, search } = req.query;
  const list = store.getRestaurants({
    userLat: lat ? Number(lat) : undefined,
    userLng: lng ? Number(lng) : undefined,
    city,
    cuisine,
    search
  });

  res.json({
    success: true,
    count: list.length,
    userLocationProvided: !!(lat && lng),
    data: list
  });
});

// Single restaurant with complete menu & contact details
app.get('/api/restaurants/:id', (req, res) => {
  const rest = store.getRestaurantById(req.params.id);
  if (!rest) {
    return res.status(404).json({ success: false, error: 'Restaurant not found' });
  }
  res.json({ success: true, data: rest });
});

// Reverse-geocode coordinates to exact real street address
app.get('/api/reverse-geocode', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, error: 'Latitude and Longitude are required' });
  }

  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${numLat}&lon=${numLng}&zoom=18&addressdetails=1`;

    const geoRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'OmniEatsFoodDelivery/1.0 (contact@omnieats.local)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const addr = geoData.address || {};

      const street = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || addr.quarter || 'Campus / Street Address';
      const city = addr.city || addr.town || addr.village || addr.county || 'Mohali / Kharar';
      const state = addr.state || 'Punjab';
      const postcode = addr.postcode || '';
      const landmark = addr.amenity || addr.building || (addr.suburb ? `Near ${addr.suburb}` : 'Main Gate Area');

      return res.json({
        success: true,
        source: 'nominatim',
        address: {
          street: `${street}${addr.house_number ? ' #' + addr.house_number : ''}`,
          landmark: landmark,
          area: addr.suburb || addr.neighbourhood || addr.city_district || city,
          city: city,
          state: state,
          postcode: postcode,
          displayName: geoData.display_name
        }
      });
    }
  } catch (err) {
    console.warn('Nominatim reverse-geocode fallback triggered:', err.message);
  }

  // Intelligent proximity fallback for Chandigarh University & Kharar
  const dCU = Math.hypot(numLat - 30.7710, numLng - 76.5760);
  const dKharar = Math.hypot(numLat - 30.7480, numLng - 76.6450);

  if (dCU < 0.1) {
    return res.json({
      success: true,
      source: 'cu-proximity',
      address: {
        street: 'Chandigarh University Campus, NH-05, Gharuan',
        landmark: 'Near Gate No. 2 & Student Plaza',
        area: 'Gharuan',
        city: 'Chandigarh University / Kharar',
        state: 'Punjab',
        postcode: '140413',
        displayName: 'Chandigarh University, NH-05, Ludhiana - Chandigarh Highway, Gharuan, Mohali, Punjab 140413'
      }
    });
  } else if (dKharar < 0.15) {
    return res.json({
      success: true,
      source: 'kharar-proximity',
      address: {
        street: 'Sunny Enclave / Sector 125, Kharar Highway',
        landmark: 'Near Kharar Bus Stand / Sunny Business Park',
        area: 'Sunny Enclave',
        city: 'Kharar',
        state: 'Punjab',
        postcode: '140301',
        displayName: 'Sunny Enclave, Sector 125, Kharar, Mohali, Punjab 140301'
      }
    });
  }

  return res.json({
    success: true,
    source: 'coordinates',
    address: {
      street: `Live Coordinates (${numLat.toFixed(4)}° N, ${numLng.toFixed(4)}° E)`,
      landmark: 'Near Current GPS Position',
      area: 'Local Area',
      city: 'Detected City',
      state: '',
      postcode: '',
      displayName: `GPS Location: ${numLat.toFixed(4)}, ${numLng.toFixed(4)}`
    }
  });
});

// -------------------------------------------------------------
// Orders & Live GPS Tracking Endpoints
// -------------------------------------------------------------

// Place a new order with payment & delivery instructions
app.post('/api/orders', (req, res) => {
  const {
    restaurantId,
    items,
    deliveryAddress,
    deliveryInstructions,
    paymentMethod,
    userLocation
  } = req.body;

  if (!restaurantId || !items || !items.length) {
    return res.status(400).json({ success: false, error: 'restaurantId and items are required' });
  }

  try {
    const order = store.createOrder({
      restaurantId,
      items,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      userLocation
    });

    res.json({
      success: true,
      message: 'Order confirmed! Kitchen is preparing your artisanal food.',
      order
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get order status and live telemetry
app.get('/api/orders/:id', (req, res) => {
  const order = store.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// Fast-forward / Advance driver position for demonstration
app.post('/api/orders/:id/advance', (req, res) => {
  const order = store.advanceOrderStatus(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, message: 'Driver telemetry advanced', order });
});

// Fallback to SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🍔 OmniEats Live Food Delivery Platform Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗺️ Full Map Preview & Live GPS Route Tracking Active`);
  console.log(`💳 UPI, Cards, Netbanking & Instructions Board Ready`);
  console.log(`=======================================================`);
});
