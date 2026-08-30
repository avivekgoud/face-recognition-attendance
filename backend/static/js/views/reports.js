// Reports & Data Export Center Component

window.renderReportsView = async function(container) {
  let departments = [];
  try {
    departments = await api.getDepartments();
  } catch (e) {}

  const deptOptions = departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("");

  const todayStr = new Date().toISOString().split("T")[0];
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div class="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Enterprise Compliance & Reporting</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Attendance Report Generator</h2>
        <p class="text-xs text-slate-500 mt-1">Export official filtered attendance logs formatted for HR payroll, academic grading, or administrative audits.</p>
      </div>

      <!-- Export Configuration Card -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
        <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-2 border-b border-slate-100 dark:border-slate-700">
          1. Select Filter Criteria
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
            <input type="date" id="rep-start-date" value="${lastMonth}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
            <input type="date" id="rep-end-date" value="${todayStr}" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Class Filter</label>
            <select id="rep-department" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments & Classes</option>
              ${deptOptions}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Filter</label>
            <select id="rep-status" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
              <option value="">All Attendance Statuses</option>
              <option value="PRESENT">Present (On-Time Only)</option>
              <option value="LATE">Late Only</option>
              <option value="ABSENT">Absent Only</option>
              <option value="EXCUSED">Excused Only</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Keyword Search (Optional)</label>
          <input type="text" id="rep-search" placeholder="Filter by person name or ID..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Export Format Options Grid -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">2. Choose Export Format & Download</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Excel Card -->
            <div onclick="window.triggerExport('excel')" class="cursor-pointer bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 hover:shadow-lg transition-all text-center space-y-2">
              <div class="text-3xl">📊</div>
              <div class="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Excel (.xlsx)</div>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-300">Formatted with KPI badges, styled headers, and auto-filters</p>
              <button type="button" class="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs">
                Download Excel
              </button>
            </div>

            <!-- PDF Card -->
            <div onclick="window.triggerExport('pdf')" class="cursor-pointer bg-rose-50/60 dark:bg-rose-950/30 p-5 rounded-2xl border-2 border-rose-200 dark:border-rose-800 hover:border-rose-500 hover:shadow-lg transition-all text-center space-y-2">
              <div class="text-3xl">📄</div>
              <div class="font-bold text-rose-900 dark:text-rose-200 text-sm">Official PDF Document</div>
              <p class="text-[11px] text-rose-700 dark:text-rose-300">Printable landscape document with org header & summary metrics</p>
              <button type="button" class="mt-2 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs">
                Download PDF
              </button>
            </div>

            <!-- CSV Card -->
            <div onclick="window.triggerExport('csv')" class="cursor-pointer bg-blue-50/60 dark:bg-blue-950/30 p-5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 hover:shadow-lg transition-all text-center space-y-2">
              <div class="text-3xl">📑</div>
              <div class="font-bold text-blue-900 dark:text-blue-200 text-sm">Raw CSV</div>
              <p class="text-[11px] text-blue-700 dark:text-blue-300">Universal comma-separated format for custom database imports</p>
              <button type="button" class="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs">
                Download CSV
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
};

window.triggerExport = async function(format) {
  const startDate = document.getElementById("rep-start-date")?.value || "";
  const endDate = document.getElementById("rep-end-date")?.value || "";
  const deptId = document.getElementById("rep-department")?.value || "";
  const status = document.getElementById("rep-status")?.value || "";
  const search = document.getElementById("rep-search")?.value || "";

  showToast(`Generating ${format.toUpperCase()} report...`, "info", 3000);

  try {
    await api.downloadReport(format, {
      start_date: startDate,
      end_date: endDate,
      department_id: deptId,
      status: status,
      search: search
    });
    soundEffects.playSuccess();
    showToast(`Attendance ${format.toUpperCase()} downloaded successfully!`, "success");
  } catch (err) {
    showToast(err.message || "Failed to download report", "error");
  }
};
