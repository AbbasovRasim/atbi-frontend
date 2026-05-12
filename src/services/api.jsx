const API_BASE_URL = "http://localhost:8080";

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (options.method === "DELETE" && response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};

export const auth = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "Registration failed");
    }

    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const token = await response.text();

    if (!response.ok) {
      throw new Error(token || "Login failed");
    }

    localStorage.setItem("token", token);
    return token;
  },

  logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

// ✅ BURASI ƏN VACİB HİSSƏDİR!
export const incident = {
  async getAll() {
    return api.get("/incidents");
  },

  async create(incidentData) {
    return api.post("/incidents", incidentData);
  },

  async updateStatus(id, status) {
    return api.put(`/incidents/${id}/status?status=${status}`);
  },

  async deleteIncident(id) {
    return api.delete(`/incidents/${id}`);
  },
};
