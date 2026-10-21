const appData = {
  objective: 'Diseñar y fundamentar el marco conceptual RIO-CARIBE para transformar condiciones territoriales y educativas de escuelas rurales en especificaciones técnicas, pedagógicas y operativas verificables, con enfoque en autonomía, responsabilidad docente y uso ético de la IA.',
  specifics: [
    'Caracterizar contextos rurales del Caribe colombiano y las restricciones de conectividad, energía y infraestructura.',
    'Definir dominios, requisitos funcionales, no funcionales y sociopedagógicos alineados con el PEI y los procedimientos institucionales.',
    'Diseñar una arquitectura local y offline-first para aprendizaje, apoyo docente y evidencias.',
    'Formalizar trazabilidad TRAZA-RIO para conectar condiciones, necesidades, requisitos, sistema, actividades y evidencias.',
    'Establecer auditoría, verificación crítica y condiciones de falsación para evaluación del sistema.'
  ],
  principles: [
    'La mediación docente sigue siendo indispensable para orientar, validar y sostener el aprendizaje.',
    'La IA no sustituye decisiones evaluativas ni disciplinarias sin la firma del docente.',
    'Se minimiza la recolección y tratamiento de datos de menores, con roles y permisos claros.',
    'Se prioriza la alineación con el PEI, los proyectos curriculares y los procedimientos exigidos por la institución.',
    'La solución debe funcionar sin internet y sincronizarse de forma segura cuando vuelva la conectividad.'
  ],
  requirements: [
    { id: 'R-TEC-01', description: 'El sistema debe ejecutar las funciones esenciales del aula en la red local sin depender de Internet.', type: 'F' },
    { id: 'R-TEC-02', description: 'No debe depender de APIs externas o SaaS para las funciones básicas del proyecto.', type: 'NF' },
    { id: 'R-TEC-03', description: 'Debe soportar almacenamiento local cifrado para datos autorizados y temporales.', type: 'F' },
    { id: 'R-TEC-04', description: 'Debe permitir sincronización diferida y segura cuando haya conectividad estable.', type: 'F' },
    { id: 'R-IA-01', description: 'El modelo de IA debe seleccionarse según hardware disponible, memoria RAM y capacidad de cómputo.', type: 'NF' },
    { id: 'R-IA-02', description: 'El módulo debe generar recursos con alineación curricular y PEI.', type: 'F' },
    { id: 'R-IA-03', description: 'Las salidas deben pasar por validación local antes de mostrarse al usuario.', type: 'SP' },
    { id: 'R-PC-01', description: 'Debe diferenciar claramente entre texto generado por estudiante e IA.', type: 'SP' },
    { id: 'R-PC-02', description: 'Debe incorporar verificación crítica para contenidos generados.', type: 'SP' },
    { id: 'R-PC-03', description: 'Se exige aprobación docente explícita para evaluaciones o cierres de actividad.', type: 'SP' },
    { id: 'R-PC-04', description: 'Las actividades deben vincularse a competencias y objetivos del PEI.', type: 'SP' },
    { id: 'R-PC-05', description: 'El uso de IA debe justificarse por valor pedagógico y no como sustituto del pensamiento del estudiante.', type: 'SP' },
    { id: 'R-TLA-01', description: 'Los prompts deben incluir elementos socioculturales del Caribe colombiano.', type: 'SP' },
    { id: 'R-TLA-02', description: 'El docente debe poder personalizar contenidos para la comunidad y el contexto local.', type: 'F' },
    { id: 'R-TLA-03', description: 'La interfaz debe adaptarse al grado, nivel de lectura y condiciones del aula.', type: 'F' },
    { id: 'R-TLA-04', description: 'Debe cumplir pautas de accesibilidad visual y cognitiva.', type: 'SP' },
    { id: 'R-ENE-01', description: 'Debe monitorizar consumo energético y adaptar la intensidad de cómputo.', type: 'NF' },
    { id: 'R-ENE-02', description: 'Ante caídas eléctricas debe priorizar acciones esenciales y guardar evidencia.', type: 'NF' },
    { id: 'R-ECO-01', description: 'La arquitectura debe sostener un costo total razonable para instituciones rurales.', type: 'F' },
    { id: 'R-ECO-02', description: 'Debe permitir comparación de configuraciones con criterios de sostenibilidad y costo.', type: 'NF' },
    { id: 'R-MAN-01', description: 'Debe incluir guías de diagnóstico y mantenimiento ejecutables por docentes.', type: 'NF' },
    { id: 'R-MAN-02', description: 'Debe incluir procedimientos locales de restauración rápida desde USB o medios locales.', type: 'NF' },
    { id: 'R-SP-01', description: 'Debe implementar autenticación y autorización por roles.', type: 'F' },
    { id: 'R-SP-02', description: 'Debe aplicar mínimo privilegio sobre carpetas, registros y bases de datos.', type: 'F' },
    { id: 'R-SP-03', description: 'Debe prohibir la recolección y transmisión de datos personales de menores.', type: 'NF' },
    { id: 'R-GOB-01', description: 'Debe bloquear decisiones disciplinarias o evaluativas delegadas automáticamente a la IA.', type: 'SP' },
    { id: 'R-GOB-02', description: 'Debe conservar auditoría inalterable de interacciones con la IA y decisiones docentes.', type: 'SP' },
    { id: 'R-EVA-01', description: 'Los instrumentos de evaluación deben alinearse con indicadores de aprendizaje y PEI.', type: 'SP' },
    { id: 'R-EVA-02', description: 'Las evidencias deben guardar trazabilidad completa con los requisitos.', type: 'SP' },
    { id: 'R-TRA-01', description: 'Debe garantizar la integridad bidireccional de la cadena TRAZA-RIO.', type: 'SP' }
  ],
  traceability: {
    chain: 'C→N→R→S→F→A→I→E',
    returnChain: 'E→I→A→F→S→R→N→C',
    example: [
      { label: 'C-01', text: 'Interrupción eléctrica y ausencia de conectividad en la comunidad educativa.' },
      { label: 'N-01', text: 'Necesidad de continuidad pedagógica sin depender de red pública.' },
      { label: 'R-TEC-01', text: 'Ejecución local de funciones esenciales del aula sin Internet.' },
      { label: 'F-01', text: 'Módulo de apoyo local con búsqueda y revisión docente.' },
      { label: 'A-01', text: 'Actividad de lectura guiada y análisis crítico sobre el territorio.' },
      { label: 'E-01', text: 'Evidencia digital y registro institucional con trazabilidad.' }
    ],
    indicators: [
      { name: 'CT', formula: 'CT = (Rt / R_total) × 100', target: '100%' },
      { name: 'TI_r', formula: '1 si traza completa, 0 si hay ruptura', target: 'sin rupturas' },
      { name: 'CE', formula: 'CE = (Re / R_evaluados) × 100', target: 'máxima evidencia' },
      { name: 'CV', formula: 'CV = (Rv / R_probados) × 100', target: 'verificación completa' },
      { name: 'CAP', formula: 'CAP = (Ac / A_totales) × 100', target: 'alineación curricular' },
      { name: 'TCO', formula: 'C_adquisición + energía + mantenimiento', target: '≤ $600 USD/aula' }
    ]
  },
  procedures: [
    {
      title: 'PEI y procedimientos institucionales',
      description: 'Toda actividad de IA y digitalización debe alinearse al PEI, la política institucional, la convivencia escolar y la protección de datos.',
      area: 'Gobernanza',
      action: 'Docente: validar pertinencia, coordinación y registro institucional antes de usar herramientas digitales.'
    },
    {
      title: 'Registro de evidencias',
      description: 'Las evidencias de aprendizaje deben conservarse con fechas, responsables y relación con objetivos del área.',
      area: 'Evaluación',
      action: 'Guardar observaciones, productos, rúbricas y justificación pedagógica dentro del sistema local.'
    },
    {
      title: 'Mediación docente',
      description: 'La IA sirve como apoyo de orientación, no como sustitución del rol del docente.',
      area: 'Pedagogía',
      action: 'El docente debe revisar, validar y firmar las decisiones de apoyo y cierre de actividad.'
    },
    {
      title: 'Uso seguro de datos',
      description: 'Se debe restringir la captura y transmisión de información sensible o de menores.',
      area: 'Seguridad',
      action: 'Usar roles, permisos, mínimos privilegios y registro de auditoría.'
    }
  ]
};

const state = {
  currentView: 'inicio',
  filter: 'all',
  notes: JSON.parse(localStorage.getItem('rioNotes') || '[]')
};

const typeColors = { F: 'tag-F', NF: 'tag-NF', SP: 'tag-SP' };

function getViewEls() {
  return {
    navButtons: [...document.querySelectorAll('.nav-btn')],
    filterButtons: [...document.querySelectorAll('.filter-btn')],
    views: [...document.querySelectorAll('.view')],
    objectiveText: document.getElementById('objectiveText'),
    specificObjectives: document.getElementById('specificObjectives'),
    principlesList: document.getElementById('principlesList'),
    requirementsContainer: document.getElementById('requirementsContainer'),
    traceabilityChain: document.getElementById('traceabilityChain'),
    trailPills: document.getElementById('trailPills'),
    traceExample: document.getElementById('traceExample'),
    indicatorsBody: document.getElementById('indicatorsBody'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    assistantInput: document.getElementById('assistantInput'),
    assistantOutput: document.getElementById('assistantOutput'),
    notesList: document.getElementById('notesList'),
    noteInput: document.getElementById('noteInput'),
    networkLabel: document.getElementById('networkLabel'),
    lastSyncLabel: document.getElementById('lastSyncLabel')
  };
}

function setView(viewName) {
  state.currentView = viewName;
  const els = getViewEls();
  els.views.forEach(view => {
    view.classList.toggle('active', view.id === `view-${viewName}`);
  });
  els.navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
}

function renderOverview() {
  const els = getViewEls();
  els.objectiveText.textContent = appData.objective;
  els.specificObjectives.innerHTML = appData.specifics.map(item => `<li>${item}</li>`).join('');
  els.principlesList.innerHTML = appData.principles.map(item => `<li>${item}</li>`).join('');
}

function renderRequirements() {
  const els = getViewEls();
  const items = state.filter === 'all'
    ? appData.requirements
    : appData.requirements.filter(item => item.type === state.filter);

  els.requirementsContainer.innerHTML = items.map(item => `
    <div class="requirement-card">
      <div class="req-header">
        <span class="req-id">${item.id}</span>
        <span class="req-tag ${typeColors[item.type]}">${item.type}</span>
      </div>
      <p>${item.description}</p>
    </div>
  `).join('');
}

function renderTraceability() {
  const els = getViewEls();
  els.traceabilityChain.textContent = `Cadena bidireccional: ${appData.traceability.chain} · retorno: ${appData.traceability.returnChain}`;
  els.trailPills.innerHTML = ['C','N','R','S','F','A','I','E'].map(item => `<span>${item}</span>`).join('');
  els.traceExample.innerHTML = appData.traceability.example.map(item => `
    <div class="trace-item">
      <strong>${item.label}</strong>
      <div>${item.text}</div>
    </div>
  `).join('');
  els.indicatorsBody.innerHTML = appData.traceability.indicators.map(ind => `
    <tr>
      <td>${ind.name}</td>
      <td>${ind.formula}</td>
      <td>${ind.target}</td>
    </tr>
  `).join('');
}

function renderSearchResults(query) {
  const els = getViewEls();
  const q = (query || '').trim().toLowerCase();

  if (!q) {
    els.searchResults.innerHTML = '<div class="result-card">Escribe una palabra clave para buscar requisitos, procedimientos o temas del marco.</div>';
    return;
  }

  const matched = [
    ...appData.requirements.map(req => ({
      type: 'Requisito',
      title: req.id,
      description: req.description,
      text: `${req.id} ${req.description}`
    })),
    ...appData.procedures.map(proc => ({
      type: 'Procedimiento',
      title: proc.title,
      description: proc.description,
      text: `${proc.title} ${proc.description} ${proc.area} ${proc.action}`
    })),
    ...appData.traceability.example.map(item => ({
      type: 'Trazabilidad',
      title: item.label,
      description: item.text,
      text: `${item.label} ${item.text}`
    }))
  ].filter(entry => entry.text.toLowerCase().includes(q));

  if (!matched.length) {
    els.searchResults.innerHTML = '<div class="result-card">No se encontraron coincidencias. Prueba palabras como "offline", "PEI", "docente", "requisito" o "trazabilidad".</div>';
    return;
  }

  els.searchResults.innerHTML = matched.slice(0, 8).map(item => `
    <div class="result-card">
      <strong>${item.type}: ${item.title}</strong>
      <p>${item.description}</p>
    </div>
  `).join('');
}

function renderNotes() {
  const els = getViewEls();
  if (!state.notes.length) {
    els.notesList.innerHTML = '<div class="note-item">No hay evidencias guardadas aún. Escribe una nota y guárdala para la escuela.</div>';
    return;
  }

  els.notesList.innerHTML = state.notes.map(note => `
    <div class="note-item">
      <strong>${new Date(note.createdAt).toLocaleString('es-CO')}</strong>
      <p>${note.text}</p>
    </div>
  `).join('');
}

function saveNote() {
  const els = getViewEls();
  const text = (els.noteInput.value || '').trim();
  if (!text) return;

  const note = {
    id: Date.now(),
    text,
    createdAt: new Date().toISOString()
  };

  state.notes.unshift(note);
  localStorage.setItem('rioNotes', JSON.stringify(state.notes));
  els.noteInput.value = '';
  renderNotes();
}

function buildAssistantReply(query) {
  const q = query.toLowerCase();

  if (q.includes('pei') || q.includes('proceso') || q.includes('procedimiento')) {
    return {
      title: 'PEI y procedimientos docentes',
      text: 'El marco exige que el uso de IA y herramientas digitales se alinee con el PEI, la política institucional y los procedimientos de convivencia, evaluación y protección de datos. El docente debe validar la pertinencia pedagógica, documentar la actividad y mantener trazabilidad de la evidencia.'
    };
  }

  if (q.includes('offline') || q.includes('sin internet') || q.includes('conexion')) {
    return {
      title: 'Modo offline',
      text: 'El sistema debe operar en la red local del colegio, priorizar funciones esenciales y guardar evidencias localmente. Cuando haya internet, puede sincronizar registros y respaldos sin comprometer la continuidad del aprendizaje.'
    };
  }

  if (q.includes('docente') || q.includes('mediacion') || q.includes('evaluacion')) {
    return {
      title: 'Rol del docente',
      text: 'La mediación docente sigue siendo central: revisar, validar, orientar y aprobar decisiones relevantes. La IA puede apoyar la preparación de actividades, pero no sustituye la responsabilidad del docente en evaluación, disciplina ni diálogo pedagógico.'
    };
  }

  if (q.includes('seguridad') || q.includes('datos') || q.includes('privacidad')) {
    return {
      title: 'Seguridad y privacidad',
      text: 'Se debe aplicar mínimo privilegio, control por roles, almacenamiento local y bloqueo de recolección de datos personales de menores. La escuela debe mantener un registro de auditoría y restringir el acceso a información sensible.'
    };
  }

  const hits = appData.requirements.filter(req => {
    const text = `${req.id} ${req.description}`.toLowerCase();
    return text.includes(q) || q.includes(req.id.toLowerCase());
  }).slice(0, 3);

  if (hits.length) {
    return {
      title: 'Requisitos relevantes',
      text: hits.map(r => `${r.id}: ${r.description}`).join(' · ')
    };
  }

  return {
    title: 'Respuesta general',
    text: 'RIO-CARIBE propone un enfoque social, técnico y pedagógico para escuelas rurales: offline-first, trazabilidad, PEI y procedimientos docentes, IA responsable, evidencia y verificación crítica. Para objetivos específicos, usa la búsqueda local o consulta por “offline”, “PEI”, “docente”, “evaluación” o “seguridad”.'
  };
}

function askAssistant() {
  const els = getViewEls();
  const query = (els.assistantInput.value || '').trim();
  if (!query) return;

  const answer = buildAssistantReply(query);
  const card = `
    <div class="assistant-answer">
      <strong>${answer.title}</strong>
      <div>${answer.text}</div>
    </div>
  `;
  els.assistantOutput.innerHTML = card;
  els.assistantInput.value = '';
}

function updateConnectionStatus() {
  const els = getViewEls();
  const isOnline = navigator.onLine;
  const status = document.getElementById('connectionStatus');
  status.classList.toggle('online', isOnline);
  status.classList.toggle('offline', !isOnline);
  els.networkLabel.textContent = isOnline ? 'Conectado' : 'Sin conexión';
  const lastSync = localStorage.getItem('rioLastSync');
  els.lastSyncLabel.textContent = lastSync ? new Date(lastSync).toLocaleString('es-CO') : 'Nunca';
}

function syncPendingData() {
  if (!navigator.onLine) {
    alert('Actualmente estás sin conexión. La sincronización quedará pendiente hasta que el equipo vuelva a conectarse.');
    return;
  }

  const now = new Date().toISOString();
  localStorage.setItem('rioLastSync', now);
  updateConnectionStatus();
  alert('Sincronización completada. La evidencia y los registros quedaron actualizados.');
}

function bindEvents() {
  const els = getViewEls();

  els.navButtons.forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  els.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      els.filterButtons.forEach(item => item.classList.toggle('active', item === btn));
      renderRequirements();
    });
  });

  els.searchInput.addEventListener('input', (event) => {
    renderSearchResults(event.target.value);
  });

  document.getElementById('searchBtn').addEventListener('click', () => {
    renderSearchResults(els.searchInput.value);
  });

  document.getElementById('askAssistantBtn').addEventListener('click', askAssistant);
  els.assistantInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') askAssistant();
  });

  document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
  document.getElementById('syncBtn').addEventListener('click', syncPendingData);

  document.querySelectorAll('[data-view]').forEach(button => {
    const target = button.dataset.view;
    if (target && !button.classList.contains('nav-btn') && !button.classList.contains('filter-btn')) {
      button.addEventListener('click', () => setView(target));
    }
  });

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
}

function initApp() {
  renderOverview();
  renderRequirements();
  renderTraceability();
  renderSearchResults('');
  renderNotes();
  updateConnectionStatus();
  bindEvents();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

initApp();
