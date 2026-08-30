// Multi-Angle Face Registration Wizard View

let regStream = null;
let capturedAngles = {
  front: null,
  left: null,
  right: null,
  expression: null
};
let currentAngleStep = "front";

const ANGLE_CONFIG = {
  front: { title: "1. Frontal Pose", subtitle: "Look straight into the camera lens with neutral expression", icon: "👤" },
  left: { title: "2. Slight Left Turn", subtitle: "Turn your head approximately 15° to the left", icon: "👈" },
  right: { title: "3. Slight Right Turn", subtitle: "Turn your head approximately 15° to the right", icon: "👉" },
  expression: { title: "4. Expression / Smile", subtitle: "Give a natural gentle smile or normal expression", icon: "😊" }
};

window.renderRegistrationView = async function(container) {
  // Reset state
  capturedAngles = { front: null, left: null, right: null, expression: null };
  currentAngleStep = "front";

  // Fetch departments for dropdown
  let departments = [];
  try {
    departments = await api.getDepartments();
  } catch (e) {
    console.warn("Could not load departments", e);
  }

  const deptOptions = departments.map(d => `
    <option value="${d.id}">${d.name} (${d.code})</option>
  `).join("");

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Title Card -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Biometric Enrollment Center</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Register Person & Face Biometrics</h2>
          <p class="text-xs text-slate-500 mt-1">Multi-angle enrollment ensures >99% recognition accuracy in varying lighting conditions.</p>
        </div>
        <button onclick="window.navigateTo('people')" class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
          &larr; Back to People Directory
        </button>
      </div>

      <form id="person-registration-form" onsubmit="window.handleRegistrationSubmit(event)" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column: Personal Profile Details & Consent (5 cols) -->
          <div class="lg:col-span-5 space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm pb-2 border-b border-slate-100 dark:border-slate-700">
                1. Profile Details
              </h3>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name *</label>
                <input type="text" id="reg-fullname" required placeholder="e.g. Rahul Kumar or Sarah Jenkins" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee / Student ID *</label>
                  <input type="text" id="reg-identifier" required placeholder="EMP-1005 / STU-301" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm uppercase font-mono focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation / Role</label>
                  <input type="text" id="reg-designation" placeholder="e.g. Lead Engineer" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Class *</label>
                <select id="reg-department" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Assigned Department --</option>
                  ${deptOptions}
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input type="email" id="reg-email" placeholder="name@domain.com" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input type="tel" id="reg-phone" placeholder="+1 555-0199" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>

            <!-- Biometric Privacy & Consent Agreement -->
            <div class="bg-blue-50/60 dark:bg-blue-950/30 rounded-3xl p-5 border border-blue-200/80 dark:border-blue-800/60 space-y-3">
              <div class="flex items-center gap-2 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Biometric Privacy Consent
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Facial biometric embeddings are encrypted via AES-256 and stored strictly for organizational attendance verification. Raw photos are not made public, and you retain the right to biometric erasure at any time.
              </p>
              <label class="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input type="checkbox" id="reg-consent" required checked class="mt-0.5 rounded text-blue-600 focus:ring-blue-500">
                <span class="text-xs font-medium text-slate-800 dark:text-slate-200">
                  I explicitly authorize the capture and encrypted processing of my facial biometric data for attendance.
                </span>
              </label>
            </div>
          </div>

          <!-- Right Column: Multi-Angle Face Capture Kiosk (7 cols) -->
          <div class="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-5">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">2. Multi-Angle Face Enrollment</h3>
                <p class="text-xs text-slate-500">Capture 4 angles to build an ensemble facial profile</p>
              </div>
              <div class="flex items-center gap-1">
                <label class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer transition-all">
                  <span>Upload Photo</span>
                  <input type="file" id="reg-file-upload" accept="image/*" class="hidden" onchange="window.handlePhotoUpload(event)">
                </label>
              </div>
            </div>

            <!-- Active Angle Prompt Banner -->
            <div id="angle-prompt-banner" class="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-3">
              <span id="prompt-icon" class="text-2xl">👤</span>
              <div>
                <div id="prompt-title" class="font-bold text-indigo-900 dark:text-indigo-200 text-xs">1. Frontal Pose</div>
                <div id="prompt-subtitle" class="text-xs text-indigo-700 dark:text-indigo-300">Look straight into the camera lens with neutral expression</div>
              </div>
            </div>

            <!-- Live Registration Camera Viewport -->
            <div class="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video border border-slate-800 flex items-center justify-center shadow-inner">
              <video id="reg-camera-video" autoplay playsinline muted class="w-full h-full object-cover"></video>
              
              <!-- Centering Oval -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-44 h-56 rounded-[50%] border-2 border-dashed border-white/40"></div>
              </div>

              <!-- Snap Flash Effect -->
              <div id="camera-flash" class="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-150"></div>
            </div>

            <!-- 4 Captured Angle Thumbnails -->
            <div class="grid grid-cols-4 gap-2.5">
              ${["front", "left", "right", "expression"].map(angle => `
                <div onclick="window.selectAngleStep('${angle}')" id="thumb-wrap-${angle}" class="cursor-pointer p-2 rounded-2xl border-2 ${angle === 'front' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 dark:border-slate-700'} text-center transition-all">
                  <div id="thumb-preview-${angle}" class="w-full aspect-square rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 text-xl font-bold overflow-hidden mb-1">
                    ${ANGLE_CONFIG[angle].icon}
                  </div>
                  <div class="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate capitalize">${angle}</div>
                  <div id="thumb-status-${angle}" class="text-[9px] text-slate-400">Pending</div>
                </div>
              `).join("")}
            </div>

            <!-- Capture Actions -->
            <div class="flex items-center justify-between pt-2">
              <button type="button" onclick="window.snapCurrentAngle()" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
                Snap This Angle
              </button>

              <button type="submit" id="btn-submit-registration" class="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Complete Enrollment
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  `;

  await startRegCamera();
};

async function startRegCamera() {
  const video = document.getElementById("reg-camera-video");
  if (!video) return;

  if (regStream) {
    regStream.getTracks().forEach(t => t.stop());
  }

  try {
    regStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
    });
    video.srcObject = regStream;
  } catch (e) {
    console.warn("Could not start registration camera", e);
  }
}

window.selectAngleStep = function(angle) {
  currentAngleStep = angle;
  const cfg = ANGLE_CONFIG[angle];
  
  document.getElementById("prompt-icon").innerText = cfg.icon;
  document.getElementById("prompt-title").innerText = cfg.title;
  document.getElementById("prompt-subtitle").innerText = cfg.subtitle;

  ["front", "left", "right", "expression"].forEach(a => {
    const el = document.getElementById(`thumb-wrap-${a}`);
    if (el) {
      if (a === angle) {
        el.className = "cursor-pointer p-2 rounded-2xl border-2 border-blue-500 bg-blue-50/40 dark:bg-blue-900/30 text-center transition-all";
      } else {
        el.className = "cursor-pointer p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-center transition-all";
      }
    }
  });
};

window.snapCurrentAngle = function() {
  const video = document.getElementById("reg-camera-video");
  if (!video || video.readyState < 2) return;

  // Flash animation
  const flash = document.getElementById("camera-flash");
  if (flash) {
    flash.style.opacity = "0.8";
    setTimeout(() => { flash.style.opacity = "0"; }, 150);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Center-crop square from video feed
  const minDim = Math.min(video.videoWidth, video.videoHeight);
  const startX = (video.videoWidth - minDim) / 2;
  const startY = (video.videoHeight - minDim) / 2;

  ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 400, 400);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

  capturedAngles[currentAngleStep] = dataUrl;

  // Update thumbnail
  const thumb = document.getElementById(`thumb-preview-${currentAngleStep}`);
  const statusEl = document.getElementById(`thumb-status-${currentAngleStep}`);
  if (thumb) {
    thumb.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover">`;
  }
  if (statusEl) {
    statusEl.innerHTML = `<span class="text-emerald-600 font-bold">✓ Ready</span>`;
  }

  soundEffects.playSuccess();
  showToast(`Captured ${currentAngleStep.toUpperCase()} angle photo`, "success", 2000);

  // Auto-advance to next empty angle
  const angleOrder = ["front", "left", "right", "expression"];
  const nextEmpty = angleOrder.find(a => !capturedAngles[a]);
  if (nextEmpty) {
    window.selectAngleStep(nextEmpty);
  }
};

window.handlePhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    capturedAngles[currentAngleStep] = dataUrl;

    const thumb = document.getElementById(`thumb-preview-${currentAngleStep}`);
    const statusEl = document.getElementById(`thumb-status-${currentAngleStep}`);
    if (thumb) thumb.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover">`;
    if (statusEl) statusEl.innerHTML = `<span class="text-emerald-600 font-bold">✓ Uploaded</span>`;
    
    showToast(`Uploaded photo for ${currentAngleStep} angle`, "success");
  };
  reader.readAsDataURL(file);
};

window.handleRegistrationSubmit = async function(event) {
  event.preventDefault();
  
  const fullName = document.getElementById("reg-fullname").value.trim();
  const identifier = document.getElementById("reg-identifier").value.trim();
  const deptId = parseInt(document.getElementById("reg-department").value);
  const designation = document.getElementById("reg-designation").value.trim() || "Member";
  const email = document.getElementById("reg-email").value.trim() || null;
  const phone = document.getElementById("reg-phone").value.trim() || null;
  const consent = document.getElementById("reg-consent").checked;

  if (!fullName || !identifier || !deptId) {
    showToast("Please complete all required fields", "error");
    return;
  }

  if (!consent) {
    showToast("Biometric consent is mandatory before enrolling faces", "warning");
    return;
  }

  // Build enrolled images array
  const images = [];
  ["front", "left", "right", "expression"].forEach(angle => {
    if (capturedAngles[angle]) {
      images.push({
        angle_label: angle,
        image_base64: capturedAngles[angle]
      });
    }
  });

  if (images.length === 0) {
    showToast("Please capture at least 1 frontal face photo before completing registration", "warning");
    return;
  }

  const submitBtn = document.getElementById("btn-submit-registration");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Encrypting & Enrolling...";
  }

  try {
    const payload = {
      full_name: fullName,
      identifier: identifier,
      department_id: deptId,
      designation: designation,
      email: email,
      phone: phone,
      consent_given: true,
      consent_version: "1.0",
      face_images: images
    };

    const res = await api.createPerson(payload);
    soundEffects.playSuccess();
    showToast(`Successfully enrolled ${res.full_name} with ${res.biometric_count} face vectors!`, "success", 4000);
    
    // Navigate to People Directory
    setTimeout(() => {
      window.navigateTo("people");
    }, 1200);

  } catch (err) {
    showToast(err.message || "Registration failed", "error");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Complete Enrollment";
    }
  }
};

window.cleanupRegistration = function() {
  if (regStream) {
    regStream.getTracks().forEach(t => t.stop());
    regStream = null;
  }
};
