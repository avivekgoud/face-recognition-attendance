// Administrator Login Modal Component

window.renderLoginModal = function() {
  const existing = document.getElementById("auth-login-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "auth-login-modal";
  modal.className = "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-700 relative">
      <button onclick="window.closeLoginModal()" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-blue-500/30">
          🔐
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Administrator Sign In</h2>
        <p class="text-xs text-slate-500">Authenticate to modify attendance records, configure shifts, or adjust biometrics.</p>
      </div>

      <form id="admin-login-form" onsubmit="window.handleAdminLogin(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Username</label>
          <input type="text" id="login-username" value="admin" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input type="password" id="login-password" value="admin123" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
          <div class="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Default demo: admin / admin123</span>
          </div>
        </div>

        <button type="submit" id="btn-login-submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
          Sign In
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
};

window.closeLoginModal = function() {
  const modal = document.getElementById("auth-login-modal");
  if (modal) modal.remove();
};

window.handleAdminLogin = async function(e) {
  e.preventDefault();
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const btn = document.getElementById("btn-login-submit");

  if (btn) btn.innerText = "Authenticating...";

  try {
    const res = await api.login(u, p);
    api.setSession(res.access_token, {
      username: res.username,
      full_name: res.full_name,
      role: res.role
    });

    soundEffects.playSuccess();
    showToast(`Welcome back, ${res.full_name}!`, "success");
    window.closeLoginModal();
    window.updateAuthUI();

    // Reload active view if admin
    if (window.currentView === "admin") {
      window.renderAdminView(document.getElementById("app-view-container"));
    }
  } catch (err) {
    showToast(err.message || "Invalid credentials", "error");
    if (btn) btn.innerText = "Sign In";
  }
};
