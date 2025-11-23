import React, { useState, useEffect } from 'react';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getProductCategories 
} from '../controllers/ProductController';

const AdminProducts = () => {
  const [products, setProducts] = useState(getAllProducts());
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'mochi',
    stock: '',
    isTrial: false,
    isReadyToEat: true
  });

  const categories = getProductCategories();

  // Refresh products
  const refreshProducts = () => {
    setProducts(getAllProducts());
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Open add modal
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: 'mochi',
      stock: '',
      isTrial: false,
      isReadyToEat: true
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
      isTrial: product.isTrial,
      isReadyToEat: product.isReadyToEat
    });
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        updateProduct(editingProduct.id, formData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Add new product
        addProduct(formData);
        alert('Thêm sản phẩm thành công!');
      }
      
      refreshProducts();
      setShowModal(false);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Delete product
  const handleDeleteProduct = (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        deleteProduct(product.id);
        alert('Xóa sản phẩm thành công!');
        refreshProducts();
      } catch (error) {
        alert('Lỗi: ' + error.message);
      }
    }
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      mochi: 'Bánh Mochi',
      tea: 'Trà Sa Kê',
      dried: 'Khô Sa Kê',
      'honey-cake': 'Bánh Mật',
      snack: 'Snack',
      combo: 'Combo'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="admin-products">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>
            <i className="fas fa-box"></i> Quản Lý Sản Phẩm
          </h1>
          <p className="admin-header-subtitle">
            Quản lý danh sách sản phẩm Sa Kê - Tổng cộng {products.length} sản phẩm
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddProduct}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      {/* Filter and Search */}
      <div className="admin-filters">
        <div className="filter-tabs">
          <button 
            className={filterCategory === 'all' ? 'active' : ''}
            onClick={() => setFilterCategory('all')}
          >
            Tất cả ({categories.all.count})
          </button>
          <button 
            className={filterCategory === 'mochi' ? 'active' : ''}
            onClick={() => setFilterCategory('mochi')}
          >
            Mochi ({categories.mochi.count})
          </button>
          <button 
            className={filterCategory === 'snack' ? 'active' : ''}
            onClick={() => setFilterCategory('snack')}
          >
            Snack ({categories.snack.count})
          </button>
          <button 
            className={filterCategory === 'tea' ? 'active' : ''}
            onClick={() => setFilterCategory('tea')}
          >
            Trà ({categories.tea.count})
          </button>
          <button 
            className={filterCategory === 'dried' ? 'active' : ''}
            onClick={() => setFilterCategory('dried')}
          >
            Khô ({categories.dried.count})
          </button>
          <button 
            className={filterCategory === 'honey-cake' ? 'active' : ''}
            onClick={() => setFilterCategory('honey-cake')}
          >
            Bánh Mật ({categories['honey-cake'].count})
          </button>
          <button 
            className={filterCategory === 'combo' ? 'active' : ''}
            onClick={() => setFilterCategory('combo')}
          >
            Combo ({categories.combo.count})
          </button>
        </div>

        <div className="search-box-admin">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="dashboard-card">
        <div className="table-responsive">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td><strong>#{product.id}</strong></td>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-thumbnail"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{product.name}</strong>
                        {product.isTrial && (
                          <span className="badge-trial" style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 8px', background: '#E91E63', color: 'white', borderRadius: '4px' }}>
                            Dùng thử
                          </span>
                        )}
                        {product.isReadyToEat && (
                          <span className="badge-ready" style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 8px', background: '#4CAF50', color: 'white', borderRadius: '4px' }}>
                            Ăn liền
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{getCategoryName(product.category)}</td>
                    <td>
                      <strong className="text-success">
                        {product.price.toLocaleString('vi-VN')}đ
                      </strong>
                    </td>
                    <td>
                      <span className={product.stock > 50 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.stock > 0 ? (
                        <span className="status-badge status-completed">Còn hàng</span>
                      ) : (
                        <span className="status-badge status-cancelled">Hết hàng</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-action-edit"
                          onClick={() => handleEditProduct(product)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-action btn-action-delete"
                          onClick={() => handleDeleteProduct(product)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-box"></i> 
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tên sản phẩm <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div className="form-group">
                    <label>Danh mục <span className="text-danger">*</span></label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="mochi">Bánh Mochi</option>
                      <option value="snack">Snack</option>
                      <option value="tea">Trà Sa Kê</option>
                      <option value="dried">Khô Sa Kê</option>
                      <option value="honey-cake">Bánh Mật</option>
                      <option value="combo">Combo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá (VNĐ) <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1000"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tồn kho <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>URL Hình ảnh</label>
                    <input 
                      type="url" 
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Mô tả <span className="text-danger">*</span></label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      placeholder="Nhập mô tả sản phẩm"
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          name="isReadyToEat"
                          checked={formData.isReadyToEat}
                          onChange={handleInputChange}
                        />
                        <span>Sản phẩm ăn liền</span>
                      </label>

                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          name="isTrial"
                          checked={formData.isTrial}
                          onChange={handleInputChange}
                        />
                        <span>Gói dùng thử</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-save"></i> 
                  {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
