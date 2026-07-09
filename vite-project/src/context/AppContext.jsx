import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'customize' | 'cart'
  const [selectedScoop, setSelectedScoop] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Load cart from localStorage if exists (for nice mockup realism)
  useEffect(() => {
    const savedCart = localStorage.getItem('anumi_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('anumi_cart', JSON.stringify(cart));
  }, [cart]);

  // Navigate helper
  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart with full customization options
  const addToCart = (scoop, options) => {
    const { character, color, isGift, quantity } = options;

    setCart((prevCart) => {
      // Check if an identical scoop with the same configuration is already in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.name === scoop.name &&
          item.character === character &&
          item.color === color &&
          item.isGift === isGift
      );

      if (existingItemIndex > -1) {
        // If found, update the quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // If not, add as a new item
        const newItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: scoop.name,
          price: scoop.price,
          minProducts: scoop.minProducts,
          maxProducts: scoop.maxProducts,
          image: scoop.image,
          character,
          color,
          isGift,
          quantity,
        };
        return [...prevCart, newItem];
      }
    });

    // Automatically trigger cart drawer/modal for visual confirmation
    setShowCartDrawer(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Update quantity inside the cart
  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedScoop,
        setSelectedScoop,
        cart,
        setCart,
        showCartDrawer,
        setShowCartDrawer,
        navigate,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartCount,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
