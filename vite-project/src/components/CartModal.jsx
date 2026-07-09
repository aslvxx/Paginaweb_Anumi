import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Trash2, ShoppingBag, Plus, Minus, MessageCircle, Heart, CheckCircle2 } from 'lucide-react';

export const CartModal = () => {
  const {
    cart,
    showCartDrawer,
    setShowCartDrawer,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
    cartCount,
    clearCart,
    navigate
  } = useContext(AppContext);

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Shipping logic: Free for orders above L. 1000, else L. 90
  const shippingThreshold = 1000;
  const shippingCost = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 90;
  const grandTotal = cartTotal + shippingCost;

  const handleClose = () => {
    setShowCartDrawer(false);
    // Reset success screen after closing
    setTimeout(() => setCheckoutSuccess(false), 300);
  };

  const handleCheckout = () => {
    // Generate text for WhatsApp
    let message = `¡Hola, Anumi Gifts! 🌸 Me gustaría realizar la compra de los siguientes scoops personalizados:\n\n`;
    
    cart.forEach((item, index) => {
      message += `🔹 *${item.name}* (x${item.quantity})\n`;
      message += `   • Personaje: ${item.character}\n`;
      message += `   • Color: ${item.color}\n`;
      message += `   • ¿Para regalo?: ${item.isGift ? 'Sí, envolver' : 'No'}\n`;
      message += `   • Subtotal: L. ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `-----------------------------\n`;
    message += `🛒 *Subtotal:* L. ${cartTotal.toFixed(2)}\n`;
    message += `🚚 *Envío:* ${shippingCost === 0 ? 'Gratis' : `L. ${shippingCost.toFixed(2)}`}\n`;
    message += `✨ *Total a Pagar:* L. ${grandTotal.toFixed(2)}\n\n`;
    message += `¡Quedo a la espera de sus datos para el pago y envío! Gracias 💕`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/50499999999?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show simulated success inside the drawer
    setCheckoutSuccess(true);
    // Clear cart since order has been "submitted"
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`cart-overlay ${showCartDrawer ? 'active' : ''}`} 
        onClick={handleClose}
      />

      {/* Cart Drawer */}
      <div className={`cart-drawer`}>
        {checkoutSuccess ? (
          <div className="checkout-success-banner animate-fade-in">
            <CheckCircle2 size={64} style={{ color: '#25D366', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>¡Pedido Enviado!</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
              Hemos abierto WhatsApp para que completes tu compra. Tu carrito ha sido guardado. ¡Muchas gracias por elegir Anumi Gifts! 🌸
            </p>
            <button 
              className="btn-primary" 
              onClick={handleClose}
            >
              Cerrar y Volver
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="cart-header">
              <div className="cart-header-title">
                <ShoppingBag size={22} className="heart-icon" style={{ color: 'var(--color-primary-dark)' }} />
                <h2>Tu Carrito</h2>
                <span style={{
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-dark)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-title)'
                }}>
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button className="cart-close-btn" onClick={handleClose} aria-label="Cerrar carrito">
                <X size={18} />
              </button>
            </div>

            {/* Content List */}
            <div className="cart-items-container">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon">
                    <ShoppingBag size={48} />
                  </div>
                  <h3>Tu carrito está vacío</h3>
                  <p>¡Añade un scoop con tus personajes favoritos de Sanrio y llénalo de ternura!</p>
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      handleClose();
                      navigate('home');
                      // Scroll to catalog
                      setTimeout(() => {
                        const el = document.getElementById('catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-image-wrapper">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                    </div>

                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      
                      <div className="cart-item-specs">
                        <div className="cart-item-spec-item">
                          <Heart size={10} fill="var(--color-primary)" stroke="none" />
                          <span>Personaje: {item.character}</span>
                        </div>
                        <div className="cart-item-spec-item">
                          <Heart size={10} fill="var(--color-primary)" stroke="none" />
                          <span>Color: {item.color}</span>
                        </div>
                        {item.isGift && (
                          <div className="cart-item-spec-item" style={{ color: 'var(--color-primary-dark)', fontWeight: '500' }}>
                            <Gift size={10} />
                            <span>Para Regalo</span>
                          </div>
                        )}
                      </div>

                      <div className="cart-item-footer">
                        <span className="cart-item-price">L. {(item.price * item.quantity).toLocaleString('es-HN', { minimumFractionDigits: 2 })}</span>
                        
                        {/* Mini Qty Selector */}
                        <div className="cart-item-qty">
                          <button 
                            className="cart-qty-btn"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            aria-label="Restar uno"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="cart-qty-num">{item.quantity}</span>
                          <button 
                            className="cart-qty-btn"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            aria-label="Sumar uno"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button 
                      className="cart-item-remove-btn" 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar artículo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>L. {cartTotal.toLocaleString('es-HN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="cart-summary-row">
                  <span>Envío</span>
                  <span>
                    {shippingCost === 0 ? (
                      <strong style={{ color: '#25D366' }}>Gratis</strong>
                    ) : (
                      `L. ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '-8px', marginBottom: '8px' }}>
                    Agrega L. {(shippingThreshold - cartTotal).toFixed(2)} más para envío Gratis
                  </div>
                )}

                <div className="cart-summary-row total-row">
                  <span>Total</span>
                  <span className="cart-total-price">L. {grandTotal.toLocaleString('es-HN', { minimumFractionDigits: 2 })}</span>
                </div>

                <button 
                  className="btn-primary whatsapp-checkout-btn"
                  onClick={handleCheckout}
                >
                  <MessageCircle size={20} fill="#fff" stroke="none" />
                  Completar por WhatsApp
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
