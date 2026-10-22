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
    const badgeHelp = document.getElementById('roleBadgeHelp');

    body.classList.remove('role-estudiante', 'role-docente', 'role-admin');
    body.classList.add(`role-${role}`);

    if (role === 'admin') {
        adminSec.classList.remove('hidden');
        badgeHelp.textContent = "Modo Administrador (Control Total & Respaldo)";
        badgeHelp.className = "text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-medium";
    } else if (role === 'docente') {
        adminSec.classList.add('hidden');
        badgeHelp.textContent = "Modo Docente / Rector (Generación & Firma)";
        badgeHelp.className = "text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-medium";
    } else {
        adminSec.classList.add('hidden');
        badgeHelp.textContent = "Modo Consulta (Estudiante)";
        badgeHelp.className = "text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-medium";
    }
}

// 4. BÚSQUEDA (API real con fallback a IndexedDB)
async function executeNationalSearch() {
    const query = (document.getElementById('searchInput').value || "").trim().toUpperCase();
    const sourceBadge = document.getElementById('searchSourceBadge');
    let results = [];

    // Intentar API si hay internet
    if (navigator.onLine && query.length >= 3) {
        try {
            const url = `https://www.datos.gov.co/resource/23ew-ty2e.json?$where=lower(nombreinstitucion) like lower('%25${query}%25') OR lower(departamento) like lower('%25${query}%25')&$limit=20`;
            const response = await fetch(url);
            if (response.ok) {
                const apiData = await response.json();
                if (apiData && apiData.length > 0) {
                    results = apiData.map(item => ({
                        dane: item.codigodane || item.codigo_dane || "N/A",
                        nombre: item.nombreinstitucion || item.nombre_establecimiento || "I.E. SIN NOMBRE",
                        depto: item.departamento || "N/A",
                        municipio: item.municipio || "N/A",
                        zona: item.zona || "RURAL"
                    }));
                    sourceBadge.textContent = "Origen: API Datos Abiertos";
                    // Guardar en IndexedDB para offline
                    saveSchoolsToDB(results);
                }
            }
        } catch (e) {
            console.warn("API falló, usando IndexedDB.", e);
        }
    }

    // Fallback a IndexedDB o Seed
    if (results.length === 0) {
        if (!query) {
            results = await getSchoolsFromDB();
            if (results.length === 0) results = SEED_DATA;
        } else {
            const allLocal = await getSchoolsFromDB();
            const dataToFilter = allLocal.length > 0 ? allLocal : SEED_DATA;
            results = dataToFilter.filter(item =>
                item.dane.includes(query) ||
                item.nombre.toUpperCase().includes(query) ||
                item.depto.toUpperCase().includes(query) ||
                item.municipio.toUpperCase().includes(query)
            );
        }
        sourceBadge.textContent = "Origen: Base Local Offline (IndexedDB)";
    }

    currentSearchResults = results;
    renderSchoolResults(results);
}

function resetSearch() {
    document.getElementById('searchInput').value = '';
    executeNationalSearch();
}

// 5. RENDERIZADO
function renderSchoolResults(schools) {
    const tableBody = document.getElementById('schoolTableBody');
    tableBody.innerHTML = '';

    if (schools.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-500">No se encontraron instituciones educativas.</td></tr>`;
        updateMetrics([], 0, 0);
        return;
    }

    let ruralCount = 0;
    const deptosSet = new Set();

    schools.forEach((s, idx) => {
        if (s.zona.toUpperCase().includes('RURAL')) ruralCount++;
        deptosSet.add(s.depto);

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-700/50 transition border-b border-slate-700/40";
        tr.innerHTML = `
            <td class="p-3 font-mono text-slate-300">${s.dane}</td>
            <td class="p-3 font-semibold text-white">${s.nombre}</td>
            <td class="p-3 text-slate-300">${s.depto}</td>
            <td class="p-3 text-slate-300">${s.municipio}</td>
            <td class="p-3"><span class="px-2 py-0.5 text-[10px] rounded font-bold ${s.zona.toUpperCase().includes('RURAL') ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'bg-blue-900/80 text-blue-300 border border-blue-700'}">${s.zona}</span></td>
            <td class="p-3 text-center">
                <button onclick="selectSchoolByIndex(${idx})" class="bg-blue-600 hover:bg-blue-500 text-white text-[11px] px-2.5 py-1 rounded font-medium transition shadow-sm" aria-label="Seleccionar ${s.nombre}">
                    Seleccionar
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    updateMetrics(schools, ruralCount, deptosSet.size);
    updateChartsSafely(schools);
}

function selectSchoolByIndex(index) {
    if (!currentSearchResults[index]) return;
    currentSchool = currentSearchResults[index];

    const infoBox = document.getElementById('selectedSchoolInfo');
    infoBox.innerHTML = `
        <div class="flex flex-wrap items-center justify-between text-slate-200 font-medium w-full gap-2">
            <span class="text-blue-400 font-bold"><i class="fa-solid fa-school text-blue-400 mr-1.5" aria-hidden="true"></i> ${currentSchool.nombre}</span>
            <span class="text-slate-400 text-[11px]">DANE: <code class="text-amber-300 font-mono">${currentSchool.dane}</code> | ${currentSchool.municipio}, ${currentSchool.depto} (${currentSchool.zona})</span>
        </div>
    `;
    infoBox.className = "bg-slate-900 p-3 rounded-lg border border-blue-500/50 text-xs mb-3 shadow-inner";
}

// 6. REPORTES
function prepareReport(type) {
    if (!currentSchool) {
        alert("Por favor selecciona primero una institución educativa.");
        return;
    }

    currentReportType = type;
    isSigned = false;

    const previewArea = document.getElementById('reportPreviewArea');
    previewArea.classList.remove('hidden');
    
    document.getElementById('reportTitleHeader').textContent = `Documento Oficial: ${type} — ${currentSchool.nombre}`;
    
    const sigBadge = document.getElementById('reportSignatureBadge');
    sigBadge.textContent = "Pendiente de Firma R-PC-03";
    sigBadge.className = "bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px]";

    // Plantillas simplificadas (puedes expandirlas)
    const templates = {
        'PEI': `DOCUMENTO INSTITUCIONAL PEI\n\nINSTITUCIÓN: ${currentSchool.nombre}\nDANE: ${currentSchool.dane}\nUBICACIÓN: ${currentSchool.municipio}, ${currentSchool.depto}\n\n1. COMPONENTE DIRECTIVO\n...`,
        'Plan de Estudio': `PLAN DE ESTUDIOS\n\nINSTITUCIÓN: ${currentSchool.nombre}\nDANE: ${currentSchool.dane}\n\nEstructura curricular...`,
        'PMI': `PLAN DE MEJORAMIENTO INSTITUCIONAL (PMI)\n\nINSTITUCIÓN: ${currentSchool.nombre}\nDANE: ${currentSchool.dane}\n\nObjetivo Estratégico...`,
        'Manual de Convivencia': `MANUAL DE CONVIVENCIA\n\nINSTITUCIÓN: ${currentSchool.nombre}\nDANE: ${currentSchool.dane}\n\nDefine los derechos...`,
        'SIEE': `SISTEMA INSTITUCIONAL DE EVALUACIÓN (SIEE)\n\nINSTITUCIÓN: ${currentSchool.nombre}\nDANE: ${currentSchool.dane}\n\nEstablece los criterios...`
    };

    currentReportText = templates[type] || "Contenido no disponible.";
    document.getElementById('reportContentText').textContent = currentReportText;
    previewArea.scrollIntoView({ behavior: 'smooth' });
}

// 7. FIRMA SHA-256
async function signCurrentReport() {
    if (!currentReportText) return;
    if (currentRole === 'estudiante') {
        alert("El rol 'Estudiante' es de consulta. Cambia a 'Docente / Rector' para firmar.");
        return;
    }

    const rawString = currentReportText + " | FECHA: " + new Date().toISOString();
    currentReportHash = await generateSHA256(rawString);
    isSigned = true;

    const sigBadge = document.getElementById('reportSignatureBadge');
    sigBadge.textContent = `Firmado R-PC-03 | HASH: ${currentReportHash.substring(0, 14)}...`;
    sigBadge.className = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono";

    saveReportToDB();
}

async function generateSHA256(str) {
    try {
        if (window.crypto && window.crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {
        console.warn("Fallback JS Hash");
    }
    // Fallback simple (no criptográfico, solo para demo si falla crypto.subtle)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return `fallback_${Math.abs(hash).toString(16)}`;
}

// 8. INDEXEDDB HELPERS
function saveReportToDB() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports", "audit"], "readwrite");
        tx.objectStore("reports").add({
            dane: currentSchool.dane,
            colegio: currentSchool.nombre,
            tipo: currentReportType,
            fecha: new Date().toLocaleString(),
            hash: currentReportHash,
            contenido: currentReportText
        });
        tx.objectStore("audit").add({
            dane: currentSchool.dane,
            tipo: currentReportType,
            fecha: new Date().toLocaleDateString(),
            hash: currentReportHash,
            estado: "Firmado y Validado"
        });
        tx.oncomplete = () => {
            updateCounts();
            loadAuditLogs();
            alert("¡Documento firmado y guardado localmente!");
        };
    } catch(e) { console.error(e); }
}

function saveSchoolsToDB(schools) {
    if (!db) return;
    const tx = db.transaction(["schools"], "readwrite");
    const store = tx.objectStore("schools");
    schools.forEach(s => store.put(s));
}

function getSchoolsFromDB() {
    return new Promise((resolve) => {
        if (!db) return resolve([]);
        const tx = db.transaction(["schools"], "readonly");
        const req = tx.objectStore("schools").getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve([]);
    });
}

// ... (El resto de funciones de gráficos, auditoría, exportación y AI se mantienen igual que en tu código original, solo asegúrate de que los IDs coincidan) ...
