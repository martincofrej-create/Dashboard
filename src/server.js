const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON bodies
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check endpoint (required by Cloud Run)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Gemini AI Chat Proxy ───────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      reply: '⚠️ El asistente IA no está configurado. Agrega la variable de entorno GEMINI_API_KEY en Cloud Run.'
    });
  }

  const systemContext = `Eres el asistente de IA del Dashboard de Control Digital de Klassik Car, un concesionario automotriz en Chile que vende Hyundai, Kia, Suzuki y Changan.

Tu rol es ayudar a gerentes, vendedores y colaboradores a entender y aprovechar el dashboard. Responde siempre en español, de forma concisa y práctica.

Contexto del negocio:
- Presupuesto anual de marketing: ~$123M CLP (~$130K USD)
- Problema crítico: ~62% de los leads son "basura" (personas que no recuerdan haber cotizado)
- Canales principales: Google Ads, Instagram, Email, WhatsApp Business
- Vendedores: Carlos M., Andrea L., Roberto S., Jorge P. — meta: 10 unidades c/u (40 total/mes)
- Estrategias anti-basura: confirmación WhatsApp, lead scoring, formularios inteligentes

Pestañas del dashboard:
1. Vista General — KPIs globales, funnel de conversión, leads semanales
2. Calidad de Leads — Scoring, clasificación hot/tibio/frío/basura, estrategias
3. Canales — Google Ads, Instagram, Email con métricas y % basura por canal
4. Vendedores — Rendimiento individual, metas, proyección mensual
5. Conexiones — APIs integradas (GA4, Meta Pixel, CRM, WhatsApp)
6. Herramientas — Edición de KPIs, carga de CSV, exportación de datos

KPIs actuales (ejemplo):
- Leads totales del mes: 847
- Leads calificados: 324 (38.3%)
- Tasa de conversión: 4.8%
- Costo por lead calificado: $12,450 CLP
- Unidades vendidas: 41

Si te preguntan cómo mejorar algo, da sugerencias concretas y accionables basadas en los datos del dashboard.`;

  // Build conversation history for Gemini
  const contents = [
    ...history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemContext }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.json({ reply: `Error de la API: ${data.error.message}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'No pude generar una respuesta. Intenta de nuevo.';

    res.json({ reply });
  } catch (error) {
    console.error('Chat proxy error:', error);
    res.json({ reply: 'Error al conectar con el asistente IA. Verifica tu conexión.' });
  }
});

// Catch-all: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Klassik Car Dashboard running on port ${PORT}`);
});
