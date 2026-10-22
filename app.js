// ESTADO GLOBAL
let db = null;
let currentRole = 'docente';
let currentSearchResults = [];
let currentSchool = null;
let currentReportType = null;
let currentReportText = '';
let currentReportHash = '';
let isSigned = false;
let zoneChartInstance = null;
let deptChartInstance = null;

// SEMILLA DE DATOS (Eliminar cuando la API de datos.gov.co funcione 100% en tu entorno)
// Se usa solo si la API falla y la base IndexedDB está vacía.
const SEED_DATA = [
    { dane: "113001000123", nombre: "I.E. TECNICA AGROPECUARIA EL SALADO", depto: "BOLIVAR", municipio: "CARMEN DE BOLIVAR", zona: "RURAL" },
    { dane: "120001000456", nombre: "INSTITUCION EDUCATIVA RIO SECO", depto: "CESAR", municipio: "VALLEDUPAR", zona: "RURAL" }
];

document.addEventListener('DOMContentLoaded', async () => {
    await initIndexedDB();
    initChartsSafely();
    checkNetworkStatus();
    await executeNationalSearch(); // Carga inicial
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
});

// 1. INDEXEDDB
function initIndexedDB() {
    return new Promise((resolve) => {
        try {
            const request = indexedDB.open("GSBC_DB_v11", 1);
            request.onupgradeneeded = (e) => {
                const database = e.target.result;
                if (!database.objectStoreNames.contains("schools")) {
                    database.createObjectStore("schools", { keyPath: "dane" });
                }
                if (!database.objectStoreNames.contains("reports")) {
                    database.createObjectStore("reports", { keyPath: "id", autoIncrement: true });
                }
                if (!database.objectStoreNames.contains("audit")) {
                    database.createObjectStore("audit", { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = (e) => {
                db = e.target.result;
                updateCounts();
                loadAuditLogs();
                resolve();
            };
            request.onerror = (e) => {
                console.warn("Error IndexedDB:", e);
                resolve();
            };
        } catch (err) {
            console.warn("IndexedDB no soportado:", err);
            resolve();
        }
    });
}

// 2. ESTADO DE RED
function checkNetworkStatus() {
    const statusDiv = document.getElementById('connectionStatus');
    const syncBanner = document.getElementById('syncBanner');
    const offlineStatusText = document.getElementById('offlineStatusText');

    if (navigator.onLine) {
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span class="text-emerald-400">En línea</span>`;
        syncBanner.classList.add('hidden');
        offlineStatusText.textContent = "Sincronizado";
        offlineStatusText.className = "font-mono text-emerald-400";
    } else {
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span class="text-amber-400">Modo Offline</span>`;
        syncBanner.textContent = "⚡ Operando en Modo 100% Offline. Todos los reportes se guardarán en la memoria local.";
        syncBanner.classList.remove('hidden');
        offlineStatusText.textContent = "Totalmente Funcional (Local)";
        offlineStatusText.className = "font-mono text-blue-400";
    }
}

// 3. CAMBIO DE ROL
function changeRole(role) {
    currentRole = role;
    const body = document.getElementById('appBody');
    const adminSec = document.getElementById('adminSection');
    const badgeHelp = document.getElementById('roleBad
