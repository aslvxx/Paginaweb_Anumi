import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ScoopCard } from '../components/ScoopCard';
import { Sparkles, Gift, ShieldCheck, Heart, MapPin, Clock, MessageCircle,Facebook, Video } from 'lucide-react';

// Import images from assets
import heroImage from '../assets/sinfondo.png';
import moonbloomImage from '../assets/moonbloom.png';
import mistyImage from '../assets/misty.jpeg';
import stardustImage from '../assets/stardust.jpeg';

export const Home = () => {
  const { setSelectedScoop, navigate } = useContext(AppContext);

  const scoopsData = [
    {
      id: 'misty',
      name: 'Misty Scoop',
      price: 360,
      minProducts: 1,
      maxProducts: 7,
      image: mistyImage,
      description: 'Nuestra opción compacta e ideal para un lindo detalle sorpresa. ¡Llena tu día de ternura con accesorios prácticos, llaveros y stickers!'
    },
    {
      id: 'moonbloom',
      name: 'Moonbloom Scoop',
      price: 580,
      minProducts: 1,
      maxProducts: 10,
      image: moonbloomImage,
      description: 'Un scoop equilibrado y mágico con una excelente variedad de tus accesorios Sanrio favoritos. Incluye papelería, llaveros y sorpresas medianas.'
    },
    {
      id: 'stardust',
      name: 'Stardust Scoop',
      price: 1400,
      minProducts: 1,
      maxProducts: 15,
      image: stardustImage,
      description: 'La experiencia scoop definitiva. Un balde gigante lleno de peluches medianos/grandes, papelería premium, tazas, bolsos y sorpresas exclusivas.'
    }
  ];

  const handleStartCustomizing = () => {
    // Default to Moonbloom scoop
    setSelectedScoop(scoopsData[1]);
    navigate('customize');
  };

  const handleScrollToCatalog = (e) => {
    e.preventDefault();
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <div className="hero-badge animate-pulse-soft">
              <Sparkles size={16} />
              <span>Tienda de Scoops</span>
            </div>
            
            <h1 className="hero-title">
              Tus Sorpresas <span>Kawaii</span> Favoritas en un Solo Scoop
            </h1>
            
            <p className="hero-description">
              Crea tu propia combinación de productos sorpresa personalizados de tus personajes favoritos de Sanrio. Elige tu paquete, selecciona tus gustos y ¡déjanos sorprenderte con magia!
            </p>
            
            <div className="hero-buttons">
              <a href="#catalog" className="btn-primary" onClick={handleScrollToCatalog}>
                Ver Catálogo
                <Gift size={18} />
              </a>
              <button className="btn-secondary" onClick={handleStartCustomizing}>
                Personalizar Scoop
                <Sparkles size={18} />
              </button>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-bg"></div>
            <img src={heroImage} alt="Anumi Gifts Kawaii Shop" className="hero-image" />
            <Sparkles className="hero-sparkle-1" size={32} />
            <Heart className="hero-sparkle-2" size={24} />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="catalog-section" id="catalog">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Paquetes Disponibles</span>
            <h2 className="section-title">Elige tu Scoop Especial</h2>
            <p className="section-desc">
              Cada paquete contiene una combinación mágica y única de sorpresas. Haz clic en "Personalizar" para elegir tu personaje, color y preparar tu regalo.
            </p>
          </div>

          <div className="catalog-grid">
            {scoopsData.map((scoop) => (
              <ScoopCard key={scoop.id} scoop={scoop} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon-wrapper">
                <ShieldCheck size={28} />
              </div>
              <h3>Productos Seleccionados</h3>
              <p>Solo incluimos accesorios de alta calidad, papelería premium y peluches ultra suaves para tu total satisfacción.</p>
            </div>

            <div className="info-item">
              <div className="info-icon-wrapper">
                <Sparkles size={28} />
              </div>
              <h3>100% Personalizado</h3>
              <p>Tú eliges tu personaje favorito y tu color de preferencia. Diseñamos cada scoop pensando exactamente en tus gustos.</p>
            </div>

            <div className="info-item">
              <div className="info-icon-wrapper">
                <Gift size={28} />
              </div>
              <h3>Empaque de Regalo</h3>
              <p>¿Es para alguien especial? Agrega un empaque de regalo y una nota personalizada con mucho cariño y estilo kawaii.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>¿Tienes alguna duda?</h2>
              <p>
                Si tienes preguntas sobre nuestros scoops, los envíos a todo el país o pedidos especiales al por mayor, no dudes en escribirnos. ¡Estamos encantados de atenderte!
              </p>
              
              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>Nuestra Tienda</h4>
                    <p>Tegucigalpa, Honduras (Envíos a nivel nacional)</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Clock size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>Horario de Atención</h4>
                    <p>Lunes a Sábado: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <h3>Encuéntranos en redes</h3>
              <div className="social-links">
                <a 
                  href="https://wa.me/50499999999" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  style={{ color: '#25D366' }}
                >
                  <MessageCircle size={22} fill="#25D366" stroke="#fff" />
                  Escríbenos por WhatsApp
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  style={{ color: '#E1306C' }}
                >
                  <Facebook size={22} />
                  Síguenos en Instagram
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  style={{ color: '#000000' }}
                >
                  <Video size={22} />
                  Míranos en TikTok
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              Hecho con <Heart size={14} className="heart-icon" fill="var(--color-primary-dark)" stroke="none" /> por Anumi Gifts &copy; 2026. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
