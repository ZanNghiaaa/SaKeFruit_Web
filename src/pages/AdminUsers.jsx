import React, { useState } from 'react';
import { getUsers, updateUserProfile } from '../controllers/UserController';
import { getOrdersByUserId } from '../controllers/OrderController';

const AdminUsers = () => {
  const [users, setUsers] = useState(getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Refresh users
  const refreshUsers = () => {
    setUsers(getUsers());
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchSearch = !searchTerm || 
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    return matchRole && matchSearch;
  });

  // Get user statistics
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Get user orders
  const getUserOrders = (userId) => {
    return getOrdersByUserId(userId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>
            <i className="fas fa-users"></i> Quản Lý Người Dùng
          </h1>
          <p className="admin-header-subtitle">
            Quản lý tài khoản khách hàng và quản trị viên
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '30px' }}>
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="stat-content">
            <h3>{totalCustomers}</h3>
            <p>Khách hàng</p>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-content">
            <h3>{totalAdmins}</h3>
            <p>Quản trị viên</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="admin-filters">
        <div className="filter-tabs">
          <button 
            className={filterRole === 'all' ? 'active' : ''}
            onClick={() => setFilterRole('all')}
          >
            Tất cả ({users.length})
          </button>
          <button 
            className={filterRole === 'customer' ? 'active' : ''}
            onClick={() => setFilterRole('customer')}
          >
            Khách hàng ({totalCustomers})
          </button>
          <button 
            className={filterRole === 'admin' ? 'active' : ''}
            onClick={() => setFilterRole('admin')}
          >
            Quản trị viên ({totalAdmins})
          </button>
        </div>

        <div className="search-box-admin">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="dashboard-card">
        <div className="table-responsive">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-slash"></i>
              <p>Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên đầy đủ</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Đơn hàng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const userOrders = getUserOrders(user.id);
                  return (
                    <tr key={user.id}>
                      <td><strong>#{user.id}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="user-avatar-small" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {user.fullname.charAt(0).toUpperCase()}
                          </div>
                          <strong>{user.fullname}</strong>
                        </div>
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        {user.role === 'admin' ? (
                          <span className="status-badge status-delivering" style={{ background: '#9C27B0' }}>
                            <i className="fas fa-user-shield"></i> Admin
                          </span>
                        ) : (
                          <span className="status-badge status-confirmed">
                            <i className="fas fa-user"></i> Khách hàng
                          </span>
                        )}
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <span className="badge-count" style={{
                          background: '#E3F2FD',
                          color: '#1976D2',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '13px'
                        }}>
                          {userOrders.length} đơn
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-action btn-action-view"
                          onClick={() => handleViewUser(user)}
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user"></i> Chi Tiết Người Dùng
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* User Info */}
              <div className="user-detail-section">
                <div className="user-avatar-large" style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  margin: '0 auto 20px'
                }}>
                  {selectedUser.fullname.charAt(0).toUpperCase()}
                </div>

                <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
                  {selectedUser.fullname}
                </h3>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                  {selectedUser.role === 'admin' ? (
                    <span className="status-badge status-delivering" style={{ background: '#9C27B0' }}>
                      <i className="fas fa-user-shield"></i> Quản trị viên
                    </span>
                  ) : (
                    <span className="status-badge status-confirmed">
                      <i className="fas fa-user"></i> Khách hàng
                    </span>
                  )}
                </p>

                <div className="info-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div className="info-item">
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-id-card"></i> ID
                    </label>
                    <p style={{ fontWeight: 'bold' }}>#{selectedUser.id}</p>
                  </div>

                  <div className="info-item">
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-user-tag"></i> Username
                    </label>
                    <p style={{ fontWeight: 'bold' }}>{selectedUser.username}</p>
                  </div>

                  <div className="info-item">
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-envelope"></i> Email
                    </label>
                    <p style={{ fontWeight: 'bold' }}>{selectedUser.email}</p>
                  </div>

                  <div className="info-item">
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-phone"></i> Số điện thoại
                    </label>
                    <p style={{ fontWeight: 'bold' }}>{selectedUser.phone || 'Chưa cập nhật'}</p>
                  </div>

                  <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-map-marker-alt"></i> Địa chỉ
                    </label>
                    <p style={{ fontWeight: 'bold' }}>{selectedUser.address || 'Chưa cập nhật'}</p>
                  </div>

                  <div className="info-item">
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-calendar-alt"></i> Ngày tạo
                    </label>
                    <p style={{ fontWeight: 'bold' }}>{formatDate(selectedUser.createdAt)}</p>
                  </div>

                  <div className="info-item">
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '5px', display: 'block' }}>
                      <i className="fas fa-shopping-cart"></i> Tổng đơn hàng
                    </label>
                    <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      {getUserOrders(selectedUser.id).length} đơn
                    </p>
                  </div>
                </div>

                {/* Order History */}
                <div className="order-history-section">
                  <h4 style={{ marginBottom: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                    <i className="fas fa-history"></i> Lịch sử đơn hàng
                  </h4>
                  {getUserOrders(selectedUser.id).length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                      Chưa có đơn hàng nào
                    </p>
                  ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {getUserOrders(selectedUser.id).map(order => (
                        <div key={order.id} style={{
                          padding: '15px',
                          background: '#f9f9f9',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <strong>{order.id}</strong>
                            <p style={{ fontSize: '13px', color: '#666', margin: '5px 0' }}>
                              {new Date(order.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '5px' }}>
                              {order.totalAmount.toLocaleString('vi-VN')}đ
                            </p>
                            <span className={`status-badge status-${order.status}`} style={{ fontSize: '11px' }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
