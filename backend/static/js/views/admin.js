// Admin Panel & System Settings Component

window.renderAdminView = async function(container) {
  if (!container) container = document.getElementById("app-view-container");
  if (!container) return;

  const user = typeof api !== 'undefined' ? api.getUser() : null;
  const currentLang = localStorage.getItem("facesync_lang") || "en";
  const currentTimezone = localStorage.getItem("facesync_tz") || "Asia/Kolkata";
  const currentDateFormat = localStorage.getItem("facesync_date_fmt") || "DD/MM/YYYY";
  const currentTheme = localStorage.getItem("facesync_theme") || "dark";

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Admin Header Banner -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Administration & System Controls</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">System Configuration & Security</h2>
          <p class="text-xs text-slate-500 mt-1">Manage institutional policies, facial biometrics AI, department shifts, administrator accounts, localization, and audit logs.</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="window.downloadDatabaseBackup()" class="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download DB Backup
          </button>
          <button onclick="window.seedSystemDemoData()" class="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Seed Realistic Demo Data
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 dark:border-slate-700 gap-2 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1 no-scrollbar">
        <button onclick="window.switchAdminTab('settings')" id="tab-btn-settings" class="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold shrink-0">
          General & Biometrics
        </button>
        <button onclick="window.switchAdminTab('localization')" id="tab-btn-localization" class="pb-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0">
          Language & Appearance
        </button>
        <button onclick="window.switchAdminTab('account')" id="tab-btn-account" class="pb-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0">
          Admin Sign In & Session
        </button>
        <button onclick="window.switchAdminTab('departments')" id="tab-btn-departments" class="pb-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0">
          Departments & Shifts
        </button>
        <button onclick="window.switchAdminTab('users')" id="tab-btn-users" class="pb-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0">
          User Accounts
        </button>
        <button onclick="window.switchAdminTab('audit')" id="tab-btn-audit" class="pb-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0">
          Audit Trail
        </button>
      </div>

      <!-- Tab 1: System Settings & Biometrics -->
      <div id="tab-content-settings" class="space-y-6">
        <form id="settings-form" onsubmit="window.saveSettings(event)" class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- General Organization Info -->
            <div class="space-y-4">
              <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-1 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span>Organization & Shift Policy</span>
                <span class="text-[10px] text-blue-600 uppercase font-mono">Shift Rules</span>
              </h3>
              
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization / College Name</label>
                <input type="text" id="set-org-name" value="Vardhaman College of Engineering" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Shift Start</label>
                  <input type="time" id="set-start-time" value="09:00" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Late Grace (Minutes)</label>
                  <input type="number" id="set-grace-mins" min="0" max="60" value="15" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Shift End Time</label>
                <input type="time" id="set-end-time" value="17:00" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <!-- Face Biometrics Sensitivity & Safeguards -->
            <div class="space-y-4">
              <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-1 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span>Facial Biometrics & Anti-Spoofing</span>
                <span class="text-[10px] text-emerald-600 uppercase font-mono font-bold">AES-256 Encrypted</span>
              </h3>

              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-semibold text-slate-700 dark:text-slate-300">Face Similarity Threshold:</span>
                  <span id="label-sim-val" class="font-mono font-bold text-blue-600">68%</span>
                </div>
                <input type="range" id="set-sim-threshold" min="0.50" max="0.95" step="0.01" value="0.68" oninput="document.getElementById('label-sim-val').innerText = `${Math.round(this.value * 100)}%`" class="w-full">
                <p class="text-[11px] text-slate-400 mt-1">Recommended threshold: 65%–72%. Higher threshold prevents false positives.</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duplicate Check-in Cooldown (Minutes)</label>
                <input type="number" id="set-cooldown-mins" min="1" max="120" value="15" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                <p class="text-[11px] text-slate-400 mt-1">Prevents repeated duplicate logs when standing near the camera.</p>
              </div>

              <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="set-req-liveness" checked class="rounded text-blue-600 focus:ring-blue-500">
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Require Passive Anti-Spoofing & Liveness Filter</span>
                </label>
              </div>
            </div>

          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
              Save Configuration Changes
            </button>
          </div>
        </form>
      </div>

      <!-- Tab 2: Language & Appearance -->
      <div id="tab-content-localization" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-1 border-b border-slate-100 dark:border-slate-700">
            Language, Localization & Theme Customization
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Language Selection -->
            <div class="space-y-3">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Select Interface Language</label>
              <select id="pref-language" onchange="window.saveLanguagePref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500 font-medium">
                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇺🇸 English (Default)</option>
                <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>🇮🇳 हिन्दी (Hindi)</option>
                <option value="te" ${currentLang === 'te' ? 'selected' : ''}>🇮🇳 తెలుగు (Telugu)</option>
                <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español (Spanish)</option>
                <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français (French)</option>
                <option value="de" ${currentLang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch (German)</option>
              </select>
              <p class="text-[11px] text-slate-400">Controls dashboard labels, table headers, and status badges.</p>
            </div>

            <!-- Date Format -->
            <div class="space-y-3">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Date Display Format</label>
              <select id="pref-date-format" onchange="window.saveDateFormatPref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500 font-mono">
                <option value="DD/MM/YYYY" ${currentDateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY (e.g. 31/08/2026)</option>
                <option value="YYYY-MM-DD" ${currentDateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD (e.g. 2026-08-31)</option>
                <option value="MM/DD/YYYY" ${currentDateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY (e.g. 08/31/2026)</option>
              </select>
            </div>

            <!-- Timezone Preference -->
            <div class="space-y-3">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Timezone Preference</label>
              <select id="pref-timezone" onchange="window.saveTimezonePref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500 font-mono">
                <option value="Asia/Kolkata" ${currentTimezone === 'Asia/Kolkata' ? 'selected' : ''}>Asia/Kolkata (IST +05:30)</option>
                <option value="UTC" ${currentTimezone === 'UTC' ? 'selected' : ''}>UTC (GMT +00:00)</option>
                <option value="America/New_York" ${currentTimezone === 'America/New_York' ? 'selected' : ''}>America/New_York (EST -05:00)</option>
                <option value="Europe/London" ${currentTimezone === 'Europe/London' ? 'selected' : ''}>Europe/London (BST +01:00)</option>
                <option value="Asia/Dubai" ${currentTimezone === 'Asia/Dubai' ? 'selected' : ''}>Asia/Dubai (GST +04:00)</option>
                <option value="Asia/Singapore" ${currentTimezone === 'Asia/Singapore' ? 'selected' : ''}>Asia/Singapore (SGT +08:00)</option>
              </select>
            </div>

            <!-- Theme Mode -->
            <div class="space-y-3">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Interface Theme</label>
              <div class="grid grid-cols-2 gap-3">
                <button type="button" onclick="window.setThemeMode('dark')" class="p-3 rounded-2xl border ${currentTheme === 'dark' ? 'border-blue-600 bg-blue-50/10 text-blue-500' : 'border-slate-200 dark:border-slate-700'} text-xs font-bold flex items-center justify-center gap-2">
                  <span>🌙 Dark Mode</span>
                </button>
                <button type="button" onclick="window.setThemeMode('light')" class="p-3 rounded-2xl border ${currentTheme === 'light' ? 'border-blue-600 bg-blue-50/10 text-blue-500' : 'border-slate-200 dark:border-slate-700'} text-xs font-bold flex items-center justify-center gap-2">
                  <span>☀️ Light Mode</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Tab 3: Admin Sign In & Session -->
      <div id="tab-content-account" class="hidden space-y-6">
        <div class="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base">Administrator Sign In & Session</h3>
              <p class="text-xs text-slate-500">Authenticate to modify attendance records or manage administrative roles.</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${user ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}">
              ${user ? 'Authenticated' : 'Not Signed In'}
            </span>
          </div>

          ${user ? `
            <div class="space-y-4">
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/25">
                    ${user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-slate-100 text-sm">${user.full_name || user.username}</h4>
                    <p class="text-xs text-slate-400">@${user.username} &bull; <span class="text-blue-500 font-semibold uppercase">${user.role}</span></p>
                  </div>
                </div>
                <button onclick="window.handleLogout()" class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 transition-all">
                  Sign Out
                </button>
              </div>

              <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div class="font-bold text-blue-700 dark:text-blue-300">Active Permissions:</div>
                <p>&bull; Full attendance records modification & manual check-in override</p>
                <p>&bull; Right-to-be-forgotten biometric erasure</p>
                <p>&bull; Department shifts & user account creation</p>
              </div>
            </div>
          ` : `
            <form id="settings-inline-login" onsubmit="window.handleSettingsLogin(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Username</label>
                <input type="text" id="set-login-username" value="avivek" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input type="password" id="set-login-password" value="avivek1259" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                <p class="text-[11px] text-slate-400 mt-1">Credentials: <code class="font-mono text-blue-600">avivek / avivek1259</code></p>
              </div>

              <button type="submit" id="btn-settings-login" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
                Sign In as Administrator
              </button>
            </form>
          `}
        </div>
      </div>

      <!-- Tab 4: Departments -->
      <div id="tab-content-departments" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Department & Shift Schedule Management</h3>
            <button onclick="window.openDeptModal()" class="px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-all">
              + Add Department
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase">
                <tr>
                  <th class="px-4 py-3">Code</th>
                  <th class="px-4 py-3">Department Name</th>
                  <th class="px-4 py-3">Shift Start</th>
                  <th class="px-4 py-3">Late Grace</th>
                  <th class="px-4 py-3">Shift End</th>
                  <th class="px-4 py-3">Members</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="dept-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr><td colspan="7" class="py-8 text-center text-slate-400">Loading departments...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 5: Users -->
      <div id="tab-content-users" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Administrative Users & Attendance Officers</h3>
            <button onclick="window.openUserModal()" class="px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-all">
              + Create User Account
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase">
                <tr>
                  <th class="px-4 py-3">Username</th>
                  <th class="px-4 py-3">Full Name</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Role</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Last Login</th>
                </tr>
              </thead>
              <tbody id="users-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr><td colspan="6" class="py-8 text-center text-slate-400">Loading user accounts...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 6: Audit Logs -->
      <div id="tab-content-audit" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Security & Compliance Audit Trail</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase">
                <tr>
                  <th class="px-4 py-3">Timestamp</th>
                  <th class="px-4 py-3">Action</th>
                  <th class="px-4 py-3">Actor</th>
                  <th class="px-4 py-3">Target</th>
                  <th class="px-4 py-3">Details</th>
                  <th class="px-4 py-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody id="audit-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr><td colspan="6" class="py-8 text-center text-slate-400">Loading audit logs...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Department Modal -->
    <div id="dept-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center hidden p-4">
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Add Department / Shift Schedule</h3>
          <button onclick="window.closeDeptModal()" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <form id="create-dept-form" onsubmit="window.saveDepartment(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold mb-1">Department Name *</label>
            <input type="text" id="dept-name" required placeholder="e.g. Mechanical Engineering" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Department Code *</label>
            <input type="text" id="dept-code" required placeholder="e.g. MECH" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs uppercase font-mono">
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-xs font-semibold mb-1">Shift Start</label>
              <input type="time" id="dept-start" value="09:00" class="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Grace (min)</label>
              <input type="number" id="dept-grace" value="15" class="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Shift End</label>
              <input type="time" id="dept-end" value="17:00" class="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="window.closeDeptModal()" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-semibold rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">Create Department</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create User Modal -->
    <div id="user-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center hidden p-4">
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Create Administrative Account</h3>
          <button onclick="window.closeUserModal()" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <form id="create-user-form" onsubmit="window.saveUser(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold mb-1">Username *</label>
            <input type="text" id="new-user-username" required placeholder="e.g. officer_cse" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Full Name *</label>
            <input type="text" id="new-user-name" required placeholder="e.g. Faculty Incharge" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Email *</label>
            <input type="email" id="new-user-email" required placeholder="e.g. incharge@vardhaman.org" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Password *</label>
            <input type="password" id="new-user-password" required placeholder="••••••••" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Role</label>
            <select id="new-user-role" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border text-xs">
              <option value="ATTENDANCE_OFFICER">Attendance Officer</option>
              <option value="SUPER_ADMIN">Super Administrator</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="window.closeUserModal()" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-semibold rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await loadAdminSettings();
};

window.switchAdminTab = async function(tab) {
  ["settings", "localization", "account", "departments", "users", "audit"].forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const content = document.getElementById(`tab-content-${t}`);
    if (btn && content) {
      if (t === tab) {
        btn.className = "pb-3 border-b-2 border-blue-600 text-blue-600 font-bold shrink-0";
        content.classList.remove("hidden");
      } else {
        btn.className = "pb-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0";
        content.classList.add("hidden");
      }
    }
  });

  if (tab === "departments") await loadDepartmentsTable();
  if (tab === "users") await loadUsersTable();
  if (tab === "audit") await loadAuditTable();
};

async function loadAdminSettings() {
  try {
    const s = await api.getSettings().catch(() => ({}));
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };
    setVal("set-org-name", s.organization_name || "Vardhaman College of Engineering");
    setVal("set-start-time", s.standard_work_start || "09:00");
    setVal("set-grace-mins", s.late_grace_minutes !== undefined ? s.late_grace_minutes : 15);
    setVal("set-end-time", s.standard_work_end || "17:00");
    setVal("set-sim-threshold", s.face_similarity_threshold !== undefined ? s.face_similarity_threshold : 0.68);
    const labelSim = document.getElementById("label-sim-val");
    if (labelSim) labelSim.innerText = `${Math.round((s.face_similarity_threshold || 0.68) * 100)}%`;
    setVal("set-cooldown-mins", s.duplicate_cooldown_minutes !== undefined ? s.duplicate_cooldown_minutes : 15);
    const chkLive = document.getElementById("set-req-liveness");
    if (chkLive) chkLive.checked = s.require_liveness_check !== false;
  } catch (err) {
    console.warn("Could not load settings:", err);
  }
}

window.saveSettings = async function(e) {
  e.preventDefault();
  try {
    const payload = {
      organization_name: document.getElementById("set-org-name").value,
      standard_work_start: document.getElementById("set-start-time").value,
      late_grace_minutes: parseInt(document.getElementById("set-grace-mins").value),
      standard_work_end: document.getElementById("set-end-time").value,
      face_similarity_threshold: parseFloat(document.getElementById("set-sim-threshold").value),
      duplicate_cooldown_minutes: parseInt(document.getElementById("set-cooldown-mins").value),
      require_liveness_check: document.getElementById("set-req-liveness").checked
    };

    await api.updateSettings(payload);
    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    showToast("System configuration updated successfully", "success");
  } catch (err) {
    showToast(err.message || "Failed to update settings", "error");
  }
};

window.saveLanguagePref = function(lang) {
  localStorage.setItem("facesync_lang", lang);
  showToast(`Language preference set to '${lang.toUpperCase()}'.`, "success");
};

window.saveDateFormatPref = function(fmt) {
  localStorage.setItem("facesync_date_fmt", fmt);
  showToast(`Date display format updated to ${fmt}.`, "info");
};

window.saveTimezonePref = function(tz) {
  localStorage.setItem("facesync_tz", tz);
  showToast(`Timezone preference set to ${tz}.`, "info");
};

window.setThemeMode = function(mode) {
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("facesync_theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("facesync_theme", "light");
  }
  showToast(`Switched to ${mode} mode`, "info");
  window.renderAdminView();
  window.switchAdminTab("localization");
};

window.downloadDatabaseBackup = function() {
  showToast("Preparing database backup download...", "info", 2000);
  window.location.href = "/api/settings/backup-database";
};

window.handleSettingsLogin = async function(e) {
  e.preventDefault();
  const u = document.getElementById("set-login-username").value.trim();
  const p = document.getElementById("set-login-password").value;
  const btn = document.getElementById("btn-settings-login");

  if (btn) btn.innerText = "Authenticating...";

  try {
    const res = await api.login(u, p);
    api.setSession(res.access_token, {
      username: res.username,
      full_name: res.full_name,
      role: res.role
    });

    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    showToast(`Signed in successfully as ${res.full_name}!`, "success");
    window.updateAuthUI();
    await window.renderAdminView();
    await window.switchAdminTab("account");
  } catch (err) {
    showToast(err.message || "Invalid credentials", "error");
    if (btn) btn.innerText = "Sign In as Administrator";
  }
};

async function loadDepartmentsTable() {
  const tbody = document.getElementById("dept-table-rows");
  if (!tbody) return;

  try {
    const depts = await api.getDepartments();
    if (!depts || depts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">No departments configured</td></tr>`;
      return;
    }
    tbody.innerHTML = depts.map(d => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
        <td class="px-4 py-3 font-mono font-bold text-blue-600">${d.code}</td>
        <td class="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">${d.name}</td>
        <td class="px-4 py-3 font-mono">${d.shift_start_time}</td>
        <td class="px-4 py-3 font-mono">${d.shift_late_threshold_mins} mins</td>
        <td class="px-4 py-3 font-mono">${d.shift_end_time}</td>
        <td class="px-4 py-3 font-semibold">${d.member_count} people</td>
        <td class="px-4 py-3 text-right">
          <button onclick="window.deleteDept(${d.id})" class="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Could not load departments</td></tr>`;
  }
}

async function loadUsersTable() {
  const tbody = document.getElementById("users-table-rows");
  if (!tbody) return;

  try {
    const users = await api.getUsers();
    if (!users || users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">No users found</td></tr>`;
      return;
    }
    tbody.innerHTML = users.map(u => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
        <td class="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">${u.username}</td>
        <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">${u.full_name}</td>
        <td class="px-4 py-3 text-slate-500">${u.email}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">${u.role}</span></td>
        <td class="px-4 py-3"><span class="text-emerald-600 font-bold">Active</span></td>
        <td class="px-4 py-3 font-mono text-slate-400">${u.last_login ? new Date(u.last_login).toLocaleString() : 'Recently'}</td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Admin authentication required to view users</td></tr>`;
  }
}

async function loadAuditTable() {
  const tbody = document.getElementById("audit-table-rows");
  if (!tbody) return;

  try {
    const logs = await api.getAuditLogs(40);
    if (!logs || logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">No audit logs recorded</td></tr>`;
      return;
    }
    tbody.innerHTML = logs.map(l => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 font-mono text-[11px]">
        <td class="px-4 py-2.5 text-slate-400">${new Date(l.timestamp).toLocaleString()}</td>
        <td class="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">${l.action}</td>
        <td class="px-4 py-2.5 text-slate-700 dark:text-slate-200">${l.username}</td>
        <td class="px-4 py-2.5 text-slate-500">${l.target_type || '-'} #${l.target_id || ''}</td>
        <td class="px-4 py-2.5 text-slate-600 dark:text-slate-300 truncate max-w-xs font-sans">${l.details || ''}</td>
        <td class="px-4 py-2.5 text-right text-slate-400">${l.ip_address}</td>
      </tr>
    `).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Admin login required to view audit logs</td></tr>`;
  }
}

window.seedSystemDemoData = async function() {
  if (!confirm("Populate realistic demonstration departments, personnel, and historical attendance records?")) return;

  showToast("Seeding realistic sample data...", "info", 3000);
  try {
    const res = await api.seedSampleData();
    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    showToast(res.message || "Sample data populated successfully!", "success", 5000);
    setTimeout(() => {
      window.navigateTo("dashboard");
    }, 1000);
  } catch (e) {
    showToast(e.message || "Failed to seed demo data", "error");
  }
};

window.openDeptModal = function() {
  document.getElementById("dept-modal")?.classList.remove("hidden");
};
window.closeDeptModal = function() {
  document.getElementById("dept-modal")?.classList.add("hidden");
};

window.openUserModal = function() {
  document.getElementById("user-modal")?.classList.remove("hidden");
};
window.closeUserModal = function() {
  document.getElementById("user-modal")?.classList.add("hidden");
};

window.saveDepartment = async function(e) {
  e.preventDefault();
  const name = document.getElementById("dept-name").value;
  const code = document.getElementById("dept-code").value;
  const start = document.getElementById("dept-start").value;
  const grace = parseInt(document.getElementById("dept-grace").value);
  const end = document.getElementById("dept-end").value;

  try {
    await api.createDepartment({
      name, code, shift_start_time: start, shift_late_threshold_mins: grace, shift_end_time: end
    });
    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    showToast(`Created department '${name}'`, "success");
    window.closeDeptModal();
    await loadDepartmentsTable();
  } catch (err) {
    showToast(err.message || "Failed to create department", "error");
  }
};

window.saveUser = async function(e) {
  e.preventDefault();
  const username = document.getElementById("new-user-username").value.trim();
  const full_name = document.getElementById("new-user-name").value.trim();
  const email = document.getElementById("new-user-email").value.trim();
  const password = document.getElementById("new-user-password").value;
  const role = document.getElementById("new-user-role").value;

  try {
    await api.createUser({ username, full_name, email, password, role });
    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    showToast(`Created user account '${username}'`, "success");
    window.closeUserModal();
    await loadUsersTable();
  } catch (err) {
    showToast(err.message || "Failed to create user account", "error");
  }
};

window.deleteDept = async function(id) {
  if (!confirm("Are you sure you want to delete this department?")) return;
  try {
    await api.deleteDepartment(id);
    showToast("Department deleted", "success");
    await loadDepartmentsTable();
  } catch (e) {
    showToast(e.message || "Failed to delete", "error");
  }
};
