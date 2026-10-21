# GSBC v11 FIX TOTAL - PLIEGO TÉCNICO DE IMPLEMENTACIÓN REAL
## Cumplimiento 100% Marco RIO-CARIBE (C_ARIBE.pdf)
**Autor Artículo:** Felipe Barroso Negrete - CUN
**Proyecto:** gsbc-v11-fix-total
**Regla de Oro:** PROHIBIDO INVENTAR DATOS - TODO REAL Y VERIFICABLE

### 1. OBJETIVO CONTRACTUAL
Transformar el link actual de dashboard online con 0 colegios reales, a un Sistema de Aula Rural Offline-First que cumpla los 30 requisitos de C_ARIBE.pdf Tabla 3 y arquitectura L1/L2/L3.

### 2. FUENTE DATOS REALES AUTORIZADA
- Dataset: MEN - ESTABLECIMIENTOS EDUCATIVOS
- URL: https://www.datos.gov.co/resource/6k5y-ir6r.json
- Filtro: departamento=Cesar
- Campo DANE: codigo_dane_sede / cod_dane_sede (12 dígitos)
- PROHIBIDO usar faker, mock, ejemplos

CÓDIGO REAL FIX:
async function syncDUEOnlineReal() {
  const url = 'https://www.datos.gov.co/resource/6k5y-ir6r.json?$limit=5000&$where=departamento LIKE \'%CESAR%\'';
  const res = await fetch(url);
  const data = await res.json();
  const getDane = (c) => c.codigo_dane_sede || c.cod_dane_sede || c.dane_sede || c.codigo_dane || '';
  const reales = data.filter(c => {
    const dane = getDane(c).toString();
    return dane.length >= 8 && (c.departamento||'').toUpperCase().includes('CESAR');
  }).map(c => ({
    dane_real: getDane(c),
    nombre_sede_real: c.nombre_sede || c.nombre_establecimiento || '',
    municipio_real: c.municipio || '',
    departamento_real: c.departamento || '',
    origen: 'DUE-MEN-datos.gov.co'
  }));
  localStorage.setItem('rio_caribe_due_real_cache_v14_2', JSON.stringify({
    fecha_sync: new Date().toISOString(),
    total_reales: reales.length,
    origen_verificable: url,
    datos: reales
  }));
  return reales;
}

### 3. ARQUITECTURA 3 CAPAS ARTÍCULO
L1: PWA + Service Worker + IndexedDB (R-TEC, R-ENE, R-MAN)
L2: Sin IA nube, preparar modulo local (R-IA)
L3: RBAC docente + firma (R-PC, R-SP, R-GOB)

### 4. 7 BOTONES FUNCIONALES REALES
1. Sincronizar DUE Cesar (Real) - btn-sync-due - syncDUEOnlineReal()
2. Activar Modo Offline - btn-offline - serviceWorker.register()
3. Ingresar como Docente - btn-login-docente - guarda rol
4. Firmar Cierre Unidad - btn-firma-docente - solo rol docente, guarda firma ISO
5. Ver Marco RIO-CARIBE - btn-ver-pdf - window.open('./C_aribe.pdf')
6. Cuaderno Evidencias - btn-evidencias - tabla TRAZA-RIO
7. Exportar Respaldo USB - btn-export-usb - descarga JSON real

### 5. TRAZABILIDAD TRAZA-RIO OBLIGATORIA
Cada registro:
{
  C: 'C-01 Intermitencia Valledupar',
  N: 'N-01 Continuidad sin internet',
  R: 'R-TEC-01',
  S: 'L1',
  F: 'btn-sync-due',
  A: 'Consulta DANE 20001000XXXX',
  I: 'CT',
  E: 'Evidencia ISO',
  dane_real: '...',
  origen_verificable: 'https://www.datos.gov.co/resource/6k5y-ir6r.json'
}

### 6. ESTRUCTURA ARCHIVOS FINAL
/index.html -> debe importar style.css y app.js
/app.js -> logica real
/style.css -> responsive
/service-worker.js -> cache real
/C_aribe.pdf -> visor
/manifest.json -> PWA standalone

### 7. CRITERIOS PASS/FAIL F-01 A F-12
F-01 Offline: sin wifi debe abrir = PASS
F-05 Datos menores: no envia a externo = PASS
F-11 Evaluacion: pide firma docente = PASS
F-12 Trazabilidad: >90% con C->E = PASS

CT Meta = 100%

### 8. PLAN 4 COMMITS
Commit1: Fix DUE real
Commit2: PWA offline
Commit3: RBAC + firma
Commit4: TRAZA + PDF + export

Deploy: GitHub Pages https://gsbc0416.github.io/gsbc-v11-fix-total/
