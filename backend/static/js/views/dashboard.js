// Dashboard View Component

window.renderDashboardView = async function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header Banner & Quick Actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div>
          <div class="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Live Attendance System Active
          </div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Attendance Intelligence Hub</h1>
          <p class="text-blue-100 text-sm mt-1">Real-time facial biometric check-ins, automated shifts, and attendance insights.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button onclick="window.navigateTo('live')" class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Open Live Camera Kiosk
          </button>
          <button onclick="window.navigateTo('registration')" class="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-medium rounded-xl border border-white/20 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            Register New Face
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div id="kpi-cards-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Skeleton Loaders -->
        <div class="animate-pulse bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-28"></div>
        <div class="animate-pulse bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-28"></div>
        <div class="animate-pulse bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-28"></div>
        <div class="animate-pulse bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-28"></div>
        <div class="animate-pulse bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-28"></div>
      </div>

      <!-- Main Visualizations Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Daily Attendance Trend Chart (2 cols) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Attendance Trends</h3>
              <p class="text-xs text-slate-500">Daily breakdown of Present, Late, and Absent rates</p>
            </div>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg text-xs">
              <button onclick="window.updateTrendRange(7)" id="btn-trend-7" class="px-2.5 py-1 rounded-md font-medium bg-white dark:bg-slate-600 shadow-xs text-slate-800 dark:text-slate-100">7 Days</button>
              <button onclick="window.updateTrendRange(14)" id="btn-trend-14" class="px-2.5 py-1 rounded-md font-medium text-slate-600 dark:text-slate-300">14 Days</button>
              <button onclick="window.updateTrendRange(30)" id="btn-trend-30" class="px-2.5 py-1 rounded-md font-medium text-slate-600 dark:text-slate-300">30 Days</button>
            </div>
          </div>
          <div class="relative h-64 w-full">
            <canvas id="trendChart"></canvas>
          </div>
        </div>

        <!-- Department Breakdown (1 col) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="mb-4">
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Department Overview</h3>
            <p class="text-xs text-slate-500">Today's attendance rate by department / class</p>
          </div>
          <div class="relative h-56 w-full flex items-center justify-center">
            <canvas id="deptChart"></canvas>
          </div>
          <div id="dept-legend-list" class="mt-4 space-y-2 text-xs max-h-28 overflow-y-auto pr-1"></div>
        </div>
      </div>

      <!-- Bottom Row: Hourly Distribution + Live Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Peak Check-in Hours (1 col) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Hourly Distribution</h3>
              <p class="text-xs text-slate-500">Peak check-in arrival times today</p>
            </div>
          </div>
          <div class="relative h-56 w-full">
            <canvas id="hourlyChart"></canvas>
          </div>
        </div>

        <!-- Real-Time Activity Feed (2 cols) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Recent Attendance Stream</h3>
                <p class="text-xs text-slate-500">Live feed of verified face recognitions and scans</p>
              </div>
            </div>
            <button onclick="window.navigateTo('history')" class="text-xs text-blue-600 hover:text-blue-700 font-medium">View Full History &rarr;</button>
          </div>

          <div id="recent-activity-table-container" class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 rounded-l-lg">Person</th>
                  <th class="px-4 py-3">Department</th>
                  <th class="px-4 py-3">Time</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 text-right rounded-r-lg">Confidence</th>
                </tr>
              </thead>
              <tbody id="recent-activity-rows" class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr><td colspan="5" class="py-6 text-center text-slate-400 text-xs">Loading activity feed...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Fetch & Populate Dashboard Data
  await loadDashboardData();
};

let activeTrendChart = null;
let activeDeptChart = null;
let activeHourlyChart = null;

async function loadDashboardData() {
  try {
    const [stats, deptStats, hourlyStats, recent] = await Promise.all([
      api.getDashboardStats(),
      api.getDepartmentStats(),
      api.getHourlyStats(),
      api.getRecentActivity(8)
    ]);

    // 1. Render KPI Cards
    const kpiContainer = document.getElementById("kpi-cards-grid");
    if (kpiContainer) {
      kpiContainer.innerHTML = `
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Registered</span>
            <div class="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-bold text-slate-900 dark:text-slate-50">${stats.total_registered}</span>
            <span class="text-xs text-slate-400 ml-1">Profiles</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Present Today</span>
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${stats.present_today}</span>
            <span class="text-xs text-slate-400 ml-1">On-Time</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400 tracking-wider">Late Today</span>
            <div class="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-bold text-amber-600 dark:text-amber-400">${stats.late_today}</span>
            <span class="text-xs text-slate-400 ml-1">After Grace</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-rose-600 dark:text-rose-400 tracking-wider">Absent Today</span>
            <div class="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-bold text-rose-600 dark:text-rose-400">${stats.absent_today}</span>
            <span class="text-xs text-slate-400 ml-1">Unrecorded</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Attendance %</span>
            <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${stats.attendance_rate_today}%</span>
            <span class="text-xs text-slate-400 ml-1">Turnout</span>
          </div>
        </div>
      `;
    }

    // 2. Render Trend Chart
    await renderTrendChart(7);

    // 3. Render Department Chart
    renderDepartmentChart(deptStats);

    // 4. Render Hourly Chart
    renderHourlyChart(hourlyStats);

    // 5. Render Recent Activity Table
    renderRecentTable(recent);

  } catch (err) {
    console.error("Dashboard load failed", err);
    showToast("Failed to load dashboard statistics", "error");
  }
}

async function renderTrendChart(days) {
  const trendData = await api.getDashboardTrend(days);
  const ctx = document.getElementById("trendChart")?.getContext("2d");
  if (!ctx) return;

  if (activeTrendChart) {
    activeTrendChart.destroy();
  }

  const labels = trendData.map(d => `${d.day_name} (${d.date})`);
  const presentData = trendData.map(d => d.present);
  const lateData = trendData.map(d => d.late);
  const absentData = trendData.map(d => d.absent);

  activeTrendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Present (On-Time)',
          data: presentData,
          backgroundColor: '#10b981',
          borderRadius: 4,
          stack: 'attendance'
        },
        {
          label: 'Late Check-in',
          data: lateData,
          backgroundColor: '#f59e0b',
          borderRadius: 4,
          stack: 'attendance'
        },
        {
          label: 'Absent',
          data: absentData,
          backgroundColor: '#ef4444',
          borderRadius: 4,
          stack: 'attendance'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: { padding: 10, cornerRadius: 8 }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1 } }
      }
    }
  });
}

window.updateTrendRange = async function(days) {
  [7, 14, 30].forEach(d => {
    const btn = document.getElementById(`btn-trend-${d}`);
    if (btn) {
      if (d === days) {
        btn.className = "px-2.5 py-1 rounded-md font-medium bg-white dark:bg-slate-600 shadow-xs text-slate-800 dark:text-slate-100";
      } else {
        btn.className = "px-2.5 py-1 rounded-md font-medium text-slate-600 dark:text-slate-300";
      }
    }
  });
  await renderTrendChart(days);
};

function renderDepartmentChart(depts) {
  const ctx = document.getElementById("deptChart")?.getContext("2d");
  if (!ctx) return;

  if (activeDeptChart) {
    activeDeptChart.destroy();
  }

  const labels = depts.map(d => d.department_name);
  const dataValues = depts.map(d => d.present_count + d.late_count);
  const bgColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  activeDeptChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues.length ? dataValues : [1],
        backgroundColor: bgColors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false }
      }
    }
  });

  const legendList = document.getElementById("dept-legend-list");
  if (legendList) {
    legendList.innerHTML = depts.map((d, i) => `
      <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <div class="flex items-center gap-2 truncate pr-2">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${bgColors[i % bgColors.length]}"></span>
          <span class="truncate">${d.department_name}</span>
        </div>
        <span class="font-semibold text-slate-800 dark:text-slate-100">${d.rate_pct}%</span>
      </div>
    `).join("") || `<p class="text-slate-400 text-center">No department data</p>`;
  }
}

function renderHourlyChart(hourlyData) {
  const ctx = document.getElementById("hourlyChart")?.getContext("2d");
  if (!ctx) return;

  if (activeHourlyChart) {
    activeHourlyChart.destroy();
  }

  const labels = hourlyData.map(h => h.hour);
  const values = hourlyData.map(h => h.count);

  activeHourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Check-ins',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1 } }
      }
    }
  });
}

function renderRecentTable(items) {
  const tbody = document.getElementById("recent-activity-rows");
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400 text-sm">No recognition activity recorded yet today.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const statusBadge = item.status === "PRESENT"
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Present</span>`
      : item.status === "LATE"
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Late</span>`
      : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">Absent</span>`;

    const avatar = item.profile_photo_url 
      ? `<img src="${item.profile_photo_url}" class="w-8 h-8 rounded-full object-cover border border-slate-200">`
      : `<div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">${item.person_name.charAt(0)}</div>`;

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
        <td class="px-4 py-3 flex items-center gap-3">
          ${avatar}
          <div>
            <div class="font-medium text-slate-900 dark:text-slate-100">${item.person_name}</div>
            <div class="text-xs text-slate-400">${item.identifier}</div>
          </div>
        </td>
        <td class="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">${item.department_name}</td>
        <td class="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs font-mono">${item.check_in_time}</td>
        <td class="px-4 py-3">${statusBadge}</td>
        <td class="px-4 py-3 text-right text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
          ${item.confidence > 0 ? `${item.confidence}%` : '--'}
        </td>
      </tr>
    `;
  }).join("");
}
