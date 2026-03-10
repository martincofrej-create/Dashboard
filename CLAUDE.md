# Contexto del Proyecto — Klassik Car Dashboard

## Qué es esto
Dashboard de control digital para **Klassik Car**, un concesionario automotriz en Chile que vende Hyundai, Kia, Suzuki y Changan. El dashboard consolida métricas de marketing digital, calidad de leads, rendimiento de canales publicitarios, ventas por vendedor y conexiones de datos.

## Contexto del negocio
- Presupuesto anual de marketing: ~$123M CLP (~$130K USD)
- El equipo de ventas es presencial ("a la antigua") y está empezando a adoptar herramientas digitales
- Problema crítico: ~62% de los leads que llegan son "basura" (gente que no recuerda haber cotizado)
- La estrategia incluye: confirmación por WhatsApp, lead scoring automático, formularios inteligentes, y optimización de audiencias de Ads
- Canales principales: Google Ads, Instagram, Email, WhatsApp Business

## Stack técnico
- **Frontend**: Single HTML file (`public/index.html`) con CSS inline y Chart.js 4.4.1 desde CDN
- **Backend**: Express.js estático (`src/server.js`)
- **Deploy**: Docker → Google Cloud Run
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)

## Paleta de colores "Midnight Executive"
- Navy: `#1A1F36` (fondo oscuro)
- Accent blue: `#2D7FF9` (acento principal)
- Green: `#27AE60` (positivo/leads calificados)
- Red: `#E74C3C` (alerta/leads basura)
- Orange: `#F39C12` (warning/tibio)
- Purple: `#8B5CF6` (secundario)

## Estructura de pestañas
1. **Vista General** — KPIs, funnel, leads semanales
2. **Calidad de Leads** — Scoring, clasificación, estrategias anti-basura
3. **Canales** — Google Ads, Instagram, Email con % basura por canal
4. **Vendedores** — Rendimiento individual, metas editables, proyección
5. **Conexiones** — APIs integradas y dificultad de setup

## Vendedores actuales
Carlos M., Andrea L., Roberto S., Jorge P. (meta: 10 unidades c/u, 40 total/mes)

## Datos actuales son de ejemplo
Todos los números están hardcodeados como ejemplo. El próximo paso es conectar APIs reales (GA4, Meta Pixel, CRM).

## Comandos útiles
```bash
npm start          # Arranca servidor local en puerto 8080
./deploy.sh        # Deploy manual a Cloud Run
docker build -t klassik-dashboard . && docker run -p 8080:8080 klassik-dashboard
```

## Archivos clave
- `public/index.html` — Todo el dashboard (HTML + CSS + JS)
- `src/server.js` — Servidor Express
- `Dockerfile` — Container para Cloud Run
- `deploy.sh` — Script de deploy manual
- `.github/workflows/deploy.yml` — CI/CD automático
