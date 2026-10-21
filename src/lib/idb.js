import { openDB } from 'https://esm.sh/idb@8';

export const dbPromise = openDB('gsbc-nacional-v11', 1, {
  upgrade(db){
    db.createObjectStore('pendientes_sync', {keyPath:'id', autoIncrement:true});
    db.createObjectStore('usuarios', {keyPath:'nombre_real'});
    db.createObjectStore('estudiantes', {keyPath:'id'});
    db.createObjectStore('due', {keyPath:'DANE'});
  }
});

export async function guardarConInternet(tabla, dato){
  if(navigator.onLine){
    try{
      await fetch('/api/sync',{method:'POST', body:JSON.stringify({tabla,dato})});
      const db = await dbPromise;
      await db.put(tabla, dato);
      return {ok:true, modo:'online'};
    }catch(e){}
  }
  const db = await dbPromise;
  await db.add('pendientes_sync', {tabla, dato, fecha:new Date().toISOString(), estado:'Pendiente de firma R-PC-03'});
  return {ok:true, modo:'offline'};
}

export async function sincronizarPendientes(){
  if(!navigator.onLine) return;
  const db = await dbPromise;
  const pendientes = await db.getAll('pendientes_sync');
  for(const p of pendientes){
    await fetch('/api/sync',{method:'POST', body:JSON.stringify(p)});
    await db.delete('pendientes_sync', p.id);
  }
  return `${pendientes.length} colegios actualizados - ${pendientes.length} reportes guardados`;
}