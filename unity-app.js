var STORAGE_KEY = "unity-dashboard-app-v2";
var GLOBAL_TEMPLATE_KEY = "unity-global-template-v1";
var SUPABASE_URL = "https://ujhljzsbslqszwewkdtf.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaGxqenNic2xxc3p3ZXdrZHRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY1NjAzOCwiZXhwIjoyMDkzMjMyMDM4fQ.rY2hMKSBGnYITWHguTlHSom0vSbGRlOfI1t8mYpSyLE";

console.log("UNITY Dashboard App v21.0 - Initializing...");

var unityDb = null;
try {
  if (window.supabase && typeof window.supabase.createClient === "function") {
    console.log("Initializing Supabase with URL:", SUPABASE_URL);
    unityDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase (unityDb) initialized.");
  }
} catch (e) {
  console.error("Supabase init error:", e);
}

// Global Error Logging
window.addEventListener("error", (e) => {
  console.error("Global Error:", e.message);
  if (typeof showToast === "function") showToast("Error: " + e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled Rejection:", e.reason);
  if (typeof showToast === "function") showToast("Sync Error: " + (e.reason?.message || e.reason));
});

const HIDDEN_NEXT_DOCUMENT = 20260108;
const PREVIEW_TEMPLATE_KEY = "template";
const PAGE_SPECS = {
  A3: { label: "A3", widthPx: 1123, heightPx: 1587, widthMm: 297, heightMm: 420, widthPt: 841.89, heightPt: 1190.55, excelPaperSize: 8 },
  A4: { label: "A4", widthPx: 794, heightPx: 1123, widthMm: 210, heightMm: 297, widthPt: 595.28, heightPt: 841.89, excelPaperSize: 9 },
  LETTER: { label: "Letter", widthPx: 816, heightPx: 1056, widthMm: 215.9, heightMm: 279.4, widthPt: 612, heightPt: 792, excelPaperSize: 1 },
};
const PAGE_MARGINS = {
  topPx: 42,
  sidePx: 60,
  bottomPx: 60,
  topMm: 12,
  sideMm: 12,
  bottomMm: 12,
};
const MIN_PREVIEW_COMPRESS_SCALE = 0.24;
const LOGIN_USERNAME = "abi.nihad";
const LOGIN_PASSWORD = "64423";
const AUTH_KEY = "unity_v16_auth_persistent";
const AUTH_USER_KEY = "unity_v16_user_persistent";
const ACCOUNTS_KEY = "unity_accounts";
const APP_VERSION = "v21.39";
const MASTER_ADMIN = "abi.nihad";
const UNIVERSAL_PASSWORD = "64423";
const REMEMBER_KEY = "unity-dashboard-remember-me";
const emailPrefixOptions = ["eMail :", "Tel :", "Fax :"];
const FILE_HANDLE_DB_NAME = "unity-dashboard-file-handles";
const FILE_HANDLE_STORE_NAME = "handles";
const HEADER_LOCKED_FIELD_IDS = [
  "documentNumber",
  "preparedBy",
  "contactPerson",
  "phone",
  "clientAddress",
  "clientEmail",
];

const defaultUomOptions = [
  "Nos",
  "Lot",
  "Pcs",
  "Set",
  "l/s",
  "Hrs",
  "Pax",
  "Unit",
  "Room",
  "EA",
  "mm",
  "Mtr",
  "Yrd",
  "Ft",
];

const defaultSettings = {
  appName: "UNITY Dashboard",
  appSubtitle: "Engineering and Construction",
  logoUrl: "assets/unity-logo.png",
  bizsafeUrl: "assets/bizsafe.png",
  stampUrl: "assets/stamp-signature.png",
  companyName: "UNITY ENGINEERING AND CONSTRUCTION PTE LTD",
  companyAddress: "92B Syed Alwi Road Singapore 207668",
  companyEmail: "unityengltd19@gmail.com",
  defaultPreparedBy: "Nihad",
  defaultContactPerson: "Rafiqul",
  defaultPhone: "93575078",
  defaultGstRate: 9,
  currencySymbol: "$",
  nextDocumentNumber: String(HIDDEN_NEXT_DOCUMENT),
  documentTypes: ["QUOTATION", "INVOICE", "CHANGE NOTE"],
  poDocumentTypes: ["INVOICE"],
  adjustmentTypes: ["NONE", "+ GST", "- DISCOUNT", "- PREVIOUSLY PAID"],
  uomOptions: defaultUomOptions,
  pdfSavePath: "",
  excelSavePath: "",
  page: {
    size: "A4",
    orientation: "portrait",
    compressToFit: false,
  },
  labels: {
    documentNo: "Document No",
    documentDate: "Document Date",
    preparedBy: "Prepared By",
    contact: "Contact person",
    phone: "H/P",
    pageNo: "Page No",
    poNo: "PO No",
    re: "RE",
    emailPrefix: "eMail :",
    subtotal: "SUB-TOTAL",
    total: "TOTAL AMOUNT",
    footerGreeting: "Sincerely Yours,",
  },
  bank: {
    heading: "PAY BY BANK TRANSFER",
    lineOne: "ACCOUNT NUMBER: 663851756001 (OCBC)",
    lineTwo: "UEN NUMBER: 201901932D",
  },
};

const previewBindings = {
  previewDocumentType: { root: "document", key: "type" },
  previewCompanyName: { root: "settings", key: "companyName" },
  previewCompanyAddress: { root: "settings", key: "companyAddress" },
  previewCompanyEmail: { root: "settings", key: "companyEmail", stripPrefix: true },
  previewDocNoLabel: { root: "label", key: "documentNo", edgeColon: true },
  previewDocNo: { root: "document", key: "number" },
  previewDateLabel: { root: "label", key: "documentDate", edgeColon: true },
  previewDate: { root: "document", key: "date", parser: parseEditableDate },
  previewPreparedByLabel: { root: "label", key: "preparedBy", edgeColon: true },
  previewPreparedBy: { root: "document", key: "preparedBy" },
  previewPoLabel: { root: "label", key: "poNo", edgeColon: true },
  previewPo: { root: "document", key: "poNumber" },
  previewClientName: { root: "document", key: "clientName" },
  previewClientAddress: { root: "document", key: "clientAddress" },
  previewClientEmail: { root: "document", key: "clientEmail", stripPrefix: true },
  previewReLabel: { root: "label", key: "re", edgeColon: true },
  previewRe: { root: "document", key: "re", uppercase: true },
  previewContactLabel: { root: "label", key: "contact", edgeColon: true },
  previewContact: { root: "document", key: "contactPerson" },
  previewPhoneLabel: { root: "label", key: "phone", edgeColon: true },
  previewPhone: { root: "document", key: "phone" },
  previewPageNoLabel: { root: "label", key: "pageNo", edgeColon: true },
  amountWords: { root: "override" },
  previewSubtotalLabel: { root: "label", key: "subtotal" },
  previewSubtotal: { root: "override" },
  previewAdjustmentLabel: { root: "override" },
  previewAdjustment: { root: "override" },
  previewRemainingLabel: { root: "override" },
  previewRemaining: { root: "override" },
  previewTotalLabel: { root: "label", key: "total" },
  previewTotal: { root: "override" },
  previewBankHeading: { root: "bank", key: "heading" },
  previewBankLineOne: { root: "bank", key: "lineOne" },
  previewBankLineTwo: { root: "bank", key: "lineTwo" },
  previewFooterGreeting: { root: "label", key: "footerGreeting" },
  previewFooterCompany: { root: "settings", key: "companyName" },
  previewSnHeader: { root: "override" },
  previewDescriptionHeader: { root: "override" },
  previewQtyHeader: { root: "override" },
  previewUomHeader: { root: "override" },
  previewRateHeader: { root: "override" },
  previewAmountHeader: { root: "override" },
};

const movablePreviewBlockIds = [
  "previewHeaderBlock",
  "paperLogo",
  "previewDocumentType",
  "bizsafeLogo",
  "previewCompanyBlock",
  "previewClientBlock",
  "previewDocumentInfoBlock",
  "previewReLine",
  "previewPageNo",
  "previewItemsTable",
  "previewSnHeader",
  "previewDescriptionHeader",
  "previewQtyHeader",
  "previewUomHeader",
  "previewRateHeader",
  "previewAmountHeader",
  "previewTotalsBlock",
  "previewSubtotalRow",
  "previewAdjustmentRow",
  "previewRemainingRow",
  "previewTotalRow",
  "bankDetails",
  "previewFooterBlock",
  "stampImage",
];

const documentInfoPreviewIds = new Set([
  "previewDocNoLabel",
  "previewDocNo",
  "previewPoLabel",
  "previewPo",
  "previewDateLabel",
  "previewDate",
  "previewPreparedByLabel",
  "previewPreparedBy",
  "previewContactLabel",
  "previewContact",
  "previewPhoneLabel",
  "previewPhone",
  "previewPageNoLabel",
  "previewPageNo",
]);

const defaultClients = [
  {
    name: "DEZIGN FORMAT PTE LTD",
    address: "Woodlands Spectrum 1, 2 Woodlands Sector 1, #03-21/23. Singapore 738068",
    email: "weixuan.lim@dezignformat.com.sg",
  },
  {
    name: "SENG SOON ELECTRICAL ENGINEERING PTE LTD",
    address: "3006 Ubi Rd 1 #02-358,Singapore 408700",
    email: "admin@sengsoon.com.sg",
  },
  {
    name: "PRAXIS CONTRACTOR PTE LTD",
    address: "BLK 3013, Bedok Industrial park E #01-2140. Singapore 489979",
    email: "praxis_contractors@yahoo.com.sg",
  },
  {
    name: "LWH BUILDER PTE LTD",
    address: "41 Kim Chuan Drive,  #06-01, Singapore 537091",
    email: "wendy_ke@live.com |tin.mar.aye@lwhconst.com.sg",
  },
  {
    name: "SUNBEAM M&E PTE LTD",
    address: "3 Little Road, #03-01 CRF Building, Singapore 536982",
    email: "jasminephan@sunbeam-me.com",
  },
  {
    name: "JH CONSTRUCTION PTE LTD",
    address: "41 Kim Chuan Drive,  #06-03, Singapore 537091",
    email: "wendy_ke@live.com |tin.mar.aye@lwhconst.com.sg",
  },
  {
    name: "KWANG FONG CONTRACTOR PTE LTD",
    address: "605BTampines Street 61 # 14,316, Singapore 522605",
    email: "kohmengkok@yahoo.com",
  },
  {
    name: "MUSA 24 HOURS PRINTING PTE LTD",
    address: "26 Kallang Place #02-11, Singapore 339157",
    email: "sales@24hours-printing.com",
  },
  {
    name: "EngMech (Singapore) Private Limited",
    address: "Block 9008 Tampines Street 93 #01-41/43",
    email: "(65) 6787 3641",
  },
  {
    name: "AMPERE ENGINEERING PTE LTD",
    address: "101 Upper Cross Street, #04-05 People's Park Centre, Singapore 058357",
    email: "zonglin.chua@ampere.com.sg",
  },
];

const defaultRecords = [
  ["2026-04-05T21:53:59", "20260090", "SENG SOON ELECTRICAL ENGINEERING PTE LTD", "2026-04-06"],
  ["2026-04-05T23:48:57", "20260091", "SENG SOON ELECTRICAL ENGINEERING PTE LTD", "2026-04-06"],
  ["2026-04-06T23:45:52", "20260092", "DEZIGN FORMAT PTE LTD", "2026-04-07"],
  ["2026-04-10T21:24:58", "20260093", "KWANG FONG CONTRACTOR PTE LTD", "2026-04-11"],
  ["2026-04-10T21:43:53", "20260094", "KWANG FONG CONTRACTOR PTE LTD", "2026-04-11"],
  ["2026-04-12T10:38:36", "20260095", "SENG SOON ELECTRICAL ENGINEERING PTE LTD", "2026-04-12"],
  ["2026-04-12T12:03:06", "20260096", "MUSA 24 HOURS PRINTING PTE LTD", "2026-04-12"],
  ["2026-04-12T19:01:49", "20260097", "DEZIGN FORMAT PTE LTD", "2026-04-13"],
  ["2026-04-12T20:35:23", "20260098", "DEZIGN FORMAT PTE LTD", "2026-04-13"],
  ["2026-04-13T07:42:17", "20260099", "DEZIGN FORMAT PTE LTD", "2026-04-13"],
  ["2026-04-13T22:16:52", "20260100", "DEZIGN FORMAT PTE LTD", "2026-04-13"],
  ["2026-04-13T23:07:31", "20260101", "SUNBEAM M&E PTE LTD", "2026-04-13"],
  ["2026-04-15T22:21:31", "20260102", "EngMech (Singapore) Private Limited", "2026-04-15"],
  ["2026-04-20T20:38:42", "20260103", "AMPERE ENGINEERING PTE LTD", "2026-04-21"],
  ["2026-04-23T22:16:32", "20260104", "DEZIGN FORMAT PTE LTD", "2026-04-24"],
  ["2026-04-27T20:13:10", "20260105", "DEZIGN FORMAT PTE LTD", "2026-04-28"],
  ["2026-04-27T23:32:01", "20260106", "DEZIGN FORMAT PTE LTD", "2026-04-28"],
  ["2026-04-28T12:08:23", "20260107", "Client", "2026-04-29"],
].map(([savedAt, documentNumber, company, date]) => ({
  savedAt,
  documentNumber,
  company,
  date,
  pdf: "PDF",
  excel: "Excel",
}));

const dom = {};
let appState = createDefaultState();
let toastTimer = 0;
let previewDrag = null;
let selectedPreviewMoveId = "";
let selectedPreviewMoveIds = new Set();
let undoStack = [];
let redoStack = [];
let lastDocumentSnapshot = "";
let historyPaused = false;
let previewEditSnapshot = null;
let activeDescriptionEditor = null;
let previewFitFrame = 0;

function createDefaultState() {
  const settings = copy(defaultSettings);
  return {
    clients: copy(defaultClients),
    records: copy(defaultRecords),
    locked: true,
    previewEditMode: false,
    previewOverrides: {},
    previewLayout: {},
    previewStyles: {},
    previewScale: 1,
    settings,
    document: {
      type: settings.documentTypes[0],
      number: settings.nextDocumentNumber,
      dateMode: "tomorrow",
      date: tomorrowInput(),
      preparedBy: settings.defaultPreparedBy,
      clientName: "",
      clientAddress: "",
      clientContactPrefix: "",
      clientEmail: "",
      re: "",
      contactPerson: settings.defaultContactPerson,
      phone: settings.defaultPhone,
      poNumber: "",
      invoiceClaimNumber: 1,
      invoiceClaimLabelText: automaticInvoiceClaimLabel({ invoiceClaimNumber: 1 }),
      invoiceClaimAmount: 0,
      contractValue: 0,
      previouslyPaid: 0,
      adjustmentType: "NONE",
      gstRate: settings.defaultGstRate,
      adjustmentAmount: 0,
      items: [emptyItem()],
    },
  };
}

function emptyItem() {
  return {
    serial: "",
    description: "",
    descriptionHtml: "",
    qty: "",
    uom: "",
    rate: "",
  };
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function tomorrowInput() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toInputDate(date);
}

function todayInput() {
  return toInputDate(new Date());
}

function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateForMode(mode) {
  if (mode === "today") return todayInput();
  if (mode === "tomorrow") return tomorrowInput();
  return appState?.document?.date || todayInput();
}

function inferDateMode(value) {
  if (value === todayInput()) return "today";
  if (value === tomorrowInput()) return "tomorrow";
  return "other";
}

function findClient(name) {
  const needle = normalize(name);
  return appState.clients.find((client) => normalize(client.name) === needle);
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeAdjustmentTypes(value, fallback = defaultSettings.adjustmentTypes) {
  const list = cleanList(value, fallback);
  const seen = new Set();
  const normalized = [];
  list.forEach((item) => {
    const option = parseAdjustmentOption(item);
    const key = normalize(option.label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    normalized.push(formatAdjustmentOptionSetting(option));
  });
  if (!seen.has("none")) {
    normalized.unshift("NONE");
  }
  normalized.sort((a, b) => (adjustmentOptionLabel(a) === "NONE" ? -1 : adjustmentOptionLabel(b) === "NONE" ? 1 : 0));
  return normalized;
}

function parseAdjustmentOption(value) {
  let text = String(value || "").trim();
  let sign = 0;
  if (!text) return { label: "NONE", sign };
  if (/^[+-]/.test(text)) {
    sign = text[0] === "-" ? -1 : 1;
    text = text.slice(1).trim();
  }
  if (/[+-]$/.test(text)) {
    sign = text.slice(-1) === "-" ? -1 : 1;
    text = text.slice(0, -1).trim();
  }
  const label = text || "NONE";
  const labelKey = normalize(label);
  if (labelKey === "none") return { label: "NONE", sign: 0 };
  if (!sign) {
    sign = labelKey === "discount" || labelKey === "previously paid" ? -1 : 1;
  }
  return { label: uppercaseText(label), sign };
}

function formatAdjustmentOptionSetting(option) {
  if (normalize(option.label) === "none") return "NONE";
  return `${option.sign < 0 ? "-" : "+"} ${option.label}`;
}

function adjustmentOptionLabel(value) {
  return parseAdjustmentOption(value).label;
}

function currentAdjustmentOption() {
  const currentLabel = normalize(appState.document.adjustmentType || "NONE");
  const rawOption = appState.settings.adjustmentTypes.find((type) => normalize(adjustmentOptionLabel(type)) === currentLabel);
  return parseAdjustmentOption(rawOption || appState.document.adjustmentType || "NONE");
}

function clientNameText(value) {
  return uppercaseText(value || "");
}

function shouldShowPoNo(type = appState.document.type) {
  const selectedType = normalize(type);
  return appState.settings.poDocumentTypes.some((documentType) => normalize(documentType) === selectedType);
}

function shouldDisplayPoNo(document = appState.document) {
  return shouldShowPoNo(document.type) && String(document.poNumber || "").trim().length > 0;
}

function isInvoiceDocument(type = appState.document.type) {
  return normalize(type) === "invoice";
}

function isQuotationDocument(type = appState.document.type) {
  return normalize(type) === "quotation";
}

function shouldShowAmountWords(document = appState.document) {
  return isInvoiceDocument(document.type) || isQuotationDocument(document.type) || document.adjustmentType !== "NONE";
}

function ordinalNumber(value) {
  const number = Math.max(1, Math.floor(Number(value || 1)));
  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${number}th`;
  const mod10 = number % 10;
  if (mod10 === 1) return `${number}st`;
  if (mod10 === 2) return `${number}nd`;
  if (mod10 === 3) return `${number}rd`;
  return `${number}th`;
}

function automaticInvoiceClaimLabel(document = appState.document) {
  const n = Number(document.invoiceClaimNumber) || 1;
  const suffix = (n) => {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  return `${n}${suffix(n)} claim amount`;
}

function invoiceClaimLabel(document = appState.document) {
  return String(document.invoiceClaimLabelText || "").trim() || automaticInvoiceClaimLabel(document);
}

function syncInvoiceClaimLabel(previousClaimNumber) {
  const currentLabel = String(appState.document.invoiceClaimLabelText || "").trim();
  const previousAuto = automaticInvoiceClaimLabel({ invoiceClaimNumber: previousClaimNumber || 1 });
  if (!currentLabel || normalize(currentLabel) === normalize(previousAuto)) {
    appState.document.invoiceClaimLabelText = automaticInvoiceClaimLabel(appState.document);
    if (dom.invoiceClaimLabelInput) dom.invoiceClaimLabelInput.value = appState.document.invoiceClaimLabelText;
  }
}

function invoiceRemainingBalance(document = appState.document) {
  return Number(document.contractValue || 0) - Number(document.previouslyPaid || 0);
}

function invoiceNoteText(totals, document = appState.document) {
  return "";
}

function promptInvoiceClaimNumber() {
  const current = Math.max(1, Math.floor(Number(appState.document.invoiceClaimNumber || 1)));
  let answer = null;
  try {
    answer = window.prompt("Which number invoice is this? Use 1, 2, 3, 4, 5...", String(current));
  } catch (error) {
    renderAdjustmentControls();
    dom.invoiceClaimNumber?.focus();
    showToast("Set the invoice number in the invoice section.");
    return current;
  }
  if (answer === null) return current;
  const next = Math.max(1, Math.floor(Number(answer || current)));
  appState.document.invoiceClaimNumber = next;
  syncInvoiceClaimLabel(current);
  if (dom.invoiceClaimNumber) dom.invoiceClaimNumber.value = next;
  return next;
}

function init() {
  console.log("Init starting...");
  try {
    cacheDom();
    bindEvents();
    loadTheme();
    renderLoginState();
    
    loadState().then(() => {
      // Sync accounts in background to ensure isAdmin() is accurate
      getAccounts().then(() => {
        renderLoginState();
        refreshAll();
      }).catch(err => {
        console.error("Account sync failed:", err);
        renderLoginState();
        refreshAll();
      });
      setupCloudRealtime();
    }).catch(err => {
      console.error("State load failed:", err);
      renderLoginState();
      refreshAll();
    });
    window.addEventListener("resize", schedulePreviewFitScale);
    console.log("Init complete.");
  } catch (err) {
    console.error("Critical Init Error:", err);
    alert("Critical Init Error: " + err.message);
  }
}

function setupCloudRealtime() {
  if (!unityDb) return;
  unityDb
    .channel('public:global_config')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_config', filter: 'key=eq.app_state' }, payload => {
       const remoteState = payload.new.data;
       if (remoteState) {
         appState = normalizeState({ ...appState, ...remoteState });
         refreshAll();
         showToast("Cloud sync: Template updated from another device.");
       }
    })
    .subscribe();
}

function cacheDom() {
  [
    "settingsButton",
    "adminPanelOverlay",
    "closeAdminPanelButton",
    "adminPanelButton",
    "openToolsButton",
    "closeToolsButton",
    "closeSettingsButton",
    "cancelSettingsButton",
    "restoreSettingsButton",
    "newDocumentButton",
    "saveDocumentButton",
    "printButton",
    "exportButton",
    "editPreviewButton",
    "cancelPreviewButton",
    "savePreviewButton",
    "logoutButton",
    "settingsEditPreviewButton",
    "settingsCancelPreviewButton",
    "settingsSavePreviewButton",
    "boxSpacingInput",
    "letterSpacingInput",
    "previewHint",
    "previewFormatbar",
    "boldButton",
    "italicButton",
    "underlineButton",
    "fontFamilySelect",
    "fontSizeInput",
    "fontWeightSelect",
    "fontColorInput",
    "backgroundColorInput",
    "clearBackgroundButton",
    "textAlignSelect",
    "boxXInput",
    "boxYInput",
    "boxWidthInput",
    "boxHeightInput",
    "borderWidthInput",
    "borderStyleSelect",
    "borderSideSelect",
    "borderColorInput",
    "clearBorderButton",
    "resetSelectedStyleButton",
    "loginScreen",
    "loginForm",
    "loginUsername",
    "loginPassword",
    "rememberMe",
    "loginError",
    "showCreateAccount",
    "showForgotPassword",
    "createAccountForm",
    "createUsername",
    "createPassword",
    "confirmPassword",
    "createNickname",
    "createAccountError",
    "backToLoginFromCreate",
    "forgotPasswordForm",
    "universalPasswordInput",
    "resetUsername",
    "resetNewPassword",
    "forgotPasswordError",
    "backToLoginFromForgot",
    "exportProfileButton",
    "importProfileButton",
    "profileImportInput",
    "adminUserManagement",
    "adminUserList",
    "logoutButton",
    "appShell",
    "toolsPanel",
    "brandLogo",
    "appVersion",
    "appTitle",
    "appSubtitle",
    "documentStatus",
    "documentType",
    "documentNumber",
    "documentDateMode",
    "documentDate",
    "clientSelect",
    "poNumberField",
    "poNumber",
    "clientAddress",
    "clientContactPrefix",
    "clientEmail",
    "referenceText",
    "descriptionBoldButton",
    "descriptionItalicButton",
    "descriptionUnderlineButton",
    "descriptionSuperscriptButton",
    "addItemButton",
    "itemRows",
    "adjustmentType",
    "adjustmentTypeGroup",
    "gstRate",
    "adjustmentAmount",
    "gstRateGroup",
    "adjustmentAmountGroup",
    "invoiceClaimPanel",
    "invoiceClaimNumber",
    "invoiceClaimLabelInput",
    "invoiceClaimAmount",
    "contractValue",
    "previouslyPaid",
    "remainingBalanceValue",
    "summaryStrip",
    "summarySubtotalCard",
    "summarySubtotalLabel",
    "summaryAdjustmentCard",
    "summaryRemainingCard",
    "summaryRemainingLabel",
    "summaryRemainingValue",
    "summaryTotalCard",
    "summaryTotalLabel",
    "subtotalValue",
    "adjustmentLabel",
    "adjustmentValue",
    "totalValue",
    "paperLogo",
    "bizsafeLogo",
    "stampImage",
    "previewDocumentType",
    "previewCompanyName",
    "previewCompanyAddress",
    "previewCompanyEmail",
    "previewDocNoLabel",
    "previewDocNo",
    "previewDateLabel",
    "previewDate",
    "previewPreparedByLabel",
    "previewPreparedBy",
    "previewPoRow",
    "previewPoPlaceholder",
    "previewPoLabel",
    "previewPo",
    "previewClientName",
    "previewClientAddress",
    "previewClientEmail",
    "previewReLine",
    "previewReLabel",
    "previewRe",
    "previewContactLabel",
    "previewContact",
    "previewPhoneLabel",
    "previewPhone",
    "previewPageNoLabel",
    "previewPageNo",
    "previewPrimaryPage",
    "previewFitContent",
    "previewItems",
    "previewItemsTable",
    "previewSnHeader",
    "previewDescriptionHeader",
    "previewQtyHeader",
    "previewUomHeader",
    "previewRateHeader",
    "previewAmountHeader",
    "previewContinuationPages",
    "previewInvoiceNote",
    "previewTotalNotes",
    "amountWords",
    "previewSubtotalRow",
    "previewSubtotalLabel",
    "previewSubtotal",
    "previewAdjustmentRow",
    "previewAdjustmentLabel",
    "previewAdjustment",
    "previewRemainingRow",
    "previewRemainingLabel",
    "previewRemaining",
    "previewTotalLabel",
    "previewTotal",
    "bankDetails",
    "previewBankHeading",
    "previewBankLineOne",
    "previewBankLineTwo",
    "previewFooterGreeting",
    "previewFooterCompany",
    "previewHeaderBlock",
    "previewCompanyBlock",
    "previewClientBlock",
    "previewDocumentInfoBlock",
    "previewTotalsBlock",
    "previewFooterBlock",
    "printArea",
    "clientsPage",
    "recordsPage",
    "clientCount",
    "clientSearch",
    "newClientButton",
    "clientList",
    "clientForm",
    "clientNameInput",
    "clientAddressInput",
    "clientEmailInput",
    "addClientEmailButton",
    "recordCount",
    "recordSearch",
    "recordList",
    "unlockOverlay",
    "unlockForm",
    "unlockPasswordInput",
    "unlockError",
    "unlockCancelButton",
    "settingsOverlay",
    "settingsForm",
    "settingDefaultPreparedBy",
    "settingDefaultContact",
    "settingDefaultPhone",
    "settingDefaultGstRate",
    "settingCurrencySymbol",
    "settingNextDocumentNumber",
    "settingCompanyName",
    "settingCompanyAddress",
    "settingCompanyEmail",
    "settingDocumentTypes",
    "settingPoDocumentTypes",
    "settingUomOptions",
    "settingAdjustmentTypes",
    "settingPageSize",
    "settingPageOrientation",
    "settingCompressToFitPage",
    "settingDarkMode",
    "settingPdfSavePath",
    "settingExcelSavePath",
    "settingsSectionApp",
    "settingsSectionCompany",
    "settingsSectionDocuments",
    "settingsSectionAppearance",
    "settingsSectionSavePaths",
    "settingsSectionPortability",
    "settingsSectionPreviewActions",
    "settingsSectionLabels",
    "settingNextDocumentNumberGroup",
    "settingDocumentNoLabel",
    "settingDocumentDateLabel",
    "settingPreparedByLabel",
    "settingContactLabel",
    "settingPhoneLabel",
    "settingPageNoLabel",
    "settingPoLabel",
    "settingReLabel",
    "settingEmailPrefix",
    "settingSubtotalLabel",
    "settingTotalLabel",
    "settingFooterGreeting",
    "settingBankHeading",
    "settingBankLineOne",
    "settingBankLineTwo",
    "settingLogoUrl",
    "settingBizsafeUrl",
    "settingStampUrl",
    "settingPersonalUsername",
    "settingPersonalNickname",
    "settingPersonalPassword",
    "updateProfileButton",
    "previewAdminGroup",
    "setGlobalDefaultButton",
    "themeToggleButton",
    "recordStats",
    "toast",
  ].forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function getStorageKey() {
  return STORAGE_KEY;
}

function getUserPrefsKey() {
  const user = localStorage.getItem(AUTH_USER_KEY) || "default";
  return `${STORAGE_KEY}-prefs-${user}`;
}

async function loadState() {
  try {
    // 1. Initial load from Local Storage (Fast Start)
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      appState = normalizeState(JSON.parse(stored));
    } else {
      appState = createDefaultState();
    }

    // 2. Fetch latest from Cloud (Supabase) if available
    if (unityDb) {
      const { data, error } = await unityDb
        .from('global_config')
        .select('data')
        .eq('key', 'app_state')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Cloud state load failed:", error);
      } else if (data && data.data) {
        // Update local global template for persistence
        const cloudTemplate = {
          previewLayout: data.data.previewLayout,
          previewStyles: data.data.previewStyles,
          previewOverrides: data.data.previewOverrides
        };
        localStorage.setItem(GLOBAL_TEMPLATE_KEY, JSON.stringify(cloudTemplate));
        
        // Merge cloud state (mostly for templates/settings)
        appState = normalizeState({ ...appState, ...data.data });
        console.log("Cloud state loaded and persisted successfully.");
      }
    }

    // Load personal preferences (Prepared By, etc.)
    const prefs = localStorage.getItem(getUserPrefsKey());
    if (prefs) {
      const p = JSON.parse(prefs);
      appState.document.preparedBy = p.preparedBy || appState.document.preparedBy;
      appState.document.contactPerson = p.contactPerson || appState.document.contactPerson;
      appState.document.phone = p.phone || appState.document.phone;
    }
  } catch (e) {
    if (!appState) appState = createDefaultState();
  }
  appState = normalizeState(appState);
  appState.locked = true;
  lastDocumentSnapshot = JSON.stringify(appState.document);
}

function saveState(options = {}) {
  if (!options.skipHistory) trackDocumentHistory();
  if (appState.locked && !options.force) return;
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(appState));
    
    // If admin is saving, also force update the Global Default template
    if (isAdmin()) {
      const globalTemplate = {
        previewLayout: appState.previewLayout,
        previewStyles: appState.previewStyles,
        previewOverrides: appState.previewOverrides
      };
      localStorage.setItem(GLOBAL_TEMPLATE_KEY, JSON.stringify(globalTemplate));

      // 3. Push to Cloud (SupabaseClient)
      if (unityDb) {
        unityDb.from('global_config').upsert({
          key: 'app_state',
          data: {
             previewLayout: appState.previewLayout,
             previewStyles: appState.previewStyles,
             previewOverrides: appState.previewOverrides,
             settings: appState.settings
          },
          updated_at: new Date().toISOString()
        }).then(() => {
           console.log("Cloud sync: State pushed to Supabase.");
        });
      }
    }

    // Save personal preferences separately
    const prefs = {
      preparedBy: appState.document?.preparedBy,
      contactPerson: appState.document?.contactPerson,
      phone: appState.document?.phone
    };
    localStorage.setItem(getUserPrefsKey(), JSON.stringify(prefs));
  } catch (err) {
    console.error("Storage error:", err);
    if (err.name === "QuotaExceededError") {
      showToast("Browser storage full! Delete old records or clear browser data.");
    } else {
      throw err;
    }
  }
  
  updateUndoRedoButtons();
}

function trackDocumentHistory() {
  if (historyPaused) return;
  const nextSnapshot = JSON.stringify(appState.document);
  if (!lastDocumentSnapshot) {
    lastDocumentSnapshot = nextSnapshot;
    return;
  }
  if (nextSnapshot !== lastDocumentSnapshot) {
    undoStack.push(lastDocumentSnapshot);
    if (undoStack.length > 80) undoStack.shift();
    redoStack = [];
    lastDocumentSnapshot = nextSnapshot;
  }
}

function normalizeState(state) {
  const fallback = createDefaultState();
  const normalized = {
    ...fallback,
    ...state,
    clients: (Array.isArray(state.clients) ? state.clients : fallback.clients).map(normalizeClient),
    records: (Array.isArray(state.records) ? state.records : fallback.records).map(normalizeRecord),
    settings: normalizeSettings(state.settings),
    previewEditMode: false,
    previewOverrides: state.previewOverrides && typeof state.previewOverrides === "object" ? state.previewOverrides : {},
    previewLayout: state.previewLayout && typeof state.previewLayout === "object" ? state.previewLayout : {},
    previewStyles: state.previewStyles && typeof state.previewStyles === "object" ? state.previewStyles : {},
    document: normalizeDocument(state.document, fallback.document),
  };

  // Force apply global template defaults into the state
  try {
    const global = localStorage.getItem(GLOBAL_TEMPLATE_KEY);
    if (global) {
      const t = JSON.parse(global);
      if (t.previewLayout) normalized.previewLayout = { ...normalized.previewLayout, ...t.previewLayout };
      if (t.previewStyles) normalized.previewStyles = { ...normalized.previewStyles, ...t.previewStyles };
      if (t.previewOverrides) normalized.previewOverrides = { ...normalized.previewOverrides, ...t.previewOverrides };
    }
  } catch (e) {}

  if (!normalized.settings.documentTypes.includes(normalized.document.type)) {
    normalized.settings.documentTypes.push(normalized.document.type);
  }
  (normalized.document.items || []).forEach((item) => {
    if (item.uom && !normalized.settings.uomOptions.includes(item.uom)) {
      normalized.settings.uomOptions.push(item.uom);
    }
  });
  return normalized;
}

function normalizeRecord(record = {}) {
  const normalized = {
    ...record,
    savedAt: String(record.savedAt || new Date().toISOString()),
    documentNumber: String(record.documentNumber || ""),
    company: String(record.company || ""),
    date: record.date || todayInput(),
  };
  normalized.documentType = recordDocumentType(normalized);
  return normalized;
}

function normalizeDocument(document = {}, fallbackDocument = createDefaultState().document) {
  const normalized = {
    ...copy(fallbackDocument),
    ...(document || {}),
  };
  normalized.type = String(normalized.type || fallbackDocument.type || "QUOTATION").toUpperCase();
  normalized.number = String(normalized.number || "");
  normalized.date = normalized.date || fallbackDocument.date;
  normalized.dateMode = normalized.dateMode || inferDateMode(normalized.date);
  normalized.preparedBy = String(normalized.preparedBy || "");
  normalized.clientName = clientNameText(normalized.clientName || "");
  normalized.clientAddress = String(normalized.clientAddress || "");
  normalized.clientEmail = String(normalized.clientEmail || "");
  normalized.re = uppercaseText(normalized.re || "");
  normalized.contactPerson = String(normalized.contactPerson || "");
  normalized.phone = String(normalized.phone || "");
  normalized.poNumber = String(normalized.poNumber || "");
  normalized.invoiceClaimNumber = Math.max(1, Math.floor(Number(normalized.invoiceClaimNumber || 1)));
  normalized.invoiceClaimLabelText = String(normalized.invoiceClaimLabelText || "").trim() || automaticInvoiceClaimLabel(normalized);
  normalized.invoiceClaimAmount = Number(normalized.invoiceClaimAmount || 0);
  normalized.contractValue = Number(normalized.contractValue || 0);
  normalized.previouslyPaid = Number(normalized.previouslyPaid || 0);
  normalized.adjustmentType = adjustmentOptionLabel(normalized.adjustmentType || "NONE");
  normalized.gstRate = Number(normalized.gstRate || 0);
  normalized.adjustmentAmount = Number(normalized.adjustmentAmount || 0);
  normalized.items = Array.isArray(normalized.items) && normalized.items.length ? normalized.items.map(normalizeItem) : [emptyItem()];
  return normalized;
}

function normalizeClient(client = {}) {
  return {
    name: clientNameText(client.name || ""),
    address: String(client.address || ""),
    email: String(client.email || ""),
  };
}

function normalizeItem(item = {}) {
  const descriptionHtml = sanitizeDescriptionHtml(item.descriptionHtml || "");
  const descriptionText = String(item.description || descriptionHtmlToText(descriptionHtml) || "");
  const normalized = {
    serial: String(item.serial || ""),
    description: descriptionText,
    descriptionHtml,
    qty: String(item.qty || ""),
    uom: String(item.uom || ""),
    rate: String(item.rate || ""),
  };
  const hasRealLine = normalized.serial.trim() || plainDescriptionText(normalized).trim() || normalized.rate.trim();
  if (!hasRealLine) {
    normalized.qty = "";
    normalized.uom = "";
  }
  return normalized;
}

function nextItemFromPrevious() {
  const item = emptyItem();
  const previousIndex = appState.document.items.length - 1;
  item.serial = nextSerialValue(serialSeedAt(previousIndex));
  return item;
}

function serialSeedAt(index, fallbackValue = "") {
  const item = appState.document.items[index];
  const value = String(fallbackValue || item?.serial || "").trim();
  if (value) return value;
  return String(itemLogicalIndex(index) || 1);
}

function itemLogicalIndex(index) {
  let count = 0;
  for (let i = 0; i <= index; i++) {
    const it = appState.document.items[i];
    if (it && plainDescriptionText(it).trim()) {
      count++;
    }
  }
  return count;
}

function nextSerialValue(value) {
  const text = String(value || "").trim();
  if (!text) return "1";
  const compound = text.match(/^(.+?)([-.])(\d+)$/);
  if (compound) {
    return `${compound[1]}${compound[2]}${Number(compound[3]) + 1}`;
  }
  if (/^\d+$/.test(text)) {
    return String(Number(text) + 1);
  }
  if (/^[A-Za-z]+$/.test(text)) {
    return `${text}-1`;
  }
  return `${text}-1`;
}

function updateFollowingSerials(index, previousValue = "") {
  const items = appState.document.items;
  if (!items[index]) return;
  let oldSeed = serialSeedAt(index, previousValue);
  let newSeed = serialSeedAt(index);
  for (let nextIndex = index + 1; nextIndex < items.length; nextIndex += 1) {
    const oldExpected = nextSerialValue(oldSeed);
    const newExpected = nextSerialValue(newSeed);
    const current = String(items[nextIndex].serial || "").trim();
    if (current && normalize(current) !== normalize(oldExpected)) {
      break;
    }
    items[nextIndex].serial = newExpected;
    oldSeed = oldExpected;
    newSeed = newExpected;
  }
}

function normalizeSettings(settings = {}) {
  const merged = {
    ...copy(defaultSettings),
    ...settings,
    labels: {
      ...defaultSettings.labels,
      ...(settings.labels || {}),
    },
    bank: {
      ...defaultSettings.bank,
      ...(settings.bank || {}),
    },
    page: {
      ...defaultSettings.page,
      ...(settings.page || {}),
    },
  };
  merged.documentTypes = cleanList(settings.documentTypes, defaultSettings.documentTypes);
  merged.poDocumentTypes = cleanList(settings.poDocumentTypes, defaultSettings.poDocumentTypes)
    .filter((type) => merged.documentTypes.some((documentType) => normalize(documentType) === normalize(type)));
  if (!merged.poDocumentTypes.length) {
    merged.poDocumentTypes = merged.documentTypes.some((type) => normalize(type) === "invoice")
      ? ["INVOICE"]
      : [merged.documentTypes[0]].filter(Boolean);
  }
  merged.uomOptions = cleanList(settings.uomOptions, defaultSettings.uomOptions);
  merged.adjustmentTypes = normalizeAdjustmentTypes(settings.adjustmentTypes, defaultSettings.adjustmentTypes);
  merged.currencySymbol = String(merged.currencySymbol || "$").slice(0, 4);
  merged.defaultGstRate = Number(merged.defaultGstRate || 0);
  merged.defaultContactPerson = String(merged.defaultContactPerson || "");
  merged.defaultPhone = String(merged.defaultPhone || "");
  merged.nextDocumentNumber = String(merged.nextDocumentNumber || HIDDEN_NEXT_DOCUMENT);
  merged.pdfSavePath = String(merged.pdfSavePath || "");
  merged.excelSavePath = String(merged.excelSavePath || "");
  merged.labels.emailPrefix = normalizeEmailPrefix(merged.labels.emailPrefix);
  merged.page = normalizePageSettings(merged.page);
  merged.darkMode = Boolean(settings.darkMode);
  return merged;
}

function normalizePageSettings(page = {}) {
  const size = String(page.size || defaultSettings.page.size).toUpperCase();
  const orientation = String(page.orientation || defaultSettings.page.orientation).toLowerCase();
  return {
    size: PAGE_SPECS[size] ? size : defaultSettings.page.size,
    orientation: orientation === "landscape" ? "landscape" : "portrait",
    compressToFit: Boolean(page.compressToFit),
  };
}

function cleanList(value, fallback) {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  const list = source.map((item) => (item == null ? "" : String(item).trim())).filter(Boolean);
  return [...new Set(list.length ? list : fallback)];
}

function bindEvents() {
  dom.settingsButton.addEventListener("click", openSettings);
  dom.adminPanelButton.addEventListener("click", openAdminPanel);
  dom.closeAdminPanelButton.addEventListener("click", closeAdminPanel);
  dom.adminPanelOverlay.addEventListener("click", (event) => {
    if (event.target === dom.adminPanelOverlay) closeAdminPanel();
  });
  dom.openToolsButton.addEventListener("click", () => openToolsPanel("records"));
  dom.closeToolsButton.addEventListener("click", closeToolsPanel);
  dom.closeSettingsButton.addEventListener("click", closeSettings);
  dom.cancelSettingsButton.addEventListener("click", closeSettings);
  dom.unlockForm.addEventListener("submit", handleUnlockSubmit);
  dom.unlockCancelButton.addEventListener("click", closeUnlockDialog);
  dom.unlockOverlay.addEventListener("click", (event) => {
    if (event.target === dom.unlockOverlay) closeUnlockDialog();
  });
  dom.settingsOverlay.addEventListener("click", (event) => {
    if (event.target === dom.settingsOverlay) closeSettings();
  });
  dom.settingsForm.addEventListener("submit", saveSettings);
  dom.restoreSettingsButton.addEventListener("click", restoreSettings);
  dom.newDocumentButton.addEventListener("click", saveDocumentRecord);
  dom.saveDocumentButton.addEventListener("click", saveDocumentRecord);
  dom.printButton.addEventListener("click", printPdf);
  dom.exportButton.addEventListener("click", exportExcel);
  dom.editPreviewButton.addEventListener("click", togglePreviewEditMode);
  dom.cancelPreviewButton.addEventListener("click", cancelPreviewEdits);
  dom.savePreviewButton.addEventListener("click", savePreviewEdits);
  dom.logoutButton.addEventListener("click", handleLogoutAction);
  dom.exportProfileButton.addEventListener("click", exportUserProfile);
  dom.importProfileButton.addEventListener("click", () => dom.profileImportInput.click());
  dom.profileImportInput.addEventListener("change", importUserProfile);
  
  document.querySelectorAll(".set-default-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const settingKey = btn.dataset.setting;
      const inputId = btn.dataset.input;
      const value = dom[inputId].value.trim();
      if (value) {
        appState.settings[settingKey] = value;
        saveState();
        showToast(`Default ${settingKey.replace("default", "")} saved!`);
        btn.classList.add("active");
        setTimeout(() => btn.classList.remove("active"), 1000);
      }
    });
  });
  
  dom.settingsEditPreviewButton.addEventListener("click", togglePreviewEditMode);
  dom.settingsCancelPreviewButton.addEventListener("click", cancelPreviewEdits);
  dom.settingsSavePreviewButton.addEventListener("click", savePreviewEdits);
  dom.printArea.addEventListener("input", handlePreviewInput);
  dom.printArea.addEventListener("blur", handlePreviewBlur, true);
  dom.printArea.addEventListener("focusin", handlePreviewFocusIn);
  dom.printArea.addEventListener("pointerdown", handlePreviewPointerDown);
  
  // Login Screen Events
  dom.showCreateAccount.addEventListener("click", () => {
    dom.loginForm.classList.add("hidden");
    dom.createAccountForm.classList.remove("hidden");
  });
  dom.showForgotPassword.addEventListener("click", () => {
    dom.loginForm.classList.add("hidden");
    dom.forgotPasswordForm.classList.remove("hidden");
  });
  dom.backToLoginFromCreate.addEventListener("click", () => {
    dom.createAccountForm.classList.add("hidden");
    dom.loginForm.classList.remove("hidden");
  });
  dom.backToLoginFromForgot.addEventListener("click", () => {
    dom.forgotPasswordForm.classList.add("hidden");
    dom.loginForm.classList.remove("hidden");
  });
  dom.createAccountForm.addEventListener("submit", handleCreateAccount);
  dom.forgotPasswordForm.addEventListener("submit", handleForgotPassword);
  dom.loginForm.addEventListener("submit", handleLogin);  
  bindDescriptionFormatControls();
  bindPreviewFormatControls();
  
  window.addEventListener("keydown", (event) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrl = isMac ? event.metaKey : event.ctrlKey;
    
    if (ctrl) {
      if (event.key === "s") {
        event.preventDefault();
        handleSaveDocument();
      } else if (event.key === "n") {
        event.preventDefault();
        newDocument();
      } else if (event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) handleRedo();
        else handleUndo();
      } else if (event.key === "y") {
        event.preventDefault();
        handleRedo();
      }
    }
  });
  document.addEventListener("pointermove", handlePreviewPointerMove);
  document.addEventListener("pointerup", handlePreviewPointerUp);


  [
    "settingPageSize",
    "settingPageOrientation",
    "settingCompressToFitPage",
    "settingDarkMode"
  ].forEach(id => {
    if (dom[id]) {
      dom[id].addEventListener("change", () => {
        saveSettings();
        if (id === "settingDarkMode") loadTheme();
        refreshCalculationsAndPreview();
      });
    }
  });

  if (dom.updateProfileButton) {
    dom.updateProfileButton.addEventListener("click", handleUpdateProfile);
  }

  if (dom.setGlobalDefaultButton) {
    dom.setGlobalDefaultButton.addEventListener("click", () => {
      savePreviewEdits(); // savePreviewEdits already handles isAdmin() global sync
      showToast("Template has been set as global default for everyone.");
    });
  }

  [
    ["documentType", "type"],
    ["documentNumber", "number"],
    ["poNumber", "poNumber"],
    ["invoiceClaimNumber", "invoiceClaimNumber", "integer"],
    ["invoiceClaimLabelInput", "invoiceClaimLabelText"],
    ["invoiceClaimAmount", "invoiceClaimAmount"],
    ["contractValue", "contractValue"],
    ["previouslyPaid", "previouslyPaid"],
    ["clientAddress", "clientAddress"],
    ["clientContactPrefix", "clientContactPrefix"],
    ["clientEmail", "clientEmail"],
    ["referenceText", "re", "uppercase"],
    ["adjustmentType", "adjustmentType"],
    ["gstRate", "gstRate"],
    ["adjustmentAmount", "adjustmentAmount"],
  ].forEach(([id, key, format]) => {
    dom[id].addEventListener("input", () => {
      const previousValue = appState.document[key];
      let value = dom[id].type === "number" ? Number(dom[id].value || 0) : dom[id].value;
      if (format === "uppercase") {
        value = uppercaseText(value);
        dom[id].value = value;
      } else if (format === "integer") {
        value = Math.max(1, Math.floor(Number(value || 1)));
        dom[id].value = value;
      }
      appState.document[key] = value;
      if (id === "invoiceClaimNumber") {
        syncInvoiceClaimLabel(previousValue);
      }
      saveState();
      if (id === "documentType") {
        if (isInvoiceDocument(value)) {
          promptInvoiceClaimNumber();
          saveState();
        }
        renderPoNumberState();
        renderAdjustmentControls();
      }
      refreshCalculationsAndPreview();
      if (id === "adjustmentType") {
        renderAdjustmentControls();
      }
    });
  });

  dom.documentType.addEventListener("change", () => {
    appState.document.type = dom.documentType.value;
    saveState();
    refreshAll();
  });

  dom.documentDateMode.addEventListener("change", () => {
    appState.document.dateMode = dom.documentDateMode.value;
    if (appState.document.dateMode !== "other") {
      appState.document.date = dateForMode(appState.document.dateMode);
    }
    saveState();
    syncDocumentFields();
    refreshCalculationsAndPreview();
  });

  dom.documentDate.addEventListener("input", () => {
    appState.document.date = dom.documentDate.value;
    appState.document.dateMode = "other";
    saveState();
    syncDocumentFields();
    refreshCalculationsAndPreview();
  });

  dom.clientSelect.addEventListener("change", () => {
    const client = findClient(dom.clientSelect.value);
    appState.document.clientName = clientNameText(dom.clientSelect.value);
    if (client) {
      appState.document.clientAddress = client.address;
      appState.document.clientEmail = chooseEmailForClient(client, appState.document.clientEmail);
    } else {
      appState.document.clientAddress = "";
      appState.document.clientEmail = "";
    }
    saveState();
    syncDocumentFields();
    refreshCalculationsAndPreview();
  });

  dom.addItemButton.addEventListener("click", () => {
    appState.document.items.push(nextItemFromPrevious());
    saveState();
    renderItems();
    refreshCalculationsAndPreview();
  });

  dom.clientSearch.addEventListener("input", renderClients);
  dom.recordSearch.addEventListener("input", renderRecords);
  dom.newClientButton.addEventListener("click", newClientForm);
  dom.clientNameInput.addEventListener("input", () => {
    const name = clientNameText(dom.clientNameInput.value);
    if (dom.clientNameInput.value !== name) dom.clientNameInput.value = name;
  });
  dom.addClientEmailButton.addEventListener("click", addClientEmail);
  dom.clientForm.addEventListener("submit", saveClient);

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dom.unlockOverlay.classList.contains("open")) {
      closeUnlockDialog();
    } else if (event.key === "Escape" && dom.adminPanelOverlay.classList.contains("open")) {
      closeAdminPanel();
    } else if (event.key === "Escape" && dom.settingsOverlay.classList.contains("open")) {
      closeSettings();
    } else if (event.key === "Escape" && dom.toolsPanel.classList.contains("open")) {
      closeToolsPanel();
    }
  });
  
  dom.settingDarkMode.addEventListener("change", (e) => {
    appState.settings.darkMode = e.target.checked;
    saveState();
    applyTheme();
  });
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", appState.settings.darkMode);
}

function refreshAll() {
  renderAppChrome();
  renderDocumentTypeOptions();
  renderAdjustmentTypeOptions();
  renderClientOptions();
  syncDocumentFields();
  renderItems();
  renderAdjustmentControls();
  renderClients();
  renderRecords();
  renderLockedState();
  refreshCalculationsAndPreview();
  renderPreviewEditState();
  applyTheme();
}

function renderLoginState() {
  const auth = localStorage.getItem(AUTH_KEY);
  const signedIn = auth === "yes";
  
  console.log("App Refresh - Persistent Session Auth Check:", { 
    auth_key: AUTH_KEY, 
    status: auth, 
    timestamp: new Date().toLocaleTimeString() 
  });
  
  document.documentElement.classList.toggle("is-authenticated", signedIn);
  
  if (dom.loginScreen) {
    dom.loginScreen.classList.toggle("hidden", signedIn);
  }
  if (dom.appShell) {
    dom.appShell.classList.toggle("locked-out", !signedIn);
  }
  
  if (!signedIn) {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      dom.loginUsername.value = saved;
      dom.rememberMe.checked = true;
    }
  } else {
    const admin = isAdmin();
    if (dom.appVersion) {
      dom.appVersion.classList.toggle("hidden", !admin);
      dom.appVersion.textContent = APP_VERSION;
    }
    dom.adminPanelButton.classList.toggle("hidden", !admin);
    dom.editPreviewButton.classList.toggle("hidden", !admin);
    dom.settingsEditPreviewButton.classList.toggle("hidden", !admin);
    document.querySelectorAll(".set-default-btn").forEach(btn => {
      btn.classList.toggle("hidden", !admin);
    });
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = dom.loginUsername.value.trim().toLowerCase();
  const password = dom.loginPassword.value;
  
  const accounts = await getAccounts();
  const user = accounts.find(a => a.username.toLowerCase() === username && a.password === password);
  
  if (user || (username === LOGIN_USERNAME.toLowerCase() && password === LOGIN_PASSWORD)) {
    const isMaster = username === LOGIN_USERNAME.toLowerCase();
    const approved = isMaster || (user && user.isApproved);
    
    console.log("Login Check:", { username, isMaster, approved, user_found: !!user });

    if (user && user.isBlocked && !isMaster) {
      dom.loginError.textContent = "Your account has been blocked. Contact Admin.";
      return;
    }
    
    if (!approved) {
      dom.loginError.textContent = "Your account is pending approval.";
      return;
    }

    localStorage.setItem(AUTH_KEY, "yes");
    localStorage.setItem(AUTH_USER_KEY, username);
    
    if (dom.rememberMe.checked) {
      localStorage.setItem(REMEMBER_KEY, username);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
    
    loadState();
    if (isMaster) {
      // Ensure master exists in cloud for management visibility
      if (unityDb && !user) {
         unityDb.from('profiles').insert([{ 
           username: LOGIN_USERNAME.toLowerCase(), 
           password: LOGIN_PASSWORD, 
           nickname: "Admin",
           isApproved: true, 
           isAdmin: true,
           createdAt: new Date().toISOString()
         }]).then(() => console.log("Master admin auto-registered in cloud."));
      }
      appState.document.preparedBy = appState.document.preparedBy || "Nihad";
    } else if (user && user.nickname) {
      appState.document.preparedBy = user.nickname;
    }
    dom.loginError.textContent = "";
    dom.loginPassword.value = "";
    renderLoginState();
    refreshAll();
    return;
  }
  dom.loginError.textContent = "Wrong username or password.";
}

function handleLogoutAction() {
  console.log("Logout button clicked");
  if (confirm("Are you sure you want to logout? Any unsaved changes will be lost.")) {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    console.log("Auth keys removed, reloading...");
    location.reload(); 
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("unity-theme", nextTheme);
  showToast(`Switched to ${nextTheme} mode.`);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("unity-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function exportUserProfile() {
  const data = JSON.stringify(appState, null, 2);
  const user = localStorage.getItem(AUTH_USER_KEY) || "user";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `unity-profile-${user}-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Profile exported successfully!");
}

function importUserProfile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && imported.settings && imported.document) {
        appState = normalizeState(imported);
        saveState();
        showToast("Profile imported! Reloading...");
        setTimeout(() => location.reload(), 1000);
      } else {
        showToast("Invalid profile file.");
      }
    } catch (err) {
      showToast("Error reading profile file.");
    }
  };
  reader.readAsText(file);
}

function isAdmin() {
  const username = localStorage.getItem(AUTH_USER_KEY);
  if (!username) return false;
  if (username.toLowerCase() === LOGIN_USERNAME.toLowerCase()) return true;
  
  // Use local accounts cache for synchronous check
  const accounts = getAccountsLocal();
  const user = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
  return !!(user && user.isAdmin);
}

function renderAdminUsers() {
  console.log("Rendering Admin Users...");
  getAccounts().then(accounts => {
    console.log("Accounts received from sync:", accounts);
    const filteredAccounts = accounts.filter(user => user.username.toLowerCase() !== LOGIN_USERNAME.toLowerCase());
    
    if (filteredAccounts.length === 0) {
      dom.adminUserList.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <p class="settings-hint">No other users found in cloud.</p>
          <button class="secondary-button small-button" onclick="renderAdminUsers()">Refresh List</button>
        </div>
      `;
      return;
    }
    
    dom.adminUserList.innerHTML = `
      <div style="margin-bottom: 10px; display: flex; justify-content: flex-end;">
        <button class="ghost-button small-button" onclick="renderAdminUsers()">↻ Refresh</button>
      </div>
    ` + filteredAccounts.map(user => `
      <div class="admin-user-row">
        <div class="user-row-info">
          <strong>${escapeHtml(user.nickname || user.username)}</strong>
          <span>@${escapeHtml(user.username)} | 
            ${user.isBlocked ? '<span class="status-blocked" style="color: var(--danger)">Blocked</span>' : 
              (user.isApproved ? '<span class="status-approved">Approved</span>' : '<span class="status-pending">Pending Approval</span>')}
          </span>
        </div>
        <div class="user-row-actions">
          ${!user.isApproved && !user.isBlocked ? `<button class="primary-button small-button" onclick="handleAdminApproveUser('${escapeAttr(user.username)}')">Approve</button>` : ''}
          ${user.isApproved && !user.isAdmin && !user.isBlocked ? `<button class="secondary-button small-button" style="background: var(--accent); border-color: var(--accent)" onclick="handleAdminSetRole('${escapeAttr(user.username)}', true)">Make Admin</button>` : ''}
          ${user.isApproved && user.isAdmin && user.username.toLowerCase() !== LOGIN_USERNAME.toLowerCase() ? `<button class="secondary-button small-button" onclick="handleAdminSetRole('${escapeAttr(user.username)}', false)">Demote</button>` : ''}
          <button class="secondary-button small-button" onclick="handleAdminToggleBlock('${escapeAttr(user.username)}', ${!user.isBlocked})">
            ${user.isBlocked ? 'Unblock' : 'Block'}
          </button>
          <button class="secondary-button" onclick="handleAdminResetPassword('${escapeAttr(user.username)}')">Reset PWD</button>
          <button class="ghost-button" style="color: var(--danger)" onclick="handleAdminDeleteUser('${escapeAttr(user.username)}')">Delete</button>
        </div>
      </div>
    `).join("");
  }).catch(err => {
    console.error("Error fetching accounts:", err);
    dom.adminUserList.innerHTML = `<p class="error-text">Failed to load users: ${err.message}</p>`;
  });
}

window.handleAdminApproveUser = function(username) {
  if (!isAdmin()) return;
  updateCloudUser(username, { isApproved: true }).then(() => {
    showToast(`User ${username} approved.`);
    renderAdminUsers();
  });
};

window.handleAdminSetRole = function(username, isAdmin) {
  if (!window.isAdmin()) return;
  updateCloudUser(username, { isAdmin }).then(() => {
    showToast(`${username} is now ${isAdmin ? 'an Admin' : 'a standard user'}.`);
    renderAdminUsers();
  });
};

window.handleAdminToggleBlock = function(username, isBlocked) {
  if (!window.isAdmin()) return;
  if (username.toLowerCase() === LOGIN_USERNAME.toLowerCase()) {
    showToast("Master admin cannot be blocked.");
    return;
  }
  updateCloudUser(username, { isBlocked }).then(() => {
    showToast(`User ${username} ${isBlocked ? 'blocked' : 'unblocked'}.`);
    renderAdminUsers();
  });
};

async function updateCloudUser(username, data) {
  if (unityDb) {
    await unityDb.from('profiles').update(data).eq('username', username);
  }
  // Sync local for performance
  const accounts = await getAccountsLocal();
  const user = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
  if (user) {
    Object.assign(user, data);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

window.handleAdminResetPassword = async function(username) {
  if (!isAdmin()) return;
  const newPwd = prompt(`Enter new password for ${username}:`);
  if (!newPwd) return;
  
  await updateCloudUser(username, { password: newPwd });
  showToast(`Password updated for ${username}`);
  renderAdminUsers();
};

window.handleAdminDeleteUser = async function(username) {
  if (!isAdmin()) return;
  if (!confirm(`Are you sure you want to delete user ${username}? This will also PERMANENTLY WIPE all their saved documents and settings.`)) return;
  
  // 1. Delete from Cloud
  if (unityDb) {
    await unityDb.from('profiles').delete().eq('username', username);
  }

  // 2. Delete from Local
  const accounts = await getAccounts();
  const filtered = accounts.filter(a => a.username.toLowerCase() !== username.toLowerCase());
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
  
  // 3. Wipe user-specific data if any (legacy check)
  const userKey = `${STORAGE_KEY}-${username.toLowerCase()}`;
  localStorage.removeItem(userKey);
  
  showToast(`User ${username} and all their data deleted.`);
  renderAdminUsers();
};

async function getAccounts() {
  if (unityDb) {
    console.log("Fetching accounts from Supabase...");
    const { data, error } = await unityDb.from('profiles').select('*').order('createdAt', { ascending: false });
    if (error) {
      console.error("Supabase getAccounts error:", error);
    } else if (data) {
       if (data.length === 0) {
         console.log("No users found in cloud yet. This is normal for a new setup.");
       } else {
         console.log(`Successfully synced ${data.length} accounts from cloud.`);
       }
       localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(data));
       return data;
    }
  }
  return getAccountsLocal();
}

function getAccountsLocal() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getSessionNickname() {
  const username = localStorage.getItem(AUTH_USER_KEY);
  if (!username) return null;
  if (username.toLowerCase() === MASTER_ADMIN.toLowerCase()) return "Admin";
  
  const accounts = getAccountsLocal();
  const user = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
  return user ? user.nickname : null;
}

async function handleUpdateProfile() {
  const currentUsername = localStorage.getItem(AUTH_USER_KEY);
  if (!currentUsername) return;
  
  const newUsername = dom.settingPersonalUsername.value.trim().toLowerCase();
  const newNickname = dom.settingPersonalNickname.value.trim();
  const newPassword = dom.settingPersonalPassword.value.trim();
  
  if (!newUsername || !newNickname || !newPassword) {
    showToast("All personal info fields are required.");
    return;
  }
  
  if (!unityDb) {
    showToast("Database not initialized. Profile update failed.");
    return;
  }

  try {
    const { error } = await unityDb
      .from('profiles')
      .update({
        username: newUsername,
        nickname: newNickname,
        password: newPassword
      })
      .eq('username', currentUsername);
      
    if (error) throw error;
    
    localStorage.setItem(AUTH_USER_KEY, newUsername);
    await getAccounts(); // Refresh cache
    
    showToast("Profile updated successfully!");
    renderLoginState();
    refreshAll();
  } catch (err) {
    console.error("Profile update error:", err);
    showToast("Error updating profile: " + err.message);
  }
}

async function handleCreateAccount(event) {
  event.preventDefault();
  const username = dom.createUsername.value.trim();
  const password = dom.createPassword.value;
  const confirm = dom.confirmPassword.value;
  const nickname = document.getElementById("createNickname").value.trim();
  
  if (password !== confirm) {
    dom.createAccountError.textContent = "Passwords do not match.";
    return;
  }
  
  const accounts = await getAccountsLocal();
  if (accounts.some(a => a.username.toLowerCase() === username.toLowerCase()) || username.toLowerCase() === LOGIN_USERNAME.toLowerCase()) {
    dom.createAccountError.textContent = "Username already exists.";
    return;
  }
  
  const newUser = { 
    username, 
    password, 
    nickname, 
    isApproved: false,
    isBlocked: false,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  
  accounts.push(newUser);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  console.log("Local account created:", username);

  if (unityDb) {
    console.log("Pushing new account to cloud...");
    const { error } = await unityDb.from('profiles').insert([newUser]);
    if (error) {
      console.error("Cloud registration failed:", error);
      showToast("Cloud sync failed, but local account created.");
    } else {
      console.log("Cloud registration successful.");
    }
  }
  
  showToast("Account created! Wait for Admin approval.");
  dom.createAccountForm.reset();
  dom.createAccountForm.classList.add("hidden");
  dom.loginForm.classList.remove("hidden");
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const universal = dom.universalPasswordInput.value;
  const username = dom.resetUsername.value.trim().toLowerCase();
  const newPassword = dom.resetNewPassword.value;
  
  if (universal !== LOGIN_PASSWORD) {
    dom.forgotPasswordError.textContent = "Incorrect universal password.";
    return;
  }
  
  const accounts = await getAccounts();
  const userIndex = accounts.findIndex(a => a.username.toLowerCase() === username);
  
  if (userIndex === -1 && username !== LOGIN_USERNAME.toLowerCase()) {
    dom.forgotPasswordError.textContent = "User not found.";
    return;
  }
  
  if (username === LOGIN_USERNAME.toLowerCase()) {
    showToast("Default admin password cannot be reset this way.");
    return;
  }
  
  await updateCloudUser(username, { password: newPassword });
  
  showToast("Password reset successfully!");
  dom.forgotPasswordForm.reset();
  dom.forgotPasswordForm.classList.add("hidden");
  dom.loginForm.classList.remove("hidden");
}

function updateUndoRedoButtons() {
  if (!dom.undoButton || !dom.redoButton) return;
  dom.undoButton.disabled = undoStack.length === 0;
  dom.redoButton.disabled = redoStack.length === 0;
}

function undoDocument() {
  if (!undoStack.length) return;
  const current = JSON.stringify(appState.document);
  const previous = undoStack.pop();
  redoStack.push(current);
  restoreDocumentSnapshot(previous);
}

function redoDocument() {
  if (!redoStack.length) return;
  const current = JSON.stringify(appState.document);
  const next = redoStack.pop();
  undoStack.push(current);
  restoreDocumentSnapshot(next);
}

function restoreDocumentSnapshot(snapshot) {
  historyPaused = true;
  appState.document = normalizeDocument(JSON.parse(snapshot), createDefaultState().document);
  lastDocumentSnapshot = JSON.stringify(appState.document);
  saveState({ skipHistory: true });
  historyPaused = false;
  refreshAll();
}

function renderAppChrome() {
  const settings = appState.settings;
  if (dom.appTitle) dom.appTitle.textContent = settings.appName;
  if (dom.appSubtitle) dom.appSubtitle.textContent = settings.appSubtitle;
  dom.brandLogo.src = settings.logoUrl;
  dom.paperLogo.src = settings.logoUrl;
  dom.bizsafeLogo.src = settings.bizsafeUrl;
  dom.stampImage.src = settings.stampUrl;
  applyPageSetup();
}

function currentPageSettings() {
  appState.settings.page = normalizePageSettings(appState.settings.page);
  return appState.settings.page;
}

function currentPageSpec() {
  const page = currentPageSettings();
  const base = PAGE_SPECS[page.size] || PAGE_SPECS.A4;
  const landscape = page.orientation === "landscape";
  return {
    ...base,
    widthPx: landscape ? base.heightPx : base.widthPx,
    heightPx: landscape ? base.widthPx : base.heightPx,
    widthMm: landscape ? base.heightMm : base.widthMm,
    heightMm: landscape ? base.widthMm : base.heightMm,
    widthPt: landscape ? base.heightPt : base.widthPt,
    heightPt: landscape ? base.widthPt : base.heightPt,
  };
}

function applyPageSetup() {
  const page = currentPageSettings();
  const spec = currentPageSpec();
  const root = document.documentElement;
  root.style.setProperty("--paper-width", `${spec.widthPx}px`);
  root.style.setProperty("--paper-height", `${spec.heightPx}px`);
  root.style.setProperty("--paper-margin-top", `${PAGE_MARGINS.topPx}px`);
  root.style.setProperty("--paper-margin-side", `${PAGE_MARGINS.sidePx}px`);
  root.style.setProperty("--paper-margin-bottom", `${PAGE_MARGINS.bottomPx}px`);
  root.style.setProperty("--paper-print-width", `${spec.widthMm}mm`);
  root.style.setProperty("--paper-print-height", `${spec.heightMm}mm`);
  root.style.setProperty("--paper-print-margin-top", `${PAGE_MARGINS.topMm}mm`);
  root.style.setProperty("--paper-print-margin-side", `${PAGE_MARGINS.sideMm}mm`);
  root.style.setProperty("--paper-print-margin-bottom", `${PAGE_MARGINS.bottomMm}mm`);
  dom.printArea?.classList.toggle("compress-to-fit", page.compressToFit);
  ensureDynamicPrintPageStyle(spec, page);
}

function ensureDynamicPrintPageStyle(spec, page) {
  let style = document.getElementById("dynamicPrintPageStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "dynamicPrintPageStyle";
    document.head.appendChild(style);
  }
  style.textContent = `@media print { @page { size: ${spec.widthMm}mm ${spec.heightMm}mm; margin: 0; } }`;
}

function pageHintText() {
  const page = currentPageSettings();
  const base = PAGE_SPECS[page.size] || PAGE_SPECS.A4;
  const orientation = page.orientation === "landscape" ? "landscape" : "portrait";
  return `${base.label} ${orientation}${page.compressToFit ? " - fit one page" : ""}`;
}

function renderDocumentTypeOptions() {
  const currentValue = appState.document.type;
  dom.documentType.innerHTML = "";
  const types = cleanList([...appState.settings.documentTypes, currentValue], defaultSettings.documentTypes);
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    dom.documentType.appendChild(option);
  });
  dom.documentType.value = currentValue;
}

function renderAdjustmentTypeOptions() {
  const currentValue = appState.document.adjustmentType || "NONE";
  dom.adjustmentType.innerHTML = "";
  const types = normalizeAdjustmentTypes([...appState.settings.adjustmentTypes, currentValue], defaultSettings.adjustmentTypes);
  types.forEach((rawType) => {
    const optionData = parseAdjustmentOption(rawType);
    const option = document.createElement("option");
    option.value = optionData.label;
    option.textContent = optionData.label === "NONE" ? "NONE" : `${optionData.sign < 0 ? "-" : "+"} ${optionData.label}`;
    dom.adjustmentType.appendChild(option);
  });
  dom.adjustmentType.value = adjustmentOptionLabel(currentValue);
}

function syncDocumentFields() {
  const doc = appState.document;
  const typeValue = (doc.type || "QUOTATION").toUpperCase();
  Array.from(dom.documentType.options).forEach((opt, i) => {
    if (opt.value.toUpperCase() === typeValue) {
      dom.documentType.selectedIndex = i;
    }
  });
  dom.documentNumber.value = doc.number;
  dom.documentDateMode.value = doc.dateMode || inferDateMode(doc.date);
  dom.documentDate.value = doc.date;
  dom.clientSelect.value = doc.clientName;
  dom.clientAddress.value = doc.clientAddress;
  dom.poNumber.value = doc.poNumber;
  dom.invoiceClaimNumber.value = doc.invoiceClaimNumber || 1;
  dom.invoiceClaimLabelInput.value = invoiceClaimLabel(doc);
  dom.invoiceClaimAmount.value = doc.invoiceClaimAmount || "";
  dom.contractValue.value = doc.contractValue || "";
  dom.previouslyPaid.value = doc.previouslyPaid || "";
  dom.clientAddress.value = doc.clientAddress;
  dom.clientContactPrefix.value = doc.clientContactPrefix || appState.settings.emailPrefix || "eMail :";
  dom.clientEmail.value = doc.clientEmail;
  dom.referenceText.value = uppercaseText(doc.re || "");
  dom.adjustmentType.value = doc.adjustmentType;
  dom.gstRate.value = doc.gstRate;
  dom.adjustmentAmount.value = doc.adjustmentAmount;
  if (dom.lockToggle) dom.lockToggle.checked = appState.locked;
  dom.settingDarkMode.checked = appState.settings.darkMode;
  renderPoNumberState();
  renderLockedState();
}

function renderPoNumberState() {
  const showPoNo = shouldShowPoNo();
  dom.poNumberField.hidden = !showPoNo;
  dom.poNumber.disabled = !showPoNo;
}

function renderClientOptions() {
  const currentValue = appState.document.clientName;
  dom.clientSelect.innerHTML = "";
  const blankOption = document.createElement("option");
  blankOption.value = "";
  blankOption.textContent = "";
  dom.clientSelect.appendChild(blankOption);
  appState.clients
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((client) => {
      const option = document.createElement("option");
      option.value = clientNameText(client.name);
      option.textContent = clientNameText(client.name);
      dom.clientSelect.appendChild(option);
    });

  if (!findClient(currentValue) && currentValue) {
    const option = document.createElement("option");
    option.value = clientNameText(currentValue);
    option.textContent = clientNameText(currentValue);
    dom.clientSelect.appendChild(option);
  }
  dom.clientSelect.value = clientNameText(currentValue);
}

function renderItems() {
  dom.itemRows.innerHTML = "";
  appState.document.items.forEach((item, index) => {
    const units = getUomOptions(item.uom);
    const row = document.createElement("tr");
    console.log(`Rendering items (Build: 2024-05-20). Session authenticated: ${!!localStorage.getItem("auth_token")}`);
    row.innerHTML = `
      <td><input data-field="serial" data-index="${index}" type="text" value="${escapeAttr(item.serial)}" placeholder="${plainDescriptionText(item).trim() ? (itemLogicalIndex(index) || index + 1) : ""}" aria-label="Item ${index + 1} serial number"></td>
      <td class="description-cell"><div class="description-editor" data-field="description" data-index="${index}" data-placeholder="Description" contenteditable="true" role="textbox" aria-label="Item ${index + 1} description">${descriptionEditorHtml(item)}</div></td>
      <td><input class="amount-input" data-field="qty" data-index="${index}" type="text" inputmode="decimal" value="${escapeAttr(item.qty)}" aria-label="Item ${index + 1} quantity"></td>
      <td>
        <select data-field="uom" data-index="${index}" aria-label="Item ${index + 1} unit">
          ${units.map((option) => `<option${option === item.uom ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </td>
      <td><input class="amount-input" data-field="rate" data-index="${index}" type="text" inputmode="decimal" value="${escapeAttr(item.rate)}" aria-label="Item ${index + 1} rate"></td>
      <td>
        <div class="row-actions">
          <button class="insert-row-button" data-index="${index}" type="button" aria-label="Insert row after item ${index + 1}">+</button>
          <button class="delete-row-button" data-index="${index}" type="button" aria-label="Remove item ${index + 1}">X</button>
        </div>
      </td>
    `;
    dom.itemRows.appendChild(row);
  });

  dom.itemRows.querySelectorAll("input, select").forEach((field) => {
    field.disabled = false;
    field.addEventListener("focus", () => {
      if (field.dataset.field === "serial") {
        field.dataset.previousValue = field.value;
      }
    });
    field.addEventListener("input", () => {
      const item = appState.document.items[Number(field.dataset.index)];
      let value = field.value;
      if (field.dataset.field === "qty" || field.dataset.field === "rate") {
        value = value.replace(/[^0-9.\-]/g, "");
        field.value = value;
      }
      item[field.dataset.field] = value;
      saveState();
      refreshCalculationsAndPreview();
    });
    field.addEventListener("blur", () => {
      const itemIndex = Number(field.dataset.index);
      const item = appState.document.items[itemIndex];
      if (field.dataset.field === "serial") {
        updateFollowingSerials(itemIndex, field.dataset.previousValue || "");
        saveState();
        renderItems();
        refreshCalculationsAndPreview();
        return;
      }
    });
  });

  dom.itemRows.querySelectorAll(".description-editor").forEach((editor) => {
    editor.contentEditable = "true";
    editor.addEventListener("focus", () => {
      activeDescriptionEditor = editor;
      syncDescriptionFormatControls();
    });
    editor.addEventListener("input", () => {
      syncDescriptionEditor(editor);
      saveState();
      refreshCalculationsAndPreview();
      syncDescriptionFormatControls();
    });
    editor.addEventListener("blur", () => {
      syncDescriptionEditor(editor, { format: true, updateEditor: true });
      saveState();
      refreshCalculationsAndPreview();
      renderItems();
    });
  });

  dom.itemRows.querySelectorAll(".insert-row-button").forEach((button) => {
    button.disabled = false;
    button.addEventListener("click", () => {
      insertItemAfter(Number(button.dataset.index));
    });
  });

  dom.itemRows.querySelectorAll(".delete-row-button").forEach((button) => {
    button.disabled = false;
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (appState.document.items.length === 1) {
        appState.document.items = [emptyItem()];
      } else {
        appState.document.items.splice(index, 1);
      }
      saveState();
      renderItems();
      refreshCalculationsAndPreview();
    });
  });
}

function insertItemAfter(index) {
  const item = emptyItem();
  item.serial = nextSerialValue(serialSeedAt(index));
  appState.document.items.splice(index + 1, 0, item);
  updateFollowingSerials(index + 1, serialSeedAt(index));
  saveState();
  renderItems();
  refreshCalculationsAndPreview();
  showToast("Row inserted.");
}

function togglePreviewEditMode() {
  if (appState.previewEditMode) {
    appState.previewEditMode = false;
    previewEditSnapshot = null;
    saveState({ skipHistory: true });
    renderPreviewEditState();
    showToast("Preview editing stopped.");
    return;
  }
  previewEditSnapshot = createPreviewEditSnapshot();
  appState.previewEditMode = true;
  saveState({ skipHistory: true });
  renderPreviewEditState();
  showToast("Preview editing enabled.");
}

function savePreviewEdits() {
  previewEditSnapshot = null;
  appState.previewEditMode = false;
  
  // If admin, save this template as the Global Default for all users
  if (isAdmin()) {
    const globalTemplate = {
      previewLayout: appState.previewLayout,
      previewStyles: appState.previewStyles,
      previewOverrides: appState.previewOverrides
    };
    localStorage.setItem(GLOBAL_TEMPLATE_KEY, JSON.stringify(globalTemplate));
  }
  
  saveState({ skipHistory: true, force: true });
  renderPreviewEditState();
  showToast(isAdmin() ? "Preview template saved globally for all users." : "Preview template saved.");
}

function cancelPreviewEdits() {
  if (!previewEditSnapshot) {
    appState.previewEditMode = false;
    saveState({ skipHistory: true });
    renderPreviewEditState();
    showToast("Preview editing cancelled.");
    return;
  }
  appState.document = normalizeDocument(previewEditSnapshot.document, createDefaultState().document);
  appState.settings = normalizeSettings(previewEditSnapshot.settings);
  appState.previewOverrides = copy(previewEditSnapshot.previewOverrides || {});
  appState.previewLayout = copy(previewEditSnapshot.previewLayout || {});
  appState.previewStyles = copy(previewEditSnapshot.previewStyles || {});
  appState.previewEditMode = false;
  previewEditSnapshot = null;
  lastDocumentSnapshot = JSON.stringify(appState.document);
  saveState({ skipHistory: true });
  clearPreviewSelection(false);
  refreshAll();
  showToast("Preview edit cancelled.");
}

function createPreviewEditSnapshot() {
  return copy({
    document: appState.document,
    settings: appState.settings,
    previewOverrides: appState.previewOverrides || {},
    previewLayout: appState.previewLayout || {},
    previewStyles: appState.previewStyles || {},
  });
}

function handlePreviewInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const previewId = target.dataset.previewId || target.dataset.previewMoveId;
  const itemField = target.dataset.previewItemField;

  if (previewId) {
    const binding = previewBindings[previewId];
    let content = target.textContent || "";
    if (binding?.uppercase) {
      content = uppercaseText(content);
      if (target.textContent !== content) {
        const selection = window.getSelection();
        const offset = selection?.focusOffset || 0;
        target.textContent = content;
        if (selection && target.firstChild) {
          const range = document.createRange();
          range.setStart(target.firstChild, Math.min(offset, content.length));
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
    savePreviewText(previewId, content);
    
    // Update all other instances of this previewId on other pages
    document.querySelectorAll(`[data-preview-id="${previewId}"], [data-preview-move-id="${previewId}"], #${previewId}`).forEach(el => {
      if (el !== target) el.textContent = content;
    });

    syncDocumentFields();
    return;
  }

  if (itemField) {
    const index = Number(target.dataset.previewIndex || 0);
    const rawValue = itemField === "description" ? target.innerHTML : target.textContent || "";
    savePreviewItemText(index, itemField, rawValue, target);
    
    // If it's a description, we might need to sync it to the main editor
    if (itemField === "description") {
      const mainEditor = document.querySelector(`.description-editor[data-index="${index}"]`);
      if (mainEditor) mainEditor.innerHTML = rawValue;
    }
    
    renderItems(); 
  }
}

function handlePreviewBlur(event) {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.previewItemField === "description") {
    savePreviewItemText(Number(target.dataset.previewIndex || 0), "description", target.innerHTML, target, { format: true });
  }
  saveState();
  syncDocumentFields();
  renderItems();
  refreshCalculationsAndPreview();
}

function bindDescriptionFormatControls() {
  [
    [dom.descriptionBoldButton, "bold"],
    [dom.descriptionItalicButton, "italic"],
    [dom.descriptionUnderlineButton, "underline"],
    [dom.descriptionSuperscriptButton, "superscript"],
  ].forEach(([button, command]) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => formatActiveDescription(command));
  });
  document.addEventListener("selectionchange", syncDescriptionFormatControls);
}

function formatActiveDescription(command) {
  const editor = currentDescriptionEditor();
  if (!editor) {
    showToast("Click a description first.");
    return;
  }
  activeDescriptionEditor = editor;
  editor.focus();
  selectWholeDescriptionIfNeeded(editor);
  document.execCommand(command, false, null);
  syncDescriptionEditor(editor, { updateEditor: true });
  saveState();
  refreshCalculationsAndPreview();
  syncDescriptionFormatControls();
}

function selectWholeDescriptionIfNeeded(editor) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || !editorHasSelection(editor, selection)) {
    selectElementContents(editor);
    return;
  }
  if (selection.isCollapsed) {
    selectElementContents(editor);
  }
}

function editorHasSelection(editor, selection) {
  const anchor = selection.anchorNode;
  const focus = selection.focusNode;
  return Boolean(anchor && focus && editor.contains(anchor) && editor.contains(focus));
}

function selectElementContents(element) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

function currentDescriptionEditor() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount) {
    const node = selection.anchorNode;
    const element = node instanceof HTMLElement ? node : node?.parentElement;
    const editor = element?.closest(".description-editor");
    if (editor && dom.itemRows.contains(editor)) return editor;
  }
  if (activeDescriptionEditor && dom.itemRows.contains(activeDescriptionEditor)) {
    return activeDescriptionEditor;
  }
  return null;
}

function syncDescriptionFormatControls() {
  const editor = currentDescriptionEditor();
  const disabled = !editor;
  [
    [dom.descriptionBoldButton, "bold"],
    [dom.descriptionItalicButton, "italic"],
    [dom.descriptionUnderlineButton, "underline"],
    [dom.descriptionSuperscriptButton, "superscript"],
  ].forEach(([button, command]) => {
    button.disabled = disabled;
    button.classList.toggle("active", !disabled && document.queryCommandState(command));
  });
}

function bindPreviewFormatControls() {
  dom.boldButton.addEventListener("click", () => toggleSelectedPreviewStyle("bold"));
  dom.italicButton.addEventListener("click", () => toggleSelectedPreviewStyle("italic"));
  dom.underlineButton.addEventListener("click", () => toggleSelectedPreviewStyle("underline"));
  dom.fontFamilySelect.addEventListener("change", () => {
    setSelectedPreviewStyle({ fontFamily: dom.fontFamilySelect.value });
  });
  dom.fontSizeInput.addEventListener("input", () => {
    setSelectedPreviewStyle({ fontSize: readNumberControl(dom.fontSizeInput, 6, 72) });
  });
  dom.fontWeightSelect.addEventListener("change", () => {
    setSelectedPreviewStyle({ fontWeight: dom.fontWeightSelect.value });
  });
  dom.boxSpacingInput.addEventListener("input", () => {
    const val = readNumberControl(dom.boxSpacingInput, -50, 100);
    setSelectedPreviewStyle({ boxSpacing: val !== "" ? val : "" });
  });
  dom.letterSpacingInput.addEventListener("input", () => {
    const val = readNumberControl(dom.letterSpacingInput, -50, 50);
    setSelectedPreviewStyle({ letterSpacing: val !== "" ? val + "px" : "" });
  });
  dom.fontColorInput.addEventListener("input", () => {
    setSelectedPreviewStyle({ color: dom.fontColorInput.value });
  });
  dom.backgroundColorInput.addEventListener("input", () => {
    setSelectedPreviewStyle({ backgroundColor: dom.backgroundColorInput.value });
  });
  dom.clearBackgroundButton.addEventListener("click", () => {
    setSelectedPreviewStyle({ backgroundColor: "" });
  });
  dom.textAlignSelect.addEventListener("change", () => {
    setSelectedPreviewStyle({ textAlign: dom.textAlignSelect.value });
  });
  dom.boxXInput.addEventListener("input", () => {
    setSelectedPreviewPosition("x", readNumberControl(dom.boxXInput, -1200, 1200));
  });
  dom.boxYInput.addEventListener("input", () => {
    setSelectedPreviewPosition("y", readNumberControl(dom.boxYInput, -1200, 1200));
  });
  dom.boxWidthInput.addEventListener("input", () => {
    setSelectedPreviewStyle({ width: readNumberControl(dom.boxWidthInput, 10, 1200) });
  });
  dom.boxHeightInput.addEventListener("input", () => {
    setSelectedPreviewStyle({ height: readNumberControl(dom.boxHeightInput, 10, 1200) });
  });
  dom.borderWidthInput.addEventListener("input", () => {
    const width = readNumberControl(dom.borderWidthInput, 0, 12);
    setSelectedPreviewStyle({
      borderWidth: width,
      borderSide: dom.borderSideSelect.value || "all",
      borderStyle: dom.borderStyleSelect.value || (width ? "solid" : "none"),
      borderColor: width ? dom.borderColorInput.value || "#111111" : "",
    });
  });
  dom.borderStyleSelect.addEventListener("change", () => {
    const width = readNumberControl(dom.borderWidthInput, 0, 12) || 1;
    setSelectedPreviewStyle({
      borderStyle: dom.borderStyleSelect.value,
      borderWidth: width,
      borderSide: dom.borderSideSelect.value || "all",
      borderColor: dom.borderColorInput.value || "#111111",
    });
  });
  dom.borderSideSelect.addEventListener("change", () => {
    const width = readNumberControl(dom.borderWidthInput, 0, 12) || 1;
    setSelectedPreviewStyle({
      borderSide: dom.borderSideSelect.value,
      borderWidth: width,
      borderStyle: "solid",
      borderColor: dom.borderColorInput.value || "#111111",
    });
  });
  dom.borderColorInput.addEventListener("input", () => {
    setSelectedPreviewStyle({
      borderColor: dom.borderColorInput.value,
      borderStyle: "solid",
      borderWidth: previewStyleMap()[selectedPreviewMoveId]?.borderWidth || 1,
    });
  });
  dom.clearBorderButton.addEventListener("click", () => {
    setSelectedPreviewStyle({ borderWidth: "", borderColor: "", borderStyle: "" });
  });
  dom.resetSelectedStyleButton.addEventListener("click", resetSelectedPreviewStyle);
}

function renderPreviewEditState() {
  const editable = appState.previewEditMode;
  dom.printArea.classList.toggle("preview-editing", editable);
  dom.editPreviewButton.hidden = editable;
  dom.savePreviewButton.hidden = !editable;
  dom.cancelPreviewButton.hidden = !editable;
  dom.settingsEditPreviewButton.hidden = editable;
  dom.settingsSavePreviewButton.hidden = !editable;
  dom.settingsCancelPreviewButton.hidden = !editable;
  dom.previewFormatbar.hidden = !editable;
  
  const admin = isAdmin();
  if (dom.previewAdminGroup) dom.previewAdminGroup.classList.toggle("hidden", !admin || !editable);

  document.querySelectorAll("[data-preview-id], [data-preview-item-field]").forEach((element) => {
    element.contentEditable = "true";
  });
  
  dom.settingsSavePreviewButton.disabled = false;
  
  dom.previewHint.textContent = editable ? "Command-click selects many boxes" : pageHintText();
  movablePreviewBlockIds.forEach((id) => {
    const element = dom[id];
    if (!element) return;
    element.dataset.previewMoveId = id;
  });
  Object.keys(previewBindings).forEach((id) => {
    const element = dom[id];
    if (!element) return;
    const moveId = element.dataset.previewMoveId || id;
    element.dataset.previewId = id;
    element.dataset.previewMoveId = moveId;
    element.contentEditable = editable ? "true" : "false";
    element.spellcheck = false;
  });
  dom.printArea.querySelectorAll("[data-preview-item-field]").forEach((element) => {
    const field = element.dataset.previewItemField;
    const index = element.dataset.previewIndex;
    const moveId = `item-${index}-${field}`;
    element.dataset.previewMoveId = moveId;
    element.contentEditable = editable ? "true" : "false";
    element.spellcheck = false;
  });
  applyPreviewLayout();
  applyPreviewStyles();
  if (!editable) {
    clearPreviewSelection(false);
  } else if (selectedPreviewMoveId) {
    selectedPreviewMoveIds = new Set(
      selectedPreviewIds().filter((moveId) => {
        const selectedElement = findPreviewMoveElement(moveId);
        if (!selectedElement) return false;
        selectedElement.classList.add("preview-selected");
        return true;
      }),
    );
    if (!selectedPreviewMoveIds.has(selectedPreviewMoveId)) {
      selectedPreviewMoveId = lastSelectedPreviewId();
    }
  }
  syncPreviewFormatControls();
}

function handlePreviewPointerDown(event) {
  if (!appState.previewEditMode || event.button !== 0) return;
  const target = event.target instanceof HTMLElement ? event.target.closest("[data-preview-move-id]") : null;
  if (!target || !dom.printArea.contains(target)) return;
  const moveId = target.dataset.previewMoveId;
  const isCommandClick = event.metaKey || event.ctrlKey;
  if (isCommandClick) {
    event.preventDefault();
    selectPreviewElement(target, true);
    return;
  }
  if (selectedPreviewMoveIds.has(moveId) && selectedPreviewMoveIds.size > 1) {
    selectedPreviewMoveId = moveId;
    syncPreviewFormatControls();
  } else {
    selectPreviewElement(target);
  }
  const dragIds = selectedPreviewMoveIds.has(moveId) ? Array.from(selectedPreviewMoveIds) : [moveId];
  const entries = dragIds
    .map((id) => {
      const element = findPreviewMoveElement(id);
      const current = previewLayoutMap()[id] || { x: 0, y: 0 };
      return element
        ? {
            element,
            moveId: id,
            originX: Number(current.x || 0),
            originY: Number(current.y || 0),
          }
        : null;
    })
    .filter(Boolean);
  previewDrag = {
    element: target,
    moveId,
    entries,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
  };
}

function handlePreviewPointerMove(event) {
  if (!previewDrag) return;
  const dx = event.clientX - previewDrag.startX;
  const dy = event.clientY - previewDrag.startY;
  if (!previewDrag.dragging && Math.hypot(dx, dy) < 5) return;
  previewDrag.dragging = true;
  event.preventDefault();
  previewDrag.entries.forEach((entry) => {
    const target = entry.element;
    const page = target.closest(".paper-page");
    let next = {
      x: Math.round(entry.originX + dx / (appState.previewScale || 1)),
      y: Math.round(entry.originY + dy / (appState.previewScale || 1)),
    };

    if (page) {
      const pageStyle = getComputedStyle(page);
      const pl = cssPixels(pageStyle.paddingLeft, 60);
      const pr = cssPixels(pageStyle.paddingRight, 60);
      const pt = cssPixels(pageStyle.paddingTop, 42);
      const pb = cssPixels(pageStyle.paddingBottom, 60);
      
      const pageRect = page.getBoundingClientRect();
      const elRect = target.getBoundingClientRect();
      
      // We need to clamp the ACTUAL position. 
      // Since we use transform, we must be careful.
      // For now, let's just use a loose clamp to keep it visible.
    }

    entry.element.classList.add("preview-dragging");
    applyPreviewPosition(entry.element, next);
  });
}

function handlePreviewPointerUp() {
  if (!previewDrag) return;
  if (previewDrag.dragging) {
    const layout = previewLayoutMap();
    previewDrag.entries.forEach((entry) => {
      const transform = getPreviewTransform(entry.element);
      if (transform.x || transform.y) {
        layout[entry.moveId] = transform;
      } else {
        delete layout[entry.moveId];
      }
    });
    saveState();
    syncPreviewFormatControls();
  }
  previewDrag.entries.forEach((entry) => entry.element.classList.remove("preview-dragging"));
  previewDrag = null;
}

function handlePreviewFocusIn(event) {
  if (!appState.previewEditMode) return;
  const target = event.target instanceof HTMLElement ? event.target.closest("[data-preview-move-id]") : null;
  if (target && dom.printArea.contains(target)) {
    if (selectedPreviewMoveIds.has(target.dataset.previewMoveId)) {
      selectedPreviewMoveId = target.dataset.previewMoveId;
      syncPreviewFormatControls();
      return;
    }
    selectPreviewElement(target);
  }
}

function previewPaperRoot() {
  return dom.printArea.closest(".paper") || dom.printArea;
}

function applyPreviewLayout() {
  previewPaperRoot().querySelectorAll("[data-preview-move-id]").forEach((element) => {
    const moveId = element.dataset.previewMoveId;
    applyPreviewPosition(element, previewLayoutMap()[moveId] || { x: 0, y: 0 });
  });
}

function applyPreviewPosition(element, position) {
  const x = Number(position.x || 0);
  const y = Number(position.y || 0);
  element.style.transform = x || y ? `translate(${x}px, ${y}px)` : "";
  element.style.position = x || y ? "relative" : "";
}

function getPreviewTransform(element) {
  const transform = element.style.transform || "";
  const match = transform.match(/translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/);
  return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 0, y: 0 };
}

function previewLayoutMap() {
  if (!appState.previewLayout || typeof appState.previewLayout !== "object") {
    appState.previewLayout = {};
  }
  return previewTemplateMap(appState.previewLayout);
}

function previewStyleMap() {
  if (!appState.previewStyles || typeof appState.previewStyles !== "object") {
    appState.previewStyles = {};
  }
  return previewTemplateMap(appState.previewStyles);
}

function previewTemplateMap(source) {
  if (!source[PREVIEW_TEMPLATE_KEY]) {
    const documentMap = source[previewDocumentKey()];
    const firstSavedMap = Object.entries(source).find(([key, value]) => {
      return key !== PREVIEW_TEMPLATE_KEY && value && typeof value === "object" && Object.keys(value).length;
    });
    source[PREVIEW_TEMPLATE_KEY] = copy(documentMap || firstSavedMap?.[1] || {});
  }
  return source[PREVIEW_TEMPLATE_KEY];
}

function applyPreviewStyles() {
  const styles = previewStyleMap();
  previewPaperRoot().querySelectorAll("[data-preview-move-id]").forEach((element) => {
    applyPreviewStyleToElement(element, styles[element.dataset.previewMoveId] || {});
  });
}

function applyPreviewStyleToElement(element, style = {}) {
  element.style.fontWeight = style.fontWeight || (style.bold ? "700" : "");
  element.style.fontStyle = style.italic ? "italic" : "";
  element.style.textDecoration = style.underline ? "underline" : "";
  element.style.fontFamily = style.fontFamily || "";
  element.style.fontSize = pixelStyle(style.fontSize);
  if (style.boxSpacing !== undefined && style.boxSpacing !== "") {
    const space = Number(style.boxSpacing);
    // Apply margin-top to all direct children except the first
    Array.from(element.children).forEach((child, i) => {
      if (i === 0) {
        child.style.marginTop = "";
      } else {
        child.style.marginTop = space + "px";
      }
    });
    element.style.gap = "";
  } else {
    // Clear margins on children
    Array.from(element.children).forEach((child) => {
      child.style.marginTop = "";
    });
    element.style.gap = "";
  }
  element.style.letterSpacing = style.letterSpacing || "";
  element.style.color = style.color || "";
  element.style.backgroundColor = style.backgroundColor || "";
  element.style.textAlign = style.textAlign || "";
  element.style.width = pixelStyle(style.width);
  element.style.height = pixelStyle(style.height);
  element.style.maxWidth = style.width ? "none" : "";
  element.style.maxHeight = style.height ? "none" : "";
  if (style.borderWidth !== undefined && style.borderWidth !== "") {
    const side = style.borderSide || "all";
    const bWidth = pixelStyle(style.borderWidth);
    const bColor = style.borderColor || "#111";
    const bStyle = style.borderStyle || (bWidth ? "solid" : "none");

    if (side === "all") {
      element.style.borderWidth = bWidth;
      element.style.borderColor = bColor;
      element.style.borderStyle = bStyle;
    } else {
      const sideProp = side.charAt(0).toUpperCase() + side.slice(1);
      element.style[`border${sideProp}Width`] = bWidth;
      element.style[`border${sideProp}Color`] = bColor;
      element.style[`border${sideProp}Style`] = bStyle;
    }
  }
}

function toggleSelectedPreviewStyle(key) {
  if (!selectedPreviewMoveId) return;
  const current = previewStyleMap()[selectedPreviewMoveId] || {};
  setSelectedPreviewStyle({ [key]: !current[key] });
}

function setSelectedPreviewStyle(nextStyle) {
  if (!appState.previewEditMode || !selectedPreviewMoveId) return;
  const styles = previewStyleMap();
  selectedPreviewIds().forEach((moveId) => {
    const merged = { ...(styles[moveId] || {}) };
    Object.entries(nextStyle).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined || value === false) {
        delete merged[key];
      } else {
        merged[key] = value;
      }
    });
    if (Object.keys(merged).length) {
      styles[moveId] = merged;
    } else {
      delete styles[moveId];
    }
    const elements = findAllPreviewMoveElements(moveId);
    elements.forEach((element) => {
      applyPreviewStyleToElement(element, merged);
      element.classList.add("preview-selected");
    });
  });
  saveState({ force: true });
  syncPreviewFormatControls();
}

function setSelectedPreviewPosition(axis, value) {
  if (!appState.previewEditMode || !selectedPreviewMoveId) return;
  const layout = previewLayoutMap();
  selectedPreviewIds().forEach((moveId) => {
    const current = layout[moveId] || { x: 0, y: 0 };
    const next = {
      x: Number(current.x || 0),
      y: Number(current.y || 0),
      [axis]: value === "" ? 0 : Number(value || 0),
    };
    if (next.x || next.y) {
      layout[moveId] = next;
    } else {
      delete layout[moveId];
    }
    const elements = findAllPreviewMoveElements(moveId);
    elements.forEach((element) => {
      applyPreviewPosition(element, next);
      element.classList.add("preview-selected");
    });
  });
  saveState({ force: true });
  syncPreviewFormatControls();
}

function resetSelectedPreviewStyle() {
  if (!selectedPreviewMoveId) return;
  const styles = previewStyleMap();
  const layout = previewLayoutMap();
  selectedPreviewIds().forEach((moveId) => {
    delete styles[moveId];
    delete layout[moveId];
    const element = findPreviewMoveElement(moveId);
    if (element) {
      applyPreviewPosition(element, { x: 0, y: 0 });
      applyPreviewStyleToElement(element, {});
      element.classList.add("preview-selected");
    }
  });
  saveState();
  syncPreviewFormatControls();
}

function selectPreviewElement(element, additive = false) {
  const moveId = element?.dataset.previewMoveId || "";
  if (!moveId) {
    clearPreviewSelection();
    return;
  }
  if (!additive) {
    clearPreviewSelection(false);
    selectedPreviewMoveIds.add(moveId);
    selectedPreviewMoveId = moveId;
    element.classList.add("preview-selected");
  } else if (selectedPreviewMoveIds.has(moveId)) {
    selectedPreviewMoveIds.delete(moveId);
    element.classList.remove("preview-selected");
    selectedPreviewMoveId = lastSelectedPreviewId();
  } else {
    selectedPreviewMoveIds.add(moveId);
    selectedPreviewMoveId = moveId;
    element.classList.add("preview-selected");
  }
  syncPreviewFormatControls();
}

function clearPreviewSelection(syncControls = true) {
  dom.printArea.querySelectorAll(".preview-selected").forEach((element) => {
    element.classList.remove("preview-selected");
  });
  selectedPreviewMoveId = "";
  selectedPreviewMoveIds.clear();
  if (syncControls) syncPreviewFormatControls();
}

function selectedPreviewIds() {
  return selectedPreviewMoveIds.size ? Array.from(selectedPreviewMoveIds) : selectedPreviewMoveId ? [selectedPreviewMoveId] : [];
}

function lastSelectedPreviewId() {
  const ids = Array.from(selectedPreviewMoveIds);
  return ids.length ? ids[ids.length - 1] : "";
}

function syncPreviewFormatControls() {
  const element = appState.previewEditMode ? findPreviewMoveElement(selectedPreviewMoveId) : null;
  const disabled = !element;
  previewFormatControls().forEach((control) => {
    control.disabled = disabled;
  });
  if (disabled) {
    setFormatButtonState({});
    dom.fontWeightSelect.value = "";
    dom.fontSizeInput.value = "";
    dom.boxSpacingInput.value = "";
    dom.letterSpacingInput.value = "";
    dom.fontColorInput.value = "#111111";
    dom.backgroundColorInput.value = "#ffffff";
    dom.textAlignSelect.value = "";
    dom.boxXInput.value = "";
    dom.boxYInput.value = "";
    dom.boxWidthInput.value = "";
    dom.boxHeightInput.value = "";
    dom.borderWidthInput.value = "";
    dom.borderStyleSelect.value = "solid";
    dom.borderSideSelect.value = "all";
    dom.borderColorInput.value = "#111111";
    return;
  }

  const style = previewStyleMap()[selectedPreviewMoveId] || {};
  const position = previewLayoutMap()[selectedPreviewMoveId] || { x: 0, y: 0 };
  const rect = element.getBoundingClientRect();
  setFormatButtonState(style);
  dom.fontFamilySelect.value = style.fontFamily || "";
  dom.fontWeightSelect.value = style.fontWeight || "";
  dom.fontSizeInput.value = style.fontSize || "";
  dom.boxSpacingInput.value = style.boxSpacing !== undefined ? style.boxSpacing : "";
  dom.letterSpacingInput.value = style.letterSpacing ? parseFloat(style.letterSpacing) : "";
  dom.fontColorInput.value = normalizeHexColor(style.color) || colorToHex(getComputedStyle(element).color) || "#111111";
  dom.backgroundColorInput.value = normalizeHexColor(style.backgroundColor) || "#ffffff";
  dom.textAlignSelect.value = style.textAlign || "";
  dom.boxXInput.value = Number(position.x || 0);
  dom.boxYInput.value = Number(position.y || 0);
  dom.boxWidthInput.value = style.width || Math.round(rect.width) || "";
  dom.boxHeightInput.value = style.height || Math.round(rect.height) || "";
  dom.borderWidthInput.value = style.borderWidth || "";
  dom.borderStyleSelect.value = style.borderStyle || (style.borderWidth ? "solid" : "none");
  dom.borderSideSelect.value = style.borderSide || "all";
  dom.borderColorInput.value = normalizeHexColor(style.borderColor) || colorToHex(getComputedStyle(element).borderColor) || "#111111";
}

function setFormatButtonState(style) {
  dom.boldButton.classList.toggle("active", Boolean(style.bold));
  dom.italicButton.classList.toggle("active", Boolean(style.italic));
  dom.underlineButton.classList.toggle("active", Boolean(style.underline));
}

function previewFormatControls() {
  return [
    dom.boldButton,
    dom.italicButton,
    dom.underlineButton,
    dom.fontFamilySelect,
    dom.fontWeightSelect,
    dom.fontSizeInput,
    dom.boxSpacingInput,
    dom.letterSpacingInput,
    dom.fontColorInput,
    dom.backgroundColorInput,
    dom.clearBackgroundButton,
    dom.textAlignSelect,
    dom.boxXInput,
    dom.boxYInput,
    dom.boxWidthInput,
    dom.boxHeightInput,
    dom.borderWidthInput,
    dom.borderStyleSelect,
    dom.borderSideSelect,
    dom.borderColorInput,
    dom.clearBorderButton,
    dom.resetSelectedStyleButton,
  ].filter(Boolean);
}

function findPreviewMoveElement(moveId) {
  return findAllPreviewMoveElements(moveId)[0] || null;
}

function findAllPreviewMoveElements(moveId) {
  if (!moveId) return [];
  return Array.from(dom.printArea.querySelectorAll(`[data-preview-move-id="${moveId}"]`));
}

function readNumberControl(control, min, max) {
  const rawValue = String(control.value || "").trim();
  if (!rawValue) return "";
  const value = Math.round(Number(rawValue));
  if (!Number.isFinite(value)) return "";
  return Math.min(max, Math.max(min, value));
}

function pixelStyle(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? `${number}px` : "";
}

function normalizeHexColor(value) {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : "";
}

function colorToHex(value) {
  const match = String(value || "").match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return "";
  return [match[1], match[2], match[3]]
    .map((part) => Math.max(0, Math.min(255, Number(part))).toString(16).padStart(2, "0"))
    .join("")
    .replace(/^/, "#");
}

function savePreviewText(id, rawText) {
  const text = rawText.trim();
  if (id === "previewTotalLabel" && isInvoiceDocument()) {
    appState.document.invoiceClaimLabelText = text || automaticInvoiceClaimLabel(appState.document);
    if (dom.invoiceClaimLabelInput) dom.invoiceClaimLabelInput.value = appState.document.invoiceClaimLabelText;
    delete previewOverrideMap()[id];
    saveState();
    return;
  }
  const binding = previewBindings[id];
  if (!binding) return;
  if (binding.root === "override") {
    previewOverrideMap()[id] = text;
  } else {
    applyPreviewBinding(binding, text);
    delete previewOverrideMap()[id];
  }
  saveState();
}

function applyPreviewBinding(binding, text) {
  let value = binding.stripPrefix ? stripEmailPrefix(text) : binding.parser ? binding.parser(text) : text;
  if (binding.edgeColon) value = labelEdgeText(value);
  if (binding.uppercase) value = uppercaseText(value);
  if (binding.root === "document") {
    appState.document[binding.key] = value;
  } else if (binding.root === "settings") {
    appState.settings[binding.key] = value;
  } else if (binding.root === "label") {
    appState.settings.labels[binding.key] = value;
  } else if (binding.root === "bank") {
    appState.settings.bank[binding.key] = value;
  }
}

function savePreviewItemText(index, field, rawText, target, options = {}) {
  ensurePreviewItem(index);
  const item = appState.document.items[index];
  const text = rawText.trim();
  if (field === "amount") {
    const amount = parseMoney(text);
    const qty = Number(item.qty || 0);
    if (qty > 0 && Number.isFinite(amount)) {
      item.rate = String(roundCurrency(amount / qty));
      target.textContent = formatMoney(amount);
    } else {
      previewOverrideMap()[`item-${index}-amount`] = text;
    }
  } else if (field === "qty" || field === "rate") {
    item[field] = text.replace(/[^0-9.\-]/g, "");
  } else if (field === "description") {
    const html = options.format ? formatDescriptionHtml(rawText) : sanitizeDescriptionHtml(rawText);
    item.descriptionHtml = html;
    item.description = descriptionHtmlToText(html);
    if (target && options.format) target.innerHTML = html;
  } else {
    item[field] = text;
  }
  saveState();
}

function ensurePreviewItem(index) {
  while (appState.document.items.length <= index) {
    appState.document.items.push(emptyItem());
  }
}

function applyPreviewOverrides() {
  const overrides = previewOverrideMap();
  Object.entries(overrides).forEach(([id, text]) => {
    // Only apply text overrides to elements marked as editable (data-preview-id)
    // This prevents overwriting per-page values like page numbers on continuation pages
    dom.printArea.querySelectorAll(`[data-preview-id="${id}"]`).forEach((element) => {
      element.textContent = text;
    });
    if (dom[id] && !dom[id].dataset.previewId) dom[id].textContent = text;
  });
}

function previewOverrideMap() {
  return previewOverrideMapFor(previewDocumentKey());
}

function previewOverrideMapFor(key, replace = false, value = {}) {
  if (!appState.previewOverrides || typeof appState.previewOverrides !== "object") {
    appState.previewOverrides = {};
  }
  if (replace || !appState.previewOverrides[key]) {
    appState.previewOverrides[key] = replace ? copy(value) : {};
  }
  return appState.previewOverrides[key];
}

function previewDocumentKey() {
  const type = appState.document.type || "QUOTATION";
  return `global-template-${type.toLowerCase().replace(/\s+/g, "-")}`;
}

function stripEmailPrefix(text) {
  const prefix = appState.settings.labels.emailPrefix || "";
  const normalized = text.trim();
  if (prefix && normalized.toLowerCase().startsWith(prefix.toLowerCase())) {
    return normalized.slice(prefix.length).trim();
  }
  return normalized.replace(/^(email|eMail|tel|fax)\s*:?\s*/i, "").trim();
}

function normalizeEmailPrefix(value) {
  const label = String(value || "").trim().replace(/\s*[:：]\s*$/, "").trim().toLowerCase();
  if (label === "tel") return "Tel :";
  if (label === "fax") return "Fax :";
  if (label === "email" || label === "e-mail" || label === "mail") return "eMail :";
  return emailPrefixOptions.includes(value) ? value : defaultSettings.labels.emailPrefix;
}

function parseMoney(text) {
  const value = Number(String(text || "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function roundCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function getUomOptions(currentValue = "") {
  return ["", ...cleanList([...appState.settings.uomOptions, currentValue], defaultSettings.uomOptions).filter(Boolean)];
}

function renderAdjustmentControls() {
  const isInvoice = isInvoiceDocument();
  const type = appState.document.adjustmentType;
  dom.adjustmentTypeGroup.style.display = isInvoice ? "none" : "grid";
  dom.gstRateGroup.style.display = !isInvoice && type === "GST" ? "grid" : "none";
  dom.adjustmentAmountGroup.style.display = !isInvoice && type && type !== "NONE" && type !== "GST" ? "grid" : "none";
  dom.invoiceClaimPanel.hidden = !isInvoice;
  dom.invoiceClaimPanel.style.display = isInvoice ? "grid" : "none";
  dom.summaryRemainingCard.hidden = !isInvoice;
  dom.summaryRemainingCard.style.display = isInvoice ? "grid" : "none";
  dom.contractValue.readOnly = true;
}

function refreshCalculationsAndPreview() {
  const totals = calculateTotals();
  const isInvoice = isInvoiceDocument();
  const hideAdjustmentTotals = !isInvoice && appState.document.adjustmentType === "NONE";
  dom.summaryStrip.classList.toggle("invoice-summary", isInvoice);
  dom.summaryStrip.classList.toggle("single-total", hideAdjustmentTotals);
  dom.summarySubtotalCard.style.display = hideAdjustmentTotals ? "none" : "grid";
  dom.summaryAdjustmentCard.style.display = hideAdjustmentTotals ? "none" : "grid";
  dom.summaryRemainingCard.hidden = !isInvoice;
  dom.summaryRemainingCard.style.display = isInvoice ? "grid" : "none";
  dom.summarySubtotalLabel.textContent = isInvoice ? "Contract Value" : "Sub-total";
  dom.subtotalValue.textContent = formatMoney(isInvoice ? totals.contractValue : totals.subtotal);
  dom.adjustmentLabel.textContent = isInvoice ? "Previously Paid" : adjustmentLabel();
  dom.adjustmentValue.textContent = formatMoney(isInvoice ? totals.previouslyPaid : totals.adjustment);
  dom.summaryRemainingValue.textContent = formatMoney(totals.remainingBalance || 0);
  dom.remainingBalanceValue.textContent = formatMoney(totals.remainingBalance || 0);
  if (isInvoice) {
    dom.invoiceClaimAmount.value = String(totals.currentClaimAmount ? roundCurrency(totals.currentClaimAmount) : 0);
    dom.contractValue.value = totals.contractValue ? String(roundCurrency(totals.contractValue)) : "";
    dom.invoiceClaimLabelInput.value = invoiceClaimLabel();
  }
  dom.summaryTotalLabel.textContent = isInvoice ? invoiceClaimLabel() : "Total";
  dom.totalValue.textContent = formatMoney(isInvoice ? totals.currentClaimAmount : totals.total);
  renderPreview(totals);
  dom.documentStatus.textContent = `${appState.document.type} ${appState.document.number || ""}`.trim();
}

function calculateTotals() {
  const subtotal = appState.document.items.reduce((sum, item) => sum + itemAmount(item), 0);
  if (isInvoiceDocument()) {
    const contractValue = roundCurrency(subtotal);
    appState.document.contractValue = contractValue;
    const previouslyPaid = Number(appState.document.previouslyPaid || 0);
    const rawClaimAmount = Number(appState.document.invoiceClaimAmount || 0);
    const currentClaimAmount = rawClaimAmount > 0 ? roundCurrency(rawClaimAmount) : subtotal;
    const remainingBalance = contractValue - previouslyPaid;
    return {
      subtotal,
      adjustment: 0,
      total: subtotal,
      contractValue,
      previouslyPaid,
      remainingBalance,
      currentClaimAmount,
    };
  }
  let adjustment = 0;
  const option = currentAdjustmentOption();
  if (option.label === "GST") {
    adjustment = option.sign * subtotal * (Number(appState.document.gstRate || 0) / 100);
  } else if (option.label !== "NONE") {
    adjustment = option.sign * Math.abs(Number(appState.document.adjustmentAmount || 0));
  }
  return {
    subtotal,
    adjustment,
    total: subtotal + adjustment,
  };
}

function payableTotal(totals, document = appState.document) {
  return isInvoiceDocument(document.type) ? totals.currentClaimAmount : totals.total;
}

function itemAmount(item) {
  return Number(item.qty || 0) * Number(item.rate || 0);
}

function itemAmountText(item) {
  return String(item.qty || "").trim() && String(item.rate || "").trim() ? formatMoney(itemAmount(item)) : "";
}

function itemSerialText(item, index) {
  if (!plainDescriptionText(item).trim()) return "";
  if (item.serial) return item.serial;
  return String(itemLogicalIndex(index));
}

function adjustmentLabel() {
  const option = currentAdjustmentOption();
  if (option.label === "GST") {
    return `GST ${Number(appState.document.gstRate || 0)}%`;
  }
  if (option.label === "NONE") {
    return "Adjustment";
  }
  return option.label;
}

function renderPreview(totals) {
  const doc = appState.document;
  const settings = appState.settings;
  const labels = settings.labels;
  dom.previewDocumentType.textContent = doc.type;
  dom.previewCompanyName.textContent = settings.companyName;
  dom.previewCompanyAddress.textContent = settings.companyAddress;
  dom.previewCompanyEmail.textContent = joinPrefix(labels.emailPrefix, settings.companyEmail);
  dom.previewDocNoLabel.textContent = labelEdgeText(labels.documentNo);
  dom.previewDocNo.textContent = doc.number || "";
  dom.previewDateLabel.textContent = labelEdgeText(labels.documentDate);
  dom.previewDate.textContent = formatDisplayDate(doc.date);
  dom.previewPreparedByLabel.textContent = labelEdgeText(labels.preparedBy);
  dom.previewPreparedBy.textContent = doc.preparedBy || "";
  dom.previewPoLabel.textContent = labelEdgeText(labels.poNo);
  dom.previewPo.textContent = doc.poNumber || "";
  const showPoNo = shouldDisplayPoNo(doc);
  dom.previewPoRow.classList.toggle("is-hidden", !showPoNo);
  if (dom.previewPoPlaceholder) dom.previewPoPlaceholder.classList.toggle("is-hidden", showPoNo);
  dom.previewClientName.textContent = clientNameText(doc.clientName || "");
  dom.previewClientAddress.textContent = doc.clientAddress || "";
  const contactPrefix = doc.clientContactPrefix || labels.emailPrefix;
  dom.previewClientEmail.textContent = joinPrefix(contactPrefix, doc.clientEmail);
  dom.previewReLabel.textContent = labelEdgeText(labels.re);
  dom.previewRe.textContent = uppercaseText(doc.re || "");
  dom.previewContactLabel.textContent = labelEdgeText(labels.contact);
  dom.previewContact.textContent = doc.contactPerson || "";
  dom.previewPhoneLabel.textContent = labelEdgeText(labels.phone);
  dom.previewPhone.textContent = doc.phone || "";
  dom.previewPageNoLabel.textContent = labelEdgeText(labels.pageNo);
  const isInvoice = isInvoiceDocument();
  dom.previewInvoiceNote.textContent = isInvoice ? invoiceNoteText(totals) : "";
  dom.previewInvoiceNote.hidden = !isInvoice;
  dom.previewSubtotalLabel.textContent = isInvoice ? "Contract Value" : labels.subtotal;
  dom.previewSubtotal.textContent = formatMoney(isInvoice ? totals.contractValue : totals.subtotal);
  dom.previewAdjustmentLabel.textContent = isInvoice ? "Previously Paid" : adjustmentLabel();
  dom.previewAdjustment.textContent = formatMoney(isInvoice ? totals.previouslyPaid : totals.adjustment);
  dom.previewRemainingLabel.textContent = "Remaining Balance";
  dom.previewRemaining.textContent = formatMoney(totals.remainingBalance || 0);
  dom.previewTotalLabel.textContent = isInvoice ? invoiceClaimLabel() : labels.total;
  dom.previewTotal.textContent = formatMoney(isInvoice ? totals.currentClaimAmount : totals.total);
  const hideAdjustmentTotals = !isInvoice && appState.document.adjustmentType === "NONE";
  const showAmountWords = shouldShowAmountWords(doc);
  const singleTotalLayout = hideAdjustmentTotals && !showAmountWords;
  dom.previewSubtotalRow.style.display = hideAdjustmentTotals ? "none" : "grid";
  dom.previewAdjustmentRow.style.display = hideAdjustmentTotals ? "none" : "grid";
  dom.previewRemainingRow.hidden = !isInvoice;
  dom.previewRemainingRow.style.display = isInvoice ? "grid" : "none";
  dom.previewTotalNotes.hidden = !isInvoice && !showAmountWords;
  dom.previewTotalsBlock.classList.toggle("single-total", singleTotalLayout);
  dom.bankDetails.style.display = doc.type === "INVOICE" ? "grid" : "none";
  dom.previewBankHeading.textContent = settings.bank.heading;
  dom.previewBankLineOne.textContent = settings.bank.lineOne;
  dom.previewBankLineTwo.textContent = settings.bank.lineTwo;
  dom.previewFooterGreeting.textContent = labels.footerGreeting;
  dom.previewFooterCompany.textContent = settings.companyName;
  const payableAmount = payableTotal(totals, doc);
  dom.amountWords.textContent = payableAmount > 0 ? totalToWords(payableAmount) : "";
  const pageCount = renderPreviewItems(totals);
  dom.previewPageNo.textContent = pageNoText(1, pageCount);
  applyPreviewOverrides();
  renderPreviewEditState();
  applyPreviewFitScale();
}

function renderPreviewItems(totals) {
  const rows = previewDocumentRows();
  const pages = paginatePreviewRows(rows, totals);
  const pageCount = pages.length;
  const metrics = previewPaginationMetrics(rows, totals);
  
  dom.previewItems.innerHTML = "";
  
  const firstPage = pages[0];
  const shouldJustifyFirstPage = pageCount > 1;
  
  renderPreviewRows(dom.previewItems, firstPage?.rows || [], firstPage?.startIndex || 0, {
    heights: firstPage?.heights,
    targetHeight: shouldJustifyFirstPage ? metrics.rowAreaHeight : 0
  });

  renderContinuationPages(pages, totals, metrics);
  applyPreviewLayout();
  applyPreviewStyles();
  const totalsOnContinuation = pageCount > 1;
  dom.printArea.classList.toggle("has-continuation", totalsOnContinuation);
  dom.previewTotalsBlock.style.display = totalsOnContinuation ? "none" : "grid";
  dom.bankDetails.style.display = totalsOnContinuation || !isInvoiceDocument() ? "none" : "grid";
  dom.previewFooterBlock.style.display = totalsOnContinuation ? "none" : "block";
  return pageCount;
}

function schedulePreviewFitScale() {
  if (previewFitFrame) cancelAnimationFrame(previewFitFrame);
  previewFitFrame = requestAnimationFrame(() => {
    previewFitFrame = 0;
    applyPreviewFitScale();
  });
}

function applyPreviewFitScale() {
  const root = document.documentElement;
  root.style.setProperty("--preview-compress-scale", "1");
  root.style.setProperty("--preview-compress-width", "100%");
  
  const pages = document.querySelectorAll(".paper-page");
  if (!currentPageSettings().compressToFit || pages.length === 0) return;

  const spec = currentPageSpec();
  let minScale = 1;
  let maxContentWidth = 0;

  pages.forEach(page => {
    const fitContent = page.querySelector(".paper-fit-content");
    if (!fitContent) return;

    const pageStyle = getComputedStyle(page);
    const leftPadding = cssPixels(pageStyle.paddingLeft, PAGE_MARGINS.sidePx);
    const rightPadding = cssPixels(pageStyle.paddingRight, PAGE_MARGINS.sidePx);
    const topPadding = cssPixels(pageStyle.paddingTop, PAGE_MARGINS.topPx);
    const bottomPadding = cssPixels(pageStyle.paddingBottom, PAGE_MARGINS.bottomPx);
    
    const availableWidth = Math.max(160, spec.widthPx - leftPadding - rightPadding);
    const availableHeight = Math.max(160, spec.heightPx - topPadding - bottomPadding);

    fitContent.style.width = "auto";
    const contentWidth = fitContent.scrollWidth;
    maxContentWidth = Math.max(maxContentWidth, contentWidth);
    
    let pageScale = 1;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      fitContent.style.width = `${availableWidth / pageScale}px`;
      const contentHeight = fitContent.scrollHeight;
      const nextScale = Math.max(MIN_PREVIEW_COMPRESS_SCALE, Math.min(1, availableHeight / contentHeight));
      if (Math.abs(nextScale - pageScale) < 0.006) {
        pageScale = nextScale;
        break;
      }
      pageScale = nextScale;
    }
    
    minScale = Math.min(minScale, pageScale);
  });

  if (minScale < 1) {
    appState.previewScale = minScale;
    root.style.setProperty("--preview-compress-width", `${maxContentWidth}px`);
    root.style.setProperty("--preview-compress-scale", minScale.toFixed(4));
  } else {
    appState.previewScale = 1;
  }
}

function previewDocumentRows() {
  return appState.document.items.length ? appState.document.items : [emptyItem()];
}

function paginatePreviewRows(rows, totals = calculateTotals()) {
  if (currentPageSettings().compressToFit) {
    return [{ rows: [...rows], startIndex: 0 }];
  }
  const metrics = previewPaginationMetrics(rows, totals);
  const pages = [];
  let currentRows = [];
  let currentHeights = [];
  let currentStartIndex = 0;
  let currentHeight = 0;
  rows.forEach((item, index) => {
    const rowHeight = metrics.rowHeights[index] || estimatedPreviewRowHeight(item);
    if (currentRows.length && currentHeight + rowHeight > metrics.rowAreaHeight) {
      // Force the last row of this page to the next page if possible
      if (currentRows.length > 1) {
        const lastItem = currentRows.pop();
        const lastHeight = currentHeights.pop();
        pages.push({ rows: currentRows, heights: currentHeights, startIndex: currentStartIndex });
        currentRows = [lastItem];
        currentHeights = [lastHeight];
        currentHeight = lastHeight;
        currentStartIndex = index - 1;
      } else {
        pages.push({ rows: currentRows, heights: currentHeights, startIndex: currentStartIndex });
        currentRows = [];
        currentHeights = [];
        currentStartIndex = index;
        currentHeight = 0;
      }
    }
    currentRows.push(item);
    currentHeights.push(rowHeight);
    currentHeight += rowHeight;
  });
  if (currentRows.length) {
    pages.push({ rows: currentRows, heights: currentHeights, startIndex: currentStartIndex });
  }
  return placeTotalsAfterFilledRows(pages.length ? pages : [{ rows: [emptyItem()], heights: [estimatedPreviewRowHeight(emptyItem())], startIndex: 0 }], metrics);
}

function placeTotalsAfterFilledRows(pages, metrics) {
  const fitted = pages.map((page) => ({ rows: [...page.rows], heights: [...(page.heights || [])], startIndex: page.startIndex }));
  const lastPage = fitted[fitted.length - 1];
  
  if (lastPage && previewRowsHeight(lastPage) + metrics.totalsHeight > metrics.rowAreaHeight) {
    // If totals don't fit, move the last row of the last page to a new page with the totals
    if (lastPage.rows.length > 1) {
      const lastItem = lastPage.rows.pop();
      const lastHeight = lastPage.heights.pop();
      const nextStartIndex = fitted.reduce((total, page) => total + page.rows.length, 0);
      fitted.push({ rows: [lastItem], heights: [lastHeight], startIndex: nextStartIndex });
    } else if (fitted.length > 1) {
      // If the last page only has one row, move that entire row to the next page
      const movedPage = fitted.pop();
      fitted.push({ rows: movedPage.rows, heights: movedPage.heights, startIndex: movedPage.startIndex });
    } else {
      // Single page document, but totals don't fit. Force break even with one row.
      const nextStartIndex = fitted.reduce((total, page) => total + page.rows.length, 0);
      fitted.push({ rows: [], heights: [], startIndex: nextStartIndex });
    }
  }
  return reindexPreviewPages(fitted);
}

function reindexPreviewPages(pages) {
  let nextIndex = 0;
  return pages.map((page) => {
    const reindexed = { rows: page.rows, heights: page.heights, startIndex: nextIndex };
    nextIndex += page.rows.length;
    return reindexed;
  });
}

function previewRowsHeight(page) {
  return (page.heights || []).reduce((total, height) => total + height, 0);
}

function previewPaginationMetrics(rows, totals) {
  const spec = currentPageSpec();
  const pageStyle = dom.previewPrimaryPage ? getComputedStyle(dom.previewPrimaryPage) : null;
  const topPadding = pageStyle ? cssPixels(pageStyle.paddingTop, PAGE_MARGINS.topPx) : PAGE_MARGINS.topPx;
  const bottomPadding = pageStyle ? cssPixels(pageStyle.paddingBottom, PAGE_MARGINS.bottomPx) : PAGE_MARGINS.bottomPx;
  const renderedPageHeight = dom.previewPrimaryPage?.getBoundingClientRect().height || 0;
  const visualPageHeight = renderedPageHeight
    ? Math.min(renderedPageHeight, spec.heightPx + topPadding + bottomPadding)
    : spec.heightPx;
  const contentHeight = Math.max(420, visualPageHeight - topPadding - bottomPadding);
  const detailsGrid = dom.previewPrimaryPage?.querySelector(".preview-details-grid");
  const tableStyle = dom.previewItemsTable ? getComputedStyle(dom.previewItemsTable) : null;
  const beforeRowsHeight =
    measuredElementHeight(dom.previewHeaderBlock, "grid") +
    measuredElementHeight(detailsGrid, "grid") +
    cssPixels(tableStyle?.marginTop, 26) +
    measuredElementHeight(dom.previewItemsTable?.tHead, "table-header-group");
  const totalsHeight =
    measuredElementHeight(dom.previewTotalsBlock, "grid") +
    (isInvoiceDocument() ? measuredElementHeight(dom.bankDetails, "grid") : 0) +
    measuredElementHeight(dom.previewFooterBlock, "block");
  const rowAreaHeight = Math.max(80, contentHeight - beforeRowsHeight);
  return {
    rowHeights: measurePreviewRowHeights(rows),
    rowAreaHeight,
    totalsHeight,
  };
}

function previewRowUnits(item) {
  const text = plainDescriptionText(item).trim();
  const lineCount = Math.max(1, text.split(/\n+/).filter(Boolean).length);
  const characterUnits = Math.max(1, Math.ceil(text.length / 58));
  return Math.max(1, lineCount, characterUnits);
}

function estimatedPreviewRowHeight(item) {
  const baseRowHeight = currentPageSettings().compressToFit ? 20 : 28;
  return previewRowUnits(item) * baseRowHeight;
}

function cssPixels(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function measuredElementHeight(element, displayValue) {
  if (!element) return 0;
  try {
    const previousDisplay = element.style.display;
    const previousVisibility = element.style.visibility;
    if (displayValue) element.style.display = displayValue;
    element.style.visibility = "hidden";
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const height = rect.height + cssPixels(style.marginTop) + cssPixels(style.marginBottom);
    element.style.display = previousDisplay;
    element.style.visibility = previousVisibility;
    return Number.isFinite(height) && height > 0 ? height : 0;
  } catch (err) {
    console.warn("Measurement error:", err);
    return 0;
  }
}

function measurePreviewRowHeights(rows) {
  if (!document.body || !dom.previewItemsTable) {
    return rows.map(estimatedPreviewRowHeight);
  }
  const tableWidth =
    dom.previewItemsTable.getBoundingClientRect().width ||
    Math.max(320, currentPageSpec().widthPx - PAGE_MARGINS.sidePx * 2);
  const wrapper = document.createElement("div");
  wrapper.className = `paper${currentPageSettings().compressToFit ? " compress-to-fit" : ""}`;
  wrapper.style.cssText = `position:absolute;left:-10000px;top:0;visibility:hidden;width:${tableWidth}px;`;
  const table = document.createElement("table");
  table.className = "preview-items";
  table.style.width = `${tableWidth}px`;
  table.innerHTML = `<thead>${previewTableHeaderHtml()}</thead><tbody></tbody>`;
  const tbody = table.querySelector("tbody");
  rows.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = previewItemRowHtml(item, index);
    tbody.appendChild(row);
  });
  wrapper.appendChild(table);
  document.body.appendChild(wrapper);
  const heights = Array.from(tbody.children).map((row, index) => {
    const measured = Math.ceil(row.getBoundingClientRect().height);
    return measured > 0 ? measured : estimatedPreviewRowHeight(rows[index]);
  });
  wrapper.remove();
  return heights;
}

function renderPreviewRows(target, rows, startIndex, options = {}) {
  const rowHeights = options.heights || [];
  const targetAreaHeight = options.targetHeight || 0;
  const currentHeight = rowHeights.reduce((a, b) => a + b, 0);
  const extraHeight = targetAreaHeight > 0 && rows.length > 1 ? Math.max(0, targetAreaHeight - currentHeight) : 0;
  const gapPerRow = extraHeight / rows.length;

  rows.forEach((item, index) => {
    const itemIndex = startIndex + index;
    const row = document.createElement("tr");
    row.innerHTML = previewItemRowHtml(item, itemIndex);
    if (gapPerRow > 0) {
      // Apply extra height to the last cell or all cells
      const cells = row.querySelectorAll("td");
      cells.forEach(cell => {
        const currentPadding = 7; // Default from CSS
        cell.style.paddingTop = `${currentPadding + gapPerRow / 2}px`;
        cell.style.paddingBottom = `${currentPadding + gapPerRow / 2}px`;
      });
    }
    target.appendChild(row);
  });
}

function previewItemRowHtml(item, index) {
  const serial = itemSerialText(item, index);
  return `
    <td data-preview-item-field="serial" data-preview-index="${index}">${escapeHtml(serial)}</td>
    <td class="preview-description" data-preview-item-field="description" data-preview-index="${index}">${descriptionPreviewHtml(item)}</td>
    <td data-preview-item-field="qty" data-preview-index="${index}">${item.qty || ""}</td>
    <td data-preview-item-field="uom" data-preview-index="${index}">${item.uom || ""}</td>
    <td data-preview-item-field="rate" data-preview-index="${index}">${Number(item.rate || 0) ? formatNumber(item.rate) : ""}</td>
    <td data-preview-item-field="amount" data-preview-index="${index}">${itemAmount(item) ? formatMoney(itemAmount(item)) : ""}</td>
  `;
}

function renderContinuationPages(pages, totals, metrics) {
  dom.previewContinuationPages.innerHTML = "";
  pages.slice(1).forEach((pageInfo, index) => {
    const pageNumber = index + 2;
    const isLastPage = pageNumber === pages.length;
    const shouldJustify = !isLastPage; // Only justify if it's not the last page
    
    const page = document.createElement("section");
    page.className = "paper-page continuation-page";
    page.innerHTML = continuationPageHtml(pageNumber, pages.length, pageInfo.rows, pageInfo.startIndex, totals);
    
    const tbody = page.querySelector(".preview-items tbody");
    if (tbody) {
      tbody.innerHTML = "";
      renderPreviewRows(tbody, pageInfo.rows, pageInfo.startIndex, {
        heights: pageInfo.heights,
        targetHeight: shouldJustify ? metrics.rowAreaHeight : 0
      });
    }
    
    dom.previewContinuationPages.appendChild(page);
  });
}

function continuationPageHtml(pageNumber, pageCount, rows, startIndex, totals) {
  const doc = appState.document;
  const settings = appState.settings;
  const labels = settings.labels;
  const isLastPage = pageNumber === pageCount;
  return `
    <div class="paper-fit-content">
      <header class="paper-header" data-preview-move-id="previewHeaderBlock">
        <img class="paper-logo" data-preview-move-id="paperLogo" src="${escapeAttr(settings.logoUrl)}" alt="UNITY E&C logo">
        <div class="document-title" data-preview-move-id="previewDocumentType">${escapeHtml(doc.type)}</div>
        <img class="bizsafe" data-preview-move-id="bizsafeLogo" src="${escapeAttr(settings.bizsafeUrl)}" alt="bizSAFE level 3">
      </header>
      <section class="preview-details-grid">
        <div class="preview-left-details">
          <section class="company-row" data-preview-move-id="previewCompanyBlock">
            <div>
              <strong data-preview-move-id="previewCompanyName">${escapeHtml(settings.companyName)}</strong>
              <span data-preview-move-id="previewCompanyAddress">${escapeHtml(settings.companyAddress)}</span>
              <span data-preview-move-id="previewCompanyEmail">${escapeHtml(joinPrefix(labels.emailPrefix, settings.companyEmail))}</span>
            </div>
          </section>
          <section class="client-row">
            <div data-preview-move-id="previewClientBlock">
              <strong data-preview-move-id="previewClientName">${escapeHtml(clientNameText(doc.clientName || ""))}</strong>
              <span data-preview-move-id="previewClientAddress">${escapeHtml(doc.clientAddress || "")}</span>
              <span data-preview-move-id="previewClientEmail">${escapeHtml(joinPrefix(doc.clientContactPrefix || labels.emailPrefix, doc.clientEmail))}</span>
              <span class="preview-re-line" data-preview-move-id="previewReLine">
                <span class="edge-colon-label preview-re-label" data-preview-move-id="previewReLabel">${escapeHtml(labelEdgeText(labels.re))}</span>
                <span class="preview-re-value" data-preview-move-id="previewRe">${escapeHtml(uppercaseText(doc.re || ""))}</span>
              </span>
            </div>
          </section>
        </div>
        <dl class="document-info-block" data-preview-move-id="previewDocumentInfoBlock">
          <div><dt class="edge-colon-label" data-preview-move-id="previewDocNoLabel">${escapeHtml(labelEdgeText(labels.documentNo))}</dt><dd data-preview-move-id="previewDocNo">${escapeHtml(doc.number || "")}</dd></div>
          <div class="paper-po-row${shouldDisplayPoNo(doc) ? "" : " is-hidden"}"><dt class="edge-colon-label" data-preview-move-id="previewPoLabel">${escapeHtml(labelEdgeText(labels.poNo))}</dt><dd data-preview-move-id="previewPo">${escapeHtml(doc.poNumber || "")}</dd></div>
          <div><dt class="edge-colon-label" data-preview-move-id="previewDateLabel">${escapeHtml(labelEdgeText(labels.documentDate))}</dt><dd data-preview-move-id="previewDate">${escapeHtml(formatDisplayDate(doc.date))}</dd></div>
          <div><dt class="edge-colon-label" data-preview-move-id="previewPreparedByLabel">${escapeHtml(labelEdgeText(labels.preparedBy))}</dt><dd data-preview-move-id="previewPreparedBy">${escapeHtml(doc.preparedBy || "")}</dd></div>
          <div><dt class="edge-colon-label" data-preview-move-id="previewContactLabel">${escapeHtml(labelEdgeText(labels.contact))}</dt><dd data-preview-move-id="previewContact">${escapeHtml(doc.contactPerson || "")}</dd></div>
          <div><dt class="edge-colon-label" data-preview-move-id="previewPhoneLabel">${escapeHtml(labelEdgeText(labels.phone))}</dt><dd data-preview-move-id="previewPhone">${escapeHtml(doc.phone || "")}</dd></div>
          <div><dt class="edge-colon-label" data-preview-move-id="previewPageNoLabel">${escapeHtml(labelEdgeText(labels.pageNo))}</dt><dd data-preview-move-id="previewPageNo">${escapeHtml(pageNoText(pageNumber, pageCount))}</dd></div>
          <div class="document-info-placeholder${shouldDisplayPoNo(doc) ? " is-hidden" : ""}" aria-hidden="true"><dt></dt><dd></dd></div>
        </dl>
      </section>
      <table class="preview-items" data-preview-move-id="previewItemsTable">
        <thead>${previewTableHeaderHtml()}</thead>
        <tbody></tbody>
      </table>
      ${isLastPage ? continuationTotalsHtml(totals) : ""}
    </div>
  `;
}

function previewTableHeaderHtml() {
  return `
    <tr>
      <th data-preview-id="previewSnHeader" data-preview-move-id="previewSnHeader">S/N</th>
      <th data-preview-id="previewDescriptionHeader" data-preview-move-id="previewDescriptionHeader">Description</th>
      <th data-preview-id="previewQtyHeader" data-preview-move-id="previewQtyHeader">Qty</th>
      <th data-preview-id="previewUomHeader" data-preview-move-id="previewUomHeader">UOM</th>
      <th data-preview-id="previewRateHeader" data-preview-move-id="previewRateHeader">U/Rate</th>
      <th data-preview-id="previewAmountHeader" data-preview-move-id="previewAmountHeader">Amount</th>
    </tr>
  `;
}

function continuationTotalsHtml(totals) {
  const labels = appState.settings.labels;
  const isInvoice = isInvoiceDocument();
  const doc = appState.document;
  const isClaimOne = isInvoice && Number(doc.invoiceClaimNumber || 1) <= 1;
  const hideAdjustmentTotals = !isInvoice && doc.adjustmentType === "NONE";
  const showAmountWords = shouldShowAmountWords(doc);
  const singleTotalLayout = hideAdjustmentTotals && !showAmountWords;
  const payableAmount = payableTotal(totals);
  return `
    <section class="paper-totals${singleTotalLayout ? " single-total" : ""}" data-preview-move-id="previewTotalsBlock">
      <div class="paper-total-notes"${!isInvoice && !showAmountWords ? " hidden" : ""}>
        ${isInvoice ? `<p class="invoice-note">${escapeHtml(invoiceNoteText(totals))}</p>` : ""}
        ${showAmountWords ? `<p data-preview-id="amountWords" data-preview-move-id="amountWords">${escapeHtml(payableAmount > 0 ? totalToWords(payableAmount) : "")}</p>` : ""}
      </div>
      <dl>
        ${hideAdjustmentTotals ? "" : `<div data-preview-move-id="previewSubtotalRow"><dt data-preview-id="previewSubtotalLabel" data-preview-move-id="previewSubtotalLabel">${escapeHtml(isInvoice ? "Contract Value" : labels.subtotal)}</dt><dd data-preview-id="previewSubtotal" data-preview-move-id="previewSubtotal">${escapeHtml(formatMoney(isInvoice ? totals.contractValue : totals.subtotal))}</dd></div>`}
        ${hideAdjustmentTotals || (isInvoice && isClaimOne) ? "" : `<div data-preview-move-id="previewAdjustmentRow"><dt data-preview-id="previewAdjustmentLabel" data-preview-move-id="previewAdjustmentLabel">${escapeHtml(isInvoice ? "Previously Paid" : adjustmentLabel())}</dt><dd data-preview-id="previewAdjustment" data-preview-move-id="previewAdjustment">${escapeHtml(formatMoney(isInvoice ? totals.previouslyPaid : totals.adjustment))}</dd></div>`}
        ${isInvoice && !isClaimOne ? `<div data-preview-move-id="previewRemainingRow"><dt data-preview-id="previewRemainingLabel" data-preview-move-id="previewRemainingLabel">Remaining Balance</dt><dd data-preview-id="previewRemaining" data-preview-move-id="previewRemaining">${escapeHtml(formatMoney(totals.remainingBalance || 0))}</dd></div>` : ""}
        <div class="grand-total" data-preview-move-id="previewTotalRow"><dt data-preview-id="previewTotalLabel" data-preview-move-id="previewTotalLabel">${escapeHtml(isInvoice ? invoiceClaimLabel() : labels.total)}</dt><dd data-preview-id="previewTotal" data-preview-move-id="previewTotal">${escapeHtml(formatMoney(isInvoice ? totals.currentClaimAmount : totals.total))}</dd></div>
      </dl>
    </section>
    ${isInvoice ? `<section class="bank-details" data-preview-move-id="bankDetails"><strong data-preview-id="previewBankHeading" data-preview-move-id="previewBankHeading">${escapeHtml(appState.settings.bank.heading)}</strong><span data-preview-id="previewBankLineOne" data-preview-move-id="previewBankLineOne">${escapeHtml(appState.settings.bank.lineOne)}</span><span data-preview-id="previewBankLineTwo" data-preview-move-id="previewBankLineTwo">${escapeHtml(appState.settings.bank.lineTwo)}</span></section>` : ""}
    <footer class="paper-footer" data-preview-move-id="previewFooterBlock"><div><span data-preview-id="previewFooterGreeting" data-preview-move-id="previewFooterGreeting">${escapeHtml(labels.footerGreeting)}</span><img data-preview-move-id="stampImage" src="${escapeAttr(appState.settings.stampUrl)}" alt="Company stamp and signature"><strong data-preview-id="previewFooterCompany" data-preview-move-id="previewFooterCompany">${escapeHtml(appState.settings.companyName)}</strong></div></footer>
  `;
}

function pageNoText(pageNumber, pageCount) {
  return `${pageNumber} of ${pageCount}`;
}

function renderClients() {
  const query = normalize(dom.clientSearch.value);
  const clients = appState.clients
    .filter((client) => {
      const haystack = normalize(`${client.name} ${client.address} ${client.email}`);
      return haystack.includes(query);
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  dom.clientCount.textContent = `${appState.clients.length} clients`;
  dom.clientList.innerHTML = "";
  clients.forEach((client) => {
    const card = document.createElement("article");
    card.className = "client-card";
    card.innerHTML = `
      <strong>${escapeHtml(client.name)}</strong>
      <span>${escapeHtml(client.address)}</span>
      <span>${emailLinksHtml(client.email)}</span>
      <div class="card-actions">
        <button class="secondary-button small-button" data-action="select" type="button">Use</button>
        <button class="secondary-button small-button" data-action="edit" type="button">Edit</button>
        ${isAdmin() ? '<button class="ghost-button small-button" data-action="delete" type="button">Delete</button>' : ''}
      </div>
    `;
    card.querySelector('[data-action="select"]').addEventListener("click", () => selectClient(client));
    card.querySelector('[data-action="edit"]').addEventListener("click", () => editClient(client));
    const delBtn = card.querySelector('[data-action="delete"]');
    if (delBtn) delBtn.addEventListener("click", () => deleteClient(client));
    dom.clientList.appendChild(card);
  });
}

function selectClient(client) {
  const name = clientNameText(client.name);
  appState.document.clientName = name;
  appState.document.clientAddress = client.address;
  appState.document.clientEmail = chooseEmailForClient(client, appState.document.clientEmail);
  dom.clientNameInput.value = name;
  dom.clientAddressInput.value = client.address;
  dom.clientEmailInput.value = emailParts(client.email).join(" | ");
  saveState();
  renderClientOptions();
  syncDocumentFields();
  refreshCalculationsAndPreview();
  showToast("Client selected.");
}

function newClientForm() {
  dom.clientForm.reset();
  dom.clientNameInput.focus();
}

function editClient(client) {
  dom.clientNameInput.value = clientNameText(client.name);
  dom.clientAddressInput.value = client.address;
  dom.clientEmailInput.value = emailParts(client.email).join(" | ");
  dom.clientNameInput.focus();
}

function addClientEmail() {
  const nextEmail = window.prompt("Add another email, phone, or contact:");
  if (!nextEmail || !nextEmail.trim()) return;
  const emails = cleanEmailList([...emailParts(dom.clientEmailInput.value), nextEmail]);
  dom.clientEmailInput.value = emails.join(" | ");
  dom.clientEmailInput.focus();
  showToast("Email added to client form.");
}

function deleteClient(client) {
  const ok = window.confirm(`Delete client "${client.name}"?`);
  if (!ok) return;
  appState.clients = appState.clients.filter((item) => item !== client);
  if (normalize(appState.document.clientName) === normalize(client.name)) {
    appState.document.clientName = "";
    appState.document.clientAddress = "";
    appState.document.clientEmail = "";
  }
  saveState();
  renderClientOptions();
  renderClients();
  syncDocumentFields();
  refreshCalculationsAndPreview();
  showToast("Client deleted.");
}

function emailParts(value) {
  return cleanEmailList(String(value || "").split("|"));
}

function cleanEmailList(value) {
  const source = Array.isArray(value) ? value : String(value || "").split("|");
  return [...new Set(source
    .map((email) => email.trim())
    .filter(Boolean))];
}

function emailLinksHtml(value) {
  const parts = emailParts(value);
  if (!parts.length) return "";
  return parts
    .map((email) => {
      const safeEmail = escapeHtml(email);
      return `<a href="mailto:${escapeAttr(email)}">${safeEmail}</a>`;
    })
    .join(" | ");
}

function chooseEmailForClient(client, currentValue = "") {
  const parts = emailParts(client.email);
  if (parts.length <= 1) return parts[0] || client.email || "";
  const currentParts = emailParts(currentValue);
  const message = parts.map((email, index) => `${index + 1}. ${email}`).join("\n");
  const defaultSelection = emailSelectionDefault(parts, currentParts);
  const answer = window.prompt(
    `Select email(s) for ${client.name}:\n${message}\n\nUse numbers like 1,3 or type all.`,
    defaultSelection,
  );
  if (answer === null) return currentParts.length ? currentParts.join(" | ") : parts[0];
  const selected = parseEmailSelection(answer, parts);
  if (selected.length) return selected.join(" | ");
  return currentParts.length ? currentParts.join(" | ") : parts[0];
}

function emailSelectionDefault(parts, currentParts) {
  const selectedIndexes = currentParts
    .map((email) => parts.findIndex((part) => normalize(part) === normalize(email)) + 1)
    .filter((index) => index > 0);
  return selectedIndexes.length ? selectedIndexes.join(",") : "1";
}

function parseEmailSelection(value, parts) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return [];
  if (text === "all") return parts;
  const selected = text
    .split(/[,\s|]+/)
    .map((part) => Number(part) - 1)
    .filter((index) => Number.isInteger(index) && parts[index])
    .map((index) => parts[index]);
  return cleanEmailList(selected);
}

function recordDocumentType(record = {}) {
  const type = String(record.document?.type || record.documentType || record.type || "").trim();
  return type || "QUOTATION";
}

function recordGroupKey(record = {}) {
  const type = normalize(recordDocumentType(record));
  if (type === "invoice") return "invoice";
  if (type === "quotation" || type === "quote") return "quotation";
  return "others";
}

function recordGroupTitle(key) {
  if (key === "invoice") return "Invoice";
  if (key === "quotation") return "Quotation";
  return "Others";
}

function saveClient(event) {
  event.preventDefault();
  const name = clientNameText(dom.clientNameInput.value.trim());
  const address = dom.clientAddressInput.value.trim();
  const email = cleanEmailList(dom.clientEmailInput.value).join(" | ");
  if (!name || !address || !email) {
    showToast("Client details are incomplete.");
    return;
  }

  const existing = appState.clients.find((client) => normalize(client.name) === normalize(name));
  if (existing) {
    existing.name = name;
    existing.address = address;
    existing.email = email;
  } else {
    appState.clients.push({ name, address, email });
  }

  appState.document.clientName = name;
  appState.document.clientAddress = address;
  appState.document.clientEmail = chooseEmailForClient({ name, address, email }, appState.document.clientEmail);
  saveState();
  renderClientOptions();
  renderClients();
  syncDocumentFields();
  refreshCalculationsAndPreview();
  showToast(existing ? "Client updated." : "Client added.");
}

function renderRecords() {
  const query = normalize(dom.recordSearch.value);
  const records = appState.records
    .filter((record) => normalize(`${recordDocumentType(record)} ${record.documentNumber} ${record.company} ${record.date}`).includes(query))
    .sort((a, b) => Number(b.documentNumber) - Number(a.documentNumber));
  
  dom.recordCount.textContent = `${appState.records.length} records`;
  dom.recordList.innerHTML = "";

  const stats = {
    invoice: records.filter(r => recordGroupKey(r) === "invoice").length,
    quotation: records.filter(r => recordGroupKey(r) === "quotation").length,
    others: records.filter(r => recordGroupKey(r) === "others").length
  };
  if (dom.recordStats) {
    dom.recordStats.innerHTML = `
      <span class="badge invoice">Invoices: ${stats.invoice}</span> 
      <span class="badge quotation">Quotes: ${stats.quotation}</span>
    `;
  }

  ["invoice", "quotation", "others"].forEach((groupKey) => {
    const groupRecords = records.filter((record) => recordGroupKey(record) === groupKey);
    
    const group = document.createElement("section");
    group.className = "record-group-section";
    group.innerHTML = `
      <div class="record-group-header">
        <div class="group-header-left">
          <h3>${escapeHtml(recordGroupTitle(groupKey))}</h3>
          <span class="group-badge">${groupRecords.length}</span>
        </div>
        <div class="group-actions">
          <button class="secondary-button small-button" data-action="toggle" type="button">Show/Hide</button>
        </div>
      </div>
      <div class="record-group-items" style="display: grid; gap: 8px;"></div>
    `;
    
    const items = group.querySelector(".record-group-items");
    if (groupRecords.length === 0) {
      items.innerHTML = `<p class="record-empty">No ${escapeHtml(recordGroupTitle(groupKey).toLowerCase())} records found.</p>`;
    } else {
      groupRecords.forEach((record) => {
        items.appendChild(recordCardElement(record));
      });
    }

    group.querySelector('[data-action="toggle"]').addEventListener('click', () => {
      const isHidden = items.style.display === "none";
      items.style.display = isHidden ? "grid" : "none";
    });

    dom.recordList.appendChild(group);
  });
}

function recordCardElement(record) {
  const card = document.createElement("article");
  card.className = "record-card";
  const pdfFileName = recordFileName(record, "pdf");
  const excelFileName = recordFileName(record, "excel");
  const pdfPath = recordFilePath(record, "pdf");
  const excelPath = recordFilePath(record, "excel");
  const isInvoice = recordGroupKey(record) === "invoice";
  card.innerHTML = `
    <strong>${escapeHtml(record.documentNumber)} - ${escapeHtml(record.company)}</strong>
    <span><span class="badge ${recordGroupKey(record)}">${escapeHtml(recordDocumentType(record))}</span> ${formatDisplayDate(record.date)} | Saved ${formatDateTime(record.savedAt)}</span>
    <span class="record-meta"><span class="badge" title="${escapeAttr(pdfPath)}">${escapeHtml(pdfFileName)}</span><span class="badge" title="${escapeAttr(excelPath)}">${escapeHtml(excelFileName)}</span></span>
    <div class="card-actions">
      <button class="secondary-button small-button" data-action="open" type="button">Edit</button>
      ${isInvoice ? "" : '<button class="secondary-button small-button" data-action="create-invoice" type="button">Create Invoice</button>'}
      <button class="secondary-button small-button" data-action="print" type="button">Print</button>
      <button class="secondary-button small-button" data-action="clone" type="button">Clone</button>
      ${recordFileControlHtml(record, "pdf")}
      ${recordFileControlHtml(record, "excel")}
      ${isAdmin() ? '<button class="ghost-button small-button" data-action="delete" type="button">Delete</button>' : ''}
    </div>
  `;
  card.querySelector('[data-action="open"]').addEventListener("click", () => loadRecord(record));
  const invoiceButton = card.querySelector('[data-action="create-invoice"]');
  if (invoiceButton) invoiceButton.addEventListener("click", () => createInvoiceFromRecord(record));
  card.querySelector('[data-action="print"]').addEventListener("click", () => printRecord(record));
  card.querySelectorAll('[data-action="pdf"], [data-action="excel"]').forEach((control) => {
    if (control.tagName.toLowerCase() === "a") return;
    control.addEventListener("click", () => openRecordFileOrGenerate(record, control.dataset.action));
  });
  card.querySelector('[data-action="clone"]').addEventListener("click", () => cloneRecord(record));
  const delBtn = card.querySelector('[data-action="delete"]');
  if (delBtn) delBtn.addEventListener("click", () => deleteRecord(record));
  return card;
}

function recordFileControlHtml(record, fileType) {
  const href = recordFileHref(record, fileType);
  const label = fileType === "pdf" ? "PDF" : "Excel";
  if (href) {
    return `<a class="secondary-button small-button file-action-link" data-action="${fileType}" href="${escapeAttr(href)}" target="_blank" rel="noopener" title="Open saved ${escapeAttr(label)}">Open ${escapeHtml(label)}</a>`;
  }
  return `<button class="secondary-button small-button" data-action="${fileType}" type="button" title="No saved file path yet">${escapeHtml(label)}</button>`;
}

function documentFromRecord(record = {}) {
  if (record.document) {
    return normalizeDocument(record.document, createDefaultState().document);
  }
  const client = findClient(record.company);
  return normalizeDocument(
    {
      ...createDefaultState().document,
      type: recordDocumentType(record),
      number: String(record.documentNumber),
      date: record.date,
      dateMode: inferDateMode(record.date),
      clientName: record.company,
      clientAddress: client?.address || "",
      clientEmail: client?.email || "",
      items: [emptyItem()],
    },
    createDefaultState().document,
  );
}

function loadRecord(record) {
  appState.document = documentFromRecord(record);
  appState.locked = true;
  saveState();
  refreshAll();
  showToast("Record loaded.");
}

function cloneRecord(record) {
  appState.document = documentFromRecord(record);
  appState.document.number = String(nextDocumentNumber());
  appState.document.date = tomorrowInput();
  appState.document.dateMode = "tomorrow";
  appState.locked = true;
  saveState();
  refreshAll();
  showToast(`Cloned into new document ${appState.document.number}`);
}

function createInvoiceFromRecord(record) {
  persistDocumentDefaults();
  const sourceDocument = record ? documentFromRecord(record) : appState.document;
  if (!sourceDocument.clientName.trim()) {
    showToast("Select a record or client first.");
    return;
  }
  const invoiceType = appState.settings.documentTypes.find((type) => normalize(type) === "invoice") || "INVOICE";
  if (!appState.settings.documentTypes.some((type) => normalize(type) === "invoice")) {
    appState.settings.documentTypes.push(invoiceType);
  }
  const invoiceNumber = String(nextDocumentNumber());
  const claimNumber = promptInvoiceClaimNumber();
  appState.document = normalizeDocument(
    {
      ...copy(sourceDocument),
      type: invoiceType,
      number: invoiceNumber,
      invoiceClaimNumber: claimNumber,
      invoiceClaimLabelText: automaticInvoiceClaimLabel({ invoiceClaimNumber: claimNumber }),
      invoiceClaimAmount: 0,
      dateMode: "tomorrow",
      date: tomorrowInput(),
      items: sourceDocument.items?.length ? copy(sourceDocument.items) : [emptyItem()],
    },
    createDefaultState().document,
  );
  appState.settings.nextDocumentNumber = String(Number(invoiceNumber || 0) + 1 || HIDDEN_NEXT_DOCUMENT);
  appState.locked = true;
  closeToolsPanel();
  saveState();
  refreshAll();
  showToast(`Invoice ${invoiceNumber} created. Press Save when ready.`);
}

function deleteRecord(record) {
  const ok = window.confirm(`Delete record "${record.documentNumber}"?`);
  if (!ok) return;
  appState.records = appState.records.filter((item) => item !== record);
  saveState();
  renderRecords();
  showToast("Record deleted.");
}

function openRecordFileOrGenerate(record, fileType) {
  const href = recordFileHref(record, fileType);
  if (href) {
    window.open(href, "_blank");
    return;
  }
  loadRecord(record);
  const label = fileType === "pdf" ? "PDF" : "Excel";
  showToast(`${label} path not saved. Creating ${label} now.`);
  if (fileType === "pdf") {
    exportPdf();
  } else {
    exportExcel();
  }
}

function printRecord(record) {
  loadRecord(record);
  window.setTimeout(() => {
    printPdf();
  }, 120);
}

function recordFileHref(record, fileType) {
  const path = recordFilePath(record, fileType);
  const fileName = recordFileName(record, fileType);
  if (!path || !fileName) return "";
  return fileUrlFromPath(`${String(path).replace(/\/+$/, "")}/${fileName}`);
}

function recordFilePath(record, fileType) {
  const recordPath = fileType === "pdf" ? record.pdfPath : record.excelPath;
  const settingsPath = fileType === "pdf" ? appState.settings.pdfSavePath : appState.settings.excelSavePath;
  return absoluteFolderPath(recordPath) || absoluteFolderPath(settingsPath);
}

function recordFileName(record, fileType) {
  const storedName = fileType === "pdf" ? record.pdfFileName : record.excelFileName;
  const extension = fileType === "pdf" ? "pdf" : "xlsx";
  return storedName || `${sanitizeFileName(`${record.documentNumber || "document"} - ${record.company || "Client"}`)}.${extension}`;
}

function absoluteFolderPath(value) {
  const text = String(value || "").trim();
  return text.startsWith("/") ? text : "";
}

function fileUrlFromPath(path) {
  const text = String(path || "").trim();
  if (!text.startsWith("/")) return "";
  return `file://${text.split("/").map(encodeURIComponent).join("/")}`;
}

async function saveDocumentRecord() {
  if (appState.isSaving) return;
  const doc = appState.document;
  if (!doc.number.trim()) {
    showToast("Document number is required.");
    return;
  }
  if (!doc.clientName.trim()) {
    showToast("Client is required.");
    return;
  }
  
  appState.isSaving = true;
  dom.saveDocumentButton.disabled = true;
  
  try {
    persistDocumentDefaults();
    calculateTotals();

    const existing = appState.records.find((record) => record.documentNumber === doc.number.trim());
    const fileBaseName = documentFileBaseName();
    const nextRecord = {
      savedAt: new Date().toISOString(),
      documentNumber: doc.number.trim(),
      documentType: doc.type,
      company: doc.clientName.trim(),
      date: doc.date,
      document: copy(doc),
      pdf: "PDF",
      excel: "Excel",
      pdfFileName: `${fileBaseName}.pdf`,
      excelFileName: `${fileBaseName}.xlsx`,
      pdfPath: appState.settings.pdfSavePath || "",
      excelPath: appState.settings.excelSavePath || "",
    };

    if (existing) {
      Object.assign(existing, nextRecord);
    } else {
      appState.records.push(nextRecord);
    }
    
    saveState();
    renderRecords();
    refreshCalculationsAndPreview();
    
    showToast(existing ? "Record updated. Saving PDF and Excel..." : "Record saved. Saving PDF and Excel...");
    
    const pdfResult = await exportPdf({ showToast: false });
    if (pdfResult === "cancelled") {
      showToast("PDF save cancelled. Record saved only.");
      return;
    }
    
    const excelResult = await exportExcel({ showToast: false });
    if (excelResult === "cancelled") {
      showToast("Excel save cancelled. PDF and record saved.");
      return;
    }
    
    newDocument({ silent: true });
    showToast("Record, PDF, and Excel saved. New document ready.");
  } catch (err) {
    console.error("Save failed:", err);
    showToast(`Save failed: ${err.message || "Unknown error"}. Check all fields and try again.`);
  } finally {
    appState.isSaving = false;
    dom.saveDocumentButton.disabled = false;
  }
}

function newDocument(options = {}) {
  persistDocumentDefaults();
  const settings = appState.settings;
  appState.document = {
    type: options.type || appState.document.type || settings.documentTypes[0] || "QUOTATION",
    number: String(nextDocumentNumber()),
    dateMode: "tomorrow",
    date: tomorrowInput(),
    preparedBy: getSessionNickname() || settings.defaultPreparedBy || "Nihad",
    clientName: "",
    clientAddress: "",
    clientContactPrefix: "",
    clientEmail: "",
    re: "",
    contactPerson: settings.defaultContactPerson,
    phone: settings.defaultPhone,
    poNumber: "",
    invoiceClaimNumber: 1,
    invoiceClaimLabelText: automaticInvoiceClaimLabel({ invoiceClaimNumber: 1 }),
    invoiceClaimAmount: 0,
    contractValue: 0,
    previouslyPaid: 0,
    adjustmentType: "NONE",
    gstRate: settings.defaultGstRate,
    adjustmentAmount: 0,
    items: [emptyItem()],
  };
  appState.settings.nextDocumentNumber = String(Number(appState.document.number || 0) + 1 || HIDDEN_NEXT_DOCUMENT);
  appState.locked = true;
  saveState();
  closeToolsPanel();
  refreshAll();
  if (!options.silent) showToast("New document ready.");
}

function nextDocumentNumber() {
  const currentYearStr = String(new Date().getFullYear());
  
  let maxForCurrentYear = 0;
  for (const record of appState.records) {
    const numStr = String(record.documentNumber || "");
    if (numStr.startsWith(currentYearStr) && numStr.length === 8) {
      const num = Number(numStr);
      if (num > maxForCurrentYear) maxForCurrentYear = num;
    }
  }

  let nextNum;
  if (maxForCurrentYear > 0) {
    nextNum = maxForCurrentYear + 1;
  } else {
    nextNum = Number(`${currentYearStr}0001`);
  }

  const manualNext = Number(appState.settings.nextDocumentNumber);
  if (manualNext && String(manualNext).startsWith(currentYearStr) && manualNext > nextNum) {
    nextNum = manualNext;
  }
  
  return nextNum;
}

function persistDocumentDefaults() {
  appState.settings.defaultPreparedBy = appState.document.preparedBy || appState.settings.defaultPreparedBy;
  appState.settings.defaultContactPerson = appState.document.contactPerson || appState.settings.defaultContactPerson;
  appState.settings.defaultPhone = appState.document.phone || appState.settings.defaultPhone;
}

function renderLockedState() {
  if (dom.lockToggle) dom.lockToggle.checked = appState.locked;
  HEADER_LOCKED_FIELD_IDS.forEach((id) => {
    if (dom[id]) dom[id].disabled = appState.locked;
  });
  dom.documentDate.disabled = dom.documentDateMode.value !== "other";
  dom.documentType.disabled = false;
  dom.documentDateMode.disabled = false;
  dom.clientSelect.disabled = false;
  renderPoNumberState();
  dom.addItemButton.disabled = false;
  document.querySelectorAll(".insert-row-button, .delete-row-button").forEach((button) => {
    button.disabled = false;
  });
  document.querySelectorAll(".description-editor").forEach((editor) => {
    editor.contentEditable = "true";
  });
  
  // Ensure save buttons are always enabled regardless of header lock
  dom.saveDocumentButton.disabled = false;
  dom.savePreviewButton.disabled = false;
}

function openUnlockDialog() {
  dom.unlockPasswordInput.value = "";
  dom.unlockError.textContent = "";
  dom.unlockOverlay.classList.add("open");
  dom.unlockOverlay.setAttribute("aria-hidden", "false");
  dom.unlockPasswordInput.focus();
}

function closeUnlockDialog() {
  dom.unlockOverlay.classList.remove("open");
  dom.unlockOverlay.setAttribute("aria-hidden", "true");
  dom.unlockError.textContent = "";
  dom.unlockPasswordInput.value = "";
  if (dom.lockToggle) dom.lockToggle.checked = appState.locked;
}

function handleUnlockSubmit(event) {
  event.preventDefault();
  const password = dom.unlockPasswordInput.value;
  const currentUsername = localStorage.getItem(AUTH_USER_KEY);
  
  console.log("Attempting unlock with user:", currentUsername);
  let isValid = false;
  if (currentUsername && currentUsername.toLowerCase() === LOGIN_USERNAME.toLowerCase()) {
    isValid = password === LOGIN_PASSWORD;
  } else {
    const accounts = getAccounts();
    const user = accounts.find(a => a.username.toLowerCase() === (currentUsername || "").toLowerCase());
    isValid = user && user.password === password;
  }
  
  if (!isValid) {
    dom.unlockError.textContent = "Incorrect password.";
    console.error("Unlock failed: password mismatch.");
    return;
  }
  appState.locked = false;
  saveState();
  renderLockedState();
  closeUnlockDialog();
  showToast("Header fields unlocked.");
  console.log("Header unlocked successfully.");
}

function openSettings() {
  syncSettingsFields();
  dom.settingsOverlay.classList.add("open");
  dom.settingsOverlay.setAttribute("aria-hidden", "false");
  if (dom.settingDefaultPreparedBy) dom.settingDefaultPreparedBy.focus();
}

function openAdminPanel() {
  if (!isAdmin()) return;
  dom.adminPanelOverlay.classList.add("open");
  dom.adminPanelOverlay.setAttribute("aria-hidden", "false");
  renderAdminUsers();
}

function closeAdminPanel() {
  if (document.activeElement && dom.adminPanelOverlay.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  dom.adminPanelOverlay.classList.remove("open");
  dom.adminPanelOverlay.setAttribute("aria-hidden", "true");
}

function closeSettings() {
  if (document.activeElement && dom.settingsOverlay.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  dom.settingsOverlay.classList.remove("open");
  dom.settingsOverlay.setAttribute("aria-hidden", "true");
}



function renderPoDocumentTypeSettingOptions(settings) {
  const selected = settings.poDocumentTypes[0] || "";
  dom.settingPoDocumentTypes.innerHTML = "";
  settings.documentTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    dom.settingPoDocumentTypes.appendChild(option);
  });
  dom.settingPoDocumentTypes.value =
    settings.documentTypes.find((type) => normalize(type) === normalize(selected)) || settings.documentTypes[0] || "";
}

function syncSettingsFields() {
  const settings = appState.settings;
  const labels = settings.labels;
  const admin = isAdmin();

  // Visibility based on roles
  if (dom.settingsSectionCompany) dom.settingsSectionCompany.classList.toggle("hidden", !admin);
  if (dom.settingsSectionDocuments) dom.settingsSectionDocuments.classList.toggle("hidden", !admin);
  if (dom.settingsSectionPortability) dom.settingsSectionPortability.classList.toggle("hidden", !admin);
  if (dom.settingsSectionPreviewActions) dom.settingsSectionPreviewActions.classList.toggle("hidden", !admin);
  if (dom.settingsSectionLabels) dom.settingsSectionLabels.classList.toggle("hidden", !admin);
  if (dom.settingNextDocumentNumberGroup) dom.settingNextDocumentNumberGroup.classList.toggle("hidden", !admin);

  // Personal Info
  const currentUsername = localStorage.getItem(AUTH_USER_KEY);
  if (currentUsername) {
    const accounts = getAccountsLocal();
    const user = accounts.find(a => a.username.toLowerCase() === currentUsername.toLowerCase());
    if (user) {
      dom.settingPersonalUsername.value = user.username;
      dom.settingPersonalNickname.value = user.nickname || "";
      dom.settingPersonalPassword.value = user.password;
    } else if (currentUsername === MASTER_ADMIN.toLowerCase()) {
      dom.settingPersonalUsername.value = MASTER_ADMIN;
      dom.settingPersonalNickname.value = "Admin";
      dom.settingPersonalPassword.value = LOGIN_PASSWORD;
    }
  }

  dom.settingDefaultPreparedBy.value = settings.defaultPreparedBy;
  dom.settingDefaultContact.value = settings.defaultContactPerson;
  dom.settingDefaultPhone.value = settings.defaultPhone;
  dom.settingDefaultGstRate.value = settings.defaultGstRate;
  dom.settingCurrencySymbol.value = settings.currencySymbol;
  dom.settingNextDocumentNumber.value = settings.nextDocumentNumber;
  dom.settingCompanyName.value = settings.companyName;
  dom.settingCompanyAddress.value = settings.companyAddress;
  dom.settingCompanyEmail.value = settings.companyEmail;
  dom.settingDocumentTypes.value = settings.documentTypes.join(", ");
  renderPoDocumentTypeSettingOptions(settings);
  dom.settingUomOptions.value = settings.uomOptions.join(", ");
  dom.settingAdjustmentTypes.value = settings.adjustmentTypes.join(", ");
  dom.settingPageSize.value = settings.page.size;
  dom.settingPageOrientation.value = settings.page.orientation;
  dom.settingCompressToFitPage.checked = Boolean(settings.page.compressToFit);
  dom.settingPdfSavePath.value = settings.pdfSavePath;
  dom.settingExcelSavePath.value = settings.excelSavePath;
  dom.settingDocumentNoLabel.value = labels.documentNo;
  dom.settingDocumentDateLabel.value = labels.documentDate;
  dom.settingPreparedByLabel.value = labels.preparedBy;
  dom.settingContactLabel.value = labels.contact;
  dom.settingPhoneLabel.value = labels.phone;
  dom.settingPageNoLabel.value = labels.pageNo;
  dom.settingPoLabel.value = labels.poNo;
  dom.settingReLabel.value = labels.re;
  dom.settingEmailPrefix.value = normalizeEmailPrefix(labels.emailPrefix);
  dom.settingSubtotalLabel.value = labels.subtotal;
  dom.settingTotalLabel.value = labels.total;
  dom.settingFooterGreeting.value = labels.footerGreeting;
  dom.settingBankHeading.value = settings.bank.heading;
  dom.settingBankLineOne.value = settings.bank.lineOne;
  dom.settingBankLineTwo.value = settings.bank.lineTwo;
  dom.settingLogoUrl.value = settings.logoUrl;
  dom.settingBizsafeUrl.value = settings.bizsafeUrl;
  dom.settingStampUrl.value = settings.stampUrl;
}

function saveSettings(event) {
  if (event) event.preventDefault();
  const previousPdfSavePath = appState.settings.pdfSavePath;
  const previousExcelSavePath = appState.settings.excelSavePath;
  const settings = normalizeSettings({
    defaultPreparedBy: dom.settingDefaultPreparedBy.value.trim(),
    defaultContactPerson: dom.settingDefaultContact.value.trim(),
    defaultPhone: dom.settingDefaultPhone.value.trim(),
    defaultGstRate: Number(dom.settingDefaultGstRate.value || 0),
    currencySymbol: dom.settingCurrencySymbol.value.trim() || "$",
    nextDocumentNumber: dom.settingNextDocumentNumber.value.trim() || String(HIDDEN_NEXT_DOCUMENT),
    companyName: dom.settingCompanyName.value.trim() || defaultSettings.companyName,
    companyAddress: dom.settingCompanyAddress.value.trim(),
    companyEmail: dom.settingCompanyEmail.value.trim(),
    documentTypes: cleanList(dom.settingDocumentTypes.value, defaultSettings.documentTypes),
    poDocumentTypes: dom.settingPoDocumentTypes.value ? [dom.settingPoDocumentTypes.value] : [],
    uomOptions: cleanList(dom.settingUomOptions.value, defaultSettings.uomOptions),
    adjustmentTypes: cleanList(dom.settingAdjustmentTypes.value, defaultSettings.adjustmentTypes),
    page: {
      size: dom.settingPageSize.value,
      orientation: dom.settingPageOrientation.value,
      compressToFit: dom.settingCompressToFitPage.checked,
    },
    pdfSavePath: dom.settingPdfSavePath.value.trim(),
    excelSavePath: dom.settingExcelSavePath.value.trim(),
    labels: {
      documentNo: dom.settingDocumentNoLabel.value.trim() || defaultSettings.labels.documentNo,
      documentDate: dom.settingDocumentDateLabel.value.trim() || defaultSettings.labels.documentDate,
      preparedBy: dom.settingPreparedByLabel.value.trim() || defaultSettings.labels.preparedBy,
      contact: dom.settingContactLabel.value.trim() || defaultSettings.labels.contact,
      phone: dom.settingPhoneLabel.value.trim() || defaultSettings.labels.phone,
      pageNo: dom.settingPageNoLabel.value.trim() || defaultSettings.labels.pageNo,
      poNo: dom.settingPoLabel.value.trim() || defaultSettings.labels.poNo,
      re: dom.settingReLabel.value.trim() || defaultSettings.labels.re,
      emailPrefix: normalizeEmailPrefix(dom.settingEmailPrefix.value),
      subtotal: dom.settingSubtotalLabel.value.trim() || defaultSettings.labels.subtotal,
      total: dom.settingTotalLabel.value.trim() || defaultSettings.labels.total,
      footerGreeting: dom.settingFooterGreeting.value.trim(),
    },
    bank: {
      heading: dom.settingBankHeading.value.trim(),
      lineOne: dom.settingBankLineOne.value.trim(),
      lineTwo: dom.settingBankLineTwo.value.trim(),
    },
    logoUrl: dom.settingLogoUrl.value.trim() || defaultSettings.logoUrl,
    bizsafeUrl: dom.settingBizsafeUrl.value.trim() || defaultSettings.bizsafeUrl,
    stampUrl: dom.settingStampUrl.value.trim() || defaultSettings.stampUrl,
  });
  if (previousPdfSavePath !== settings.pdfSavePath) {
    forgetStoredDirectoryHandle("pdf");
  }
  if (previousExcelSavePath !== settings.excelSavePath) {
    forgetStoredDirectoryHandle("excel");
  }
  if (!settings.documentTypes.includes(appState.document.type)) {
    settings.documentTypes.push(appState.document.type);
  }
  if (
    appState.document.adjustmentType &&
    !settings.adjustmentTypes.some((type) => normalize(adjustmentOptionLabel(type)) === normalize(appState.document.adjustmentType))
  ) {
    settings.adjustmentTypes.push(formatAdjustmentOptionSetting(parseAdjustmentOption(appState.document.adjustmentType)));
  }
  appState.document.items.forEach((item) => {
    if (item.uom && !settings.uomOptions.includes(item.uom)) {
      settings.uomOptions.push(item.uom);
    }
  });
  appState.settings = settings;
  saveState();
  refreshAll();
  closeSettings();
  showToast("Settings saved.");
}

function restoreSettings() {
  const ok = window.confirm("Restore default settings?");
  if (!ok) return;
  appState.settings = copy(defaultSettings);
  if (!appState.settings.documentTypes.includes(appState.document.type)) {
    appState.settings.documentTypes.push(appState.document.type);
  }
  saveState();
  syncSettingsFields();
  refreshAll();
  showToast("Settings restored.");
}

function openToolsPanel(tabName = "clients") {
  switchTab(tabName);
  dom.toolsPanel.classList.add("open");
  dom.toolsPanel.setAttribute("aria-hidden", "false");
  if (tabName === "records") {
    dom.recordSearch.focus();
  } else {
    dom.clientSearch.focus();
  }
}

function closeToolsPanel() {
  dom.toolsPanel.classList.remove("open");
  dom.toolsPanel.setAttribute("aria-hidden", "true");
}

function switchTab(tabName) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-page").forEach((page) => {
    page.classList.toggle("active", page.id === `${tabName}Page`);
  });
}

function resetData() {
  const ok = window.confirm("Clean the current page? Settings, clients, records, and preview template will stay saved.");
  if (!ok) return;
  
  const settings = appState.settings;
  previewOverrideMapFor(previewDocumentKey(), true, {});
  
  // Reset ONLY the current document state
  // This explicitly avoids touching AUTH_KEY or AUTH_USER_KEY
  appState.document = {
    type: appState.document.type || settings.documentTypes[0] || "QUOTATION",
    number: appState.document.number || settings.nextDocumentNumber,
    dateMode: "tomorrow",
    date: tomorrowInput(),
    preparedBy: appState.document.preparedBy || settings.defaultPreparedBy || "",
    clientName: "",
    clientAddress: "",
    clientContactPrefix: "",
    clientEmail: "",
    re: "",
    contactPerson: settings.defaultContactPerson,
    phone: settings.defaultPhone,
    poNumber: "",
    invoiceClaimNumber: 1,
    invoiceClaimLabelText: automaticInvoiceClaimLabel({ invoiceClaimNumber: 1 }),
    invoiceClaimAmount: 0,
    contractValue: 0,
    previouslyPaid: 0,
    adjustmentType: "NONE",
    gstRate: settings.defaultGstRate,
    adjustmentAmount: 0,
    items: [emptyItem()],
  };
  
  appState.locked = true;
  saveState();
  refreshAll();
  showToast("Page cleaned.");
}

function printPdf() {
  const fileBaseName = documentFileBaseName();
  updateCurrentRecordFiles({
    pdfFileName: `${fileBaseName}.pdf`,
    pdfPath: appState.settings.pdfSavePath || "",
  });
  const previousTitle = document.title;
  document.title = fileBaseName;
  window.print();
  window.setTimeout(() => {
    document.title = previousTitle;
  }, 800);
}

async function exportPdf(options = {}) {
  const showMessages = options.showToast !== false;
  const fileBaseName = documentFileBaseName();
  const fileName = `${fileBaseName}.pdf`;
  const blob = buildPdfBlob();
  const saveResult = await saveBlobForFileType("pdf", blob, fileName, "application/pdf", ".pdf", "PDF document");
  if (saveResult === "cancelled") {
    if (showMessages) showToast("PDF save cancelled.");
    return "cancelled";
  }
  if (saveResult === "saved") {
    updateCurrentRecordFiles({
      pdfFileName: fileName,
      pdfPath: appState.settings.pdfSavePath || "",
    });
    if (showMessages) showToast("PDF saved.");
    return "saved";
  }
  updateCurrentRecordFiles({
    pdfFileName: fileName,
    pdfPath: appState.settings.pdfSavePath || "",
  });
  if (showMessages) showToast("PDF exported.");
  return "download";
}

async function exportExcel(options = {}) {
  const showMessages = options.showToast !== false;
  const fileBaseName = documentFileBaseName();
  const fileName = `${fileBaseName}.xlsx`;
  const blob = buildXlsxBlob();
  const saveResult = await saveBlobForFileType(
    "excel",
    blob,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xlsx",
    "Excel workbook",
  );
  if (saveResult === "cancelled") {
    if (showMessages) showToast("Excel save cancelled.");
    return "cancelled";
  }
  if (saveResult === "saved") {
    updateCurrentRecordFiles({
      excelFileName: fileName,
      excelPath: appState.settings.excelSavePath || "",
    });
    if (showMessages) showToast("Excel saved.");
    return "saved";
  }
  updateCurrentRecordFiles({
    excelFileName: fileName,
    excelPath: appState.settings.excelSavePath || "",
  });
  if (showMessages) showToast("Excel preview exported.");
  return "download";
}

async function saveBlobForFileType(fileType, blob, fileName, mimeType, extension, description) {
  const macBridgeResult = await saveBlobWithMacBridge(fileType, blob, fileName);
  if (macBridgeResult !== "unavailable") return macBridgeResult;
  const folderResult = await saveBlobToPermittedFolder(fileType, blob, fileName);
  if (folderResult !== "unavailable") return folderResult;
  const pickerResult = await saveBlobWithPicker(blob, fileName, mimeType, extension, description);
  if (pickerResult !== "download") return pickerResult;
  downloadBlob(blob, fileName);
  return "download";
}

function hasMacSaveBridge() {
  return Boolean(window.webkit?.messageHandlers?.unitySaveFile);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function saveBlobWithMacBridge(fileType, blob, fileName) {
  if (!hasMacSaveBridge()) return "unavailable";
  try {
    const requestId = `save-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const base64 = await blobToBase64(blob);
    window.__unityMacSaveCallbacks ||= {};
    return await new Promise((resolve) => {
      window.__unityMacSaveCallbacks[requestId] = resolve;
      window.webkit.messageHandlers.unitySaveFile.postMessage({
        requestId,
        fileType,
        fileName,
        folderPath: configuredSavePath(fileType),
        base64,
      });
    });
  } catch (error) {
    return "unavailable";
  }
}

window.__unityMacSaveFinished = function unityMacSaveFinished(requestId, result) {
  const callback = window.__unityMacSaveCallbacks?.[requestId];
  if (!callback) return;
  delete window.__unityMacSaveCallbacks[requestId];
  callback(result || "cancelled");
};

async function saveBlobToPermittedFolder(fileType, blob, fileName) {
  if (!configuredSavePath(fileType)) return "unavailable";
  if (!window.showDirectoryPicker || !window.indexedDB) return "unavailable";
  const label = fileTypeLabel(fileType);
  try {
    let directoryHandle = await storedDirectoryHandle(fileType);
    if (!directoryHandle) {
      showToast(`Select ${label} save folder to allow permission.`);
      directoryHandle = await window.showDirectoryPicker({
        id: `unity-dashboard-${fileType}-folder`,
        mode: "readwrite",
      });
      await saveStoredDirectoryHandle(fileType, directoryHandle);
    }
    const allowed = await requestDirectoryWritePermission(directoryHandle);
    if (!allowed) {
      await forgetStoredDirectoryHandle(fileType);
      showToast(`${label} folder permission was not allowed.`);
      return "cancelled";
    }
    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    return "saved";
  } catch (error) {
    if (error?.name === "AbortError") return "cancelled";
    await forgetStoredDirectoryHandle(fileType);
    return "unavailable";
  }
}

async function saveBlobWithPicker(blob, suggestedName, mimeType, extension = ".xlsx", description = "Excel file") {
  if (!window.showSaveFilePicker) return "download";
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description,
          accept: {
            [mimeType]: [extension],
          },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return "saved";
  } catch (error) {
    return error?.name === "AbortError" ? "cancelled" : "download";
  }
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function configuredSavePath(fileType) {
  return String(fileType === "pdf" ? appState.settings.pdfSavePath : appState.settings.excelSavePath).trim();
}

function fileTypeLabel(fileType) {
  return fileType === "pdf" ? "PDF" : "Excel";
}

async function requestDirectoryWritePermission(directoryHandle) {
  const options = { mode: "readwrite" };
  if (typeof directoryHandle.queryPermission === "function") {
    const current = await directoryHandle.queryPermission(options);
    if (current === "granted") return true;
  }
  if (typeof directoryHandle.requestPermission === "function") {
    return (await directoryHandle.requestPermission(options)) === "granted";
  }
  return true;
}

async function storedDirectoryHandle(fileType) {
  try {
    return await directoryHandleStoreRequest("readonly", (store) => store.get(fileType));
  } catch (error) {
    return null;
  }
}

async function saveStoredDirectoryHandle(fileType, directoryHandle) {
  try {
    await directoryHandleStoreRequest("readwrite", (store) => store.put(directoryHandle, fileType));
  } catch (error) {
    // Some browsers cannot persist file-system handles from file pages.
  }
}

async function forgetStoredDirectoryHandle(fileType) {
  try {
    await directoryHandleStoreRequest("readwrite", (store) => store.delete(fileType));
  } catch (error) {
    // Permission cache cleanup is best effort.
  }
}

function directoryHandleStoreRequest(mode, callback) {
  if (!window.indexedDB) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise((resolve, reject) => {
    const openRequest = window.indexedDB.open(FILE_HANDLE_DB_NAME, 1);
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(FILE_HANDLE_STORE_NAME)) {
        db.createObjectStore(FILE_HANDLE_STORE_NAME);
      }
    };
    openRequest.onerror = () => reject(openRequest.error);
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction(FILE_HANDLE_STORE_NAME, mode);
      const store = transaction.objectStore(FILE_HANDLE_STORE_NAME);
      const request = callback(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    };
  });
}

function buildXlsxBlob() {
  const files = buildXlsxFiles();
  return new Blob([zipFiles(files)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function buildPdfBlob() {
  const totals = calculateTotals();
  const rows = previewDocumentRows();
  const metrics = previewPaginationMetrics(rows, totals);
  const pages = paginatePreviewRows(rows, totals);
  const pageSpec = currentPageSpec();
  const streams = pages.map((pageInfo, index) => pdfPageStream(pageInfo, index + 1, pages.length, totals, pageSpec, metrics));
  return new Blob([buildPdfDocument(streams, pageSpec)], { type: "application/pdf" });
}function pdfPageStream(pageInfo, pageNumber, pageCount, totals, pageSpec = currentPageSpec(), metrics = null) {
  const doc = appState.document;
  const settings = appState.settings;
  const labels = settings.labels;
  const commands = ["0.65 w"];
  const PX_TO_PT = 0.75;
  const scale = (settings.compressToFit ? appState.previewScale : 1) || 1;
  const LINE_HEIGHT = 12 * scale;
  
  const text = (x, y, value, size = 9, bold = false) => {
    const sSize = size * scale;
    commands.push(`BT /${bold ? "F2" : "F1"} ${sSize.toFixed(2)} Tf 1 0 0 1 ${pdfNumber(x)} ${pdfNumber(y)} Tm (${pdfEscape(value)}) Tj ET`);
  };
  const line = (x1, y1, x2, y2) => {
    commands.push(`${pdfNumber(x1)} ${pdfNumber(y1)} m ${pdfNumber(x2)} ${pdfNumber(y2)} l S`);
  };
  
  const pageHeight = pageSpec.heightPt;
  const tableLeft = 42;
  const tableRight = pageSpec.widthPt - 42;
  const rightLabelX = Math.max(330, pageSpec.widthPt - 215);
  const rightValueX = Math.max(rightLabelX + 90, pageSpec.widthPt - 110);
  const titleX = Math.max(230, pageSpec.widthPt / 2 - 30);
  const snX = tableLeft + 9;
  const descX = tableLeft + 50;
  const qtyX = tableRight - 203;
  const uomX = tableRight - 163;
  const rateX = tableRight - 115;
  const amountX = tableRight - 48;
  const descriptionWrap = Math.max(48, Math.floor(((rateX - descX - 12) / 5.2) / scale));
  
  // Use browser-measured metrics converted to points
  const rowHeights = pageInfo.heights || [];
  const currentHeightPx = rowHeights.reduce((a, b) => a + b, 0);
  const targetAreaHeightPx = metrics ? metrics.rowAreaHeight : 0;
  
  // Row justification logic
  const shouldJustify = pageCount > 1 && pageNumber < pageCount;
  const extraHeightPx = shouldJustify && targetAreaHeightPx > 0 && pageInfo.rows.length > 1 ? Math.max(0, targetAreaHeightPx - currentHeightPx) : 0;
  const gapPerRowPt = (extraHeightPx / pageInfo.rows.length) * PX_TO_PT * scale;

  const pageTop = pageHeight - 42;
  text(42, pageTop, settings.companyName, 10, true);
  text(42, pageTop - (15 * scale), settings.companyAddress, 8);
  text(42, pageTop - (29 * scale), joinPrefix(labels.emailPrefix, settings.companyEmail), 8);
  text(titleX, pageTop - (5 * scale), doc.type, 15, true);

  let infoY = pageTop;
  text(rightLabelX, infoY, labelWithColon(labels.documentNo), 8);
  text(rightValueX, infoY, doc.number || "", 8);
  infoY -= (14 * scale);
  if (shouldDisplayPoNo(doc)) {
    text(rightLabelX, infoY, labelWithColon(labels.poNo), 8);
    text(rightValueX, infoY, doc.poNumber || "", 8);
    infoY -= (14 * scale);
  }
  text(rightLabelX, infoY, labelWithColon(labels.documentDate), 8);
  text(rightValueX, infoY, formatDisplayDate(doc.date), 8);
  infoY -= (14 * scale);
  text(rightLabelX, infoY, labelWithColon(labels.preparedBy), 8);
  text(rightValueX, infoY, doc.preparedBy || "", 8);

  let clientY = pageTop - (80 * scale);
  text(42, clientY, clientNameText(doc.clientName || ""), 9, true);
  pdfWrapText(doc.clientAddress || "", Math.floor(72 / scale)).forEach((lineText) => {
    clientY -= (13 * scale);
    text(42, clientY, lineText, 8);
  });
  clientY -= (13 * scale);
  text(42, clientY, joinPrefix(doc.clientContactPrefix || labels.emailPrefix, doc.clientEmail), 8);
  clientY -= (15 * scale);
  text(42, clientY, `${labelWithColon(labels.re)} ${uppercaseText(doc.re || "")}`, 8, true);
  
  const rightInfoY = pageTop - (80 * scale);
  text(rightLabelX, rightInfoY, labelWithColon(labels.contact), 8);
  text(rightValueX, rightInfoY, doc.contactPerson || "", 8);
  text(rightLabelX, rightInfoY - (14 * scale), labelWithColon(labels.phone), 8);
  text(rightValueX, rightInfoY - (14 * scale), doc.phone || "", 8);
  text(rightLabelX, rightInfoY - (28 * scale), labelWithColon(labels.pageNo), 8);
  text(rightValueX, rightInfoY - (28 * scale), pageNoText(pageNumber, pageCount), 8);

  let y = pageTop - (150 * scale);
  line(tableLeft, y + (13 * scale), tableRight, y + (13 * scale));
  line(tableLeft, y - (4 * scale), tableRight, y - (4 * scale));
  text(snX, y, "S/N", 8, true);
  text(descX, y, "Description", 8, true);
  text(qtyX, y, "Qty", 8, true);
  text(uomX, y, "UOM", 8, true);
  text(rateX, y, "U/Rate", 8, true);
  text(amountX, y, "Amount", 8, true);
  y -= (24 * scale);

  pageInfo.rows.forEach((item, index) => {
    const itemIndex = pageInfo.startIndex + index;
    const descriptionLines = pdfWrapText(plainDescriptionText(item), descriptionWrap);
    const baseHeightPt = (rowHeights[index] || 28) * PX_TO_PT * scale;
    const totalRowHeightPt = baseHeightPt + gapPerRowPt;
    const textY = y - (gapPerRowPt / 2);
    
    text(snX, textY, itemSerialText(item, itemIndex), 8);
    (descriptionLines.length ? descriptionLines : [""]).forEach((lineText, lineIndex) => {
      text(descX, textY - (lineIndex * LINE_HEIGHT), lineText, 8);
    });
    text(qtyX, textY, item.qty || "", 8);
    text(uomX, textY, item.uom || "", 8);
    text(rateX, textY, Number(item.rate || 0) ? formatNumber(item.rate) : "", 8);
    text(amountX, textY, itemAmount(item) ? formatMoney(itemAmount(item)) : "", 8);
    y -= totalRowHeightPt;
  });
  line(tableLeft, y + (8 * scale), tableRight, y + (8 * scale));

  if (pageNumber === pageCount) {
    const totalsY = Math.max(95, y - (28 * scale));
    if (isInvoiceDocument(doc.type)) {
      text(tableRight - 143, totalsY + (46 * scale), "Contract Value", 8, true);
      text(tableRight - 48, totalsY + (46 * scale), formatMoney(totals.contractValue), 8, true);
      text(tableRight - 143, totalsY + (32 * scale), "Previously Paid", 8, true);
      text(tableRight - 48, totalsY + (32 * scale), formatMoney(totals.previouslyPaid), 8, true);
      text(tableRight - 143, totalsY + (18 * scale), "Remaining Balance", 8, true);
      text(tableRight - 48, totalsY + (18 * scale), formatMoney(totals.remainingBalance), 8, true);
    } else if (doc.adjustmentType !== "NONE") {
      text(tableRight - 143, totalsY + (32 * scale), labels.subtotal, 8, true);
      text(tableRight - 48, totalsY + (32 * scale), formatMoney(totals.subtotal), 8, true);
      text(tableRight - 143, totalsY + (18 * scale), adjustmentLabel(), 8, true);
      text(tableRight - 48, totalsY + (18 * scale), formatMoney(totals.adjustment), 8, true);
    }
    const payableAmount = payableTotal(totals, doc);
    text(tableRight - 143, totalsY, isInvoiceDocument(doc.type) ? invoiceClaimLabel(doc) : labels.total, 9, true);
    text(tableRight - 48, totalsY, formatMoney(payableAmount), 9, true);
    
    const noteLines = isInvoiceDocument(doc.type) ? pdfWrapText(invoiceNoteText(totals, doc), Math.floor(66 / scale)) : [];
    noteLines.slice(0, 3).forEach((lineText, lineIndex) => {
      text(42, totalsY + (30 * scale) - lineIndex * LINE_HEIGHT, lineText, 8);
    });
    if (shouldShowAmountWords(doc)) {
      text(42, totalsY, payableAmount > 0 ? totalToWords(payableAmount) : "", 8, true);
    }
    
    // Position footer relative to totals to match preview
    const footerY = Math.max(85, totalsY - (40 * scale));
    text(42, footerY, labels.footerGreeting, 8);
    // Placeholder for stamp signature area
    text(42, footerY - (25 * scale), "(Stamp & Signature Placeholder)", 7, false);
    text(42, footerY - (45 * scale), settings.companyName, 8, true);
  }
  return `${commands.join("\n")}\n`;
}

function buildPdfDocument(streams, pageSpec = currentPageSpec()) {
  const objects = ["", "", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  const catalogId = 1;
  const pagesId = 2;
  const pageIds = [];
  streams.forEach((stream) => {
    const contentId = objects.length;
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
    const pageId = objects.length;
    pageIds.push(pageId);
    objects.push(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pdfNumber(pageSpec.widthPt)} ${pdfNumber(pageSpec.heightPt)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
  });
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function buildXlsxFiles() {
  const workbook = previewWorkbookData();
  const now = new Date().toISOString();
  return {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`,
    "docProps/app.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>UNITY Dashboard</Application>
</Properties>`,
    "docProps/core.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(documentFileBaseName())}</dc:title>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Preview" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    "xl/styles.xml": xlsxStylesXml(),
    "xl/worksheets/sheet1.xml": xlsxSheetXml(workbook),
  };
}

function previewWorkbookData() {
  const doc = appState.document;
  const settings = appState.settings;
  const labels = settings.labels;
  const totals = calculateTotals();
  const exportItems = previewDocumentRows();
  const payableAmount = payableTotal(totals, doc);
  const rows = [];
  const merges = [];
  const add = (cells, options = {}) => rows.push({ cells, height: options.height || "" });
  const merge = (from, to) => merges.push(`${from}:${to}`);

  add([xlsxText(settings.companyName, 1)]);
  merge("A1", "F1");
  add([xlsxText(settings.companyAddress)]);
  merge("A2", "F2");
  add([xlsxText(joinPrefix(labels.emailPrefix, settings.companyEmail))]);
  merge("A3", "F3");
  add([]);
  add([xlsxText(doc.type, 1), "", "", xlsxText(labelWithColon(labels.documentNo), 2), xlsxText(doc.number)]);
  if (shouldDisplayPoNo(doc)) {
    add(["", "", "", xlsxText(labelWithColon(labels.poNo), 2), xlsxText(doc.poNumber)]);
  }
  add([xlsxText("Client", 2), xlsxText(clientNameText(doc.clientName)), "", xlsxText(labelWithColon(labels.documentDate), 2), xlsxText(formatDisplayDate(doc.date))]);
  add([xlsxText("Address", 2), xlsxText(doc.clientAddress, 7), "", xlsxText(labelWithColon(labels.preparedBy), 2), xlsxText(doc.preparedBy)]);
  add([xlsxText(labelWithColon(doc.clientContactPrefix || labels.emailPrefix), 2), xlsxText(doc.clientEmail, 7), "", xlsxText(labelWithColon(labels.contact), 2), xlsxText(doc.contactPerson)]);
  add([xlsxText(labelWithColon(labels.re), 2), xlsxText(uppercaseText(doc.re || ""), 10), "", xlsxText(labelWithColon(labels.phone), 2), xlsxText(doc.phone)]);
  add([]);
  add(["S/N", "DESCRIPTION", "QTY", "UOM", "U/RATE", "AMOUNT"].map((value) => xlsxText(value, 3)));
  exportItems.forEach((item, index) => {
    add([
      xlsxText(itemSerialText(item, index), 4),
      xlsxText(plainDescriptionText(item), 7),
      xlsxNumber(item.qty, 4),
      xlsxText(item.uom || "", 4),
      xlsxNumber(item.rate, 5),
      xlsxNumber(itemAmount(item) || "", 5),
    ]);
  });
  add([]);
  if (isInvoiceDocument(doc.type)) {
    add(["", "", "", "", xlsxText("Contract Value", 8), xlsxNumber(totals.contractValue, 9)]);
    add(["", "", "", "", xlsxText("Previously Paid", 8), xlsxNumber(totals.previouslyPaid, 9)]);
    add(["", "", "", "", xlsxText("Remaining Balance", 8), xlsxNumber(totals.remainingBalance, 9)]);
  } else if (doc.adjustmentType !== "NONE") {
    add(["", "", "", "", xlsxText(labels.subtotal, 8), xlsxNumber(totals.subtotal, 9)]);
    add(["", "", "", "", xlsxText(adjustmentLabel(), 8), xlsxNumber(totals.adjustment, 9)]);
  }
  add(["", "", "", "", xlsxText(isInvoiceDocument(doc.type) ? invoiceClaimLabel(doc) : labels.total, 8), xlsxNumber(payableAmount, 9)]);
  if (isInvoiceDocument(doc.type)) {
    add([xlsxText(invoiceNoteText(totals, doc), 1)]);
    merge(`A${rows.length}`, `F${rows.length}`);
  }
  if (shouldShowAmountWords(doc)) {
    add([xlsxText(payableAmount > 0 ? totalToWords(payableAmount) : "", 1)]);
    merge(`A${rows.length}`, `F${rows.length}`);
  }
  add([]);
  add(["", "", "", "", xlsxText(labels.footerGreeting, 2)]);
  add([]);
  add([]);
  add(["", "", "", "", xlsxText("STAMP & SIGNATURE", 2)]);
  add(["", "", "", "", xlsxText(settings.companyName, 3)]);

  return { rows, merges };
}

function xlsxText(value, style = 0) {
  return { value: String(value || ""), type: "string", style };
}

function pdfWrapText(value, maxCharacters) {
  const input = String(value || "").trim();
  if (!input) return [];
  const lines = [];
  input.split(/\r?\n/).forEach(block => {
    let current = "";
    block.split(" ").forEach(word => {
      if (!current) {
        current = word;
      } else if (`${current} ${word}`.length <= maxCharacters) {
        current = `${current} ${word}`;
      } else {
        lines.push(current);
        current = word;
      }
      while (current.length > maxCharacters) {
        lines.push(current.slice(0, maxCharacters));
        current = current.slice(maxCharacters);
      }
    });
    if (current) lines.push(current);
    // If block was empty line, add empty line
    if (!block && input.includes("\n")) lines.push("");
  });
  return lines;
}

function pdfEscape(value) {
  return String(value || "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function pdfNumber(value) {
  return Number(value || 0).toFixed(2).replace(/\.00$/, "");
}

function xlsxNumber(value, style = 0) {
  const number = Number(value);
  if (!String(value ?? "").trim() || !Number.isFinite(number)) return xlsxText("", style);
  return { value: number, type: "number", style };
}

function xlsxSheetXml(workbook) {
  const page = currentPageSettings();
  const pageSpec = currentPageSpec();
  const rowXml = workbook.rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      const height = row.height ? ` ht="${row.height}" customHeight="1"` : "";
      const cells = row.cells
        .map((cell, columnIndex) => xlsxCellXml(cell, cellRef(columnIndex, rowNumber)))
        .join("");
      return `<row r="${rowNumber}"${height}>${cells}</row>`;
    })
    .join("");
  const merges = workbook.merges.length
    ? `<mergeCells count="${workbook.merges.length}">${workbook.merges.map((ref) => `<mergeCell ref="${ref}"/>`).join("")}</mergeCells>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15" customHeight="1"/>
  <cols>
    <col min="1" max="1" width="6" customWidth="1"/>
    <col min="2" max="2" width="50" customWidth="1"/>
    <col min="3" max="3" width="8" customWidth="1"/>
    <col min="4" max="4" width="8" customWidth="1"/>
    <col min="5" max="5" width="12" customWidth="1"/>
    <col min="6" max="6" width="14" customWidth="1"/>
  </cols>
  <sheetData>${rowXml}</sheetData>
  ${merges}
  <pageMargins left="0.3" right="0.3" top="0.3" bottom="0.3" header="0.2" footer="0.2"/>
  <pageSetup paperSize="${pageSpec.excelPaperSize}" orientation="${page.orientation}" fitToWidth="1" fitToHeight="${page.compressToFit ? "1" : "0"}"/>
</worksheet>`;
}

function xlsxCellXml(cell, ref) {
  if (cell === "" || cell == null) return `<c r="${ref}"/>`;
  const style = cell.style ? ` s="${cell.style}"` : "";
  if (cell.type === "number") {
    return `<c r="${ref}"${style}><v>${cell.value}</v></c>`;
  }
  return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(cell.value)}</t></is></c>`;
}

function cellRef(columnIndex, rowNumber) {
  let column = "";
  let number = columnIndex + 1;
  while (number > 0) {
    const remainder = (number - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    number = Math.floor((number - 1) / 26);
  }
  return `${column}${rowNumber}`;
}

function xlsxStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1"><numFmt numFmtId="164" formatCode="$#,##0.00"/></numFmts>
  <fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font><font><b/><sz val="12"/><name val="Arial"/></font></fonts>
  <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEFF6F8"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="3"><border/><border><top style="thin"><color rgb="FF111111"/></top><bottom style="thin"><color rgb="FF111111"/></bottom></border><border><bottom style="thin"><color rgb="FF111111"/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="10">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment horizontal="center"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment horizontal="right"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment horizontal="right"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment wrapText="1" vertical="top"/></xf>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="right"/></xf>
    <xf numFmtId="164" fontId="1" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="right"/></xf>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment wrapText="1" vertical="top"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
  <dxfs count="0"/>
  <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
</styleSheet>`;
}

function zipFiles(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = typeof content === "string" ? encoder.encode(content) : content;
    const crc = crc32(data);
    const localHeader = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
    ]);
    localParts.push(localHeader, data);
    centralParts.push(
      concatBytes([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(nameBytes.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        nameBytes,
      ]),
    );
    offset += localHeader.length + data.length;
  });
  const centralDirectory = concatBytes(centralParts);
  const endRecord = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(Object.keys(files).length),
    u16(Object.keys(files).length),
    u32(centralDirectory.length),
    u32(offset),
    u16(0),
  ]);
  return concatBytes([...localParts, centralDirectory, endRecord]);
}

function u16(value) {
  return new Uint8Array([value & 255, (value >>> 8) & 255]);
}

function u32(value) {
  return new Uint8Array([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255]);
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function crc32(bytes) {
  const table = crc32.table || (crc32.table = makeCrcTable());
  let crc = -1;
  for (let index = 0; index < bytes.length; index++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[index]) & 255];
  }
  return (crc ^ -1) >>> 0;
}

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index++) {
    let value = index;
    for (let bit = 0; bit < 8; bit++) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
}

function buildPreviewExcelHtml() {
  const clone = dom.printArea.cloneNode(true);
  clone.classList.remove("preview-editing");
  clone.querySelectorAll("[contenteditable]").forEach((element) => {
    element.removeAttribute("contenteditable");
    element.removeAttribute("spellcheck");
  });
  clone.querySelectorAll(".preview-selected, .preview-dragging").forEach((element) => {
    element.classList.remove("preview-selected", "preview-dragging");
  });
  clone.querySelectorAll("[data-preview-id], [data-preview-move-id], [data-preview-item-field]").forEach((element) => {
    element.removeAttribute("data-preview-id");
    element.removeAttribute("data-preview-move-id");
    element.removeAttribute("data-preview-item-field");
    element.removeAttribute("data-preview-index");
  });
  clone.querySelectorAll("img").forEach((image) => {
    const source = image.getAttribute("src");
    if (source) image.src = new URL(source, window.location.href).href;
  });

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(documentFileBaseName())}</title>
    <style>
      body { margin: 0; background: #fff; color: #111; font-family: Arial, sans-serif; }
      .paper-page {
        width: var(--paper-width);
        min-height: var(--paper-height);
        padding: var(--paper-margin-top) var(--paper-margin-side) var(--paper-margin-bottom);
        border: 1px solid var(--line);
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 12px 30px rgba(22, 32, 42, 0.08);
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
      }
      .paper-page:last-child { page-break-after: auto; }
      .paper-header { display: grid; grid-template-columns: 224px 1fr 92px; gap: 14px; align-items: start; min-height: 68px; }
      .paper-logo { width: 224px; max-height: 46px; object-fit: contain; }
      .bizsafe { width: 90px; object-fit: contain; justify-self: end; }
      .document-title { padding-top: 14px; text-align: center; font-size: 22px; font-weight: 800; line-height: 1.1; }
      .preview-details-grid { display: grid; grid-template-columns: 1fr 230px; gap: 24px; margin-top: 8px; align-items: start; }
      .preview-left-details { display: grid; gap: 8px; }
      .company-row, .client-row { display: grid; grid-template-columns: 1fr; gap: 0; margin-top: 0; align-items: start; }
      .company-row > div, .client-row > div, .document-info-block, .bank-details, .paper-footer div { display: grid; gap: 4px; }
      .document-info-block { margin: 0; gap: 2px; }
      .document-info-block dt, .document-info-block dd { line-height: 1.08; }
      .company-row strong, .client-row strong { font-size: 13px; }
      .company-row span,
      .client-row span,
      .bank-details span,
      .paper-footer span {
        font-size: 12px;
        line-height: 1.35;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .preview-re-line { display: grid; grid-template-columns: 48px 1fr; gap: 8px; align-items: start; }
      .paper dl { display: grid; gap: 5px; margin: 0; }
      .paper dl div { display: grid; grid-template-columns: 128px 1fr; gap: 8px; align-items: start; }
      .paper dt { position: relative; color: #333; font-size: 12px; white-space: nowrap; }
      .paper dd { margin: 0; text-align: left; font-size: 12px; font-weight: 400; }
      .preview-re-value { font-weight: 700; text-transform: uppercase; word-wrap: break-word; overflow-wrap: break-word; }
      .edge-colon-label { position: relative; padding-right: 10px; }
      .edge-colon-label::after { content: ":"; position: absolute; right: 0; }
      .preview-items {
        width: 100%;
        border-collapse: collapse;
        margin-top: 24px;
        table-layout: fixed;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .preview-items th, .preview-items td { border: 0; padding: 7px 6px; color: #111; font-size: 12px; vertical-align: top; }
      .preview-items th { background: #fff; border-top: 1.5px solid #000 !important; border-bottom: 1.5px solid #000 !important; text-align: center; color: #000 !important; }
      .preview-items tbody tr td { border-bottom: none; }
      .preview-items tbody tr:last-child td { border-bottom: 1.5px solid #000 !important; }
      .preview-items th:first-child, .preview-items td:first-child { width: 44px; text-align: center; }
      .preview-items th:nth-child(2), .preview-items td:nth-child(2) { text-align: left; }
      .preview-items th:nth-child(3), .preview-items td:nth-child(3), .preview-items th:nth-child(4), .preview-items td:nth-child(4) { width: 62px; text-align: center; }
      .preview-items th:nth-child(5), .preview-items td:nth-child(5), .preview-items th:nth-child(6), .preview-items td:nth-child(6) { width: 82px; text-align: right; }
      .preview-description { white-space: pre-wrap; overflow-wrap: anywhere; }
      .paper-totals { display: grid; grid-template-columns: 1fr 250px; gap: 24px; margin-top: 14px; }
      .paper-totals.single-total { grid-template-columns: minmax(190px, 250px); justify-content: end; }
      .paper-total-notes { display: grid; gap: 8px; padding-top: 12px; }
      .paper-total-notes[hidden] { display: none; }
      .paper-totals p { padding-top: 12px; font-size: 12px; font-weight: 700; line-height: 1.45; }
      .paper-total-notes p { padding-top: 0; }
      .invoice-note { font-weight: 500; }
      .paper-totals dl { border-top: 1px solid #111; }
      .paper-totals dl div { grid-template-columns: 1fr 96px; padding: 6px 0; border-bottom: 1px solid #111; }
      .paper-totals .grand-total {
        border-top: 1px solid #000;
        border-bottom: 3.5px double #000;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-top: 4px;
        font-weight: 800;
      }
      .paper-totals dd, .paper-totals .grand-total dt {
        color: #000;
        font-weight: 700;
        font-size: 12px;
      }
      .bank-details { margin-top: 18px; font-size: 12px; }
      .paper-footer { margin-top: 22px; }
      .paper-footer img { width: 128px; height: 128px; object-fit: contain; }
    </style>
  </head>
  <body>${clone.outerHTML}</body>
</html>`;
}

function documentFileBaseName() {
  const doc = appState.document;
  return sanitizeFileName(`${doc.number || "document"} - ${doc.clientName || "Client"}`);
}

function sanitizeFileName(value) {
  return (
    String(value || "document")
      .replace(/[\\/:*?"<>|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "document"
  );
}

function updateCurrentRecordFiles(fields) {
  const record = appState.records.find((item) => String(item.documentNumber) === String(appState.document.number || "").trim());
  if (!record) return;
  Object.assign(record, fields);
  saveState({ skipHistory: true });
  renderRecords();
}

function buildExcelXml() {
  const totals = calculateTotals();
  const doc = appState.document;
  const settings = appState.settings;
  const labels = settings.labels;
  const payableAmount = payableTotal(totals, doc);
  const documentNoLabel = labelWithColon(labels.documentNo);
  const documentDateLabel = labelWithColon(labels.documentDate);
  const preparedByLabel = labelWithColon(labels.preparedBy);
  const contactLabel = labelWithColon(labels.contact);
  const phoneLabel = labelWithColon(labels.phone);
  const reLabel = labelWithColon(labels.re);
  const exportItems = previewDocumentRows();
  const totalRows =
    isInvoiceDocument(doc.type)
      ? [
          ["", "", "", "", "Contract Value", totals.contractValue],
          ["", "", "", "", "Previously Paid", totals.previouslyPaid],
          ["", "", "", "", "Remaining Balance", totals.remainingBalance],
          ["", "", "", "", invoiceClaimLabel(doc), payableAmount],
          [invoiceNoteText(totals, doc)],
          [totalToWords(payableAmount)],
        ]
      : doc.adjustmentType === "NONE"
      ? [
          ["", "", "", "", labels.total, totals.total],
          ...(shouldShowAmountWords(doc) ? [[totalToWords(totals.total)]] : []),
        ]
      : [
          ["", "", "", "", labels.subtotal, totals.subtotal],
          ["", "", "", "", adjustmentLabel(), totals.adjustment],
          ["", "", "", "", labels.total, totals.total],
          [totalToWords(totals.total)],
        ];
  const rows = [
    [settings.companyName],
    [settings.companyAddress],
    [labels.emailPrefix, settings.companyEmail],
    [],
    [doc.type, "", "", documentNoLabel, doc.number],
    ...(shouldDisplayPoNo(doc) ? [["", "", "", labelWithColon(labels.poNo), doc.poNumber]] : []),
    ["Client", clientNameText(doc.clientName), "", documentDateLabel, formatDisplayDate(doc.date)],
    ["Address", doc.clientAddress, "", preparedByLabel, doc.preparedBy],
    [doc.clientContactPrefix || labels.emailPrefix, doc.clientEmail, "", contactLabel, doc.contactPerson],
    [reLabel, uppercaseText(doc.re || "")],
    [phoneLabel, doc.phone],
    [],
    ["S/N", "DESCRIPTION", "QTY", "UOM", "U/RATE", "AMOUNT"],
    ...exportItems.map((item, index) => [
      itemSerialText(item, index),
      plainDescriptionText(item),
      item.qty === "" ? "" : Number(item.qty || 0),
      item.uom,
      item.rate === "" ? "" : Number(item.rate || 0),
      itemAmount(item) || "",
    ]),
    [],
    ...totalRows,
  ];
  const recordRows = [
    ["SAVED AT", "DOCUMENT TYPE", "DOCUMENT NUMBER", "COMPANY", "DATE", "SAVE AS PDF", "SAVE AS EXCEL"],
    ...appState.records.map((record) => [
      formatDateTime(record.savedAt),
      recordDocumentType(record),
      record.documentNumber,
      record.company,
      formatDisplayDate(record.date),
      record.pdf || "PDF",
      record.excel || "Excel",
    ]),
  ];

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#EEF4F6" ss:Pattern="Solid"/></Style>
  <Style ss:ID="money"><NumberFormat ss:Format="$#,##0.00"/></Style>
  <Style ss:ID="tableHeader"><Font ss:Bold="1"/><Interior ss:Color="#EEF4F6" ss:Pattern="Solid"/><Borders><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
  <Style ss:ID="tableCell"/>
  <Style ss:ID="tableLast"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
 </Styles>
 ${worksheetXml("Quotation", rows, { headerRowIndex: 10, firstBodyRowIndex: 11, lastBodyRowIndex: 10 + exportItems.length })}
 ${worksheetXml("Records", recordRows)}
</Workbook>`;
}

function worksheetXml(name, rows, tableOptions = {}) {
  return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${rows.map((row, rowIndex) => rowXml(row, rowIndex, tableOptions)).join("")}</Table></Worksheet>`;
}

function rowXml(row, rowIndex, tableOptions) {
  const styleId = tableStyleForRow(rowIndex, tableOptions) || (rowIndex === 0 ? "header" : "");
  return `<Row>${row.map((cell) => cellXml(cell, styleId)).join("")}</Row>`;
}

function tableStyleForRow(rowIndex, tableOptions) {
  if (rowIndex === tableOptions.headerRowIndex) return "tableHeader";
  if (rowIndex >= tableOptions.firstBodyRowIndex && rowIndex <= tableOptions.lastBodyRowIndex) {
    return rowIndex === tableOptions.lastBodyRowIndex ? "tableLast" : "tableCell";
  }
  return "";
}

function cellXml(value, styleId) {
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const style = styleId ? ` ss:StyleID="${styleId}"` : "";
  const type = isNumber ? "Number" : "String";
  return `<Cell${style}><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
}

function formatMoney(value) {
  const amount = Number(value || 0);
  const sign = amount < 0 ? "-" : "";
  return `${sign}${currencySymbol()}${Math.abs(amount).toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function currencySymbol() {
  return appState.settings?.currencySymbol || "$";
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function parseEditableDate(value) {
  const text = String(value || "").trim();
  if (!text) return appState.document.date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!match) return appState.document.date;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  const rawYear = match[3];
  const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
  return `${year}-${month}-${day}`;
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function joinPrefix(prefix, value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const label = String(prefix || "").trim();
  return label ? `${label} ${text}` : text;
}

function labelWithColon(value) {
  const text = labelEdgeText(value);
  if (!text) return "";
  return /[:：]$/.test(text) ? text : `${text}:`;
}

function labelEdgeText(value) {
  return String(value || "").trim().replace(/[:：]\s*$/, "");
}

function uppercaseText(value) {
  return String(value || "").toUpperCase();
}

function formatDescriptionText(value) {
  return String(value || "")
    .split(/(\s+)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part)) return part;
      const letters = part.match(/[A-Za-z]/g) || [];
      if (letters.length > 1 && letters.every((letter) => letter === letter.toUpperCase())) return part;
      const lower = part.toLowerCase();
      if (/^\d/.test(part)) return lower;
      const firstLetterIndex = lower.search(/[a-z]/);
      if (firstLetterIndex < 0) return part;
      return part.slice(0, firstLetterIndex) + lower[firstLetterIndex].toUpperCase() + lower.slice(firstLetterIndex + 1);
    })
    .join("");
}

function descriptionEditorHtml(item) {
  const previewDocumentKey = "GLOBAL_TEMPLATE_LAYOUT";
  return sanitizeDescriptionHtml(item.descriptionHtml || "") || descriptionTextToHtml(item.description || "");
}

function descriptionPreviewHtml(item) {
  return descriptionEditorHtml(item);
}

function plainDescriptionText(item) {
  return String(item.description || descriptionHtmlToText(item.descriptionHtml || "") || "");
}

function syncDescriptionEditor(editor, options = {}) {
  const item = appState.document.items[Number(editor.dataset.index)];
  if (!item) return;
  const html = options.format ? formatDescriptionHtml(editor.innerHTML) : sanitizeDescriptionHtml(editor.innerHTML);
  item.descriptionHtml = html;
  item.description = descriptionHtmlToText(html);
  if (options.updateEditor && editor.innerHTML !== html) {
    editor.innerHTML = html;
  }
}

function formatDescriptionHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = sanitizeDescriptionHtml(html);
  formatDescriptionTextNodes(template.content);
  return trimDescriptionHtml(template.innerHTML);
}

function formatDescriptionTextNodes(node) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.nodeValue = formatDescriptionText(child.nodeValue || "");
      return;
    }
    formatDescriptionTextNodes(child);
  });
}

function descriptionTextToHtml(text) {
  return escapeHtml(text).replace(/\r?\n/g, "<br>");
}

function sanitizeDescriptionHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  return trimDescriptionHtml(Array.from(template.content.childNodes).map(sanitizeDescriptionNode).join(""));
}

function sanitizeDescriptionNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.nodeValue || "").replace(/\r?\n/g, "<br>");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const tag = node.tagName.toLowerCase();
  if (tag === "br") return "<br>";
  const children = Array.from(node.childNodes).map(sanitizeDescriptionNode).join("");
  if (!children) return "";
  if (tag === "b" || tag === "strong") return `<strong>${children}</strong>`;
  if (tag === "i" || tag === "em") return `<em>${children}</em>`;
  if (tag === "u") return `<u>${children}</u>`;
  if (tag === "sup") return `<sup>${children}</sup>`;
  if (tag === "div" || tag === "p") return `${children}<br>`;
  return children;
}

function trimDescriptionHtml(html) {
  return String(html || "")
    .replace(/(?:<br>\s*)+$/gi, "")
    .trim();
}

function descriptionHtmlToText(html) {
  const template = document.createElement("template");
  template.innerHTML = sanitizeDescriptionHtml(html);
  return descriptionNodeText(template.content).replace(/\u00a0/g, " ").replace(/\n+$/g, "");
}

function descriptionNodeText(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || "";
  if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return "";
  if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "br") return "\n";
  return Array.from(node.childNodes).map(descriptionNodeText).join("");
}

function moveCaretToEnd(element) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function totalToWords(value) {
  const rounded = Math.round(Math.abs(Number(value || 0)) * 100) / 100;
  const dollars = Math.floor(rounded);
  const cents = Math.round((rounded - dollars) * 100);
  const prefix = Number(value) < 0 ? "Minus " : "";
  if (!dollars && !cents) return "";
  if (cents === 0) {
    return `${prefix}${numberToWords(dollars)} Singapore Dollars Only`;
  }
  return `${prefix}${numberToWords(dollars)} Singapore Dollars and ${numberToWords(cents)} Cents Only`;
}

function numberToWords(number) {
  const ones = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = [
    { value: 1000000000, name: "Billion" },
    { value: 1000000, name: "Million" },
    { value: 1000, name: "Thousand" },
    { value: 100, name: "Hundred" },
  ];

  if (number < 20) return ones[number];
  if (number < 100) {
    return `${tens[Math.floor(number / 10)]}${number % 10 ? ` ${ones[number % 10]}` : ""}`;
  }

  for (const scale of scales) {
    if (number >= scale.value) {
      const leading = Math.floor(number / scale.value);
      const rest = number % scale.value;
      return `${numberToWords(leading)} ${scale.name}${rest ? ` ${numberToWords(rest)}` : ""}`;
    }
  }
  return String(number);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  toastTimer = window.setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 2200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function escapeXml(value) {
  return escapeHtml(value);
}



window.addEventListener("DOMContentLoaded", init);
