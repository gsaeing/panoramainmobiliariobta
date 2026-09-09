/**
 * Cerebro de la pantalla Panorama.
 * Explica: pide entrar con Google, guarda la sesion y llama al servidor a cotizar.
 */
let usuarioActual = null;

function cabeceras() {
  // Explica: manda tu correo Google al servidor para que te deje pasar.
  return { 'Content-Type': 'application/json', 'x-user-email': usuarioActual?.email || '', 'x-user-name': usuarioActual?.nombre || '' };
}
function mostrar(obj, id) { document.getElementById(id).textContent = JSON.stringify(obj, null, 2); }

// Cambia de pestaña (venta, arriendo, etc).
document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('nav button').forEach(x => x.classList.remove('activo'));
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('activo'));
  b.classList.add('activo');
  document.getElementById('tab-' + b.dataset.tab).classList.add('activo');
});

async function llamar(ruta, datos) {
  // Explica: habla con el servidor y trae el resultado.
  const r = await fetch(ruta, { method: 'POST', headers: cabeceras(), body: JSON.stringify(datos || {}) });
  if (r.status === 401) throw new Error('Sin sesión. Entra con Google.');
  return r.json();
}
async function cotizarVenta() {
  try {
    const d = { localidad: val('v-localidad'), barrio: val('v-barrio'), areaM2: num('v-area'), antiguedadAnios: num('v-antig'), parqueadero: document.getElementById('v-parq').checked };
    mostrar(await llamar('/api/cotizar/venta', d), 'v-salida');
  } catch (e) { mostrar({ error: e.message }, 'v-salida'); }
}
async function cotizarArriendo() {
  try {
    const d = { localidad: val('a-localidad'), barrio: val('a-barrio'), areaM2: num('a-area'), amoblado: document.getElementById('a-amob').checked };
    mostrar(await llamar('/api/cotizar/arriendo', d), 'a-salida');
  } catch (e) { mostrar({ error: e.message }, 'a-salida'); }
}
async function cotizarAdmin() {
  try { mostrar(await llamar('/api/cotizar/administracion', { canonMensual: num('d-canon') }), 'd-salida'); }
  catch (e) { mostrar({ error: e.message }, 'd-salida'); }
}
async function pedirAvaluo() {
  try {
    const d = { localidad: val('c-localidad'), barrio: val('c-barrio'), areaM2: num('c-area'), antiguedadAnios: num('c-antig') };
    mostrar(await llamar('/api/avaluo', d), 'c-salida');
  } catch (e) { mostrar({ error: e.message }, 'c-salida'); }
}
async function pedirAvaluoDireccion() {
  // Explica: manda la dirección exacta y muestra el avalúo comercial del mercado.
  try {
    const d = { direccion: val('x-direccion'), areaM2: num('x-area'), antiguedadAnios: num('x-antig'), parqueadero: document.getElementById('x-parq').checked };
    mostrar(await llamar('/api/avaluo/direccion', d), 'x-salida');
  } catch (e) { mostrar({ error: e.message }, 'x-salida'); }
}
async function verMercado() {
  // Explica: muestra la tabla de precios base.
  const r = await fetch('/api/mercado'); mostrar(await r.json(), 'm-salida');
}
function val(id) { return document.getElementById(id).value; }
function num(id) { return Number(document.getElementById(id).value) || 0; }

// Entrada obligatoria con Google.
let auth = null;
if (!MODO_PRUEBA_SIN_FIREBASE) {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
}
document.getElementById('btn-google').onclick = async () => {
  // Explica: boton que abre la ventana de Google.
  const msg = document.getElementById('msg-login');
  try {
    if (MODO_PRUEBA_SIN_FIREBASE) {
      const correo = prompt('Modo prueba: escribe tu correo Google (usa gerencia@saeing.com para ser jefe):', 'gerencia@saeing.com');
      if (!correo || !correo.includes('@')) { msg.textContent = 'Escribe un correo válido.'; return; }
      entrar({ email: correo.toLowerCase().trim(), nombre: correo.split('@')[0] });
      return;
    }
    const prov = new firebase.auth.GoogleAuthProvider();
    const r = await auth.signInWithPopup(prov);
    entrar({ email: (r.user.email || '').toLowerCase(), nombre: r.user.displayName || '' });
  } catch (e) { msg.textContent = 'No se pudo entrar: ' + e.message; }
};
if (auth) auth.onAuthStateChanged(u => { if (u) entrar({ email: (u.email || '').toLowerCase(), nombre: u.displayName || '' }); });
document.getElementById('btn-salir').onclick = async () => {
  // Explica: cierra la sesion y vuelve al login.
  if (auth) await auth.signOut();
  usuarioActual = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('pantalla-login').style.display = 'flex';
};
function entrar(u) {
  // Explica: si entraste con Google, esconde el login y muestra la app.
  usuarioActual = u;
  document.getElementById('pantalla-login').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  const esJefe = u.email === SUPER_ADMIN_EMAIL;
  document.getElementById('quien').textContent = u.email + (esJefe ? ' · JEFE' : '');
}
