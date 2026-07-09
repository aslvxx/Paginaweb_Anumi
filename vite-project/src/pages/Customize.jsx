import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Sparkles, Heart, Gift, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import moonbloomImage from '../assets/moonbloom_scoop.png';

// Fallback in case selectedScoop is empty
const defaultScoop = {
  id: 'moonbloom',
  name: 'Moonbloom Scoop',
  price: 580,
  minProducts: 1,
  maxProducts: 10,
  image: moonbloomImage,
  description: 'Un scoop equilibrado y mágico con una excelente variedad de tus accesorios Sanrio favoritos.'
};

export const Customize = () => {
  const { selectedScoop, navigate, addToCart, setShowCartDrawer } = useContext(AppContext);
  const scoop = selectedScoop || defaultScoop;

  // Configuration states
  const [selectedCharacter, setSelectedCharacter] = useState('Mix de todo');
  const [selectedColor, setSelectedColor] = useState('Rosado');
  const [quantity, setQuantity] = useState(1);
  const [isGift, setIsGift] = useState(false);
  
  // Custom Success Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const characters = [
    { name: 'Kuromi', emoji: '😈' },
    { name: 'My Melody', emoji: '🐰' },
    { name: 'Cinnamoroll', emoji: '🐶' },
    { name: 'Hello Kitty', emoji: '🐱' },
    { name: 'Pompompurin', emoji: '🍮' },
    { name: 'Stitch', emoji: '🐨' },
    { name: 'Mix de todo', emoji: '🌈' },
    { name: 'Sin personaje', emoji: '🚫' },
  ];

  const colors = [
    { name: 'Rosado', hex: '#FFC2D1', class: 'rosado' },
    { name: 'Morado', hex: '#E8DEF8', class: 'morado' },
    { name: 'Azul', hex: '#BFDBFE', class: 'azul' },
    { name: 'Amarillo', hex: '#FEF08A', class: 'amarillo' },
    { name: 'Mix', hex: 'linear-gradient(135deg, #FFB3C6 0%, #E8DEF8 50%, #BFDBFE 100%)', class: 'mix' },
  ];

  const handleQtyChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1) setQuantity(newQty);
  };

  const handleAddToCart = () => {
    addToCart(scoop, {
      character: selectedCharacter,
      color: selectedColor,
      isGift,
      quantity,
    });
    setShowSuccessModal(true);
  };

  const handleBuyNow = () => {
    addToCart(scoop, {
      character: selectedCharacter,
      color: selectedColor,
      isGift,
      quantity,
    });
    // Open cart drawer and navigate directly to home to show the slide out drawer overlay
    setShowCartDrawer(true);
    navigate('home');
  };

  const selectedColorDetails = colors.find((c) => c.name === selectedColor) || colors[0];

  return (
    <div className="customize-view container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate('home')}>
        <ArrowLeft size={18} />
        Volver a la tienda
      </button>

      <div className="customize-grid animate-fade-in">
        {/* Left Panel: Preview */}
        <div className={`preview-panel preview-bg-${selectedColorDetails.class}`}>
          {isGift && (
            <div className="preview-badge-gift">
              <Gift size={14} />
              <span>Para Regalo</span>
            </div>
          )}
          
          <div className="preview-image-container">
            <img src={scoop.image} alt={scoop.name} className="preview-image animate-float" />
          </div>

          <h2 className="preview-title">{scoop.name}</h2>
          <div className="preview-details">
            <span className="preview-spec-badge">{selectedCharacter}</span>
            <span className="preview-spec-badge">{selectedColor}</span>
          </div>

          <div className="preview-price">
            L. {(scoop.price * quantity).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Right Panel: Configurations */}
        <div className="config-panel">
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Personaliza tu Scoop</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              {scoop.description} Contiene de <strong>{scoop.minProducts} a {scoop.maxProducts} artículos sorpresa</strong>.
            </p>
          </div>

          <div className="config-divider"></div>

          {/* Character Selector */}
          <div className="config-section">
            <h3 className="config-section-title">
              <Heart size={18} className="heart-icon" fill="var(--color-primary)" stroke="none" />
              1. Selecciona tu Personaje
            </h3>
            <div className="character-grid">
              {characters.map((char) => (
                <button
                  key={char.name}
                  className={`character-btn ${selectedCharacter === char.name ? 'active' : ''}`}
                  onClick={() => setSelectedCharacter(char.name)}
                >
                  <span className="character-emoji">{char.emoji}</span>
                  <span>{char.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="config-divider"></div>

          {/* Color Selector */}
          <div className="config-section">
            <h3 className="config-section-title">
              <Sparkles size={18} style={{ color: 'var(--color-primary-dark)' }} />
              2. Selecciona el Color Temático
            </h3>
            <div className="color-list">
              {colors.map((col) => (
                <div key={col.name} className="color-option-wrapper">
                  <button
                    className={`color-btn ${selectedColor === col.name ? 'active' : ''}`}
                    style={{ background: col.hex }}
                    onClick={() => setSelectedColor(col.name)}
                    aria-label={`Color ${col.name}`}
                  >
                    {selectedColor === col.name && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: col.name === 'Amarillo' || col.name === 'Mix' ? 'var(--color-text-main)' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifycontent: 'center'
                      }}>
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <span className="color-name">{col.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="config-divider"></div>

          {/* Quantity Selector */}
          <div className="config-section">
            <div className="quantity-control-wrapper">
              <h3 className="config-section-title" style={{ marginBottom: 0 }}>
                Cantidad de scoops:
              </h3>
              <div className="quantity-selector">
                <button 
                  className="qty-btn" 
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => handleQtyChange(1)}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="config-divider"></div>

          {/* Gift Checkbox Toggle */}
          <div className="config-section">
            <div 
              className={`gift-toggle-card ${isGift ? 'active' : ''}`}
              onClick={() => setIsGift(!isGift)}
            >
              <div className="checkbox-wrapper">
                <Heart className="checkbox-heart" size={14} fill="#fff" stroke="none" />
              </div>
              <div className="gift-text-wrapper">
                <h4>¿Es esto un regalo?</h4>
                <p>Envolveremos tus productos en un empaque kawaii especial e incluiremos una tarjetita con mensaje personalizado sin costo adicional.</p>
              </div>
            </div>
          </div>

          <div className="config-divider"></div>

          {/* Action Buttons */}
          <div className="actions-footer">
            <button className="btn-secondary" onClick={handleAddToCart}>
              <ShoppingCart size={20} />
              Agregar al carrito
            </button>
            <button className="btn-primary" onClick={handleBuyNow}>
              <Sparkles size={20} />
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon-wrapper">
              <Check size={36} strokeWidth={3} />
            </div>
            <h3>¡Agregado al Carrito!</h3>
            <p>
              Tu <strong>{scoop.name}</strong> personalizado (Personaje: {selectedCharacter}, Color: {selectedColor}) se ha añadido correctamente.
            </p>
            
            <div className="success-modal-buttons">
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowCartDrawer(true);
                }}
              >
                Ver mi Carrito
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('home');
                }}
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
