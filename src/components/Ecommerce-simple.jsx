// ==================== ECOMMERCE-SIMPLE.JSX LOGIC EXPLANATION ====================
// 🏗️ App Structure Overview
// This app has 4 main parts:

// Product Display - Showing items for sale

// Shopping Cart - Holding selected items

// Filters - Helping users find products

// UI Controls - Buttons and interactions

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



import { useState, useMemo } from "react";
import { ShoppingCart, X, Home, ArrowLeft } from "lucide-react";

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
