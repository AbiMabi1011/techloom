const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/products${suffix}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getCart: (customerId) => request(`/cart/${customerId}`),
  addToCart: (customerId, productId, quantity) =>
    request(`/cart/${customerId}/items`, { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (customerId, productId, quantity) =>
    request(`/cart/${customerId}/items/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (customerId, productId) =>
    request(`/cart/${customerId}/items/${productId}`, { method: 'DELETE' }),
  checkout: (customerId, idempotencyKey) =>
    request('/orders/checkout', { method: 'POST', body: JSON.stringify({ customerId, idempotencyKey }) }),
  pay: (orderId, attemptKey, forceOutcome) =>
    request(`/payments/${orderId}`, { method: 'POST', body: JSON.stringify({ attemptKey, forceOutcome }) }),
  getOrderHistory: (customerId) => request(`/orders/customer/${customerId}`),
  getAllOrders: () => request('/orders'),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
  refundOrder: (id) => request(`/orders/${id}/refund`, { method: 'POST' }),
  createProduct: (productData) =>
    request('/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),
};
