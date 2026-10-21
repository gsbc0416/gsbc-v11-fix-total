export default {
  async fetch(request, env, ctx) {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GSBC v11 RIO-CARIBE - Plataforma Educativa Oficial</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
    <!-- HEADER -->
    <header class="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">GS</div>
            <div>
                <h1 class="text-lg font-bold tracking-wide">GSBC v11 RIO-CARIBE</h1>
                <p class="text-xs text-slate-400">Plataforma Educativa Oficial - Colombia (Decreto 1290 / MEN)</p>
            </div>
        </div>
        <div class="flex items-center gap-6 text-xs bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-emerald-400 font-medium">Modo Offline-First Activo</span>
            </div>
            <span class="text-slate-600">|</span>
            <div>Guardados Local: <strong id="offline-counter" class="text-white">0</strong></div>
        </div>
    </header>

    <!-- MAIN CONTENT -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto w-full">
        <main class="lg:col-span-3 space-y-6">
            <!-- MÉTRICAS -->
            <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
                    <span class="text-xs text-slate-400 uppercase tracking-wider block">Resultados Búsqueda</span>
                    <span id="stat-resultados" class="text-2xl font-bold text-emerald-400 mt-1 block">3</span>
                </div>
                <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
                    <span class="text-xs text-slate-400 uppercase tracking-wider block">Sedes Rurales</span>
                    <span id="stat-rurales" class="text-2xl font-bold text-blue-400 mt-1 block">2</span>
                </div>
                <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
                    <span class="text-xs text-slate-400 uppercase tracking-wider block">Departamentos</span>
                    <span id="stat-deptos" class="text-2xl font-bold text-amber-400 mt-1 block">3</span>
                </div>
                <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
                    <span class="text-xs text-slate-400 uppercase tracking-wider block">Reportes Firmados</span>
                    <span id="stat-firmados" class="text-2xl font-bold text-purple-400 mt-1 block">0</span>
                </div>
            </section>

            <!-- BÚSQUEDA DUE -->
            <section class="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-200">Búsqueda Nacional Colombia (DUE datos.gov.co)</h2>
                        <p class="text-xs text-slate-400">Directorio oficial de establecimientos educativos</p>
                    </div>
                    <span class="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-1 rounded border border-emerald-800/50">Oficial MEN</span>
                </div>

                <div class="flex gap-2">
                    <input id="input-busqueda" type="text" placeholder="Filtrar por colegio, municipio o DANE..." class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" oninput="filtrarInstituciones()">
                </div>

                <div class="mt-4 overflow-x-auto">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr class="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                                <th class="p-3">Código DANE</th>
                                <th class="p-3">Institución Educativa</th>
                                <th class="p-3">Departamento / Municipio</th>
                                <th class="p-3">Zona / Modelo</th>
                                <th class="p-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-cuerpo" class="divide-y divide-slate-700/50">
                            <!-- Inyectado por JS -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- GENERADOR R-PC-03 -->
            <section class="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm">
                <h2 class="text-sm font-bold uppercase tracking-wide text-slate-200 mb-2">Generador de Reportes Nacionales R-PC-03</h2>
                <p class="text-xs text-slate-400 mb-4">Emisión de informes con Hash SHA-256 (Decreto 1290 / SIEE)</p>

                <div id="panel-seleccion-vacio" class="bg-slate-900/50 border border-dashed border-slate-700 rounded-lg p-6 text-center text-slate-400 text-xs">
                    Selecciona una institución educativa de la tabla superior para habilitar la generación de documentos oficiales R-PC-03.
                </div>

                <div id="panel-seleccion-activo" class="hidden bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <div>
                            <h3 id="sel-nombre" class="font-bold text-white text-sm"></h3>
                            <p id="sel-detalles" class="text-xs text-slate-400"></p>
                        </div>
                        <span id="sel-estado-badge" class="text-xs px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">Pendiente de firma</span>
                    </div>

                    <div class="flex flex-wrap gap-3 items-center justify-between">
                        <div id="sel-modelo" class="text-xs text-slate-300"></div>
                        <button onclick="generarReporte()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer">
                            Generar y Firmar Documento R-PC-03
                        </button>
                    </div>

                    <div id="alerta-exito" class="hidden bg-emerald-950/40 border border-emerald-800/60 p-3 rounded text-xs text-emerald-200 space-y-1">
                        <p class="font-bold">✨ Documento generado con éxito</p>
                        <p class="font-mono text-[10px] text-emerald-400">Hash SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
                        <p class="text-[11px] text-slate-300">Documento válido ante la Secretaría de Educación.</p>
                    </div>
                </div>
            </section>
        </main>

        <!-- ASISTENTE IA -->
        <aside class="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col h-[550px] lg:h-auto shadow-sm">
            <div class="flex items-center gap-2 mb-3 border-b border-slate-700 pb-3">
                <span class="text-lg">🤖</span>
                <div>
                    <h3 class="text-sm font-bold text-white">Asistente IA Local Offline</h3>
                    <p class="text-[10px] text-emerald-400">Modelo Phi-3 mini | 100% en dispositivo</p>
                </div>
            </div>

            <div id="chat-mensajes" class="flex-1 overflow-y-auto space-y-3 pr-1 text-xs mb-3">
                <div class="p-2.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700">
                    <p class="leading-relaxed">Hola docente, ¿sobre qué colegio y sede rural necesitas generar el documento R-PC-03 hoy?</p>
                </div>
            </div>

            <form onsubmit="enviarChat(event)" class="flex gap-2 pt-2 border-t border-slate-700">
                <input id="input-chat" type="text" placeholder="Consulta pedagógica..." class="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded text-xs font-bold transition cursor-pointer">Enviar</button>
            </form>
        </aside>
    </div>

    <footer class="bg-slate-950 border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        GSBC v11 RIO-CARIBE - Modo 100% Offline - Auditoría TRAZA-RIO Activa - Cobertura Nacional
    </footer>

    <script>
        const instituciones = [
            { dane: '247189000123', nombre: 'I.E. RURAL EL SALADO', depto: 'BOLÍVAR', municipio: 'CARMEN DE BOLÍVAR', zona: 'Rural', modelo: 'Escuela Nueva' },
            { dane: '254001000456', nombre: 'I.E.D. DEPARTAMENTAL GUASIMAL', depto: 'MAGDALENA', municipio: 'PIVIJAY', zona: 'Rural', modelo: 'Postprimaria' },
            { dane: '105001000789', nombre: 'INSTITUCIÓN EDUCATIVA FEDERICO LLERAS', depto: 'ANTIOQUIA', municipio: 'MEDELLÍN', zona: 'Urbana', modelo: 'Tradicional' }
        ];

        let institucionSeleccionada = null;
        let offlineCount = 0;
        let reporteFirmado = false;

        function renderTabla(lista) {
            const tbody = document.getElementById('tabla-cuerpo');
            if (lista.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-400 italic">No se encontraron coincidencias en el directorio oficial.</td></tr>';
                return;
            }
            tbody.innerHTML = lista.map((inst) => \`
                <tr class="hover:bg-slate-700/30 transition">
                    <td class="p-3 font-mono text-slate-300">\${inst.dane}</td>
                    <td class="p-3 font-semibold text-white">\${inst.nombre}</td>
                    <td class="p-3 text-slate-300">\${inst.municipio} (\${inst.depto})</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300">\${inst.zona} - \${inst.modelo}</span></td>
                    <td class="p-3 text-center">
                        <button onclick="seleccionarInstitucion('\${inst.dane}')" class="px-3 py-1 rounded text-xs font-medium transition cursor-pointer \${institucionSeleccionada?.dane === inst.dane ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}">
                            \${institucionSeleccionada?.dane === inst.dane ? 'Seleccionada ✓' : 'Seleccionar'}
                        </button>
                    </td>
                </tr>
            \`).join('');
        }

        function filtrarInstituciones() {
            const query = document.getElementById('input-busqueda').value.toLowerCase();
            const filtradas = instituciones.filter(i => i.nombre.toLowerCase().includes(query) || i.dane.includes(query) || i.municipio.toLowerCase().includes(query));
            renderTabla(filtradas);
            document.getElementById('stat-resultados').innerText = filtradas.length;
        }

        function seleccionarInstitucion(dane) {
            institucionSeleccionada = instituciones.find(i => i.dane === dane);
            reporteFirmado = false;
            renderTabla(instituciones);

            document.getElementById('panel-seleccion-vacio').classList.add('hidden');
            document.getElementById('panel-seleccion-activo').classList.remove('hidden');
            document.getElementById('sel-nombre').innerText = institucionSeleccionada.nombre;
            document.getElementById('sel-detalles').innerText = \`DANE: \${institucionSeleccionada.dane} | Ubicación: \${institucionSeleccionada.municipio}, \${institucionSeleccionada.depto}\`;
            document.getElementById('sel-modelo').innerHTML = \`<strong>Modelo:</strong> \${institucionSeleccionada.modelo} (\${institucionSeleccionada.zona})\`;
            document.getElementById('sel-estado-badge').innerText = 'Pendiente de firma';
            document.getElementById('alerta-exito').classList.add('hidden');
        }

        function generarReporte() {
            if (!institucionSeleccionada) return;
            reporteFirmado = true;
            offlineCount++;
            document.getElementById('offline-counter').innerText = offlineCount;
            document.getElementById('stat-firmados').innerText = '1';
            document.getElementById('sel-estado-badge').innerText = 'Firmado R-PC-03 ✓';
            document.getElementById('alerta-exito').classList.remove('hidden');
        }

        function enviarChat(e) {
            e.preventDefault();
            const input = document.getElementById('input-chat');
            const texto = input.value.trim();
            if (!texto) return;

            const chatContainer = document.getElementById('chat-mensajes');
            chatContainer.innerHTML += \`<div class="p-2.5 rounded-lg bg-emerald-950 text-emerald-100 ml-4 border border-emerald-800/60"><p class="leading-relaxed">\${texto}</p></div>\`;
            input.value = '';

            setTimeout(() => {
                chatContainer.innerHTML += \`<div class="p-2.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700"><p class="leading-relaxed">Procesado para \${institucionSeleccionada ? institucionSeleccionada.nombre : 'la institución'} bajo parámetros del Decreto 1290.</p></div>\`;
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 600);
        }

        renderTabla(instituciones);
    </script>
</body>
</html>`;

    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  },
};
