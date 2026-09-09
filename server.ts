import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
