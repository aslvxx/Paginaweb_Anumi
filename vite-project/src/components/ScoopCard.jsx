import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Heart } from 'lucide-react';

export const ScoopCard = ({ scoop }) => {
  const { setSelectedScoop, navigate } = useContext(AppContext);

  const handleSelect = () => {
    setSelectedScoop(scoop);
    navigate('customize');
  };

  return (
    <div className="scoop-card animate-fade-in">
      <div className="scoop-card-image-wrapper">
        <img src={scoop.image} alt={scoop.name} className="scoop-card-image" />
        <div className="scoop-card-badge">
          <Heart size={14} fill="#fff" stroke="none" />
          <span>{scoop.minProducts}-{scoop.maxProducts} artículos</span>
        </div>
      </div>
      
      <div className="scoop-card-content">
        <h3 className="scoop-card-title">{scoop.name}</h3>
        <p className="scoop-card-description">{scoop.description}</p>
        
        <div className="scoop-card-footer">
          <div className="scoop-card-price">
            <span className="price-currency">L.</span>
            <span className="price-amount">{scoop.price.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <button className="btn-primary card-btn" onClick={handleSelect}>
            Personalizar
            <Sparkles size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
