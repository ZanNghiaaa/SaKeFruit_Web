// Order Management Controller
const ORDERS_KEY = 'sakefruit_orders';

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',           // Chờ xác nhận
  CONFIRMED: 'confirmed',       // Đã xác nhận
  PREPARING: 'preparing',       // Đang chuẩn bị
  DELIVERING: 'delivering',     // Đang giao
  COMPLETED: 'completed',       // Hoàn thành
  CANCELLED: 'cancelled'        // Đã hủy
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PREPARING]: 'Đang chuẩn bị',
  [ORDER_STATUS.DELIVERING]: 'Đang giao hàng',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

// Initialize orders in localStorage
export const initializeOrders = () => {
  const orders = localStorage.getItem(ORDERS_KEY);
  if (!orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
};

// Get all orders
export const getAllOrders = () => {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

// Get order by ID
export const getOrderById = (orderId) => {
  const orders = getAllOrders();
  return orders.find(order => order.id === orderId);
};

// Get orders by user ID
export const getOrdersByUserId = (userId) => {
  const orders = getAllOrders();
  return orders.filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Create new order
export const createOrder = (orderData) => {
  const orders = getAllOrders();
  
  // Generate order ID
  const orderId = 'ORD' + Date.now();
  
  const newOrder = {
    id: orderId,
    userId: orderData.userId,
    customerInfo: {
      fullname: orderData.fullname,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      district: orderData.district,
      ward: orderData.ward,
      notes: orderData.notes || ''
    },
    items: orderData.items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category
    })),
    totalAmount: orderData.totalAmount,
    paymentMethod: orderData.paymentMethod || 'cod',
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [{
      status: ORDER_STATUS.PENDING,
      timestamp: new Date().toISOString(),
      note: 'Đơn hàng được tạo'
    }]
  };
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return newOrder;
};

// Update order status
export const updateOrderStatus = (orderId, newStatus, note = '') => {
  const orders = getAllOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    throw new Error('Đơn hàng không tồn tại!');
  }
  
  orders[orderIndex].status = newStatus;
  orders[orderIndex].updatedAt = new Date().toISOString();
  orders[orderIndex].statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || ORDER_STATUS_TEXT[newStatus]
  });
  
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return orders[orderIndex];
};

// Cancel order
export const cancelOrder = (orderId, reason = '') => {
  return updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason || 'Đơn hàng đã bị hủy');
};

// Get orders statistics
export const getOrdersStatistics = () => {
  const orders = getAllOrders();
  
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
    confirmed: orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).length,
    preparing: orders.filter(o => o.status === ORDER_STATUS.PREPARING).length,
    delivering: orders.filter(o => o.status === ORDER_STATUS.DELIVERING).length,
    completed: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
    cancelled: orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
    totalRevenue: orders
      .filter(o => o.status === ORDER_STATUS.COMPLETED)
      .reduce((sum, order) => sum + order.totalAmount, 0)
  };
};

// Get orders by status
export const getOrdersByStatus = (status) => {
  const orders = getAllOrders();
  return orders.filter(order => order.status === status)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Get today's orders
export const getTodayOrders = () => {
  const orders = getAllOrders();
  const today = new Date().toISOString().split('T')[0];
  
  return orders.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    return orderDate === today;
  });
};

// Validate Can Tho address
export const isCanThoAddress = (address, district) => {
  const canThoKeywords = ['cần thơ', 'can tho', 'cần thơ', 'cantho'];
  const addressLower = (address + ' ' + district).toLowerCase();
  return canThoKeywords.some(keyword => addressLower.includes(keyword));
};

// Can Tho districts
export const CAN_THO_DISTRICTS = [
  'Ninh Kiều',
  'Bình Thủy',
  'Cái Răng',
  'Ô Môn',
  'Thốt Nốt',
  'Phong Điền',
  'Cờ Đỏ',
  'Vĩnh Thạnh',
  'Thới Lai'
];

// Initialize on load
initializeOrders();
