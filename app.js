// ESTADO GLOBAL (Sin cambios)
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

// DATOS SEMILLA (Sin cambios)
const SEED_DATA = [
    { dane: "120001000115", nombre: "IE NACIONAL LOPERENA", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" },
    { dane: "320001004560", nombre: "IE LOPERENA GARUPAL", depto: "CESAR", municipio: "VALLEDUPAR", zona: "URBANA" }
];

document.addEventListener('DOMContentLoaded', async () => {
    await initIndexedDB();
    initChartsSafely();
    checkNetworkStatus();
    await executeNationalSearch();
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
});

// 1. INDEXEDDB (Sin cambios)
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
            request.onsuccess = (e) => { db = e.target.result; updateCounts(); loadAuditLogs(); resolve(); };
            request.onerror = (e) => { console.warn("Error IndexedDB:", e); resolve(); };
        } catch (err) { console.warn("IndexedDB no soportado:", err); resolve(); }
    });
}

// 2. ESTADO DE RED (Sin cambios)
function checkNetworkStatus() {
    const statusDiv = document.getElementById('connectionStatus');
    const syncBanner = document.getElementById('syncBanner');
    if (navigator.onLine) {
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span class="text-emerald-400">En línea</span>`;
        syncBanner.classList.add('hidden');
    } else {
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span class="text-amber-400">Modo Offline</span>`;
        syncBanner.textContent = "⚡ Operando en Modo 100% Offline. Los reportes se guardan localmente.";
        syncBanner.classList.remove('hidden');
    }
}

// 3. CAMBIO DE ROL (Sin cambios)
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

// 4. BÚSQUEDA (Sin cambios - Funciona perfecto)
async function executeNationalSearch() {
    const query = (document.getElementById('searchInput').value || "").trim();
    const sourceBadge = document.getElementById('searchSourceBadge');
    let results = [];

    if (query.length >= 3) {
        const upperQuery = query.toUpperCase();
        const localResults = SEED_DATA.filter(item => item.dane.includes(query) || item.nombre.toUpperCase().includes(upperQuery));
        if (localResults.length > 0) { results = localResults; sourceBadge.textContent = "Origen: Directorio Local"; }
    }

    if (results.length === 0 && navigator.onLine && query.length >= 3) {
        try {
            let url = /^\d+$/.test(query) 
                ? `https://www.datos.gov.co/resource/x5ay-984n.json?$where=codigo_dane='${query}'`
                : `https://www.datos.gov.co/resource/x5ay-984n.json?$where=lower(nombre_establecimiento) like lower('%25${query}%25')&$limit=1000`;
            
            const response = await fetch(url);
            if (response.ok) {
                const apiData = await response.json();
                if (apiData.length > 0) {
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
        } catch (e) { console.warn("API falló", e); }
    }

    if (results.length === 0) {
        results = await getSchoolsFromDB();
        if (results.length === 0) results = SEED_DATA;
        sourceBadge.textContent = "Origen: Base Local Offline";
    }

    currentSearchResults = results;
    renderSchoolResults(results);
}

function resetSearch() { document.getElementById('searchInput').value = ''; executeNationalSearch(); }

// 5. RENDERIZADO (Sin cambios)
function renderSchoolResults(schools) {
    const tableBody = document.getElementById('schoolTableBody');
    tableBody.innerHTML = '';
    if (schools.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-500">No se encontraron instituciones.</td></tr>`;
        return;
    }
    const uniqueSchools = [...new Map(schools.map(item => [item.dane, item])).values()];
    uniqueSchools.forEach((s, idx) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-700/50 transition border-b border-slate-700/40";
        tr.innerHTML = `
            <td class="p-3 font-mono text-slate-300">${s.dane}</td>
            <td class="p-3 font-semibold text-white">${s.nombre}</td>
            <td class="p-3 text-slate-300">${s.depto}</td>
            <td class="p-3 text-slate-300">${s.municipio}</td>
            <td class="p-3"><span class="px-2 py-0.5 text-[10px] rounded font-bold ${s.zona.toUpperCase().includes('RURAL') ? 'bg-emerald-900/80 text-emerald-300' : 'bg-blue-900/80 text-blue-300'}">${s.zona}</span></td>
            <td class="p-3 text-center">
                <button onclick="selectSchoolByIndex(${idx})" class="bg-blue-600 hover:bg-blue-500 text-white text-[11px] px-2.5 py-1 rounded font-medium">Seleccionar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    updateMetrics(uniqueSchools);
}

function selectSchoolByIndex(index) {
    currentSchool = currentSearchResults[index];
    document.getElementById('selectedSchoolInfo').innerHTML = `
        <div class="flex flex-wrap items-center justify-between text-slate-200 font-medium w-full gap-2">
            <span class="text-blue-400 font-bold"><i class="fa-solid fa-school mr-1.5"></i> ${currentSchool.nombre}</span>
            <span class="text-slate-400 text-[11px]">DANE: <code class="text-amber-300">${currentSchool.dane}</code> | ${currentSchool.municipio}, ${currentSchool.depto}</span>
        </div>`;
    document.getElementById('selectedSchoolInfo').className = "bg-slate-900 p-3 rounded-lg border border-blue-500/50 text-xs mb-3 shadow-inner";
}

// ============================================================================
// 👇 SECCIÓN MODIFICADA: PREPARACIÓN DE REPORTES CON BASE LEGAL 👇
// ============================================================================
function prepareReport(type) {
    if (!currentSchool) { alert("Selecciona una institución primero."); return; }
    currentReportType = type;
    isSigned = false;
    const previewArea = document.getElementById('reportPreviewArea');
    previewArea.classList.remove('hidden');
    document.getElementById('reportTitleHeader').textContent = `Documento: ${type} — ${currentSchool.nombre}`;
    
    const sigBadge = document.getElementById('reportSignatureBadge');
    sigBadge.textContent = "Pendiente de Firma R-PC-03";
    sigBadge.className = "bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px]";

    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const encabezado = `REPÚBLICA DE COLOMBIA\nMINISTERIO DE EDUCACIÓN NACIONAL\n\nINSTITUCIÓN EDUCATIVA: ${currentSchool.nombre}\nCÓDIGO DANE: ${currentSchool.dane}\nDEPARTAMENTO: ${currentSchool.depto} | MUNICIPIO: ${currentSchool.municipio}\nZONA: ${currentSchool.zona}\nFECHA DE GENERACIÓN: ${fecha}\n\n======================================================================\n\n`;

    const templates = {
        'PEI': encabezado + `PROYECTO EDUCATIVO INSTITUCIONAL (PEI)\n(Ley 115 de 1994, Art. 73)\n\n1. GESTIÓN DIRECTIVA - HORIZONTE INSTITUCIONAL\nMisión: Formar integralmente a los estudiantes de ${currentSchool.municipio} con competencias académicas y socioemocionales que les permitan transformar su entorno.\nVisión: Ser reconocida en ${currentSchool.depto} por la excelencia en la formación de ciudadanos críticos y comprometidos con el desarrollo rural.\n\n2. GESTIÓN ACADÉMICA - MODELO PEDAGÓGICO\nEnfoque: Constructivista con énfasis en aprendizaje significativo y contextualizado a la realidad del territorio.\nPlan de Estudios: Organizado por áreas obligatorias (Ley 115) y proyectos transversales (Educación Ambiental, Sexualidad, Derechos Humanos).\n\n3. GESTIÓN DE LA COMUNIDAD - MANUAL DE CONVIVENCIA\nMarco Legal: Ley 1620 de 2013 y Decreto 1965 de 2013. Se establecen las rutas de atención integral para la resolución pacífica de conflictos.\n\n4. GESTIÓN ADMINISTRATIVA\nRecursos: Se detallan los recursos físicos, tecnológicos y financieros asignados para la vigencia actual.\n\nNOTA: Este es un borrador generado por IA. Requiere revisión y aprobación del Consejo Directivo y Rectoría.`,

        'PMI': encabezado + `PLAN DE MEJORAMIENTO INSTITUCIONAL (PMI)\n(Guía 34 MEN - Actualización 2026)\n\n1. AUTOEVALUACIÓN INSTITUCIONAL\nSe identifican las fortalezas y oportunidades de mejora en las 4 gestiones (Directiva, Académica, Comunidad, Administrativa).\n\n2. OBJETIVOS DE MEJORA\n- Objetivo 1: Fortalecer los procesos de inclusión y bienestar estudiantil.\n- Objetivo 2: Implementar estrategias de transformación digital y uso de TIC en el aula rural.\n- Objetivo 3: Mejorar los resultados en pruebas externas mediante refuerzo académico.\n\n3. METAS E INDICADORES\n- Meta: Reducir la deserción escolar en un 15% para el próximo año.\n- Indicador: Tasa de retención estudiantil.\n\n4. ACCIONES Y RESPONSABLES\nSe definen cronogramas y responsables para cada acción de mejora.\n\nNOTA: Borrador sujeto a validación con el equipo de gestión institucional.`,

        'SIEE': encabezado + `SISTEMA INSTITUCIONAL DE EVALUACIÓN DE ESTUDIANTES (SIEE)\n(Decreto 1290 de 2009)\n\n1. ESCALA DE VALORACIÓN\n- Desempeño Superior (4.6 - 5.0)\n- Desempeño Alto (4.0 - 4.5)\n- Desempeño Básico (3.0 - 3.9)\n- Desempeño Bajo (1.0 - 2.9)\n\n2. CRITERIOS DE PROMOCIÓN\nEl estudiante será promovido si alcanza Desempeño Básico o Superior en todas las áreas, con una asistencia mínima del 80%.\n\n3. ESTRATEGIAS DE APOYO\nSe programan actividades de refuerzo y nivelación para estudiantes con Desempeño Bajo, con acompañamiento del docente y la familia.\n\nNOTA: Documento base para discusión y aprobación en el Consejo Académico.`,

        'Manual de Convivencia': encabezado + `MANUAL DE CONVIVENCIA ESCOLAR\n(Ley 1620 de 2013 y Decreto 1965 de 2013)\n\n1. DERECHOS Y DEBERES\n- Derechos: Recibir educación de calidad, ser tratado con respeto y dignidad.\n- Deberes: Cumplir con las normas institucionales, respetar a compañeros y docentes.\n\n2. RUTA DE ATENCIÓN INTEGRAL\n- Situaciones Tipo I (Conflictos menores): Mediación por parte de docentes.\n- Situaciones Tipo II (Agresión escolar): Activación del Comité Escolar de Convivencia.\n- Situaciones Tipo III (Delitos): Remisión a autoridades competentes.\n\n3. PROTOCOLOS DE PREVENCIÓN\nCampañas de sensibilización sobre bullying, ciberacoso y violencia escolar.\n\nNOTA: Requiere ajuste participativo con la comunidad educativa.`,

        'Plan de Estudio': encabezado + `PLAN DE ESTUDIOS INSTITUCIONAL\n(Ley 115 de 1994, Art. 23 y 31)\n\n1. ÁREAS OBLIGATORIAS Y FUNDAMENTALES\n- Ciencias Naturales y Educación Ambiental\n- Ciencias Sociales, Historia, Geografía, Constitución Política y Democracia\n- Educación Artística y Cultural\n- Educación Ética y en Valores Humanos\n- Educación Física, Recreación y Deporte\n- Humanidades, Lengua Castellana e Idiomas Extranjeros\n- Matemáticas\n- Tecnología e Informática\n\n2. INTENSIDAD HORARIA\nSe distribuye el 80% del tiempo para áreas obligatorias y el 20% para proyectos pedagógicos y optativas.\n\n3. PROYECTOS TRANSVERSALES\n- Educación para la Sexualidad y Construcción de Ciudadanía.\n- Educación Ambiental.\n- Cátedra de Paz.\n\nNOTA: Documento sujeto a actualización anual según el PEI.`
    };

    currentReportText = templates[type] || "Contenido no disponible.";
    document.getElementById('reportContentText').textContent = currentReportText;
    previewArea.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================================
// 👇 SECCIÓN MODIFICADA: EXPORTACIÓN A PDF CON FORMATO OFICIAL 👇
// ============================================================================
function exportReport(format) {
    if (!isSigned) { alert("Debe firmar el documento antes de exportar."); return; }
    const fileName = `GSBC_${currentReportType.replace(/\s+/g, '_')}_${currentSchool.dane}`;

    if (format === 'pdf') {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Encabezado del PDF
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(14);
            doc.text("GSBC v11 RIO-CARIBE - DOCUMENTO OFICIAL", 10, 15);
            doc.setFontSize(9);
            doc.setFont("Helvetica", "normal");
            doc.text(`Firma SHA-256: ${currentReportHash}`, 10, 22);
            doc.text(`Institución: ${currentSchool.nombre} | DANE: ${currentSchool.dane}`, 10, 27);
            doc.line(10, 30, 200, 30);

            // Contenido
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(currentReportText, 180);
            doc.text(lines, 10, 38);

            // Pie de página
            doc.setFontSize(8);
            doc.text("Generado por GSBC v11 RIO-CARIBE - Modo Offline-First", 10, 285);
            
            doc.save(`${fileName}.pdf`);
        } catch (e) { 
            alert("Error al generar PDF. Verifique que jsPDF esté cargado."); 
            console.error(e);
        }
    } else if (format === 'word') {
        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Reporte GSBC</title></head>
            <body style="font-family:Arial, sans-serif; padding:20px;">
                <h2 style="color:#1e3a8a;">GSBC v11 RIO-CARIBE</h2>
                <p><b>Firma SHA-256:</b> <code>${currentReportHash}</code></p>
                <hr/>
                <pre style="white-space:pre-wrap; font-family:Courier New, monospace;">${currentReportText}</pre>
            </body>
            </html>`;
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${fileName}.doc`; a.click();
    } else if (format === 'json') {
        const dataObj = { institucion: currentSchool, tipoReporte: currentReportType, hash: currentReportHash, contenido: currentReportText, fecha: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${fileName}.json`; a.click();
    }
}

// ============================================================================
// 👇 RESTO DE FUNCIONES (SIN CAMBIOS - Tal cual las tenías) 👇
// ============================================================================

async function signCurrentReport() {
    if (!currentReportText) return;
    if (currentRole === 'estudiante') { alert("El rol Estudiante no puede firmar."); return; }
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
    } catch (e) { console.warn("Fallback"); }
    return "hash_fallback_" + Math.random().toString(16).substring(2);
}

function saveReportToDB() {
    if (!db) return;
    try {
        const tx = db.transaction(["reports", "audit"], "readwrite");
        tx.objectStore("reports").add({ dane: currentSchool.dane, colegio: currentSchool.nombre, tipo: currentReportType, fecha: new Date().toLocaleString(), hash: currentReportHash, contenido: currentReportText });
        tx.objectStore("audit").add({ dane: currentSchool.dane, tipo: currentReportType, fecha: new Date().toLocaleDateString(), hash: currentReportHash, estado: "Firmado" });
        tx.oncomplete = () => { updateCounts(); loadAuditLogs(); alert("Documento firmado y guardado."); };
    } catch(e) { console.error(e); }
}

function saveSchoolsToDB(schools) {
    if (!db) return;
    try {
        const tx = db.transaction(["schools"], "readwrite");
        const store = tx.objectStore("schools");
        schools.forEach(s => store.put(s));
    } catch(e) {}
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
            const el = document.getElementById('localCount');
            const el2 = document.getElementById('metricSigned');
            if (el) el.textContent = countReq.result;
            if (el2) el2.textContent = countReq.result;
        };
    } catch (e) {}
}

function updateMetrics(schools) {
    let rural = 0;
    const deptos = new Set();
    schools.forEach(s => { if (s.zona.toUpperCase().includes('RURAL')) rural++; deptos.add(s.depto); });
    document.getElementById('metricTotal').textContent = schools.length;
    document.getElementById('metricRural').textContent = rural;
    document.getElementById('metricDeptos').textContent = deptos.size;
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
            tbody.innerHTML = logs.length === 0 ? `<tr><td colspan="5" class="p-3 text-center text-slate-500 italic">No hay firmas guardadas.</td></tr>` : '';
            logs.slice(-5).reverse().forEach(log => {
                tbody.innerHTML += `<tr><td class="p-1.5">${log.dane}</td><td class="p-1.5 text-sky-400">${log.tipo}</td><td class="p-1.5 text-slate-400">${log.fecha}</td><td class="p-1.5 font-mono text-amber-400 text-[10px]">${log.hash.substring(0, 10)}...</td><td class="p-1.5 text-center"><span class="text-emerald-400 font-semibold">${log.estado}</span></td></tr>`;
            });
        };
    } catch(e) {}
}

function initChartsSafely() {
    if (typeof Chart === 'undefined') return;
    try {
        const ctxZone = document.getElementById('zoneChart');
        if (ctxZone) { zoneChartInstance = new Chart(ctxZone.getContext('2d'), { type: 'doughnut', data: { labels: ['Rural', 'Urbana'], datasets: [{ data: [0, 0], backgroundColor: ['#10b981', '#3b82f6'] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } } } }); }
        const ctxDept = document.getElementById('deptChart');
        if (ctxDept) { deptChartInstance = new Chart(ctxDept.getContext('2d'), { type: 'bar', data: { labels: [], datasets: [{ label: 'Sedes', data: [], backgroundColor: '#8b5cf6' }] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } }, plugins: { legend: { display: false } } } }); }
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
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `GSBC_BACKUP.json`; a.click();
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
        chatBox.innerHTML += `<div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-slate-300 mb-2"><p class="font-semibold text-sky-400 mb-1"><i class="fa-solid fa-sparkles"></i> Asistente:</p>Para el documento que estás generando, recuerda que el Decreto 1290 exige que el SIEE tenga una escala de valoración clara. ¿Quieres que te ayude a redactar los criterios de promoción?</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}
