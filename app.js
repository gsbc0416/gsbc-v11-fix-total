const DB_NAME = 'gsbc-nacional-v11';
const KEY_USUARIO = 'rio_usuario';
const KEY_NOTES = 'rio_notes';
const KEY_REPORTS = 'rio_reports';
const KEY_SYNC = 'rio_last_sync';

const appData = {
  objective: 'Diseñar y fortalecer una plataforma educativa institucional, segura y operativa en contextos rurales, con soporte local, trazabilidad y continuidad pedagógica aun sin conectividad.',
  specifics: [
    'Caracterizar el contexto rural, institucional y técnico de la comunidad educativa.',
    'Definir requisitos funcionales, no funcionales y sociopedagógicos según el marco institucional.',
    'Diseñar un entorno local y offline-first para evidencias, seguimiento y gestión documental.',
    'Asegurar trazabilidad, revisión docente y decisiones informadas con apoyo institucional.',
    'Permitir sincronización ordenada cuando vuelva la conectividad.'
  ],
  principles: [
    'La mediación docente sigue siendo indispensable para orientar, revisar y validar decisiones.',
    'La IA debe servir como apoyo, no como sustituto de la evaluación ni de la autoridad institucional.',
    'Se prioriza la privacidad, la seguridad del dato y la protección de menores.',
    'Los procesos deben estar alineados con el PEI, la convivencia y la praxis institucional.',
    'La solución debe funcionar sin internet y sincronizar cuando haya conectividad disponible.'
  ],
  metrics: [
    { value: '05', label: 'Módulos' },
    { value: '12', label: 'Requisitos clave' },
    { value: '100%', label: 'Offline base' },
    { value: '24/7', label: 'Disponibilidad local' }
  ],
  requirements: [
    { id: 'R-TEC-01', description: 'La plataforma debe operar localmente sin depender de internet para funciones esenciales.', type: 'F' },
    { id: 'R-TEC-02', description: 'La base funcional debe ser local, segura y accesible sin servicios externos.', type: 'NF' },
    { id: 'R-TEC-03', description: 'Debe permitir almacenamiento de notas, evidencias y documentos para uso institucional.', type: 'F' },
    { id: 'R-TEC-04', description: 'Debe soportar sincronización diferida cuando se recupere la conectividad.', type: 'F' },
    { id: 'R-IA-01', description: 'La IA debe funcionar con validación local, sin depender de procesos externos obligatorios.', type: 'NF' },
    { id: 'R-IA-02', description: 'Debe ofrecer apoyo pedagógico y de redacción con alineación institucional.', type: 'F' },
    { id: 'R-IA-03', description: 'El contenido generado debe pasar por revisión local antes de ser usado oficialmente.', type: 'SP' },
    { id: 'R-PC-01', description: 'Debe diferenciar claramente entre texto del estudiante, contenido institucional y apoyo de IA.', type: 'SP' },
    { id: 'R-PC-02', description: 'Debe incorporar verificación crítica para decisiones y contenidos generados.', type: 'SP' },
    { id: 'R-PC-03', description: 'La revisión docente es obligatoria para evaluaciones, decisiones y cierres institucionales.', type: 'SP' },
    { id: 'R-SP-01', description: 'Debe distinguir roles y permisos para acceder a funciones y acciones.', type: 'F' },
    { id: 'R-GOB-01', description: 'Se debe evitar delegar decisiones evaluativas o disciplinarias en la IA.', type: 'SP' }
  ],
  procedures: [
    {
      title: 'PEI y articulación institucional',
      description: 'Toda acción deberá estar alineada con el PEI, la misión institucional y la estrategia pedagógica del colegio.',
      area: 'Gobernanza',
      action: 'El docente valida la pertinencia, la evidencia y la decisión institucional antes de usarla formalmente.'
    },
    {
      title: 'Registro de evidencias',
      description: 'Las evidencias requiere fecha, responsable, contexto y relación con el objetivo institucional.',
      area: 'Evaluación',
      action: 'Guardar observaciones, decisiones, entendimientos y resultados dentro del sistema local.'
    },
    {
      title: 'Mediación docente',
      description: 'La IA asiste a la construcción del texto, pero la revisión final corresponde al docente.',
      area: 'Pedagogía',
      action: 'Validar antes de publicar, firmar o usar un documento como evidencia oficial.'
    },
    {
      title: 'Seguridad y privacidad',
      description: 'Se debe limitar el acceso, guardar trazabilidad y aplicar mínimo privilegio.',
      area: 'Seguridad',
      action: 'Solo los roles autorizados pueden crear, editar o eliminar datos sensibles.'
    }
  ],
  institutional: {
    pei: [
      {
        title: 'Propósito institucional',
        summary: 'La plataforma debe fortalecer la continuidad pedagógica y la gestión institucional con enfoque local y humano.',
        bullets: [
          'Asegurar continuidad educativa aun sin conexión o con cobertura limitada.',
          'Facilitar seguimiento docente con evidencia y trazabilidad.',
          'Alinear la gestión con la misión y el PEI de la institución.'
        ]
      },
      {
        title: 'Plan de estudio',
        summary: 'La programación debe responder a necesidades reales del contexto y a estrategias de acompañamiento seguro.',
        bullets: [
          'Relacionar actividades con competencias, objetivos y evidencias.',
          'Usar estrategias flexibles para la realidad escolar y territorial.',
          'Mantener claridad documental y documentación institucional.'
        ]
      }
    ],
    convivencia: [
      {
        title: 'Manual de convivencia',
        summary: 'La convivencia escolar se orienta por principios de respeto, acompañamiento y evidencia documental.',
        bullets: [
          'Definir roles y responsabilidades de estudiantes, docentes y directivos.',
          'Documentar hechos de forma objetiva, pedagógica y verificable.',
          'Promover mediación antes de cerrar una situación disciplinaria.'
        ]
      },
      {
        title: 'Acciones formativas',
        summary: 'La intervención debe centrarse en acompañamiento, reflexión y mejora del clima escolar.',
        bullets: [
          'Relacionar la acción con la norma institucional y la intención pedagógica.',
          'Registrar la decisión y la evidencia de acompañamiento.',
          'Usar lenguaje claro, respetuoso y formativo.'
        ]
      }
    ],
    academic: [
      {
        title: 'Acompañamiento académico',
        summary: 'El acompañamiento debe favorecer el aprendizaje con apoyo docente y seguimiento claro.',
        bullets: [
          'Proponer actividades y evaluación según el contexto del grupo.',
          'Relacionar evidencias con indicadores de aprendizaje y seguimiento.',
          'Hacer visible el progreso y las recomendaciones específicas.'
        ]
      },
      {
        title: 'Plan de mejora',
        summary: 'La plataforma debe orientar la mejora con metas concretas, responsables y evidencias.',
        bullets: [
          'Definir metas observables y medibles.',
          'Relacionar la acción con un responsable claro.',
          'Registrar avances, ajustes y cierre con evidencia.'
        ]
      }
    ],
    compliance: [
      {
        title: 'Cumplimiento documental',
        summary: 'Verificar que los procesos están soportados por documentos, decisiones y evidencias.',
        bullets: [
          'PEI y marco institucional vigentes.',
          'Registro de decisiones y responsables.',
          'Evidencias y fechas claras.'
        ]
      },
      {
        title: 'Cumplimiento pedagógico',
        summary: 'Revisar si la acción responde a criterios académicos y de acompañamiento.',
        bullets: [
          'Objetivo claro.',
          'Competencia o intención educativa relacionada.',
          'Evidencia de seguimiento y acompañamiento.'
        ]
      }
    ],
    improvement: [
      {
        title: 'Diagnóstico',
        summary: 'Reconocer fortalezas, dificultades y oportunidades para mejorar la gestión escolar.',
        bullets: [
          'Identificar brechas observables y verificables.',
          'Relacionar con evidencia institucional y contexto.',
          'Definir responsables y tiempos.'
        ]
      },
      {
        title: 'Acciones de mejora',
        summary: 'Diseñar estrategias concretas para optimizar el desarrollo institucional y pedagógico.',
        bullets: [
          'Meta específica.',
          'Acción concreta.',
          'Indicador de avance.',
          'Seguimiento y revisión.'
        ]
      }
    ]
  },
  operationalChecklist: [
    'Verificar conectividad local y disponibilidad del equipo.',
    'Confirmar que la documentación institucional está disponible localmente.',
    'Registrar la fecha, contexto y evidencia de la situación.',
    'Relacionar la acción con objetivos, responsabilidades y seguimiento.',
    'Guardar la decisión del docente y la trazabilidad del caso.'
  ],
  reportTemplates: [
    {
      id: 'informe-convivencia',
      title: 'Informe de convivencia',
      purpose: 'Apoyar la redacción de un informe de convivencia o seguimiento escolar.',
      sections: [
        { title: 'Contexto', content: 'Describa el contexto institucional, el grado, el grupo o la situación observada.' },
        { title: 'Hechos', content: 'Relate los hechos de manera objetiva, sin conclusiones prematuras.' },
        { title: 'Norma y marco', content: 'Indique la norma, el manual o el principio institucional que se relaciona con la situación.' },
        { title: 'Acción pedagógica', content: 'Describa la mediación, acompañamiento y la estrategia de solución propuesta.' },
        { title: 'Compromisos', content: 'Incluya acuerdos, responsabilidades y seguimiento a realizar.' }
      ]
    },
    {
      id: 'informe-academico',
      title: 'Informe académico',
      purpose: 'Apoyar el seguimiento de aprendizaje, rendimiento y acompañamiento docente.',
      sections: [
        { title: 'Objetivo', content: 'Señale qué se quiere evidenciar o acompañar pedagógicamente.' },
        { title: 'Evidencias', content: 'Describa actividades, observaciones, trabajos o producciones que respaldan el proceso.' },
        { title: 'Logros', content: 'Mencione avances, fortalezas y aprendizajes evidenciados.' },
        { title: 'Dificultades', content: 'Identifique barreras, factores contextuales o dificultades del proceso.' },
        { title: 'Recomendaciones', content: 'Proponga estrategias, acompañamiento y seguimiento específico.' }
      ]
    },
    {
      id: 'cumplimiento-pei',
      title: 'Cumplimiento PEI',
      purpose: 'Documentar si una acción o proceso está alineado con el marco institucional.',
      sections: [
        { title: 'Objetivo institucional', content: 'Relacione la acción con el objetivo institucional o pedagógico de la escuela.' },
        { title: 'Alineación', content: 'Explique en qué medida la acción responde al PEI, la misión y las metas institucionales.' },
        { title: 'Evidencia', content: 'Liste documentos, decisiones, observaciones o productos que la respaldan.' },
        { title: 'Revisión', content: 'Indique quién revisó, validó y registró la decisión.' },
        { title: 'Conclusión', content: 'Establezca si cumple, requiere ajuste o necesita seguimiento.' }
      ]
    }
  ],
  traceability: {
    chain: 'C→N→R→S→F→A→I→E',
    returnChain: 'E→I→A→F→S→R→N→C',
    example: [
      { label: 'C-01', text: 'Contexto institucional y de conectividad del colegio.' },
      { label: 'N-01', text: 'Necesidad de continuidad pedagógica y gestión documental local.' },
      { label: 'R-TEC-01', text: 'La plataforma debe funcionar sin depender de internet para tareas esenciales.' },
      { label: 'F-01', text: 'Módulo de soporte local, evidencias y revisión docente.' },
      { label: 'A-01', text: 'Actividad pedagógica apoyada por documentación, seguimiento y decisiones.' },
      { label: 'E-01', text: 'Evidencia institucional con trazabilidad y registro de revisión.' }
    ],
    indicators: [
      { name: 'CT', formula: 'CT = (Rt / R_total) × 100', target: '100%' },
      { name: 'TI_r', formula: '1 si la traza es completa, 0 si hay ruptura', target: 'sin rupturas' },
      { name: 'CE', formula: 'CE = (Re / R_evaluados) × 100', target: 'máxima evidencia' },
      { name: 'CV', formula: 'CV = (Rv / R_probados) × 100', target: 'verificación completa' }
    ]
  }
};

const state = {
  currentView: 'inicio',
  filter: 'all',
  notes: [],
  reports: [],
  selectedTemplateId: appData.reportTemplates[0].id,
  user: null
};

const typeColors = { F: 'tag-F', NF: 'tag-NF', SP: 'tag-SP' };

function getParsedValue(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('usuarios')) {
        db.createObjectStore('usuarios', { keyPath: 'nombre_real' });
      }
      if (!db.objectStoreNames.contains('notas')) {
        db.createObjectStore('notas', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('reportes')) {
        db.createObjectStore('reportes', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('No se pudo abrir IndexedDB'));
  });
}

function getCurrentUser() {
  const user = getParsedValue(KEY_USUARIO, null);
  state.user = user;
  return user;
}

function saveCurrentUser(user) {
  state.user = user;
  localStorage.setItem(KEY_USUARIO, JSON.stringify(user));
}

function ensureLocalDefaults() {
  state.notes = getParsedValue(KEY_NOTES, []);
  state.reports = getParsedValue(KEY_REPORTS, []);
  if (!state.notes.length) {
    const defaultNote = {
      id: Date.now(),
      title: 'Primera evidencia',
      category: 'PEI',
      text: 'Se registra la primera prueba de funcionamiento local con trazabilidad institucional y revisión docente.',
      createdAt: new Date().toISOString()
    };
    state.notes = [defaultNote];
    localStorage.setItem(KEY_NOTES, JSON.stringify(state.notes));
  }
  if (!state.reports.length) {
    const defaultReport = {
      id: Date.now() + 1,
      templateId: appData.reportTemplates[0].id,
      title: appData.reportTemplates[0].title,
      content: buildReportFromTemplate(appData.reportTemplates[0].id, 'Contexto inicial del sistema local: revisión de uso institucional y trazabilidad del proceso.'),
      createdAt: new Date().toISOString()
    };
    state.reports = [defaultReport];
    localStorage.setItem(KEY_REPORTS, JSON.stringify(state.reports));
  }
}

function setView(viewName) {
  state.currentView = viewName;
  const views = [...document.querySelectorAll('.view')];
  const navButtons = [...document.querySelectorAll('.nav-btn')];
  views.forEach((view) => {
    view.classList.toggle('active', view.id === `view-${viewName}`);
  });
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
}

function renderDashboardMetrics() {
  const dashboardMetrics = document.getElementById('dashboardMetrics');
  if (!dashboardMetrics) return;
  dashboardMetrics.innerHTML = appData.metrics.map((metric) => `
    <div class="metric">
      <strong>${metric.value}</strong>
      <span>${metric.label}</span>
    </div>
  `).join('');
}

function renderOperationalChecklist() {
  const operationalChecklist = document.getElementById('operationalChecklist');
  if (!operationalChecklist) return;
  operationalChecklist.innerHTML = appData.operationalChecklist.map((item) => `
    <div class="check-item">
      <span class="check-dot">✓</span>
      <span>${item}</span>
    </div>
  `).join('');
}

function renderOverview() {
  const objectiveText = document.getElementById('objectiveText');
  const specificObjectives = document.getElementById('specificObjectives');
  const principlesList = document.getElementById('principlesList');
  if (objectiveText) objectiveText.textContent = appData.objective;
  if (specificObjectives) specificObjectives.innerHTML = appData.specifics.map((item) => `<li>${item}</li>`).join('');
  if (principlesList) principlesList.innerHTML = appData.principles.map((item) => `<li>${item}</li>`).join('');
}

function renderRequirements() {
  const container = document.getElementById('requirementsContainer');
  if (!container) return;
  const items = state.filter === 'all' ? appData.requirements : appData.requirements.filter((item) => item.type === state.filter);
  container.innerHTML = items.map((item) => `
    <div class="requirement-card">
      <div class="req-header">
        <span class="req-id">${item.id}</span>
        <span class="req-tag ${typeColors[item.type] || 'tag-F'}">${item.type}</span>
      </div>
      <p>${item.description}</p>
    </div>
  `).join('');
}

function renderKnowledgeSection(container, items) {
  if (!container) return;
  container.innerHTML = items.map((item) => `
    <div class="info-card">
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <ul>
        ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderInstitutionalContent() {
  renderKnowledgeSection(document.getElementById('peiContent'), appData.institutional.pei);
  renderKnowledgeSection(document.getElementById('convivenciaContent'), appData.institutional.convivencia);
  renderKnowledgeSection(document.getElementById('academicContent'), appData.institutional.academic);
  renderKnowledgeSection(document.getElementById('cumplimientoContent'), appData.institutional.compliance);
  renderKnowledgeSection(document.getElementById('mejoramientoContent'), appData.institutional.improvement);
}

function renderTraceability() {
  const chainEl = document.getElementById('traceabilityChain');
  const trailPills = document.getElementById('trailPills');
  const traceExample = document.getElementById('traceExample');
  const indicatorsBody = document.getElementById('indicatorsBody');
  if (chainEl) chainEl.textContent = `Cadena bidireccional: ${appData.traceability.chain} · retorno: ${appData.traceability.returnChain}`;
  if (trailPills) trailPills.innerHTML = ['C', 'N', 'R', 'S', 'F', 'A', 'I', 'E'].map((item) => `<span>${item}</span>`).join('');
  if (traceExample) traceExample.innerHTML = appData.traceability.example.map((item) => `
    <div class="trace-item">
      <strong>${item.label}</strong>
      <div>${item.text}</div>
    </div>
  `).join('');
  if (indicatorsBody) indicatorsBody.innerHTML = appData.traceability.indicators.map((indicator) => `
    <tr>
      <td>${indicator.name}</td>
      <td>${indicator.formula}</td>
      <td>${indicator.target}</td>
    </tr>
  `).join('');
}

function renderReportTemplates() {
  const select = document.getElementById('reportTemplateSelect');
  const templatesEl = document.getElementById('reportTemplates');
  if (!select || !templatesEl) return;

  select.innerHTML = appData.reportTemplates.map((template) => `<option value="${template.id}">${template.title}</option>`).join('');
  select.value = state.selectedTemplateId;

  templatesEl.innerHTML = appData.reportTemplates.map((template) => `
    <div class="info-card compact-card">
      <h3>${template.title}</h3>
      <p>${template.purpose}</p>
      <button class="primary-btn small-btn" data-template="${template.id}" type="button">Usar plantilla</button>
    </div>
  `).join('');

  templatesEl.querySelectorAll('[data-template]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.template;
      state.selectedTemplateId = id;
      select.value = id;
      const context = document.getElementById('reportContextInput').value.trim();
      if (context) {
        const generated = buildReportFromTemplate(id, context);
        renderGeneratedReports(generated, id);
      }
    });
  });
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;
  const q = (query || '').trim().toLowerCase();

  if (!q) {
    resultsEl.innerHTML = '<div class="result-card">Escribe una palabra clave para buscar requisitos, normas, PEI o informes.</div>';
    return;
  }

  const matched = [
    ...appData.requirements.map((req) => ({ type: 'Requisito', title: req.id, description: req.description, text: `${req.id} ${req.description}` })),
    ...appData.procedures.map((proc) => ({ type: 'Procedimiento', title: proc.title, description: proc.description, text: `${proc.title} ${proc.description} ${proc.area} ${proc.action}` })),
    ...appData.traceability.example.map((item) => ({ type: 'Trazabilidad', title: item.label, description: item.text, text: `${item.label} ${item.text}` })),
    ...appData.institutional.pei.flatMap((block) => block.bullets.map((bullet) => ({ type: 'PEI', title: block.title, description: bullet, text: `${block.title} ${bullet}` }))),
    ...appData.institutional.convivencia.flatMap((block) => block.bullets.map((bullet) => ({ type: 'Convivencia', title: block.title, description: bullet, text: `${block.title} ${bullet}` }))),
    ...appData.reportTemplates.flatMap((template) => template.sections.map((section) => ({ type: 'Informe', title: `${template.title}: ${section.title}`, description: section.content, text: `${template.title} ${section.title} ${section.content}` })))
  ].filter((entry) => entry.text.toLowerCase().includes(q));

  if (!matched.length) {
    resultsEl.innerHTML = '<div class="result-card">No se encontraron coincidencias. Intenta buscar palabras como "offline", "PEI", "docente", "norma" o "informe".</div>';
    return;
  }

  resultsEl.innerHTML = matched.slice(0, 8).map((item) => `
    <div class="result-card">
      <strong>${item.type}: ${item.title}</strong>
      <p>${item.description}</p>
    </div>
  `).join('');
}

function buildReportFromTemplate(templateId, contextText) {
  const template = appData.reportTemplates.find((item) => item.id === templateId) || appData.reportTemplates[0];
  const context = (contextText || '').trim();
  const intro = 'Este documento es una plantilla institucional local y debe ser revisada por el docente o responsable antes de usarse como evidencia oficial.\n\n';
  const contextLine = context ? `Contexto aportado: ${context}\n\n` : 'Contexto: no se indicó información adicional. Se recomienda describir la situación, el curso, la fecha y la evidencia antes de usar el informe como documento formal.\n\n';
  const body = template.sections.map((section) => `${section.title}:\n${section.content}${context ? ` En este caso: ${context}.` : ''}`).join('\n\n');
  return `${intro}${template.title}\n\n${contextLine}${body}`;
}

function escapeHtml(value) {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function saveNotesToStorage() {
  localStorage.setItem(KEY_NOTES, JSON.stringify(state.notes));
}

function saveReportsToStorage() {
  localStorage.setItem(KEY_REPORTS, JSON.stringify(state.reports));
}

function renderNotes() {
  const notesList = document.getElementById('notesList');
  if (!notesList) return;

  if (!state.notes.length) {
    notesList.innerHTML = '<div class="note-item">No hay evidencias guardadas aún. Escribe una nota y guárdala para la escuela.</div>';
    return;
  }

  const user = getCurrentUser();
  const isAdmin = user && user.rol === 'Admin';

  notesList.innerHTML = state.notes.map((note) => `
    <div class="note-item">
      <div class="req-header">
        <strong>${note.title}</strong>
        <span>${note.category}</span>
      </div>
      <small>${new Date(note.createdAt).toLocaleString('es-CO')}</small>
      <p>${note.text}</p>
      ${isAdmin ? `<button class="danger-btn delete-note" data-id="${note.id}" type="button">Eliminar</button>` : ''}
    </div>
  `).join('');
}

function saveNote() {
  const titleEl = document.getElementById('noteTitle');
  const categoryEl = document.getElementById('noteCategory');
  const inputEl = document.getElementById('noteInput');
  if (!titleEl || !categoryEl || !inputEl) return;

  const title = (titleEl.value || '').trim();
  const category = categoryEl.value || 'General';
  const text = (inputEl.value || '').trim();
  if (!title || !text) {
    alert('Escribe un título y una evidencia para guardar la nota.');
    return;
  }

  const note = {
    id: Date.now(),
    title,
    category,
    text,
    createdAt: new Date().toISOString()
  };

  state.notes.unshift(note);
  saveNotesToStorage();
  titleEl.value = '';
  inputEl.value = '';
  renderNotes();
}

function updateReportCount() {
  const label = document.getElementById('reportCountLabel');
  if (label) label.textContent = String(state.reports.length);
}

function renderGeneratedReports(reportText, templateId) {
  const generatedReports = document.getElementById('generatedReports');
  if (!generatedReports) return;

  const template = appData.reportTemplates.find((item) => item.id === (templateId || state.selectedTemplateId)) || appData.reportTemplates[0];
  const report = {
    id: Date.now(),
    templateId: template.id,
    title: template.title,
    content: reportText || buildReportFromTemplate(template.id, ''),
    createdAt: new Date().toISOString()
  };

  state.reports.unshift(report);
  saveReportsToStorage();
  updateReportCount();

  generatedReports.innerHTML = state.reports.map((item) => `
    <div class="report-card">
      <div class="req-header">
        <strong>${item.title}</strong>
        <span>${new Date(item.createdAt).toLocaleString('es-CO')}</span>
      </div>
      <pre>${escapeHtml(item.content)}</pre>
      ${isAdmin() ? `<button class="danger-btn delete-report" data-id="${item.id}" type="button">Eliminar</button>` : ''}
    </div>
  `).join('');
}

function isAdmin() {
  const user = getCurrentUser();
  return !!(user && user.rol === 'Admin');
}

function generateReport() {
  const select = document.getElementById('reportTemplateSelect');
  const contextInput = document.getElementById('reportContextInput');
  if (!select || !contextInput) return;

  const templateId = select.value || state.selectedTemplateId;
  const context = (contextInput.value || '').trim();
  const reportText = buildReportFromTemplate(templateId, context);
  renderGeneratedReports(reportText, templateId);
}

function exportJsonReport() {
  const report = state.reports[0];
  if (!report) {
    alert('No hay un informe generado para exportar.');
    return;
  }
  const payload = JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rio-informe.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportPdfReport() {
  const report = state.reports[0];
  if (!report) {
    alert('No hay un informe para exportar en PDF.');
    return;
  }

  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('La librería de PDF no está disponible en este momento.');
    return;
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const lines = doc.splitTextToSize(report.content, 500);
  doc.setFontSize(18);
  doc.text(report.title, 40, 52);
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date(report.createdAt).toLocaleString('es-CO')}`, 40, 72);
  doc.setFontSize(11);
  let y = 100;
  lines.forEach((line) => {
    if (y > 760) {
      doc.addPage();
      y = 40;
    }
    doc.text(line, 40, y);
    y += 14;
  });
  doc.save('rio-informe.pdf');
}

function buildAssistantReply(query) {
  const q = query.toLowerCase();

  if (q.includes('pei') || q.includes('proyecto educativo') || q.includes('plan de estudio')) {
    return {
      title: 'PEI y plan de estudio',
      text: 'El PEI debe orientar la misión, la visión y la forma como la institución concreta su práctica. Para apoyar una decisión, debe relacionarse con objetivos, competencias, evidencias y responsable de seguimiento. La revisión docente es obligatoria antes de usarlo como decisión institucional.'
    };
  }

  if (q.includes('convivencia') || q.includes('manual') || q.includes('norma') || q.includes('faltas')) {
    return {
      title: 'Convivencia y normas',
      text: 'Para una situación de convivencia, primero describa los hechos de manera objetiva, luego relacione la situación con la norma o el manual institucional. Después defina la intervención pedagógica, la evidencia y el seguimiento. La mediación docente debe estar presente antes de cerrar el caso.'
    };
  }

  if (q.includes('offline') || q.includes('sin internet') || q.includes('conectividad')) {
    return {
      title: 'Modo offline',
      text: 'El sistema debe funcionar localmente con acceso a información, evidencias, notas y documentación institucional sin depender de internet. Cuando vuelva la conectividad, se puede sincronizar y registrar la fecha de actualización. La configuración local sigue siendo la base operativa.'
    };
  }

  if (q.includes('docente') || q.includes('evaluacion') || q.includes('revisar') || q.includes('validar')) {
    return {
      title: 'Rol del docente',
      text: 'La IA sirve como apoyo para organizar, redactar y sugerir recomendaciones. Sin embargo, la revisión final, la validación académica y la decisión institucional corresponden al docente o a la autoridad responsable. No se debe delegar la decisión evaluativa ni disciplinaria.'
    };
  }

  if (q.includes('seguridad') || q.includes('datos') || q.includes('privacidad')) {
    return {
      title: 'Seguridad y protección de datos',
      text: 'La plataforma debe aplicar mínimo privilegio, roles y permisos, limitar acceso por perfil y mantener trazabilidad de decisiones. Se debe evitar compartir información sensible sin necesidad y priorizar la seguridad institucional.'
    };
  }

  if (q.includes('exportar') || q.includes('pdf') || q.includes('json')) {
    return {
      title: 'Exportación de informes',
      text: 'El informe puede exportarse como PDF o JSON desde la sección de Informes. El documento debe conservar el contexto, la evidencia y la recomendación institucional. La revisión docente sigue siendo obligatoria antes de usarlo como evidencia formal.'
    };
  }

  const hits = appData.requirements.filter((req) => {
    const text = `${req.id} ${req.description}`.toLowerCase();
    return text.includes(q) || q.includes(req.id.toLowerCase());
  }).slice(0, 3);

  if (hits.length) {
    return {
      title: 'Requisitos relevantes',
      text: hits.map((req) => `${req.id}: ${req.description}`).join(' · ')
    };
  }

  return {
    title: 'Respuesta general',
    text: 'RIO-CARIBE propone un enfoque institucional, pedagógico y técnico para apoyar la gestión escolar con recursos locales, trazabilidad y revisión docente. Su intención es brindar continuidad, claridad documental y apoyo a la toma de decisiones con evidencia.'
  };
}

function askAssistant() {
  const input = document.getElementById('assistantInput');
  const output = document.getElementById('assistantOutput');
  if (!input || !output) return;

  const query = (input.value || '').trim();
  if (!query) {
    alert('Escribe una pregunta para consultar al asistente IA local.');
    return;
  }

  const answer = buildAssistantReply(query);
  output.innerHTML = `
    <div class="assistant-answer">
      <strong>${answer.title}</strong>
      <div>${answer.text}</div>
    </div>
  `;
  input.value = '';
}

function updateConnectionStatus() {
  const status = document.getElementById('connectionStatus');
  const label = document.getElementById('networkLabel');
  const lastSyncLabel = document.getElementById('lastSyncLabel');
  if (!status || !label || !lastSyncLabel) return;

  const online = navigator.onLine;
  status.classList.toggle('online', online);
  status.classList.toggle('offline', !online);
  label.textContent = online ? 'Conectado' : 'Sin conexión';

  const lastSync = localStorage.getItem(KEY_SYNC);
  lastSyncLabel.textContent = lastSync ? new Date(lastSync).toLocaleString('es-CO') : 'Nunca';
}

function syncPendingData() {
  if (!navigator.onLine) {
    alert('Actualmente no hay conexión. La sincronización quedará pendiente hasta que vuelva la conectividad.');
    return;
  }

  const now = new Date().toISOString();
  localStorage.setItem(KEY_SYNC, now);
  updateConnectionStatus();
  alert('Sincronización completada. La evidencia y los registros quedaron actualizados localmente.');
}

function deleteNote(id) {
  if (!isAdmin()) {
    alert('Solo el administrador puede eliminar evidencias.');
    return;
  }
  state.notes = state.notes.filter((note) => Number(note.id) !== Number(id));
  saveNotesToStorage();
  renderNotes();
}

function deleteReport(id) {
  if (!isAdmin()) {
    alert('Solo el administrador puede eliminar informes.');
    return;
  }
  state.reports = state.reports.filter((report) => Number(report.id) !== Number(id));
  saveReportsToStorage();
  updateReportCount();
  const generatedReports = document.getElementById('generatedReports');
  if (!generatedReports) return;
  generatedReports.innerHTML = state.reports.length
    ? state.reports.map((item) => `
      <div class="report-card">
        <div class="req-header">
          <strong>${item.title}</strong>
          <span>${new Date(item.createdAt).toLocaleString('es-CO')}</span>
        </div>
        <pre>${escapeHtml(item.content)}</pre>
        <button class="danger-btn delete-report" data-id="${item.id}" type="button">Eliminar</button>
      </div>
    `).join('')
    : '<div class="report-card">No hay informes generados.</div>';
}

function renderUserHeader() {
  const header = document.getElementById('app-header');
  if (!header) return;
  const user = getCurrentUser();
  if (!user) {
    header.innerHTML = '';
    return;
  }

  const roleColor = user.rol === 'Docente' ? '#0b5fff' : user.rol === 'Rector' ? '#3b82f6' : user.rol === 'Admin' ? '#1e3a8a' : '#7f8ca3';
  header.innerHTML = `
    <div class="user-header" style="border-left: 8px solid ${roleColor};">
      <div>
        <strong>${user.nombre_real}</strong>
        <span>${user.rol}</span>
      </div>
      <div class="muted-user">${user.municipio_real || 'Municipio'}, ${user.departamento_real || 'Departamento'}</div>
      <button id="logoutBtn" class="ghost-btn" type="button">Salir</button>
    </div>
  `;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(KEY_USUARIO);
      window.location.reload();
    });
  }
}

function renderApp() {
  const user = getCurrentUser();
  const loginScreen = document.getElementById('login-screen');
  const appShell = document.getElementById('app-shell');
  if (!loginScreen || !appShell) return;

  if (!user) {
    loginScreen.classList.remove('hidden');
    appShell.classList.add('hidden');
    return;
  }

  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  renderUserHeader();
  renderDashboardMetrics();
  renderOperationalChecklist();
  renderOverview();
  renderRequirements();
  renderInstitutionalContent();
  renderTraceability();
  renderSearchResults('');
  renderNotes();
  renderReportTemplates();
  updateConnectionStatus();
  updateReportCount();
  renderGeneratedReports(state.reports[0]?.content || buildReportFromTemplate(appData.reportTemplates[0].id, 'Contexto inicial del sistema.'), state.reports[0]?.templateId || appData.reportTemplates[0].id);
}

function bindEvents() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((item) => item.classList.toggle('active', item === button));
      renderRequirements();
    });
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    if (!button.classList.contains('nav-btn') && !button.classList.contains('filter-btn')) {
      button.addEventListener('click', () => setView(button.dataset.view));
    }
  });

  document.getElementById('searchBtn')?.addEventListener('click', () => {
    const input = document.getElementById('searchInput');
    renderSearchResults(input ? input.value : '');
  });

  document.getElementById('assistantInput')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') askAssistant();
  });

  document.getElementById('askAssistantBtn')?.addEventListener('click', askAssistant);
  document.getElementById('saveNoteBtn')?.addEventListener('click', saveNote);
  document.getElementById('syncBtn')?.addEventListener('click', syncPendingData);
  document.getElementById('generateReportBtn')?.addEventListener('click', generateReport);
  document.getElementById('exportPdfBtn')?.addEventListener('click', exportPdfReport);
  document.getElementById('exportJsonBtn')?.addEventListener('click', exportJsonReport);
  document.getElementById('reportTemplateSelect')?.addEventListener('change', (event) => {
    state.selectedTemplateId = event.target.value;
  });
  document.getElementById('searchInput')?.addEventListener('input', (event) => {
    renderSearchResults(event.target.value);
  });

  document.body.addEventListener('click', (event) => {
    const deleteNoteBtn = event.target.closest('.delete-note');
    const deleteReportBtn = event.target.closest('.delete-report');
    if (deleteNoteBtn) deleteNote(Number(deleteNoteBtn.dataset.id));
    if (deleteReportBtn) deleteReport(Number(deleteReportBtn.dataset.id));
  });

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
}

async function initLogin() {
  const user = getCurrentUser();
  if (!user) {
    const nameInput = document.getElementById('nombre_real');
    const rolSelect = document.getElementById('rol');
    const deptInput = document.getElementById('departamento_real');
    const muniInput = document.getElementById('municipio_real');
    const btn = document.getElementById('btnEntrar');

    btn?.addEventListener('click', async () => {
      const nombre = (nameInput?.value || '').trim();
      const rol = rolSelect?.value || 'Estudiante';
      const departamento = (deptInput?.value || '').trim() || 'Departamento';
      const municipio = (muniInput?.value || '').trim() || 'Municipio';

      if (!nombre) {
        alert('Escribe tu nombre real para iniciar sesión.');
        return;
      }

      const usuario = {
        nombre_real: nombre,
        rol,
        departamento_real: departamento,
        municipio_real: municipio,
        fecha: new Date().toISOString()
      };

      saveCurrentUser(usuario);
      await openDB().then((db) => {
        const tx = db.transaction('usuarios', 'readwrite');
        tx.objectStore('usuarios').put(usuario);
      }).catch(() => {});

      renderApp();
    });
  }
}

function setupReportChart() {
  const canvas = document.getElementById('reportChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const values = [70, 82, 90, 76, 88];
  const barWidth = 44;
  const gap = 20;
  const max = 100;
  const startX = 35;
  const baseY = 150;

  ctx.fillStyle = '#dfe9ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  values.forEach((value, index) => {
    const x = startX + index * (barWidth + gap);
    const h = (value / max) * 110;
    const y = baseY - h;
    ctx.fillStyle = ['#0b5fff', '#3b82f6', '#1e3a8a', '#7cc7ff', '#7ad4c6'][index];
    ctx.fillRect(x, y, barWidth, h);
    ctx.fillStyle = '#11213b';
    ctx.font = '11px sans-serif';
    ctx.fillText(String(value), x + 12, y - 8);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  ensureLocalDefaults();
  bindEvents();
  await initLogin();
  renderApp();
  setupReportChart();
});
