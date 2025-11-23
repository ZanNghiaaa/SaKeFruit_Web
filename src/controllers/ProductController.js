// Product data model - Sa Kê Products
const PRODUCTS_KEY = 'sakefruit_products';

// Default products
const defaultProducts = [
  // 1. Bánh Mochi SAKEGO (có nhiều loại)
  {
    id: 6,
    name: 'Snack SAKEGO Phô Mai',
    price: 19000,
    image: '/assets/images/Nền xám.png',
    description: 'Snack SAKEGO giòn tan, vị phô mai béo ngậy. Sản phẩm ăn liền tiện lợi, thích hợp mọi lúc. Trọng lượng: 60g',
    category: 'snack',
    stock: 110,
    isTrial: false,
    isReadyToEat: true
  },
  // 2. Trà SAKEGO
{
    id: 3,
    name: 'Trà SAKEGO Nguyên Chất',
    price: 17000,
    image: '/assets/images/Trà sake.png',
    description: 'Trà SAKEGO 100% tự nhiên, giàu chất chống oxi hóa. Pha liền tiện lợi, thơm ngon. Trọng lượng: 50g',
    category: 'tea',
    stock: 80,
    isTrial: false,
    isReadyToEat: true
  },
    // 3. Khô SAKEGO
  {
    id: 4,
    name: 'Khô SAKEGO Sấy Khô',
    price: 29000,
    image: '/assets/images/khosake.png',
    description: 'SAKEGO sấy khô giữ nguyên dinh dưỡng. Sản phẩm ăn liền tiện lợi, dễ bảo quản. Trọng lượng: 80g',
    category: 'dried',
    stock: 60,
    isTrial: false,
    isReadyToEat: true
  },
  {
    id: 1,
    name: 'Bánh Mochi Combo 4 Vị',
    price: 39000,
    image: '/assets/images/mochicombo.png',
    description: 'Combo 4 vị mochi SAKEGO đa dạng: Phô mai, Rong biển, Truyền thống, Sôcôla. Sản phẩm ăn liền tiện lợi.',
    category: 'mochi',
    stock: 100,
    isTrial: false,
    isReadyToEat: true
  },
  {
    id: 2,
    name: 'Bánh Mochi SAKEGO',
    price: 12000,
    image: '/assets/images/mochi.png',
    description: 'Bánh mochi SAKEGO mềm mịn, thơm ngon. Sản phẩm ăn liền tiện lợi.',
    category: 'mochi',
    stock: 200,
    isTrial: false,
    isReadyToEat: true
  },



  // 4. Bánh Mật SAKEGO
  {
    id: 5,
    name: 'Bánh Mật SAKEGO',
    price: 20000,
    image: '/assets/images/banhmat.png',
    description: 'Bánh mật SAKEGO thơm ngon, ngọt thanh tự nhiên. Sản phẩm ăn liền tiện lợi cho mọi lứa tuổi. Trọng lượng: 80g',
    category: 'honey-cake',
    stock: 90,
    isTrial: false,
    isReadyToEat: true
  },

  // 5. Snack SAKEGO
  {
    id: 6,
    name: 'Snack SAKEGO Phô Mai',
    price: 19000,
    image: '/assets/images/Nền xám.png',
    description: 'Snack SAKEGO giòn tan, vị phô mai béo ngậy. Sản phẩm ăn liền tiện lợi, thích hợp mọi lúc. Trọng lượng: 60g',
    category: 'snack',
    stock: 110,
    isTrial: false,
    isReadyToEat: true
  },


  // Combo
  {
    id: 7,
    name: 'Combo Sa Kê Đa Dạng',
    price: 180000,
    image: 'https://placehold.co/400x300/5C6BC0/white?text=Combo+Da+Dang',
    description: 'Combo gồm: Mochi, Snack, Trà Sa Kê - Trọn vẹn hương vị. Tất cả đều là sản phẩm ăn liền tiện lợi.',
    category: 'combo',
    stock: 50,
    isTrial: false,
    isReadyToEat: true
  }
];

// Initialize products in localStorage if not exists
export const initializeProducts = () => {
  // Always sync with defaultProducts to get latest updates
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
};

// Get all products from localStorage
export const getAllProducts = () => {
  const products = localStorage.getItem(PRODUCTS_KEY);
  return products ? JSON.parse(products) : defaultProducts;
};

// Save products to localStorage
const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Add new product
export const addProduct = (productData) => {
  const products = getAllProducts();
  
  // Generate new ID
  const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
  const newProduct = {
    id: maxId + 1,
    name: productData.name,
    price: parseFloat(productData.price),
    image: productData.image || 'https://placehold.co/400x300/gray/white?text=No+Image',
    description: productData.description,
    category: productData.category,
    stock: parseInt(productData.stock) || 0,
    isTrial: productData.isTrial || false,
    isReadyToEat: productData.isReadyToEat !== false // Default true
  };
  
  products.push(newProduct);
  saveProducts(products);
  
  return newProduct;
};

// Update product
export const updateProduct = (id, updates) => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Sản phẩm không tồn tại!');
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id, // Prevent ID change
    price: parseFloat(updates.price),
    stock: parseInt(updates.stock)
  };
  
  saveProducts(products);
  return products[index];
};

// Delete product
export const deleteProduct = (id) => {
  const products = getAllProducts();
  const filteredProducts = products.filter(p => p.id !== parseInt(id));
  
  if (filteredProducts.length === products.length) {
    throw new Error('Sản phẩm không tồn tại!');
  }
  
  saveProducts(filteredProducts);
  return true;
};

// Get products by category
export const getProductsByCategory = (category) => {
  const allProducts = getAllProducts();
  if (category === 'all' || !category) {
    return allProducts;
  }
  return allProducts.filter(p => p.category === category);
};

// Get product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  return products.find(p => p.id === parseInt(id));
};

// Search products
export const searchProducts = (searchTerm) => {
  const products = getAllProducts();
  const term = searchTerm.toLowerCase().trim();
  return products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
};

// Get product categories with counts
export const getProductCategories = () => {
  const products = getAllProducts();
  const categories = {
    all: { name: 'Tất cả', count: products.length },
    mochi: { name: 'Bánh Mochi', count: 0 },
    tea: { name: 'Trà Sa Kê', count: 0 },
    dried: { name: 'Khô Sa Kê', count: 0 },
    'honey-cake': { name: 'Bánh Mật', count: 0 },
    snack: { name: 'Snack', count: 0 },
    combo: { name: 'Combo', count: 0 }
  };
  
  products.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].count++;
    }
  });
  
  return categories;
};

// Initialize on module load
initializeProducts();

