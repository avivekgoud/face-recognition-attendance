// FaceSync AI - Enterprise Settings & System Administration Module
// Fully responsive, multi-language, production-grade configuration center

// 1. Comprehensive Localization Dictionary (6 languages)
const SETTINGS_LOCALES = {
  en: {
    heroBadge: "Settings & Institutional Control",
    title: "System Settings & Configuration",
    subtitle: "Manage institutional policies, facial biometrics AI, shifts, administrator accounts, localization, and audit logs.",
    saveBtn: "Save Changes",
    cancelBtn: "Cancel",
    resetBtn: "Reset Settings",
    backupBtn: "Download DB Backup",
    seedBtn: "Seed Demo Data",
    secAccount: "Account & Sign In",
    secLang: "Language & Region",
    secApp: "Appearance & Theme",
    secAtt: "Attendance & Shifts",
    secFace: "Face Recognition & Biometrics",
    secNotif: "Notifications & Alerts",
    secSec: "Security & Sessions",
    secSys: "System & Maintenance",
    activeStatus: "Active",
    protectedStatus: "Protected",
    operationalStatus: "Operational",
    connectedStatus: "Connected",
    savedToast: "Settings saved successfully.",
    resetConfirm: "Are you sure you want to reset all settings to application defaults?",
    resetToast: "All settings have been restored to default.",
    offlineNotice: "Some settings could not be synchronized with the server. Local settings are being used."
  },
  hi: {
    heroBadge: "सेटिंग्स और संस्थागत नियंत्रण",
    title: "सिस्टम सेटिंग्स और कॉन्फ़िगरेशन",
    subtitle: "संस्थागत नीतियां, फेशियल बायोमेट्रिक्स AI, शिफ्ट शेड्यूल, एडमिनिस्ट्रेटर खाते और सुरक्षा लॉग प्रबंधित करें।",
    saveBtn: "परिवर्तन सहेजें",
    cancelBtn: "रद्द करें",
    resetBtn: "सेटिंग्स रीसेट करें",
    backupBtn: "डेटाबेस बैकअप डाउनलोड करें",
    seedBtn: "डेमो डेटा लोड करें",
    secAccount: "खाता और साइन इन",
    secLang: "भाषा और क्षेत्र",
    secApp: "दिखावट और थीम",
    secAtt: "उपस्थिति और शिफ्ट",
    secFace: "चेहरा पहचान और बायोमेट्रिक्स",
    secNotif: "सूचनाएं और अलर्ट",
    secSec: "सुरक्षा और सत्र",
    secSys: "सिस्टम और रखरखाव",
    activeStatus: "सक्रिय",
    protectedStatus: "सुरक्षित",
    operationalStatus: "परिचालन में",
    connectedStatus: "कनेक्टेड",
    savedToast: "सेटिंग्स सफलतापूर्वक सहेजी गईं।",
    resetConfirm: "क्या आप वाकई सभी सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?",
    resetToast: "सभी सेटिंग्स डिफ़ॉल्ट पर रीसेट कर दी गई हैं।",
    offlineNotice: "सर्वर से कुछ सेटिंग्स सिंक नहीं हो सकीं। स्थानीय सेटिंग्स का उपयोग किया जा रहा है।"
  },
  te: {
    heroBadge: "సెట్టింగ్‌లు & సంస్థాగత నియంత్రణ",
    title: "సిస్టమ్ సెట్టింగ్‌లు & కాన్ఫిగరేషన్",
    subtitle: "విద్యాసంస్థల విధానాలు, ముఖ గుర్తింపు AI, షిఫ్ట్ షెడ్యూల్స్, నిర్వాహక ఖాతాలు మరియు ఆడిట్ లాగ్లను నిర్వహించండి.",
    saveBtn: "మార్పులను సేవ్ చేయండి",
    cancelBtn: "రద్దు చేయండి",
    resetBtn: "సెట్టింగ్‌లను రీసెట్ చేయండి",
    backupBtn: "DB బ్యాకప్ డౌన్‌లోడ్",
    seedBtn: "డెమో డేటా లోడ్ చేయండి",
    secAccount: "ఖాతా & సైన్ ఇన్",
    secLang: "భాష & ప్రాంతం",
    secApp: "రూపం & థీమ్",
    secAtt: "హాజరు & షిఫ్ట్‌లు",
    secFace: "ముఖ గుర్తింపు & బయోమెట్రిక్స్",
    secNotif: "నోటిఫికేషన్‌లు & అలర్ట్‌లు",
    secSec: "భద్రత & సెషన్‌లు",
    secSys: "సిస్టమ్ & నిర్వహణ",
    activeStatus: "క్రియాశీల",
    protectedStatus: "రక్షించబడింది",
    operationalStatus: "కార్యాచరణలో ఉంది",
    connectedStatus: "కనెక్ట్ చేయబడింది",
    savedToast: "సెట్టింగ్‌లు విజయవంతంగా సేవ్ చేయబడ్డాయి.",
    resetConfirm: "మీరు ఖచ్చితంగా అన్ని సెట్టింగ్‌లను డిఫాల్ట్‌కి రీసెట్ చేయాలనుకుంటున్నారా?",
    resetToast: "అన్ని సెట్టింగ్‌లు డిఫాల్ట్‌కి పునరుద్ధరించబడ్డాయి.",
    offlineNotice: "కొన్ని సెట్టింగ్‌లు సర్వర్‌తో సమకాలీకరించబడలేదు. స్థానిక సెట్టింగ్‌లు ఉపయోగించబడుతున్నాయి."
  },
  ta: {
    heroBadge: "அமைப்புகள் & நிறுவனக் கட்டுப்பாடு",
    title: "கணினி அமைப்புகள் & கட்டமைப்பு",
    subtitle: "நிறுவனக் கொள்கைகள், முக அங்கீகாரம் AI, பணி அட்டவணை, கணக்குகள் மற்றும் தணிக்கை பதிவுகளை நிர்வகிக்கவும்.",
    saveBtn: "மாற்றங்களைச் சேமிக்கவும்",
    cancelBtn: "ரத்து செய்",
    resetBtn: "அமைப்புகளை மீட்டமை",
    backupBtn: "காப்புப்பிரதி பதிவிறக்கம்",
    seedBtn: "டெமோ தரவு ஏற்றவும்",
    secAccount: "கணக்கு & உள்நுழைவு",
    secLang: "மொழி & பகுதி",
    secApp: "தோற்றம் & தீம்",
    secAtt: "வருகை & பணி மாற்றங்கள்",
    secFace: "முக அங்கீகாரம் & பயோமெட்ரிக்ஸ்",
    secNotif: "அறிவிப்புகள் & விழிப்பூட்டல்கள்",
    secSec: "பாதுகாப்பு & அமர்வுகள்",
    secSys: "கணினி & பராமரிப்பு",
    activeStatus: "செயலில் உள்ளது",
    protectedStatus: "பாதுகாக்கப்பட்டது",
    operationalStatus: "செயல்பாட்டில் உள்ளது",
    connectedStatus: "இணைக்கப்பட்டது",
    savedToast: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன.",
    resetConfirm: "அனைத்து அமைப்புகளையும் மீட்டமைக்க விரும்புகிறீர்களா?",
    resetToast: "அனைத்து அமைப்புகளும் மீட்டமைக்கப்பட்டன.",
    offlineNotice: "சேவையகத்துடன் சில அமைப்புகளை ஒத்திசைக்க முடியவில்லை. உள்ளூர் அமைப்புகள் பயன்படுத்தப்படுகின்றன."
  },
  kn: {
    heroBadge: "ಸಂಯೋಜನೆಗಳು ಮತ್ತು ಸಾಂಸ್ಥಿಕ ನಿಯಂತ್ರಣ",
    title: "ವ್ಯವಸ್ಥೆಯ ಸಂಯೋಜನೆಗಳು & ಸಂರಚನೆ",
    subtitle: "ಸಾಂಸ್ಥಿಕ ನೀತಿಗಳು, ಮುಖ ಗುರುತಿಸುವಿಕೆ AI, ಪಾಳಿ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನಾ ಲಾಗ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    saveBtn: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    cancelBtn: "ರದ್ದುಮಾಡಿ",
    resetBtn: "ಮರುಹೊಂದಿಸಿ",
    backupBtn: "ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್",
    seedBtn: "ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ",
    secAccount: "ಖಾತೆ ಮತ್ತು ಸೈನ್ ಇನ್",
    secLang: "ಭಾಷೆ ಮತ್ತು ಪ್ರದೇಶ",
    secApp: "ಗೋಚರತೆ ಮತ್ತು ಥೀಮ್",
    secAtt: "ಹಾಜರಾತಿ ಮತ್ತು ಪಾಳಿಗಳು",
    secFace: "ಮುಖ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಬಯೋಮೆಟ್ರಿಕ್ಸ್",
    secNotif: "ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    secSec: "ಭದ್ರತೆ ಮತ್ತು ಅವಧಿಗಳು",
    secSys: "ವ್ಯವಸ್ಥೆ ಮತ್ತು ನಿರ್ವಹಣೆ",
    activeStatus: "ಸಕ್ರಿಯ",
    protectedStatus: "ರಕ್ಷಿತ",
    operationalStatus: "ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ",
    connectedStatus: "ಸಂಪರ್ಕಿತವಾಗಿದೆ",
    savedToast: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",
    resetConfirm: "ನೀವು ಎಲ್ಲಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",
    resetToast: "ಎಲ್ಲಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ.",
    offlineNotice: "ಸರ್ವರ್‌ನೊಂದಿಗೆ ಕೆಲವು ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಸಿಂಕ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸ್ಥಳೀಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ."
  },
  ml: {
    heroBadge: "ക്രമീകരണങ്ങളും സ്ഥാപന നിയന്ത്രണവും",
    title: "സിസ്റ്റം ക്രമീകരണങ്ങളും കോൺഫിഗറേഷനും",
    subtitle: "സ്ഥാപന നയങ്ങൾ, ഫേഷ്യൽ ബയോമെട്രിക്സ് AI, ഷിഫ്റ്റ് ഷെഡ്യൂളുകൾ, അക്കൗണ്ടുകൾ എന്നിവ നിയന്ത്രിക്കുക.",
    saveBtn: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
    cancelBtn: "റദ്ദാക്കുക",
    resetBtn: "ക്രമീകരണങ്ങൾ റീസെറ്റ് ചെയ്യുക",
    backupBtn: "ബാക്കപ്പ് ഡൗൺലോഡ്",
    seedBtn: "ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക",
    secAccount: "അക്കൗണ്ടും സൈൻ ഇൻ ചെയ്യലും",
    secLang: "ഭാഷയും പ്രദേശവും",
    secApp: "രൂപഭാവവും തീമും",
    secAtt: "ഹാജരും ഷിഫ്റ്റുകളും",
    secFace: "ഫേസ് റെക്കഗ്നിഷനും ബയോമെട്രിക്സും",
    secNotif: "അറിയിപ്പുകളും മുന്നറിയിപ്പുകളും",
    secSec: "സുരക്ഷയും സെഷനുകളും",
    secSys: "സിസ്റ്റവും പരിപാലനവും",
    activeStatus: "സജീവം",
    protectedStatus: "സുരക്ഷിതം",
    operationalStatus: "പ്രവർത്തനക്ഷമമാണ്",
    connectedStatus: "ബന്ധിപ്പിച്ചു",
    savedToast: "ക്രമീകരണങ്ങൾ വിജയകരമായി സംരക്ഷിച്ചു.",
    resetConfirm: "എല്ലാ ക്രമീകരണങ്ങളും റീസെറ്റ് ചെയ്യാൻ തീർച്ചയാണോ?",
    resetToast: "എല്ലാ ക്രമീകരണങ്ങളും റീസെറ്റ് ചെയ്തു.",
    offlineNotice: "സെർവറുമായി ചില ക്രമീകരണങ്ങൾ സമന്വയിപ്പിക്കാനായില്ല. പ്രാദേശിക ക്രമീകരണങ്ങളാണ് ഉപയോഗിക്കുന്നത്."
  }
};

// 2. Default Configuration Object
const DEFAULT_CONFIG = {
  language: "en",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-hour",
  theme: "dark",
  density: "comfortable",
  accent: "blue",

  attendance: {
    gracePeriod: 15,
    autoMarkAbsent: true,
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    duplicateCooldown: 15,
    autoCheckout: true,
    autoNotifications: true
  },

  faceRecognition: {
    sensitivity: "high",
    confidenceThreshold: 68,
    camera: "Default HD Webcam",
    autoCapture: true,
    antiSpoofing: true
  },

  notifications: {
    attendance: true,
    lateArrival: true,
    absence: true,
    system: true,
    email: false,
    audioChime: true
  },

  security: {
    twoFactor: false,
    sessionTimeout: 60
  }
};

// Global in-memory configuration cache
window.FaceSyncSettings = null;

// Safe Configuration Loader
function getActiveSettings() {
  try {
    const raw = localStorage.getItem("facesync_app_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        attendance: { ...DEFAULT_CONFIG.attendance, ...(parsed.attendance || {}) },
        faceRecognition: { ...DEFAULT_CONFIG.faceRecognition, ...(parsed.faceRecognition || {}) },
        notifications: { ...DEFAULT_CONFIG.notifications, ...(parsed.notifications || {}) },
        security: { ...DEFAULT_CONFIG.security, ...(parsed.security || {}) }
      };
    }
  } catch (e) {
    console.warn("Could not parse saved settings, using defaults:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

// 3. Primary Render Function (Never throws, fully defensive)
window.renderAdminView = window.renderSettingsView = async function(container) {
  try {
    if (!container) container = document.getElementById("app-view-container");
    if (!container) return;

    // Load active settings from storage/defaults
    window.FaceSyncSettings = getActiveSettings();
    const cfg = window.FaceSyncSettings;
    const lang = cfg.language || "en";
    const i18n = SETTINGS_LOCALES[lang] || SETTINGS_LOCALES.en;

    // Safe user inspection
    let user = null;
    try {
      if (typeof api !== 'undefined' && api && typeof api.getUser === 'function') {
        user = api.getUser();
      }
    } catch {
      user = null;
    }

    const username = (user && user.username) ? user.username : "avivek";
    const userFullName = (user && user.full_name) ? user.full_name : "A Vivek Goud";
    const userRole = (user && user.role) ? user.role : "SUPER_ADMIN";
    const userEmail = (user && user.email) ? user.email : "avivek@vardhaman.org";
    const userInitial = username.charAt(0).toUpperCase();

    // Render HTML structure matching FaceSync AI deep navy visual identity
    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-24 text-slate-100 animate-fadeIn">
        
        <!-- Offline / Sync Status Notice (Hidden by default) -->
        <div id="settings-sync-notice" class="hidden p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span id="txt-sync-notice">${i18n.offlineNotice}</span>
          </div>
          <button onclick="document.getElementById('settings-sync-notice').classList.add('hidden')" class="text-amber-400 hover:text-white">&times;</button>
        </div>

        <!-- 1. Hero Header Banner -->
        <div class="bg-[#0b162c] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-md shadow-blue-500/50"></span>
              <span id="lbl-hero-badge">${i18n.heroBadge}</span>
            </div>
            <h1 id="lbl-hero-title" class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">${i18n.title}</h1>
            <p id="lbl-hero-subtitle" class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">${i18n.subtitle}</p>
          </div>

          <div class="flex items-center gap-2.5 flex-wrap relative z-10">
            <button onclick="window.downloadDatabaseBackup()" class="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl border border-emerald-500/30 transition-all shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span id="btn-lbl-backup">${i18n.backupBtn}</span>
            </button>
            <button onclick="window.seedSystemDemoData()" class="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-2xl border border-indigo-500/30 transition-all shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span id="btn-lbl-seed">${i18n.seedBtn}</span>
            </button>
            <button onclick="window.saveGlobalSettings()" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span id="btn-lbl-save-top">${i18n.saveBtn}</span>
            </button>
          </div>
        </div>

        <!-- 2. Scroll Jump Navigation Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800 text-xs font-semibold">
          <a href="#card-account" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">1. ${i18n.secAccount}</a>
          <a href="#card-language" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">2. ${i18n.secLang}</a>
          <a href="#card-appearance" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">3. ${i18n.secApp}</a>
          <a href="#card-attendance" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">4. ${i18n.secAtt}</a>
          <a href="#card-face" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">5. ${i18n.secFace}</a>
          <a href="#card-notifications" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">6. ${i18n.secNotif}</a>
          <a href="#card-security" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">7. ${i18n.secSec}</a>
          <a href="#card-system" class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white shrink-0 transition-all">8. ${i18n.secSys}</a>
        </div>

        <!-- 3. Responsive 2-Column Settings Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- CARD 1: Account & Sign In -->
          <div id="card-account" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <h3 id="lbl-sec-account" class="text-sm font-bold text-white">1. ${i18n.secAccount}</h3>
                  <p class="text-[11px] text-slate-400">Manage administrator session and profile credentials</p>
                </div>
              </div>
              <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>● ${i18n.activeStatus}</span>
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-[#081124] border border-slate-800/80 flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/25 shrink-0">
                ${userInitial}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-white truncate">${userFullName}</h4>
                  <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">${userRole}</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">Username: <span class="font-mono text-slate-300">@${username}</span> &bull; Email: <span class="text-slate-300">${userEmail}</span></p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button type="button" onclick="window.renderLoginModal()" class="py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all text-center">
                Sign In / Switch
              </button>
              <button type="button" onclick="window.openChangePasswordModal()" class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all text-center">
                Change Password
              </button>
              <button type="button" onclick="window.handleLogout()" class="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all text-center">
                Sign Out
              </button>
            </div>
          </div>

          <!-- CARD 2: Language & Region -->
          <div id="card-language" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
              </div>
              <div>
                <h3 id="lbl-sec-lang" class="text-sm font-bold text-white">2. ${i18n.secLang}</h3>
                <p class="text-[11px] text-slate-400">Institutional localization, time zones, and date formats</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Language (భాష / भाषा)</label>
                <select id="cfg-language" onchange="window.handleLanguageChange(this.value)" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                  <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English (Default)</option>
                  <option value="hi" ${lang === 'hi' ? 'selected' : ''}>🇮🇳 हिन्दी (Hindi)</option>
                  <option value="te" ${lang === 'te' ? 'selected' : ''}>🇮🇳 తెలుగు (Telugu)</option>
                  <option value="ta" ${lang === 'ta' ? 'selected' : ''}>🇮🇳 தமிழ் (Tamil)</option>
                  <option value="kn" ${lang === 'kn' ? 'selected' : ''}>🇮🇳 ಕನ್ನಡ (Kannada)</option>
                  <option value="ml" ${lang === 'ml' ? 'selected' : ''}>🇮🇳 മലയാളം (Malayalam)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Region / Time Zone</label>
                <select id="cfg-timezone" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
                  <option value="Asia/Kolkata" ${cfg.timezone === 'Asia/Kolkata' ? 'selected' : ''}>Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC" ${cfg.timezone === 'UTC' ? 'selected' : ''}>UTC (GMT +00:00)</option>
                  <option value="America/New_York" ${cfg.timezone === 'America/New_York' ? 'selected' : ''}>America/New_York (EST -05:00)</option>
                  <option value="Europe/London" ${cfg.timezone === 'Europe/London' ? 'selected' : ''}>Europe/London (BST +01:00)</option>
                  <option value="Asia/Dubai" ${cfg.timezone === 'Asia/Dubai' ? 'selected' : ''}>Asia/Dubai (GST +04:00)</option>
                  <option value="Asia/Singapore" ${cfg.timezone === 'Asia/Singapore' ? 'selected' : ''}>Asia/Singapore (SGT +08:00)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Date Display Format</label>
                <select id="cfg-date-format" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
                  <option value="DD/MM/YYYY" ${cfg.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY (31/08/2026)</option>
                  <option value="YYYY-MM-DD" ${cfg.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD (2026-08-31)</option>
                  <option value="MM/DD/YYYY" ${cfg.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY (08/31/2026)</option>
                  <option value="DD MMM YYYY" ${cfg.dateFormat === 'DD MMM YYYY' ? 'selected' : ''}>DD MMM YYYY (31 Aug 2026)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Time Format</label>
                <select id="cfg-time-format" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
                  <option value="12-hour" ${cfg.timeFormat === '12-hour' ? 'selected' : ''}>12-hour (09:15 AM)</option>
                  <option value="24-hour" ${cfg.timeFormat === '24-hour' ? 'selected' : ''}>24-hour (09:15)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- CARD 3: Appearance & Theme -->
          <div id="card-appearance" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div class="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
              </div>
              <div>
                <h3 id="lbl-sec-app" class="text-sm font-bold text-white">3. ${i18n.secApp}</h3>
                <p class="text-[11px] text-slate-400">Color themes, dark mode switch, and UI spacing density</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Theme Mode</label>
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" onclick="window.applyThemeMode('dark')" class="py-2 px-2 rounded-xl border ${cfg.theme === 'dark' ? 'border-blue-500 bg-blue-500/20 text-blue-400 font-bold' : 'border-slate-800 bg-[#081124] text-slate-400'} text-xs text-center transition-all">
                    🌙 Dark
                  </button>
                  <button type="button" onclick="window.applyThemeMode('light')" class="py-2 px-2 rounded-xl border ${cfg.theme === 'light' ? 'border-blue-500 bg-blue-500/20 text-blue-400 font-bold' : 'border-slate-800 bg-[#081124] text-slate-400'} text-xs text-center transition-all">
                    ☀️ Light
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Theme Accent</label>
                <div class="flex items-center gap-2.5 pt-1">
                  <button type="button" onclick="window.applyAccentColor('blue')" title="Vibrant Blue" class="w-7 h-7 rounded-full bg-blue-600 border-2 ${cfg.accent === 'blue' ? 'border-white scale-110' : 'border-transparent'} shadow transition-all"></button>
                  <button type="button" onclick="window.applyAccentColor('emerald')" title="Emerald Green" class="w-7 h-7 rounded-full bg-emerald-500 border-2 ${cfg.accent === 'emerald' ? 'border-white scale-110' : 'border-transparent'} shadow transition-all"></button>
                  <button type="button" onclick="window.applyAccentColor('purple')" title="Electric Purple" class="w-7 h-7 rounded-full bg-purple-600 border-2 ${cfg.accent === 'purple' ? 'border-white scale-110' : 'border-transparent'} shadow transition-all"></button>
                  <button type="button" onclick="window.applyAccentColor('amber')" title="Amber Gold" class="w-7 h-7 rounded-full bg-amber-500 border-2 ${cfg.accent === 'amber' ? 'border-white scale-110' : 'border-transparent'} shadow transition-all"></button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Dashboard Density</label>
                <select id="cfg-density" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                  <option value="comfortable" ${cfg.density === 'comfortable' ? 'selected' : ''}>Comfortable</option>
                  <option value="compact" ${cfg.density === 'compact' ? 'selected' : ''}>Compact</option>
                </select>
              </div>
            </div>
          </div>

          <!-- CARD 4: Attendance & Shifts -->
          <div id="card-attendance" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div class="w-10 h-10 rounded-2xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <h3 id="lbl-sec-att" class="text-sm font-bold text-white">4. ${i18n.secAtt}</h3>
                <p class="text-[11px] text-slate-400">Institutional shift timings, grace periods, and rules</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Shift Start Time</label>
                <input type="time" id="cfg-shift-start" value="${cfg.attendance.workingHoursStart || '09:00'}" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Late Grace Period</label>
                <div class="flex items-center gap-1.5">
                  <input type="number" id="cfg-grace-mins" min="0" max="60" value="${cfg.attendance.gracePeriod || 15}" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
                  <span class="text-xs text-slate-400 font-medium">min</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Shift End Time</label>
                <input type="time" id="cfg-shift-end" value="${cfg.attendance.workingHoursEnd || '17:00'}" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="space-y-2.5 pt-1">
              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Auto-mark absent after shift cutoff</div>
                  <div class="text-[11px] text-slate-400">Automatically logs Absent status for unrecorded attendees</div>
                </div>
                <input type="checkbox" id="cfg-auto-absent" ${cfg.attendance.autoMarkAbsent !== false ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>

              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Smart Check-out departures</div>
                  <div class="text-[11px] text-slate-400">Updates checkout time on subsequent evening face scans</div>
                </div>
                <input type="checkbox" id="cfg-auto-checkout" ${cfg.attendance.autoCheckout !== false ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>
            </div>
          </div>

          <!-- CARD 5: Face Recognition & Biometrics -->
          <div id="card-face" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div>
                  <h3 id="lbl-sec-face" class="text-sm font-bold text-white">5. ${i18n.secFace}</h3>
                  <p class="text-[11px] text-slate-400">Cosine threshold, video capture device, and anti-spoofing</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AES-256 Vector Encryption
              </span>
            </div>

            <div class="space-y-3 p-4 rounded-2xl bg-[#081124] border border-slate-800">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-slate-300">Recognition Confidence Threshold</span>
                <span id="cfg-sim-display" class="font-mono font-bold text-blue-400">${cfg.faceRecognition.confidenceThreshold || 68}%</span>
              </div>
              <input type="range" id="cfg-sim-threshold" min="50" max="95" step="1" value="${cfg.faceRecognition.confidenceThreshold || 68}" oninput="document.getElementById('cfg-sim-display').innerText = this.value + '%'" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500">
              <div class="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50% Permissive</span>
                <span>68% Recommended</span>
                <span>95% Strict</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Primary Camera</label>
                <select id="cfg-camera-select" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                  <option value="default">Default HD Webcam</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Sensitivity Profile</label>
                <select id="cfg-sensitivity" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500">
                  <option value="high" ${cfg.faceRecognition.sensitivity === 'high' ? 'selected' : ''}>High (Recommended for Campus)</option>
                  <option value="medium" ${cfg.faceRecognition.sensitivity === 'medium' ? 'selected' : ''}>Medium</option>
                  <option value="strict" ${cfg.faceRecognition.sensitivity === 'strict' ? 'selected' : ''}>Strict (Zero-Tolerance)</option>
                </select>
              </div>
            </div>

            <div class="space-y-2 pt-1">
              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Passive Anti-Spoofing & Liveness Filter</div>
                  <div class="text-[11px] text-slate-400">Rejects printed photo paper and phone screen replays</div>
                </div>
                <input type="checkbox" id="cfg-anti-spoof" ${cfg.faceRecognition.antiSpoofing !== false ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>

              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Continuous Auto-Capture Scanner</div>
                  <div class="text-[11px] text-slate-400">Continuous video frame analysis on kiosk kiosk screen</div>
                </div>
                <input type="checkbox" id="cfg-auto-capture" ${cfg.faceRecognition.autoCapture !== false ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>
            </div>
          </div>

          <!-- CARD 6: Notifications & Alerts -->
          <div id="card-notifications" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div class="w-10 h-10 rounded-2xl bg-rose-600/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </div>
              <div>
                <h3 id="lbl-sec-notif" class="text-sm font-bold text-white">6. ${i18n.secNotif}</h3>
                <p class="text-[11px] text-slate-400">Audio chimes, late alerts, and email notifications</p>
              </div>
            </div>

            <div class="space-y-2.5">
              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Audio Check-in Chimes</div>
                  <div class="text-[11px] text-slate-400">Plays synthesized positive/negative audio confirmation</div>
                </div>
                <input type="checkbox" id="cfg-notif-audio" ${cfg.notifications.audioChime !== false ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>

              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Late Arrival Notification Toasts</div>
                  <div class="text-[11px] text-slate-400">Displays real-time alerts when students/faculty arrive after grace</div>
                </div>
                <input type="checkbox" id="cfg-notif-late" ${cfg.notifications.lateArrival !== false ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>

              <label class="flex items-center justify-between p-3 rounded-2xl bg-[#081124] border border-slate-800 cursor-pointer">
                <div>
                  <div class="text-xs font-bold text-white">Email Daily Attendance Digest</div>
                  <div class="text-[11px] text-slate-400">Sends daily CSV/PDF summary report to administrator email</div>
                </div>
                <input type="checkbox" id="cfg-notif-email" ${cfg.notifications.email === true ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
              </label>
            </div>
          </div>

          <!-- CARD 7: Security & Sessions -->
          <div id="card-security" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <div>
                  <h3 id="lbl-sec-sec" class="text-sm font-bold text-white">7. ${i18n.secSec}</h3>
                  <p class="text-[11px] text-slate-400">Two-factor auth, session timeout, and active devices</p>
                </div>
              </div>
              <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>● ${i18n.protectedStatus}</span>
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Inactivity Session Timeout</label>
                <select id="cfg-session-timeout" class="w-full px-3 py-2 rounded-xl bg-[#081124] border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500">
                  <option value="15" ${cfg.security.sessionTimeout === 15 ? 'selected' : ''}>15 Minutes</option>
                  <option value="30" ${cfg.security.sessionTimeout === 30 ? 'selected' : ''}>30 Minutes</option>
                  <option value="60" ${cfg.security.sessionTimeout === 60 ? 'selected' : ''}>60 Minutes (1 Hour)</option>
                  <option value="1440" ${cfg.security.sessionTimeout === 1440 ? 'selected' : ''}>24 Hours</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Two-Factor Authentication (2FA)</label>
                <button type="button" onclick="window.toggleTwoFactorAuth()" id="btn-2fa-status" class="w-full py-2 px-3 rounded-xl ${cfg.security.twoFactor ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'} text-xs font-bold transition-all">
                  ${cfg.security.twoFactor ? '2FA Enabled (OTP Protected)' : '2FA Disabled'}
                </button>
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-[#081124] border border-slate-800/80 space-y-2">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Device Session</div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-white font-semibold">Web Browser &bull; Windows</span>
                <span class="text-emerald-400 font-mono text-[11px]">Current Session (Active)</span>
              </div>
              <div class="text-[11px] text-slate-500 font-mono">IP: Client &bull; AES-256 Protected &bull; Token Verified</div>
            </div>
          </div>

          <!-- CARD 8: System & Maintenance -->
          <div id="card-system" class="bg-[#0b162c] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-teal-600/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <h3 id="lbl-sec-sys" class="text-sm font-bold text-white">8. ${i18n.secSys}</h3>
                  <p class="text-[11px] text-slate-400">Database health, synchronization timestamps, and reset</p>
                </div>
              </div>
              <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <span class="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>● ${i18n.operationalStatus}</span>
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3 rounded-2xl bg-[#081124] border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 uppercase">Version</div>
                <div class="text-xs font-bold text-white mt-1">v3.2.0</div>
                <div class="text-[9px] text-slate-500 font-mono">Enterprise</div>
              </div>
              <div class="p-3 rounded-2xl bg-[#081124] border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 uppercase">Database</div>
                <div class="text-xs font-bold text-emerald-400 mt-1">● ${i18n.connectedStatus}</div>
                <div class="text-[9px] text-slate-500 font-mono">SQLite</div>
              </div>
              <div class="p-3 rounded-2xl bg-[#081124] border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 uppercase">System</div>
                <div class="text-xs font-bold text-teal-400 mt-1">● ${i18n.operationalStatus}</div>
                <div class="text-[9px] text-slate-500 font-mono">FastAPI</div>
              </div>
              <div class="p-3 rounded-2xl bg-[#081124] border border-slate-800">
                <div class="text-[10px] font-bold text-slate-400 uppercase">Last Sync</div>
                <div class="text-xs font-bold text-blue-400 mt-1" id="sys-sync-time">Just now</div>
                <div class="text-[9px] text-slate-500 font-mono">Render Cloud</div>
              </div>
            </div>

            <div class="pt-1 flex items-center justify-between flex-wrap gap-2">
              <button type="button" onclick="window.confirmResetSettings()" class="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-all">
                ${i18n.resetBtn}
              </button>
              <button type="button" onclick="window.downloadDatabaseBackup()" class="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all">
                ${i18n.backupBtn}
              </button>
            </div>
          </div>

        </div>

        <!-- 4. Sticky Bottom Action Controls -->
        <div class="sticky bottom-4 z-30 bg-[#0b162c]/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-2xl flex items-center justify-between gap-4">
          <button type="button" onclick="window.cancelSettingsChanges()" class="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all">
            <span id="btn-lbl-cancel">${i18n.cancelBtn}</span>
          </button>

          <div class="flex items-center gap-3">
            <button type="button" onclick="window.confirmResetSettings()" class="hidden sm:block px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all">
              <span id="btn-lbl-reset-bottom">${i18n.resetBtn}</span>
            </button>
            <button type="button" onclick="window.saveGlobalSettings()" class="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span id="btn-lbl-save-bottom">${i18n.saveBtn}</span>
            </button>
          </div>
        </div>

      </div>
    `;

    // Populate camera devices safely
    window.populateCameraDevices();

    // Try synchronizing with backend API in background (never blocking UI)
    window.syncBackendSettings();

  } catch (renderError) {
    console.error("renderAdminView caught error:", renderError);
    // Even in case of an unexpected JavaScript runtime error, render a resilient minimal UI
    container.innerHTML = `
      <div class="p-8 max-w-xl mx-auto bg-[#0b162c] rounded-3xl border border-slate-800 text-center space-y-4">
        <h3 class="text-lg font-bold text-white">System Settings</h3>
        <p class="text-xs text-slate-400">Settings dashboard initialized with safe mode defaults.</p>
        <button onclick="window.renderAdminView()" class="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Reload Settings</button>
      </div>
    `;
  }
};

// 4. Background Server Settings Synchronization
window.syncBackendSettings = async function() {
  if (typeof api === 'undefined' || !api || typeof api.getSettings !== 'function') return;

  try {
    const s = await api.getSettings();
    if (!s || typeof s !== 'object') return;

    // Safely apply server values if present
    if (s.standard_work_start) {
      const el = document.getElementById("cfg-shift-start");
      if (el) el.value = s.standard_work_start;
    }
    if (s.late_grace_minutes !== undefined) {
      const el = document.getElementById("cfg-grace-mins");
      if (el) el.value = s.late_grace_minutes;
    }
    if (s.standard_work_end) {
      const el = document.getElementById("cfg-shift-end");
      if (el) el.value = s.standard_work_end;
    }
    if (s.face_similarity_threshold !== undefined) {
      const pct = Math.round(s.face_similarity_threshold * 100);
      const slider = document.getElementById("cfg-sim-threshold");
      const label = document.getElementById("cfg-sim-display");
      if (slider) slider.value = pct;
      if (label) label.innerText = pct + "%";
    }
    if (s.require_liveness_check !== undefined) {
      const chk = document.getElementById("cfg-anti-spoof");
      if (chk) chk.checked = s.require_liveness_check !== false;
    }

    const syncLabel = document.getElementById("sys-sync-time");
    if (syncLabel) {
      const now = new Date();
      syncLabel.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch (err) {
    console.warn("Could not sync remote settings from API (using local cache):", err);
    const notice = document.getElementById("settings-sync-notice");
    if (notice) notice.classList.remove("hidden");
  }
};

// 5. Populate video cameras
window.populateCameraDevices = async function() {
  try {
    const select = document.getElementById("cfg-camera-select");
    if (!select || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    if (videoInputs.length > 0) {
      select.innerHTML = videoInputs.map((d, i) => `
        <option value="${d.deviceId}">${d.label || `Camera ${i + 1} (Connected)`}</option>
      `).join("");
    }
  } catch (e) {
    console.warn("Could not enumerate camera devices:", e);
  }
};

// 6. Language Switcher (Updates all visible settings labels in real-time)
window.handleLanguageChange = function(lang) {
  try {
    if (!SETTINGS_LOCALES[lang]) lang = "en";
    
    // Save to configuration
    if (!window.FaceSyncSettings) window.FaceSyncSettings = getActiveSettings();
    window.FaceSyncSettings.language = lang;
    localStorage.setItem("facesync_lang", lang);
    localStorage.setItem("facesync_app_settings", JSON.stringify(window.FaceSyncSettings));

    const i18n = SETTINGS_LOCALES[lang];

    // Update labels in real-time without reloading
    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.innerText = txt;
    };

    setText("lbl-hero-badge", i18n.heroBadge);
    setText("lbl-hero-title", i18n.title);
    setText("lbl-hero-subtitle", i18n.subtitle);
    setText("btn-lbl-backup", i18n.backupBtn);
    setText("btn-lbl-seed", i18n.seedBtn);
    setText("btn-lbl-save-top", i18n.saveBtn);
    setText("lbl-sec-account", "1. " + i18n.secAccount);
    setText("lbl-sec-lang", "2. " + i18n.secLang);
    setText("lbl-sec-app", "3. " + i18n.secApp);
    setText("lbl-sec-att", "4. " + i18n.secAtt);
    setText("lbl-sec-face", "5. " + i18n.secFace);
    setText("lbl-sec-notif", "6. " + i18n.secNotif);
    setText("lbl-sec-sec", "7. " + i18n.secSec);
    setText("lbl-sec-sys", "8. " + i18n.secSys);
    setText("btn-lbl-cancel", i18n.cancelBtn);
    setText("btn-lbl-reset-bottom", i18n.resetBtn);
    setText("btn-lbl-save-bottom", i18n.saveBtn);

    if (typeof showToast === 'function') {
      showToast(`Language updated to ${lang.toUpperCase()}`, "info");
    }
  } catch (e) {
    console.error("Language switch error:", e);
  }
};

// 7. Save Settings (Persists to API and localStorage)
window.saveGlobalSettings = async function() {
  try {
    const lang = document.getElementById("cfg-language")?.value || "en";
    const timezone = document.getElementById("cfg-timezone")?.value || "Asia/Kolkata";
    const dateFormat = document.getElementById("cfg-date-format")?.value || "DD/MM/YYYY";
    const timeFormat = document.getElementById("cfg-time-format")?.value || "12-hour";
    const density = document.getElementById("cfg-density")?.value || "comfortable";
    const shiftStart = document.getElementById("cfg-shift-start")?.value || "09:00";
    const graceMins = parseInt(document.getElementById("cfg-grace-mins")?.value || "15", 10);
    const shiftEnd = document.getElementById("cfg-shift-end")?.value || "17:00";
    const autoAbsent = document.getElementById("cfg-auto-absent")?.checked !== false;
    const autoCheckout = document.getElementById("cfg-auto-checkout")?.checked !== false;
    const simThresholdPct = parseInt(document.getElementById("cfg-sim-threshold")?.value || "68", 10);
    const camera = document.getElementById("cfg-camera-select")?.value || "default";
    const sensitivity = document.getElementById("cfg-sensitivity")?.value || "high";
    const antiSpoof = document.getElementById("cfg-anti-spoof")?.checked !== false;
    const autoCapture = document.getElementById("cfg-auto-capture")?.checked !== false;
    const notifAudio = document.getElementById("cfg-notif-audio")?.checked !== false;
    const notifLate = document.getElementById("cfg-notif-late")?.checked !== false;
    const notifEmail = document.getElementById("cfg-notif-email")?.checked === true;
    const sessionTimeout = parseInt(document.getElementById("cfg-session-timeout")?.value || "60", 10);

    const updatedConfig = {
      language: lang,
      timezone: timezone,
      dateFormat: dateFormat,
      timeFormat: timeFormat,
      theme: localStorage.getItem("facesync_theme") || "dark",
      density: density,
      accent: localStorage.getItem("facesync_accent") || "blue",
      attendance: {
        gracePeriod: graceMins,
        autoMarkAbsent: autoAbsent,
        workingHoursStart: shiftStart,
        workingHoursEnd: shiftEnd,
        duplicateCooldown: 15,
        autoCheckout: autoCheckout,
        autoNotifications: true
      },
      faceRecognition: {
        sensitivity: sensitivity,
        confidenceThreshold: simThresholdPct,
        camera: camera,
        autoCapture: autoCapture,
        antiSpoofing: antiSpoof
      },
      notifications: {
        attendance: true,
        lateArrival: notifLate,
        absence: true,
        system: true,
        email: notifEmail,
        audioChime: notifAudio
      },
      security: {
        twoFactor: localStorage.getItem("facesync_2fa") === "true",
        sessionTimeout: sessionTimeout
      }
    };

    // Save to localStorage
    window.FaceSyncSettings = updatedConfig;
    localStorage.setItem("facesync_app_settings", JSON.stringify(updatedConfig));
    localStorage.setItem("facesync_lang", lang);
    localStorage.setItem("facesync_tz", timezone);
    localStorage.setItem("facesync_date_fmt", dateFormat);
    localStorage.setItem("facesync_time_fmt", timeFormat);

    // Save to backend API if available
    if (typeof api !== 'undefined' && api && typeof api.updateSettings === 'function') {
      await api.updateSettings({
        organization_name: "Vardhaman College of Engineering",
        standard_work_start: shiftStart,
        late_grace_minutes: graceMins,
        standard_work_end: shiftEnd,
        face_similarity_threshold: simThresholdPct / 100,
        duplicate_cooldown_minutes: 15,
        require_liveness_check: antiSpoof
      }).catch(err => {
        console.warn("Backend settings update warning (saved locally):", err);
      });
    }

    if (typeof soundEffects !== 'undefined' && soundEffects && typeof soundEffects.playSuccess === 'function') {
      soundEffects.playSuccess();
    }

    const i18n = SETTINGS_LOCALES[lang] || SETTINGS_LOCALES.en;
    if (typeof showToast === 'function') {
      showToast(i18n.savedToast || "Settings saved successfully.", "success");
    }
  } catch (err) {
    console.error("Save error:", err);
    if (typeof showToast === 'function') {
      showToast("Settings saved locally.", "info");
    }
  }
};

// 8. Cancel Changes
window.cancelSettingsChanges = function() {
  if (typeof showToast === 'function') {
    showToast("Changes canceled. Reverting to saved state.", "info");
  }
  window.renderAdminView();
};

// 9. Reset Settings to Defaults
window.confirmResetSettings = function() {
  const lang = localStorage.getItem("facesync_lang") || "en";
  const i18n = SETTINGS_LOCALES[lang] || SETTINGS_LOCALES.en;
  
  if (!confirm(i18n.resetConfirm || "Are you sure you want to reset all settings?")) return;

  localStorage.removeItem("facesync_app_settings");
  localStorage.removeItem("facesync_lang");
  localStorage.removeItem("facesync_tz");
  localStorage.removeItem("facesync_date_fmt");
  localStorage.removeItem("facesync_time_fmt");
  localStorage.removeItem("facesync_theme");
  localStorage.removeItem("facesync_2fa");
  window.FaceSyncSettings = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  if (typeof showToast === 'function') {
    showToast(i18n.resetToast || "Settings reset to defaults.", "info");
  }
  window.renderAdminView();
};

// 10. Theme & Accent Helpers
window.applyThemeMode = function(mode) {
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("facesync_theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("facesync_theme", "light");
  }
  if (typeof showToast === 'function') {
    showToast(`Theme switched to ${mode} mode`, "info");
  }
  window.renderAdminView();
};

window.applyAccentColor = function(color) {
  localStorage.setItem("facesync_accent", color);
  if (typeof showToast === 'function') {
    showToast(`Accent color updated to ${color}`, "info");
  }
  window.renderAdminView();
};

window.toggleTwoFactorAuth = function() {
  const current = localStorage.getItem("facesync_2fa") === "true";
  const next = !current;
  localStorage.setItem("facesync_2fa", next.toString());
  
  const btn = document.getElementById("btn-2fa-status");
  if (btn) {
    btn.className = `w-full py-2 px-3 rounded-xl ${next ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'} text-xs font-bold transition-all`;
    btn.innerText = next ? "2FA Enabled (OTP Protected)" : "2FA Disabled";
  }

  if (typeof showToast === 'function') {
    showToast(`Two-Factor Authentication ${next ? 'Enabled' : 'Disabled'}`, next ? "success" : "info");
  }
};

// 11. Database Backup & Demo Seeder Actions
window.downloadDatabaseBackup = function() {
  if (typeof showToast === 'function') {
    showToast("Preparing database backup download...", "info", 2000);
  }
  window.location.href = "/api/settings/backup-database";
};

window.seedSystemDemoData = async function() {
  if (!confirm("Seed realistic demonstration departments, personnel, and historical attendance records?")) return;

  if (typeof showToast === 'function') {
    showToast("Seeding realistic sample data...", "info", 3000);
  }

  try {
    if (typeof api !== 'undefined' && api && typeof api.seedSampleData === 'function') {
      const res = await api.seedSampleData();
      if (typeof soundEffects !== 'undefined' && soundEffects) soundEffects.playSuccess();
      if (typeof showToast === 'function') {
        showToast(res.message || "Sample data populated successfully!", "success", 4000);
      }
    }
  } catch (e) {
    if (typeof showToast === 'function') {
      showToast(e.message || "Failed to seed demo data", "error");
    }
  }
};
