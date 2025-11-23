import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLoading } from '../hooks/useLoading';
import Loading from '../components/Loading';
import { getCurrentUser } from '../controllers/UserController';
import { createOrder, CAN_THO_DISTRICTS } from '../controllers/OrderController';
import { sendOrderNotification } from '../controllers/NotificationController';

const Checkout = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const { isLoading, withLoading } = useLoading();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [formData, setFormData] = useState({
    fullname: currentUser?.fullname || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    district: '',
    ward: '',
    notes: '',
    paymentMethod: 'cod',
    selectedBank: 'bidv'
  });

  // Thông tin tài khoản ngân hàng của bạn - BẠN CÓ THỂ THAY ĐỔI Ở ĐÂY
  const bankAccountInfo = {
    bankId: 'bidv',                     // Mã ngân hàng BIDV
    bankName: 'BIDV',                   // Tên ngắn gọn
    bankFullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', // Tên đầy đủ
    accountNumber: '6930278729',        // Thay bằng số tài khoản thật của bạn
    accountName: 'NGUYEN VAN NGHIA',    // Thay bằng tên chủ tài khoản (VIẾT HOA, KHÔNG DẤU)
    prefix: 'SAOKE'                     // Mã đơn hàng prefix
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    // Validate Cần Thơ address
    if (!formData.district || !CAN_THO_DISTRICTS.includes(formData.district)) {
      alert('⚠️ Hiện tại chúng tôi chỉ giao hàng tại TP. Cần Thơ!\nVui lòng chọn quận/huyện thuộc Cần Thơ.');
      return;
    }

    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    await withLoading(async () => {
      try {
        // Tạo đơn hàng
        const orderData = {
          userId: currentUser.id,
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          ward: formData.ward,
          notes: formData.notes,
          items: cartItems,
          totalAmount: getTotal(),
          paymentMethod: formData.paymentMethod
        };

        const newOrder = createOrder(orderData);
        
        // Send notification to admin
        sendOrderNotification(newOrder);
        
        // Clear cart
        clearCart();
        
        // Success message
        alert(`🎉 Đặt hàng thành công!\n\nMã đơn hàng: ${newOrder.id}\nTổng tiền: ${getTotal().toLocaleString('vi-VN')}đ\n\nChúng tôi sẽ liên hệ và giao hàng tận nơi tại Cần Thơ trong vòng 2-3 giờ!\nCảm ơn bạn đã mua hàng tại SaKeFruit! 🍊`);
        
        navigate('/profile');
      } catch (error) {
        console.error('Order error:', error);
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
      }
    }, 500);
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <div className="empty-checkout-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Giỏ Hàng Trống</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              <i className="fas fa-shopping-bag"></i> Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {isLoading && <Loading message="Đang xử lý đơn hàng..." />}
      <main className="checkout-page">
        <div className="container">
        <div className="checkout-header">
          <h1>
            <i className="fas fa-lock"></i> Thanh Toán Đơn Hàng
          </h1>
          <p className="checkout-subtitle">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Left Column - Form */}
            <div className="checkout-form-section">
              {/* Shipping Information */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <h3>
                    <i className="fas fa-map-marker-alt"></i>
                    Thông Tin Giao Hàng
                  </h3>
                  <div className="shipping-area-badge">
                    <i className="fas fa-shipping-fast"></i>
                    <span>Chỉ giao hàng tại TP. Cần Thơ</span>
                  </div>
                </div>
                <div className="checkout-card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-user"></i> Họ và tên *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-phone"></i> Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0912345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-envelope"></i> Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-home"></i> Địa chỉ *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div className="form-grid form-grid-3">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-city"></i> Thành phố *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value="Cần Thơ"
                        disabled
                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-map"></i> Quận/Huyện *
                      </label>
                      <select
                        className="form-control"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {CAN_THO_DISTRICTS.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-location-arrow"></i> Phường/Xã *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        placeholder="Nhập Phường/Xã"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-sticky-note"></i> Ghi chú (tuỳ chọn)
                    </label>
                    <textarea
                      className="form-control"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Ghi chú thêm cho đơn hàng (thời gian giao hàng mong muốn, địa chỉ cụ thể...)"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <h3>
                    <i className="fas fa-credit-card"></i>
                    Phương Thức Thanh Toán
                  </h3>
                </div>
                <div className="checkout-card-body">
                  <div className="payment-methods">
                    <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                      />
                      <div className="payment-option-content">
                        <div className="payment-icon">
                          <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div className="payment-info">
                          <strong>Thanh toán khi nhận hàng (COD)</strong>
                          <span>Thanh toán bằng tiền mặt khi nhận hàng</span>
                        </div>
                      </div>
                      <div className="payment-check">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    </label>

                    <label className={`payment-option ${formData.paymentMethod === 'bank' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleChange}
                      />
                      <div className="payment-option-content">
                        <div className="payment-icon">
                          <i className="fas fa-university"></i>
                        </div>
                        <div className="payment-info">
                          <strong>Chuyển khoản ngân hàng</strong>
                          <span>Chuyển khoản qua tài khoản ngân hàng</span>
                        </div>
                      </div>
                      <div className="payment-check">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    </label>
                  </div>

                  {/* Bank QR Payment - Hiện khi chọn thanh toán ngân hàng */}
                  {formData.paymentMethod === 'bank' && (
                    <div className="bank-selection-wrapper">
                      {/* Hiển thị trực tiếp ngân hàng BIDV */}
                      <div className="selected-bank-info">
                        <div className="bank-badge">
                          <i className="fas fa-university"></i>
                          <div className="bank-badge-text">
                            <strong>{bankAccountInfo.bankName}</strong>
                            <span>{bankAccountInfo.bankFullName}</span>
                          </div>
                        </div>
                      </div>

                      {/* QR Code và thông tin chuyển khoản */}
                        <div className="bank-transfer-info">
                          <div className="bank-qr-layout">
                            {/* Left Side - QR Code */}
                            <div className="bank-qr-section">
                              <div className="qr-code-wrapper">
                                <div className="qr-code-header">
                                  <i className="fas fa-qrcode"></i>
                                  <span>Quét mã QR để thanh toán</span>
                                </div>
                                <div className="qr-code-image">
                                  <img 
                                    src={`https://img.vietqr.io/image/${bankAccountInfo.bankId}-${bankAccountInfo.accountNumber}-compact2.jpg?amount=${getTotal()}&addInfo=${bankAccountInfo.prefix} ${formData.phone || 'XXXXXXXXXX'} ${formData.fullname || 'Khach hang'}&accountName=${bankAccountInfo.accountName}`}
                                    alt="VietQR Payment QR Code"
                                    onLoad={() => {
                                      // Debug: In ra URL của QR code để kiểm tra
                                      console.log('✅ QR Code đã load thành công!');
                                      console.log('📊 Thông tin QR:');
                                      console.log('  - Ngân hàng:', bankAccountInfo.bankName);
                                      console.log('  - Số TK:', bankAccountInfo.accountNumber);
                                      console.log('  - Chủ TK:', bankAccountInfo.accountName);
                                      console.log('  - Số tiền:', getTotal().toLocaleString('vi-VN') + 'đ');
                                      console.log('  - Nội dung:', `${bankAccountInfo.prefix} ${formData.phone || 'XXXXXXXXXX'} ${formData.fullname || 'Khach hang'}`);
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      console.error('❌ QR Code load lỗi! Hiển thị placeholder.');
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM3MTgwOTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                                    }}
                                  />
                                </div>
                                <div className="qr-scan-instruction">
                                  <div className="scan-step">
                                    <i className="fas fa-mobile-alt"></i>
                                    <span>Mở app ngân hàng</span>
                                  </div>
                                  <div className="scan-step">
                                    <i className="fas fa-camera"></i>
                                    <span>Quét mã QR</span>
                                  </div>
                                  <div className="scan-step">
                                    <i className="fas fa-check-circle"></i>
                                    <span>Xác nhận thanh toán</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Bank Details */}
                            <div className="bank-info-section">
                              <div className="bank-info-header">
                                <i className="fas fa-info-circle"></i>
                                <strong>Thông tin chuyển khoản</strong>
                              </div>
                              <div className="bank-details">
                                <div className="bank-detail-item">
                                  <span className="label">
                                    <i className="fas fa-university"></i> Ngân hàng:
                                  </span>
                                  <span className="value">{bankAccountInfo.bankName}</span>
                                </div>
                                <div className="bank-detail-item">
                                  <span className="label">
                                    <i className="fas fa-credit-card"></i> Số tài khoản:
                                  </span>
                                  <span className="value">{bankAccountInfo.accountNumber}</span>
                                </div>
                                <div className="bank-detail-item">
                                  <span className="label">
                                    <i className="fas fa-user"></i> Chủ tài khoản:
                                  </span>
                                  <span className="value">{bankAccountInfo.accountName}</span>
                                </div>
                                <div className="bank-detail-item">
                                  <span className="label">
                                    <i className="fas fa-money-bill-wave"></i> Số tiền:
                                  </span>
                                  <span className="value amount-highlight">{getTotal().toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="bank-detail-item">
                                  <span className="label">
                                    <i className="fas fa-edit"></i> Nội dung:
                                  </span>
                                  <span className="value highlight">{bankAccountInfo.prefix} {formData.phone || 'XXXXXXXXXX'}</span>
                                </div>
                              </div>
                              
                              <div className="bank-note">
                                <i className="fas fa-lightbulb"></i>
                                <div className="note-content">
                                  <strong>Lưu ý quan trọng:</strong>
                                  <ul>
                                    <li>Quét mã QR bằng app ngân hàng để thanh toán nhanh</li>
                                    <li>Hoặc chuyển khoản thủ công với thông tin bên cạnh</li>
                                    <li>Nhập đúng nội dung để đơn hàng được xử lý tự động</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="checkout-summary-section">
              <div className="checkout-card summary-sticky">
                <div className="checkout-card-header">
                  <h3>
                    <i className="fas fa-receipt"></i>
                    Đơn Hàng Của Bạn
                  </h3>
                </div>
                <div className="checkout-card-body">
                  {/* Order Items */}
                  <div className="order-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="order-item-image">
                          <img src={item.image} alt={item.name} />
                          <span className="order-item-qty">{item.quantity}</span>
                        </div>
                        <div className="order-item-info">
                          <h5>{item.name}</h5>
                          <p className="order-item-price">
                            {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        <div className="order-item-total">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="order-summary-details">
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <strong>{getTotal().toLocaleString('vi-VN')}đ</strong>
                    </div>
                    <div className="summary-row">
                      <span>Phí vận chuyển:</span>
                      <strong className="text-success">
                        <i className="fas fa-check-circle"></i> Miễn phí
                      </strong>
                    </div>
                    <div className="summary-row">
                      <span>Giảm giá:</span>
                      <strong className="text-muted">0đ</strong>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row summary-total">
                      <h4>Tổng cộng:</h4>
                      <h4 className="total-amount">{getTotal().toLocaleString('vi-VN')}đ</h4>
                    </div>
                  </div>

                  {/* Trust Info */}
                  <div className="trust-info">
                    <div className="trust-item">
                      <i className="fas fa-shield-alt"></i>
                      <span>Thanh toán an toàn</span>
                    </div>
                    <div className="trust-item">
                      <i className="fas fa-truck"></i>
                      <span>Giao hàng 2-3 giờ</span>
                    </div>
                    <div className="trust-item">
                      <i className="fas fa-map-marked-alt"></i>
                      <span>Chỉ giao tại Cần Thơ</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-place-order">
                    <i className="fas fa-check-circle"></i>
                    Hoàn Tất Đặt Hàng
                  </button>

                  <button 
                    type="button" 
                    className="btn-back-to-cart"
                    onClick={() => navigate('/cart')}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Quay Lại Giỏ Hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
    </>
  );
};

export default Checkout;
