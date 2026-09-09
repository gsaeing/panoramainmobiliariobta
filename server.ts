import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Load Bogotá market data from backend directory if present
let mercadoData: any = null;
try {
  const mercadoPath = path.join(process.cwd(), "backend", "mercado_bogota.json");
  if (fs.existsSync(mercadoPath)) {
    mercadoData = JSON.parse(fs.readFileSync(mercadoPath, "utf8"));
  }
} catch (e) {
  console.warn("Could not load backend/mercado_bogota.json:", e);
}

// Helpers for valuation & quoting
function sinTildes(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buscarLocalidad(nombre: string) {
  if (!nombre || !mercadoData?.localidades) return null;
  const n = sinTildes(nombre);
  return (
    mercadoData.localidades.find((l: any) => sinTildes(l.nombre) === n) ||
    mercadoData.localidades.find((l: any) => n.includes(sinTildes(l.nombre)) || sinTildes(l.nombre).includes(n)) ||
    null
  );
}

function buscarBarrio(nombre: string) {
  if (!nombre || !mercadoData?.barriosPremium) return null;
  const n = sinTildes(nombre);
  return (
    mercadoData.barriosPremium.find(
      (b: any) => sinTildes(b.nombre).includes(n) || n.includes(sinTildes(b.nombre).split(" ")[0])
    ) || null
  );
}

function ajusteAntiguedad(anios: number): number {
  if (anios <= 5) return 1.0;
  if (anios <= 10) return 0.96;
  if (anios <= 20) return 0.9;
  if (anios <= 30) return 0.84;
  return 0.78;
}

function formatoCOP(n: number): string {
  return Math.round(n).toLocaleString("es-CO");
}

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Healthcheck
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "Panorama Inmobiliario Bogotá",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/salud", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    servicio: "Panorama Inmobiliario BTA",
    puerto: PORT,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    superAdmin: "gerencia@saeing.com",
    contacto: mercadoData?.contactoPanorama || {
      telefono: "+57 301 625 0244",
      web: "https://panoramainmobiliariobta.com",
    },
  });
});

// Mercado dataset
app.get("/api/mercado", (_req: Request, res: Response) => {
  if (mercadoData) {
    res.json(mercadoData);
  } else {
    res.status(404).json({ error: "Datos de mercado no disponibles." });
  }
});

// Cotizar venta
app.post("/api/cotizar/venta", (req: Request, res: Response) => {
  if (!mercadoData) {
    res.status(500).json({ error: "Datos de mercado no inicializados" });
    return;
  }
  const { localidad, barrio, areaM2 = 70, antiguedadAnios = 5, parqueadero = true, tipo = "Apartamento" } = req.body;
  const loc = buscarLocalidad(localidad) || { m2VentaMedio: mercadoData.promedioCiudadM2Venta, nombre: localidad || "Bogotá" };
  const bar = buscarBarrio(barrio || "");
  let m2 = bar ? (bar.m2VentaMin + bar.m2VentaMax) / 2 : loc.m2VentaMedio;
  m2 = m2 * ajusteAntiguedad(Number(antiguedadAnios));
  if (!parqueadero) m2 = m2 * (mercadoData.ajustes?.sinParqueadero || 0.9);
  const valorOferta = m2 * Number(areaM2);
  const valorCierreMin = valorOferta * (1 - (mercadoData.descuentoOfertaVsCierrePct?.max || 11) / 100);
  const valorCierreMax = valorOferta * (1 - (mercadoData.descuentoOfertaVsCierrePct?.min || 6) / 100);
  const comision = valorCierreMax * ((mercadoData.comisiones?.ventaPct || 3) / 100);

  res.json({
    tipo,
    localidad: loc.nombre,
    barrio: barrio || "—",
    areaM2: Number(areaM2),
    m2Usado: Math.round(m2),
    valorOferta: Math.round(valorOferta),
    rangoCierre: [Math.round(valorCierreMin), Math.round(valorCierreMax)],
    comision3pct: Math.round(comision),
    netoEstimado: Math.round(valorCierreMax - comision),
    texto: `Venta estimada $${formatoCOP(valorCierreMax)} (rango $${formatoCOP(valorCierreMin)} - $${formatoCOP(valorCierreMax)})`,
  });
});

// Cotizar arriendo
app.post("/api/cotizar/arriendo", (req: Request, res: Response) => {
  if (!mercadoData) {
    res.status(500).json({ error: "Datos de mercado no inicializados" });
    return;
  }
  const { localidad, barrio, areaM2 = 70, amoblado = false, incluyeAdmin = false } = req.body;
  const loc = buscarLocalidad(localidad) || { m2ArriendoMedio: mercadoData.promedioCiudadM2Arriendo, nombre: localidad || "Bogotá" };
  const bar = buscarBarrio(barrio || "");
  let m2 = bar ? (bar.m2ArriendoMin + bar.m2ArriendoMax) / 2 : loc.m2ArriendoMedio;
  if (amoblado) m2 = m2 * 1.25;
  const canon = m2 * Number(areaM2);
  const adminMensual = incluyeAdmin ? 0 : canon * 0.08;
  const seguro = canon * ((mercadoData.comisiones?.seguroArriendoPctCanon || 3.5) / 100);

  res.json({
    localidad: loc.nombre,
    barrio: barrio || "—",
    canonMensual: Math.round(canon),
    administracionRef: Math.round(adminMensual),
    seguroArriendo: Math.round(seguro),
    totalConSeguro: Math.round(canon + seguro),
    texto: `Arriendo estimado $${formatoCOP(canon)} al mes`,
  });
});

// Cotizar administración
app.post("/api/cotizar/administracion", (req: Request, res: Response) => {
  const { canonMensual = 2500000 } = req.body;
  const c = Number(canonMensual);
  const tarifaAdminPct = mercadoData?.comisiones?.administracionMensualPct || 10.0;
  const fee = c * (tarifaAdminPct / 100);
  const seguroPct = mercadoData?.comisiones?.seguroArriendoPctCanon || 3.5;
  const seguro = c * (seguroPct / 100);

  res.json({
    canon: c,
    tarifaAdminPct,
    valorAdmin: Math.round(fee),
    seguro: Math.round(seguro),
    giroAlPropietario: Math.round(c - fee),
    texto: `Administración $${formatoCOP(fee)}/mes, le giran $${formatoCOP(c - fee)}`,
  });
});

// Avalúo comercial y catastral
app.post("/api/avaluo", (req: Request, res: Response) => {
  if (!mercadoData) {
    res.status(500).json({ error: "Datos de mercado no inicializados" });
    return;
  }
  const { localidad, barrio, areaM2 = 80, antiguedadAnios = 8, parqueadero = true } = req.body;
  const loc = buscarLocalidad(localidad) || {
    m2VentaMedio: mercadoData.promedioCiudadM2Venta,
    m2ArriendoMedio: mercadoData.promedioCiudadM2Arriendo,
    nombre: localidad || "Bogotá",
  };
  const bar = buscarBarrio(barrio || "");
  let m2v = bar ? (bar.m2VentaMin + bar.m2VentaMax) / 2 : loc.m2VentaMedio;
  let m2a = bar ? (bar.m2ArriendoMin + bar.m2ArriendoMax) / 2 : loc.m2ArriendoMedio;
  const aj = ajusteAntiguedad(Number(antiguedadAnios));
  m2v = m2v * aj * (parqueadero ? 1 : mercadoData.ajustes?.sinParqueadero || 0.9);
  const comercial = m2v * Number(areaM2);
  const catastral = comercial * (mercadoData.factorCatastralSobreComercial || 0.65);
  const arriendoAnual = m2a * Number(areaM2) * 12;
  const capRateBruto = (arriendoAnual / comercial) * 100;
  const capRateNeto = capRateBruto * 0.78;
  const consejo = capRateNeto < 4 ? "Conviene evaluar VENTA (rentabilidad baja)." : "Conviene MANTENER y arrendar (rentabilidad sana).";

  res.json({
    localidad: loc.nombre,
    m2Comercial: Math.round(m2v),
    valorComercial: Math.round(comercial),
    valorCatastral: Math.round(catastral),
    arriendoAnualEstimado: Math.round(arriendoAnual),
    capRateBrutoPct: Number(capRateBruto.toFixed(2)),
    capRateNetoPct: Number(capRateNeto.toFixed(2)),
    consejo,
    costoAvaluoRef: mercadoData.costoAvaluoResidencial,
    validez: "Informe de referencia analítica, no reemplaza avalúo certificado de Lonja.",
  });
});

// Gemini Market Advisor endpoint
app.post("/api/gemini/advisor", async (req: Request, res: Response) => {
  try {
    const { message, zoneContext, propertyContext, conversationHistory } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "El mensaje es requerido." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "GEMINI_API_KEY no configurada. Por favor agregue la clave en Settings > Secrets.",
      });
      return;
    }

    const systemInstruction = `Eres el asesor experto en análisis e inteligencia de mercado inmobiliario de "Panorama Inmobiliario Bogotá".
Tu objetivo es asesorar con precisión técnica, financiera y urbana a compradores, inversionistas y desarrolladores en Bogotá, Colombia.

Conocimientos clave que dominas:
1. Localidades y microzonas: Usaquén (Cedritos, Santa Bárbara, San Patricio, Santa Ana), Chapinero (Rosales, Chicó, Virrey, Parque 93, Chapinero Alto, Quinta Camacho), Suba (Colina Campestre, Pontevedra, Niza), Teusaquillo (Ciudad Salitre Oriental, La Soledad, Galerías), Fontibón (Ciudad Salitre Occidental, Modelia), Barrios Unidos (Castellana, Polo Club), Santa Fe (Centro Internacional, Candelaria).
2. Estratificación socioeconómica (Estratos 3, 4, 5 y 6) e impacto en servicios públicos, valorización y perfil de arrendatario.
3. Finanzas inmobiliarias en Colombia:
   - Cap Rates promedio Bogotá: 6.0% a 8.9% anual bruto (arriendo tradicional 5.5%-7.0%, renta corta turística/Airbnb 8%-11% en Chapinero/Chicó/Centro).
   - Crédito hipotecario (hasta 70% LTV) vs Leasing habitacional (hasta 80%-85% LTV), tasas vigentes ~11%-13% E.A.
   - Costos de cierre: Gastos de notaría (~0.54% compartido), beneficencia y registro (~1.67%), estudio de títulos, retención en la fuente (1% sobre la venta).
   - Administración de propiedad horizontal y tasa de vacancia estimada (~5% a 8%).
   - Ley 820 de 2003 (régimen de arrendamiento de vivienda urbana, tope de reajuste anual por IPC).
   - Factores de plusvalía: Primera y segunda línea del Metro de Bogotá, Regiotram de Occidente, troncales alimentadoras y renovación urbana bajo el POT.

Instrucciones de formato y tono:
- Sé conciso, profesional, analítico y directo.
- Si el usuario pregunta por cifras, usa Pesos Colombianos (COP) en formato legible (ej: $450M COP o $6.800.000 COP/m²) y porcentajes claros.
- Proporciona pros, contras y cálculos rápidos cuando sea pertinente.
- Estructura tus respuestas con viñetas claras y encabezados legibles.`;

    let contextPrompt = "";
    if (zoneContext) {
      contextPrompt += `\n[Contexto de zona seleccionada: ${JSON.stringify(zoneContext)}]\n`;
    }
    if (propertyContext) {
      contextPrompt += `\n[Contexto de propiedad consultada: ${JSON.stringify(propertyContext)}]\n`;
    }

    // Build chat or prompt
    const contents: any[] = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      // Limit to last 6 messages
      const recent = conversationHistory.slice(-6);
      for (const item of recent) {
        contents.push({
          role: item.role === "assistant" ? "model" : "user",
          parts: [{ text: item.content }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: `${contextPrompt}${message}` }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "No se pudo generar respuesta en este momento.";

    res.json({
      reply: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error en /api/gemini/advisor:", err);
    res.status(500).json({
      error: "Error procesando la consulta inmobiliaria.",
      details: err?.message || String(err),
    });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Panorama Inmobiliario Bogotá server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
