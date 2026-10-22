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

const SEED_DATA = [
    { dane: "113001000123", nombre: "I.E. TECNICA AGROPECUARIA EL SALADO", depto: "BOLIVAR", municipio: "CARMEN DE BOLIVAR", zona: "RURAL" },
    { dane: "120001000456", nombre: "INSTITUCION EDUCATIVA RIO SECO", depto: "CESAR", municipio: "VALLEDUPAR", zona: "RURAL" }
];

document.addEventListener('DOMContentLoaded', async () => {
    await initIndexedDB();
    initChartsSafely();
    checkNetworkStatus();
    await executeNationalSearch();
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
});

// 1. INDEXEDDB (Versión 2 para forzar actualización de estructura)
function initIndexedDB() {
    return new Promise((resolve) => {
        try {
            // CAMBIO AQUÍ: Versión 2
            const request = indexedDB.open("GSBC_DB_v11", 2);
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
        if (offlineStatusText) {
            offlineStatusText.textContent = "Sincronizado";
            offlineStatusText.className = "font-mono text-emerald-400";
        }
    } else {
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span class="text-amber-400">Modo Offline</span>`;
        syncBanner.textContent = "⚡ Operando en Modo 100% Offline. Todos los reportes se guardarán en la memoria local.";
        syncBanner.classList.remove('hidden');
        if (offlineStatusText) {
            offlineStatusText.textContent = "Totalmente Funcional (Local)";
            offlineStatusText.className = "font-mono text-blue-400";
        }
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

// 4. BÚSQUEDA (API real corregida)
async function executeNationalSearch() {
    const query = (document.getElementById('searchInput').value || "").trim().toUpperCase();
    const sourceBadge = document.getElementById('searchSourceBadge');
    let results = [];

    if (navigator.onLine && query.length >= 3) {
        try {
            // CAMBIO AQUÍ: ID del recurso corregido a 6k5y-ir6r
           // Usamos el dataset del DUE 2022 (ID: 28t6-6wvz) y consultamos por nombre de establecimiento o departamento
const url = `https://www.datos.gov.co/resource/28t6-6wvz.json?$where=lower(nombre_establecimiento) like lower('%25${query}%25') OR lower(departamento) like lower('%25${query}%25') AND a_o=2022&$limit=2000`;
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
                    saveSchoolsToDB(results);
                }
            }
        } catch (e) {
            console.warn("API falló, usando IndexedDB.", e);
        }
    }

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
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return `fallback_${Math.abs(hash).toString(16)}`;
}

// 8. INDEXEDDB HELPERS (AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA)
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
    try {
        const tx = db.transaction(["schools"], "readwrite");
        const store = tx.objectStore("schools");
        schools.forEach(s => store.put(s));
    } catch(e) { console.error("Error guardando escuelas:", e); }
}

function getSchoolsFromDB() {
    return new Promise((resolve) => {
        if (!db) return resolve([]);
        try {
            const tx = db.transaction(["schools"], "readonly");
            const req = tx.objectStore("schools").getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve([]);
        } catch(e) {
            resolve([]);
        }
    });
}

// --- FUNCIONES RESTAURADAS QUE FALTABAN ---
function updateCounts() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports"], "readonly");
        const store = tx.objectStore("reports");
        const countReq = store.count();
        countReq.onsuccess = () => {
            const localCount = document.getElementById('localCount');
            const metricSigned = document.getElementById('metricSigned');
            if (localCount) localCount.textContent = countReq.result;
            if (metricSigned) metricSigned.textContent = countReq.result;
        };
    } catch (e) { console.warn("Error en updateCounts", e); }
}

function updateMetrics(schools, ruralCount, deptosCount) {
    const elTotal = document.getElementById('metricTotal');
    const elRural = document.getElementById('metricRural');
    const elDeptos = document.getElementById('metricDeptos');
    if (elTotal) elTotal.textContent = schools.length;
    if (elRural) elRural.textContent = ruralCount;
    if (elDeptos) elDeptos.textContent = deptosCount;
}

function loadAuditLogs() {
    if (!db) return;
    try {
        const tx = db.transaction(["audit"], "readonly");
        const store = tx.objectStore("audit");
        const req = store.getAll();

        req.onsuccess = () => {
            const logs = req.result;
            const tbody = document.getElementById('auditTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';

            if (logs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-3 text-center text-slate-500 italic">No hay firmas guardadas en la base local.</td></tr>`;
                return;
            }

            logs.slice(-5).reverse().forEach(log => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="p-1.5">${log.dane}</td>
                    <td class="p-1.5 text-sky-400">${log.tipo}</td>
                    <td class="p-1.5 text-slate-400">${log.fecha}</td>
                    <td class="p-1.5 font-mono text-amber-400 text-[10px]">${log.hash.substring(0, 10)}...</td>
                    <td class="p-1.5 text-center"><span class="text-emerald-400 font-semibold">${log.estado}</span></td>
                `;
                tbody.appendChild(tr);
            });
        };
    } catch(e) { console.warn(e); }
}

function initChartsSafely() {
    if (typeof Chart === 'undefined') return;
    try {
        const ctxZone = document.getElementById('zoneChart');
        if (ctxZone) {
            zoneChartInstance = new Chart(ctxZone.getContext('2d'), {
                type: 'doughnut',
                data: { labels: ['Rural', 'Urbana'], datasets: [{ data: [0, 0], backgroundColor: ['#10b981', '#3b82f6'] }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } } }
            });
        }

        const ctxDept = document.getElementById('deptChart');
        if (ctxDept) {
            deptChartInstance = new Chart(ctxDept.getContext('2d'), {
                type: 'bar',
                data: { labels: [], datasets: [{ label: 'Sedes', data: [], backgroundColor: '#8b5cf6' }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#94a3b8', font: { size: 9 } } }, y: { ticks: { color: '#94a3b8', font: { size: 9 } } } }, plugins: { legend: { display: false } } }
            });
        }
    } catch(e) { console.warn("Chart.js error:", e); }
}

function updateChartsSafely(schools) {
    if (!zoneChartInstance || !deptChartInstance) return;
    try {
        let rural = 0, urbana = 0;
        const deptCounts = {};

        schools.forEach(s => {
            if (s.zona.toUpperCase().includes('RURAL')) rural++;
            else urbana++;
            deptCounts[s.depto] = (deptCounts[s.depto] || 0) + 1;
        });

        zoneChartInstance.data.datasets[0].data = [rural, urbana];
        zoneChartInstance.update();

        deptChartInstance.data.labels = Object.keys(deptCounts);
        deptChartInstance.data.datasets[0].data = Object.values(deptCounts);
        deptChartInstance.update();
    } catch(e) { console.warn(e); }
}

function exportFullBackupJSON() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports", "audit"], "readonly");
        const reportsReq = tx.objectStore("reports").getAll();
        const auditReq = tx.objectStore("audit").getAll();

        tx.oncomplete = () => {
            const backupData = {
                version: "GSBC_v11_RIO_CARIBE",
                fechaRespaldo: new Date().toISOString(),
                reportesFirmados: reportsReq.result,
                bitacoraAuditoria: auditReq.result
            };
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GSBC_RESPALDO_USB_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };
    } catch(e) { alert("Error al exportar."); }
}

function toggleAboutModal(show) {
    document.getElementById('aboutModal').classList.toggle('hidden', !show);
}

function askLocalAI() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('aiChatBox');
    const query = input.value.trim();
    if (!query) return;

    const userMsg = document.createElement('div');
    userMsg.className = "bg-blue-900/60 p-2.5 rounded-lg border border-blue-700/80 text-slate-100 text-right font-medium";
    userMsg.textContent = query;
    chatBox.appendChild(userMsg);
    input.value = '';

    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = "bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-slate-300";
        aiMsg.innerHTML = `<p class="font-semibold text-sky-400 mb-1"><i class="fa-solid fa-sparkles"></i> Asistente Pedagógico:</p>Sugerencia respecto a "${query.substring(0, 35)}...": Recuerda adaptar la escala de evaluación al Decreto 1290 e incorporar proyectos pedagógicos productivos en el PEI institucional.`;
        chatBox.appendChild(aiMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}
