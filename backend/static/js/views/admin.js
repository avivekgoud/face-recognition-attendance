// FaceSync AI - Enterprise Settings & System Administration Module

// Multi-Language Localization Dictionary
const SETTINGS_I18N = {
  en: {
    title: "System Configuration & Security",
    subtitle: "Manage institutional policies, facial biometrics AI, shifts, administrator accounts, localization, and audit logs.",
    saveBtn: "Save All Changes",
    resetBtn: "Reset Defaults",
    backupBtn: "Download DB Backup",
    seedBtn: "Seed Demo Data",
    secAccount: "Account & Sign In",
    secLang: "Language & Region",
    secApp: "Appearance & Theme",
    secAtt: "Attendance & Shifts",
    secFace: "Face Recognition & AI",
    secNotif: "Notifications & Alerts",
    secSec: "Security & Sessions",
    secSys: "System & Maintenance",
    savedSuccess: "Settings saved successfully!",
    authSuccess: "Signed in successfully!",
  },
  hi: {
    title: "सिस्टम कॉन्फ़िगरेशन और सुरक्षा",
    subtitle: "संस्थागत नीतियां, फेशियल बायोमेट्रिक्स, शिफ्ट शेड्यूल, एडमिनिस्ट्रेटर खाते और सुरक्षा लॉग प्रबंधित करें।",
    saveBtn: "सभी परिवर्तन सहेजें",
    resetBtn: "डिफ़ॉल्ट रीसेट करें",
    backupBtn: "डेटाबेस बैकअप डाउनलोड करें",
    seedBtn: "डेमो डेटा लोड करें",
    secAccount: "खाता और साइन इन",
    secLang: "भाषा और क्षेत्र",
    secApp: "दिखावट और थीम",
    secAtt: "उपस्थिति और शिफ्ट",
    secFace: "चेहरा पहचान और AI",
    secNotif: "सूचनाएं और अलर्ट",
    secSec: "सुरक्षा और सत्र",
    secSys: "सिस्टम और रखरखाव",
    savedSuccess: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    authSuccess: "सफलतापूर्वक साइन इन हुआ!",
  },
  te: {
    title: "సిస్టమ్ కాన్ఫిగరేషన్ & భద్రత",
    subtitle: "విద్యాసంస్థల విధానాలు, ముఖ గుర్తింపు AI, షిఫ్ట్ షెడ్యూల్స్, నిర్వాహక ఖాతాలు మరియు ఆడిట్ లాగ్లను నిర్వహించండి.",
    saveBtn: "మార్పులను సేవ్ చేయండి",
    resetBtn: "డిఫాల్ట్‌కి రీసెట్ చేయండి",
    backupBtn: "DB బ్యాకప్ డౌన్‌లోడ్",
    seedBtn: "డెమో డేటా లోడ్ చేయండి",
    secAccount: "ఖాతా & సైన్ ఇన్",
    secLang: "భాష & ప్రాంతం",
    secApp: "రూపం & థీమ్",
    secAtt: "హాజరు & షిఫ్ట్‌లు",
    secFace: "ముఖ గుర్తింపు & AI",
    secNotif: "నోటిఫికేషన్‌లు & అలర్ట్‌లు",
    secSec: "భద్రత & సెషన్‌లు",
    secSys: "సిస్టమ్ & నిర్వహణ",
    savedSuccess: "సెట్టింగ్‌లు విజయవంతంగా సేవ్ చేయబడ్డాయి!",
    authSuccess: "విజయవంతంగా సైన్ ఇన్ అయ్యారు!",
  },
  ta: {
    title: "அமைப்பு கட்டமைப்பு மற்றும் பாதுகாப்பு",
    subtitle: "நிறுவனக் கொள்கைகள், முக அங்கீகாரம் AI, பணி அட்டவணை, கணக்குகள் மற்றும் தணிக்கை பதிவுகளை நிர்வகிக்கவும்.",
    saveBtn: "மாற்றங்களைச் சேமிக்கவும்",
    resetBtn: "மீட்டமை",
    backupBtn: "காப்புப்பிரதி பதிவிறக்கம்",
    seedBtn: "டெமோ தரவு ஏற்றவும்",
    secAccount: "கணக்கு & உள்நுழைவு",
    secLang: "மொழி & பகுதி",
    secApp: "தோற்றம் & தீம்",
    secAtt: "வருகை & மாற்றங்கள்",
    secFace: "முக அங்கீகாரம் & AI",
    secNotif: "அறிவிப்புகள் & விழிப்பூட்டல்கள்",
    secSec: "பாதுகாப்பு & அமர்வுகள்",
    secSys: "கணினி & பராமரிப்பு",
    savedSuccess: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!",
    authSuccess: "வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!",
  },
  kn: {
    title: "ವ್ಯವಸ್ಥೆಯ ಸಂರಚನೆ ಮತ್ತು ಭದ್ರತೆ",
    subtitle: "ಸಾಂಸ್ಥಿಕ ನೀತಿಗಳು, ಮುಖ ಗುರುತಿಸುವಿಕೆ AI, ಪಾಳಿ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನಾ ಲಾಗ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    saveBtn: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    resetBtn: "ಮರುಹೊಂದಿಸಿ",
    backupBtn: "ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್",
    seedBtn: "ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ",
    secAccount: "ಖಾತೆ ಮತ್ತು ಸೈನ್ ಇನ್",
    secLang: "ಭಾಷೆ ಮತ್ತು ಪ್ರದೇಶ",
    secApp: "ಗೋಚರತೆ ಮತ್ತು ಥೀಮ್",
    secAtt: "ಹಾಜರಾತಿ ಮತ್ತು ಪಾಳಿಗಳು",
    secFace: "ಮುಖ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು AI",
    secNotif: "ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    secSec: "ಭದ್ರತೆ ಮತ್ತು ಅವಧಿಗಳು",
    secSys: "ವ್ಯವಸ್ಥೆ ಮತ್ತು ನಿರ್ವಹಣೆ",
    savedSuccess: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
    authSuccess: "ಯಶಸ್ವಿಯಾಗಿ ಸೈನ್ ಇನ್ ಆಗಿದ್ದೀರಿ!",
  },
  ml: {
    title: "സിസ്റ്റം കോൺഫിഗറേഷനും സുരക്ഷയും",
    subtitle: "സ്ഥാപന നയങ്ങൾ, ഫേഷ്യൽ ബയോമെട്രിക്സ് AI, ഷിഫ്റ്റ് ഷെഡ്യൂളുകൾ, അക്കൗണ്ടുകൾ എന്നിവ നിയന്ത്രിക്കുക.",
    saveBtn: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
    resetBtn: "റീസെറ്റ് ചെയ്യുക",
    backupBtn: "ബാക്കപ്പ് ഡൗൺലോഡ്",
    seedBtn: "ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക",
    secAccount: "അക്കൗണ്ടും സൈൻ ഇൻ ചെയ്യലും",
    secLang: "ഭാഷയും പ്രദേശവും",
    secApp: "രൂപഭാവവും തീമും",
    secAtt: "ഹാജരും ഷിഫ്റ്റുകളും",
    secFace: "ഫേസ് റെക്കഗ്നിഷനും AI-യും",
    secNotif: "അറിയിപ്പുകളും മുന്നറിയിപ്പുകളും",
    secSec: "സുരക്ഷയും സെഷനുകളും",
    secSys: "സിസ്റ്റവും പരിപാലനവും",
    savedSuccess: "ക്രമീകരണങ്ങൾ വിജയകരമായി സംരക്ഷിച്ചു!",
    authSuccess: "വിജയകരമായി സൈൻ ഇൻ ചെയ്തു!",
  }
};

window.renderAdminView = async function(container) {
  if (!container) container = document.getElementById("app-view-container");
  if (!container) return;

  const user = typeof api !== 'undefined' ? api.getUser() : null;
  const lang = localStorage.getItem("facesync_lang") || "en";
  const i18n = SETTINGS_I18N[lang] || SETTINGS_I18N.en;

  // Local preferences
  const currentTz = localStorage.getItem("facesync_tz") || "Asia/Kolkata";
  const currentDateFormat = localStorage.getItem("facesync_date_fmt") || "DD/MM/YYYY";
  const currentTimeFormat = localStorage.getItem("facesync_time_fmt") || "12h";
  const currentTheme = localStorage.getItem("facesync_theme") || "dark";
  const currentAccent = localStorage.getItem("facesync_accent") || "blue";
  const currentDensity = localStorage.getItem("facesync_density") || "comfortable";
  const current2FA = localStorage.getItem("facesync_2fa") === "true";
  const currentSessionTimeout = localStorage.getItem("facesync_session_timeout") || "60";
  const autoMarkAbsent = localStorage.getItem("facesync_auto_absent") !== "false";
  const notifAttendance = localStorage.getItem("facesync_notif_att") !== "false";
  const notifLate = localStorage.getItem("facesync_notif_late") !== "false";
  const notifEmail = localStorage.getItem("facesync_notif_email") === "true";
  const autoCapture = localStorage.getItem("facesync_auto_capture") !== "false";

  container.innerHTML = `
    <div class="space-y-8 max-w-7xl mx-auto pb-16">
      
      <!-- Top Header & Action Controls -->
      <div class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2.5 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-md shadow-blue-500/50"></span>
            <span id="txt-sec-header">FaceSync AI Control Center</span>
          </div>
          <h1 id="txt-main-title" class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">${i18n.title}</h1>
          <p id="txt-main-subtitle" class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">${i18n.subtitle}</p>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <button onclick="window.downloadDatabaseBackup()" class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl border border-emerald-500/30 transition-all shadow-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span id="btn-txt-backup">${i18n.backupBtn}</span>
          </button>
          <button onclick="window.seedSystemDemoData()" class="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-2xl border border-indigo-500/30 transition-all shadow-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span id="btn-txt-seed">${i18n.seedBtn}</span>
          </button>
          <button onclick="window.saveGlobalSettings()" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span id="btn-txt-save">${i18n.saveBtn}</span>
          </button>
        </div>
      </div>

      <!-- Settings Navigation Grid Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="#sec-account" class="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 flex items-center gap-3 transition-all">
          <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <div class="text-xs font-bold text-white">${i18n.secAccount}</div>
            <div class="text-[11px] text-slate-400">${user ? user.full_name : 'Sign in to admin'}</div>
          </div>
        </a>

        <a href="#sec-language" class="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 flex items-center gap-3 transition-all">
          <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
          </div>
          <div>
            <div class="text-xs font-bold text-white">${i18n.secLang}</div>
            <div class="text-[11px] text-slate-400">English, Hindi, Telugu +</div>
          </div>
        </a>

        <a href="#sec-attendance" class="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 flex items-center gap-3 transition-all">
          <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <div class="text-xs font-bold text-white">${i18n.secAtt}</div>
            <div class="text-[11px] text-slate-400">Grace: 15m &bull; 09:00 - 17:00</div>
          </div>
        </a>

        <a href="#sec-biometrics" class="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 flex items-center gap-3 transition-all">
          <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div>
            <div class="text-xs font-bold text-white">${i18n.secFace}</div>
            <div class="text-[11px] text-slate-400">Similarity: 68% &bull; Anti-Spoof</div>
          </div>
        </a>
      </div>

      <!-- MAIN SETTINGS SECTIONS -->
      <div class="space-y-6">

        <!-- 1. ACCOUNT & SIGN IN SECTION -->
        <div id="sec-account" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-700/60 flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-white">1. ${i18n.secAccount}</h3>
                <p class="text-xs text-slate-400">Manage administrator authentication, active credentials, and profile credentials</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}">
                <span class="w-2 h-2 rounded-full ${user ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}"></span>
                <span>${user ? 'Authenticated Super Admin' : 'Unauthenticated / Guest'}</span>
              </span>
            </div>
          </div>

          ${user ? `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div class="md:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/25 shrink-0">
                  ${user.username.charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="text-base font-bold text-white truncate">${user.full_name || user.username}</h4>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">${user.role}</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5">Username: <span class="font-mono text-slate-300">@${user.username}</span> &bull; Email: <span class="text-slate-300">${user.email || 'avivek@vardhaman.org'}</span></p>
                  <p class="text-[11px] text-emerald-400 font-medium mt-1">Full biometric permissions, manual overrides, and shift controls enabled.</p>
                </div>
              </div>

              <div class="flex flex-col gap-2.5">
                <button onclick="window.openChangePasswordModal()" class="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all text-center">
                  Change Admin Password
                </button>
                <button onclick="window.handleLogout()" class="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all text-center">
                  Sign Out of Session
                </button>
              </div>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-2xl bg-slate-900/60 border border-slate-700/60">
              <div>
                <h4 class="text-sm font-bold text-white">Administrator Sign In</h4>
                <p class="text-xs text-slate-400 mt-1">Sign in with your master credentials to configure facial similarity thresholds, create department shifts, or override attendance.</p>
                <div class="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 font-mono">
                  Default: <span class="text-white font-bold">avivek</span> / <span class="text-white font-bold">avivek1259</span>
                </div>
              </div>

              <form onsubmit="window.handleSettingsLogin(event)" class="space-y-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Username</label>
                  <input type="text" id="set-login-username" value="avivek" required class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                  <input type="password" id="set-login-password" value="avivek1259" required class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex items-center justify-between text-xs">
                  <label class="flex items-center gap-2 cursor-pointer text-slate-400 text-[11px]">
                    <input type="checkbox" id="set-login-remember" checked class="rounded text-blue-600 focus:ring-blue-500">
                    <span>Remember this device (30 days)</span>
                  </label>
                </div>
                <button type="submit" id="btn-settings-login" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all">
                  Sign In to Dashboard
                </button>
              </form>
            </div>
          `}
        </div>

        <!-- 2. LANGUAGE & REGION -->
        <div id="sec-language" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center gap-3 pb-4 border-b border-slate-700/60">
            <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">2. ${i18n.secLang}</h3>
              <p class="text-xs text-slate-400">Configure institutional localization, date displays, and regional time zones</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Language Dropdown -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">Language (భాష / भाषा)</label>
              <select id="pref-language" onchange="window.saveLanguagePref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-medium">
                <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English (Default)</option>
                <option value="hi" ${lang === 'hi' ? 'selected' : ''}>🇮🇳 हिन्दी (Hindi)</option>
                <option value="te" ${lang === 'te' ? 'selected' : ''}>🇮🇳 తెలుగు (Telugu)</option>
                <option value="ta" ${lang === 'ta' ? 'selected' : ''}>🇮🇳 தமிழ் (Tamil)</option>
                <option value="kn" ${lang === 'kn' ? 'selected' : ''}>🇮🇳 ಕನ್ನಡ (Kannada)</option>
                <option value="ml" ${lang === 'ml' ? 'selected' : ''}>🇮🇳 മലയാളം (Malayalam)</option>
              </select>
              <p class="text-[10px] text-slate-500">Updates all headings, tabs, and alerts instantly.</p>
            </div>

            <!-- Timezone Dropdown -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">Time Zone</label>
              <select id="pref-timezone" onchange="window.saveTimezonePref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono">
                <option value="Asia/Kolkata" ${currentTz === 'Asia/Kolkata' ? 'selected' : ''}>Asia/Kolkata (IST +05:30)</option>
                <option value="UTC" ${currentTz === 'UTC' ? 'selected' : ''}>UTC (GMT +00:00)</option>
                <option value="America/New_York" ${currentTz === 'America/New_York' ? 'selected' : ''}>America/New_York (EST -05:00)</option>
                <option value="Europe/London" ${currentTz === 'Europe/London' ? 'selected' : ''}>Europe/London (BST +01:00)</option>
                <option value="Asia/Dubai" ${currentTz === 'Asia/Dubai' ? 'selected' : ''}>Asia/Dubai (GST +04:00)</option>
                <option value="Asia/Singapore" ${currentTz === 'Asia/Singapore' ? 'selected' : ''}>Asia/Singapore (SGT +08:00)</option>
              </select>
            </div>

            <!-- Date Format -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">Date Format</label>
              <select id="pref-date-format" onchange="window.saveDateFormatPref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono">
                <option value="DD/MM/YYYY" ${currentDateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY (31/08/2026)</option>
                <option value="YYYY-MM-DD" ${currentDateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD (2026-08-31)</option>
                <option value="MM/DD/YYYY" ${currentDateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY (08/31/2026)</option>
                <option value="DD MMM YYYY" ${currentDateFormat === 'DD MMM YYYY' ? 'selected' : ''}>31 Aug 2026</option>
              </select>
            </div>

            <!-- Time Format -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">Clock Format</label>
              <select id="pref-time-format" onchange="window.saveTimeFormatPref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono">
                <option value="12h" ${currentTimeFormat === '12h' ? 'selected' : ''}>12-Hour (09:15 AM)</option>
                <option value="24h" ${currentTimeFormat === '24h' ? 'selected' : ''}>24-Hour (09:15)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 3. APPEARANCE & THEME -->
        <div id="sec-appearance" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center gap-3 pb-4 border-b border-slate-700/60">
            <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">3. ${i18n.secApp}</h3>
              <p class="text-xs text-slate-400">Customize display modes, theme palettes, and UI layout density</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Theme Toggle -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-slate-300">Theme Mode</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" onclick="window.setThemeMode('dark')" class="py-2.5 px-3 rounded-xl border ${currentTheme === 'dark' ? 'border-blue-500 bg-blue-500/20 text-blue-400 font-bold' : 'border-slate-700 bg-slate-900/50 text-slate-400'} text-xs flex items-center justify-center gap-1.5 transition-all">
                  <span>🌙 Dark Theme</span>
                </button>
                <button type="button" onclick="window.setThemeMode('light')" class="py-2.5 px-3 rounded-xl border ${currentTheme === 'light' ? 'border-blue-500 bg-blue-500/20 text-blue-400 font-bold' : 'border-slate-700 bg-slate-900/50 text-slate-400'} text-xs flex items-center justify-center gap-1.5 transition-all">
                  <span>☀️ Light Theme</span>
                </button>
              </div>
            </div>

            <!-- Accent Color -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-slate-300">Brand Accent Color</label>
              <div class="flex items-center gap-3 pt-1">
                <button onclick="window.setAccentColor('blue')" title="Vibrant Blue" class="w-8 h-8 rounded-full bg-blue-600 border-2 ${currentAccent === 'blue' ? 'border-white scale-110' : 'border-transparent'} shadow-md transition-all"></button>
                <button onclick="window.setAccentColor('emerald')" title="Emerald Green" class="w-8 h-8 rounded-full bg-emerald-500 border-2 ${currentAccent === 'emerald' ? 'border-white scale-110' : 'border-transparent'} shadow-md transition-all"></button>
                <button onclick="window.setAccentColor('purple')" title="Electric Purple" class="w-8 h-8 rounded-full bg-purple-600 border-2 ${currentAccent === 'purple' ? 'border-white scale-110' : 'border-transparent'} shadow-md transition-all"></button>
                <button onclick="window.setAccentColor('amber')" title="Amber Gold" class="w-8 h-8 rounded-full bg-amber-500 border-2 ${currentAccent === 'amber' ? 'border-white scale-110' : 'border-transparent'} shadow-md transition-all"></button>
              </div>
            </div>

            <!-- Dashboard Density -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-slate-300">Dashboard Density</label>
              <select id="pref-density" onchange="window.saveDensityPref(this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                <option value="comfortable" ${currentDensity === 'comfortable' ? 'selected' : ''}>Comfortable (Standard)</option>
                <option value="compact" ${currentDensity === 'compact' ? 'selected' : ''}>Compact (High-Density)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 4. ATTENDANCE & SHIFT POLICY -->
        <div id="sec-attendance" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center gap-3 pb-4 border-b border-slate-700/60">
            <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">4. ${i18n.secAtt}</h3>
              <p class="text-xs text-slate-400">Configure standard college shift timings, late grace cutoffs, and cooldown periods</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Standard Shift Start Time</label>
              <input type="time" id="set-start-time" value="09:00" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
              <p class="text-[10px] text-slate-500 mt-1">Arrivals before this time are marked Present.</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Late Grace Period (Minutes)</label>
              <input type="number" id="set-grace-mins" min="0" max="60" value="15" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono">
              <p class="text-[10px] text-slate-500 mt-1">Check-ins after 09:15 AM marked as Late.</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Standard Shift End Time</label>
              <input type="time" id="set-end-time" value="17:00" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
              <p class="text-[10px] text-slate-500 mt-1">Scans after this hour log automated check-out.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700/40">
            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="chk-auto-absent" ${autoMarkAbsent ? 'checked' : ''} class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Auto-Mark Absent at Day End</div>
                <div class="text-[11px] text-slate-400">Automatically flag enrolled attendees without check-ins as Absent</div>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="chk-auto-checkout" checked class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Allow Smart Check-Out Scans</div>
                <div class="text-[11px] text-slate-400">Update departure time when scanned a second time after shift</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 5. FACE RECOGNITION & BIOMETRICS AI -->
        <div id="sec-biometrics" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-700/60 flex-wrap gap-2">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-white">5. ${i18n.secFace}</h3>
                <p class="text-xs text-slate-400">Tune cosine matching sensitivity, capture devices, and passive anti-spoofing filters</p>
              </div>
            </div>

            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
              AES-256 Vector Encryption Active
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Similarity Slider -->
            <div class="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-slate-300">Face Recognition Sensitivity Threshold</label>
                <span id="label-sim-val" class="font-mono font-bold text-blue-400 text-sm">68%</span>
              </div>
              <input type="range" id="set-sim-threshold" min="0.50" max="0.95" step="0.01" value="0.68" oninput="document.getElementById('label-sim-val').innerText = `${Math.round(this.value * 100)}%`" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
              <div class="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50% (Permissive)</span>
                <span>68% (Recommended)</span>
                <span>95% (Strict)</span>
              </div>
            </div>

            <!-- Cooldown -->
            <div class="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
              <label class="block text-xs font-semibold text-slate-300">Duplicate Check-in Cooldown (Minutes)</label>
              <input type="number" id="set-cooldown-mins" min="1" max="120" value="15" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono">
              <p class="text-[10px] text-slate-400">Prevents repeated duplicate logs when standing in front of the kiosk.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="set-req-liveness" checked class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Passive Anti-Spoofing & Liveness Filter</div>
                <div class="text-[11px] text-slate-400">Rejects printed photo paper and phone screen replay attacks</div>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="chk-auto-capture" ${autoCapture ? 'checked' : ''} class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Continuous Auto-Capture Scanner</div>
                <div class="text-[11px] text-slate-400">Automatically polls video frames every 650ms on kiosk feed</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 6. NOTIFICATIONS & ALERTS -->
        <div id="sec-notifications" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center gap-3 pb-4 border-b border-slate-700/60">
            <div class="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">6. ${i18n.secNotif}</h3>
              <p class="text-xs text-slate-400">Configure real-time audio chimes, late alerts, and email notifications</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="chk-notif-att" ${notifAttendance ? 'checked' : ''} class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Check-in Audio Chime</div>
                <div class="text-[11px] text-slate-400">Plays synthesized confirmation sound on match</div>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="chk-notif-late" ${notifLate ? 'checked' : ''} class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Late Arrival Notification</div>
                <div class="text-[11px] text-slate-400">Toast notification when late attendance logged</div>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/60 cursor-pointer">
              <input type="checkbox" id="chk-notif-email" ${notifEmail ? 'checked' : ''} class="rounded text-blue-600 focus:ring-blue-500">
              <div>
                <div class="text-xs font-bold text-white">Email Daily Digest</div>
                <div class="text-[11px] text-slate-400">Send daily summary to HOD/Admin email</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 7. SECURITY & SESSIONS -->
        <div id="sec-security" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center gap-3 pb-4 border-b border-slate-700/60">
            <div class="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">7. ${i18n.secSec}</h3>
              <p class="text-xs text-slate-400">Two-factor authentication, inactivity timeouts, and active sessions</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white">Two-Factor Authentication (2FA)</div>
                  <div class="text-[11px] text-slate-400">Require OTP verification for administrative actions</div>
                </div>
                <button type="button" onclick="window.toggle2FA()" class="px-3 py-1.5 rounded-xl ${current2FA ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'} text-xs font-bold">
                  ${current2FA ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
              <label class="block text-xs font-bold text-white">Inactivity Session Timeout</label>
              <select id="pref-session-timeout" onchange="window.saveSessionTimeout(this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono">
                <option value="15" ${currentSessionTimeout === '15' ? 'selected' : ''}>15 Minutes</option>
                <option value="30" ${currentSessionTimeout === '30' ? 'selected' : ''}>30 Minutes</option>
                <option value="60" ${currentSessionTimeout === '60' ? 'selected' : ''}>60 Minutes (1 Hour)</option>
                <option value="1440" ${currentSessionTimeout === '1440' ? 'selected' : ''}>24 Hours</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 8. SYSTEM & MAINTENANCE -->
        <div id="sec-system" class="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-lg space-y-6">
          <div class="flex items-center gap-3 pb-4 border-b border-slate-700/60">
            <div class="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">8. ${i18n.secSys}</h3>
              <p class="text-xs text-slate-400">Database health, synchronization timestamps, and factory defaults reset</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engine Version</div>
              <div class="text-base font-extrabold text-white mt-1">FaceSync AI v3.2.0</div>
              <div class="text-[10px] text-slate-500 font-mono">FastAPI &bull; OpenCV &bull; AES-256</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Database Status</div>
              <div class="text-base font-extrabold text-emerald-400 mt-1">SQLite &bull; Healthy</div>
              <div class="text-[10px] text-slate-500 font-mono">Encrypted Vector Storage</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Sync</div>
              <div class="text-base font-extrabold text-blue-400 mt-1" id="sys-last-sync">Just now</div>
              <div class="text-[10px] text-slate-500 font-mono">Cloud Synced on Render</div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-700/40 flex-wrap gap-3">
            <button onclick="window.resetSystemSettings()" class="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all">
              ${i18n.resetBtn}
            </button>

            <div class="flex items-center gap-3">
              <button onclick="window.saveGlobalSettings()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all">
                ${i18n.saveBtn}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  // Load active settings
  await loadAdminSettings();
};

async function loadAdminSettings() {
  try {
    const s = await api.getSettings().catch(() => ({}));
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };
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
    console.warn("Settings fetch fallback used:", err);
  }
}

window.saveGlobalSettings = async function() {
  try {
    const payload = {
      organization_name: "Vardhaman College of Engineering",
      standard_work_start: document.getElementById("set-start-time")?.value || "09:00",
      late_grace_minutes: parseInt(document.getElementById("set-grace-mins")?.value || "15"),
      standard_work_end: document.getElementById("set-end-time")?.value || "17:00",
      face_similarity_threshold: parseFloat(document.getElementById("set-sim-threshold")?.value || "0.68"),
      duplicate_cooldown_minutes: parseInt(document.getElementById("set-cooldown-mins")?.value || "15"),
      require_liveness_check: document.getElementById("set-req-liveness")?.checked !== false
    };

    // Save local toggles
    localStorage.setItem("facesync_auto_absent", document.getElementById("chk-auto-absent")?.checked !== false);
    localStorage.setItem("facesync_auto_capture", document.getElementById("chk-auto-capture")?.checked !== false);
    localStorage.setItem("facesync_notif_att", document.getElementById("chk-notif-att")?.checked !== false);
    localStorage.setItem("facesync_notif_late", document.getElementById("chk-notif-late")?.checked !== false);
    localStorage.setItem("facesync_notif_email", document.getElementById("chk-notif-email")?.checked === true);

    await api.updateSettings(payload);
    if (typeof soundEffects !== 'undefined') soundEffects.playSuccess();
    
    const lang = localStorage.getItem("facesync_lang") || "en";
    const msg = (SETTINGS_I18N[lang] || SETTINGS_I18N.en).savedSuccess;
    showToast(msg, "success");
  } catch (err) {
    showToast(err.message || "Failed to update settings", "error");
  }
};

window.saveLanguagePref = function(lang) {
  localStorage.setItem("facesync_lang", lang);
  const dict = SETTINGS_I18N[lang] || SETTINGS_I18N.en;
  showToast(`Language updated to '${lang.toUpperCase()}'`, "info");
  window.renderAdminView();
};

window.saveDateFormatPref = function(fmt) {
  localStorage.setItem("facesync_date_fmt", fmt);
  showToast(`Date display format updated to ${fmt}`, "info");
};

window.saveTimeFormatPref = function(fmt) {
  localStorage.setItem("facesync_time_fmt", fmt);
  showToast(`Clock format updated to ${fmt.toUpperCase()}`, "info");
};

window.saveTimezonePref = function(tz) {
  localStorage.setItem("facesync_tz", tz);
  showToast(`Timezone set to ${tz}`, "info");
};

window.saveDensityPref = function(d) {
  localStorage.setItem("facesync_density", d);
  showToast(`Dashboard density set to ${d}`, "info");
};

window.saveSessionTimeout = function(val) {
  localStorage.setItem("facesync_session_timeout", val);
  showToast(`Session timeout updated to ${val} minutes`, "info");
};

window.toggle2FA = function() {
  const current = localStorage.getItem("facesync_2fa") === "true";
  localStorage.setItem("facesync_2fa", (!current).toString());
  showToast(`Two-Factor Authentication ${!current ? 'Enabled' : 'Disabled'}`, !current ? "success" : "info");
  window.renderAdminView();
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
};

window.setAccentColor = function(color) {
  localStorage.setItem("facesync_accent", color);
  showToast(`Accent color updated to ${color}`, "success");
  window.renderAdminView();
};

window.downloadDatabaseBackup = function() {
  showToast("Downloading database backup...", "info", 2000);
  window.location.href = "/api/settings/backup-database";
};

window.resetSystemSettings = function() {
  if (!confirm("Are you sure you want to reset all settings to defaults?")) return;
  localStorage.removeItem("facesync_lang");
  localStorage.removeItem("facesync_tz");
  localStorage.removeItem("facesync_date_fmt");
  localStorage.removeItem("facesync_time_fmt");
  showToast("Settings reset to defaults", "info");
  window.renderAdminView();
};

window.handleSettingsLogin = async function(e) {
  e.preventDefault();
  const u = document.getElementById("set-login-username")?.value.trim();
  const p = document.getElementById("set-login-password")?.value;
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
    showToast(`Welcome back, ${res.full_name}!`, "success");
    window.updateAuthUI();
    await window.renderAdminView();
  } catch (err) {
    showToast(err.message || "Invalid credentials", "error");
    if (btn) btn.innerText = "Sign In to Dashboard";
  }
};
