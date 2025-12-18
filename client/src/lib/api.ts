const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/products?${query}`);
    return response.json();
  }
};