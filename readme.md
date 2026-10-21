# GSBC v11 RIO-CARIBE - GUÍA FINAL NACIONAL OFFLINE-FIRST
# Toda Colombia - Sin ejemplos de ciudades - Sincronización Inteligente

## OBJETIVO
Plataforma educativa rural nacional, limpia, profesional, 100% offline-first.
Cero ejemplos de ciudades. Todo dinámico por departamento y municipio reales del DUE oficial https://www.datos.gov.co/resource/6k5y-ir6r.json

## 1. COMPORTAMIENTO INTERNET / OFFLINE - OBLIGATORIO

### CON INTERNET - Actualiza y guarda para offline:
- Al abrir con internet, actualiza DUE Nacional en segundo plano sin bloquear.
- Muestra: "Conectado - Actualizando DUE Nacional..." luego "Actualizado: X colegios - Guardado para offline - [fecha real]"
- Guarda TODO en 3 capas:
    1. IndexedDB - base local grande para colegios y reportes
    2. Cache API - via Service Worker para abrir sin internet
    3. localStorage - solo fecha última sincronización
- Cada reporte generado o firma docente se guarda al instante en IndexedDB, no espera internet.

### SIN INTERNET - Debe seguir funcionando (F-01):
- La página DEBE abrir sin wifi ni datos. Si no abre, no cumple artículo.
- Muestra: "Modo Offline - Trabajando con X colegios guardados el [fecha real última sync]"
- Funciones que deben seguir sin internet: ver colegios, cambiar roles, generar PEI, Plan Estudio, PMI, Manual Convivencia, SIEE, exportar PDF/Word/JSON, usar IA local Phi-3 mini.
- PDFs offline marcan: "Generado en modo offline - Fecha real - Sincronizará cuando haya internet"

### CUANDO VUELVE INTERNET - Sincronización inteligente:
- Detecta internet y muestra: "Internet detectado - Sincronizando X reportes pendientes..."
- Sube reportes generados offline automáticamente.
- Actualiza DUE Nacional si hay nuevos colegios, sin borrar reportes locales.
- Mensaje final: "Sincronización completa - X colegios actualizados - X reportes guardados"

## 2. ACCESOS Y ROLES - Cómo deben funcionar

### ESTUDIANTE:
- Entrada sin clave, selecciona colegio por DANE real.
- Puede: ver colegios, evidencias de su grado, manual convivencia (solo lectura).
- No puede: generar PEI, firmar, exportar, borrar.

### DOCENTE / RECTOR (R-PC-03, R-SP-01, R-GOB-01):
- Ingreso con nombre real + rol (Docente o Rector) guardado local.
- Puede: generar todos los reportes, editar contexto local, dar visto bueno.
- Obligatorio: todo documento queda "Pendiente de firma" hasta presionar "Firmar y Validar" - R-PC-03.
- Botones: Generar PEI, Plan Estudio, PMI, Manual Convivencia, SIEE, Firmar Cierre Unidad.

### ADMIN:
- Sincroniza DUE Nacional completo, activa modo offline, ve auditoría TRAZA-RIO, exporta respaldo nacional USB/JSON.
- No genera contenido pedagógico, solo administra.

Recomendación visual: borde distinto por rol. Estudiante azul claro, Docente azul fuerte, Admin azul oscuro.

## 3. GENERADOR DE REPORTES - 5 obligatorios nacionales

Cada reporte debe tener:
- Portada: escudo, nombre real colegio, DANE real, departamento real, municipio real, fecha real generación.
- Sección 1: Datos oficiales DUE (del registro seleccionado).
- Sección 2: Contexto territorial (usa solo departamento_real y municipio_real reales, sin inventar ríos/veredas).
- Sección 3: Contenido documento (borrador IA local) con marca "Borrador - Requiere aprobación docente R-PC-03".
- Sección 4: Trazabilidad TRAZA-RIO C→N→R→S→F→A→I→E visible en pie.
- Sección 5: Firma docente/rector (nombre, fecha, hash).

Reportes: 
1. PEI
2. Plan de Estudio por grado y área
3. PMI - Plan Mejoramiento Institucional
4. Manual de Convivencia
5. SIEE

Exportación: 3 botones juntos siempre - PDF (oficial con jsPDF offline), Word (docx.js), JSON (respaldo con traza). Misma información en los 3.

## 4. MÓDULO IA LOCAL OFFLINE

- Ubicado panel derecho, como asistente, no buscador central.
- Título: "Asistente IA Local Offline - Sin nube - Datos no salen del dispositivo - Phi-3 mini"
- Mensaje inicial: "Hola docente, ¿sobre qué colegio y grado necesitas generar el documento hoy? Trabajo con datos DANE reales."
- Cada respuesta IA con etiqueta amarilla: "Requiere aprobación docente R-PC-03 - Validar antes de uso oficial"
- Filtro R-IA-03 visible: "Contenido verificado por filtro local"
- IA nunca genera documento final solo. Solo borrador que docente edita y firma. Si genera y exporta directo viola R-GOB-01.

## 5. DISEÑO LIMPIO NACIONAL - Para que se vea genial

- Sin mapas con pines inventados, sin fotos colegios falsos.
- Tabla: Código DANE Real | Institución Real | Departamento Real | Municipio Real | Zona Real | Estado | Acción Ver
- Buscador nacional: placeholder "Buscar por DANE, nombre, departamento o municipio en toda Colombia"
- Contadores reales arriba: "X colegios sincronizados - Cobertura Nacional - DUE Oficial datos.gov.co - Actualizado: fecha real"
- Barra superior siempre visible: Conectado/Offline + total colegios + última sync real + reportes pendientes.
- Pie: "GSBC v11 RIO-CARIBE - Modo 100% Offline - Sin datos en la nube - Auditoría TRAZA-RIO Activa - Cumple MEN - Cobertura Nacional"

## 6. PROHIBIDO

- Botones "Próximamente"
- Datos ejemplo tipo "I.E. Ejemplo" o "Colegio Demo"
- Ciudades fijas hardcodeadas en código
- Llamadas a servidores externos fuera de datos.gov.co y CDN de librerías
- Inventar DANE, colegios, ríos, veredas

## 7. ORDEN PARA COPILOT - Una tarea por mensaje

1. "Implementa roles Estudiante/Docente-Rector/Admin con cambio de interfaz según rol. Usa esta guía"
2. "Implementa sincronización DUE Nacional real + IndexedDB + Service Worker PWA para offline-first según sección 1 de guía"
3. "Implementa generador 5 reportes con estructura portada y traza según sección 3"
4. "Implementa asistente IA local offline panel derecho según sección 4, con etiqueta R-PC-03"
