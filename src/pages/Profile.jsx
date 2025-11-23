import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUserProfile, logoutUser } from '../controllers/UserController';
import { getOrdersByUserId, ORDER_STATUS_TEXT } from '../controllers/OrderController';
import '../assets/css/profile-page.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setFormData({
      fullname: currentUser.fullname,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address || ''
    });
    
    // Load user orders
    const userOrders = getOrdersByUserId(currentUser.id);
    setOrders(userOrders);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const updatedUser = updateUserProfile(user.id, formData);
      setUser(updatedUser);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logoutUser();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <main>
      <section className="profile-hero">
        <div className="container">
          <h1>
            <i className="fas fa-user-circle"></i>
            Trang cá nhân
          </h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
      </section>

      <section className="profile-section">
        <div className="container">
          <div className="profile-grid">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <img 
                    src="/assets/images/AVATAR.png" 
                    alt="Avatar"
                    className="profile-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <i className="fas fa-user profile-avatar-fallback"></i>
                </div>
                <h3>{user.fullname}</h3>
                <span className="user-role">
                  {user.role === 'admin' ? '👑 Quản trị viên' : '👤 Khách hàng'}
                </span>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <i className="fas fa-shopping-bag"></i>
                  <div>
                    <span className="stat-number">{orders.length}</span>
                    <span className="stat-label">Đơn hàng</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-heart"></i>
                  <div>
                    <span className="stat-number">0</span>
                    <span className="stat-label">Yêu thích</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <div>
                    <span className="stat-number">5.0</span>
                    <span className="stat-label">Điểm tích lũy</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className="btn-action btn-primary"
                  onClick={() => navigate('/cart')}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Giỏ hàng
                </button>
                <button 
                  className="btn-action btn-secondary"
                  onClick={() => navigate('/products')}
                >
                  <i className="fas fa-store"></i>
                  Tiếp tục mua sắm
                </button>
                <button 
                  className="btn-action btn-danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="profile-content">
              <div className="profile-card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-info-circle"></i>
                    Thông tin cá nhân
                  </h2>
                  {!isEditing && (
                    <button 
                      className="btn-edit"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="fas fa-edit"></i>
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="info-display">
                    <div className="info-item">
                      <label>
                        <i className="fas fa-user"></i>
                        Họ và tên
                      </label>
                      <span>{user.fullname}</span>
                    </div>
                    <div className="info-item">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <span>{user.email}</span>
                    </div>
                    <div className="info-item">
                      <label>
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <span>{user.phone}</span>
                    </div>
                    <div className="info-item">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        Địa chỉ
                      </label>
                      <span>{user.address || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-user"></i>
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        Địa chỉ
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Nhập địa chỉ của bạn"
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-save">
                        <i className="fas fa-save"></i>
                        Lưu thay đổi
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            fullname: user.fullname,
                            email: user.email,
                            phone: user.phone,
                            address: user.address || ''
                          });
                        }}
                      >
                        <i className="fas fa-times"></i>
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Order History */}
              <div className="profile-card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-history"></i>
                    Lịch sử đơn hàng
                  </h2>
                  <span className="order-count-badge">{orders.length} đơn</span>
                </div>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-shopping-bag"></i>
                    <p>Bạn chưa có đơn hàng nào</p>
                    <button 
                      className="btn-shop-now"
                      onClick={() => navigate('/products')}
                    >
                      Mua sắm ngay
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => {
                      const getStatusClass = (status) => {
                        const classes = {
                          pending: 'status-pending',
                          confirmed: 'status-confirmed',
                          preparing: 'status-preparing',
                          delivering: 'status-delivering',
                          completed: 'status-completed',
                          cancelled: 'status-cancelled'
                        };
                        return classes[status] || '';
                      };

                      return (
                        <div key={order.id} className="order-item">
                          <div className="order-header">
                            <div className="order-id">
                              <i className="fas fa-receipt"></i>
                              <strong>{order.id}</strong>
                            </div>
                            <span className={`order-status ${getStatusClass(order.status)}`}>
                              {ORDER_STATUS_TEXT[order.status]}
                            </span>
                          </div>
                          <div className="order-info">
                            <div className="order-date">
                              <i className="fas fa-calendar"></i>
                              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="order-items-count">
                              <i className="fas fa-box"></i>
                              {order.items.length} sản phẩm
                            </div>
                            <div className="order-total">
                              <i className="fas fa-money-bill-wave"></i>
                              <strong>{order.totalAmount.toLocaleString('vi-VN')}đ</strong>
                            </div>
                          </div>
                          <div className="order-address">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{order.customerInfo.address}, {order.customerInfo.ward}, {order.customerInfo.district}, Cần Thơ</span>
                          </div>
                          <div className="order-products">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="order-product-mini">
                                <img src={item.image} alt={item.name} />
                                <span>x{item.quantity}</span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="order-product-more">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
