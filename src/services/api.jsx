const API_BASE_URL = "https://atbi-backend.onrender.com";

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
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
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (options.method === "DELETE" && response.status === 204) {
      return { success: true };
    }

    let data = null;
    const text = await response.text();
    if (text) {
      // ✅ SADƏCƏ JSON OLDUQDA PARSE ET
      try {
        data = JSON.parse(text);
      } catch (e) {
        // Token və ya digər string cavablar üçün
        data = text;
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || data || "Something went wrong");
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
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(userData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Registration failed");
    }

    // ✅ Uğurlu register - JSON parse etmə
    return { success: true, message: "İstifadəçi uğurla yaradıldı" };
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
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("role", payload.role);
    localStorage.setItem("username", payload.sub);

    return token;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

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
