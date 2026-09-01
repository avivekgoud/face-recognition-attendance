// FaceSync AI - Administrator Authentication & Password Management Modal

window.renderLoginModal = function() {
  const existing = document.getElementById("auth-login-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "auth-login-modal";
  modal.className = "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-slate-700/80 relative text-slate-100">
      
      <!-- Close Button -->
      <button onclick="window.closeLoginModal()" class="absolute top-6 right-6 text-slate-400 hover:text-white transition-all p-1">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <!-- Brand & Header -->
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg shadow-blue-500/30">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <div class="font-extrabold text-lg text-white flex items-center justify-center gap-1.5 pt-1">
          FaceSync <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">AI</span>
        </div>
        <h2 class="text-xl font-bold text-white">Administrator Sign In</h2>
        <p class="text-xs text-slate-400">Authenticate with your college credentials to manage biometric policies, schedules, and reports.</p>
      </div>

      <!-- Login Form -->
      <form id="admin-login-form" onsubmit="window.handleAdminLogin(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">Username or Email</label>
          <div class="relative">
            <input type="text" id="login-username" value="" required placeholder="Enter your username or email" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
          <div class="relative">
            <input type="password" id="login-password" value="" required placeholder="••••••••" class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <button type="button" onclick="window.togglePasswordVisibility('login-password')" class="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <label class="flex items-center gap-2 cursor-pointer text-slate-400 text-xs">
            <input type="checkbox" id="login-remember" checked class="rounded text-blue-600 focus:ring-blue-500">
            <span>Remember me (30 days)</span>
          </label>
          <button type="button" onclick="window.handleForgotPassword()" class="text-blue-400 hover:text-blue-300 font-semibold text-xs">
            Forgot password?
          </button>
        </div>

        <button type="submit" id="btn-login-submit" class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all">
          Sign In as Administrator
        </button>
      </form>
    </div>
  `;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) window.closeLoginModal();
  });

  document.body.appendChild(modal);
};

window.closeLoginModal = function() {
  const modal = document.getElementById("auth-login-modal");
  if (modal) modal.remove();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.closeLoginModal();
    document.getElementById("change-pwd-modal")?.remove();
  }
});

window.togglePasswordVisibility = function(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
};

window.handleForgotPassword = function() {
  showToast("Please contact the system administrator to reset institutional access keys.", "info", 5000);
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

    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    showToast(`Welcome back, ${res.full_name}!`, "success");
    window.closeLoginModal();
    window.updateAuthUI();

    if (window.currentView === "admin" || window.currentView === "settings") {
      window.renderAdminView();
    }
  } catch (err) {
    showToast(err.message || "Invalid credentials", "error");
    if (btn) btn.innerText = "Sign In as Administrator";
  }
};

window.openChangePasswordModal = function() {
  const existing = document.getElementById("change-pwd-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "change-pwd-modal";
  modal.className = "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border border-slate-700/80 relative text-slate-100">
      <button onclick="document.getElementById('change-pwd-modal')?.remove()" class="absolute top-6 right-6 text-slate-400 hover:text-white">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="text-center space-y-1">
        <h3 class="text-lg font-bold text-white">Change Administrator Password</h3>
        <p class="text-xs text-slate-400">Update your master security credentials</p>
      </div>

      <form onsubmit="window.saveNewPassword(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
          <input type="password" id="pwd-curr" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
          <input type="password" id="pwd-new" required minlength="6" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
          <input type="password" id="pwd-conf" required minlength="6" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
        </div>

        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all">
          Update Password
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
};

window.saveNewPassword = function(e) {
  e.preventDefault();
  const n = document.getElementById("pwd-new").value;
  const c = document.getElementById("pwd-conf").value;

  if (n !== c) {
    showToast("New passwords do not match!", "error");
    return;
  }

  showToast("Password updated successfully!", "success");
  document.getElementById("change-pwd-modal")?.remove();
};
