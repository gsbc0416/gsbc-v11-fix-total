// GSBC V11 - Sistema Nacional Real con Roles
import { guardarConInternet, sincronizarPendientes } from './src/lib/idb.js';

const USUARIOS_KEY = 'usuario_gsbc';

function initUsuarios(){
  const usuario = JSON.parse(localStorage.getItem(USUARIOS_KEY)||'null');
  const loginScreen = document.getElementById('login-screen');
  const header = document.getElementById('app-header');
  
  if(!usuario && loginScreen){
    loginScreen.style.display='flex';
    if(header) header.style.display='none';
    return false;
  }
  if(usuario && loginScreen) loginScreen.style.display='none';
  if(usuario && header){
    header.style.display='flex';
    header.innerHTML = `<b>Usuario: ${usuario.nombre_real} - Rol: ${usuario.rol} - ${usuario.municipio_real}, ${usuario.departamento_real}</b> <button onclick="cerrarSesion()">Cerrar Sesion</button>`;
    let color = '#0b5fff';
    if(usuario.rol==='Rector') color='#3b82f6';
    if(usuario.rol==='Admin') color='#1e3a8a';
    header.style.borderLeft=`8px solid ${color}`;
    header.style.padding='10px';
    header.style.background='#eee';
    document.body.dataset.rol = usuario.rol;
  }
  return true;
}

window.cerrarSesion = () => { localStorage.removeItem(USUARIOS_KEY); location.reload(); };

document.addEventListener('DOMContentLoaded', ()=>{
  initUsuarios();
  const btn = document.getElementById('btnEntrar');
  if(btn){
    btn.addEventListener('click', async ()=>{
      const u = {
        nombre_real: document.getElementById('nombre_real').value.trim(),
        rol: document.getElementById('rol').value,
        departamento_real: document.getElementById('departamento_real').value,
        municipio_real: document.getElementById('municipio_real').value,
        fecha_login: new Date().toISOString()
      };
      if(!u.nombre_real) return alert('Escribe tu nombre real');
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(u));
      await guardarConInternet('usuarios', u);
      location.reload();
    });
  }
  window.addEventListener('online', sincronizarPendientes);
  console.log('GSBC V11 listo - Valledupar Cesar - Nacional Real Offline-First');
});

// TRAZA-RIO C->N->R->S->F->A->I->E
window.generarReporte = async (tipo) => {
  const usuario = JSON.parse(localStorage.getItem(USUARIOS_KEY));
  if(!usuario) return alert('Inicia sesion');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(`${tipo} - ${usuario.municipio_real}, ${usuario.departamento_real}`, 10, 10);
  doc.text(`Usuario: ${usuario.nombre_real} Rol: ${usuario.rol}`, 10, 20);
  doc.text(`Contexto territorial real: ${usuario.departamento_real} - ${usuario.municipio_real}`, 10, 30);
  doc.text(`Borrador - Requiere aprobacion docente R-PC-03`, 10, 40);
  doc.text(`TRAZA-RIO: C->N->R->S->F->A->I->E`, 10, 50);
  doc.text(`Pendiente de firma`, 10, 60);
  doc.save(`${tipo}_${usuario.municipio_real}.pdf`);
  await guardarConInternet('pendientes_sync', {tipo, usuario, estado:'Pendiente de firma'});
};