// ==================== ECOMMERCE-SIMPLE.JSX LOGIC EXPLANATION ====================
// 🏗️ App Structure Overview
// This app has 4 main parts:

//(A) Product Display - Showing items for sale

//(B) Shopping Cart - Holding selected items

//(C) Filters - Helping users find products

//(D) UI Controls - Buttons and interactions

// 🧠 Core React Concepts Demonstrated
// 1. State Management - The App's Memory
// jsx
// const [products] = useState([...])      // Product catalog (never changes)
// const [cart, setCart] = useState([])    // Shopping cart items
// const [filters, setFilters] = useState({...})  // User filter preferences
// const [showCart, setShowCart] = useState(false) // Cart visibility
// Simple Explanation:

// useState is like the app's "memory" that remembers what's happening

// When state changes, React automatically updates the display

// 2. useMemo - Smart Filtering
// jsx
// const filteredProducts = useMemo(() => {
//   return products
//     .filter((product) => {
//       // Filter logic here
//     })
//     .sort((a, b) => {
//       // Sort logic here
//     });
// }, [products, filters]); // Only recalculate when these change
// Why this matters:

// Without useMemo, filtering would happen on EVERY click/typing

// With useMemo, it only recalculates when products or filters change

// Performance optimization

// 3. Cart Management Logic
// Adding to Cart:
// jsx
// const addToCart = (product) => {
//   setCart((prev) => {
//     const existing = prev.find((item) => item.id === product.id);
//     if (existing) {
//       // If item exists, increase quantity
//       return prev.map((item) =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     }
//     // If new item, add with quantity 1
//     return [...prev, { ...product, quantity: 1 }];
//   });
// };
// What's happening:

// Check if item already in cart

// If yes: increase quantity

// If no: add new item with quantity 1

// Updating Quantity:
// jsx
// const updateQuantity = (productId, newQuantity) => {
//   if (newQuantity === 0) {
//     removeFromCart(productId);  // Remove if quantity becomes 0
//   } else {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === productId ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   }
// };
// 🔍 Filter System Breakdown
// Category Filter:
// jsx
// const categoryMatch =
//   filters.category === "all" ||
//   product.category === filters.category;
// Shows all products OR only specific category

// Price Filter:
// jsx
// const priceMatch =
//   product.price >= filters.priceRange[0] &&
//   product.price <= filters.priceRange[1];
// Only shows products within price range

// Sort Function:
// jsx
// .sort((a, b) => {
//   if (filters.sortBy === "price") return a.price - b.price;  // Cheapest first
//   if (filters.sortBy === "name") return a.name.localeCompare(b.name); // A-Z
//   return 0; // No sorting
// });
// 🛒 Cart Calculations
// jsx
// const cartTotal = cart.reduce(
//   (sum, item) => sum + item.price * item.quantity,
//   0
// );
// const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
// How reduce works:

// cartTotal: Adds up (price × quantity) for all items

// cartCount: Adds up all quantities

// Example:

// Headphones: $99 × 2 = $198

// Shoes: $120 × 1 = $120

// Total: $318

// Count: 3 items

// 🎨 UI Components Logic
// 1. Product Grid:
// jsx
// {filteredProducts.map((product) => (
//   <div key={product.id} className="...">
//     <div>{product.image}</div>
//     <h3>{product.name}</h3>
//     <p>${product.price}</p>
//     <button onClick={() => addToCart(product)}>Add</button>
//   </div>
// ))}
// 2. Cart Sidebar:
// showCart state controls visibility

// Fixed positioning overlays main content

// Shows cart items with quantity controls

// 3. Cart Badge:
// jsx
// {cartCount > 0 && (
//   <span className="...">{cartCount}</span>
// )}
// Only shows when cart has items

// Displays total item count

// 🔄 Data Flow Summary
// User interacts → Filter changes → setFilters() → Component re-renders

// useMemo detects filter changes → Recalculates filteredProducts

// UI updates with new filtered list

// Add to cart → Updates cart state → Cart badge updates

// Open cart → setShowCart(true) → Sidebar appears

// 💡 Key React Patterns to Notice
// 1. Immutability (Never modify state directly):
// jsx
// // ✅ GOOD - Create new array
// setCart([...prev, newItem])

// // ❌ BAD - Modifying existing array
// prev.push(newItem)
// 2. Functional Updates (When new state depends on old state):
// jsx
// // ✅ GOOD
// setCart(prev => [...prev, newItem])

// // ❌ BAD (in some cases)
// setCart([...cart, newItem])
// 3. Conditional Rendering:
// jsx
// {showCart && <CartSidebar />}          // Show/hide component
// {cartCount > 0 && <Badge />}           // Conditional display
// {filteredProducts.length === 0 && ...} // Empty state
// 🎯 Real-World Analogies
// State = Store manager's clipboard tracking inventory and sales

// useMemo = Smart assistant who only re-counts inventory when needed

// Components = Different store sections (display, cart, filters)

// Props = Instructions passed between sections

// Events = Customer actions (clicking, filtering, adding to cart)


// ======================  GROK  =====================

// As a senior React developer, software architect, and JavaScript instructor with extensive experience in building scalable e-commerce applications (including those handling real-time inventory, user sessions, and performance optimizations), I'll provide a comprehensive, step-by-step explanation of the code logic for this ECommerceApp component. This is a self-contained React functional component that implements a basic e-commerce storefront with product listing, filtering/sorting, a shopping cart sidebar, and basic cart management. It's styled with Tailwind CSS classes and uses Lucide icons for UI elements. The app simulates a store with hardcoded products (no backend), focusing on frontend logic.
// I'll break it down into logical sections: imports, component setup, state management, computed values, functions, and the JSX render tree. For each part, I'll explain what it does, why it's implemented this way, how the logic flows, key React concepts (e.g., hooks, immutability), data flow, and architectural insights. I'll also highlight potential improvements for scalability, as this is a prototype-level app.
// Step 1: Imports
// jsximport { useState, useMemo } from "react";
// import { ShoppingCart, X, ArrowLeft } from "lucide-react";

// What this does: Imports React hooks (useState for mutable state, useMemo for memoized computations) and three icons from Lucide React (ShoppingCart for the cart button, X for close/remove, ArrowLeft for back navigation).
// Logic and purpose: useState manages reactive data like the cart and filters. useMemo optimizes by caching filtered/sorted products to avoid unnecessary re-computations on every render. Lucide icons are vector-based and customizable, used for visual elements.
// Why this way: Selective imports minimize bundle size. No other hooks (e.g., useEffect) are needed since there's no side-effect logic like API fetching. This keeps the component pure and focused.
// Data flow insight: Hooks drive reactivity—state changes trigger re-renders. Icons are static UI props.
// React insight: As a tutor, I'd stress that hooks must be called at the top level (not inside loops/conditionals) for consistent order across renders.
// Architectural note: Good for a small app. In a larger system, consider a custom icon wrapper component for theme consistency or lazy-loading icons.

// Step 2: Component Definition and Props
// jsxconst ECommerceApp = ({ onBackToHome }) => {
//   // ... rest of the code
// };
// export default ECommerceApp;

// What this does: Defines a functional component ECommerceApp that takes one prop: onBackToHome, a callback for navigating back (e.g., to a dashboard in a parent app).
// Logic and purpose: Makes the component modular and reusable. The arrow function is concise and supports hooks.
// Why this way: Modern React favors functions over classes for lighter weight and easier composition.
// Data flow insight: Props are read-only and flow downward. onBackToHome is fired on button click but doesn't alter internal state.
// Architectural note: Props enable integration (e.g., via React Router). Add PropTypes or TypeScript for validation in prod (e.g., onBackToHome: PropTypes.func.isRequired).

// Step 3: State Initialization with useState
// jsxconst [products] = useState([
//   // Array of 10 product objects with id, name, category, price, image (emoji placeholder)
// ]);

// const [cart, setCart] = useState([]);
// const [filters, setFilters] = useState({
//   category: "all",
//   priceRange: [0, 1000],
//   sortBy: "name",
// });
// const [showCart, setShowCart] = useState(false);

// What this does: Sets up four state variables:
// products: Immutable array of product objects (hardcoded for demo). Not a setter since products don't change.
// cart: Array of cart items (starts empty), each with product details + quantity.
// filters: Object for user-selected filters (category, price range as [min, max], sortBy).
// showCart: Boolean to toggle the cart sidebar visibility.

// Logic and purpose: useState creates reactive state. products simulates a database/API response. filters drives dynamic product display. cart tracks user selections.
// Why this way: Single filters object reduces hook calls (vs. separate states). Initial values provide defaults. Immutability in updates (seen later) prevents bugs.
// Data flow insight: State is local. User interactions (e.g., filter changes) update filters → trigger re-render → recompute displayed products.
// React insight: useState initializer runs once. For large apps, products could come from useEffect with API fetch.
// Architectural note: Scalable for prototypes, but in real e-commerce, use Context or Redux for shared cart state (e.g., across pages). Persist cart in localStorage/sessionStorage.

// Step 4: Memoized Computed Value (filteredProducts)
// jsxconst filteredProducts = useMemo(() => {
//   return products
//     .filter((product) => {
//       const categoryMatch =
//         filters.category === "all" || product.category === filters.category;
//       const priceMatch =
//         product.price >= filters.priceRange[0] &&
//         product.price <= filters.priceRange[1];
//       return categoryMatch && priceMatch;
//     })
//     .sort((a, b) => {
//       if (filters.sortBy === "price") return a.price - b.price;
//       if (filters.sortBy === "name") return a.name.localeCompare(b.name);
//       return 0;
//     });
// }, [products, filters]);

// What this does: Computes a filtered and sorted list of products, cached via useMemo.
// Step-by-step logic:
// Starts with full products array.
// filter(): Checks category (all or exact match) and price (within range). Returns true only if both match.
// sort(): Comparator based on sortBy—numerical for price, alphabetical (localeCompare for proper string sorting).
// Dependency array [products, filters]: Recomputes only if these change.

// Purpose: Optimizes rendering by avoiding re-filter/sort on unrelated re-renders (e.g., cart toggle).
// Why this way: useMemo prevents expensive ops in render path. Simple logic keeps it maintainable.
// Data flow: Depends on products and filters. Used in JSX for mapping product cards.
// React insight: Memoization shines for derived state. Without it, filter/sort runs every render (wasteful).
// Architectural note: Good for small lists. For 1000+ products, debounce filter updates or use a library like TanStack Query for data fetching/caching.

// Step 5: Core Functions (Cart Management)
// These handle cart mutations immutably.
// 5.1: addToCart
// jsxconst addToCart = (product) => {
//   setCart((prev) => {
//     const existing = prev.find((item) => item.id === product.id);
//     if (existing) {
//       return prev.map((item) =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     }
//     return [...prev, { ...product, quantity: 1 }];
//   });
// };

// What this does: Adds product to cart or increments quantity if exists.
// Step-by-step logic:
// Updater callback gets previous cart.
// Checks for existing item via find.
// If exists: Map to increment quantity (shallow copy with {...item}).
// If new: Spread prev and append new item with quantity 1.

// Purpose: Handles "Add" button clicks.
// Why: Immutable to align with React's state model. Linear search fine for small carts.
// Data flow: Called from product card → updates cart → re-renders cart if open.

// 5.2: removeFromCart
// jsxconst removeFromCart = (productId) => {
//   setCart((prev) => prev.filter((item) => item.id !== productId));
// };

// What this does: Removes item by ID.
// Logic: Filters out matching ID immutably.
// Purpose: For "Remove" links in cart.
// Data flow: Updates cart → re-render.

// 5.3: updateQuantity
// jsxconst updateQuantity = (productId, newQuantity) => {
//   if (newQuantity === 0) {
//     removeFromCart(productId);
//   } else {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === productId ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   }
// };

// What this does: Sets new quantity or removes if 0.
// Logic: Conditional delegates to remove or map/update.
// Purpose: For +/- buttons in cart.
// Data flow: Similar to above.

// Step 6: Derived Cart Values (cartTotal and cartCount)
// jsxconst cartTotal = cart.reduce(
//   (sum, item) => sum + item.price * item.quantity,
//   0
// );
// const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

// What this does: Computes total price and item count using reduce.
// Logic: Aggregates over cart array (runs on every render, but cheap).
// Purpose: Displays in cart UI and badge.
// Why: Derived from state—no need for separate state.
// Data flow: Read from cart, used in JSX.
// Insight: For large carts, memoize with useMemo([cart]).

// Step 7: The Return Statement (JSX Render Logic)
// The UI is declarative, reflecting state.
// 7.1: Root and Header
// jsxreturn (
//   <div className="min-h-screen bg-gray-50">
//     <header className="bg-white shadow-sm sticky top-0 z-10">
//       // Container with back button, title, cart toggle button with badge
//     </header>
//     // ... rest
//   </div>
// );

// What: Full-screen container, sticky header with navigation and cart icon (badge if count >0).
// Logic: onClick toggles showCart. Conditional badge.
// Why: Sticky for usability. Flex for responsive layout.

// 7.2: Filters Section
// jsx<div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
//   // Category select, price range slider, sort select
// </div>

// What: Form for filters.
// Logic: Controlled inputs (value + onChange update filters via spread).
// Why: Price is max-only (min fixed at 0)—simple. Range input for UX.
// Data flow: Changes → setFilters → recompute filteredProducts.

// 7.3: Product Grid
// jsx<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//   {filteredProducts.map((product) => (
//     // Product card with image (emoji), name, category, price, Add button
//   ))}
// </div>
// {filteredProducts.length === 0 && ( /* Empty state */ )}

// What: Responsive grid of product cards.
// Logic: Maps memoized list, key by ID. Add button calls addToCart.
// Why: Emojis as image placeholders (quick, no assets needed).
// Data flow: filteredProducts drives loop.

// 7.4: Cart Sidebar (Modal-like)
// jsx{showCart && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end">
//     <div className="bg-white w-full max-w-md h-full overflow-y-auto">
//       // Header with close, cart items list or empty message
//       {cart.map((item) => (
//         // Item row with image, name, +/- quantity, total, remove
//       ))}
//       // Total and Checkout button
//     </div>
//   </div>
// )}

// What: Conditional sidebar overlay.
// Logic: Maps cart, handles +/- (updateQuantity), remove. Empty conditional.
// Why: Fixed for modal feel, overflow-y for scrolling long carts.
// Data flow: cart drives content.

// ===============================  CODE STRUCTURE ===============================
// (1a) Imports
// (2) FunctionV ECommerceApp(props){
// (2a) VuseState3
// (2b) functionV useMemo{()return.filter(p){V,.category===||,V>=&&<=,return}.sort(p){2if(p){return}}[2dep]
// (2c) functionV addToCart(p){call(p){V.find(p).id===}if(p){return.map(p){.id---?++:}}return[...]}
// (2d) functionV removeFromCart(p){call(p).filter!==}
// functionV updateQuantity(p,n){if(p===){call}else{call(p){.map(p){===?...:}}}}
// (2e) V.reduce(p,n){++*,0}
// (2f)V.reduce(p,n){+,0}
// (2gi)jsx{<d.><h.><d.><d.><b,oncl.><i.><sp.></sp></b><h1.></h1></><b{oncl(!)}.><i>{v>0&&.<sp.>{v}</sp></b></></h>}
// (2gii)jsx{<d.><d.><h2.></h2><d.><><lab.></lab><sel,val,onch.><op4><>/op4></sel><><lab.></lab><inp,ty,min,max,val,onch.><d/><><lab.></lab><sel,val,onch.><opt2></opt2></sel><d/></><d/>}
// (2giii)<d.>{.map(p){<,key.><d.>{.image}</><h3.>{.name}</h3><p.>{.category}</p><d.><sp.>{.price}</sp><b,oncl.></b><d/><d/><d/>}
// (2g1v){v.length===0&&<d.></d>}</d>
// (2gv){showCart&&<d.><d.><d.><h2.></h2><b,oncl.><i></b></d><d.>{cart.length===0?(<p.></p>):(<><.map(p){<d.><d.>{.image}</d><d.><h3.>{.name}</h3><d.><b,oncl.></b><sp.>{.quantity}</sp><b,oncl.></b></d></d><d.><p.>{.price*.quantity}</p><b,oncl.></b></d></d>}<d.><d.><sp>Total:</sp><sp>${cartTotal.toFixed(2)}</sp></d><b></b></d></>)}</d></d></div>}



import { useState, useMemo } from "react";
import { ShoppingCart, X, ArrowLeft } from "lucide-react";

const ECommerceApp = ({ onBackToHome }) => {
  const [products] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "electronics",
      price: 99,
      image: "🎧",
    },
    {
      id: 2,
      name: "Running Shoes",
      category: "sports",
      price: 120,
      image: "👟",
    },
    { id: 3, name: "Coffee Maker", category: "home", price: 75, image: "☕" },
    {
      id: 4,
      name: "Smartwatch",
      category: "electronics",
      price: 250,
      image: "⌚",
    },
    { id: 5, name: "Yoga Mat", category: "sports", price: 35, image: "🧘" },
    { id: 6, name: "Desk Lamp", category: "home", price: 45, image: "💡" },
    { id: 7, name: "Laptop", category: "electronics", price: 899, image: "💻" },
    {
      id: 8,
      name: "Tennis Racket",
      category: "sports",
      price: 150,
      image: "🎾",
    },
    {
      id: 9,
      name: "Bluetooth Speaker",
      category: "electronics",
      price: 65,
      image: "🔊",
    },
    {
      id: 10,
      name: "Dumbbell Set",
      category: "sports",
      price: 89,
      image: "🏋️",
    },
  ]);

  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    sortBy: "name",
  });
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const categoryMatch =
          filters.category === "all" || product.category === filters.category;
        const priceMatch =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];
        return categoryMatch && priceMatch;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price") return a.price - b.price;
        if (filters.sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, filters]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">ShopEasy</h1>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="sports">Sports</option>
                <option value="home">Home</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Price: ${filters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [0, parseInt(e.target.value)],
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4"
            >
              <div className="text-6xl text-center mb-4">{product.image}</div>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 capitalize">
                {product.category}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found matching your filters.
          </div>
        )}
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-4 border-b"
                    >
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center text-xl font-bold mb-4">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ECommerceApp;


