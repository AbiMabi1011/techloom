export function getCustomerId() {
  let id = localStorage.getItem('techloom_customer_id');
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('techloom_customer_id', id);
  }
  return id;
}
