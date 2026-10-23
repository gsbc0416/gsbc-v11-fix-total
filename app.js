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

// DATOS OFICIALES DE VALLEDUPAR (Grabados desde el Directorio de la Secretaría de Educación)
const SEED_DATA = [
    { dane: "120001000115", nombre: "IE NACIONAL LOPERENA", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "320001004560", nombre: "IE LOPERENA GARUPAL", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "120001000921", nombre: "IE PRUDENCIA DAZA", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "120001000018", nombre: "IE JOSE EUGENIO MARTINEZ", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "120001003751", nombre: "IE CASIMIRO RAUL MAESTRE", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "120001003602", nombre: "IE VILLA CORELCA", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "120001069341", nombre: "IE CONSUELO ARAUJO NOGUERA", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "120001791775", nombre: "I.E MAYOR DE VALLEDUPAR CESAR PONPEYO MENDOZA HINOJOSA", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" }
];

document.addEventListener('DOMContentLoaded', async () => {
    await initIndexedDB();
    initChartsSafely();
    checkNetworkStatus();
    await executeNationalSearch();
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
});

// 1. INDEXEDDB
function initIndexedDB() {
    return new Promise((resolve) => {
        try {
            const request = indexedDB.open("GSBC_DB_v11", 2);
            request.onupgradeneeded = (e) => {
                const database = e.target.result;
                if (!database.objectStoreNames.contains("schools")) database.createObjectStore("schools", { keyPath: "dane" });
                if (!database.objectStoreNames.contains("reports")) database.createObjectStore("reports", { keyPath: "id", autoIncrement: true });
                if (!database.objectStoreNames.contains("audit")) database.createObjectStore("audit", { keyPath: "id", autoIncrement: true });
            };
            request.onsuccess = (e) => {
                db = e.target.result;
                updateCounts();
                loadAuditLogs();
                resolve();
            };
            request.onerror = (e) => { console.warn("Error IndexedDB:", e); resolve(); };
        } catch (err) { console.warn("IndexedDB no soportado:", err); resolve(); }
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
        if (offlineStatusText) { offlineStatusText.textContent = "Sincronizado"; offlineStatusText.className = "font-mono text-emerald-400"; }
    } else {
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span class="text-amber-400">Modo Offline</span>`;
        syncBanner.textContent = "⚡ Operando en Modo 100% Offline.";
        syncBanner.classList.remove('hidden');
        if (offlineStatusText) { offlineStatusText.textContent = "Totalmente Funcional (Local)"; offlineStatusText.className = "font-mono text-blue-400"; }
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
        badgeHelp.textContent = "Modo Administrador";
        badgeHelp.className = "text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-medium";
    } else if (role === 'docente') {
        adminSec.classList.add('hidden');
        badgeHelp.textContent = "Modo Docente / Rector";
        badgeHelp.className = "text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-medium";
    } else {
        adminSec.classList.add('hidden');
        badgeHelp.textContent = "Modo Consulta (Estudiante)";
        badgeHelp.className = "text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-medium";
    }
}

// 4. BÚSQUEDA (Local -> API Valledupar -> API Nacional)
async function executeNationalSearch() {
    const query = (document.getElementById('searchInput').value || "").trim();
    const sourceBadge = document.getElementById('searchSourceBadge');
    let results = [];

    if (query.length >= 3) {
        const upperQuery = query.toUpperCase();
        
        // 1. Buscar en datos semilla locales (Valledupar grabado)
        const localResults = SEED_DATA.filter(item => item.dane.includes(query) || item.nombre.toUpperCase().includes(upperQuery));
        if (localResults.length > 0) {
            results = localResults;
            sourceBadge.textContent = "Origen: Directorio Local Valledupar";
        }

        // 2. Si no está en local y hay internet, buscar en el dataset de Valledupar (53pq-6few)
        if (results.length === 0 && navigator.onLine) {
            try {
                const url = `https://www.datos.gov.co/resource/53pq-6few.json?$where=codigo_dane='${query}'`;
                const response = await fetch(url);
                if (response.ok) {
                    const apiData = await response.json();
                    if (apiData && apiData.length > 0) {
                        results = apiData.map(item => ({
                            dane: item.codigo_dane || "N/A",
                            nombre: item.nombre_establecimiento || "I.E. SIN NOMBRE",
                            depto: item.departamento || "CESAR",
                            municipio: item.municipio || "VALLEDUPAR",
                            zona: item.zona || "URBANA"
                        }));
                        sourceBadge.textContent = "Origen: API Valledupar";
                        saveSchoolsToDB(results);
                    }
                }
            } catch (e) { console.warn("Error API Valledupar:", e); }
        }

        // 3. Si aún no hay resultados, buscar en la API Nacional (x5ay-984n)
        if (results.length === 0 && navigator.onLine) {
            try {
                const url = `https://www.datos.gov.co/resource/x5ay-984n.json?$where=codigo_dane='${query}'`;
                const response = await fetch(url);
                if (response.ok) {
                    const apiData = await response.json();
                    if (apiData && apiData.length > 0) {
                        results = apiData.map(item => ({
                            dane: item.codigo_dane || "N/A",
                            nombre: item.nombre_establecimiento || "I.E. SIN NOMBRE",
                            depto: item.departamento || "N/A",
                            municipio: item.municipio || "N/A",
                            zona: item.zona || "RURAL"
                        }));
                        sourceBadge.textContent = "Origen: API Nacional";
                        saveSchoolsToDB(results);
                    }
                }
            } catch (e) { console.warn("Error API Nacional:", e); }
        }
    }

    // 4. Fallback final a IndexedDB o Semilla
    if (results.length === 0) {
        if (!query) {
            results = await getSchoolsFromDB();
            if (results.length === 0) results = SEED_DATA;
        } else {
            const allLocal = await getSchoolsFromDB();
            const dataToFilter = allLocal.length > 0 ? allLocal : SEED_DATA;
            const upperQuery = query.toUpperCase();
            results = dataToFilter.filter(item => item.dane.includes(query) || item.nombre.toUpperCase().includes(upperQuery));
        }
        sourceBadge.textContent = "Origen: Base Local Offline";
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
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-500">No se encontraron instituciones educativas. Si el código DANE no aparece, es posible que no esté en las bases de datos públicas consultadas.</td></tr>`;
        updateMetrics([], 0, 0);
        return;
    }

    const uniqueSchools = [...new Map(schools.map(item => [item.dane, item])).values()];
    let ruralCount = 0;
    const deptosSet = new Set();

    uniqueSchools.forEach((s, idx) => {
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

    updateMetrics(uniqueSchools, ruralCount, deptosSet.size);
    updateChartsSafely(uniqueSchools);
}

// 6. FUNCIONES RESTANTES (Reportes, Gráficos, Auditoría, IA)
function selectSchoolByIndex(index) {
    if (!currentSearchResults[index]) return;
    currentSchool = currentSearchResults[index];
    const infoBox = document.getElementById('selectedSchoolInfo');
    infoBox.innerHTML = `
        <div class="flex flex-wrap items-center justify-between text-slate-200 font-medium w-full gap-2">
            <span class="text-blue-400 font-bold"><i class="fa-solid fa-school mr-1.5"></i> ${currentSchool.nombre}</span>
            <span class="text-slate-400 text-[11px]">DANE: <code class="text-amber-300 font-mono">${currentSchool.dane}</code> | ${currentSchool.municipio}, ${currentSchool.depto}</span>
        </div>
    `;
    infoBox.className = "bg-slate-900 p-3 rounded-lg border border-blue-500/50 text-xs mb-3 shadow-inner";
}

function prepareReport(type) {
    if (!currentSchool) { alert("Selecciona una institución primero."); return; }
    currentReportType = type; isSigned = false;
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

async function signCurrentReport() {
    if (!currentReportText) return;
    if (currentRole === 'estudiante') { alert("El rol 'Estudiante' es de consulta."); return; }
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
    } catch (e) { console.warn("Fallback JS Hash"); }
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return `fallback_${Math.abs(hash).toString(16)}`;
}

function saveReportToDB() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports", "audit"], "readwrite");
        tx.objectStore("reports").add({ dane: currentSchool.dane, colegio: currentSchool.nombre, tipo: currentReportType, fecha: new Date().toLocaleString(), hash: currentReportHash, contenido: currentReportText });
        tx.objectStore("audit").add({ dane: currentSchool.dane, tipo: currentReportType, fecha: new Date().toLocaleDateString(), hash: currentReportHash, estado: "Firmado y Validado" });
        tx.oncomplete = () => { updateCounts(); loadAuditLogs(); alert("¡Documento firmado y guardado localmente!"); };
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
        } catch(e) { resolve([]); }
    });
}

function updateCounts() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports"], "readonly");
        const countReq = tx.objectStore("reports").count();
        countReq.onsuccess = () => {
            const localCount = document.getElementById('localCount');
            const metricSigned = document.getElementById('metricSigned');
            if (localCount) localCount.textContent = countReq.result;
            if (metricSigned) metricSigned.textContent = countReq.result;
        };
    } catch (e) {}
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
        const req = tx.objectStore("audit").getAll();
        req.onsuccess = () => {
            const logs = req.result;
            const tbody = document.getElementById('auditTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            if (logs.length === 0) { tbody.innerHTML = `<tr><td colspan="5" class="p-3 text-center text-slate-500 italic">No hay firmas guardadas.</td></tr>`; return; }
            logs.slice(-5).reverse().forEach(log => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td class="p-1.5">${log.dane}</td><td class="p-1.5 text-sky-400">${log.tipo}</td><td class="p-1.5 text-slate-400">${log.fecha}</td><td class="p-1.5 font-mono text-amber-400 text-[10px]">${log.hash.substring(0, 10)}...</td><td class="p-1.5 text-center"><span class="text-emerald-400 font-semibold">${log.estado}</span></td>`;
                tbody.appendChild(tr);
            });
        };
    } catch(e) {}
}

function initChartsSafely() {
    if (typeof Chart === 'undefined') return;
    try {
        const ctxZone = document.getElementById('zoneChart');
        if (ctxZone) { zoneChartInstance = new Chart(ctxZone.getContext('2d'), { type: 'doughnut', data: { labels: ['Rural', 'Urbana'], datasets: [{ data: [0, 0], backgroundColor: ['#10b981', '#3b82f6'] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } } } }); }
        const ctxDept = document.getElementById('deptChart');
        if (ctxDept) { deptChartInstance = new Chart(ctxDept.getContext('2d'), { type: 'bar', data: { labels: [], datasets: [{ label: 'Sedes', data: [], backgroundColor: '#8b5cf6' }] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#94a3b8', font: { size: 9 } } }, y: { ticks: { color: '#94a3b8', font: { size: 9 } } } }, plugins: { legend: { display: false } } } }); }
    } catch(e) {}
}

function updateChartsSafely(schools) {
    if (!zoneChartInstance || !deptChartInstance) return;
    try {
        let rural = 0, urbana = 0; const deptCounts = {};
        schools.forEach(s => { if (s.zona.toUpperCase().includes('RURAL')) rural++; else urbana++; deptCounts[s.depto] = (deptCounts[s.depto] || 0) + 1; });
        zoneChartInstance.data.datasets[0].data = [rural, urbana]; zoneChartInstance.update();
        deptChartInstance.data.labels = Object.keys(deptCounts); deptChartInstance.data.datasets[0].data = Object.values(deptCounts); deptChartInstance.update();
    } catch(e) {}
}

function exportFullBackupJSON() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports", "audit"], "readonly");
        const reportsReq = tx.objectStore("reports").getAll();
        const auditReq = tx.objectStore("audit").getAll();
        tx.oncomplete = () => {
            const backupData = { version: "GSBC_v11", fecha: new Date().toISOString(), reportes: reportsReq.result, auditoria: auditReq.result };
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `GSBC_${new Date().toISOString().slice(0, 10)}.json`; a.click();
        };
    } catch(e) {}
}

function toggleAboutModal(show) { document.getElementById('aboutModal').classList.toggle('hidden', !show); }

function askLocalAI() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('aiChatBox');
    const query = input.value.trim(); if (!query) return;
    chatBox.innerHTML += `<div class="bg-blue-900/60 p-2.5 rounded-lg text-slate-100 text-right font-medium mb-2">${query}</div>`;
    input.value = '';
    setTimeout(() => {
        chatBox.innerHTML += `<div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-slate-300 mb-2"><p class="font-semibold text-sky-400 mb-1"><i class="fa-solid fa-sparkles"></i> Asistente:</p>He guardado tu consulta. Recuerda que la CNSC no tiene una API pública. Los datos que ves aquí vienen del directorio local y del dataset oficial de Valledupar en datos.gov.co.</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}
