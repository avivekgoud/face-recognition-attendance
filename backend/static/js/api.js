// Centralized API Client

class ApiClient {
  constructor() {
    this.baseUrl = window.location.origin;
    this.tokenKey = "facesync_auth_token";
    this.userKey = "facesync_auth_user";
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setSession(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    try {
      const u = localStorage.getItem(this.userKey);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        // If unauthorized on protected route, trigger login prompt if not on public
        if (!endpoint.includes("/auth/login")) {
          // Token expired or invalid
          // this.clearSession();
        }
      }

      // Check for file/blob response
      const contentType = response.headers.get("content-type");
      if (contentType && (contentType.includes("csv") || contentType.includes("sheet") || contentType.includes("pdf") || contentType.includes("octet-stream"))) {
        if (!response.ok) {
          throw new Error("Download failed");
        }
        return await response.blob();
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "API request failed");
      }
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: { username, password }
    });
  }

  async getMe() {
    return this.request("/api/auth/me");
  }

  async getUsers() {
    return this.request("/api/auth/users");
  }

  async createUser(userData) {
    return this.request("/api/auth/users", {
      method: "POST",
      body: userData
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request("/api/dashboard/stats");
  }

  async getDashboardTrend(days = 7) {
    return this.request(`/api/dashboard/trend?days=${days}`);
  }

  async getDepartmentStats() {
    return this.request("/api/dashboard/departments");
  }

  async getHourlyStats() {
    return this.request("/api/dashboard/hourly");
  }

  async getRecentActivity(limit = 10) {
    return this.request(`/api/dashboard/recent-activity?limit=${limit}`);
  }

  // Live Camera Attendance
  async recognizeFace(payload) {
    return this.request("/api/attendance/recognize", {
      method: "POST",
      body: payload
    });
  }

  // Persons endpoints
  async getPersons(search = "", departmentId = null) {
    let url = "/api/persons?";
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (departmentId) url += `department_id=${departmentId}&`;
    return this.request(url);
  }

  async getPersonDetail(id) {
    return this.request(`/api/persons/${id}`);
  }

  async createPerson(personData) {
    return this.request("/api/persons", {
      method: "POST",
      body: personData
    });
  }

  async updatePerson(id, personData) {
    return this.request(`/api/persons/${id}`, {
      method: "PUT",
      body: personData
    });
  }

  async enrollFaces(id, enrollData) {
    return this.request(`/api/persons/${id}/enroll`, {
      method: "POST",
      body: enrollData
    });
  }

  async eraseBiometrics(id) {
    return this.request(`/api/persons/${id}/biometrics`, {
      method: "DELETE"
    });
  }

  async deletePerson(id) {
    return this.request(`/api/persons/${id}`, {
      method: "DELETE"
    });
  }

  // Attendance endpoints
  async getAttendanceLogs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.date) params.append("date", filters.date);
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id) params.append("department_id", filters.department_id);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    return this.request(`/api/attendance?${params.toString()}`);
  }

  async manualAttendance(data) {
    return this.request("/api/attendance/manual", {
      method: "POST",
      body: data
    });
  }

  async updateAttendance(id, data) {
    return this.request(`/api/attendance/${id}`, {
      method: "PUT",
      body: data
    });
  }

  async deleteAttendance(id) {
    return this.request(`/api/attendance/${id}`, {
      method: "DELETE"
    });
  }

  // Departments endpoints
  async getDepartments() {
    return this.request("/api/departments");
  }

  async createDepartment(deptData) {
    return this.request("/api/departments", {
      method: "POST",
      body: deptData
    });
  }

  async updateDepartment(id, deptData) {
    return this.request(`/api/departments/${id}`, {
      method: "PUT",
      body: deptData
    });
  }

  async deleteDepartment(id) {
    return this.request(`/api/departments/${id}`, {
      method: "DELETE"
    });
  }

  // Settings & Audit endpoints
  async getSettings() {
    return this.request("/api/settings");
  }

  async updateSettings(settingsData) {
    return this.request("/api/settings", {
      method: "PUT",
      body: settingsData
    });
  }

  async seedSampleData() {
    return this.request("/api/settings/seed-sample-data", {
      method: "POST"
    });
  }

  async getAuditLogs(limit = 50) {
    return this.request(`/api/audit?limit=${limit}`);
  }

  // Report download helper
  async downloadReport(format, filters = {}) {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id) params.append("department_id", filters.department_id);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const blob = await this.request(`/api/reports/${format}?${params.toString()}`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

window.api = new ApiClient();

// Global Toast System
window.showToast = function(message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-animate flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
    type === "success" ? "bg-emerald-900/90 text-emerald-100 border-emerald-700/80" :
    type === "error" ? "bg-rose-900/90 text-rose-100 border-rose-700/80" :
    type === "warning" ? "bg-amber-900/90 text-amber-100 border-amber-700/80" :
    "bg-slate-900/90 text-slate-100 border-slate-700/80"
  }`;

  const iconSvg = type === "success" 
    ? `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
    : type === "error"
    ? `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
    : `<svg class="w-5 h-5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.innerHTML = `${iconSvg} <div class="flex-1">${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
};
