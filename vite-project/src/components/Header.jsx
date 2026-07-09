import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Sparkles, Heart } from 'lucide-react';
import '../styles/header.css';

export const Header = () => {
  const { currentView, navigate, cartCount, setShowCartDrawer } = useContext(AppContext);
  const [animateCart, setAnimateCart] = useState(false);

  // Animate the cart badge when items are added
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleProductsClick = (e) => {
    e.preventDefault();
    if (currentView !== 'home') {
      navigate('home');
      // Wait for view change before scrolling
      setTimeout(() => {
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="header-container container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate('home')}>
          <div className="logo-icon-wrapper">
            <Heart className="logo-heart" fill="var(--color-primary)" stroke="none" />
            <Sparkles className="logo-sparkles animate-float" size={16} />
          </div>
          <span className="logo-text">Anumi Gifts</span>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <a
            href="#"
            className={currentView === 'home' ? 'active-link' : ''}
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
          >
            Inicio
          </a>
          <a href="#catalog" onClick={handleProductsClick}>
            Productos
          </a>
          <a href="#contact" onClick={handleContactClick}>
            Contacto
          </a>
        </nav>

        {/* Cart Trigger */}
        <div className="cart-trigger-container">
          <button 
            className="cart-trigger-btn" 
            onClick={() => setShowCartDrawer(true)}
            aria-label="Ver carrito"
          >
            <div className="icon-wrapper">
              <ShoppingBag size={24} className="cart-icon" />
              {cartCount > 0 && (
                <span className={`cart-badge ${animateCart ? 'pop-effect' : ''}`}>
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
