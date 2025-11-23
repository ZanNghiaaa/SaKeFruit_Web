import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCurrentUser, logoutUser, isAdmin } from '../controllers/UserController';

const Navbar = () => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for logged in user on mount
    const user = getCurrentUser();
    setCurrentUser(user);

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'sakefruit_current_user' || e.key === null) {
        const updatedUser = getCurrentUser();
        setCurrentUser(updatedUser);
      }
    };

    // Custom event for same-window updates
    const handleAuthChange = () => {
      const updatedUser = getCurrentUser();
      setCurrentUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logoutUser();
      setCurrentUser(null);
      setShowUserMenu(false);
      navigate('/');
    }
  };

  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
  };

  const handleFilterCategory = (category) => {
    setShowCategoryMenu(false);
    navigate(`/products?category=${category}`);
  };

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="/assets/images/logo_6.png" alt="SaKeFruit Logo" />
            </Link>
          </div>
          <div className="header-actions">
            <div className="auth-links">
              {currentUser ? (
                <div className="user-menu-wrapper">
                  <button 
                    className="user-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img 
                      src="/assets/images/AVATAR.png" 
                      alt="Avatar"
                      className="user-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline-block';
                      }}
                    />
                    <i className="fas fa-user-circle user-avatar-fallback"></i>
                    <span className="user-name">{currentUser.fullname}</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      {isAdmin() && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                          <i className="fas fa-tachometer-alt"></i> Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        <i className="fas fa-user"></i> Trang cá nhân
                      </Link>
                      <Link to="/cart" onClick={() => setShowUserMenu(false)}>
                        <i className="fas fa-shopping-cart"></i> Giỏ hàng
                      </Link>
                      <button onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <i className="fas fa-user"></i> Đăng nhập
                  </Link>
                  <Link to="/register">
                    <i className="fas fa-user-plus"></i> Đăng ký
                  </Link>
                </>
              )}
            </div>
            <Link to="/cart" className="cart-link">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{getItemCount()}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar">
        <div className="container">
          <div className="navbar-left">
            <button className="category-menu-btn" onClick={toggleCategoryMenu}>
              <i className="fas fa-bars"></i> DANH MỤC SẢN PHẨM
            </button>
            <div className={`category-dropdown ${showCategoryMenu ? 'active' : ''}`}>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('mochi'); }}>
                    <i className="fas fa-cookie"></i> Bánh Mochi Sa Kê
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('tea'); }}>
                    <i className="fas fa-mug-hot"></i> Trà Sa Kê
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('dried'); }}>
                    <i className="fas fa-seedling"></i> Khô Sa Kê
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('honey-cake'); }}>
                    <i className="fas fa-birthday-cake"></i> Bánh Mật Sa Kê
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('snack'); }}>
                    <i className="fas fa-cookie-bite"></i> Snack Sa Kê
                  </a>
                </li>
                <li>
                  <Link to="/products">
                    <i className="fas fa-th"></i> Xem tất cả
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <ul className="nav-menu">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>Giới thiệu</Link></li>
            <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Sản phẩm</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Liên hệ</Link></li>
          </ul>

          <div className="search-box">
            <input type="text" placeholder="Nhập từ khóa tìm kiếm" />
            <button type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
