import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📦 Danh mục</span>
          <h2>Khám Phá Sản Phẩm</h2>
          <p>Đa dạng sản phẩm từ sa kê cho mọi nhu cầu</p>
        </div>
        <div className="categories-grid">
          <div className="category-card" onClick={() => handleCategoryClick('mochi')}>
            <div className="category-icon">
              <i className="fas fa-cookie"></i>
            </div>
            <h3>Bánh Mochi Sa Kê</h3>
            <p>Mềm mại, nhiều vị</p>
            <div className="category-count">4 sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('tea')}>
            <div className="category-icon">
              <i className="fas fa-mug-hot"></i>
            </div>
            <h3>Trà Sa Kê</h3>
            <p>Thơm ngon, giàu dưỡng chất</p>
            <div className="category-count">1 sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('dried')}>
            <div className="category-icon">
              <i className="fas fa-seedling"></i>
            </div>
            <h3>Khô Sa Kê</h3>
            <p>Sấy khô, giữ nguyên dinh dưỡng</p>
            <div className="category-count">1 sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('honey-cake')}>
            <div className="category-icon">
              <i className="fas fa-birthday-cake"></i>
            </div>
            <h3>Bánh Mật Sa Kê</h3>
            <p>Ngọt thanh, tự nhiên</p>
            <div className="category-count">1 sản phẩm</div>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('snack')}>
            <div className="category-icon">
              <i className="fas fa-cookie-bite"></i>
            </div>
            <h3>Snack Sa Kê</h3>
            <p>Giòn tan, đa dạng vị</p>
            <div className="category-count">5 sản phẩm</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
