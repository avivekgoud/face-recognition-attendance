// Master Application Router & State Manager

window.currentView = "dashboard";

window.navigateTo = async function(viewName, params = {}) {
  // Cleanup previous view if needed
  if (window.currentView === "live" && window.cleanupLiveCamera) {
    window.cleanupLiveCamera();
  }
  if (window.currentView === "registration" && window.cleanupRegistration) {
    window.cleanupRegistration();
  }

  window.currentView = viewName;

  // Update Nav active pill styles
  const navItems = ["dashboard", "live", "people", "history", "reports", "admin"];
  navItems.forEach(item => {
    const el = document.getElementById(`nav-link-${item}`);
    if (el) {
      if (item === viewName) {
        el.className = "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25 transition-all";
      } else {
        el.className = "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all";
      }
    }
  });

  const container = document.getElementById("app-view-container");
  if (!container) return;

  container.innerHTML = `
    <div class="py-24 text-center">
      <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;

  try {
    async function ensureViewLoaded(fnName, scriptPath) {
      if (typeof window[fnName] !== "function") {
        await new Promise((resolve) => {
          const s = document.createElement("script");
          s.src = scriptPath + "?v=" + Date.now();
          s.onload = resolve;
          s.onerror = resolve;
          document.head.appendChild(s);
        });
      }
    }

    switch (viewName) {
      case "dashboard":
        await ensureViewLoaded("renderDashboardView", "/static/js/views/dashboard.js");
        await window.renderDashboardView(container);
        break;
      case "live":
        await ensureViewLoaded("renderLiveCameraView", "/static/js/views/live_camera.js");
        await window.renderLiveCameraView(container);
        break;
      case "registration":
        await ensureViewLoaded("renderRegistrationView", "/static/js/views/registration.js");
        await window.renderRegistrationView(container);
        break;
      case "people":
        await ensureViewLoaded("renderPeopleView", "/static/js/views/people.js");
        await window.renderPeopleView(container);
        break;
      case "history":
        await ensureViewLoaded("renderHistoryView", "/static/js/views/history.js");
        await window.renderHistoryView(container);
        break;
      case "reports":
        await ensureViewLoaded("renderReportsView", "/static/js/views/reports.js");
        await window.renderReportsView(container);
        break;
      case "admin":
      case "settings":
        await ensureViewLoaded("renderAdminView", "/static/js/views/admin.js");
        await window.renderAdminView(container);
        break;
      default:
        await ensureViewLoaded("renderDashboardView", "/static/js/views/dashboard.js");
        await window.renderDashboardView(container);
    }
  } catch (err) {
    console.error("View rendering error:", err);
    container.innerHTML = `
      <div class="max-w-md mx-auto py-16 text-center space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">!</div>
        <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Unable to Load View</h3>
        <p class="text-xs text-slate-500">${err.message || 'An error occurred while loading this page.'}</p>
        <button onclick="window.navigateTo('${viewName}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all">Try Again</button>
      </div>
    `;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Global Live Search Dropdown
let searchDebounceTimer = null;
window.handleGlobalSearchInput = function(query) {
  clearTimeout(searchDebounceTimer);
  const dropdown = document.getElementById("global-search-results");
  if (!dropdown) return;

  query = query.trim();
  if (query.length < 2) {
    dropdown.classList.add("hidden");
    return;
  }

  searchDebounceTimer = setTimeout(async () => {
    try {
      const results = await api.getPersons(query);
      if (results.length === 0) {
        dropdown.innerHTML = `<div class="p-4 text-center text-xs text-slate-400">No person found matching "${query}"</div>`;
      } else {
        dropdown.innerHTML = results.slice(0, 6).map(p => `
          <div onclick="window.selectSearchResult(${p.id})" class="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-none">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              ${p.profile_photo_url ? `<img src="${p.profile_photo_url}" class="w-full h-full object-cover">` : p.full_name.charAt(0)}
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">${p.full_name}</div>
              <div class="text-[11px] text-slate-400 truncate">${p.identifier} &bull; ${p.department_name || 'Unassigned'}</div>
            </div>
            <span class="text-[10px] text-blue-600 font-semibold uppercase">View Profile &rarr;</span>
          </div>
        `).join("");
      }
      dropdown.classList.remove("hidden");
    } catch (e) {
      dropdown.classList.add("hidden");
    }
  }, 250);
};

window.selectSearchResult = async function(personId) {
  document.getElementById("global-search-results")?.classList.add("hidden");
  document.getElementById("global-search-input").value = "";
  
  if (window.currentView !== "people") {
    await window.navigateTo("people");
  }
  setTimeout(() => {
    window.openPersonProfile(personId);
  }, 100);
};

// Global Live Clock
function updateClock() {
  const clockEl = document.getElementById("header-live-clock");
  if (!clockEl) return;
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  clockEl.innerText = now.toLocaleDateString('en-US', options);
}

// Auth UI status updater
window.updateAuthUI = function() {
  const user = api.getUser();
  const authContainer = document.getElementById("auth-status-container");
  if (!authContainer) return;

  if (user) {
    authContainer.innerHTML = `
      <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
          ${user.username.charAt(0).toUpperCase()}
        </div>
        <div class="hidden sm:block text-left">
          <div class="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">${user.full_name || user.username}</div>
          <div class="text-[9px] text-slate-400 capitalize">${user.role}</div>
        </div>
        <button onclick="window.handleLogout()" title="Sign Out" class="ml-1 text-slate-400 hover:text-rose-600 text-xs">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button onclick="window.renderLoginModal()" class="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xs">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
        Admin Sign In
      </button>
    `;
  }
};

window.handleLogout = function() {
  api.clearSession();
  showToast("Signed out successfully", "info");
  window.updateAuthUI();
  window.navigateTo("dashboard");
};

// Theme toggle
window.toggleTheme = function() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("facesync_theme", isDark ? "dark" : "light");
};

// Initialize App
document.addEventListener("DOMContentLoaded", async () => {
  // Theme init
  if (localStorage.getItem("facesync_theme") === "dark" || (!('facesync_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add("dark");
  }

  // Live clock
  setInterval(updateClock, 1000);
  updateClock();

  // Close search dropdown on click outside
  document.addEventListener("click", (e) => {
    const searchWrap = document.getElementById("global-search-wrapper");
    const dropdown = document.getElementById("global-search-results");
    if (searchWrap && dropdown && !searchWrap.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  window.updateAuthUI();

  // Route to initial view
  await window.navigateTo("dashboard");
});
