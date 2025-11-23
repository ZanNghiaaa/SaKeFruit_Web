import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CategoriesSection from '../components/CategoriesSection';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../controllers/ProductController';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Đã thêm ${product.name} vào giỏ hàng!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Get all products
  const products = getAllProducts();
  
  // Get trial products
  const trialProducts = products.filter(p => p.isTrial);
  
  // Get featured products (non-trial only)
  const featuredProducts = products.filter(p => !p.isTrial).slice(0, 6);

  // Animate elements on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const elements = document.querySelectorAll('.feature-card, .category-card, .stat-item');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <HeroSection />
      <FeaturesSection />

      {/* Trial Products Section */}
      <section className="trial-section" id="trial-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">🎁 Ưu đãi đặc biệt</span>
            <h2>Gói Dùng Thử - Trải Nghiệm Ngay</h2>
            <p>Chỉ từ 12.000đ - Khám phá hương vị SAKEGO độc đáo!</p>
          </div>
          <div className="trial-grid">
            {trialProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <CategoriesSection />

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">⭐ Nổi bật</span>
            <h2>Sản Phẩm Bán Chạy</h2>
            <p>Những sản phẩm được yêu thích nhất</p>
          </div>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link to="/products" className="btn btn-view-all">
              <i className="fas fa-th"></i> Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
