// data/restaurants.js - Comprehensive authentic culinary establishments including Kharar & Chandigarh University
module.exports = [
  // =========================================================================
  // 🎓 CHANDIGARH UNIVERSITY (CU) & GHARUAN (CAMPUS & NEARBY)
  // =========================================================================
  {
    id: "rest-cu-01",
    name: "CU Food Street & Kathi Rolls Junction",
    city: "Chandigarh University (CU)",
    country: "India",
    cuisine: "North Indian, Kathi Rolls & Street Bites",
    phone: "+91 98765 12001",
    address: "Opposite Gate No. 2, Chandigarh University Campus, Gharuan, Mohali 140413",
    lat: 30.7715,
    lng: 76.5765,
    rating: 4.92,
    reviewsCount: 3840,
    priceRange: "$",
    deliveryTimeMin: 15,
    deliveryFee: 19,
    heroImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    tags: ["Campus Favorite", "Late Night Delivery", "Kathi Rolls", "CU Student Special"],
    menu: [
      {
        id: "cu-m1",
        category: "Signature Rolls",
        name: "Double Paneer Tikka Malai Roll",
        description: "Crispy flaky paratha stuffed with marinated tandoori cottage cheese, caramelized onions, mint chutney and liquid cheese blend.",
        price: 130,
        isVeg: true,
        rating: 4.96,
        badge: "CU Top Pick",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "cu-m2",
        category: "Signature Rolls",
        name: "Egg Chicken Bhuna Kathi Roll",
        description: "Double egg coated lachha paratha loaded with juicy spiced shredded chicken bhuna, green chili crisp and zesty lime.",
        price: 150,
        isVeg: false,
        rating: 4.94,
        badge: "Bestseller",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "cu-m3",
        category: "Student Munchies",
        name: "Kurkure Crispy Veg Momos (8 Pcs)",
        description: "Crunchy fried momos coated in cornflake crumb batter, dusted with peri-peri spice and served with spicy red chili dip.",
        price: 110,
        isVeg: true,
        rating: 4.88,
        badge: "Extra Crunchy",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "cu-m4",
        category: "Beverages",
        name: "Thick Hazelnut Cold Coffee Shake",
        description: "Freshly brewed dark espresso blended with creamy vanilla ice cream, roasted hazelnut syrup and chocolate drizzle.",
        price: 80,
        isVeg: true,
        rating: 4.9,
        badge: "Chilled",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-cu-02",
    name: "Amritsari Kulcha Hub & Lassi Bar",
    city: "Chandigarh University (CU)",
    country: "India",
    cuisine: "Authentic Amritsari Kulchas & Punjabi Thali",
    phone: "+91 98144 88321",
    address: "National Highway 05, Opposite Gate No. 1, Chandigarh University, Gharuan",
    lat: 30.7695,
    lng: 76.5742,
    rating: 4.95,
    reviewsCount: 4210,
    priceRange: "$",
    deliveryTimeMin: 18,
    deliveryFee: 25,
    heroImage: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=1200&q=80",
    tags: ["Authentic Tandoor", "Chur Chur Naan", "Pindi Chole", "Clay Pot Lassi"],
    menu: [
      {
        id: "ak-m1",
        category: "Amritsari Kulchas",
        name: "Special Aloo Pyaaz Chur Chur Kulcha Thali",
        description: "Crushed flaky tandoori kulcha drenched in desi makhan, served with piping hot spiced Pindi Chole, imli pyaaz chutney & boondi raita.",
        price: 140,
        isVeg: true,
        rating: 4.98,
        badge: "Gold Standard",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ak-m2",
        category: "Amritsari Kulchas",
        name: "Amritsari Paneer Garlic Kulcha Platter",
        description: "Stuffed with grated malai paneer, fresh coriander, ginger juliennes and crushed roasted anardana seeds.",
        price: 170,
        isVeg: true,
        rating: 4.93,
        badge: "Chef Special",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ak-m3",
        category: "Beverages",
        name: "Patiala Malai Lassi (Clay Kulhad 500ml)",
        description: "Thick sweet curd churned with saffron and cardamom, crowned with a thick layer of clotted fresh malai and chopped almonds.",
        price: 70,
        isVeg: true,
        rating: 4.97,
        badge: "Pure Punjabi",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-cu-03",
    name: "Giani Da Dhaba & Highway Parathas",
    city: "Chandigarh University (CU)",
    country: "India",
    cuisine: "Punjabi Dhaba & Clay Oven Specialties",
    phone: "+91 98881 23450",
    address: "Near CU Sports Complex Road, Gharuan-Kharar Highway, Punjab 140413",
    lat: 30.7730,
    lng: 76.5780,
    rating: 4.89,
    reviewsCount: 2950,
    priceRange: "$$",
    deliveryTimeMin: 20,
    deliveryFee: 29,
    heroImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Dhaba Style", "Butter Chicken", "Dal Makhani", "Tandoori Parathas"],
    menu: [
      {
        id: "giani-m1",
        category: "Main Course",
        name: "Highway Style Kadhai Murgh",
        description: "Bone-in tender chicken slow braised with crushed coriander seeds, bell peppers, fresh ginger and thick spicy onion gravy.",
        price: 320,
        isVeg: false,
        rating: 4.91,
        badge: "Highway Legacy",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "giani-m2",
        category: "Main Course",
        name: "Shahi Paneer Butter Masala",
        description: "Velvety cashew and vine-ripened tomato gravy infused with kasuri methi and soft malai paneer cubes.",
        price: 240,
        isVeg: true,
        rating: 4.88,
        badge: "Rich & Creamy",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "giani-m3",
        category: "Tandoori Breads",
        name: "Amul Butter Naan Basket (2 Pcs)",
        description: "Clay tandoor blistered leavened flatbread brushed with bubbling golden Amul butter.",
        price: 70,
        isVeg: true,
        rating: 4.86,
        badge: "Fresh Tandoori",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-cu-04",
    name: "The Asian Wok & Momos Kingdom",
    city: "Chandigarh University (CU)",
    country: "India",
    cuisine: "Chinese, Tibetan & Pan-Asian Wok",
    phone: "+91 97799 44321",
    address: "Student Plaza, Near Engineering Block, Chandigarh University Campus, Gharuan",
    lat: 30.7708,
    lng: 76.5758,
    rating: 4.91,
    reviewsCount: 3120,
    priceRange: "$",
    deliveryTimeMin: 15,
    deliveryFee: 19,
    heroImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    tags: ["Campus Delivery", "Fast Noodles", "Chili Chicken", "Hakka Cuisine"],
    menu: [
      {
        id: "wok-m1",
        category: "Wok Classics",
        name: "Chili Garlic Hakka Noodles with Manchurian",
        description: "Wok tossed egg/veg noodles with crisp shredded cabbage, carrots, spring onions in spicy chili garlic sauce with 4 veg manchurian balls.",
        price: 160,
        isVeg: true,
        rating: 4.92,
        badge: "Combo Deal",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "wok-m2",
        category: "Wok Classics",
        name: "Crispy Drums of Heaven / Chicken Lollipops (6 Pcs)",
        description: "Juicy chicken wings shaped into lollipops, coated in secret batter, fried golden and tossed in sweet fiery Schezwan glaze.",
        price: 210,
        isVeg: false,
        rating: 4.95,
        badge: "Student Must-Try",
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },

  // =========================================================================
  // 🏙️ KHARAR & SUNNY ENCLAVE (NEAR CHANDIGARH UNIVERSITY)
  // =========================================================================
  {
    id: "rest-kharar-01",
    name: "Chawla's 2 The Mughlai Heritage",
    city: "Kharar",
    country: "India",
    cuisine: "Legendary Cream Chicken & Mughlai",
    phone: "+91 160 500 4821",
    address: "SCF 24-25, Sector 125, Sunny Enclave, Kharar, Punjab 140301",
    lat: 30.7480,
    lng: 76.6450,
    rating: 4.93,
    reviewsCount: 4890,
    priceRange: "$$",
    deliveryTimeMin: 22,
    deliveryFee: 35,
    heroImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Legendary Cream Chicken", "Sunny Enclave", "Mughlai Feast", "Family Dining"],
    menu: [
      {
        id: "chw-m1",
        category: "Chawla's Specials",
        name: "World-Renowned Cream Chicken",
        description: "Bone-in tender chicken braised in milk, heavy cream, freshly ground black peppercorns and aromatic secret herbs. Mild, velvety and legendary.",
        price: 380,
        isVeg: false,
        rating: 4.99,
        badge: "World Famous",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "chw-m2",
        category: "Vegetarian Specialties",
        name: "Dal Makhani Desi Ghee Tadka",
        description: "Black urad lentils slow simmered overnight on charcoal, infused with fresh tomato puree, garlic butter and finished with cream.",
        price: 240,
        isVeg: true,
        rating: 4.91,
        badge: "Pure Comfort",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "chw-m3",
        category: "Tandoori Breads",
        name: "Stuffed Cheese Garlic Naan",
        description: "Naan stuffed with grated mozzarella, roasted garlic flakes and green chillies, baked in tandoor.",
        price: 90,
        isVeg: true,
        rating: 4.88,
        badge: "Cheesy Delight",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-kharar-02",
    name: "Uncle Jack's American Diner",
    city: "Kharar / Mohali",
    country: "India",
    cuisine: "Gourmet Burgers, Chicago Fries & Shakes",
    phone: "+91 160 511 2020",
    address: "Upper Ground Floor, VR Punjab Mall, Kharar-Mohali Road, Punjab 140301",
    lat: 30.7380,
    lng: 76.6620,
    rating: 4.92,
    reviewsCount: 5400,
    priceRange: "$$",
    deliveryTimeMin: 25,
    deliveryFee: 39,
    heroImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    tags: ["VR Punjab", "Chicago Fries", "Smash Burgers", "Gourmet Waffles"],
    menu: [
      {
        id: "uj-m1",
        category: "Loaded Fries",
        name: "The Chicago Messy Cheese & Bacon Fries",
        description: "Crispy crinkle-cut fries layered with liquid yellow cheddar, ranch dressing, jalapeños, crispy chicken bacon bits and caramelized onions.",
        price: 240,
        isVeg: false,
        rating: 4.96,
        badge: "Signature Must-Have",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "uj-m2",
        category: "Gourmet Burgers",
        name: "The Clinton Double Smash Beast Burger",
        description: "Two crispy grilled patties, double melted cheddar, grilled mushrooms, BBQ glaze and house secret sauce on toasted brioche.",
        price: 280,
        isVeg: false,
        rating: 4.94,
        badge: "Heavy Hitter",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "uj-m3",
        category: "Artisan Shakes",
        name: "Monster Nutella Ferrero Rocher Shake",
        description: "Creamy chocolate shake loaded with whole Ferrero Rocher chocolates, swirls of warm Nutella, whipped cream and wafer roll.",
        price: 210,
        isVeg: true,
        rating: 4.97,
        badge: "Dessert Legend",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-kharar-03",
    name: "Sethi Dhaba Heritage",
    city: "Kharar",
    country: "India",
    cuisine: "Desi Punjabi Food & Gurdas Maan Legacy",
    phone: "+91 98150 77112",
    address: "National Highway 21, Main Kharar Highway, Near Gurdwara, Kharar 140301",
    lat: 30.7490,
    lng: 76.6380,
    rating: 4.9,
    reviewsCount: 6200,
    priceRange: "$$",
    deliveryTimeMin: 24,
    deliveryFee: 30,
    heroImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Highway Landmark", "Makki Di Roti", "Sarson Da Saag", "Punjabi Music Vibe"],
    menu: [
      {
        id: "sethi-m1",
        category: "Punjab Specialties",
        name: "Sarson Ka Saag with Makki Di Roti (2 Pcs) & Gur",
        description: "Fresh mustard greens cooked in brass handi with butter and ginger, paired with wood-fired yellow corn flatbreads, white makkhan and organic jaggery.",
        price: 220,
        isVeg: true,
        rating: 4.99,
        badge: "Authentic Seasonal",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "sethi-m2",
        category: "Tandoori Parathas",
        name: "Lachhedar Aloo Paneer Paratha with Dahi",
        description: "Layered tandoori paratha stuffed generously with potatoes, fresh paneer, green chilies, served with thick curd and spicy pickle.",
        price: 110,
        isVeg: true,
        rating: 4.92,
        badge: "Breakfast Favorite",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-kharar-04",
    name: "La Pino'z Pizza Kharar",
    city: "Kharar",
    country: "India",
    cuisine: "Italian Pizzas, Pastas & Garlic Breads",
    phone: "+91 160 501 8899",
    address: "Shop No 14, Desu Majra, Kharar-Chandigarh Highway, Kharar, Punjab",
    lat: 30.7440,
    lng: 76.6510,
    rating: 4.88,
    reviewsCount: 3890,
    priceRange: "$$",
    deliveryTimeMin: 25,
    deliveryFee: 35,
    heroImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    tags: ["Giant Slices", "Burn to Hell Pizza", "Cheesy 7", "Late Night"],
    menu: [
      {
        id: "lp-m1",
        category: "Artisan Pizzas",
        name: "Cheesy 7 Signature Pizza (Regular / Large)",
        description: "Loaded with an indulgent blend of 7 cheeses: Mozzarella, Orange Cheddar, White Cheddar, Cream Cheese, Gouda, Colby and Monterey Jack.",
        price: 360,
        isVeg: true,
        rating: 4.95,
        badge: "Cheese Overload",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "lp-m2",
        category: "Artisan Pizzas",
        name: "Burn to Hell Fiery Chicken Pizza",
        description: "Peri-peri chicken, spicy jalapeños, red paprika, hot garlic sauce and melted mozzarella for spice lovers.",
        price: 390,
        isVeg: false,
        rating: 4.9,
        badge: "Super Spicy",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "lp-m3",
        category: "Sides",
        name: "Cheesy Stuffed Garlic Breadsticks",
        description: "Freshly baked garlic bread filled with molten cheese and sweet corn, sprinkled with oregano herb seasoning.",
        price: 150,
        isVeg: true,
        rating: 4.89,
        badge: "Crust Favorite",
        image: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-kharar-05",
    name: "Baba Dairy Sweets & Restaurant",
    city: "Kharar",
    country: "India",
    cuisine: "Desi Ghee Sweets, Chole Bhature & Snacks",
    phone: "+91 160 228 1010",
    address: "Old Bus Stand Road, Main Bazaar, Kharar, Punjab 140301",
    lat: 30.7460,
    lng: 76.6420,
    rating: 4.91,
    reviewsCount: 4600,
    priceRange: "$",
    deliveryTimeMin: 20,
    deliveryFee: 25,
    heroImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    tags: ["Chole Bhature", "Fresh Paneer", "Desi Ghee Jalebi", "Breakfast Hotspot"],
    menu: [
      {
        id: "baba-m1",
        category: "All Day Snacks",
        name: "Fluffy Amritsari Chole Bhature (2 Pcs)",
        description: "Puffed golden bhature served with slow-cooked dark spicy kabuli chana, pickled green chilies and sliced onions.",
        price: 130,
        isVeg: true,
        rating: 4.97,
        badge: "Best in Kharar",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "baba-m2",
        category: "Mithai & Desserts",
        name: "Crispy Desi Ghee Jalebi with Rabri (250g)",
        description: "Hot crispy pretzel swirls soaked in saffron sugar syrup, topped with thick reduced malai rabri.",
        price: 150,
        isVeg: true,
        rating: 4.98,
        badge: "Sweet Sensation",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-kharar-06",
    name: "The Belgian Waffle Co.",
    city: "Kharar",
    country: "India",
    cuisine: "Artisan Waffles, Pancakes & Desserts",
    phone: "+91 99155 77221",
    address: "Sunny Business Park, Sector 125, Kharar, Punjab",
    lat: 30.7475,
    lng: 76.6465,
    rating: 4.94,
    reviewsCount: 3200,
    priceRange: "$$",
    deliveryTimeMin: 22,
    deliveryFee: 29,
    heroImage: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Waffle Sandwich", "Nutella Overload", "Sunny Enclave"],
    menu: [
      {
        id: "bw-m1",
        category: "Waffle Sandwiches",
        name: "Naked Nutella Golden Waffle Sandwich",
        description: "Warm golden crispy classic waffle smeared inside and out with creamy authentic European Nutella chocolate spread.",
        price: 170,
        isVeg: true,
        rating: 4.98,
        badge: "No. 1 Bestseller",
        image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "bw-m2",
        category: "Waffle Sandwiches",
        name: "Red Velvet Cream Cheese Waffle",
        description: "Original red velvet waffle layered with sweet Philadelphia cream cheese glaze and white chocolate drops.",
        price: 180,
        isVeg: true,
        rating: 4.92,
        badge: "Velvety Rich",
        image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },

  // =========================================================================
  // 🌍 INTERNATIONAL CULINARY ESTABLISHMENTS
  // =========================================================================
  {
    id: "rest-roma-01",
    name: "Trattoria Da Enzo al 29",
    city: "Rome",
    country: "Italy",
    cuisine: "Italian & Artisanal Pasta",
    phone: "+39 06 581 2260",
    address: "Via dei Vascellari 29, 00153 Roma RM, Italy",
    lat: 41.8885,
    lng: 12.4776,
    rating: 4.9,
    reviewsCount: 4280,
    priceRange: "$$",
    deliveryTimeMin: 25,
    deliveryFee: 49,
    heroImage: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    tags: ["Authentic Roman", "Handmade Pasta", "Michelin Recommended"],
    menu: [
      {
        id: "roma-m1",
        category: "Handmade Pastas",
        name: "Rigatoni alla Carbonara Tradizionale",
        description: "Crisp Guanciale di Amatrice, fresh farm egg yolk, aged Pecorino Romano DOP, crushed Tellicherry black pepper.",
        price: 380,
        isVeg: false,
        rating: 4.95,
        badge: "Chef Signature",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "roma-m4",
        category: "Dolci",
        name: "Classic Mascarpone Tiramisù",
        description: "Espresso-soaked Savoiardi ladyfingers layered with airy whipped mascarpone and dark Valrhona cocoa.",
        price: 220,
        isVeg: true,
        rating: 4.98,
        badge: "House Specialty",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-tokyo-02",
    name: "Sukiyabashi Master Sushi & Grill",
    city: "Tokyo",
    country: "Japan",
    cuisine: "Japanese Edomae & Robata",
    phone: "+81 3 3535 3600",
    address: "4-2-15 Ginza, Chuo City, Tokyo 104-0061, Japan",
    lat: 35.6719,
    lng: 139.7639,
    rating: 4.96,
    reviewsCount: 5120,
    priceRange: "$$$",
    deliveryTimeMin: 30,
    deliveryFee: 65,
    heroImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Edomae Nigiri", "A5 Wagyu", "Toyosu Market Fish"],
    menu: [
      {
        id: "tky-m1",
        category: "Nigiri & Rolls",
        name: "Otoro & Salmon Aburi Platter (12 Pcs)",
        description: "Torched fatty bluefin tuna belly, king salmon with yuzu kosho, Hokkaido scallop & sweet tamago.",
        price: 680,
        isVeg: false,
        rating: 4.99,
        badge: "Chef Selection",
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "tky-m3",
        category: "Comfort Bowls",
        name: "Truffle Chashu Tonkotsu Ramen",
        description: "24-hour rich pork bone broth, springy handcrafted noodles, flame-seared chashu pork, black truffle oil & ajitsuke tamago.",
        price: 420,
        isVeg: false,
        rating: 4.91,
        badge: "Signature Broth",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-paris-03",
    name: "Le Petit Bistro Montmartre",
    city: "Paris",
    country: "France",
    cuisine: "Classic French & Brasserie",
    phone: "+33 1 42 54 88 36",
    address: "18 Rue Tholozé, 75018 Paris, France",
    lat: 48.8872,
    lng: 2.3364,
    rating: 4.88,
    reviewsCount: 3100,
    priceRange: "$$",
    deliveryTimeMin: 28,
    deliveryFee: 55,
    heroImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["French Bistro", "Slow-Cooked", "Artisanal Bakery"],
    menu: [
      {
        id: "prs-m1",
        category: "Plats Principaux",
        name: "Confit de Canard Croustillant",
        description: "Crispy skin duck leg confit slowly cured in sea salt and herbs, served with duck fat roasted Sarladaise potatoes.",
        price: 520,
        isVeg: false,
        rating: 4.92,
        badge: "Traditional",
        image: "https://images.unsplash.com/photo-1514944298352-7a2e7c37617b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "prs-m3",
        category: "Desserts",
        name: "Tahitian Vanilla Crème Brûlée",
        description: "Velvety custard infused with whole Tahitian vanilla beans beneath a brittle, glass-like caramelized sugar crust.",
        price: 190,
        isVeg: true,
        rating: 4.94,
        badge: "Classic",
        image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-ny-05",
    name: "The Manhattan Grill & Burger Lab",
    city: "New York",
    country: "USA",
    cuisine: "Artisan Burgers & American Comfort",
    phone: "+1 212 555 0199",
    address: "224 W 47th St, Times Square, New York, NY 10036, USA",
    lat: 40.7589,
    lng: -73.9851,
    rating: 4.89,
    reviewsCount: 3950,
    priceRange: "$$",
    deliveryTimeMin: 20,
    deliveryFee: 45,
    heroImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    tags: ["Dry-Aged Beef", "Truffle Fries", "Gourmet Shakes"],
    menu: [
      {
        id: "nyc-m1",
        category: "Artisanal Burgers",
        name: "Black Truffle & Double Smash Burger",
        description: "Two 45-day dry-aged beef patties, cave-aged Gruyère, black truffle aioli, caramelized shallots on toasted brioche.",
        price: 390,
        isVeg: false,
        rating: 4.96,
        badge: "Award Winner",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "rest-dubai-08",
    name: "Al Hadheerah Royal Emirates Kitchen",
    city: "Dubai",
    country: "United Arab Emirates",
    cuisine: "Middle Eastern & Levant Grills",
    phone: "+971 4 809 6194",
    address: "Bab Al Shams Desert Resort, Al Qudra Road, Dubai, UAE",
    lat: 25.2048,
    lng: 55.2708,
    rating: 4.94,
    reviewsCount: 4700,
    priceRange: "$$$",
    deliveryTimeMin: 28,
    deliveryFee: 50,
    heroImage: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80",
    tags: ["Levant Mezze", "Slow Roast Ouzi", "Halal Certified"],
    menu: [
      {
        id: "dxb-m1",
        category: "Royal Grills",
        name: "Slow-Braised Royal Lamb Shank Ouzi",
        description: "Tender lamb shank slow-cooked for 12 hours with Gulf spices, served atop fragrant spiced rice with toasted almonds & pine nuts.",
        price: 580,
        isVeg: false,
        rating: 4.97,
        badge: "Signature Royal",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
];
