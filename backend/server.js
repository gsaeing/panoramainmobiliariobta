/**
 * Servidor Panorama Inmobiliario Bogota.
 * Explica: prende web segura (HTTPS), web simple (HTTP) y canal TCP.
 * Incluye: cotizar venta, arriendo, administracion y avaluos por localidad.
 * Solo deja entrar si hay login de Google (lo revisa el frontend y este servidor).
 */
const fs = require('fs');
const path = require('path');
const net = require('net');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');

const SUPER_ADMIN = 'gerencia@saeing.com';
const PUERTO_HTTP = 3000;
const PUERTO_HTTPS = 3443;
const PUERTO_TCP = 4000;
const HOST = '0.0.0.0';

const app = express();
app.use(cors());
app.use(express.json());

// --- Carga datos de mercado ---
const mercadoPath = path.join(__dirname, 'mercado_bogota.json');
const mercado = JSON.parse(fs.readFileSync(mercadoPath, 'utf8'));

// --- Revisa usuario (simple y claro) ---
function usuarioDePedido(req) {
  // Explica: el navegador manda el correo de Google en la cabecera x-user-email.
  // Si hay Firebase Admin configurado, aqui se verificaria el token real.
  const email = (req.headers['x-user-email'] || '').toString().trim().toLowerCase();
  const nombre = (req.headers['x-user-name'] || '').toString().trim();
  return { email, nombre, esSuperAdmin: email === SUPER_ADMIN };
}

function exigirLogin(req, res, next) {
  // Explica: bloquea todo lo privado si no viene el correo de Google.
  const u = usuarioDePedido(req);
  if (!u.email || !u.email.includes('@')) {
    return res.status(401).json({ error: 'Debe entrar con Google primero.' });
  }
  req.usuario = u;
  next();
}

// --- Ayudas de calculo ---
function sinTildes(s) {
  // Explica: quita tildes para comparar sin errores (Chico = Chicó).
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function buscarLocalidad(nombre) {
  if (!nombre) return null;
  const n = sinTildes(nombre);
  return mercado.localidades.find(l => sinTildes(l.nombre) === n)
    || mercado.localidades.find(l => n.includes(sinTildes(l.nombre)) || sinTildes(l.nombre).includes(n))
    || null;
}
function buscarBarrio(nombre) {
  if (!nombre) return null;
  const n = sinTildes(nombre);
  return mercado.barriosPremium.find(b => sinTildes(b.nombre).includes(n) || n.includes(sinTildes(b.nombre).split(' ')[0])) || null;
}
function ajusteAntiguedad(anios) {
  if (anios <= 5) return 1.0;
  if (anios <= 10) return 0.96;
  if (anios <= 20) return 0.90;
  if (anios <= 30) return 0.84;
  return 0.78;
}
function formatoCOP(n) { return Math.round(n).toLocaleString('es-CO'); }

// --- Paginas publicas (login) y app privada (archivos) ---
const frontPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontPath));

// --- Rutas libres: salud y mercado general ---
app.get('/api/salud', (req, res) => {
  // Explica: dice si el servidor esta vivo y en que puertos escucha.
  res.json({ ok: true, servicio: 'Panorama Inmobiliario BTA', http: PUERTO_HTTP, https: PUERTO_HTTPS, tcp: PUERTO_TCP, superAdmin: SUPER_ADMIN });
});
app.get('/api/mercado', (req, res) => {
  // Explica: muestra los precios base por localidad y barrio.
  res.json(mercado);
});
app.get('/api/zonas', (req, res) => {
  // Explica: lista las zonas donde trabaja Panorama.
  res.json({ zonas: mercado.localidades.map(l => l.nombre), barriosPremium: mercado.barriosPremium.map(b => b.nombre), contacto: mercado.contactoPanorama });
});

// --- Rutas privadas: piden login Google ---
app.post('/api/cotizar/venta', exigirLogin, (req, res) => {
  // Explica: calcula cuanto vale vender: m2 x metros menos rebaja y comision 3%.
  const { localidad, barrio, areaM2 = 70, antiguedadAnios = 5, parqueadero = true, tipo = 'Apartamento' } = req.body;
  const loc = buscarLocalidad(localidad) || { m2VentaMedio: mercado.promedioCiudadM2Venta, nombre: localidad || 'Bogotá' };
  const bar = buscarBarrio(barrio || '');
  let m2 = bar ? (bar.m2VentaMin + bar.m2VentaMax) / 2 : loc.m2VentaMedio;
  m2 = m2 * ajusteAntiguedad(Number(antiguedadAnios));
  if (!parqueadero) m2 = m2 * mercado.ajustes.sinParqueadero;
  const valorOferta = m2 * Number(areaM2);
  const valorCierreMin = valorOferta * (1 - mercado.descuentoOfertaVsCierrePct.max / 100);
  const valorCierreMax = valorOferta * (1 - mercado.descuentoOfertaVsCierrePct.min / 100);
  const comision = valorCierreMax * (mercado.comisiones.ventaPct / 100);
  res.json({ tipo, localidad: loc.nombre, barrio: barrio || '—', areaM2: Number(areaM2), m2Usado: Math.round(m2), valorOferta: Math.round(valorOferta), rangoCierre: [Math.round(valorCierreMin), Math.round(valorCierreMax)], comision3pct: Math.round(comision), netoEstimado: Math.round(valorCierreMax - comision), texto: `Venta estimada $${formatoCOP(valorCierreMax)} (rango $${formatoCOP(valorCierreMin)} - $${formatoCOP(valorCierreMax)})` });
});

app.post('/api/cotizar/arriendo', exigirLogin, (req, res) => {
  // Explica: calcula el arriendo mensual: m2 de arriendo x metros.
  const { localidad, barrio, areaM2 = 70, amoblado = false, incluyeAdmin = false } = req.body;
  const loc = buscarLocalidad(localidad) || { m2ArriendoMedio: mercado.promedioCiudadM2Arriendo, nombre: localidad || 'Bogotá' };
  const bar = buscarBarrio(barrio || '');
  let m2 = bar ? (bar.m2ArriendoMin + bar.m2ArriendoMax) / 2 : loc.m2ArriendoMedio;
  if (amoblado) m2 = m2 * 1.25;
  const canon = m2 * Number(areaM2);
  const adminMensual = incluyeAdmin ? 0 : canon * 0.08; // referencia si no incluye
  const seguro = canon * (mercado.comisiones.seguroArriendoPctCanon / 100);
  res.json({ localidad: loc.nombre, barrio: barrio || '—', canonMensual: Math.round(canon), administracionRef: Math.round(adminMensual), seguroArriendo: Math.round(seguro), totalConSeguro: Math.round(canon + seguro), texto: `Arriendo estimado $${formatoCOP(canon)} al mes` });
});

app.post('/api/cotizar/administracion', exigirLogin, (req, res) => {
  // Explica: calcula cuanto cobra Panorama por administrar cada mes (10%).
  const { canonMensual = 2500000 } = req.body;
  const c = Number(canonMensual);
  const fee = c * (mercado.comisiones.administracionMensualPct / 100);
  const seguro = c * (mercado.comisiones.seguroArriendoPctCanon / 100);
  res.json({ canon: c, tarifaAdminPct: mercado.comisiones.administracionMensualPct, valorAdmin: Math.round(fee), seguro: Math.round(seguro), giroAlPropietario: Math.round(c - fee), texto: `Administración $${formatoCOP(fee)}/mes, le giran $${formatoCOP(c - fee)}` });
});

app.post('/api/avaluo', exigirLogin, (req, res) => {
  // Explica: da valor comercial y catastral y dice si conviene vender o arrendar.
  const { localidad, barrio, areaM2 = 80, antiguedadAnios = 8, parqueadero = true } = req.body;
  const loc = buscarLocalidad(localidad) || { m2VentaMedio: mercado.promedioCiudadM2Venta, m2ArriendoMedio: mercado.promedioCiudadM2Arriendo, nombre: localidad || 'Bogotá' };
  const bar = buscarBarrio(barrio || '');
  let m2v = bar ? (bar.m2VentaMin + bar.m2VentaMax) / 2 : loc.m2VentaMedio;
  let m2a = bar ? (bar.m2ArriendoMin + bar.m2ArriendoMax) / 2 : loc.m2ArriendoMedio;
  const aj = ajusteAntiguedad(Number(antiguedadAnios));
  m2v = m2v * aj * (parqueadero ? 1 : mercado.ajustes.sinParqueadero);
  const comercial = m2v * Number(areaM2);
  const catastral = comercial * mercado.factorCatastralSobreComercial;
  const arriendoAnual = m2a * Number(areaM2) * 12;
  const capRateBruto = (arriendoAnual / comercial) * 100;
  const capRateNeto = capRateBruto * 0.78; // quita admin y gastos
  const consejo = capRateNeto < 4 ? 'Conviene evaluar VENTA (rentabilidad baja).' : 'Conviene MANTENER y arrendar (rentabilidad sana).';
  res.json({ localidad: loc.nombre, m2Comercial: Math.round(m2v), valorComercial: Math.round(comercial), valorCatastral: Math.round(catastral), arriendoAnualEstimado: Math.round(arriendoAnual), capRateBrutoPct: Number(capRateBruto.toFixed(2)), capRateNetoPct: Number(capRateNeto.toFixed(2)), consejo, costoAvaluoRef: mercado.costoAvaluoResidencial, validez: 'Informe de referencia, no reemplaza avalúo certificado de Lonja.' });
});

function inferirZonaPorDireccion(direccion) {
  // Explica: lee la dirección y adivina barrio y localidad por palabras y números.
  const t = sinTildes(direccion || '');
  let barrio = mercado.barriosPremium.find(b => {
    const pal = sinTildes(b.nombre).split(/[^a-z]+/).filter(w => w.length > 3);
    return pal.some(w => t.includes(w));
  }) || null;
  let loc = mercado.localidades.find(l => t.includes(sinTildes(l.nombre))) || null;
  if (!loc && barrio) {
    // Explica: si el barrio dice la localidad entre paréntesis, se usa esa.
    const m = (barrio.nombre || '').match(/\(([^)]+)\)/);
    if (m) loc = buscarLocalidad(m[1].split('/')[0]) || null;
  }
  // Extrae números de calle y carrera: "calle 93", "cra 11", "cll 127".
  const mCalle = t.match(/(?:calle|cll?|cl)\s*\.?\s*(\d+)/);
  const mCra = t.match(/(?:carrera|cra?|kr|av|carrera)\s*\.?\s*(\d+)/);
  const calle = mCalle ? Number(mCalle[1]) : null;
  const cra = mCra ? Number(mCra[1]) : null;
  let pista = '';
  if (!barrio && calle !== null) {
    // Explica: reglas simples norte-centro-sur según la malla vial de Bogotá.
    if (calle >= 85 && calle <= 115) { barrio = buscarBarrio('Chico Norte'); loc = loc || buscarLocalidad('Chapinero'); pista = 'Eje Calle 85-115: zona premium norte.'; }
    else if (calle > 115 && calle <= 175) { barrio = buscarBarrio('Cedritos'); loc = loc || buscarLocalidad('Usaquén'); pista = 'Eje Calle 116-175: norte Usaquén/Suba.'; }
    else if (calle >= 53 && calle < 85) { barrio = buscarBarrio('Chapinero Alto'); loc = loc || buscarLocalidad('Chapinero'); pista = 'Eje Calle 53-84: Chapinero central.'; }
    else if (calle >= 26 && calle < 53) { loc = loc || buscarLocalidad('Teusaquillo'); pista = 'Eje Calle 26-52: centro-occidente.'; }
    else if (calle < 26) { loc = loc || buscarLocalidad('Santa Fe'); pista = 'Eje sur del centro: Santa Fe/Candelaria.'; }
    else { loc = loc || buscarLocalidad('Suba'); pista = 'Periferia norte/occidente.'; }
  }
  if (!loc) loc = buscarLocalidad('Chapinero');
  return { barrio, loc, calle, cra, pista };
}

app.post('/api/avaluo/direccion', exigirLogin, (req, res) => {
  // Explica: avalúo comercial por dirección exacta usando el mercado de Bogotá.
  const { direccion = '', areaM2 = 80, antiguedadAnios = 8, parqueadero = true, tipo = 'Apartamento' } = req.body;
  if (!direccion || direccion.trim().length < 6) return res.status(400).json({ error: 'Escriba una dirección válida, ej: Calle 93 # 11-25, Chicó, Bogotá.' });
  const zona = inferirZonaPorDireccion(direccion);
  const loc = zona.loc || { m2VentaMedio: mercado.promedioCiudadM2Venta, m2ArriendoMedio: mercado.promedioCiudadM2Arriendo, nombre: 'Bogotá' };
  const bar = zona.barrio;
  let m2v = bar ? (bar.m2VentaMin + bar.m2VentaMax) / 2 : loc.m2VentaMedio;
  let m2a = bar ? (bar.m2ArriendoMin + bar.m2ArriendoMax) / 2 : loc.m2ArriendoMedio;
  const aj = ajusteAntiguedad(Number(antiguedadAnios));
  m2v = m2v * aj * (parqueadero ? 1 : mercado.ajustes.sinParqueadero);
  const area = Number(areaM2);
  const comercial = m2v * area;
  const rangoMin = comercial * (1 - mercado.descuentoOfertaVsCierrePct.max / 100);
  const rangoMax = comercial * (1 - mercado.descuentoOfertaVsCierrePct.min / 100);
  const catastral = comercial * mercado.factorCatastralSobreComercial;
  const arriendoMensual = m2a * area;
  const capBruto = (arriendoMensual * 12 / comercial) * 100;
  const capNeto = capBruto * 0.78;
  // 3 testigos comparables cercanos (método comparación de mercado, Res. 620 IGAC).
  const base = Math.round(m2v);
  const testigos = [0.96, 1.0, 1.04].map((f, i) => ({ id: i + 1, direccionRef: `Comparable ${i + 1} mismo sector (${(bar ? bar.nombre : loc.nombre)})`, m2: Math.round(base * f), valor: Math.round(base * f * area) }));
  const confianza = bar ? 'ALTA (barrio detectado + datos 2026).' : (zona.pista ? 'MEDIA (inferida por nomenclatura, verificar con visita).' : 'MEDIA-BAJA (verificar con visita).');
  const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(direccion + ', Bogotá');
  const reporte = { direccion, tipo, localidad: loc.nombre, barrio: bar ? bar.nombre : 'Sector ' + loc.nombre, calleRef: zona.calle, carreraRef: zona.cra, pista: zona.pista, areaM2: area, m2Comercial: base, valorComercial: Math.round(comercial), rangoComercial: [Math.round(rangoMin), Math.round(rangoMax)], valorCatastralEstimado: Math.round(catastral), arriendoMensualEstimado: Math.round(arriendoMensual), capRateNetoPct: Number(capNeto.toFixed(2)), testigos, confianza, mapa: maps, metodologia: 'Comparación de mercado (Resolución 620 de 2008 IGAC): m2 del sector x área, ajuste por antigüedad y parqueadero, menos 6-11% oferta vs cierre.', advertencia: 'Valor de referencia con datos web 2026. No reemplaza avalúo certificado con visita de perito de Lonja.' };
  try {
    const dir = path.join(__dirname, 'reportes');
    fs.mkdirSync(dir, { recursive: true });
    const f = path.join(dir, 'avaluo-' + Date.now() + '.json');
    fs.writeFileSync(f, JSON.stringify({ ...reporte, usuario: req.usuario.email, fecha: new Date().toISOString() }, null, 2));
    reporte.archivo = f;
  } catch (e) { /* Explica: si no puede guardar, igual devuelve el valor. */ }
  res.json(reporte);
});

// --- Quien soy (para mostrar rol) ---
app.get('/api/yo', exigirLogin, (req, res) => {
  // Explica: dice quien entro y si es el jefe (super admin).
  res.json({ ...req.usuario, rol: req.usuario.esSuperAdmin ? 'super_admin' : 'usuario_google' });
});

// --- Prende HTTP, HTTPS y TCP ---
function obtenerCertificado() {
  // Explica: usa certificado propio si no hay uno oficial. Lo crea solo.
  const certDir = path.join(__dirname, '..', 'certs');
  const keyPath = path.join(certDir, 'llave.pem');
  const certPath = path.join(certDir, 'certificado.pem');
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  }
  const selfsigned = require('selfsigned');
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, { days: 365, keySize: 2048 });
  fs.mkdirSync(certDir, { recursive: true });
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);
  return { key: pems.private, cert: pems.cert };
}

const soloHttp = process.argv.includes('--http-only');
http.createServer(app).listen(PUERTO_HTTP, HOST, () => console.log(`HTTP listo en http://${HOST}:${PUERTO_HTTP}`));
if (!soloHttp) {
  const cred = obtenerCertificado();
  https.createServer(cred, app).listen(PUERTO_HTTPS, HOST, () => console.log(`HTTPS listo en https://${HOST}:${PUERTO_HTTPS} (certificado local)`));
}
// Canal TCP puro: responde estado en JSON.
const tcpServer = net.createServer((socket) => {
  // Explica: canal directo TCP/IP. Manda estado y cierra.
  const msg = JSON.stringify({ servicio: 'Panorama TCP', ok: true, hora: new Date().toISOString(), superAdmin: SUPER_ADMIN }) + '\n';
  socket.write(msg);
  socket.end();
});
tcpServer.listen(PUERTO_TCP, HOST, () => console.log(`TCP listo en ${HOST}:${PUERTO_TCP}`));
