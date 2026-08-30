// Admin Panel & System Settings Component

window.renderAdminView = async function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Admin Header -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <span>Administration & System Controls</span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">System Configuration & Security</h2>
          <p class="text-xs text-slate-500">Fine-tune facial recognition sensitivity, shifts, administrative roles, and compliance audit trail</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.seedSystemDemoData()" class="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Seed Demo Data & Profiles
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 dark:border-slate-700 gap-6 text-sm font-semibold">
        <button onclick="window.switchAdminTab('settings')" id="tab-btn-settings" class="pb-3 border-b-2 border-blue-600 text-blue-600">
          Attendance & Recognition Settings
        </button>
        <button onclick="window.switchAdminTab('departments')" id="tab-btn-departments" class="pb-3 text-slate-500 hover:text-slate-700">
          Departments & Shifts
        </button>
        <button onclick="window.switchAdminTab('users')" id="tab-btn-users" class="pb-3 text-slate-500 hover:text-slate-700">
          User & Officer Accounts
        </button>
        <button onclick="window.switchAdminTab('audit')" id="tab-btn-audit" class="pb-3 text-slate-500 hover:text-slate-700">
          Security & Audit Logs
        </button>
      </div>

      <!-- Tab 1: System Settings -->
      <div id="tab-content-settings" class="space-y-6">
        <form id="settings-form" onsubmit="window.saveSettings(event)" class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- General Organization Info -->
            <div class="space-y-4">
              <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-1 border-b border-slate-100 dark:border-slate-700">
                Organization & General Policy
              </h3>
              
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization Name</label>
                <input type="text" id="set-org-name" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Start Time</label>
                  <input type="time" id="set-start-time" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Late Grace (Minutes)</label>
                  <input type="number" id="set-grace-mins" min="0" max="60" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Shift End Time</label>
                <input type="time" id="set-end-time" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <!-- Face Biometrics Sensitivity & Safeguards -->
            <div class="space-y-4">
              <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-1 border-b border-slate-100 dark:border-slate-700">
                Facial Biometrics & Anti-Spoofing
              </h3>

              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-semibold text-slate-700 dark:text-slate-300">Face Similarity Threshold:</span>
                  <span id="label-sim-val" class="font-mono font-bold text-blue-600">68%</span>
                </div>
                <input type="range" id="set-sim-threshold" min="0.50" max="0.95" step="0.01" oninput="document.getElementById('label-sim-val').innerText = `${Math.round(this.value * 100)}%`" class="w-full">
                <p class="text-[11px] text-slate-400 mt-1">Higher threshold prevents false positives; standard recommendation is 65%-72%.</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duplicate Check-in Cooldown (Minutes)</label>
                <input type="number" id="set-cooldown-mins" min="1" max="120" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                <p class="text-[11px] text-slate-400 mt-1">Prevents repeated duplicate logs when standing in front of the kiosk.</p>
              </div>

              <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="set-req-liveness" checked class="rounded text-blue-600 focus:ring-blue-500">
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Require Passive Anti-Spoofing / Texture Liveness</span>
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

      <!-- Tab 2: Departments -->
      <div id="tab-content-departments" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Department & Shift Schedule Management</h3>
            <button onclick="window.openDeptModal()" class="px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
              + Add Department
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-700 text-slate-500 uppercase">
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
              <tbody id="dept-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 3: Users -->
      <div id="tab-content-users" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Administrative Users & Attendance Officers</h3>
            <button onclick="window.openUserModal()" class="px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
              + Create User Account
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-700 text-slate-500 uppercase">
                <tr>
                  <th class="px-4 py-3">Username</th>
                  <th class="px-4 py-3">Full Name</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Role</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Last Login</th>
                </tr>
              </thead>
              <tbody id="users-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 4: Audit Logs -->
      <div id="tab-content-audit" class="hidden space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Security & Compliance Audit Trail</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-700 text-slate-500 uppercase">
                <tr>
                  <th class="px-4 py-3">Timestamp</th>
                  <th class="px-4 py-3">Action</th>
                  <th class="px-4 py-3">Actor</th>
                  <th class="px-4 py-3">Target</th>
                  <th class="px-4 py-3">Details</th>
                  <th class="px-4 py-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody id="audit-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Department Modal -->
    <div id="dept-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center hidden p-4">
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Add Department / Class</h3>
          <button onclick="window.closeDeptModal()" class="text-slate-400">&times;</button>
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
            <button type="button" onclick="window.closeDeptModal()" class="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">Create Department</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await loadAdminSettings();
};

window.switchAdminTab = async function(tab) {
  ["settings", "departments", "users", "audit"].forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const content = document.getElementById(`tab-content-${t}`);
    if (btn && content) {
      if (t === tab) {
        btn.className = "pb-3 border-b-2 border-blue-600 text-blue-600 font-bold";
        content.classList.remove("hidden");
      } else {
        btn.className = "pb-3 text-slate-500 hover:text-slate-700";
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
    const s = await api.getSettings();
    document.getElementById("set-org-name").value = s.organization_name;
    document.getElementById("set-start-time").value = s.standard_work_start;
    document.getElementById("set-grace-mins").value = s.late_grace_minutes;
    document.getElementById("set-end-time").value = s.standard_work_end;
    document.getElementById("set-sim-threshold").value = s.face_similarity_threshold;
    document.getElementById("label-sim-val").innerText = `${Math.round(s.face_similarity_threshold * 100)}%`;
    document.getElementById("set-cooldown-mins").value = s.duplicate_cooldown_minutes;
    document.getElementById("set-req-liveness").checked = s.require_liveness_check;
  } catch (err) {
    showToast("Could not load settings", "error");
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
    soundEffects.playSuccess();
    showToast("System configuration updated successfully", "success");
  } catch (err) {
    showToast(err.message || "Failed to update settings", "error");
  }
};

async function loadDepartmentsTable() {
  const tbody = document.getElementById("dept-table-rows");
  if (!tbody) return;

  try {
    const depts = await api.getDepartments();
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
  } catch (e) {}
}

async function loadUsersTable() {
  const tbody = document.getElementById("users-table-rows");
  if (!tbody) return;

  try {
    const users = await api.getUsers();
    tbody.innerHTML = users.map(u => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
        <td class="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">${u.username}</td>
        <td class="px-4 py-3">${u.full_name}</td>
        <td class="px-4 py-3 text-slate-500">${u.email}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">${u.role}</span></td>
        <td class="px-4 py-3"><span class="text-emerald-600 font-bold">Active</span></td>
        <td class="px-4 py-3 font-mono text-slate-400">${u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}</td>
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
    tbody.innerHTML = logs.map(l => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 font-mono text-[11px]">
        <td class="px-4 py-2.5 text-slate-400">${new Date(l.timestamp).toLocaleString()}</td>
        <td class="px-4 py-2.5 font-bold text-indigo-600">${l.action}</td>
        <td class="px-4 py-2.5 text-slate-700 dark:text-slate-200">${l.username}</td>
        <td class="px-4 py-2.5 text-slate-500">${l.target_type || '-'} #${l.target_id || ''}</td>
        <td class="px-4 py-2.5 text-slate-600 dark:text-slate-300 truncate max-w-xs font-sans">${l.details || ''}</td>
        <td class="px-4 py-2.5 text-right text-slate-400">${l.ip_address}</td>
      </tr>
    `).join("") || `<tr><td colspan="6" class="py-6 text-center text-slate-400">No audit logs recorded</td></tr>`;
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Admin login required</td></tr>`;
  }
}

window.seedSystemDemoData = async function() {
  if (!confirm("Populate realistic demonstration departments, personnel, and historical attendance records?")) return;

  showToast("Seeding realistic sample data...", "info", 3000);
  try {
    const res = await api.seedSampleData();
    soundEffects.playSuccess();
    showToast(res.message, "success", 5000);
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
    soundEffects.playSuccess();
    showToast(`Created department '${name}'`, "success");
    window.closeDeptModal();
    await loadDepartmentsTable();
  } catch (err) {
    showToast(err.message || "Failed to create department", "error");
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
