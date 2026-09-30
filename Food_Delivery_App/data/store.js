// data/store.js - Data access, distance calculation & live GPS simulation
const fs = require('fs');
const path = require('path');
const restaurants = require('./restaurants');
const drivers = require('./drivers');

const DB_FILE = path.join(__dirname, 'orders.json');

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Generate realistic polyline waypoints with micro-curves between start and end
function generateRouteWaypoints(startLat, startLng, endLat, endLng, steps = 25) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Base linear interpolation
    let lat = startLat + (endLat - startLat) * t;
    let lng = startLng + (endLng - startLng) * t;
    
    // Add realistic city road curvature (small sinusoidal jitter)
    if (i > 0 && i < steps) {
      const wobble = Math.sin(t * Math.PI) * 0.003;
      lat += wobble * (i % 2 === 0 ? 1 : -0.7);
      lng += wobble * (i % 3 === 0 ? -1 : 0.8);
    }
    points.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
  }
  return points;
}

class Store {
  constructor() {
    this.restaurants = restaurants;
    this.drivers = drivers;
    this.orders = {};
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.orders = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Initializing fresh orders store:', e.message);
      this.orders = {};
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.orders, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving orders.json:', e);
    }
  }

  getRestaurants({ userLat, userLng, city, cuisine, search }) {
    let list = this.restaurants.map(r => {
      let distanceKm = null;
      let calculatedDeliveryMin = r.deliveryTimeMin;

      if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
        distanceKm = haversineDistanceKm(Number(userLat), Number(userLng), r.lat, r.lng);
        // Realistic dynamic delivery time: if very near (<5km): 18-25m, else scaled
        if (distanceKm < 20) {
          calculatedDeliveryMin = Math.max(18, Math.round(distanceKm * 2.8 + 14));
        } else {
          // Cross-city or regional distance
          calculatedDeliveryMin = Math.min(65, Math.max(30, Math.round(distanceKm * 0.8 + 20)));
        }
      }

      return {
        ...r,
        distanceKm,
        calculatedDeliveryMin
      };
    });

    if (city && city !== 'All') {
      list = list.filter(r => r.city.toLowerCase().includes(city.toLowerCase()) || r.country.toLowerCase().includes(city.toLowerCase()));
    }

    if (cuisine && cuisine !== 'All') {
      list = list.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q))) ||
        (r.menu && r.menu.some(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)))
      );
    }

    // Sort: if user distance exists and user requested nearby, sort by distance
    if (userLat && userLng) {
      list.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  getRestaurantById(id) {
    return this.restaurants.find(r => r.id === id) || null;
  }

  createOrder({
    restaurantId,
    items,
    deliveryAddress,
    deliveryInstructions,
    paymentMethod,
    userLocation
  }) {
    const restaurant = this.getRestaurantById(restaurantId);
    if (!restaurant) throw new Error('Restaurant not found');

    const orderId = `OE-${Math.floor(100000 + Math.random() * 900000)}`;

    // Calculate totals
    let itemTotal = 0;
    items.forEach(it => {
      itemTotal += (Number(it.price) * Number(it.quantity || 1));
    });

    const deliveryFee = restaurant.deliveryFee || 49;
    const platformFee = 15;
    const taxes = Math.round(itemTotal * 0.05); // 5% GST/Tax
    const grandTotal = itemTotal + deliveryFee + platformFee + taxes;

    // Pick a driver randomly from fleet
    const randomDriver = this.drivers[Math.floor(Math.random() * this.drivers.length)];

    // Target coordinates
    const custLat = userLocation?.lat || (restaurant.lat + 0.015);
    const custLng = userLocation?.lng || (restaurant.lng + 0.012);

    // Generate waypoints from restaurant to customer
    const waypoints = generateRouteWaypoints(restaurant.lat, restaurant.lng, custLat, custLng, 25);

    const order = {
      id: orderId,
      status: "KITCHEN_PREPARING", // PLACED -> KITCHEN_PREPARING -> DRIVER_ON_WAY -> DELIVERED
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        city: restaurant.city,
        phone: restaurant.phone,
        address: restaurant.address,
        lat: restaurant.lat,
        lng: restaurant.lng,
        heroImage: restaurant.heroImage
      },
      driver: {
        id: randomDriver.id,
        name: randomDriver.name,
        phone: randomDriver.phone,
        rating: randomDriver.rating,
        deliveriesCount: randomDriver.deliveriesCount,
        vehicleType: randomDriver.vehicleType,
        vehiclePlate: randomDriver.vehiclePlate,
        avatar: randomDriver.avatar
      },
      items,
      pricing: {
        itemTotal,
        deliveryFee,
        platformFee,
        taxes,
        discount: 0,
        grandTotal
      },
      deliveryAddress: {
        street: deliveryAddress?.street || (userLocation?.exactAddress || "Chandigarh University Campus, Gharuan, Mohali"),
        city: deliveryAddress?.city || (userLocation?.cityName || restaurant.city),
        landmark: deliveryAddress?.landmark || "Gate 2 / Delivery Point",
        lat: custLat,
        lng: custLng
      },
      // Special Delivery Instructions Board
      deliveryInstructions: {
        dontRingBell: !!deliveryInstructions?.dontRingBell,
        avoidCalling: !!deliveryInstructions?.avoidCalling,
        petAtHome: !!deliveryInstructions?.petAtHome,
        leaveAtDoor: !!deliveryInstructions?.leaveAtDoor,
        leaveWithGuard: !!deliveryInstructions?.leaveWithGuard,
        customNote: deliveryInstructions?.customNote || ""
      },
      payment: {
        method: paymentMethod || "UPI",
        status: "COMPLETED",
        transactionId: `TXN_${Date.now()}`
      },
      timestamps: {
        placedAt: new Date().toISOString(),
        estimatedDeliveryMin: 22,
        estimatedDeliveryTime: new Date(Date.now() + 22 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      // Live Tracking Telemetry
      telemetry: {
        waypoints,
        currentStep: 2, // starts near restaurant
        currentPos: waypoints[0],
        totalSteps: waypoints.length,
        progressPct: 15,
        remainingMinutes: 18,
        distanceKm: Number(haversineDistanceKm(restaurant.lat, restaurant.lng, custLat, custLng).toFixed(1))
      }
    };

    this.orders[orderId] = order;
    this.save();
    return order;
  }

  getOrder(orderId) {
    const order = this.orders[orderId];
    if (!order) return null;

    // Simulate real-time movement: advance step if order is active
    if (order.status !== 'DELIVERED') {
      const elapsedSeconds = (Date.now() - new Date(order.timestamps.placedAt).getTime()) / 1000;
      
      const totalSteps = order.telemetry.waypoints.length;
      // Step advances based on elapsed time (smooth simulation: 1 step per 6 seconds)
      const calculatedStep = Math.min(totalSteps - 1, Math.floor(elapsedSeconds / 6) + 1);

      order.telemetry.currentStep = calculatedStep;
      order.telemetry.currentPos = order.telemetry.waypoints[calculatedStep];
      order.telemetry.progressPct = Math.round((calculatedStep / (totalSteps - 1)) * 100);
      
      // Update status pipeline
      if (calculatedStep >= totalSteps - 1) {
        order.status = "DELIVERED";
        order.telemetry.remainingMinutes = 0;
      } else if (calculatedStep > 4) {
        order.status = "DRIVER_ON_WAY";
        const remRatio = 1 - (calculatedStep / totalSteps);
        order.telemetry.remainingMinutes = Math.max(1, Math.round(18 * remRatio));
      } else {
        order.status = "KITCHEN_PREPARING";
        order.telemetry.remainingMinutes = 20;
      }

      this.save();
    }

    return order;
  }

  advanceOrderStatus(orderId) {
    const order = this.orders[orderId];
    if (!order) return null;

    const totalSteps = order.telemetry.waypoints.length;
    let nextStep = Math.min(totalSteps - 1, order.telemetry.currentStep + 5);

    order.telemetry.currentStep = nextStep;
    order.telemetry.currentPos = order.telemetry.waypoints[nextStep];
    order.telemetry.progressPct = Math.round((nextStep / (totalSteps - 1)) * 100);

    if (nextStep >= totalSteps - 1) {
      order.status = "DELIVERED";
      order.telemetry.remainingMinutes = 0;
    } else {
      order.status = "DRIVER_ON_WAY";
      order.telemetry.remainingMinutes = Math.max(2, Math.round(18 * (1 - nextStep / totalSteps)));
    }

    this.save();
    return order;
  }
}

module.exports = new Store();
