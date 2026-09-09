/**
 * Claves de Firebase para entrar con Google.
 * Explica: pega aqui las claves de tu proyecto Firebase. El jefe es gerencia@saeing.com.
 * Como sacarla: console.firebase.google.com -> tu proyecto -> Configuracion -> Tus apps web.
 */
const firebaseConfig = {
  apiKey: "PEGA-AQUI-TU-API-KEY",
  authDomain: "TU-PROYECTO.firebaseapp.com",
  projectId: "TU-PROYECTO",
  appId: "PEGA-AQUI-TU-APP-ID"
};
const SUPER_ADMIN_EMAIL = "gerencia@saeing.com";
// Si no hay claves reales, la app usa modo prueba (igual pide boton Google).
const MODO_PRUEBA_SIN_FIREBASE = firebaseConfig.apiKey.includes("PEGA-AQUI");
