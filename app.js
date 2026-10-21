// GSBC V11 FIX TOTAL - Valledupar Cesar - SIN IMPORTS EXTERNOS
const DB_NAME = 'gsbc-nacional-v11';
const KEY_USUARIO = 'usuario_gsbc';

function abrirDB(){
  return new Promise((res,rej)=>{
    const r = indexedDB.open(DB_NAME,1);
    r.onupgradeneeded = e => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains('pendientes')) db.createObjectStore('pendientes',{keyPath:'id',autoIncrement:true});
      if(!db.objectStoreNames.contains('usuarios')) db.createObjectStore('usuarios',{keyPath:'nombre_real'});
    };
    r.onsuccess = ()=> res(r.result);
    r.onerror = ()=> rej(r.error);
  });
}

function init(){
  const u = JSON.parse(localStorage.getItem(KEY_USUARIO)||'null');
  const login = document.getElementById('login-screen');
  const header = document.getElementById('app-header');
  if(!u){ if(login) login.style.display='flex'; if(header) header.style.display='none'; return; }
  if(login) login.style.display='none';
  if(header){
    header.style.display='flex';
    header.style.justifyContent='space-between';
    header.style.padding='10px';
    header.style.background='#eef2ff';
    const color = u.rol==='Docente'?'#0b5fff':u.rol==='Rector'?'#3b82f6':'#1e3a8a';
    header.style.borderLeft=`8px solid ${color}`;
    header.innerHTML=`<b>Usuario: ${u.nombre_real} - ${u.rol} - ${u.municipio_real}, ${u.departamento_real}</b><button onclick="localStorage.clear();location.reload()">Salir</button>`;
  }
  document.body.dataset.rol=u.rol;
}

document.addEventListener('DOMContentLoaded', ()=>{
  init();
  document.getElementById('btnEntrar')?.addEventListener('click', async ()=>{
    const nombre = document.getElementById('nombre_real').value.trim();
    if(!nombre) return alert('Escribe nombre real');
    const usuario = {nombre_real:nombre, rol:document.getElementById('rol').value, departamento_real:'Cesar', municipio_real:'Valledupar', fecha:new Date().toISOString()};
    localStorage.setItem(KEY_USUARIO, JSON.stringify(usuario));
    const db = await abrirDB();
    db.transaction('usuarios','readwrite').objectStore('usuarios').put(usuario);
    location.reload();
  });
});

window.generarReporte = (tipo)=>{
  const u = JSON.parse(localStorage.getItem(KEY_USUARIO));
  if(!u) return alert('Inicia sesion primero');
  alert(`${tipo} generado para ${u.nombre_real} - ${u.municipio_real} - Pendiente de firma R-PC-03 - TRAZA-RIO C->N->R->S->F->A->I->E`);
};