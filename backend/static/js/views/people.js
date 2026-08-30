// People Directory & Detailed Individual Profile Component

let currentPeopleList = [];

window.renderPeopleView = async function(container) {
  let departments = [];
  try {
    departments = await api.getDepartments();
  } catch (e) {}

  const deptOptions = departments.map(d => `
    <option value="${d.id}">${d.name}</option>
  `).join("");

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header & Search Toolbar -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Registered People & Profiles</h2>
          <p class="text-xs text-slate-500">Manage enrolled personnel, biometric credentials, and individual attendance records</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative">
            <input type="text" id="people-search-input" oninput="window.debouncePeopleSearch()" placeholder="Search by name, ID, email..." class="w-64 pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs focus:ring-2 focus:ring-blue-500">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <!-- Department Filter -->
          <select id="people-dept-filter" onchange="window.loadPeople()" class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs font-medium focus:ring-2 focus:ring-blue-500">
            <option value="">All Departments</option>
            ${deptOptions}
          </select>

          <button onclick="window.navigateTo('registration')" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add New Person
          </button>
        </div>
      </div>

      <!-- People Grid Container -->
      <div id="people-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div class="col-span-full py-16 text-center text-slate-400 text-sm">Loading people directory...</div>
      </div>
    </div>

    <!-- Person Profile Drawer / Modal -->
    <div id="profile-drawer" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end hidden transition-opacity">
      <div id="profile-drawer-content" class="w-full max-w-2xl bg-white dark:bg-slate-800 h-full shadow-2xl p-6 overflow-y-auto space-y-6 transform translate-x-full transition-transform duration-300">
        <!-- Injected via openPersonProfile -->
      </div>
    </div>
  `;

  await loadPeople();
};

let peopleSearchTimer = null;
window.debouncePeopleSearch = function() {
  clearTimeout(peopleSearchTimer);
  peopleSearchTimer = setTimeout(() => {
    loadPeople();
  }, 300);
};

window.loadPeople = async function() {
  const search = document.getElementById("people-search-input")?.value || "";
  const deptId = document.getElementById("people-dept-filter")?.value || null;

  try {
    const people = await api.getPersons(search, deptId);
    currentPeopleList = people;
    renderPeopleGrid(people);
  } catch (err) {
    showToast("Failed to load people directory", "error");
  }
};

function renderPeopleGrid(people) {
  const container = document.getElementById("people-cards-grid");
  if (!container) return;

  if (people.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
        <div class="text-4xl">👥</div>
        <h3 class="text-base font-bold text-slate-700 dark:text-slate-200">No Registered People Found</h3>
        <p class="text-xs text-slate-400">Try adjusting your search criteria or register a new profile.</p>
        <button onclick="window.navigateTo('registration')" class="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">Register Now</button>
      </div>
    `;
    return;
  }

  container.innerHTML = people.map(p => {
    const avatar = p.profile_photo_url
      ? `<img src="${p.profile_photo_url}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700">`
      : `<div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">${p.full_name.charAt(0)}</div>`;

    const bioBadge = p.biometric_count > 0
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
           <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${p.biometric_count} Angles Enrolled
         </span>`
      : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200">
           <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> No Face Data
         </span>`;

    return `
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4">
        <div class="flex items-start gap-3.5">
          ${avatar}
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">${p.full_name}</h3>
            <div class="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mt-0.5">${p.identifier}</div>
            <div class="text-[11px] text-slate-400 truncate mt-0.5">${p.designation} &bull; ${p.department_name || 'Unassigned'}</div>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          ${bioBadge}
          <button onclick="window.openPersonProfile(${p.id})" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl transition-all">
            View Profile &rarr;
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.openPersonProfile = async function(id) {
  const drawer = document.getElementById("profile-drawer");
  const content = document.getElementById("profile-drawer-content");
  if (!drawer || !content) return;

  drawer.classList.remove("hidden");
  setTimeout(() => {
    content.classList.remove("translate-x-full");
  }, 20);

  content.innerHTML = `<div class="py-20 text-center text-slate-400 text-xs">Loading profile metrics...</div>`;

  try {
    const profile = await api.getPersonDetail(id);

    const avatar = profile.profile_photo_url
      ? `<img src="${profile.profile_photo_url}" class="w-20 h-20 rounded-3xl object-cover border-4 border-slate-100 shadow-md">`
      : `<div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-3xl shadow-md">${profile.full_name.charAt(0)}</div>`;

    const historyRows = profile.recent_attendance.map(r => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 text-xs">
        <td class="px-3 py-2.5 font-mono text-slate-700 dark:text-slate-300">${r.date}</td>
        <td class="px-3 py-2.5 font-mono">${r.check_in_time}</td>
        <td class="px-3 py-2.5 font-mono">${r.check_out_time}</td>
        <td class="px-3 py-2.5">
          <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
            r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
            r.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
          }">${r.status}</span>
        </td>
        <td class="px-3 py-2.5 text-right font-mono font-semibold text-blue-600">${r.confidence}%</td>
      </tr>
    `).join("") || `<tr><td colspan="5" class="py-6 text-center text-slate-400 text-xs">No attendance recorded</td></tr>`;

    content.innerHTML = `
      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base">Individual Profile & Biometrics</h3>
        </div>
        <button onclick="window.closePersonProfile()" class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Identity Card -->
      <div class="flex items-start gap-4 bg-slate-50 dark:bg-slate-700/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
        ${avatar}
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">${profile.full_name}</h2>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="font-mono text-xs font-bold text-blue-600">${profile.identifier}</span>
            <span class="text-xs text-slate-400">&bull;</span>
            <span class="text-xs text-slate-600 dark:text-slate-300 font-medium">${profile.designation}</span>
          </div>
          <div class="text-xs text-slate-500 mt-1">${profile.department_name || 'Unassigned'}</div>
        </div>
      </div>

      <!-- Summary Statistics KPI Boxes -->
      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="bg-slate-50 dark:bg-slate-700/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div class="text-lg font-bold text-slate-900 dark:text-slate-100">${profile.stats.total_days}</div>
          <div class="text-[10px] text-slate-400 uppercase font-semibold">Total Logs</div>
        </div>
        <div class="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900">
          <div class="text-lg font-bold text-emerald-600">${profile.stats.present_days}</div>
          <div class="text-[10px] text-emerald-600 uppercase font-semibold">On-Time</div>
        </div>
        <div class="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-100 dark:border-amber-900">
          <div class="text-lg font-bold text-amber-600">${profile.stats.late_days}</div>
          <div class="text-[10px] text-amber-600 uppercase font-semibold">Late</div>
        </div>
        <div class="bg-indigo-50/60 dark:bg-indigo-950/30 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900">
          <div class="text-lg font-bold text-indigo-600">${profile.stats.attendance_rate_pct}%</div>
          <div class="text-[10px] text-indigo-600 uppercase font-semibold">Turnout Rate</div>
        </div>
      </div>

      <!-- Biometric Management & Privacy Controls -->
      <div class="bg-slate-50 dark:bg-slate-700/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔐</span>
            <div>
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100">Biometric Credentials & Privacy</h4>
              <p class="text-[11px] text-slate-500">${profile.biometric_count} encrypted face vector(s) active</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">AES-256</span>
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-600">
          <button onclick="window.erasePersonBiometrics(${profile.id}, '${profile.full_name}')" class="flex-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-all">
            Erase Biometric Face Data
          </button>
          <button onclick="window.deletePersonRecord(${profile.id}, '${profile.full_name}')" class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all">
            Delete Profile
          </button>
        </div>
      </div>

      <!-- Recent Attendance History Table -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Recent Attendance Logs</h4>
        <div class="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-700">
          <table class="w-full text-left">
            <thead class="bg-slate-100 dark:bg-slate-700 text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">In</th>
                <th class="px-3 py-2">Out</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              ${historyRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

  } catch (err) {
    showToast("Failed to load individual profile details", "error");
  }
};

window.closePersonProfile = function() {
  const drawer = document.getElementById("profile-drawer");
  const content = document.getElementById("profile-drawer-content");
  if (content) content.classList.add("translate-x-full");
  setTimeout(() => {
    if (drawer) drawer.classList.add("hidden");
  }, 300);
};

window.erasePersonBiometrics = async function(id, name) {
  if (!confirm(`Are you sure you want to permanently delete all encrypted biometric facial vectors for ${name}? The person will no longer be recognized by the camera until re-enrolled.`)) {
    return;
  }

  try {
    const res = await api.eraseBiometrics(id);
    soundEffects.playSuccess();
    showToast(res.message, "success");
    await window.openPersonProfile(id);
    await window.loadPeople();
  } catch (e) {
    showToast(e.message || "Failed to purge biometric data", "error");
  }
};

window.deletePersonRecord = async function(id, name) {
  if (!confirm(`Are you sure you want to completely delete ${name} and their records from the system?`)) {
    return;
  }

  try {
    await api.deletePerson(id);
    showToast(`Deleted ${name}`, "success");
    window.closePersonProfile();
    await window.loadPeople();
  } catch (e) {
    showToast(e.message || "Failed to delete profile", "error");
  }
};
