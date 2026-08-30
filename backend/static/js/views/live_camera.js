// Live Camera Attendance Kiosk View

let liveStream = null;
let recognitionInterval = null;
let isProcessingFrame = false;
let cameraDevices = [];

window.renderLiveCameraView = async function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Top Status Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 md:px-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Live Attendance Kiosk</h2>
              <span id="kiosk-status-badge" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Ready
              </span>
            </div>
            <p class="text-xs text-slate-500">Align face inside viewfinder for instant biometric verification</p>
          </div>
        </div>

        <!-- Camera Controls -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <select id="camera-select" class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500">
            <option value="">Default Web Camera</option>
          </select>
          <button id="btn-toggle-camera" onclick="window.toggleCameraFeed()" class="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 transition-colors">
            Pause Stream
          </button>
          <button id="btn-test-frame" onclick="window.triggerSingleFrameScan()" class="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            Scan Face Now
          </button>
        </div>
      </div>

      <!-- Main Kiosk Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Live Video Viewport (8 cols) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex items-center justify-center">
            
            <!-- Video & Canvas Element -->
            <video id="live-camera-video" autoplay playsinline muted class="w-full h-full object-cover"></video>
            <canvas id="live-camera-canvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>

            <!-- Holographic Scanline Overlay -->
            <div id="scanline-overlay" class="scan-line"></div>

            <!-- Face Centering Guide Oval -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-64 h-80 rounded-[50%] border-2 border-dashed border-blue-400/40 flex items-center justify-center">
                <div class="text-[11px] font-mono tracking-widest text-blue-300/60 uppercase text-center mt-64">Position Face Here</div>
              </div>
            </div>

            <!-- Real-time HUD Status Pill -->
            <div class="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 text-white text-xs font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span id="hud-status-text">Scanning for faces (3.0 FPS)...</span>
            </div>

            <!-- Real-time Confidence & FPS HUD -->
            <div class="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-white text-xs font-mono">
              <span id="hud-fps-text">60 FPS</span>
              <span class="text-slate-500">|</span>
              <span id="hud-liveness-pill" class="text-emerald-400">Liveness: Passive On</span>
            </div>

            <!-- Big Live Result Banner (Floating Notification) -->
            <div id="live-recognition-banner" class="absolute bottom-6 left-6 right-6 transition-all duration-300 transform translate-y-24 opacity-0 pointer-events-none">
              <div id="banner-card" class="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/60 rounded-2xl p-4 shadow-2xl flex items-center gap-4 text-white">
                <div id="banner-avatar-wrap" class="shrink-0">
                  <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center font-bold text-xl text-emerald-400">
                    R
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 id="banner-name" class="text-lg font-bold truncate">Rahul Kumar</h3>
                    <span id="banner-status-badge" class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Present</span>
                  </div>
                  <p id="banner-dept-time" class="text-xs text-slate-300 mt-0.5">CSE &bull; 09:14 AM &bull; 96.4% Match</p>
                </div>
                <div class="shrink-0 text-right pr-2">
                  <div id="banner-score" class="text-xl font-mono font-bold text-emerald-400">96.4%</div>
                  <div class="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</div>
                </div>
              </div>
            </div>

            <!-- Permission Denied / Camera Off Placeholder -->
            <div id="camera-placeholder" class="hidden absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div class="p-4 bg-slate-800 rounded-full text-slate-400">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
              </div>
              <h3 class="text-base font-semibold">Camera Access Paused or Unavailable</h3>
              <p class="text-xs text-slate-400 max-w-sm">Please permit camera access in your browser or select an available capture device to enable facial recognition.</p>
              <button onclick="window.startCameraStream()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all">
                Grant Camera Access / Restart
              </button>
            </div>
          </div>

          <!-- Kiosk Controls & Settings Tuning -->
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="chk-audio-sound" checked onchange="window.soundEffects.enabled = this.checked" class="rounded text-blue-600 focus:ring-blue-500">
                <span class="text-slate-700 dark:text-slate-200 font-medium">Audio Chime</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="chk-liveness-toggle" checked class="rounded text-blue-600 focus:ring-blue-500">
                <span class="text-slate-700 dark:text-slate-200 font-medium">Anti-Spoofing Filter</span>
              </label>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-slate-500">Scan Frequency:</span>
              <span class="font-mono font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Every 650ms</span>
            </div>
          </div>
        </div>

        <!-- Live Recognition Stream Ticker (4 cols) -->
        <div class="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between h-[520px]">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Recognized Stream</h3>
              </div>
              <span id="session-checkin-count" class="text-xs font-mono font-semibold text-slate-500">0 marked</span>
            </div>

            <div id="live-ticker-list" class="mt-3 space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
              <div class="text-center py-16 text-slate-400 text-xs">
                Waiting for attendees to approach the camera...
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>Apex Biometrics Engine v2.0</span>
            <span class="font-mono">AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  `;

  await enumerateCameras();
  await startCameraStream();
};

async function enumerateCameras() {
  const select = document.getElementById("camera-select");
  if (!select) return;

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === "videoinput");
    cameraDevices = videoInputs;

    if (videoInputs.length > 0) {
      select.innerHTML = videoInputs.map((d, i) => `
        <option value="${d.deviceId}">${d.label || `Camera ${i + 1}`}</option>
      `).join("");
      select.onchange = () => startCameraStream(select.value);
    }
  } catch (err) {
    console.warn("Could not enumerate devices", err);
  }
}

window.startCameraStream = async function(deviceId = null) {
  const video = document.getElementById("live-camera-video");
  const placeholder = document.getElementById("camera-placeholder");
  if (!video) return;

  if (liveStream) {
    liveStream.getTracks().forEach(t => t.stop());
  }

  const constraints = {
    video: deviceId ? { deviceId: { exact: deviceId } } : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
  };

  try {
    liveStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = liveStream;
    if (placeholder) placeholder.classList.add("hidden");

    // Start recognition polling loop
    startRecognitionLoop();
  } catch (err) {
    console.error("Camera access error:", err);
    if (placeholder) placeholder.classList.remove("hidden");
    showToast("Camera access was denied or device is not available", "error");
  }
};

window.toggleCameraFeed = function() {
  const video = document.getElementById("live-camera-video");
  const btn = document.getElementById("btn-toggle-camera");
  if (!video || !liveStream) return;

  const track = liveStream.getVideoTracks()[0];
  if (track) {
    track.enabled = !track.enabled;
    if (btn) {
      btn.innerText = track.enabled ? "Pause Stream" : "Resume Stream";
      btn.className = track.enabled 
        ? "px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium"
        : "px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-medium";
    }
  }
};

let sessionRecognizedCount = 0;
let lastRecognizedPersonId = null;
let lastRecognizedTimestamp = 0;

function startRecognitionLoop() {
  if (recognitionInterval) clearInterval(recognitionInterval);

  // Poll server recognition every 650ms for snappy responsiveness
  recognitionInterval = setInterval(async () => {
    if (isProcessingFrame) return;
    await captureAndRecognizeFrame();
  }, 650);
}

async function captureAndRecognizeFrame() {
  const video = document.getElementById("live-camera-video");
  const canvas = document.getElementById("live-camera-canvas");
  if (!video || !canvas || video.readyState < 2) return;

  isProcessingFrame = true;

  try {
    // Capture snapshot frame from video element
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 480;
    offscreenCanvas.height = 360;
    const ctx = offscreenCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 480, 360);

    const base64Data = offscreenCanvas.toDataURL("image/jpeg", 0.75);

    const livenessReq = document.getElementById("chk-liveness-toggle")?.checked !== false;

    const result = await api.recognizeFace({
      image_base64: base64Data,
      liveness_score: 0.95
    });

    drawBoundingBox(canvas, video, result);

    if (result.recognized) {
      handleRecognitionSuccess(result);
    } else {
      updateHudStatus(result.message || "Scanning...");
    }

  } catch (err) {
    // Network or processing error
  } finally {
    isProcessingFrame = false;
  }
}

window.triggerSingleFrameScan = async function() {
  showToast("Analyzing camera frame...", "info", 1500);
  await captureAndRecognizeFrame();
};

function drawBoundingBox(canvas, video, result) {
  if (!canvas || !video) return;
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!result || !result.bounding_box) return;

  const box = result.bounding_box;
  // Scale box coordinates to canvas resolution
  const scaleX = canvas.width / 480;
  const scaleY = canvas.height / 360;

  const x = box.x * scaleX;
  const y = box.y * scaleY;
  const w = box.width * scaleX;
  const h = box.height * scaleY;

  ctx.lineWidth = 3;
  if (result.recognized) {
    ctx.strokeStyle = "#10b981"; // Emerald green
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
  } else if (!result.liveness_passed) {
    ctx.strokeStyle = "#ef4444"; // Red for spoof warning
    ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
  } else {
    ctx.strokeStyle = "#94a3b8"; // Neutral gray for unknown
    ctx.fillStyle = "rgba(148, 163, 184, 0.1)";
  }

  // Draw rounded bounding box
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.stroke();
  ctx.fill();

  // Draw name tag above box
  const labelText = result.recognized 
    ? `${result.full_name} (${(result.confidence * 100).toFixed(0)}%)`
    : result.liveness_passed ? "Unknown Face" : "Spoof Warning";

  ctx.font = "bold 14px 'Segoe UI', sans-serif";
  const textWidth = ctx.measureText(labelText).width;
  ctx.fillStyle = result.recognized ? "#10b981" : result.liveness_passed ? "#64748b" : "#ef4444";
  ctx.beginPath();
  ctx.roundRect(x, y - 28, textWidth + 16, 24, 6);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.fillText(labelText, x + 8, y - 12);
}

function handleRecognitionSuccess(result) {
  const now = Date.now();
  
  // Throttle popup banners for same person within 3 seconds
  if (lastRecognizedPersonId === result.person_id && (now - lastRecognizedTimestamp) < 3000) {
    return;
  }

  lastRecognizedPersonId = result.person_id;
  lastRecognizedTimestamp = now;

  if (result.attendance_recorded) {
    soundEffects.playSuccess();
    sessionRecognizedCount++;
    const countEl = document.getElementById("session-checkin-count");
    if (countEl) countEl.innerText = `${sessionRecognizedCount} marked`;
  }

  showFloatingBanner(result);
  appendTickerItem(result);
  updateHudStatus(`Recognized: ${result.full_name} (${(result.confidence * 100).toFixed(1)}%)`);
}

function showFloatingBanner(result) {
  const banner = document.getElementById("live-recognition-banner");
  if (!banner) return;

  const nameEl = document.getElementById("banner-name");
  const deptEl = document.getElementById("banner-dept-time");
  const scoreEl = document.getElementById("banner-score");
  const badgeEl = document.getElementById("banner-status-badge");
  const avatarWrap = document.getElementById("banner-avatar-wrap");

  if (nameEl) nameEl.innerText = result.full_name;
  if (deptEl) deptEl.innerText = `${result.department_name} • ${result.check_in_time || 'Just now'} • ${result.message}`;
  if (scoreEl) scoreEl.innerText = `${(result.confidence * 100).toFixed(1)}%`;
  
  if (badgeEl) {
    badgeEl.innerText = result.status || "Recognized";
    badgeEl.className = result.status === "PRESENT"
      ? "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
      : "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40";
  }

  if (avatarWrap) {
    avatarWrap.innerHTML = result.profile_photo_url
      ? `<img src="${result.profile_photo_url}" class="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500">`
      : `<div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center font-bold text-xl text-emerald-400">${result.full_name.charAt(0)}</div>`;
  }

  banner.classList.remove("translate-y-24", "opacity-0");
  banner.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    banner.classList.add("translate-y-24", "opacity-0");
    banner.classList.remove("translate-y-0", "opacity-100");
  }, 3500);
}

function appendTickerItem(result) {
  const ticker = document.getElementById("live-ticker-list");
  if (!ticker) return;

  // Clear placeholder if present
  if (ticker.innerHTML.includes("Waiting for attendees")) {
    ticker.innerHTML = "";
  }

  const item = document.createElement("div");
  item.className = "flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 hover:border-blue-500/40 transition-all";

  const avatar = result.profile_photo_url
    ? `<img src="${result.profile_photo_url}" class="w-10 h-10 rounded-xl object-cover border border-slate-200">`
    : `<div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">${result.full_name.charAt(0)}</div>`;

  const statusColor = result.status === "PRESENT" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" : "text-amber-600 bg-amber-50 dark:bg-amber-900/30";

  item.innerHTML = `
    <div class="flex items-center gap-3 min-w-0 pr-2">
      ${avatar}
      <div class="truncate">
        <div class="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">${result.full_name}</div>
        <div class="text-[11px] text-slate-400 truncate">${result.department_name} &bull; ${result.identifier}</div>
      </div>
    </div>
    <div class="text-right shrink-0">
      <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}">${result.status || 'Verified'}</span>
      <div class="text-[10px] font-mono text-slate-400 mt-0.5">${result.check_in_time || 'Now'}</div>
    </div>
  `;

  ticker.insertBefore(item, ticker.firstChild);

  // Keep max 15 items
  if (ticker.children.length > 15) {
    ticker.removeChild(ticker.lastChild);
  }
}

function updateHudStatus(text) {
  const el = document.getElementById("hud-status-text");
  if (el) el.innerText = text;
}

// Cleanup on unmount
window.cleanupLiveCamera = function() {
  if (recognitionInterval) {
    clearInterval(recognitionInterval);
    recognitionInterval = null;
  }
  if (liveStream) {
    liveStream.getTracks().forEach(t => t.stop());
    liveStream = null;
  }
};
