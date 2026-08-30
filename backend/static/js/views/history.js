// Attendance History & Manual Override Component

let currentHistoryFilters = {
  date: "",
  start_date: "",
  end_date: "",
  department_id: "",
  status: "",
  search: ""
};

window.renderHistoryView = async function(container) {
  let departments = [];
  try {
    departments = await api.getDepartments();
  } catch (e) {}

  const deptOptions = departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("");

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Attendance Log History</h2>
          <p class="text-xs text-slate-500">Query, verify, manually log, and audit historical biometric check-ins</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.openManualEntryModal()" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Manual Attendance Entry
          </button>
          <button onclick="window.navigateTo('reports')" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export Reports
          </button>
        </div>
      </div>

      <!-- Filter Controls Panel -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          <!-- Search -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Attendee</label>
            <input type="text" id="hist-filter-search" oninput="window.debounceHistorySearch()" placeholder="Name or ID..." class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
            <input type="date" id="hist-filter-date" onchange="window.applyHistoryFilter()" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
          </div>

          <!-- Department Filter -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
            <select id="hist-filter-dept" onchange="window.applyHistoryFilter()" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments</option>
              ${deptOptions}
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <select id="hist-filter-status" onchange="window.applyHistoryFilter()" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="PRESENT">Present (On-Time)</option>
              <option value="LATE">Late Check-in</option>
              <option value="ABSENT">Absent</option>
              <option value="EXCUSED">Excused</option>
            </select>
          </div>

          <!-- Quick Date Presets -->
          <div class="flex items-end gap-1.5">
            <button onclick="window.setQuickDate('today')" class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all">Today</button>
            <button onclick="window.setQuickDate('7days')" class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all">7 Days</button>
            <button onclick="window.clearHistoryFilters()" class="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-all">Reset</button>
          </div>

        </div>
      </div>

      <!-- History Table -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-700/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th class="px-4 py-3.5">Attendee</th>
                <th class="px-4 py-3.5">Department</th>
                <th class="px-4 py-3.5">Date</th>
                <th class="px-4 py-3.5">Check-In</th>
                <th class="px-4 py-3.5">Check-Out</th>
                <th class="px-4 py-3.5">Status</th>
                <th class="px-4 py-3.5">Confidence</th>
                <th class="px-4 py-3.5">Mode</th>
                <th class="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="history-table-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr><td colspan="9" class="py-12 text-center text-slate-400">Loading attendance history...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Attendance Modal -->
    <div id="edit-attendance-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center hidden p-4">
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Authorized Attendance Override</h3>
          <button onclick="window.closeEditModal()" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>

        <form id="edit-attendance-form" onsubmit="window.saveAttendanceOverride(event)" class="space-y-3">
          <input type="hidden" id="edit-record-id">
          
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendee Name</label>
            <input type="text" id="edit-person-name" disabled class="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-bold">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Override *</label>
            <select id="edit-status" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              <option value="PRESENT">PRESENT (On-Time)</option>
              <option value="LATE">LATE Check-in</option>
              <option value="ABSENT">ABSENT</option>
              <option value="EXCUSED">EXCUSED / Official Duty</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mandatory Override Reason *</label>
            <textarea id="edit-reason" required rows="2" placeholder="e.g. Approved medical leave or system false negative override" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="window.closeEditModal()" class="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md">Save & Audit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manual Check-in Modal -->
    <div id="manual-entry-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center hidden p-4">
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Create Manual Attendance Record</h3>
          <button onclick="window.closeManualModal()" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>

        <form id="manual-entry-form" onsubmit="window.saveManualEntry(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Person *</label>
            <select id="manual-person-id" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              <option value="">-- Choose Registered Person --</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date *</label>
              <input type="date" id="manual-date" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status *</label>
              <select id="manual-status" required class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="EXCUSED">EXCUSED</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Administrative Notes</label>
            <input type="text" id="manual-notes" placeholder="e.g. RFID card fallback or field trip" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="window.closeManualModal()" class="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md">Create Entry</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Set today as default date in manual entry
  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("manual-date").value = todayStr;

  await loadHistory();
};

let histSearchTimer = null;
window.debounceHistorySearch = function() {
  clearTimeout(histSearchTimer);
  histSearchTimer = setTimeout(() => {
    applyHistoryFilter();
  }, 300);
};

window.applyHistoryFilter = async function() {
  currentHistoryFilters.search = document.getElementById("hist-filter-search")?.value || "";
  currentHistoryFilters.date = document.getElementById("hist-filter-date")?.value || "";
  currentHistoryFilters.department_id = document.getElementById("hist-filter-dept")?.value || "";
  currentHistoryFilters.status = document.getElementById("hist-filter-status")?.value || "";
  await loadHistory();
};

window.setQuickDate = function(preset) {
  const dateInput = document.getElementById("hist-filter-date");
  if (!dateInput) return;

  if (preset === "today") {
    dateInput.value = new Date().toISOString().split("T")[0];
  } else if (preset === "7days") {
    dateInput.value = "";
    // Handled in reports or filters
  }
  applyHistoryFilter();
};

window.clearHistoryFilters = function() {
  document.getElementById("hist-filter-search").value = "";
  document.getElementById("hist-filter-date").value = "";
  document.getElementById("hist-filter-dept").value = "";
  document.getElementById("hist-filter-status").value = "";
  currentHistoryFilters = { date: "", start_date: "", end_date: "", department_id: "", status: "", search: "" };
  loadHistory();
};

window.loadHistory = async function() {
  const tbody = document.getElementById("history-table-rows");
  if (!tbody) return;

  try {
    const records = await api.getAttendanceLogs(currentHistoryFilters);

    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="py-12 text-center text-slate-400 text-xs">No attendance records match your filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = records.map(r => {
      const statusBadge = r.status === "PRESENT"
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Present</span>`
        : r.status === "LATE"
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Late</span>`
        : r.status === "EXCUSED"
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Excused</span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">Absent</span>`;

      const checkInFormatted = r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";
      const checkOutFormatted = r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";

      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
          <td class="px-4 py-3">
            <div class="font-bold text-slate-900 dark:text-slate-100">${r.person_name}</div>
            <div class="text-[11px] font-mono text-blue-600">${r.person_identifier}</div>
          </td>
          <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${r.department_name}</td>
          <td class="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">${r.date}</td>
          <td class="px-4 py-3 font-mono">${checkInFormatted}</td>
          <td class="px-4 py-3 font-mono">${checkOutFormatted}</td>
          <td class="px-4 py-3">${statusBadge}</td>
          <td class="px-4 py-3 font-mono font-semibold text-blue-600">${(r.recognition_confidence * 100).toFixed(0)}%</td>
          <td class="px-4 py-3 font-mono text-[10px] text-slate-400">${r.verification_mode}</td>
          <td class="px-4 py-3 text-right space-x-1">
            <button onclick="window.openEditModal(${r.id}, '${r.person_name.replace(/'/g, "\\'")}', '${r.status}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-all">
              Edit
            </button>
            <button onclick="window.deleteHistoryRecord(${r.id})" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-all">
              &times;
            </button>
          </td>
        </tr>
      `;
    }).join("");

  } catch (err) {
    showToast("Failed to query attendance history", "error");
  }
};

window.openEditModal = function(id, name, status) {
  document.getElementById("edit-record-id").value = id;
  document.getElementById("edit-person-name").value = name;
  document.getElementById("edit-status").value = status;
  document.getElementById("edit-reason").value = "";
  document.getElementById("edit-attendance-modal").classList.remove("hidden");
};

window.closeEditModal = function() {
  document.getElementById("edit-attendance-modal").classList.add("hidden");
};

window.saveAttendanceOverride = async function(event) {
  event.preventDefault();
  const id = document.getElementById("edit-record-id").value;
  const status = document.getElementById("edit-status").value;
  const reason = document.getElementById("edit-reason").value.trim();

  if (!reason) {
    showToast("Mandatory override reason is required for audit trail", "warning");
    return;
  }

  try {
    await api.updateAttendance(id, { status, modification_reason: reason });
    soundEffects.playSuccess();
    showToast("Attendance status updated and logged to audit trail", "success");
    window.closeEditModal();
    await window.loadHistory();
  } catch (err) {
    showToast(err.message || "Failed to update record", "error");
  }
};

window.openManualEntryModal = async function() {
  const modal = document.getElementById("manual-entry-modal");
  const select = document.getElementById("manual-person-id");
  if (!modal || !select) return;

  modal.classList.remove("hidden");
  
  // Populate persons dropdown
  try {
    const people = await api.getPersons();
    select.innerHTML = `<option value="">-- Choose Registered Person --</option>` + 
      people.map(p => `<option value="${p.id}">${p.full_name} (${p.identifier})</option>`).join("");
  } catch (e) {}
};

window.closeManualModal = function() {
  document.getElementById("manual-entry-modal").classList.add("hidden");
};

window.saveManualEntry = async function(event) {
  event.preventDefault();
  const personId = parseInt(document.getElementById("manual-person-id").value);
  const dateVal = document.getElementById("manual-date").value;
  const status = document.getElementById("manual-status").value;
  const notes = document.getElementById("manual-notes").value.trim();

  if (!personId || !dateVal) {
    showToast("Please choose a person and date", "warning");
    return;
  }

  try {
    await api.manualAttendance({
      person_id: personId,
      date: dateVal,
      status: status,
      notes: notes
    });
    soundEffects.playSuccess();
    showToast("Manual attendance created successfully", "success");
    window.closeManualModal();
    await window.loadHistory();
  } catch (err) {
    showToast(err.message || "Failed to create manual entry", "error");
  }
};

window.deleteHistoryRecord = async function(id) {
  if (!confirm("Are you sure you want to delete this attendance record? This action will be audited.")) return;

  try {
    await api.deleteAttendance(id);
    showToast("Attendance record deleted", "success");
    await window.loadHistory();
  } catch (err) {
    showToast(err.message || "Failed to delete record", "error");
  }
};
